import { GoogleGenAI, Type } from "@google/genai";
import { PriorityLevel } from "../types";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const suggestTasks = async (domain: string, goal: string): Promise<{ text: string; priority: PriorityLevel }[]> => {
  const ai = getAI();
  if (!ai) {
    console.warn("API Key missing");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `I am organizing my "${domain}". My current focus or goal is: "${goal}".
      Please generate 4 specific, actionable tasks to help me achieve this.
      Assign exactly one task to each of these priority levels:
      1. MUST (Critical, immediate deadline)
      2. SHOULD (Important but not vital immediately)
      3. COULD (Nice to have, beneficial)
      4. WOULD (Wishlist, low priority)
      
      Return only valid JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING, description: "The task description" },
              priority: { 
                type: Type.STRING, 
                enum: ["MUST", "SHOULD", "COULD", "WOULD"],
                description: "The priority level"
              }
            },
            required: ["text", "priority"]
          }
        }
      }
    });

    const rawText = response.text;
    if (!rawText) return [];
    
    return JSON.parse(rawText);
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const getReflection = async (healthData: any): Promise<string> => {
  const ai = getAI();
  if (!ai) return "Stay hydrated and rest well.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on this health data, give me a short, 1-sentence encouraging reflection or tip: ${JSON.stringify(healthData)}`
    });
    return response.text || "Balance is key to a healthy life.";
  } catch (e) {
    return "Take a moment to breathe deeply.";
  }
};