import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function getEmbedding(text) {
  try {
    console.log("🔥 USING GEMINI EMBEDDING MODEL");

    const model = genAI.getGenerativeModel({
      model: "gemini-embedding-001",
    });
    const result = await model.embedContent(text);

    console.log("👉 Embedding length:", result.embedding.values.length);

    return result.embedding.values;
  } catch (err) {
    console.error("Embedding error", err);
    throw err;
  }
}
