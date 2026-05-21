import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && anon);

export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(url as string, anon as string)
  : null;

// ============================================
// Helpers de validación / sanitización
// ============================================

// Strip leading 0 para números de Ecuador (593) — convierte 099... a 99...
export function sanitizePhone(rawPhone: string, countryCode: string): string {
  let cleaned = rawPhone.replace(/\D/g, "");
  if (countryCode === "593" && cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }
  return cleaned;
}

// Email regex realista (RFC 5322 simplificado)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

// Límite de intentos por número de WhatsApp (anti-bot soft cap)
export const MAX_ATTEMPTS_PER_PHONE = 3;

export async function countLeadAttempts(whatsapp: string): Promise<number> {
  if (!supabase) return 0;
  const { data, error } = await supabase.rpc("count_lead_attempts", { p_whatsapp: whatsapp });
  if (error) {
    console.warn("[supabase] count_lead_attempts failed", error);
    return 0;
  }
  return (data as number) ?? 0;
}

// ============================================
// LEADS
// ============================================

export type LeadIntent =
  | "soltar_estres"
  | "dormir_mejor"
  | "calmar_mente"
  | "reconectar"
  | "experiencia_diferente"
  | "respirar_mejor";

export interface LeadInput {
  name: string;
  whatsapp: string;
  countryCode?: string;
  countryName?: string;
  city?: string;
  intent?: LeadIntent;
  email?: string;
  source?: string;
  honeypot?: string; // si tiene valor → es bot
}

export async function submitLead(
  lead: LeadInput
): Promise<{ ok: boolean; error?: string; simulated?: boolean; blocked?: "bot" | "limit" }> {
  // Bot protection: honeypot
  if (lead.honeypot && lead.honeypot.length > 0) {
    return { ok: false, error: "Bot detectado", blocked: "bot" };
  }

  // Validación email si fue provisto
  if (lead.email && !isValidEmail(lead.email)) {
    return { ok: false, error: "Email inválido" };
  }

  // Soft cap: máximo 3 intentos por mismo whatsapp (ventana cerrada / re-registro permitido x3)
  if (supabase) {
    const attempts = await countLeadAttempts(lead.whatsapp);
    if (attempts >= MAX_ATTEMPTS_PER_PHONE) {
      return {
        ok: false,
        error: `Ya estás registrado. Si necesitas el link del grupo, escríbenos por WhatsApp.`,
        blocked: "limit",
      };
    }
  }

  if (!supabase) {
    console.warn("[supabase] Not configured — guardando solo en consola.");
    console.log("[lead]", lead);
    return { ok: true, simulated: true };
  }

  const { error } = await supabase.from("breathwork_leads").insert({
    name: lead.name,
    whatsapp: lead.whatsapp,
    country_code: lead.countryCode ?? "593",
    country_name: lead.countryName ?? "Ecuador",
    city: lead.city ?? null,
    intent: lead.intent ?? null,
    email: lead.email ?? null,
    source: lead.source ?? "landing",
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
  });

  if (error) {
    console.error("[supabase] insert lead failed", error);
    return { ok: false, error: error.message };
  }

  if (lead.email && isValidEmail(lead.email)) {
    subscribeNewsletter(lead.email).catch(() => undefined);
  }

  return { ok: true };
}

// ============================================
// EVENTS
// ============================================

export interface EventRow {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  date_iso: string;
  duration_min: number;
  format: "presencial" | "online" | "hibrido";
  city: string | null;
  venue_name: string | null;
  venue_address: string | null;
  online_url: string | null;
  spots_total: number;
  spots_available: number;
  price_amount: number | null;
  price_currency: string;
  deposit_amount: number | null;
  deposit_currency: string;
  deposit_percentage: number | null;
  status: string;
  is_featured: boolean;
  cover_image_url: string | null;
  tags: string[] | null;
}

export async function fetchUpcomingEvents(limit = 20): Promise<EventRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("breathwork_events")
    .select("*")
    .in("status", ["published", "sold_out"])
    .gte("date_iso", new Date().toISOString())
    .order("date_iso", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[supabase] fetch events failed", error);
    return [];
  }
  return (data as EventRow[]) ?? [];
}

// ============================================
// RESERVATIONS
// ============================================

export type PaymentMethod = "payphone" | "transferencia" | "efectivo";
export type PaymentStatus = "pending" | "confirmed" | "cancelled" | "refunded" | "expired";

export interface ReservationInput {
  eventId: string;
  name: string;
  email: string;
  whatsapp: string;
  countryCode?: string;
  countryName?: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  honeypot?: string;
}

export interface ReservationResult {
  ok: boolean;
  reservationId?: string;
  error?: string;
  blocked?: "bot";
}

export async function createReservation(input: ReservationInput): Promise<ReservationResult> {
  if (input.honeypot && input.honeypot.length > 0) {
    return { ok: false, error: "Bot detectado", blocked: "bot" };
  }
  if (!isValidEmail(input.email)) {
    return { ok: false, error: "Email inválido" };
  }
  if (!supabase) {
    return { ok: true, reservationId: "simulated" };
  }

  // NOTA: NO usamos .select() porque anon role NO tiene SELECT en breathwork_reservations
  // (por privacidad). Generamos un tracking code client-side para mostrar al usuario.
  const trackingCode = `RES-${Date.now().toString(36).toUpperCase()}`;

  const { error } = await supabase.from("breathwork_reservations").insert({
    event_id: input.eventId,
    name: input.name,
    email: input.email.trim().toLowerCase(),
    whatsapp: input.whatsapp,
    country_code: input.countryCode ?? "593",
    country_name: input.countryName ?? "Ecuador",
    amount: input.amount,
    currency: input.currency,
    payment_method: input.paymentMethod,
    payment_status: "pending",
    admin_notes: `tracking_code:${trackingCode}`,
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
  });

  if (error) {
    console.error("[supabase] create reservation failed", error);
    return { ok: false, error: error.message };
  }

  return { ok: true, reservationId: trackingCode };
}

// ============================================
// BANK CONFIG (singleton)
// ============================================

export interface BankConfig {
  bank_name: string | null;
  account_holder: string | null;
  account_type: string | null;
  account_number: string | null;
  identification: string | null;
  email: string | null;
  notes: string | null;
}

export async function fetchBankConfig(): Promise<BankConfig | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("amarte_bank_config")
    .select("bank_name,account_holder,account_type,account_number,identification,email,notes")
    .eq("id", 1)
    .single();
  if (error) {
    console.warn("[supabase] fetchBankConfig failed", error);
    return null;
  }
  return data as BankConfig;
}

// ============================================
// NEWSLETTER
// ============================================

export async function subscribeNewsletter(email: string) {
  if (!isValidEmail(email)) return { ok: false, error: "Email inválido" };

  if (!supabase) {
    console.warn("[supabase] Not configured — guardando solo en consola.");
    console.log("[newsletter]", email);
    return { ok: true, simulated: true };
  }

  const { error } = await supabase.from("breathwork_subscribers").insert({
    email: email.trim().toLowerCase(),
    source: "landing",
  });

  if (error) {
    console.error("[supabase] insert subscriber failed", error);
    if (error.code === "23505") return { ok: true };
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
