import OpenAI from 'openai';
export default async function handler(req, res) {
  const { text } = req.body;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const out = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role:'user', content:Analyze this:  }]
  });
  res.status(200).json({ result: out.choices[0].message.content });
}
