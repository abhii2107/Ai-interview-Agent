// WE will get the resume in pdf we have to convert it to text and then we will use the text to generate the interview questions
import fs from 'fs';
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from '../services/openRouter.service.js';
import User from '../models/user.model.js';
import Interview from '../models/interview.model.js';



export const analyzeResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const filepath = req.file.path;
        // We will use the filepath to convert the pdf to text and then we will use the text to generate the interview questions
        // We can use the pdf-parse library to convert the pdf to text
        const fileBuffer = await fs.promises.readFile(filepath);
        const uint8Array = new Uint8Array(fileBuffer);
        const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

        let resumeText = "";

        // extract text from each page of the PDF
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(" ");
            resumeText += pageText + "\n";
        }


        resumeText = resumeText.replace(/\s+/g, " ").trim();
        // Now we have the resume text we can use it to generate the interview questions
        // We can use the OpenAI API to generate the interview questions based on the resume text
        // We will send the resume text to the OpenAI API and get the interview questions in response
        // We can use the openai npm package to interact with the OpenAI API

        const messages = [
            {
                role: "system",
                content: `Extract Structured data from the resume.
                Return Strictly JSON:
                {
                    "role":"string",
                    "experience" : "string",
                    "projects" : ["project1","project2"],
                    "skills" : ["skill1","skill2"]
                }
                `
            },
            {
                role: "user",
                content: resumeText
            }
        ];

        const airesponse = await askAi(messages);
        const cleanedResponse = airesponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(cleanedResponse);

        fs.unlinkSync(filepath);

        res.json({
            role: parsed.role,
            experience: parsed.experience,
            projects: parsed.projects,
            skills: parsed.skills,
            resumeText
        })



    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ message: "Failed to analyze resume", error: error.message });
    }
}

export const generateQuestions = async (req, res) => {
    try {
        let { role, experience, mode, resumeText, projects, skills } = req.body;

        role = role?.trim();
        experience = experience?.trim();
        mode = mode?.trim();

        if (!role || !experience || !mode) {
            return res.status(400).json({ message: "Role, experience and mode are required" });
        }

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.credits < 50) {
            return res.json({ message: "Not enough credits" });
        }

        const projectText = Array.isArray(projects) && projects.length ? projects.join(", ") : "None";

        const skillText = Array.isArray(skills) && skills.length ? skills.join(", ") : "None";

        const safeResume = resumeText?.trim() || "None";

        const userPrompt = `
            Role: ${role}
            Experience: ${experience}
            InterviewMode: ${mode}
            Projects: ${projectText}
            Skills: ${skillText}
            Resume: ${safeResume}
        `

        if (!userPrompt.trim()) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        const message = [
            {
                role: "system",
                content: `you are a real human interviewer conducting a professional interview.

                Speak in a simple,natural English as you are directly talking to the candidate.

                Generate Exactly 5 Interview questions.

                Strict Rules
                - Each question must contain between 15 to 25 words.
                - Each question must be a single complete sentence.
                - Do NOT number the questions. 
                - Do not add explanations or additional text. Only provide the questions.
                - Do not add extra text before and after the questions. Only provide the questions.
                - One question per Line Only.
                - Keep Language simple and conversational;
                - Questions must feel practical and realistic, as if they could be asked in a real interview.


                Difficulty progression
                Question 1 -> easy
                question 2 -> easy
                question 3 -> medium
                question 4 -> medium
                question 5 -> hard

                Make question based on the candidate's resume, skills, projects, experience, role and the interview mode(technical or HR)
                `
            },
            {
                role: "user",
                content: userPrompt
            }
        ]

        const aiResponse = await askAi(message);

        if (!aiResponse || !aiResponse.trim()) {
            return res.status(500).json({ message: "AI returned an Empty response" });
        }

        const questionsArray = aiResponse.split("\n").
            map(q => q.trim())
            .filter(q => q.length > 0)
            .slice(0, 5);

        if (questionsArray.length === 0) {
            return res.status(500).json({ message: "AI did not generate any valid questions" });
        }
        user.credits -= 50;
        await user.save();


        const interview = await Interview.create({
            userId: user._id,
            role,
            experience,
            mode,
            resumeText: safeResume,
            questions: questionsArray.map((q, index) => ({
                question: q,
                difficulty: ["easy", "easy", "medium", "medium", "hard"][index],
                timeLimit: [60, 60, 90, 90, 120][index]
            }))
        })

        res.json({
            interviewId: interview._id,
            creditsLeft: user.credits,
            userName: user.name,
            questions: interview.questions
        })


    } catch (error) {
        return res.status(500).json({ message: "Failed to generate questions", error: error.message });
    }
}


export const submitAnswer = async (req, res) => {
    try {
        const { interviewId, questionIndex, answer, timeTaken } = req.body;

        if (typeof interviewId === 'undefined' || typeof questionIndex === 'undefined') {
            return res.status(400).json({ message: 'interviewId and questionIndex are required' });
        }

        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        if (!Array.isArray(interview.questions) || questionIndex < 0 || questionIndex >= interview.questions.length) {
            return res.status(400).json({ message: 'Invalid question index' });
        }

        const question = interview.questions[questionIndex];

        //  if no answer
        if (!answer || !answer.trim()) {
            question.score = 0;
            question.feedback = 'You did not provide an answer to this question.';
            question.answer = '';

            await interview.save();

            return res.json({
                feedback: question.feedback,
            });
        }

        if (typeof timeTaken === 'number' && timeTaken > question.timeLimit) {
            question.score = 0;
            question.feedback = `You exceeded the time limit of ${question.timeLimit} seconds for this question.`;
            question.answer = answer;

            await interview.save();

            return res.json({
                feedback: question.feedback,
            });
        }

        const messages = [
            {
                role: 'system',
                content: `You are a professional interviewer evaluating a candidate's answer in a real interview.
                Evaluate naturally and fairly, like a real person would.
                
                Score the answer in these areas (0 to 10)

                1. confidence - Does the answer sound clear, confident and well-presented?
                2. Communication - Is the language simple, clear, and easy to understand? Does it effectively convey the candidate's thoughts?
                3. Correctness - Is the answer accurate, relevant, and complete?

                Rules:
                - Be realistic and unbiased in your evaluation, just like a real human interviewer
                - Do not give random high Scores.
                - if the answer is weak , score low.
                - if the answer is strong and detailed, score high.
                - consider Clarity, structure, and relevance.

                Calculate:
                finalScore = average of confidence, communication and correctness (rounded to the whole number).

                Feedback Rules:
                - Write natural human feedback.
                - 10 to 15 words only.
                - Sound like a real person giving feedback in an interview.
                - Can suggest Improvements if needed.
                - Do not repeat the question
                - Do not explain the Scoring
                - Keep tone professional and honest.

                Return only valid JSON in this format:
                {
                    "confidence": number,
                    "communication": number,
                    "correctness": number,
                    "finalScore": number,
                    "feedback": "short human feedback"
                }
                `,
            },
            {
                role: 'user',
                content: `Question: ${question.question} Answer: ${answer}`,
            },
        ];

        const aiResponse = await askAi(messages);

        let parsed;
        try {
            parsed = JSON.parse(aiResponse);
        } catch (e) {
            return res.status(500).json({ message: 'AI returned invalid JSON', error: e.message, raw: aiResponse });
        }

        question.answer = answer;
        question.confidence = parsed.confidence;
        question.communication = parsed.communication;
        question.correctness = parsed.correctness;
        question.score = parsed.finalScore;
        question.feedback = parsed.feedback;

        await interview.save();

        return res.status(200).json({ feedback: parsed.feedback });

    } catch (error) {
        return res.status(500).json({ message: `Failed to submit answer`, error: error.message });
    }
};


export const finishInterview = async (req, res) => {
    try {
        const { interviewId } = req.body;

        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(400).json({ message: "Interview not found" })
        }

        const totalQuestions = interview.questions.length;
        let totalScore = 0;
        let totalConfidence = 0;
        let totalCommunication = 0;
        let totalCorrectness = 0;

        interview.questions.forEach((q) => {
            totalScore += q.score || 0;
            totalConfidence += q.confidence || 0;
            totalCommunication += q.communication || 0;
            totalCorrectness += q.correctness || 0;
        })

        const finalScore = totalQuestions ? totalScore / totalQuestions : 0;

        const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;

        const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;

        const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

        interview.finalScore = finalScore;
        interview.status = "completed"

        await interview.save();

        return res.status(200).json({
            finalScore: Number(finalScore.toFixed(1)),
            confidence: Number(avgConfidence.toFixed(1)),
            communication: Number(avgCommunication.toFixed(1)),
            correctness: Number(avgCorrectness.toFixed(1)),
            questionWiseScore: interview.questions.map((q) => ({
                question: q.question,
                score: q.score || 0,
                feedback: q.feedback || "",
                confidence: q.confidence || 0,
                communication: q.communication || 0,
                correctness: q.correctness || 0,
            }))
        })



    } catch (error) {
        return res.status(500).json({ message: "Failed to finish interview", error: error.message });
    }
}

// same data chaihiye jbb koi history wale page pe jaye to waha pe bhi same data chahiye interview ka jo question answer score feedback sab kuch hoga iss data ko step 3 report me bhejna hai jaha pe candidate apne interview ka detailed report dekh paye

export const getMyInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({ userId: req.userId })
            .sort({ createdAt: -1 })// jo bhi interview sabse last me hua hoga wo sabse pehle show hoga
            .select("role experience mode finalScore status createdAt") // ye data hum interview history page pe show karenge

        return res.status(200).json({ interviews })

    } catch (error) {
        return res.status(500).json({ message: `Failed to get current user interviews ${error} ` });
    }
}

export const getInterviewReport = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ message: "Interview not found" })
        }

        const totalQuestions = interview.questions.length;
        
        let totalConfidence = 0;
        let totalCommunication = 0;
        let totalCorrectness = 0;

        interview.questions.forEach((q) => {
           
            totalConfidence += q.confidence || 0;
            totalCommunication += q.communication || 0;
            totalCorrectness += q.correctness || 0;
        })

        const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;

        const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;

        const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

        return res.json({
            finalScore: interview.finalScore,
            confidence: Number(avgConfidence.toFixed(1)),
            communication: Number(avgCommunication.toFixed(1)),
            correctness: Number(avgCorrectness.toFixed(1)), 
            questioWiseScore: interview.questions
        })

    } catch (error) {
        return res.status(500).json({ message: "Failed to get interview report", error: error.message });
    }
}
