/**
 * GA4 minimal loader for Vite apps.
 * Set VITE_GA_ID in your env (e.g., G-XXXXXXXXXX).
 */
export function initGA() {
  const id = import.meta.env.VITE_GA_ID;
  if (!id) return;

  // Load gtag.js
  const s1 = document.createElement("script");
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s1);

  // Init dataLayer + config
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", id, { send_page_view: true });
}

export function gaEvent(name, params = {}) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
