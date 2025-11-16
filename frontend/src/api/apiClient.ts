const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export interface AnalysisRequestPayload {
  text: string;
  title?: string;
  relationshipType?: string;
}

export interface AnalysisResponse {
  summaryText: string;
  overallVibe: string;
  vibeScore: number;
  insights: string[];
  suggestions: string[];
}

export async function analyzeConversation(
  payload: AnalysisRequestPayload
): Promise<AnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const rawText = await response.text();

  if (!response.ok) {
    // This makes the error show nicely in the browser console
    throw new Error(`Failed to analyze conversation (${response.status}): ${rawText}`);
  }

  try {
    return JSON.parse(rawText);
  } catch {
    throw new Error("Server returned invalid JSON from /analyze");
  }
}
