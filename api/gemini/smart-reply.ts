import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

// Vercel Serverless Function — nahrádza pôvodný Express endpoint zo server.ts.
// Lenivá inicializácia Gemini klienta: ak chýba kľúč, vráti hneď čistú chybu.

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'autoops-ai-vercel' } },
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Explicitne vráť 405 s telom (nie prázdna odpoveď), aby frontend nespadol na JSON.parse
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { sender, subject, message, tone } = (req.body ?? {}) as {
      sender?: string;
      subject?: string;
      message?: string;
      tone?: string;
    };

    if (!sender || !message) {
      return res.status(400).json({ error: 'Chýbajú povinné polia: sender a message.' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are an expert e-commerce virtual support assistant.
Your goal is to help e-shop staff generate 3 distinct, context-aware and helpful reply suggestions in Slovak language.
Each option should match the requested tone: "${tone || 'profesionálny'}" (Slovak translation of professional, friendly, brief, apologetic, etc.).
Ensure you refer to any specific details mentioned in the sender's message (such as order numbers like #1233 or #990, shipping issues, or product sizes).
Format the body with greeting, polite spacing, and a clean signature. No placeholder braces like {{}}.`;

    const prompt = `Draft 3 smart replies to this message:
Sender Name: ${sender}
Original Subject: ${subject || 'Bez predmetu'}
Message Content: "${message}"

Selected Response Tone: ${tone || 'profesionálny'} (Draft in Slovak)`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  strategy: { type: Type.STRING, description: 'Krátky názov stratégie, max 30 znakov.' },
                  subject: { type: Type.STRING, description: 'Vhodný predmet so zahrnutím pôvodného predmetu/čísla objednávky.' },
                  body: { type: Type.STRING, description: 'Kompletné telo e-mailu v slovenčine s pozdravom a podpisom.' },
                },
                required: ['strategy', 'subject', 'body'],
              },
            },
          },
          required: ['replies'],
        },
      },
    });

    const text = response.text || '{}';
    const data = JSON.parse(text);
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Gemini smart-reply error:', error);
    return res.status(500).json({
      error: error?.message || 'Nepodarilo sa vygenerovať inteligentné odpovede.',
      isConfigError: !process.env.GEMINI_API_KEY,
    });
  }
}
