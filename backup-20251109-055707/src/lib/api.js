import { auth } from "./firebase";

const BASE_URL = import.meta.env.VITE_FUNCTIONS_BASE_URL;

async function authFetch(path, options = {}) {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}/${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  let json = {};
  if (text) {
    try {
      json = JSON.parse(text);
    } catch (e) {
      throw new Error(text || `Request failed: ${res.status}`);
    }
  }

  if (!res.ok) {
    throw new Error(json.error || text || `Request failed: ${res.status}`);
  }

  return json;
}

export const Api = {
  getSubscriptionStatus: () =>
    authFetch("getSubscriptionStatus", { method: "GET" }),
  createCheckoutSession: (priceId) =>
    authFetch("createCheckoutSession", {
      method: "POST",
      body: JSON.stringify({ priceId }),
    }),
  createBillingPortalSession: () =>
    authFetch("createBillingPortalSession", { method: "POST" }),
  auraFree: (input) =>
    authFetch("auraFree", {
      method: "POST",
      body: JSON.stringify({ input }),
    }),
  auraPro: (input) =>
    authFetch("auraPro", {
      method: "POST",
      body: JSON.stringify({ input }),
    }),
};
