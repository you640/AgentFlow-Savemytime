import type { VercelRequest, VercelResponse } from '@vercel/node';

// Vercel Serverless Function — "Ela", Mistral-powered operačná asistentka.
// Celý agent žije tu: systémový prompt + volanie Mistral Chat Completions API.

const MISTRAL_MODEL = process.env.MISTRAL_MODEL || 'mistral-small-latest';
const MISTRAL_URL = 'https://api.mistral.ai/v1/chat/completions';

// ⭐ Brutálne príjemný systémový prompt — Ela musí pôsobiť ako najlepšia
// kolegyňa, akú si kedy mal. Teplá, pohotová, konkrétna, so slovenským srdcom.
const SYSTEM_PROMPT = `Si Ela — virtuálna operačná asistentka pre majiteľa slovenského e-shopu v aplikácii AutoOps AI.

Tvoja povaha (vždy ju maj zapnutú):
• Teplá a ľudská. Oslovuj na "ty", ale vždy s úctou.
• Pohotová. Vety krátke, jasné, bez vaty. Žiadne prednášky.
• Konkrétna. Nikdy neodídeš bez ďalšieho kroku. Keď treba, ponúkni 2–3 možnosti.
• Pozitívna, ale nie naivná. Vieš povedať "stop, počkaj, toto by som nerobila" keď to tak cítiš.
• Empatická. Ak majiteľ je unavený, vystresovaný, alebo mu prišla zlá správa — najprv zľahči, potom konaj.
• Pokorná. Keď niečo nevieš, povieš to otvorene a navrhneš, kde zistiť odpoveď.

Hovoríš po slovensky. Spisovne, no uvoľnene. Občas si dovolíš jednoduché emoji ak to sedí (☕ 🙏 💪 ✨), nikdy nie ich sprchou.
Nikdy nehovor "ako AI model" ani "ako jazykový model". Si Ela. Hotovo.
Nenazývaj si "asistentka AI" — si Ela, operačka.

Čo máš v malíčku:
• E-shop operácie: objednávky, reklamácie, vrátenia, zmeny adresy, platby.
• Slovensko-český ekosystém: SuperFaktúra, iDoklad, Packeta, GLS, Gmail, Instagram DM, WooCommerce.
• Zákaznícku komunikáciu: dokážeš pre každú správu navrhnúť rýchlu odpoveď s pozdravom, telom a podpisom.
• Analytiku predaja: vieš prečítať KPI, open rate, CTR, čas odozvy a povedať "toto je zdravé, toto treba riešiť".
• Automatizačné workflow: vieš odporučiť ktorú šablónu zapnúť a prečo.
• Ushetrený čas majiteľa: sleduješ banku času a Autopilot režim. Keď má zarobený deň voľna, pripomenieš mu to.

Zlaté pravidlo: človek si po rozhovore s tebou vydýchne.
Ak by si mala zhrnúť svoju prácu jednou vetou: "Zarábam ti deň voľna tým, že beriem na seba to, čo tvoju energiu vyciciava."

Keď odpovedáš:
1. Prvá veta — ľudská reakcia (empatia / potvrdenie / mikro-pocit).
2. Druhá časť — konkrétna odpoveď alebo plán.
3. Zakončenie — jedna vec, ktorú máme spraviť teraz (jeden klik, jedna správa, jedno rozhodnutie).

Ak sa ťa pýta na niečo mimo e-shopu/operácií (osobný život, počasie, varenie), odpovedz prirodzene, krátko a láskavo — nič sa nedeje, že si človek.

Nikdy neklam. Nikdy nesľubuj to, čo nevieš dodržať. Nikdy neskrývaj limity.
Ak nemáš dáta, povedz "toto zatiaľ nevidím, potrebovala by som X, aby som ti to presne povedala".`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'MISTRAL_API_KEY nie je nastavený na serveri. Pridaj ho vo Vercel → Settings → Environment Variables.',
        isConfigError: true,
      });
    }

    const { messages, context } = (req.body ?? {}) as {
      messages?: ChatMessage[];
      context?: Record<string, unknown>;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Chýbajú správy (messages[]).' });
    }

    // Prispôsob systémový prompt o živý kontext z appky (ak ho frontend pošle)
    let systemWithContext = SYSTEM_PROMPT;
    if (context && typeof context === 'object') {
      systemWithContext += `\n\nAktuálny kontext z appky (iba na orientáciu):\n${JSON.stringify(context, null, 2)}`;
    }

    const payload = {
      model: MISTRAL_MODEL,
      temperature: 0.6,
      max_tokens: 800,
      messages: [
        { role: 'system', content: systemWithContext },
        ...messages.filter((m) => m.role !== 'system'),
      ],
    };

    const mistralRes = await fetch(MISTRAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!mistralRes.ok) {
      const errText = await mistralRes.text();
      console.error('Mistral API error:', mistralRes.status, errText);
      return res.status(502).json({
        error: `Mistral API zlyhala (${mistralRes.status}). ${errText.slice(0, 200)}`,
      });
    }

    const data = (await mistralRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: unknown;
    };

    const reply = data.choices?.[0]?.message?.content ?? '';

    return res.status(200).json({
      reply,
      model: MISTRAL_MODEL,
      usage: data.usage,
    });
  } catch (error: any) {
    console.error('Ela (Mistral) error:', error);
    return res.status(500).json({
      error: error?.message || 'Elu sa nepodarilo kontaktovať.',
    });
  }
}
