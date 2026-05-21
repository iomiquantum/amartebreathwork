// Manejo de consentimiento de cookies/pixels.
// Estado posibles: 'unset' (todavía no eligió), 'accepted', 'declined'.
//
// Hasta que el usuario acepte, NO se cargan pixels de marketing (Meta, GA4, TikTok, Clarity).
// El cumplimiento GDPR / LGPD requiere consent explícito.

export const CONSENT_KEY = "amarte_cookie_consent";
export const CONSENT_EVENT = "amarte:consent-changed";

export type ConsentState = "unset" | "accepted" | "declined";

export function getConsent(): ConsentState {
  if (typeof window === "undefined") return "unset";
  const v = window.localStorage.getItem(CONSENT_KEY);
  if (v === "accepted" || v === "declined") return v;
  return "unset";
}

export function setConsent(state: "accepted" | "declined") {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, state);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
}

export function hasMarketingConsent(): boolean {
  return getConsent() === "accepted";
}

export function onConsentChange(callback: (state: ConsentState) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<ConsentState>).detail;
    callback(detail);
  };
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}
