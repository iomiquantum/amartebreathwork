// ============================================
// Eventos de marketing avanzados (Meta + GA4 + TikTok + Clarity)
// ============================================
// Los scripts de pixels se cargan desde src/lib/pixels.ts según
// IDs en siteConfig.ts (metaPixelId, gaMeasurementId, tiktokPixelId, clarityProjectId).
//
// Eventos estándar Meta para REMARKETING:
// - PageView → todos los visitantes
// - ViewContent → vio detalles de evento
// - InitiateCheckout → abrió modal de reserva
// - AddToCart → click "Reservar"
// - Lead → completó WhatsApp gate
// - CompleteRegistration → completó form completo
// - Purchase → reserva confirmada (server-side webhook)
//
// Audiencias custom posibles después de 1 semana de tráfico:
// - Visitaron + no se registraron → ad de awareness
// - Se registraron + no reservaron → ad de urgencia
// - Vieron evento X + no reservaron → ad de ese evento

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
    clarity?: (...args: unknown[]) => void;
  }
}

// ============================================
// EVENTOS ESTÁNDAR META
// ============================================

export function trackPageView() {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "PageView");
  window.gtag?.("event", "page_view");
  window.dataLayer?.push({ event: "page_view" });
}

export function trackViewContent(eventTitle: string, eventId?: string) {
  if (typeof window === "undefined") return;
  const data = { content_name: eventTitle, content_ids: eventId ? [eventId] : [], content_type: "event" };
  window.fbq?.("track", "ViewContent", data);
  window.gtag?.("event", "view_item", data);
  window.dataLayer?.push({ event: "view_content", ...data });
}

export function trackAddToCart(eventTitle: string, amount: number, eventId?: string) {
  if (typeof window === "undefined") return;
  const data = {
    content_name: eventTitle,
    content_ids: eventId ? [eventId] : [],
    content_type: "event",
    value: amount,
    currency: "USD",
  };
  window.fbq?.("track", "AddToCart", data);
  window.gtag?.("event", "add_to_cart", data);
  window.dataLayer?.push({ event: "add_to_cart", ...data });
}

export function trackInitiateCheckout(eventTitle: string, amount: number, eventId?: string) {
  if (typeof window === "undefined") return;
  const data = {
    content_name: eventTitle,
    content_ids: eventId ? [eventId] : [],
    value: amount,
    currency: "USD",
  };
  window.fbq?.("track", "InitiateCheckout", data);
  window.gtag?.("event", "begin_checkout", data);
  window.dataLayer?.push({ event: "initiate_checkout", ...data });
  window.clarity?.("event", "initiate_checkout");
}

export function trackCompleteRegistration(method: string) {
  if (typeof window === "undefined") return;
  const data = { content_name: method, status: "completed" };
  window.fbq?.("track", "CompleteRegistration", data);
  window.gtag?.("event", "sign_up", { method });
  window.dataLayer?.push({ event: "complete_registration", method });
  window.clarity?.("set", "registered", "true");
}

export function trackPurchase(amount: number, currency: string, eventId?: string) {
  if (typeof window === "undefined") return;
  const data = {
    value: amount,
    currency,
    content_ids: eventId ? [eventId] : [],
    content_type: "event",
  };
  window.fbq?.("track", "Purchase", data);
  window.gtag?.("event", "purchase", { ...data, transaction_id: eventId });
  window.dataLayer?.push({ event: "purchase", ...data });
  window.clarity?.("set", "purchased", "true");
}

// ============================================
// EVENTOS CUSTOM AMARTE
// ============================================

export function trackWhatsappClick(source: LeadSource) {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "Lead", { content_name: source });
  window.ttq?.track("ClickButton", { content_name: source });
  window.gtag?.("event", "whatsapp_click", { source });
  window.dataLayer?.push({ event: "whatsapp_click", source });
  window.clarity?.("event", `whatsapp_click_${source}`);
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
  window.clarity?.("event", "lead_form_submit");
  // Tag importante para Clarity heatmaps
  window.clarity?.("set", "is_lead", "true");
}

export function trackFAQOpen(question: string) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "faq_open", { question });
  window.dataLayer?.push({ event: "faq_open", question });
  window.clarity?.("event", "faq_open");
}

export function trackFrequencyPlay(hz: number) {
  if (typeof window === "undefined") return;
  window.fbq?.("trackCustom", "FrequencyPlay", { hz });
  window.gtag?.("event", "frequency_play", { hz });
  window.dataLayer?.push({ event: "frequency_play", hz });
  window.clarity?.("event", "frequency_play");
  // Señal de alta intención
  window.clarity?.("set", "engaged_audio", "true");
}

export function trackExitIntent() {
  if (typeof window === "undefined") return;
  window.fbq?.("trackCustom", "ExitIntent");
  window.gtag?.("event", "exit_intent");
  window.dataLayer?.push({ event: "exit_intent" });
  window.clarity?.("event", "exit_intent_shown");
}

// ============================================
// ENGAGEMENT TRACKING (auto, en App.tsx)
// ============================================

let scrollDepthTracked: Record<number, boolean> = {};
let timeTracked: Record<number, boolean> = {};
let pageStartTime = 0;

export function initEngagementTracking() {
  if (typeof window === "undefined") return;
  pageStartTime = Date.now();
  scrollDepthTracked = {};
  timeTracked = {};

  // Scroll depth: tracking 25%, 50%, 75%, 100%
  const trackScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const percent = Math.round((scrollTop / docHeight) * 100);

    [25, 50, 75, 100].forEach((threshold) => {
      if (percent >= threshold && !scrollDepthTracked[threshold]) {
        scrollDepthTracked[threshold] = true;
        trackScrollDepth(threshold);
      }
    });
  };

  // Time on page: 30s, 1min, 3min, 5min
  const timeThresholds = [30, 60, 180, 300]; // segundos
  const interval = setInterval(() => {
    const elapsedSec = Math.floor((Date.now() - pageStartTime) / 1000);
    timeThresholds.forEach((threshold) => {
      if (elapsedSec >= threshold && !timeTracked[threshold]) {
        timeTracked[threshold] = true;
        trackTimeOnPage(threshold);
      }
    });
    if (elapsedSec >= 300) clearInterval(interval); // stop después de 5 min
  }, 5000); // chequear cada 5 seg

  window.addEventListener("scroll", trackScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", trackScroll);
    clearInterval(interval);
  };
}

export function trackScrollDepth(percent: number) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "scroll_depth", { percent });
  window.dataLayer?.push({ event: "scroll_depth", percent });
  // Solo enviar a Meta el 75% y 100% (eventos de alta calidad de engagement)
  if (percent >= 75) {
    window.fbq?.("trackCustom", "DeepScroll", { percent });
  }
  // Tag Clarity para segmentar usuarios "leyeron a fondo"
  if (percent >= 75) {
    window.clarity?.("set", "deep_reader", "true");
  }
}

export function trackTimeOnPage(seconds: number) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "time_on_page", { seconds });
  window.dataLayer?.push({ event: "time_on_page", seconds });
  if (seconds >= 60) {
    window.fbq?.("trackCustom", "EngagedVisitor", { seconds });
  }
  if (seconds >= 180) {
    window.clarity?.("set", "highly_engaged", "true");
  }
}

// ============================================
// UTM CAPTURE
// ============================================

interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export function captureUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((key) => {
    const val = params.get(key);
    if (val) {
      utm[key as keyof UtmParams] = val;
      // Persistir en sessionStorage para que el lead lo capture al submit
      sessionStorage.setItem(`amarte_${key}`, val);
    }
  });

  if (Object.keys(utm).length > 0) {
    window.dataLayer?.push({ event: "utm_captured", ...utm });
    // Tag Clarity con la fuente
    if (utm.utm_source) window.clarity?.("set", "utm_source", utm.utm_source);
    if (utm.utm_campaign) window.clarity?.("set", "utm_campaign", utm.utm_campaign);
  }

  return utm;
}

export function getStoredUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  const utm: UtmParams = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((key) => {
    const val = sessionStorage.getItem(`amarte_${key}`);
    if (val) utm[key as keyof UtmParams] = val;
  });
  return utm;
}
