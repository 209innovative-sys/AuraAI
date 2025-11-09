import React from 'react';
import { AuthGate } from '../components/auth/AuthGate';
import { useAuthContext } from '../lib/authContext';
import { Api } from '../lib/api';

export function Account() {
  const { user, subscription } = useAuthContext();

  const openBilling = async () => {
    try {
      const res = await Api.createBillingPortalSession();
      if (res.url) window.location.href = res.url;
    } catch (e) {
      alert(e.message || 'Failed to open billing portal');
    }
  };

  return (
    <AuthGate>
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold">Account</h2>
        <p>Email: {user?.email}</p>
        <p>Status: {subscription?.isPro ? 'Aura Pro' : 'Free'}</p>
        {subscription?.isPro && (
          <button onClick={openBilling}>Manage Subscription</button>
        )}
      </div>
    </AuthGate>
  );
}
