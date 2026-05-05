// WE will get the resume in pdf we have to convert it to text and then we will use the text to generate the interview questions
import fs from 'fs';
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from '../services/openRouter.service.js';



export const analyzeResume = (req,res) => {
    try {
        if(!req.file){
            return res.status(400).json({message:"No file uploaded"});
        }
        const filepath = req.file.path;
        // We will use the filepath to convert the pdf to text and then we will use the text to generate the interview questions
        // We can use the pdf-parse library to convert the pdf to text
        const fileBuffer = await fs.promises.readFile(filepath);
        const uint8Array = new Uint8Array(fileBuffer);
        const pdf = await pdfjsLib.getDocument({data:uint8Array}).promise;

        let resumeText = "";

        // extract text from each page of the PDF
        for(let pageNum = 1; pageNum <= pdf.numPages; pageNum++){
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
                role : "user",
                content : resumeText
            }
        ];

        const airesponse = await askAi (messages);

        const parsed = JSON.parse(airesponse);

        fs.unlinkSync(filepath);

        res.json({
            role: parsed.role,
            experience: parsed.experience,
            projects: parsed.projects,
            skills: parsed.skills,
            resumeText
        })



    } catch (error) {
        if(req.file && fs.existsSync(req.file.path)){
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({message:"Failed to analyze resume", error: error.message});
    }
}