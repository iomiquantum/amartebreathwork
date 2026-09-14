// Supabase LAZY — @supabase/supabase-js (~196KB) NUNCA se importa de forma
// estática desde este módulo. El cliente real solo se descarga con
// `import()` dinámico la primera vez que una acción lo necesita (enviar un
// formulario, cargar la agenda, abrir el admin). El primer pintado no espera
// ni descarga ese chunk.
//
// Lo que SÍ es síncrono y barato (sin dependencias pesadas):
// - supabaseConfigured, sanitizePhone, isValidEmail, MAX_ATTEMPTS_PER_PHONE
// - todos los `type` / `interface` (se borran al compilar)
// - `supabase`: proxy compatible que carga el cliente bajo demanda. Existe
//   solo para no romper a los consumidores que no pueden migrar aún
//   (páginas admin, lib/auth). El código nuevo debe usar las funciones
//   async de este módulo (submitLead, fetchUpcomingEvents, ...).
//
// Si Supabase no responde: timeouts + SupabaseUnavailableError con mensaje
// en lenguaje simple (apto para adultos mayores). Las funciones `fetch*`
// nunca lanzan: devuelven su fallback ([] / null) y guardan el error de
// red en un slot que la UI puede leer con takeLastSupabaseError().

import type { SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && anon);

// Mensajes en lenguaje simple, sin tecnicismos.
const MSG_SLOW =
  "La conexión está tardando más de lo normal. Revisa tu internet e inténtalo de nuevo.";
const MSG_NOT_CONFIGURED =
  "El registro en línea no está disponible en este momento. Escríbenos por WhatsApp y te ayudamos con gusto.";

// Tiempos máximos de espera (redes lentas / Supabase caído).
const LOAD_TIMEOUT_MS = 12_000; // descarga del chunk + creación del cliente
const QUERY_TIMEOUT_MS = 15_000; // cada consulta a la base de datos

export class SupabaseUnavailableError extends Error {
  constructor(message: string = MSG_SLOW) {
    super(message);
    this.name = "SupabaseUnavailableError";
  }
}

export function toFriendlySupabaseError(err: unknown): string {
  if (err instanceof SupabaseUnavailableError) return err.message;
  const raw = err instanceof Error ? err.message : String(err ?? "");
  if (
    /timeout|timed out|network|fetch|connection|abort|offline|failed to load|dynamically imported/i.test(
      raw,
    )
  ) {
    return MSG_SLOW;
  }
  return "No pudimos completar la acción. Inténtalo de nuevo en unos segundos.";
}

function withTimeout<T>(work: PromiseLike<T>, ms: number, message: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => reject(new SupabaseUnavailableError(message)), ms);
  });
  return Promise.race([Promise.resolve(work), timeout]).finally(() => {
    if (timer !== undefined) clearTimeout(timer);
  });
}

let clientPromise: Promise<SupabaseClient> | null = null;

function loadSupabaseClient(): Promise<SupabaseClient> {
  if (!supabaseConfigured) {
    return Promise.reject(new SupabaseUnavailableError(MSG_NOT_CONFIGURED));
  }
  if (!clientPromise) {
    clientPromise = withTimeout(import("@supabase/supabase-js"), LOAD_TIMEOUT_MS, MSG_SLOW)
      .then((mod) => mod.createClient(url as string, anon as string))
      .catch((err: unknown) => {
        // Permitir reintentar en la próxima llamada.
        clientPromise = null;
        throw err;
      });
  }
  return clientPromise;
}

// Cliente para las funciones de este módulo: null si no hay configuración
// o si la red falló (en ese caso deja el motivo en takeLastSupabaseError()).
async function getQueryClient(): Promise<SupabaseClient | null> {
  if (!supabaseConfigured) return null;
  try {
    return await loadSupabaseClient();
  } catch (err) {
    recordTransportError(err);
    return null;
  }
}

// --- Slot de último error de transporte (red/timeout) ---
let lastTransportError: SupabaseUnavailableError | null = null;

function isTransportFailure(err: unknown): boolean {
  if (err instanceof SupabaseUnavailableError) return true;
  const raw = err instanceof Error ? err.message : String(err ?? "");
  return /timeout|timed out|network|fetch|connection|abort|offline/i.test(raw);
}

function recordTransportError(err: unknown): void {
  if (!isTransportFailure(err)) return;
  lastTransportError =
    err instanceof SupabaseUnavailableError ? err : new SupabaseUnavailableError(MSG_SLOW);
}

// Devuelve y limpia el último error de red/timeout. Las funciones fetch*
// mantienen su contrato (devuelven [] / null) y la UI usa esto para mostrar
// un aviso amable con botón Reintentar en vez de un estado vacío engañoso.
export function takeLastSupabaseError(): SupabaseUnavailableError | null {
  const err = lastTransportError;
  lastTransportError = null;
  return err;
}

// --- Proxy compat para consumidores que aún usan `supabase` directo ---
// Replica el encadenado de los query builders (from().select().eq()...)
// re-ejecutando la cadena contra el cliente real solo al hacer `await`.
// `auth` se sirve con fachada propia porque onAuthStateChange necesita
// devolver una suscripción síncrona (la registra en cuanto carga el cliente).

function createAuthFacade(): Record<string, unknown> {
  const withClient = <T>(fn: (client: SupabaseClient) => Promise<T>): Promise<T> =>
    withTimeout(loadSupabaseClient().then((client) => fn(client)), QUERY_TIMEOUT_MS, MSG_SLOW);
  return {
    signInWithOtp: (options: unknown) =>
      withClient((c) => c.auth.signInWithOtp(options as never)),
    signUp: (options: unknown) => withClient((c) => c.auth.signUp(options as never)),
    getSession: () => withClient((c) => c.auth.getSession()),
    getUser: () => withClient((c) => c.auth.getUser()),
    signOut: () => withClient((c) => c.auth.signOut()),
    onAuthStateChange: (callback: (event: string, session: unknown) => void) => {
      let current: { unsubscribe: () => void } | null = null;
      let cancelled = false;
      loadSupabaseClient()
        .then((client) => {
          if (cancelled) return;
          const { data } = client.auth.onAuthStateChange(callback as never);
          current = data.subscription;
        })
        .catch(() => undefined);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              cancelled = true;
              current?.unsubscribe();
            },
          },
        },
      };
    },
  };
}

// Nodo encadenable por LISTA DE OPERACIONES (no por promesas anidadas).
// Cada .prop / (...args) solo anota un paso; nada se ejecuta hasta el
// `await` final. Esto es esencial porque los query builders de Supabase son
// "thenables": encadenar con .then() reales los ejecutaría antes de tiempo
// (con la cadena incompleta) en vez de construir la consulta completa.
type LazyOp = { kind: "get"; prop: PropertyKey } | { kind: "apply"; args: unknown[] };

function replayOps(client: SupabaseClient, ops: LazyOp[]): unknown {
  let current: unknown = client;
  for (const op of ops) {
    if (op.kind === "get") {
      current = (current as unknown as Record<PropertyKey, unknown>)[op.prop];
    } else {
      current = (current as unknown as (...a: unknown[]) => unknown)(...op.args);
    }
  }
  return current;
}

function chainNode(ops: LazyOp[]): unknown {
  const target = function () {};
  return new Proxy(target, {
    get(_t, prop) {
      // Solo el `await` final dispara la carga del cliente + replay síncrono.
      if (prop === "then") {
        return (onF?: unknown, onR?: unknown) =>
          loadSupabaseClient()
            .then((client) => replayOps(client, ops))
            .then(onF as never, onR as never);
      }
      if (prop === "catch") {
        return (onR?: unknown) =>
          loadSupabaseClient()
            .then((client) => replayOps(client, ops))
            .then(undefined, onR as never);
      }
      if (prop === "finally") {
        return (onF?: unknown) =>
          loadSupabaseClient()
            .then((client) => replayOps(client, ops))
            .finally(onF as never);
      }
      if (typeof prop === "symbol") return undefined;
      return chainNode([...ops, { kind: "get", prop }]);
    },
    apply(_t, _thisArg, args) {
      return chainNode([...ops, { kind: "apply", args }]);
    },
  });
}

function createLazyRoot(): SupabaseClient {
  const auth = createAuthFacade();
  const target = function () {};
  return new Proxy(target, {
    get(_t, prop) {
      if (prop === "auth") return auth;
      if (typeof prop === "symbol") return undefined;
      return chainNode([{ kind: "get", prop }]);
    },
  }) as unknown as SupabaseClient;
}

export const supabase: SupabaseClient | null = supabaseConfigured ? createLazyRoot() : null;

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
  const client = await getQueryClient();
  if (!client) return 0;
  try {
    const { data, error } = await withTimeout(
      client.rpc("count_lead_attempts", { p_whatsapp: whatsapp }),
      QUERY_TIMEOUT_MS,
      MSG_SLOW,
    );
    if (error) {
      console.warn("[supabase] count_lead_attempts failed", error);
      return 0;
    }
    return (data as number) ?? 0;
  } catch (err) {
    recordTransportError(err);
    console.warn("[supabase] count_lead_attempts failed", err);
    return 0;
  }
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
  if (supabaseConfigured) {
    const attempts = await countLeadAttempts(lead.whatsapp);
    if (attempts >= MAX_ATTEMPTS_PER_PHONE) {
      return {
        ok: false,
        error: `Ya estás registrado. Si necesitas el link del grupo, escríbenos por WhatsApp.`,
        blocked: "limit",
      };
    }
  }

  const client = await getQueryClient();
  if (!client) {
    const transportError = takeLastSupabaseError();
    if (transportError) return { ok: false, error: transportError.message };
    console.warn("[supabase] Not configured — guardando solo en consola.");
    console.log("[lead]", lead);
    return { ok: true, simulated: true };
  }

  try {
    const { error } = await withTimeout(
      client.from("breathwork_leads").insert({
        name: lead.name,
        whatsapp: lead.whatsapp,
        country_code: lead.countryCode ?? "593",
        country_name: lead.countryName ?? "Ecuador",
        city: lead.city ?? null,
        intent: lead.intent ?? null,
        email: lead.email ?? null,
        source: lead.source ?? "landing",
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      }),
      QUERY_TIMEOUT_MS,
      MSG_SLOW,
    );

    if (error) {
      console.error("[supabase] insert lead failed", error);
      return { ok: false, error: error.message };
    }
  } catch (err) {
    recordTransportError(err);
    console.error("[supabase] insert lead failed", err);
    return { ok: false, error: toFriendlySupabaseError(err) };
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
  const client = await getQueryClient();
  if (!client) return [];
  try {
    const { data, error } = await withTimeout(
      client
        .from("breathwork_events")
        .select("*")
        .in("status", ["published", "sold_out"])
        .gte("date_iso", new Date().toISOString())
        .order("date_iso", { ascending: true })
        .limit(limit),
      QUERY_TIMEOUT_MS,
      MSG_SLOW,
    );

    if (error) {
      console.error("[supabase] fetch events failed", error);
      return [];
    }
    return (data as EventRow[]) ?? [];
  } catch (err) {
    recordTransportError(err);
    console.error("[supabase] fetch events failed", err);
    return [];
  }
}

export async function fetchEventBySlug(slug: string): Promise<EventRow | null> {
  const client = await getQueryClient();
  if (!client) return null;
  try {
    const { data, error } = await withTimeout(
      client
        .from("breathwork_events")
        .select("*")
        .eq("slug", slug)
        .in("status", ["published", "sold_out", "past"])
        .maybeSingle(),
      QUERY_TIMEOUT_MS,
      MSG_SLOW,
    );

    if (error) {
      console.error("[supabase] fetch event by slug failed", error);
      return null;
    }
    return (data as EventRow) ?? null;
  } catch (err) {
    recordTransportError(err);
    console.error("[supabase] fetch event by slug failed", err);
    return null;
  }
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
  const client = await getQueryClient();
  if (!client) {
    const transportError = takeLastSupabaseError();
    if (transportError) return { ok: false, error: transportError.message };
    return { ok: true, reservationId: "simulated" };
  }

  // NOTA: NO usamos .select() porque anon role NO tiene SELECT en breathwork_reservations
  // (por privacidad). Generamos un tracking code client-side para mostrar al usuario.
  const trackingCode = `RES-${Date.now().toString(36).toUpperCase()}`;

  try {
    const { error } = await withTimeout(
      client.from("breathwork_reservations").insert({
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
      }),
      QUERY_TIMEOUT_MS,
      MSG_SLOW,
    );

    if (error) {
      console.error("[supabase] create reservation failed", error);
      return { ok: false, error: error.message };
    }
  } catch (err) {
    recordTransportError(err);
    console.error("[supabase] create reservation failed", err);
    return { ok: false, error: toFriendlySupabaseError(err) };
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
  const client = await getQueryClient();
  if (!client) return null;
  try {
    const { data, error } = await withTimeout(
      client
        .from("amarte_bank_config")
        .select("bank_name,account_holder,account_type,account_number,identification,email,notes")
        .eq("id", 1)
        .single(),
      QUERY_TIMEOUT_MS,
      MSG_SLOW,
    );
    if (error) {
      console.warn("[supabase] fetchBankConfig failed", error);
      return null;
    }
    return data as BankConfig;
  } catch (err) {
    recordTransportError(err);
    console.warn("[supabase] fetchBankConfig failed", err);
    return null;
  }
}

// ============================================
// NEWSLETTER
// ============================================

// ============================================
// CORPORATE INQUIRIES (B2B)
// ============================================

export interface CorporateInquiryInput {
  contactName: string;
  contactEmail: string;
  contactRole?: string;
  contactWhatsapp?: string;
  contactCountryCode?: string;
  companyName: string;
  companySize?: string;
  industry?: string;
  format?: "presencial" | "online" | "hibrido" | "no_definido";
  city?: string;
  estimatedDate?: string;
  estimatedPeople?: number;
  primaryGoal?: string;
  message?: string;
  honeypot?: string;
}

export async function submitCorporateInquiry(
  input: CorporateInquiryInput
): Promise<{ ok: boolean; error?: string; blocked?: "bot" }> {
  if (input.honeypot && input.honeypot.length > 0) {
    return { ok: false, error: "Bot detectado", blocked: "bot" };
  }
  if (!isValidEmail(input.contactEmail)) {
    return { ok: false, error: "Email inválido" };
  }
  const client = await getQueryClient();
  if (!client) {
    const transportError = takeLastSupabaseError();
    if (transportError) return { ok: false, error: transportError.message };
    console.log("[corp inquiry]", input);
    return { ok: true };
  }

  const utm = typeof window !== "undefined"
    ? {
        utm_source: sessionStorage.getItem("amarte_utm_source"),
        utm_medium: sessionStorage.getItem("amarte_utm_medium"),
        utm_campaign: sessionStorage.getItem("amarte_utm_campaign"),
      }
    : { utm_source: null, utm_medium: null, utm_campaign: null };

  try {
    const { error } = await withTimeout(
      client.from("breathwork_corporate_inquiries").insert({
        contact_name: input.contactName,
        contact_email: input.contactEmail.trim().toLowerCase(),
        contact_role: input.contactRole ?? null,
        contact_whatsapp: input.contactWhatsapp ?? null,
        contact_country_code: input.contactCountryCode ?? "593",
        company_name: input.companyName,
        company_size: input.companySize ?? null,
        industry: input.industry ?? null,
        format: input.format ?? "no_definido",
        city: input.city ?? null,
        estimated_date: input.estimatedDate ?? null,
        estimated_people: input.estimatedPeople ?? null,
        primary_goal: input.primaryGoal ?? null,
        message: input.message ?? null,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      }),
      QUERY_TIMEOUT_MS,
      MSG_SLOW,
    );

    if (error) {
      console.error("[supabase] corp inquiry failed", error);
      return { ok: false, error: error.message };
    }
  } catch (err) {
    recordTransportError(err);
    console.error("[supabase] corp inquiry failed", err);
    return { ok: false, error: toFriendlySupabaseError(err) };
  }
  return { ok: true };
}

// ============================================
// GENDER INQUIRIES (/hombres /mujeres)
// ============================================

export type GenderAudience = "men" | "women" | "other";

export interface GenderInquiryInput {
  audience: GenderAudience;
  name: string;
  whatsapp: string;
  email?: string;
  countryCode?: string;
  countryName?: string;
  city?: string;
  ageRange?: string;
  mainInterest?: string;
  message?: string;
  // específicos mujeres
  lifeStage?: string;
  mainConcern?: string;
  // específicos hombres
  mainGoal?: string;
  exerciseFrequency?: string;
  honeypot?: string;
}

export async function submitGenderInquiry(
  input: GenderInquiryInput
): Promise<{ ok: boolean; error?: string; blocked?: "bot" }> {
  if (input.honeypot && input.honeypot.length > 0) {
    return { ok: false, error: "Bot detectado", blocked: "bot" };
  }
  if (input.email && !isValidEmail(input.email)) {
    return { ok: false, error: "Email inválido" };
  }
  const client = await getQueryClient();
  if (!client) {
    const transportError = takeLastSupabaseError();
    if (transportError) return { ok: false, error: transportError.message };
    console.log("[gender inquiry]", input);
    return { ok: true };
  }

  const utm = typeof window !== "undefined"
    ? {
        utm_source: sessionStorage.getItem("amarte_utm_source"),
        utm_medium: sessionStorage.getItem("amarte_utm_medium"),
        utm_campaign: sessionStorage.getItem("amarte_utm_campaign"),
      }
    : { utm_source: null, utm_medium: null, utm_campaign: null };

  try {
    const { error } = await withTimeout(
      client.from("breathwork_gender_inquiries").insert({
        audience: input.audience,
        name: input.name,
        whatsapp: input.whatsapp,
        email: input.email ? input.email.trim().toLowerCase() : null,
        country_code: input.countryCode ?? "593",
        country_name: input.countryName ?? "Ecuador",
        city: input.city ?? null,
        age_range: input.ageRange ?? null,
        main_interest: input.mainInterest ?? null,
        message: input.message ?? null,
        life_stage: input.lifeStage ?? null,
        main_concern: input.mainConcern ?? null,
        main_goal: input.mainGoal ?? null,
        exercise_frequency: input.exerciseFrequency ?? null,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      }),
      QUERY_TIMEOUT_MS,
      MSG_SLOW,
    );

    if (error) {
      console.error("[supabase] gender inquiry failed", error);
      return { ok: false, error: error.message };
    }
  } catch (err) {
    recordTransportError(err);
    console.error("[supabase] gender inquiry failed", err);
    return { ok: false, error: toFriendlySupabaseError(err) };
  }

  if (input.email && isValidEmail(input.email)) {
    subscribeNewsletter(input.email).catch(() => undefined);
  }

  return { ok: true };
}

// ============================================
// YOUTH INQUIRIES (/jovenes)
// ============================================

export type YouthInquiryType = "parent" | "school" | "other";

export interface YouthInquiryInput {
  inquiryType: YouthInquiryType;
  // PARENT (B2C familia)
  parentName?: string;
  parentEmail?: string;
  parentWhatsapp?: string;
  parentCountryCode?: string;
  parentCountryName?: string;
  childAge?: number;
  childCount?: number;
  childConcerns?: string;
  // SCHOOL (B2B colegio)
  institutionName?: string;
  institutionType?: string;
  contactRole?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  studentCountTotal?: number;
  targetGrades?: string;
  formatInterest?: string;
  estimatedDate?: string;
  // COMÚN
  message?: string;
  city?: string;
  honeypot?: string;
}

export async function submitYouthInquiry(
  input: YouthInquiryInput
): Promise<{ ok: boolean; error?: string; blocked?: "bot" }> {
  if (input.honeypot && input.honeypot.length > 0) {
    return { ok: false, error: "Bot detectado", blocked: "bot" };
  }
  const emailToCheck = input.inquiryType === "school" ? input.contactEmail : input.parentEmail;
  if (emailToCheck && !isValidEmail(emailToCheck)) {
    return { ok: false, error: "Email inválido" };
  }
  const client = await getQueryClient();
  if (!client) {
    const transportError = takeLastSupabaseError();
    if (transportError) return { ok: false, error: transportError.message };
    console.log("[youth inquiry]", input);
    return { ok: true };
  }

  const utm = typeof window !== "undefined"
    ? {
        utm_source: sessionStorage.getItem("amarte_utm_source"),
        utm_medium: sessionStorage.getItem("amarte_utm_medium"),
        utm_campaign: sessionStorage.getItem("amarte_utm_campaign"),
      }
    : { utm_source: null, utm_medium: null, utm_campaign: null };

  try {
    const { error } = await withTimeout(
      client.from("breathwork_youth_inquiries").insert({
        inquiry_type: input.inquiryType,
        parent_name: input.parentName ?? null,
        parent_email: input.parentEmail ? input.parentEmail.trim().toLowerCase() : null,
        parent_whatsapp: input.parentWhatsapp ?? null,
        parent_country_code: input.parentCountryCode ?? "593",
        parent_country_name: input.parentCountryName ?? "Ecuador",
        child_age: input.childAge ?? null,
        child_count: input.childCount ?? 1,
        child_concerns: input.childConcerns ?? null,
        institution_name: input.institutionName ?? null,
        institution_type: input.institutionType ?? null,
        contact_role: input.contactRole ?? null,
        contact_name: input.contactName ?? null,
        contact_email: input.contactEmail ? input.contactEmail.trim().toLowerCase() : null,
        contact_phone: input.contactPhone ?? null,
        student_count_total: input.studentCountTotal ?? null,
        target_grades: input.targetGrades ?? null,
        format_interest: input.formatInterest ?? null,
        estimated_date: input.estimatedDate ?? null,
        message: input.message ?? null,
        city: input.city ?? null,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      }),
      QUERY_TIMEOUT_MS,
      MSG_SLOW,
    );

    if (error) {
      console.error("[supabase] youth inquiry failed", error);
      return { ok: false, error: error.message };
    }
  } catch (err) {
    recordTransportError(err);
    console.error("[supabase] youth inquiry failed", err);
    return { ok: false, error: toFriendlySupabaseError(err) };
  }

  // Auto-suscribir al newsletter si dio email válido
  const emailForNewsletter = input.inquiryType === "school" ? input.contactEmail : input.parentEmail;
  if (emailForNewsletter && isValidEmail(emailForNewsletter)) {
    subscribeNewsletter(emailForNewsletter).catch(() => undefined);
  }

  return { ok: true };
}

export async function subscribeNewsletter(email: string) {
  if (!isValidEmail(email)) return { ok: false, error: "Email inválido" };

  const client = await getQueryClient();
  if (!client) {
    const transportError = takeLastSupabaseError();
    if (transportError) return { ok: false, error: transportError.message };
    console.warn("[supabase] Not configured — guardando solo en consola.");
    console.log("[newsletter]", email);
    return { ok: true, simulated: true };
  }

  try {
    const { error } = await withTimeout(
      client.from("breathwork_subscribers").insert({
        email: email.trim().toLowerCase(),
        source: "landing",
      }),
      QUERY_TIMEOUT_MS,
      MSG_SLOW,
    );

    if (error) {
      console.error("[supabase] insert subscriber failed", error);
      if (error.code === "23505") return { ok: true };
      return { ok: false, error: error.message };
    }
  } catch (err) {
    recordTransportError(err);
    console.error("[supabase] insert subscriber failed", err);
    return { ok: false, error: toFriendlySupabaseError(err) };
  }
  return { ok: true };
}
