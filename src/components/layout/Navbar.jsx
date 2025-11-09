import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../lib/authContext";
import { logout } from "../../lib/firebase";

export function Navbar() {
  const { user } = useAuthContext();
  const loc = useLocation();

  const linkClass = (path) =>
    `px-3 py-1 rounded ${
      loc.pathname === path ? "bg-indigo-600" : "hover:bg-slate-800"
    }`;

  return (
    <nav className="bg-black/80 backdrop-blur border-b border-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="font-semibold text-indigo-400">
          AuraAI Live
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <Link to="/pricing" className={linkClass("/pricing")}>
            Pricing
          </Link>
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>
          <Link to="/account" className={linkClass("/account")}>
            Account
          </Link>
          {user && (
            <button
              onClick={logout}
              className="ml-2 text-xs text-slate-300 bg-transparent hover:bg-slate-800"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
