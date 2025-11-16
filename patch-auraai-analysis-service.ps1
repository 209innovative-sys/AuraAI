param(
    [string]$RootPath = (Get-Location).Path
)

Write-Host "Using root path: $RootPath"

$serviceDir = Join-Path $RootPath "server\src\services"
$filePath   = Join-Path $serviceDir "analysisService.ts"

if (-not (Test-Path $serviceDir)) {
    Write-Host "Creating services directory at $serviceDir ..."
    New-Item -ItemType Directory -Path $serviceDir -Force | Out-Null
}

$ts = @"
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
  let overallVibe = "mixed";

  if (lower.includes("love") || lower.includes("excited") || lower.includes("grateful")) {
    vibeScore += 20;
  }
  if (lower.includes("angry") || lower.includes("mad") || lower.includes("furious")) {
    vibeScore += 25;
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
      ? \`Title: \${title ?? "Untitled"}, Relationship: \${relationshipType ?? "unspecified"}\`
      : "unspecified";

  const summaryText = \`Quick heuristic analysis for conversation (\${contextSnippet}).\`;

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
    \`Conversation text:\n\${text}\n\n\` +
    \`Title: \${title ?? "Untitled"}\n\` +
    \`Relationship type: \${relationshipType ?? "unspecified"}\n\n\` +
    "Return the vibe analysis JSON now.";

  // Use global fetch (Node 18+)
  const fetchFn: any = (globalThis as any).fetch;

  if (!fetchFn) {
    console.error("global fetch is not available, falling back to heuristic.");
    return basicHeuristicAnalysis(text, title, relationshipType);
  }

  try {
    const response = await fetchFn("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${apiKey}\`,
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

    try {
      const parsed = JSON.parse(rawContent);

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
    } catch (parseErr) {
      console.error(
        "Failed to parse AI JSON, falling back to heuristic. Raw content:",
        rawContent,
        parseErr
      );
      return basicHeuristicAnalysis(text, title, relationshipType);
    }
  } catch (err) {
    console.error("OpenAI error in analyzeConversation, falling back to heuristic:", err);
    return basicHeuristicAnalysis(text, title, relationshipType);
  }
}

export default analyzeConversation;
"@

Set-Content -Path $filePath -Value $ts -Encoding UTF8

Write-Host "Wrote $filePath with OpenAI-powered analyzeConversation (heuristic fallback retained)."
