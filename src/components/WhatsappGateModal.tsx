// Modal de captura de leads que se abre al click cualquier CTA de WhatsApp.
// Form: nombre + país (selector default Ecuador) + WhatsApp + email opcional.
// Al completar guarda en Supabase y muestra botón "Entrar al grupo".
//
// Una vez completado, queda en localStorage → próximas veces directo al grupo (sin form).

import { useEffect, useState, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageCircle,
  X,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { COUNTRIES, DEFAULT_COUNTRY, type Country } from "../data/countries";
import { siteConfig } from "../data/siteConfig";
// NOTA lazy: sanitizePhone/isValidEmail son funciones puras sin dependencias
// pesadas (import estático barato). submitLead se carga con import() dinámico
// al enviar, para no meter el chunk @supabase (~196KB) en el primer pintado.
import { sanitizePhone, isValidEmail } from "../lib/supabase";
import { useWhatsappGate } from "../lib/whatsappGate";
import { detectCountry } from "../lib/geolocation";
import {
  trackLeadFormSubmit,
  trackWhatsappClick,
} from "../lib/tracking";

export function WhatsappGateModal() {
  const { isOpen, closeGate, markRegistered, source } = useWhatsappGate();

  const [name, setName] = useState("");
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Trap para bots
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  // Reset cuando se cierra
  useEffect(() => {
    if (!isOpen) {
      // Solo reset si está en idle (no se borran datos durante envío)
      setTimeout(() => {
        if (status === "idle" || status === "error") {
          setStatus("idle");
          setError("");
        }
      }, 250);
    }
  }, [isOpen, status]);

  // ESC para cerrar + body scroll lock cuando está abierto (a11y)
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGate();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, closeGate]);

  // Geolocation: solo cuando el modal abre por primera vez, intenta detectar país.
  // No reemplaza si el usuario ya cambió manualmente (country !== DEFAULT_COUNTRY).
  // ref (no estado): solo la lee este efecto, nunca el render → evita
  // setState-in-effect y un re-render sin cambio visible.
  const geoTriedRef = useRef(false);
  useEffect(() => {
    if (!isOpen || geoTriedRef.current) return;
    if (country.code !== DEFAULT_COUNTRY.code) {
      geoTriedRef.current = true;
      return;
    }
    const controller = new AbortController();
    detectCountry(controller.signal).then((detected) => {
      if (detected && country.code === DEFAULT_COUNTRY.code) {
        setCountry(detected);
      }
      geoTriedRef.current = true;
    });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const cleanPhone = useMemo(() => sanitizePhone(phone, country.code), [phone, country.code]);
  const isPhoneValid = cleanPhone.length >= 7;
  const isEmailValid = !email || isValidEmail(email);
  const canSubmit = name.trim().length > 1 && isPhoneValid && isEmailValid && status !== "loading";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("loading");
    setError("");

    const whatsappFull = `+${country.code}${cleanPhone}`;
    const cleanEmail = email.trim().toLowerCase();

    try {
      // Import dinámico: el chunk @supabase se descarga al enviar, no antes.
      const { submitLead, toFriendlySupabaseError } = await import("../lib/supabase");
      let res: { ok: boolean; error?: string };
      try {
        res = await submitLead({
          name: name.trim(),
          whatsapp: whatsappFull,
          countryCode: country.code,
          countryName: country.name,
          email: cleanEmail || undefined,
          source: `whatsapp_gate:${source}`,
          honeypot, // si bot llenó campo trampa, será rechazado server-side
        });
      } catch (submitErr) {
        res = { ok: false, error: toFriendlySupabaseError(submitErr) };
      }

      if (res.ok) {
        setStatus("success");
        trackLeadFormSubmit({
          source: `whatsapp_gate:${source}`,
          country: country.code,
          has_email: Boolean(cleanEmail),
        });

        // Guardar lead en context + localStorage
        markRegistered({
          name: name.trim(),
          whatsapp: whatsappFull,
          countryCode: country.code,
          countryName: country.name,
          email: cleanEmail || undefined,
          registeredAt: new Date().toISOString(),
        });
      } else {
        setStatus("error");
        setError(res.error ?? "No pudimos guardar tus datos. Intenta de nuevo.");
      }
    } catch {
      setStatus("error");
      setError("No pudimos cargar el registro. Revisa tu internet e inténtalo de nuevo.");
    }
  }

  function handleWhatsappRedirect() {
    trackWhatsappClick("floating_button");
    window.open(siteConfig.whatsappGroupUrl, "_blank", "noopener,noreferrer");
    closeGate();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/85 px-4 backdrop-blur-md sm:px-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gate-title"
          onClick={closeGate}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl gradient-border bg-ink-900 shadow-glow-emerald-strong"
          >
            {/* Close button */}
            <button
              onClick={closeGate}
              aria-label="Cerrar"
              className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full border border-white/10 bg-ink/60 text-bone/70 backdrop-blur transition-colors hover:border-bone/30 hover:text-bone relative before:absolute before:-inset-2 before:content-['']"
            >
              <X className="size-4" />
            </button>

            <div className="p-6 sm:p-8">
              {status !== "success" ? (
                <>
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-full border border-emerald-brand/40 bg-emerald-deep/40">
                      <Lock className="size-4 text-emerald-glow" strokeWidth={1.6} />
                    </div>
                    <div>
                      <p className="text-xs sm:text-[10px] uppercase tracking-eyebrow text-emerald-brand">
                        Grupo privado
                      </p>
                      <h3 id="gate-title" className="font-display text-xl text-bone">
                        Únete a la comunidad
                      </h3>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-bone/75 leading-relaxed">
                    Déjanos tus datos y entras al grupo donde anunciamos primero
                    fechas, ciudades, cupos y precios de cada experiencia.
                  </p>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* Honeypot trap — invisible para humanos, bots llenan campos */}
                    <div className="absolute opacity-0 pointer-events-none" aria-hidden style={{ position: 'absolute', left: '-9999px' }}>
                      <label htmlFor="amarte_website">
                        Website (deja en blanco)
                        <input
                          type="text"
                          id="amarte_website"
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
                        />
                      </label>
                    </div>

                    {/* Nombre */}
                    <div>
                      <label htmlFor="gate-name" className="text-xs uppercase tracking-eyebrow text-bone/60">
                        Nombre <span className="text-emerald-brand">*</span>
                      </label>
                      <input
                        id="gate-name"
                        type="text"
                        required
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre"
                        className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 text-sm text-bone placeholder:text-muted/70 focus:border-emerald-brand/50 focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
                      />
                    </div>

                    {/* País + WhatsApp en una fila */}
                    <div>
                      <label htmlFor="gate-phone" className="text-xs uppercase tracking-eyebrow text-bone/60">
                        WhatsApp <span className="text-emerald-brand">*</span>
                      </label>
                      <div className="mt-1.5 flex gap-2">
                        <select
                          aria-label="País"
                          value={country.code}
                          onChange={(e) => {
                            const c = COUNTRIES.find((x) => x.code === e.target.value);
                            if (c) setCountry(c);
                          }}
                          className="h-11 w-[7.5rem] flex-shrink-0 rounded-xl border border-white/10 bg-white/[0.025] px-2 text-sm text-bone focus:border-emerald-brand/50 focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code} className="bg-ink-900">
                              {c.flag} +{c.code}
                            </option>
                          ))}
                        </select>
                        <input
                          id="gate-phone"
                          type="tel"
                          required
                          inputMode="numeric"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={country.code === "593" ? "99 565 6078" : "número sin código"}
                          className="h-11 flex-1 rounded-xl border border-white/10 bg-white/[0.025] px-4 text-sm text-bone placeholder:text-muted/70 focus:border-emerald-brand/50 focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
                        />
                      </div>
                      <p className="mt-1.5 text-xs sm:text-[11px] text-muted">
                        País: <span className="text-bone/80">{country.name}</span> · Cambia si tu WhatsApp es de otro país
                      </p>
                    </div>

                    {/* Email opcional */}
                    <div>
                      <label htmlFor="gate-email" className="text-xs uppercase tracking-eyebrow text-bone/60">
                        Email <span className="text-muted/60">(opcional)</span>
                      </label>
                      <div className="relative mt-1.5">
                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                        <input
                          id="gate-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="tu@email.com"
                          className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.025] pl-10 pr-4 text-sm text-bone placeholder:text-muted/70 focus:border-emerald-brand/50 focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
                        />
                      </div>
                      <p className="mt-1.5 text-xs sm:text-[11px] text-muted">
                        Recibe 1 email mensual con todos los eventos del mes. Sin spam.
                      </p>
                    </div>

                    {/* Consent */}
                    <div className="rounded-xl border border-emerald-brand/15 bg-emerald-deep/15 p-3 text-xs sm:text-[11px] leading-relaxed text-bone/75">
                      Al continuar aceptas recibir información de AMARTE por WhatsApp.
                      Puedes salirte cuando quieras.{" "}
                      <a href="/privacidad.html" target="_blank" rel="noopener noreferrer" className="py-0.5 underline decoration-emerald-brand/40 hover:text-emerald-glow">
                        Privacidad
                      </a>
                      .
                    </div>

                    {error && (
                      <p className="text-base text-red-300" role="alert">
                        {error}
                      </p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-brand text-sm font-medium text-ink-900 shadow-glow-emerald transition-all hover:bg-emerald-glow hover:shadow-glow-emerald-strong disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {status === "loading" ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <>
                          <MessageCircle className="size-4" strokeWidth={1.8} />
                          Continuar al grupo
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                /* SUCCESS state */
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mx-auto grid size-16 place-items-center rounded-full border border-emerald-brand/40 bg-emerald-deep/40"
                  >
                    <CheckCircle2 className="size-8 text-emerald-glow" strokeWidth={1.6} />
                  </motion.div>
                  <h3 className="font-display mt-5 text-2xl text-bone">
                    ¡Listo, {name.split(" ")[0]}!
                  </h3>
                  <p className="mt-3 text-sm text-bone/80 leading-relaxed">
                    Te guardamos en nuestra lista. Ahora únete al grupo privado de WhatsApp
                    donde anunciamos las próximas experiencias.
                  </p>

                  <button
                    onClick={handleWhatsappRedirect}
                    className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-brand text-sm font-medium text-ink-900 shadow-glow-emerald transition-all hover:bg-emerald-glow hover:shadow-glow-emerald-strong"
                  >
                    <MessageCircle className="size-4" strokeWidth={1.8} />
                    Entrar al grupo de WhatsApp
                  </button>

                  <p className="mt-4 text-xs text-muted">
                    También puedes revisar tu email — pronto recibirás los eventos del mes.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
