import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { siteConfig } from "../data/siteConfig";
// NOTA lazy: subscribeNewsletter se carga con import() dinámico al enviar,
// para no meter el chunk @supabase (~196KB) en el primer pintado.
import { trackLeadFormSubmit } from "../lib/tracking";

export function Newsletter() {
  const n = siteConfig.newsletter;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  // Honeypot con nombre no fijo: se rota al montar vía ref (sin re-render).
  const honeypotRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const pool = ["contacto_extra", "datos_adicionales", "info_complemento", "referencia_extra"];
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    const el = honeypotRef.current;
    if (el) {
      el.name = chosen;
      el.id = `newsletter-${chosen}`;
    }
  }, []);
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Bot que llenó la trampa: éxito simulado sin fricción ni llamada.
    if (honeypot) {
      setStatus("success");
      return;
    }
    if (!email) return;
    // Validación sin fricción: mensaje amable antes de llamar al servidor.
    if (!emailLooksValid) {
      setStatus("error");
      setError("Revisa tu email: parece que le falta algo (ej. tu@email.com).");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      // Import dinámico: el chunk @supabase se descarga al enviar, no antes.
      const { subscribeNewsletter, toFriendlySupabaseError } = await import("../lib/supabase");
      let res: { ok: boolean; error?: string };
      try {
        res = await subscribeNewsletter(email);
      } catch (submitErr) {
        res = { ok: false, error: toFriendlySupabaseError(submitErr) };
      }
      if (res.ok) {
        setStatus("success");
        trackLeadFormSubmit({ source: "newsletter", email });
      } else {
        setStatus("error");
        setError(res.error ?? "No pudimos guardar tu email.");
      }
    } catch {
      setStatus("error");
      setError("No pudimos cargar el registro. Revisa tu internet e inténtalo de nuevo.");
    }
  }

  return (
    <section
      id="newsletter"
      aria-label="Newsletter"
      className="relative bg-ink py-16 sm:py-20"
    >
      <div className="container-tight">
        <div className="card-dark relative overflow-hidden p-7 sm:p-10">
          <div className="absolute -right-16 -top-16 size-48 rounded-full bg-emerald-brand/10 blur-3xl" />
          <div className="relative">
            <span className="eyebrow">Email · alternativa</span>
            <h3 className="h-display mt-3 text-2xl sm:text-3xl text-balance">{n.title}</h3>
            <p className="lede mt-3 max-w-xl">{n.body}</p>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                role="status"
                className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-brand/30 bg-emerald-deep/30 p-4 text-bone"
              >
                <CheckCircle2 className="size-5 text-emerald-glow" />
                <span>Listo. Te escribimos cuando tengamos novedades.</span>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-3 sm:flex-row">
                {/* Honeypot anti-bots: invisible para humanos, nombre no fijo */}
                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
                  <input
                    ref={honeypotRef}
                    type="text"
                    id="newsletter-contacto_extra"
                    name="contacto_extra"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>
                <div className="relative flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">Tu email</label>
                  <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    aria-describedby="newsletter-privacy"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="h-12 w-full rounded-full border border-white/10 bg-white/[0.02] pl-11 pr-5 text-base text-bone placeholder:text-muted/70 focus:border-emerald-brand/50 focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-brand px-7 text-sm font-medium text-ink-900 shadow-glow-emerald transition-all hover:bg-emerald-glow hover:shadow-glow-emerald-strong disabled:opacity-70"
                >
                  {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : n.cta}
                </button>
              </form>
            )}

            {error && (
              <p className="mt-3 text-base text-red-300" role="alert">
                {error}
              </p>
            )}
            <p id="newsletter-privacy" className="mt-3 text-sm text-bone/80">
              Solo enviamos lo importante. Te puedes dar de baja en cualquier momento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
