import React from "react";

interface VibeGaugeProps {
  score: number; // 0 (calm) to 100 (tense)
}

export const VibeGauge: React.FC<VibeGaugeProps> = ({ score }) => {
  const clamped = Math.max(0, Math.min(100, score));
  let label = "Mixed";
  if (clamped <= 33) label = "Calm / Warm";
  else if (clamped >= 67) label = "Tense";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Calm</span>
        <span>Mixed</span>
        <span>Tense</span>
      </div>
      <div className="relative h-3 rounded-full bg-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-amber-300 to-rose-500 opacity-70" />
        <div
          className="absolute -top-1 h-5 w-1 rounded-full bg-slate-50 shadow"
          style={{ left: `${clamped}%`, transform: "translateX(-50%)" }}
        />
      </div>
      <div className="text-sm text-slate-300">
        Overall vibe: <span className="font-medium text-slate-50">{label}</span> ({clamped}/100)
      </div>
    </div>
  );
};
