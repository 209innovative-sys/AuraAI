import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY for analyze endpoint");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function analyzeText(input: string): Promise<string> {
  if (!input || typeof input !== "string") {
    throw new Error("Invalid input");
  }
  // keep it cheap + fast
  if (input.length > 4000) input = input.slice(0, 4000);

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    max_tokens: 300,
    messages: [
      { role: "system", content: "You are AuraAI: provide a concise vibe analysis with 3–6 bullet points (tone, risk, manipulation, trust, empathy)." },
      { role: "user", content: input }
    ]
  });

  return completion.choices[0]?.message?.content || "";
}
