// ReservationModal — Reserva de eventos con pago anticipado.
//
// Flujo:
// 1. Usuario click "Reservar" en un evento
// 2. Modal abre con datos del evento + monto del depósito
// 3. Step 1: elige método de pago (PayPhone | Transferencia)
// 4. Step 2: llena datos (nombre, email, teléfono con país)
// 5. Step 3 - Transferencia:
//    - Muestra datos bancarios
//    - Crea reserva con status='pending'
//    - Pide enviar comprobante por WhatsApp
//    - Confirmación manual desde Supabase Studio
// 6. Step 3 - PayPhone (TODO: integración SDK):
//    - Por ahora muestra mensaje "preparando integración"
//    - Cuando se integre: redirige a widget PayPhone

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Loader2,
  CheckCircle2,
  CreditCard,
  Building2,
  Copy,
  Check,
  MessageCircle,
  ArrowLeft,
  Calendar,
  MapPin,
  Video,
  Sparkles,
} from "lucide-react";
import { COUNTRIES, DEFAULT_COUNTRY, type Country } from "../data/countries";
import {
  createReservation,
  fetchBankConfig,
  sanitizePhone,
  isValidEmail,
  type BankConfig,
  type EventRow,
  type PaymentMethod,
} from "../lib/supabase";
import { siteConfig } from "../data/siteConfig";
import { trackLeadFormSubmit } from "../lib/tracking";

interface Props {
  event: EventRow | null;
  isOpen: boolean;
  onClose: () => void;
}

type Step = "method" | "data" | "transfer_instructions" | "payphone_placeholder" | "success";

export function ReservationModal({ event, isOpen, onClose }: Props) {
  const [step, setStep] = useState<Step>("method");
  const [method, setMethod] = useState<PaymentMethod>("transferencia");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [bank, setBank] = useState<BankConfig | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Reset al cerrar
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("method");
        setStatus("idle");
        setError("");
        setReservationId(null);
      }, 250);
    }
  }, [isOpen]);

  // Cargar datos bancarios al abrir
  useEffect(() => {
    if (isOpen && !bank) {
      fetchBankConfig().then(setBank);
    }
  }, [isOpen, bank]);

  const cleanPhone = useMemo(() => sanitizePhone(phone, country.code), [phone, country.code]);
  const phoneFull = `+${country.code}${cleanPhone}`;
  const isPhoneValid = cleanPhone.length >= 7;
  const isFormValid = name.trim().length > 1 && isValidEmail(email) && isPhoneValid;

  // Monto del depósito: usa deposit_amount del evento (default $20)
  const depositAmount = event?.deposit_amount ?? 20;
  const depositCurrency = event?.deposit_currency ?? "USD";

  async function handleSubmit() {
    if (!event || !isFormValid) return;
    setStatus("loading");
    setError("");

    const res = await createReservation({
      eventId: event.id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: phoneFull,
      countryCode: country.code,
      countryName: country.name,
      amount: depositAmount,
      currency: depositCurrency,
      paymentMethod: method,
      honeypot,
    });

    if (!res.ok) {
      setStatus("error");
      setError(res.error ?? "No pudimos crear la reserva. Intenta de nuevo.");
      return;
    }

    setReservationId(res.reservationId ?? null);
    trackLeadFormSubmit({
      source: `reservation:${method}`,
      event_id: event.id,
      amount: depositAmount,
    });
    setStatus("idle");

    if (method === "transferencia") {
      setStep("transfer_instructions");
    } else if (method === "payphone") {
      setStep("payphone_placeholder");
    } else {
      setStep("success");
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
      })
      .catch(() => undefined);
  }

  // WhatsApp con mensaje pre-rellenado para enviar comprobante
  const whatsappProofUrl = useMemo(() => {
    if (!event) return siteConfig.whatsappMessageUrl;
    const msg = encodeURIComponent(
      `Hola, acabo de hacer una reserva para "${event.title}". Te envío el comprobante de transferencia por $${depositAmount}. ID reserva: ${reservationId ?? "pendiente"}`
    );
    return `https://wa.me/593995656078?text=${msg}`;
  }, [event, depositAmount, reservationId]);

  if (!event) return null;

  const formatLabel = {
    presencial: "Presencial",
    online: "Online",
    hibrido: "Híbrido",
  }[event.format];

  const FormatIcon = event.format === "online" ? Video : event.format === "hibrido" ? Sparkles : Building2;

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
          aria-labelledby="reservation-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl gradient-border bg-ink-900 shadow-glow-emerald-strong"
          >
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full border border-white/10 bg-ink/60 text-bone/70 backdrop-blur transition-colors hover:border-bone/30 hover:text-bone"
            >
              <X className="size-4" />
            </button>

            <div className="p-6 sm:p-8">
              {/* Event header */}
              <div className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-eyebrow text-emerald-brand">
                  <FormatIcon className="size-3" /> {formatLabel}
                  {event.city && ` · ${event.city}`}
                </div>
                <h3 id="reservation-title" className="font-display mt-1.5 text-lg text-bone">
                  {event.title}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="size-3" />
                    {new Date(event.date_iso).toLocaleDateString("es-EC", {
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {event.venue_name && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3" />
                      {event.venue_name}
                    </span>
                  )}
                </div>
              </div>

              {/* STEPS */}
              {step === "method" && (
                <div>
                  <p className="text-xs uppercase tracking-eyebrow text-bone/60">Paso 1 de 2</p>
                  <h4 className="font-display mt-1 text-xl text-bone">
                    Elige cómo pagar tu reserva
                  </h4>
                  <p className="mt-2 text-sm text-bone/75 leading-relaxed">
                    Reserva con un depósito de{" "}
                    <strong className="text-emerald-glow">
                      {depositCurrency} {Number(depositAmount).toFixed(2)}
                    </strong>
                    . El resto lo pagas el día del evento.
                  </p>

                  <div className="mt-5 space-y-3">
                    <button
                      type="button"
                      onClick={() => setMethod("payphone")}
                      className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all ${
                        method === "payphone"
                          ? "border-emerald-brand/60 bg-emerald-deep/30"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <CreditCard className="size-5 flex-shrink-0 text-emerald-glow" strokeWidth={1.6} />
                      <div className="flex-1">
                        <p className="font-medium text-bone">PayPhone</p>
                        <p className="mt-1 text-xs text-bone/70">
                          Tarjeta de crédito / débito · Confirmación instantánea
                        </p>
                      </div>
                      {method === "payphone" && <CheckCircle2 className="size-5 text-emerald-glow" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setMethod("transferencia")}
                      className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all ${
                        method === "transferencia"
                          ? "border-emerald-brand/60 bg-emerald-deep/30"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <Building2 className="size-5 flex-shrink-0 text-gold-warm" strokeWidth={1.6} />
                      <div className="flex-1">
                        <p className="font-medium text-bone">Transferencia bancaria</p>
                        <p className="mt-1 text-xs text-bone/70">
                          Recibes datos bancarios · Confirmación manual con comprobante
                        </p>
                      </div>
                      {method === "transferencia" && <CheckCircle2 className="size-5 text-gold-warm" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep("data")}
                    className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-brand text-sm font-medium text-ink-900 shadow-glow-emerald hover:bg-emerald-glow"
                  >
                    Continuar
                  </button>
                </div>
              )}

              {step === "data" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setStep("method")}
                    className="inline-flex items-center gap-1 text-xs text-bone/60 hover:text-bone"
                  >
                    <ArrowLeft className="size-3" /> Cambiar método
                  </button>

                  <p className="mt-3 text-xs uppercase tracking-eyebrow text-bone/60">Paso 2 de 2</p>
                  <h4 className="font-display mt-1 text-xl text-bone">Tus datos</h4>
                  <p className="mt-2 text-sm text-bone/75">
                    Necesarios para enviarte la confirmación de tu cupo.
                  </p>

                  {/* Honeypot */}
                  <div style={{ position: "absolute", left: "-9999px" }} aria-hidden>
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label htmlFor="res-name" className="text-xs uppercase tracking-eyebrow text-bone/60">
                        Nombre completo <span className="text-emerald-brand">*</span>
                      </label>
                      <input
                        id="res-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre y apellido"
                        className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 text-sm text-bone placeholder:text-muted/70 focus:border-emerald-brand/50 focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
                      />
                    </div>

                    <div>
                      <label htmlFor="res-email" className="text-xs uppercase tracking-eyebrow text-bone/60">
                        Email <span className="text-emerald-brand">*</span>
                      </label>
                      <input
                        id="res-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 text-sm text-bone placeholder:text-muted/70 focus:border-emerald-brand/50 focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
                      />
                    </div>

                    <div>
                      <label htmlFor="res-phone" className="text-xs uppercase tracking-eyebrow text-bone/60">
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
                          id="res-phone"
                          type="tel"
                          required
                          inputMode="numeric"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={country.code === "593" ? "99 565 6078" : "número"}
                          className="h-11 flex-1 rounded-xl border border-white/10 bg-white/[0.025] px-4 text-sm text-bone placeholder:text-muted/70 focus:border-emerald-brand/50 focus:outline-none focus:ring-2 focus:ring-emerald-brand/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl border border-emerald-brand/20 bg-emerald-deep/15 p-3 text-xs leading-relaxed text-bone/80">
                    Total reserva:{" "}
                    <strong className="text-emerald-glow">
                      {depositCurrency} {Number(depositAmount).toFixed(2)}
                    </strong>
                    {" · "}
                    Método:{" "}
                    <strong className="text-bone">
                      {method === "payphone" ? "PayPhone" : "Transferencia"}
                    </strong>
                  </div>

                  {error && (
                    <p className="mt-3 text-sm text-red-400" role="alert">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={!isFormValid || status === "loading"}
                    className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-brand text-sm font-medium text-ink-900 shadow-glow-emerald hover:bg-emerald-glow disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>Continuar al pago</>
                    )}
                  </button>
                </form>
              )}

              {step === "transfer_instructions" && (
                <div>
                  <div className="grid size-12 place-items-center rounded-full border border-emerald-brand/40 bg-emerald-deep/40">
                    <Building2 className="size-5 text-emerald-glow" strokeWidth={1.6} />
                  </div>
                  <h4 className="font-display mt-4 text-xl text-bone">
                    Datos para la transferencia
                  </h4>
                  <p className="mt-2 text-sm text-bone/75">
                    Envía{" "}
                    <strong className="text-emerald-glow">
                      {depositCurrency} {Number(depositAmount).toFixed(2)}
                    </strong>{" "}
                    a estos datos y luego mándanos el comprobante por WhatsApp.
                  </p>

                  {bank ? (
                    <div className="mt-5 space-y-2">
                      <BankRow label="Banco" value={bank.bank_name} onCopy={copyToClipboard} copiedKey={copied} />
                      <BankRow label="Titular" value={bank.account_holder} onCopy={copyToClipboard} copiedKey={copied} />
                      <BankRow label="Tipo de cuenta" value={bank.account_type} onCopy={copyToClipboard} copiedKey={copied} />
                      <BankRow label="Número de cuenta" value={bank.account_number} onCopy={copyToClipboard} copiedKey={copied} />
                      <BankRow label="Identificación" value={bank.identification} onCopy={copyToClipboard} copiedKey={copied} />
                      <BankRow label="Email" value={bank.email} onCopy={copyToClipboard} copiedKey={copied} />
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-muted">Cargando datos bancarios...</p>
                  )}

                  <div className="mt-5 rounded-xl border border-gold-warm/30 bg-gold-warm/10 p-4 text-xs leading-relaxed text-bone/85">
                    <strong className="text-gold-soft">Importante:</strong> tu cupo queda
                    pre-reservado por 24h. Si no recibimos el comprobante en ese tiempo, el cupo
                    se libera. Envíalo a:
                  </div>

                  <a
                    href={whatsappProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-brand text-sm font-medium text-ink-900 shadow-glow-emerald hover:bg-emerald-glow"
                  >
                    <MessageCircle className="size-4" />
                    Enviar comprobante por WhatsApp
                  </a>

                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full border border-white/10 text-xs text-bone/70 hover:border-bone/30 hover:text-bone"
                  >
                    Cerrar
                  </button>
                </div>
              )}

              {step === "payphone_placeholder" && (
                <div>
                  <div className="grid size-12 place-items-center rounded-full border border-emerald-brand/40 bg-emerald-deep/40">
                    <CreditCard className="size-5 text-emerald-glow" strokeWidth={1.6} />
                  </div>
                  <h4 className="font-display mt-4 text-xl text-bone">
                    Pago con PayPhone
                  </h4>
                  <p className="mt-2 text-sm text-bone/75 leading-relaxed">
                    Estamos terminando la integración con PayPhone para pagos instantáneos
                    con tarjeta. Por ahora, tu reserva quedó <strong className="text-bone">guardada como pendiente</strong>.
                  </p>
                  <p className="mt-3 text-sm text-bone/75 leading-relaxed">
                    Te escribimos por WhatsApp para completar el pago en los próximos minutos.
                    O puedes optar por transferencia.
                  </p>

                  <div className="mt-5 flex gap-3">
                    <a
                      href={whatsappProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-emerald-brand text-sm font-medium text-ink-900 shadow-glow-emerald hover:bg-emerald-glow"
                    >
                      <MessageCircle className="size-4" />
                      Escríbenos por WhatsApp
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep("method")}
                    className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full border border-white/10 text-xs text-bone/70 hover:border-bone/30 hover:text-bone"
                  >
                    Cambiar a transferencia
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BankRow({
  label,
  value,
  onCopy,
  copiedKey,
}: {
  label: string;
  value: string | null;
  onCopy: (text: string, label: string) => void;
  copiedKey: string | null;
}) {
  if (!value) return null;
  const isCopied = copiedKey === label;
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-eyebrow text-muted">{label}</p>
        <p className="mt-0.5 truncate text-sm text-bone">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => onCopy(value, label)}
        aria-label={`Copiar ${label}`}
        className="grid size-9 flex-shrink-0 place-items-center rounded-full border border-white/10 text-bone/70 transition-colors hover:border-emerald-brand/50 hover:text-emerald-glow"
      >
        {isCopied ? <Check className="size-4 text-emerald-glow" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}
