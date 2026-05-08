// WE will get the resume in pdf we have to convert it to text and then we will use the text to generate the interview questions
import fs from 'fs';
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from '../services/openRouter.service.js';
import User from '../models/User.model.js';



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
        const { role, experience, mode, resumeText, projects, skills } = req.body;

        role = role?.trim();
        experience = experience?.trim();
        mode = mode?.trim();

        if (!role || !experience || !mode) {
            return res.status(400).json({ message: "Role, experience and mode are required" });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.credits < 50) {
            return res.json({ message: "Not enough credits" });
        }

        const projectText = Array.isArray(projects) && projects.length ? projects.jsoin(", ") : "None";

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
            }
        ]

        const aiResponse = await askAi(message);

        if(!aiResponse || !aiResponse.trim()){
            return res.status(500).json({ message: "AI returned an Empty response" });
        }

        const questionsArray = aiResponse.split("\n").
        map(q => q.trim())
        .filter(q => q.length > 0)
        .slice(0,5);
        
        if(questionsArray.length === 0){
             return res.status(500).json({ message: "AI did not generate any valid questions" });
        }
        user.credits -= 50;
        await user.save();


    } catch (error) {
        return res.status(500).json({ message: "Failed to generate questions", error: error.message });
    }
}