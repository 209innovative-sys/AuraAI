import OpenAI from "openai";

// Vercel Serverless Function: POST /api/analyze
export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    // Mostly unnecessary on same-origin, but harmless
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const key = process.env.OPENAI_API_KEY;
    if (!key) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

    const { input } = (req.body || {});
    if (!input || typeof input !== "string") {
      return res.status(400).json({ error: "Missing 'input' string" });
    }

    const openai = new OpenAI({ apiKey: key });

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      max_tokens: 300,
      messages: [
        { role: "system", content: "You are AuraAI. Return a concise vibe analysis: tone, trust, manipulation, risk, empathy." },
        { role: "user", content: input.slice(0, 4000) }
      ]
    });

    const output = completion.choices?.[0]?.message?.content || "";
    return res.status(200).json({ output });
  } catch (e) {
    console.error("analyze error", e);
    return res.status(500).json({ error: "Analyze failed" });
  }
}
