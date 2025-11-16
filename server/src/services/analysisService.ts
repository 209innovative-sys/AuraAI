export interface VibeAnalysis {
  summaryText: string;
  overallVibe: string;
  vibeScore: number;
  insights: string[];
  suggestions: string[];
}

function basicHeuristicAnalysis(
  text: string,
  title?: string,
  relationshipType?: string
): VibeAnalysis {
  const lower = (text || "").toLowerCase();

  let vibeScore = 50;
  let overallVibe: string = "mixed";

  if (lower.includes("love") || lower.includes("excited") || lower.includes("grateful")) {
    vibeScore += 15;
    overallVibe = "positive";
  }

  if (lower.includes("angry") || lower.includes("mad") || lower.includes("furious")) {
    vibeScore += 20;
    overallVibe = "tense";
  }

  if (lower.includes("sad") || lower.includes("hopeless") || lower.includes("depressed")) {
    vibeScore += 15;
    overallVibe = "heavy";
  }

  if (lower.includes("calm") || lower.includes("peaceful")) {
    vibeScore -= 10;
    overallVibe = "calm";
  }

  if (vibeScore < 0) vibeScore = 0;
  if (vibeScore > 100) vibeScore = 100;

  const contextSnippet =
    title || relationshipType
      ? `Title: ${title ?? "Untitled"}, Relationship: ${relationshipType ?? "unspecified"}`
      : "unspecified";

  const summaryText = `Quick heuristic analysis for conversation (${contextSnippet}).`;

  return {
    summaryText,
    overallVibe,
    vibeScore,
    insights: [
      "This result is based on a simple keyword scan because the AI analysis was unavailable.",
      "Once the OpenAI integration is working, this will be replaced by a deeper emotional analysis."
    ],
    suggestions: [
      "Consider how often the conversation loops around the same conflict or need.",
      "If the tone feels tense, taking a short break before replying can reduce escalation."
    ]
  };
}

export async function analyzeConversation(
  text: string,
  title?: string,
  relationshipType?: string
): Promise<VibeAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("OPENAI_API_KEY not set. Using heuristic analysis only.");
    return basicHeuristicAnalysis(text, title, relationshipType);
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  const systemPrompt =
    "You are AuraAI, an expert relationship and emotional-intelligence analyst. " +
    "You read a conversation snippet and return a JSON object with fields: " +
    "summaryText (string), overallVibe (string), vibeScore (0-100 number), " +
    "insights (array of strings), suggestions (array of strings). " +
    "Respond ONLY with valid JSON, no extra commentary, no markdown.";

  const userPrompt =
    `Conversation text:\n${text}\n\n` +
    `Title: ${title ?? "Untitled"}\n` +
    `Relationship type: ${relationshipType ?? "unspecified"}\n\n` +
    "Return the vibe analysis JSON now.";

  const fetchFn = (globalThis as any).fetch as typeof fetch | undefined;
  if (!fetchFn) {
    console.error("global fetch is not available, falling back to heuristic.");
    return basicHeuristicAnalysis(text, title, relationshipType);
  }

  try {
    const response = await fetchFn("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("OpenAI HTTP error", response.status, errBody);
      return basicHeuristicAnalysis(text, title, relationshipType);
    }

    const data: any = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent || typeof rawContent !== "string") {
      console.error("Unexpected OpenAI response content", rawContent);
      return basicHeuristicAnalysis(text, title, relationshipType);
    }

    // Try to strip ```json fences if the model returns them
    const jsonMatch = rawContent.match(/```json\s*([\s\S]*?)```/i);
    const jsonText = jsonMatch ? jsonMatch[1].trim() : rawContent.trim();

    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch (parseErr) {
      console.error(
        "Failed to parse AI JSON, falling back to heuristic. Raw content:",
        rawContent,
        parseErr
      );
      return basicHeuristicAnalysis(text, title, relationshipType);
    }

    const result: VibeAnalysis = {
      summaryText: String(parsed.summaryText ?? ""),
      overallVibe: String(parsed.overallVibe ?? "mixed"),
      vibeScore: Number(parsed.vibeScore ?? 50),
      insights: Array.isArray(parsed.insights)
        ? parsed.insights.map((x: any) => String(x))
        : [],
      suggestions: Array.isArray(parsed.suggestions)
        ? parsed.suggestions.map((x: any) => String(x))
        : []
    };

    return result;
  } catch (err) {
    console.error("OpenAI error in analyzeConversation, falling back to heuristic:", err);
    return basicHeuristicAnalysis(text, title, relationshipType);
  }
}

export default analyzeConversation;
