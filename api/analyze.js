import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const { text } = req.body || {};
    if (!text) return res.status(400).json({ error: "Missing text" });

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are AuraAI — an emotional intelligence analyzer specializing in romantic intent."
        },
        {
          role: "user",
          content: `Analyze this message for romantic emotional tone: "${text}"`
        }
      ],
    });

    const result = response.choices?.[0]?.message?.content || "";
    return res.status(200).json({ result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
