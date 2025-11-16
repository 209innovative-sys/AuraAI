import React from "react";
import { Link } from "react-router-dom";

interface AnalysisCardProps {
  id: string;
  title: string;
  date: string;
  vibeLabel: string;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ id, title, date, vibeLabel }) => {
  return (
    <Link
      to={`/analysis/${id}`}
      className="aura-card mb-3 flex items-center justify-between hover:bg-slate-900 transition-colors"
    >
      <div>
        <div className="text-sm font-medium text-slate-50">{title}</div>
        <div className="text-xs text-slate-400">{date}</div>
      </div>
      <div className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-200">
        {vibeLabel}
      </div>
    </Link>
  );
};
