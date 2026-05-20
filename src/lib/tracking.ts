// Eventos de marketing — placeholders listos para Meta Pixel / TikTok / GA4 / GTM.
// Cuando insertes el pixel en index.html, descomenta las llamadas correspondientes.

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
  // window.fbq?.("track", "PageView");
  // window.gtag?.("event", "page_view");
  console.log("[track] PageView");
}

export function trackWhatsappClick(source: LeadSource) {
  if (typeof window === "undefined") return;
  // window.fbq?.("track", "Lead", { content_name: source });
  // window.ttq?.track("ClickButton", { content_name: source });
  // window.gtag?.("event", "whatsapp_click", { source });
  // window.dataLayer?.push({ event: "whatsapp_click", source });
  console.log("[track] WhatsApp click ←", source);
}

export function trackHeroCTA() {
  trackWhatsappClick("hero_primary");
}

export function trackFinalCTA() {
  trackWhatsappClick("final_cta");
}

export function trackLeadFormSubmit(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  // window.fbq?.("track", "Lead", payload);
  console.log("[track] LeadFormSubmit", payload);
}

export function trackFAQOpen(question: string) {
  console.log("[track] FAQ open ←", question);
}

export function trackScrollDepth(percent: number) {
  console.log("[track] Scroll depth", percent);
}
