// Helpers de autenticación para el admin dashboard.
// Usa Supabase Auth con magic links. Solo emails en ADMIN_EMAILS pueden ingresar.

import { supabase } from "./supabase";
import type { Session } from "@supabase/supabase-js";

// Allowlist de admins. Para agregar otro admin, edita esta constante y re-deploy.
// IMPORTANTE: en el server (RLS) también deberías restringir, pero como Supabase
// con `authenticated` role tiene acceso completo en este proyecto, mantén esta
// lista corta y de confianza.
export const ADMIN_EMAILS = [
  "breathwork@amarteinc.com",
  "amarteinc@gmail.com",
  "miguelvalencia0531@gmail.com",
];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function sendMagicLink(email: string): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: "Supabase no configurado" };
  if (!isAdminEmail(email)) {
    return { ok: false, error: "Este email no está autorizado para acceder al admin." };
  }
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/admin`,
    },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function getCurrentSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function signOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export function subscribeToAuth(callback: (session: Session | null) => void): () => void {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_evt, session) => {
    callback(session);
  });
  return () => data.subscription.unsubscribe();
}
