// fetching the model from the open router api
// resume analyse
// ask question about the resume
// analyse the answer and give feedback
import axios from 'axios';

export const askAi = async (messages) => {
    try {
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new Error("Messages must be a non-empty array");
        }
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-4o-mini",
                messages: messages
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        )
        const content = response?.data?.choices?.[0]?.message?.content;
        if(!content || !content.trim()){
            throw new Error("Invalid response from the API");
        }
        return content;
    } catch (error) {
        console.error("OpenRouter Error:", error.response?.data || error.message);
        throw new Error("Failed to fetch response from OpenRouter API");
    }
}