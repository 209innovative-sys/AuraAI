import React from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { VibeGauge } from "../components/VibeGauge";
import type { AnalysisResponse } from "../api/apiClient";

interface LocationState {
  result?: AnalysisResponse;
  title?: string;
  relationshipType?: string;
}

export const AnalysisDetailPage: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const data: {
    title: string;
    date: string;
    relationshipType: string;
    summaryText: string;
    overallVibe: string;
    vibeScore: number;
    insights: string[];
    suggestions: string[];
  } = state.result
    ? {
        title: state.title || "Conversation",
        date: new Date().toISOString().slice(0, 10),
        relationshipType: state.relationshipType || "unspecified",
        summaryText: state.result.summaryText,
        overallVibe: state.result.overallVibe,
        vibeScore: state.result.vibeScore,
        insights: state.result.insights || [],
        suggestions: state.result.suggestions || []
      }
    : {
        title: "Demo conversation",
        date: "2025-11-16",
        relationshipType: "Partner",
        summaryText:
          "This is a demo analysis. Run a new analysis to see real AI-powered results for your conversation.",
        overallVibe: "mixed",
        vibeScore: 50,
        insights: [
          "Messages show a mix of care and tension.",
          "Some topics repeat without clear resolution."
        ],
        suggestions: [
          "Clarify expectations in a calm moment, not during a heated exchange.",
          "Ask open questions instead of assuming intent."
        ]
      };

  return (
    <Layout>
      <div className="aura-card space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="aura-heading">{data.title}</h1>
            <p className="text-xs text-slate-400">
              {data.relationshipType} • {data.date} • ID: {id ?? "demo"}
            </p>
          </div>
          <Link to="/" className="aura-button-secondary text-xs">
            Back
          </Link>
        </div>

        <VibeGauge score={data.vibeScore} />

        <section className="space-y-1">
          <h2 className="aura-subheading">Summary</h2>
          <p className="text-sm text-slate-200">{data.summaryText}</p>
        </section>

        <section className="space-y-1">
          <h2 className="aura-subheading">Key insights</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-200">
            {data.insights.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-1">
          <h2 className="aura-subheading">Suggested reflections</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-200">
            {data.suggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </section>
      </div>
    </Layout>
  );
};
