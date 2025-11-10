import express from "express";
import cors from "cors";
import "dotenv/config";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Simple health check for your own sanity
app.get("/", (req, res) => {
  res.json({ ok: true, service: "AuraAI backend", status: "running" });
});

// Init OpenAI client using your server-side key
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Main endpoint your frontend calls
app.post("/analyze", async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "No text provided" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that analyzes the emotional tone, vibe, and intent of user text. Respond with a short, clear analysis.",
        },
        { role: "user", content: text },
      ],
      max_tokens: 200,
    });

    const analysis = completion.choices?.[0]?.message?.content || "";

    res.json({
      ok: true,
      analysis,
    });
  } catch (err) {
    console.error("Error in /analyze:", err);
    res.status(500).json({
      error: "Server error",
      detail: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`AuraAI backend running on port ${PORT}`);
});
