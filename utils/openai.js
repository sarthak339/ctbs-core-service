const { GoogleGenerativeAI } = require("@google/generative-ai");
const API_KEY = process.env.GENERATIVE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

module.exports = {
    model : model,
} 



