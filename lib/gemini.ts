
import { GoogleGenAI } from "@google/genai"; 

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// calls gemini api to get response
export async function getGeminiResponse(prompt: string): Promise<string> {
  if (!prompt || prompt.trim() === '') {
    return "I can't generate a response for an empty query. Please provide some text.";
  }

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ text: prompt }],
    });


    if (result && result.text) { // Check if 'result' and 'result.text' property exist
      return result.text; 
    } else {
      console.error("Gemini API response or text property was undefined/null:", result);
      return "I encountered an issue getting a text response from the AI. Please try again.";
    }
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    return `An error occurred: ${error.message || "Unknown error"}.`;
  }
}