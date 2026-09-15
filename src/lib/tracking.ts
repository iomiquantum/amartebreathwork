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
// DIETA DE TRACKERS: guardas DNT/adblock + carga diferida
// ============================================
// GTM+GA+Facebook+TikTok+Clarity NUNCA deben bloquear el arranque ni
// correr antes de la primera interacción o del consentimiento.
// La página funciona idéntica sin ellos: cada llamada es no-op
// si el vendor no cargó (adblock), si el usuario activó DNT, o si
// no hay consentimiento. Sin gestos complejos ni cambios visuales
// (mobile-first, apto adultos mayores: este módulo no toca el DOM).

/** true si el usuario activó Do Not Track en su navegador. */
export function isDoNotTrackEnabled(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const dnt =
    (navigator as Navigator & { doNotTrack?: string | null }).doNotTrack ??
    (window as Window & { doNotTrack?: string | null }).doNotTrack;
  return dnt === "1" || dnt === "yes";
}

/**
 * true si está permitido emitir eventos a vendors externos.
 * Sin consentimiento aceptado, con DNT, o sin window → no-op.
 * (El consentimiento vive en localStorage `amarte_cookie_consent`.)
 */
export function isMarketingAllowed(): boolean {
  if (typeof window === "undefined") return false;
  if (isDoNotTrackEnabled()) return false;
  try {
    return window.localStorage.getItem("amarte_cookie_consent") === "accepted";
  } catch {
    // localStorage bloqueado (modo incógnito estricto/adblock): sin tracking.
    return false;
  }
}

/**
 * Carga diferida de GTM+GA+Facebook+TikTok+Clarity.
 * Espera a la PRIMERA interacción del usuario (pointerdown/keydown/
 * touchstart/scroll/click, listeners pasivos de un solo disparo) o al
 * evento de consentimiento `amarte:consent-changed`, lo que ocurra
 * primero; como red de seguridad, un timeout idle de 8s tras el cual
 * igual se intenta (solo con consentimiento + sin DNT).
 * Si el adblocker tumba la importación o los scripts, se silencia y la
 * página sigue idéntica. Idempotente: llamar N veces carga como máximo 1.
 *
 * PARCHE A APLICAR EN src/App.tsx (NO aplicado: archivo compartido):
 * sustituir el bloque `import("./lib/pixels").then(initPixels)` + el
 * `import("./lib/consent").then(onConsentChange...)` por:
 *   import { initDeferredMarketing } from "./lib/tracking";
 *   const cancelDeferred = initDeferredMarketing();
 *   ...y en el cleanup del efecto: cancelDeferred?.();
 */
export function initDeferredMarketing(fallbackDelayMs = 8000): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") return () => {};
  let settled = false;
  let timer = 0;

  const load = () => {
    if (settled) return;
    settled = true;
    cleanup();
    if (!isMarketingAllowed()) return;
    import("./pixels")
      .then(({ initPixels }) => initPixels())
      .catch(() => {
        // Adblock / red bloqueada: la página funciona idéntica sin pixels.
      });
  };

  const onConsent = (e: Event) => {
    if ((e as CustomEvent<string>).detail === "accepted") load();
  };

  const opts: AddEventListenerOptions = { passive: true, once: true, capture: true };
  const events = ["pointerdown", "keydown", "touchstart", "scroll", "click"] as const;
  const onFirstInteraction = () => load();

  const cleanup = () => {
    events.forEach((ev) => window.removeEventListener(ev, onFirstInteraction, opts));
    window.removeEventListener("amarte:consent-changed", onConsent);
    if (timer) window.clearTimeout(timer);
  };

  events.forEach((ev) => window.addEventListener(ev, onFirstInteraction, opts));
  window.addEventListener("amarte:consent-changed", onConsent);
  // Red de seguridad idle: no bloquea el arranque (timeout, no await).
  timer = window.setTimeout(load, fallbackDelayMs);

  return cleanup;
}

/** Ejecuta `fn` cuando el navegador esté idle (sin bloquear el arranque). */
function runWhenIdle(fn: () => void): void {
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  };
  if (typeof w.requestIdleCallback === "function") {
    w.requestIdleCallback(fn, { timeout: 3000 });
  } else {
    window.setTimeout(fn, 1);
  }
}

// ============================================
// EVENTOS ESTÁNDAR META
// ============================================

export function trackPageView() {
  if (typeof window === "undefined" || !isMarketingAllowed()) return;
  window.fbq?.("track", "PageView");
  window.gtag?.("event", "page_view");
  window.dataLayer?.push({ event: "page_view" });
}

export function trackViewContent(eventTitle: string, eventId?: string) {
  if (typeof window === "undefined" || !isMarketingAllowed()) return;
  const data = { content_name: eventTitle, content_ids: eventId ? [eventId] : [], content_type: "event" };
  window.fbq?.("track", "ViewContent", data);
  window.gtag?.("event", "view_item", data);
  window.dataLayer?.push({ event: "view_content", ...data });
}

export function trackAddToCart(eventTitle: string, amount: number, eventId?: string) {
  if (typeof window === "undefined" || !isMarketingAllowed()) return;
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
  if (typeof window === "undefined" || !isMarketingAllowed()) return;
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
  if (typeof window === "undefined" || !isMarketingAllowed()) return;
  const data = { content_name: method, status: "completed" };
  window.fbq?.("track", "CompleteRegistration", data);
  window.gtag?.("event", "sign_up", { method });
  window.dataLayer?.push({ event: "complete_registration", method });
  window.clarity?.("set", "registered", "true");
}

export function trackPurchase(amount: number, currency: string, eventId?: string) {
  if (typeof window === "undefined" || !isMarketingAllowed()) return;
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
  if (typeof window === "undefined" || !isMarketingAllowed()) return;
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

// Fase 0 (datos y consentimiento): NUNCA enviar PII en claro a vendors
// externos (Meta/TikTok/GA4). name, whatsapp, city e intent solo viajan
// a Supabase (lib/supabase.ts); aquí el evento sale SIN payload sensible:
// solo señales no identificables (source/method). Aunque un llamante pase
// PII por error, se descarta antes de emitir.
export interface LeadMarketingSignal {
  source?: string;
  method?: string;
  // Se aceptan claves extra solo por compatibilidad con llamantes
  // existentes (newsletter, gate, reserva…): se IGNORAN siempre y nunca
  // se reenvían a vendors. Así ningún PII llega a Meta/TikTok/GA4.
  [k: string]: unknown;
}
export function trackLeadFormSubmit(payload: LeadMarketingSignal = {}) {
  if (typeof window === "undefined" || !isMarketingAllowed()) return;
  const raw = payload.source ?? payload.method ?? "lead_form";
  const source = typeof raw === "string" && raw.length > 0 ? raw : "lead_form";
  // Señal anonimizada: solo `source`. Nunca se propaga el resto del objeto
  // (name/whatsapp/city/intent u otras claves) a ningún vendor.
  const safeMeta = { content_name: source, status: "completed" };
  const safeGa = { method: source };
  const safeLayer = { event: "lead_form_submit", source };
  window.fbq?.("track", "Lead", safeMeta);
  window.ttq?.track("SubmitForm", { content_name: source });
  window.gtag?.("event", "generate_lead", safeGa);
  window.dataLayer?.push(safeLayer);
  window.clarity?.("event", "lead_form_submit");
  // Tag importante para Clarity heatmaps
  window.clarity?.("set", "is_lead", "true");
}

export function trackFAQOpen(question: string) {
  if (typeof window === "undefined" || !isMarketingAllowed()) return;
  window.gtag?.("event", "faq_open", { question });
  window.dataLayer?.push({ event: "faq_open", question });
  window.clarity?.("event", "faq_open");
}

export function trackFrequencyPlay(hz: number) {
  if (typeof window === "undefined" || !isMarketingAllowed()) return;
  window.fbq?.("trackCustom", "FrequencyPlay", { hz });
  window.gtag?.("event", "frequency_play", { hz });
  window.dataLayer?.push({ event: "frequency_play", hz });
  window.clarity?.("event", "frequency_play");
  // Señal de alta intención
  window.clarity?.("set", "engaged_audio", "true");
}

export function trackExitIntent() {
  if (typeof window === "undefined" || !isMarketingAllowed()) return;
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
  // Dieta de arranque: el scroll-listener + el intervalo de 5s NO se montan
  // en el arranque; se difieren a idle para no bloquear el primer paint.
  // Misma firma y mismo cleanup que antes (App.tsx no necesita cambios).
  let detach: (() => void) | undefined;
  let cancelled = false;
  runWhenIdle(() => {
    if (cancelled) return;
    detach = startEngagementTracking();
  });
  return () => {
    cancelled = true;
    detach?.();
  };
}

function startEngagementTracking() {
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
  if (typeof window === "undefined" || !isMarketingAllowed()) return;
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
  if (typeof window === "undefined" || !isMarketingAllowed()) return;
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

  if (Object.keys(utm).length > 0 && isMarketingAllowed()) {
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
