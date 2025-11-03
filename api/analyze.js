const OpenAI = require("openai");

module.exports = async (req, res) => {
  try {
    let bodyData = "";

    req.on("data", chunk => {
      bodyData += chunk.toString();
    });

    req.on("end", async () => {
      const parsed = JSON.parse(bodyData || "{}");
      const text = parsed.text;

      if (!text) {
        return res.status(400).json({ error: "Missing text" });
      }

      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });

      const prompt = \Analyze the romantic emotional tone in this message: "\"
Return the emotional meaning, vibe, and intent behind the message using a conversational tone with romantic emojis.\;

      const out = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an AI emotional vibe interpreter focused on romantic energy." },
          { role: "user", content: prompt }
        ]
      });

      res.status(200).json({
        result: out.choices?.[0]?.message?.content || ""
      });
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
