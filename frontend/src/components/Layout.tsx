import React from "react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  showHeaderActions?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showHeaderActions = true }) => {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="aura-container flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-rose-500 animate-pulse" />
            <div>
              <div className="text-sm font-semibold tracking-wide">AuraAI</div>
              <div className="text-xs text-slate-400">See the true vibe of your chats</div>
            </div>
          </Link>
          {showHeaderActions && (
            <div className="flex items-center gap-2">
              <Link to="/new" className="aura-button-primary">
                New Analysis
              </Link>
              <Link to="/profile" className="aura-button-secondary">
                Profile
              </Link>
            </div>
          )}
        </div>
      </header>
      <main className="aura-container py-6">{children}</main>
    </div>
  );
};
