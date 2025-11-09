import React, { useState } from "react";
import { useAuthContext } from "../../lib/authContext";
import { Api } from "../../lib/api";

export function Paywall() {
  const { subscription } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const priceId = import.meta.env.VITE_STRIPE_PRICE_PRO;

  if (subscription && subscription.isPro) {
    return (
      <p>
        You are <strong>Aura Pro</strong>. 💎 Full access unlocked.
      </p>
    );
  }

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const res = await Api.createCheckoutSession(priceId);
      if (res.url) {
        window.location.href = res.url;
      } else {
        alert("No checkout URL from backend.");
      }
    } catch (e) {
      alert(e.message || "Upgrade failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-slate-700 rounded-xl p-4 bg-slate-900">
      <h3 className="text-xl font-semibold mb-2">Upgrade to Aura Pro</h3>
      <ul className="text-sm mb-4 space-y-1">
        <li>✅ Deep emotional & psychological insights</li>
        <li>✅ Higher daily limits</li>
        <li>✅ Priority responses</li>
      </ul>
      <button onClick={handleUpgrade} disabled={loading}>
        {loading ? "Redirecting…" : "Upgrade Now"}
      </button>
    </div>
  );
}
