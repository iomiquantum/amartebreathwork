import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && anon);

export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(url as string, anon as string)
  : null;

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
  city?: string;
  intent?: LeadIntent;
  source?: string;
}

export async function submitLead(lead: LeadInput) {
  if (!supabase) {
    console.warn("[supabase] Not configured — guardando solo en consola.");
    console.log("[lead]", lead);
    return { ok: true, simulated: true };
  }

  const { error } = await supabase.from("breathwork_leads").insert({
    name: lead.name,
    whatsapp: lead.whatsapp,
    city: lead.city ?? null,
    intent: lead.intent ?? null,
    source: lead.source ?? "landing",
    user_agent:
      typeof navigator !== "undefined" ? navigator.userAgent : null,
  });

  if (error) {
    console.error("[supabase] insert lead failed", error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function subscribeNewsletter(email: string) {
  if (!email.includes("@")) return { ok: false, error: "Email inválido" };

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
    // Si es duplicado, considéralo éxito silencioso
    if (error.code === "23505") return { ok: true };
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/*
Tablas en Supabase (proyecto amarteinc, ya aplicadas vía migration).
Convención: prefijo breathwork_ porque el proyecto Supabase es 'amarteinc' (umbrella)
y comparte espacio con futuras tablas de app_, retiros_, etc.

create table public.breathwork_leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  whatsapp     text not null,
  city         text,
  intent       text,
  source       text default 'landing',
  user_agent   text
);

create table public.breathwork_subscribers (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null unique,
  source      text default 'landing'
);
*/
