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

  const { error } = await supabase.from("leads").insert({
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

  const { error } = await supabase.from("subscribers").insert({
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
SQL para crear las tablas en Supabase (ejecutar en SQL Editor):

create table public.leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  whatsapp     text not null,
  city         text,
  intent       text,
  source       text,
  user_agent   text
);

alter table public.leads enable row level security;

create policy "anon insert leads"
  on public.leads
  for insert
  to anon
  with check (true);

create table public.subscribers (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null unique,
  source      text
);

alter table public.subscribers enable row level security;

create policy "anon insert subscribers"
  on public.subscribers
  for insert
  to anon
  with check (true);
*/
