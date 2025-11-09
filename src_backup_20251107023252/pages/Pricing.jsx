import React from 'react';
import { Paywall } from '../components/paywall/Paywall';
import { AuthGate } from '../components/auth/AuthGate';

export function Pricing() {
  return (
    <AuthGate>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Pricing</h2>
        <p>Free tier + Aura Pro subscription powered by Stripe.</p>
        <Paywall />
      </div>
    </AuthGate>
  );
}
