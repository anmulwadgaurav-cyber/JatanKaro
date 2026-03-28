import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function generateTags(text) {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `
     Generate 3 short, relevant tags for the following content.
    Return ONLY comma-separated tags.

    Content:${text}
    `,
    });

    const output = response.text;

    return output
      .split(",")
      .map((tag) => tag.trim().toLowerCase)
      .filter(Boolean);
  } catch (error) {
    console.error("Error generating tags:", error);
    return [];
  }
}
