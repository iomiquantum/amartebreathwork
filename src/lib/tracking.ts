// Eventos de marketing — listos para Meta Pixel + GA4 + TikTok.
// Los scripts de pixels se cargan automáticamente desde src/lib/pixels.ts
// según los IDs definidos en siteConfig.ts (metaPixelId, gaMeasurementId, tiktokPixelId).

type LeadSource =
  | "hero_primary"
  | "hero_secondary"
  | "trust_bar"
  | "experience_section"
  | "event_format"
  | "whatsapp_community"
  | "cinematic_quote"
  | "final_cta"
  | "floating_button"
  | "lead_form_submit";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (...args: unknown[]) => void };
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackPageView() {
  if (typeof window === "undefined") return;
  // PageView inicial ya se manda en initPixels(). Esta función queda
  // para route changes en futuro SPA con router.
  window.fbq?.("track", "PageView");
  window.gtag?.("event", "page_view");
}

export function trackWhatsappClick(source: LeadSource) {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "Lead", { content_name: source });
  window.ttq?.track("ClickButton", { content_name: source });
  window.gtag?.("event", "whatsapp_click", { source });
  window.dataLayer?.push({ event: "whatsapp_click", source });
}

export function trackHeroCTA() {
  trackWhatsappClick("hero_primary");
}

export function trackFinalCTA() {
  trackWhatsappClick("final_cta");
}

export function trackLeadFormSubmit(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "Lead", payload);
  window.ttq?.track("SubmitForm", payload);
  window.gtag?.("event", "generate_lead", payload);
  window.dataLayer?.push({ event: "lead_form_submit", ...payload });
}

export function trackFAQOpen(question: string) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "faq_open", { question });
  window.dataLayer?.push({ event: "faq_open", question });
}

export function trackScrollDepth(percent: number) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "scroll_depth", { percent });
  window.dataLayer?.push({ event: "scroll_depth", percent });
}
