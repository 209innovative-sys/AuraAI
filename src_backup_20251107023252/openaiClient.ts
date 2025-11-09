import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const runFreeAnalysis = async (input: string) => {
  if (input.length > 1500) {
    input = input.slice(0, 1500);
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    max_tokens: 250,
    messages: [
      {
        role: 'system',
        content:
          'You are AuraAI Free: provide a short emotional tone check (3-5 bullet points).'
      },
      { role: 'user', content: input }
    ]
  });

  return completion.choices[0]?.message?.content || '';
};

export const runProAnalysis = async (input: string) => {
  if (input.length > 8000) {
    input = input.slice(0, 8000);
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4.1',
    max_tokens: 800,
    messages: [
      {
        role: 'system',
        content:
          'You are AuraAI Pro: perform a deep psychological and emotional analysis of this conversation, with structured sections and clear insights.'
      },
      { role: 'user', content: input }
    ]
  });

  return completion.choices[0]?.message?.content || '';
};
