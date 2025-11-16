const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export interface AnalysisRequestPayload {
  text?: string;
  title?: string;
  relationshipType?: string;
  /**
   * Array of base64-encoded screenshots (no data: prefix).
   */
  imageBase64?: string[];
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
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Failed to analyze conversation (${response.status}): ${text}`
    );
  }

  return response.json();
}
