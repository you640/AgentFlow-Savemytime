import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

// Vercel Serverless Function — generuje 3 návrhy odpovedí pre e-shop operátora.
// Hlavný motor: Gemini (najlepšia podpora JSON schema).
// Backup: Mistral (ak Gemini preťažený / nedostupný) — "Ela" prevezme aj toto.

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured on the server.');
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'autoops-ai-vercel' } },
  });
};

const SYS = (tone: string) => `You are an expert e-commerce virtual support assistant.
Help e-shop staff generate 3 distinct, context-aware reply suggestions in Slovak.
Match this tone: "${tone}" (translation of professional, friendly, brief, apologetic...).
Refer to specific details from the sender's message (order numbers like #1233, shipping issues, product sizes).
Format body with greeting, polite spacing and clean signature. No placeholder braces.`;

const userPrompt = (sender: string, subject: string | undefined, message: string, tone: string) =>
  `Draft 3 smart replies to this message:
Sender Name: ${sender}
Original Subject: ${subject || 'Bez predmetu'}
Message Content: "${message}"

Selected Response Tone: ${tone} (Draft in Slovak)`;

interface SmartReplies {
  replies: Array<{ strategy: string; subject: string; body: string }>;
}

// --- Backup cez Mistral: vráti zhodný tvar JSON-u ako Gemini ---
async function tryMistral(sender: string, subject: string | undefined, message: string, tone: string): Promise<SmartReplies | null> {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) return null;

  const instruction = `${SYS(tone)}\n\nReturn STRICT JSON only, no prose. Shape: {"replies":[{"strategy":"...", "subject":"...", "body":"..."}, ...]} with exactly 3 items.`;
  const body = {
    model: process.env.MISTRAL_MODEL || 'mistral-small-latest',
    temperature: 0.7,
    max_tokens: 900,
    response_format: { type: 'json_object' as const },
    messages: [
      { role: 'system', content: instruction },
      { role: 'user', content: userPrompt(sender, subject, message, tone) },
    ],
  };
  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as any;
  const text = data?.choices?.[0]?.message?.content || '{}';
  try {
    const parsed = JSON.parse(text) as SmartReplies;
    if (parsed?.replies && Array.isArray(parsed.replies)) return parsed;
    return null;
  } catch {
    return null;
  }
}

// --- Primárne cez Gemini ---
async function tryGemini(sender: string, subject: string | undefined, message: string, tone: string): Promise<SmartReplies | null> {
  const ai = getGeminiClient();
  const models = ['gemini-3.8-flash-lite', 'gemini-3.8-flash'];
  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: userPrompt(sender, subject, message, tone),
        config: {
          systemInstruction: SYS(tone),
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
                    subject: { type: Type.STRING, description: 'Vhodný predmet vrátane pôvodného predmetu/čísla objednávky.' },
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
      const parsed = JSON.parse(text) as SmartReplies;
      if (parsed?.replies && Array.isArray(parsed.replies)) return parsed;
    } catch (err: any) {
      const msg = String(err?.message || err);
      // 503/UNAVAILABLE/429 → skúsime ďalší model, inak vzdáme sa
      if (!/503|UNAVAILABLE|high demand|overloaded|429|rate/i.test(msg)) throw err;
      // else: continue to next model
    }
  }
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    const toneOrDefault = tone || 'profesionálny';

    // 1) Primárne — Gemini
    let data = await tryGemini(sender, subject, message, toneOrDefault);
    let source: 'gemini' | 'mistral' = 'gemini';

    // 2) Fallback — Mistral (Ela to ustráži)
    if (!data) {
      data = await tryMistral(sender, subject, message, toneOrDefault);
      source = 'mistral';
    }

    if (!data) {
      return res.status(503).json({
        error: 'Obaja agenti (Gemini aj Ela/Mistral) sú teraz preťažení. Skús to za chvíľu.',
      });
    }

    return res.status(200).json({ ...data, source });
  } catch (error: any) {
    console.error('smart-reply error:', error);
    return res.status(500).json({
      error: error?.message || 'Nepodarilo sa vygenerovať inteligentné odpovede.',
      isConfigError: !process.env.GEMINI_API_KEY,
    });
  }
}
