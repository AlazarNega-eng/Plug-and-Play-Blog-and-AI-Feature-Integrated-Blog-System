import { GoogleGenAI } from "@google/genai";

let ai = null;

// Initialize AI only if API key is available
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ apikey: process.env.GEMINI_API_KEY });
  } catch (error) {
    console.log('Gemini AI initialization failed:', error.message);
  }
}

async function main(prompt) {
  if (!ai) {
    throw new Error('Gemini API key not configured or invalid');
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Gemini API error:', error.message);
    throw error;
  }
}

export default main;