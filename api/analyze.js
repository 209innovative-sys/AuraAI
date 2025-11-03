import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ error: "Missing text" });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `Analyze the emotional romantic tone in this message: "${text}"
Return the vibe, intent, confidence & emojis.`;

    const out = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a romantic vibe analyzer." },
        { role: "user", content: prompt }
      ]
    });

    res.status(200).json({ result: out.choices?.[0]?.message?.content || "" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
