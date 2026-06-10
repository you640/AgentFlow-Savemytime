import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy reference or utility for GoogleGenAI client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing. Please add it in the Settings > Secrets menu.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Smart Reply generation endpoint
app.post("/api/gemini/smart-reply", async (req, res) => {
  try {
    const { sender, subject, message, tone } = req.body;

    if (!sender || !message) {
      return res.status(400).json({ error: "Missing required fields: sender and message." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are an expert e-commerce virtual support assistant. 
Your goal is to helper e-shop staff generate 3 distinct, context-aware and helpful reply suggestions in Slovak language.
Each option should match the requested tone: "${tone || 'profesionálny'}" (Slovak translation of professional, friendly, brief, apologetic, etc.).
Ensure you refer to any specific details mentioned in the sender's message (such as order numbers like #1233 or #990, shipping issues, or product sizes).
Format your suggested body with greeting, polite spacing, and clean signature at the bottom. Exclude placeholder braces like {{}} in the suggestion so it's ready to use.`;

    const prompt = `Draft 3 smart replies to this message:
Sender Name: ${sender}
Original Subject: ${subject || 'Bez predmetu'}
Message Content: "${message}"

Selected Response Tone: ${tone || 'profesionálny'} (Draft in Slovak)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  strategy: { 
                    type: Type.STRING, 
                    description: "Stručný názov alebo prístup odpovede (napriklad 'Vyriešenie s ospravedlnením', 'Ponuka kompenzácie', 'Doplnenie informácií'). Max 30 znakov." 
                  },
                  subject: { 
                    type: Type.STRING, 
                    description: "Vhodný predmet odpovede so zahrnutím pôvodného premetu alebo čísla objednávky." 
                  },
                  body: { 
                    type: Type.STRING, 
                    description: "Kompletné telo e-mailu/správy v slovenčine s pozdravom a podpisom." 
                  }
                },
                required: ["strategy", "subject", "body"]
              }
            }
          },
          required: ["replies"]
        }
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error("Gemini smart-reply error:", error);
    res.status(500).json({ 
      error: error.message || "Nepodarilo sa vygenerovať inteligentné odpovede.",
      isConfigError: !process.env.GEMINI_API_KEY
    });
  }
});

// Configure Vite or Static Assets based on environment
async function setupFrontend() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupFrontend().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
