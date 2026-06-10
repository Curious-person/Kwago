import { GoogleGenAI } from '@google/genai';
// Assuming you have GEMINI_API_KEY in your .env.local file.
// The SDK will automatically pick it up from process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({}); 

async function main() {
  try {
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.5-flash",
      contents: "Explain how AI works in detail",
    });

    for await (const chunk of responseStream) {
      process.stdout.write(chunk.text || "");
    }
  } catch (error) {
    console.error("Error running Gemini API:", error);
  }
}

main();
