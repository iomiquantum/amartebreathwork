import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
// NOTA lazy: LeadIntent es solo tipo. submitLead se carga con import()
// dinámico al enviar, para no meter el chunk @supabase en el primer pintado.
import type { LeadIntent } from "../lib/supabase";
import { siteConfig } from "../data/siteConfig";
import { trackLeadFormSubmit, trackWhatsappClick } from "../lib/tracking";
import { useWhatsappGate } from "../lib/whatsappGate";

const intents: { value: LeadIntent; label: string }[] = [
  { value: "soltar_estres", label: "Soltar estrés" },
  { value: "dormir_mejor", label: "Dormir mejor" },
  { value: "calmar_mente", label: "Calmar mi mente" },
  { value: "reconectar", label: "Reconectar conmigo" },
  { value: "experiencia_diferente", label: "Vivir algo diferente" },
  { value: "respirar_mejor", label: "Respirar mejor" },
];

const STEP_LABELS = ["Tus datos", "Tu intención", "Confirmar"];

export function LeadForm() {
  const { markRegistered } = useWhatsappGate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("");
  const [intent, setIntent] = useState<LeadIntent | "">("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const canNext0 = name.trim().length > 1 && whatsapp.trim().length >= 7;
  const canNext1 = true; // ciudad e intent son opcionales pero los pedimos en el step 2

  const next = () => setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  async function submit() {
    setStatus("loading");
    setError("");
    const payload = {
      name: name.trim(),
      whatsapp: whatsapp.trim(),
      city: city.trim() || undefined,
      intent: (intent || undefined) as LeadIntent | undefined,
      source: "lead_form_multistep",
    };
    try {
      // Import dinámico: el chunk @supabase se descarga al enviar, no antes.
      const { submitLead, toFriendlySupabaseError } = await import("../lib/supabase");
      let res: { ok: boolean; error?: string };
      try {
        res = await submitLead(payload);
      } catch (submitErr) {
        res = { ok: false, error: toFriendlySupabaseError(submitErr) };
      }
      if (res.ok) {
        setStatus("success");
        trackLeadFormSubmit(payload);
        // Marcar como registrado en el gate para que no vuelva a aparecer
        markRegistered({
          name: payload.name,
          whatsapp: payload.whatsapp,
          countryCode: "593",
          countryName: "Ecuador",
          registeredAt: new Date().toISOString(),
        });
      } else {
        setStatus("error");
        setError(res.error ?? "No pudimos guardar tus datos. Intenta de nuevo.");
      }
    } catch {
      // Falló la descarga del módulo (sin conexión): mensaje simple y reintentable.
      setStatus("error");
      setError("No pudimos cargar el registro. Revisa tu internet e inténtalo de nuevo.");
    }
  }

  const progress = Math.round(((step + 1) / STEP_LABELS.length) * 100);

  return (
    <section
      id="lead-form"
      aria-label="Formulario opcional"
      className="relative bg-ink-900 py-20 sm:py-24"
    >
      <div className="container-tight">
        <div className="gradient-border rounded-3xl p-8 sm:p-10">
          <p className="eyebrow">Opcional</p>
          <h3 className="h-display mt-3 text-2xl sm:text-3xl text-balance">
            ¿Prefieres que te avisemos directo?
          </h3>
          <p className="lede mt-3">
            Déjanos tus datos y te escribiremos por WhatsApp con la próxima fecha.
          </p>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex flex-col items-start gap-5 rounded-2xl border border-emerald-brand/30 bg-emerald-deep/30 p-6"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-6 text-emerald-glow" />
                <p className="font-display text-xl text-bone">Gracias, {name.split(" ")[0]}.</p>
              </div>
              <p className="text-bone/85">
                Ya estás más cerca de vivir la experiencia. Ahora únete al grupo de
                WhatsApp para recibir las próximas fechas.
              </p>
              <a
                href={siteConfig.whatsappGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsappClick("lead_form_submit")}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-emerald-brand px-6 text-sm font-medium text-ink-900 shadow-glow-emerald hover:bg-emerald-glow"
              >
                <MessageCircle className="size-4" />
                Entrar al grupo de WhatsApp
              </a>
            </motion.div>
          ) : (
            <>
              {/* Progress */}
              <div className="mt-8">
                <div className="flex items-center justify-between text-xs uppercase tracking-eyebrow text-muted">
                  <span>
                    Paso {step + 1} · {STEP_LABELS[step]}
                  </span>
                  <span className="text-emerald-brand">{progress}%</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                  <motion.div
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-brand to-gold-warm"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {/* Step 0 */}
                {step === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -14 }}
                    transition={{ duration: 0.3 }}
                    className="mt-7 grid gap-4 sm:grid-cols-2"
                  >
                    <Field
                      label="Nombre"
                      id="name"
                      value={name}
                      onChange={setName}
                      placeholder="Tu nombre"
                      required
                      autoFocus
                    />
                    <Field
                      label="WhatsApp"
                      id="whatsapp"
                      type="tel"
                      value={whatsapp}
                      onChange={setWhatsapp}
                      placeholder="+593 9..."
                      required
                    />
                  </motion.div>
                )}

                {/* Step 1 */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -14 }}
                    transition={{ duration: 0.3 }}
                    className="mt-7 space-y-5"
                  >
                    <Field
                      label="Ciudad"
                      id="city"
                      value={city}
                      onChange={setCity}
                      placeholder="Quito, Guayaquil…"
                    />
                    <div>
                      <label className="text-xs uppercase tracking-eyebrow text-bone/60">
                        ¿Qué estás buscando?
                      </label>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {intents.map((opt) => {
                          const active = intent === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setIntent(active ? "" : opt.value)}
                              className={`rounded-full border px-4 py-2 text-xs transition-all relative before:absolute before:-inset-1 before:content-[''] ${
                                active
                                  ? "border-emerald-brand/50 bg-emerald-deep/50 text-emerald-glow"
                                  : "border-white/10 bg-white/[0.02] text-bone/80 hover:border-white/20"
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -14 }}
                    transition={{ duration: 0.3 }}
                    className="mt-7"
                  >
                    <p className="text-sm uppercase tracking-eyebrow text-bone/60">Confirmar</p>
                    <dl className="mt-4 space-y-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-sm">
                      <Row label="Nombre" value={name} />
                      <Row label="WhatsApp" value={whatsapp} />
                      {city && <Row label="Ciudad" value={city} />}
                      {intent && (
                        <Row
                          label="Intención"
                          value={intents.find((i) => i.value === intent)?.label ?? ""}
                        />
                      )}
                    </dl>
                    <div className="mt-5 rounded-xl border border-emerald-brand/20 bg-emerald-deep/20 p-4 text-xs leading-relaxed text-bone/80">
                      <p className="font-medium text-bone/95">
                        Al confirmar y enviar aceptas:
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        <li className="flex items-start gap-2">
                          <span className="mt-1.5 size-1 flex-shrink-0 rounded-full bg-emerald-brand" />
                          <span>
                            Recibir un <strong className="text-bone">WhatsApp inmediato</strong> con el link
                            al grupo privado.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1.5 size-1 flex-shrink-0 rounded-full bg-emerald-brand" />
                          <span>
                            Recibir información de las próximas experiencias por WhatsApp y/o email.
                          </span>
                        </li>
                      </ul>
                      <p className="mt-3 text-muted">
                        Puedes darte de baja en cualquier momento. Tus datos no se comparten con terceros.
                        Ver <a href="/privacidad.html" target="_blank" rel="noopener noreferrer" className="py-0.5 underline decoration-emerald-brand/40 hover:text-emerald-glow">privacidad</a>.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <p className="mt-3 text-base text-red-300" role="alert">
                  {error}
                </p>
              )}

              {/* Nav */}
              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 0}
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/10 px-5 text-sm text-bone/80 transition-colors hover:border-bone/30 hover:text-bone disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowLeft className="size-4" />
                  Atrás
                </button>

                {step < 2 ? (
                  <button
                    type="button"
                    onClick={next}
                    disabled={(step === 0 && !canNext0) || (step === 1 && !canNext1)}
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-emerald-brand px-6 text-sm font-medium text-ink-900 shadow-glow-emerald transition-all hover:bg-emerald-glow hover:shadow-glow-emerald-strong disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-8"
                  >
                    Continuar
                    <ArrowRight className="size-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submit}
                    disabled={status === "loading"}
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-emerald-brand px-6 text-sm font-medium text-ink-900 shadow-glow-emerald transition-all hover:bg-emerald-glow hover:shadow-glow-emerald-strong disabled:opacity-70 sm:flex-none sm:px-8"
                  >
                    {status === "loading" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Confirmar y enviar"
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  autoFocus,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs uppercase tracking-eyebrow text-bone/60">
        {label}
        {required && <span className="ml-1 text-emerald-brand">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 text-base text-bone placeholder:text-muted/70 focus:border-emerald-brand/50 focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium text-bone">{value}</dd>
    </div>
  );
}
