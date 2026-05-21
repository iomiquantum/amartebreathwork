// GenderPage — shell parametrizado de las landings /mujeres y /hombres.
// Recibe `content: GenderContent` y renderiza todas las secciones.
// La paleta se controla vía content.themeClass (.theme-women / .theme-men).

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Minus,
  Plus,
  Quote,
  Sparkles,
} from "lucide-react";
import { submitGenderInquiry, isValidEmail, sanitizePhone } from "../../lib/supabase";
import { trackLeadFormSubmit, trackPageView } from "../../lib/tracking";
import { COUNTRIES, DEFAULT_COUNTRY, type Country } from "../../data/countries";
import type { GenderContent } from "./types";
// Activa overrides de paleta scoped a body[data-vertical="women|men"].
// Define CSS vars --color-primary y --color-secondary cuando se aplica
// .theme-women / .theme-men en body. Replica patrón de corporate-theme.css.
import "./gender-theme.css";

interface Props {
  content: GenderContent;
}

export function GenderPage({ content }: Props) {
  // SEO + tracking en cada montaje
  useEffect(() => {
    document.title = content.seoTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", content.seoDescription);
    }
    trackPageView();
    window.scrollTo(0, 0);
  }, [content.seoTitle, content.seoDescription]);

  // Activa la paleta del vertical en TODO el documento (incluye Header,
  // FloatingWhatsappButton, etc.) via data-vertical + theme class en body.
  // - data-vertical=women|men dispara los overrides CSS de gender-theme.css
  // - theme-women|men setea las CSS vars --color-primary / --color-secondary
  // Al desmontar (cambio de ruta) se limpia y la home vuelve al verde marca.
  useEffect(() => {
    const body = document.body;
    body.dataset.vertical = content.audience;
    body.classList.add(content.themeClass);
    return () => {
      delete body.dataset.vertical;
      body.classList.remove(content.themeClass);
    };
  }, [content.audience, content.themeClass]);

  return (
    <main className="bg-ink text-bone antialiased">
      <Hero content={content} />
      <Stats content={content} />
      <Problem content={content} />
      <Archetypes content={content} />
      <Science content={content} />
      <Experience content={content} />
      <LifeStages content={content} />
      <Benefits content={content} />
      <Guide content={content} />
      <FAQ content={content} />
      <InquiryForm content={content} />
      <FinalCTA content={content} />
      <InclusivityNote content={content} />
    </main>
  );
}

// ============================================
// HERO
// ============================================

function Hero({ content }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-ink pb-20 pt-28 sm:pt-32 lg:pb-28">
      <div className="pointer-events-none absolute inset-0 bg-radial-primary opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-radial-secondary opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />

      <div className="container-x relative">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-deep/30 px-4 py-1.5 text-[10px] uppercase tracking-eyebrow text-primary-glow"
            >
              <Sparkles className="size-3" /> {content.heroEyebrow}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="h-display mt-5 text-[2.6rem] leading-[0.95] sm:text-6xl lg:text-7xl text-balance"
            >
              {content.heroTitleLine1}
              <br />
              <span className="bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
                {content.heroTitleLine2}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lede mt-6 max-w-2xl"
            >
              {content.heroSubhead}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <a
                href="#form"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-medium text-ink-900 shadow-glow-primary transition-all hover:bg-primary-glow hover:shadow-glow-primary-strong"
              >
                {content.heroCtaPrimary}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#ciencia"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/15 px-7 text-base text-bone transition-colors hover:border-primary/60 hover:text-primary-glow"
              >
                {content.heroCtaSecondary}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-bone/70"
            >
              <span className="inline-flex items-center gap-2">
                <Sparkles className="size-3.5 text-secondary" />
                {content.heroBadgeLeft}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-3.5 text-primary" />
                {content.heroBadgeRight}
              </span>
            </motion.div>
          </div>

          {/* Visual abstracto — círculos concéntricos respirando */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2rem] gradient-border-primary bg-ink">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-deep/40 via-ink-900 to-ink" />
              <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />

              <div className="absolute inset-0 grid place-items-center">
                {[1, 2, 3, 4, 5].map((ring) => (
                  <motion.span
                    key={ring}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.4 - ring * 0.05 }}
                    transition={{ duration: 1.2, delay: ring * 0.15 }}
                    className="absolute aspect-square rounded-full border border-primary/30 animate-pulse-soft"
                    style={{
                      width: `${ring * 18}%`,
                      animationDelay: `${ring * 0.4}s`,
                    }}
                  />
                ))}
                <span className="size-3 rounded-full bg-primary shadow-glow-primary" />
              </div>

              <div className="absolute left-5 top-5 flex items-center gap-2 text-[10px] uppercase tracking-eyebrow text-bone/60">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                Respirando
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-[10px] uppercase tracking-eyebrow text-bone/60">
                <span>{content.heroVisualLabel}</span>
                <span className="text-primary">● en presente</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// STATS
// ============================================

function Stats({ content }: Props) {
  return (
    <section className="relative border-y border-white/[0.06] bg-ink-900/60 py-14 sm:py-16">
      <div className="container-x">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {content.stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="font-display text-4xl tabular-nums text-primary-glow sm:text-5xl">
                {s.value}
              </p>
              <p className="mt-3 text-sm text-bone/85 leading-snug">{s.label}</p>
              <p className="mt-1 text-[10px] uppercase tracking-eyebrow text-muted">{s.source}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// PROBLEM
// ============================================

function Problem({ content }: Props) {
  return (
    <section className="relative bg-ink py-24 sm:py-32">
      <div className="container-x">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block text-[10px] uppercase tracking-eyebrow text-primary">
            {content.problemEyebrow}
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="h-display mt-4 text-4xl sm:text-5xl text-balance"
          >
            {content.problemTitle}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {content.problemTitleHighlight}
            </span>
          </motion.h2>

          <ul className="mt-10 space-y-5">
            {content.problemBullets.map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-4 text-base text-bone/80 leading-relaxed sm:text-lg"
              >
                <span className="mt-3 size-1.5 shrink-0 rounded-full bg-primary" />
                <span>{b}</span>
              </motion.li>
            ))}
          </ul>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display mt-12 text-2xl text-bone sm:text-3xl text-balance"
          >
            {content.problemClosing}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

// ============================================
// ARCHETYPES — perfiles concretos con stat
// ============================================

function Archetypes({ content }: Props) {
  return (
    <section className="relative bg-ink-900 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-secondary opacity-30" />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-[10px] uppercase tracking-eyebrow text-secondary">
            {content.archetypesEyebrow}
          </span>
          <h2 className="h-display mt-4 text-3xl sm:text-5xl text-balance">
            {content.archetypesTitle}{" "}
            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              {content.archetypesTitleHighlight}
            </span>
          </h2>
          <p className="lede mt-5">{content.archetypesLede}</p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.archetypes.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.article
                key={a.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.06 }}
                className="card-dark group relative flex flex-col p-7 transition-all hover:border-primary/30"
              >
                <div className="flex items-start gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-primary/40 bg-primary-deep/40 text-primary-glow">
                    <Icon className="size-5" strokeWidth={1.6} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-bone leading-tight">{a.name}</h3>
                    <p className="mt-0.5 text-[10px] uppercase tracking-eyebrow text-secondary">
                      {a.ageRange}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm text-bone/75 leading-relaxed">{a.profile}</p>

                <div className="mt-auto pt-5">
                  <div className="rounded-2xl border border-white/[0.08] bg-ink/60 p-4">
                    <p className="text-sm text-bone/80 leading-relaxed">{a.stat}</p>
                    <p className="mt-2 text-[10px] uppercase tracking-eyebrow text-muted">
                      {a.source}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// SCIENCE
// ============================================

function Science({ content }: Props) {
  return (
    <section id="ciencia" className="relative bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-secondary opacity-25" />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-[10px] uppercase tracking-eyebrow text-secondary">
            {content.scienceEyebrow}
          </span>
          <h2 className="h-display mt-4 text-3xl sm:text-5xl text-balance">
            {content.scienceTitle}{" "}
            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              {content.scienceTitleHighlight}
            </span>
          </h2>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {content.scienceCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.06 }}
                className="card-dark group p-7 transition-all hover:border-primary/30"
              >
                <div className="grid size-12 place-items-center rounded-2xl border border-primary/40 bg-primary-deep/40 text-primary-glow">
                  <Icon className="size-5" strokeWidth={1.6} />
                </div>
                <h3 className="font-display mt-5 text-xl text-bone">{c.title}</h3>
                <p className="mt-3 text-sm text-bone/70 leading-relaxed">{c.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// EXPERIENCE
// ============================================

function Experience({ content }: Props) {
  return (
    <section className="relative bg-ink-900 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-primary opacity-40" />
      <div className="container-x relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-block text-[10px] uppercase tracking-eyebrow text-primary">
              {content.experienceEyebrow}
            </span>
            <h2 className="h-display mt-4 text-4xl sm:text-5xl text-balance">
              {content.experienceTitle}{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {content.experienceTitleHighlight}
              </span>
            </h2>
            <p className="lede mt-5">{content.experienceLede}</p>
          </div>

          <ul className="space-y-4">
            {content.experienceBullets.map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-ink/60 p-4"
              >
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.6} />
                <span className="text-sm text-bone/85 leading-relaxed sm:text-base">{b}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ============================================
// LIFE STAGES (sub-segmentación clave)
// ============================================

function LifeStages({ content }: Props) {
  return (
    <section className="relative bg-ink py-24 sm:py-32">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-[10px] uppercase tracking-eyebrow text-secondary">
            {content.lifeStagesEyebrow}
          </span>
          <h2 className="h-display mt-4 text-3xl sm:text-5xl text-balance">
            {content.lifeStagesTitle}{" "}
            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              {content.lifeStagesTitleHighlight}
            </span>
          </h2>
          <p className="lede mt-5">{content.lifeStagesLede}</p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.lifeStages.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.07 }}
                className="card-dark group relative overflow-hidden p-7 transition-all hover:border-secondary/30"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-xl border border-secondary/40 bg-secondary/10 text-secondary">
                    <Icon className="size-5" strokeWidth={1.6} />
                  </div>
                  <span className="text-[10px] uppercase tracking-eyebrow text-secondary">
                    {stage.badge}
                  </span>
                </div>
                <h3 className="font-display mt-5 text-xl text-bone">{stage.title}</h3>
                <p className="mt-3 text-sm text-bone/70 leading-relaxed">{stage.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// BENEFITS
// ============================================

function Benefits({ content }: Props) {
  return (
    <section className="relative bg-ink-900 py-24 sm:py-32">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-[10px] uppercase tracking-eyebrow text-primary">
            {content.benefitsEyebrow}
          </span>
          <h2 className="h-display mt-4 text-3xl sm:text-5xl text-balance">
            {content.benefitsTitle}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {content.benefitsTitleHighlight}
            </span>
          </h2>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {content.benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.06 }}
                className="card-dark group p-7 transition-all hover:border-primary/30"
              >
                <div className="grid size-12 place-items-center rounded-2xl border border-primary/40 bg-primary-deep/40 text-primary-glow">
                  <Icon className="size-5" strokeWidth={1.6} />
                </div>
                <h3 className="font-display mt-5 text-xl text-bone">{b.title}</h3>
                <p className="mt-3 text-sm text-bone/70 leading-relaxed">{b.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// GUIDE
// ============================================

function Guide({ content }: Props) {
  return (
    <section className="relative bg-ink py-24 sm:py-32">
      <div className="container-x">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block text-[10px] uppercase tracking-eyebrow text-primary">
            {content.guideEyebrow}
          </span>
          <h2 className="h-display mt-4 text-3xl sm:text-4xl">{content.guideTitle}</h2>

          <motion.blockquote
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative mt-8 rounded-3xl border border-white/[0.08] bg-ink-900/60 p-8 sm:p-10"
          >
            <Quote className="absolute -top-4 left-8 size-8 text-secondary" strokeWidth={1.4} />
            <p className="font-display text-xl text-bone leading-relaxed sm:text-2xl">
              "{content.guideQuote}"
            </p>
            <footer className="mt-6 text-sm uppercase tracking-eyebrow text-bone/60">
              — Miguel · AMARTE
            </footer>
          </motion.blockquote>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FAQ
// ============================================

function FAQ({ content }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative bg-ink-900 py-24 sm:py-32">
      <div className="container-x">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="inline-block text-[10px] uppercase tracking-eyebrow text-secondary">
              {content.faqEyebrow}
            </span>
            <h2 className="h-display mt-4 text-3xl sm:text-5xl">{content.faqTitle}</h2>
          </div>

          <div className="mt-12 space-y-3">
            {content.faqs.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-2xl border border-white/[0.08] bg-ink/60 transition-colors hover:border-white/15"
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-base text-bone sm:text-lg">{item.q}</span>
                    <span className="grid size-7 shrink-0 place-items-center rounded-full border border-primary/40 text-primary-glow">
                      {isOpen ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
                    </span>
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.25 }}
                      className="px-6 pb-5 text-sm text-bone/75 leading-relaxed sm:text-base"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// INQUIRY FORM
// ============================================

type Status = "idle" | "submitting" | "success" | "error";

function InquiryForm({ content }: Props) {
  const cfg = content.formConfig;

  // Estado del form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [city, setCity] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [mainInterest, setMainInterest] = useState("");
  const [specific, setSpecific] = useState("");
  const [secondary, setSecondary] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => name.trim().length > 1 && whatsapp.trim().length >= 6 && status !== "submitting",
    [name, whatsapp, status]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("submitting");
    setErrorMsg(null);

    const cleanPhone = sanitizePhone(whatsapp, country.code);

    if (email && !isValidEmail(email)) {
      setErrorMsg("El correo no parece válido. Revísalo, por favor.");
      setStatus("error");
      return;
    }

    const result = await submitGenderInquiry({
      audience: content.audience,
      name: name.trim(),
      whatsapp: cleanPhone,
      email: email.trim() || undefined,
      countryCode: country.code,
      countryName: country.name,
      city: city.trim() || undefined,
      ageRange: ageRange || undefined,
      mainInterest: mainInterest || undefined,
      message: message.trim() || undefined,
      [cfg.specificField.key]: specific || undefined,
      [cfg.secondaryField.key]: secondary || undefined,
      honeypot: honeypot || undefined,
    });

    if (!result.ok) {
      setErrorMsg(result.error ?? "No pudimos enviar tu mensaje. Intenta de nuevo en un momento.");
      setStatus("error");
      return;
    }

    trackLeadFormSubmit({ source: content.trackingSource });
    setStatus("success");
  }

  if (status === "success") {
    return (
      <section id="form" className="relative bg-ink py-24 sm:py-32">
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl rounded-3xl border border-primary/30 bg-primary-deep/20 p-10 text-center"
          >
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary text-ink-900">
              <CheckCircle2 className="size-7" />
            </div>
            <h3 className="h-display mt-6 text-3xl sm:text-4xl">Recibido. Respira.</h3>
            <p className="mt-4 text-base text-bone/80 leading-relaxed">
              Miguel te escribe por WhatsApp en menos de 24 horas con la sesión que mejor se acomoda
              a tu cuerpo y tu momento. Si quieres adelantar, también puedes escribirnos directo.
            </p>
            <a
              href="/"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-7 text-sm text-bone transition-colors hover:border-primary/60 hover:text-primary-glow"
            >
              Volver al inicio
              <ArrowRight className="size-4" />
            </a>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="form" className="relative bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-primary opacity-30" />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="inline-block text-[10px] uppercase tracking-eyebrow text-primary">
              {content.formEyebrow}
            </span>
            <h2 className="h-display mt-4 text-3xl sm:text-5xl text-balance">
              {content.formTitle}{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {content.formTitleHighlight}
              </span>
            </h2>
            <p className="lede mt-5">{content.formLede}</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-12 grid gap-4 rounded-3xl border border-white/[0.08] bg-ink-900/60 p-6 sm:p-8"
          >
            {/* Honeypot anti-bot */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />

            {/* Nombre */}
            <Field label="Tu nombre *">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Cómo quieres que te llamemos"
                className={inputClass}
              />
            </Field>

            {/* Email */}
            <Field label="Correo (opcional)">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-bone/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </Field>

            {/* WhatsApp + país */}
            <Field label="WhatsApp *">
              <div className="flex gap-2">
                <select
                  value={country.code}
                  onChange={(e) => {
                    const found = COUNTRIES.find((c) => c.code === e.target.value);
                    if (found) setCountry(found);
                  }}
                  className={`${inputClass} w-32 shrink-0 cursor-pointer`}
                  aria-label="Código de país"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} +{c.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  required
                  inputMode="numeric"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Tu número"
                  className={`${inputClass} flex-1`}
                />
              </div>
            </Field>

            {/* Ciudad + edad */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Ciudad">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Quito, Cumbayá..."
                  className={inputClass}
                />
              </Field>
              <Field label="Edad">
                <select
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="">Selecciona...</option>
                  {content.ageRanges.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Campo específico del género (life_stage o main_goal) */}
            <Field label={cfg.specificField.label}>
              <select
                value={specific}
                onChange={(e) => setSpecific(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Selecciona...</option>
                {cfg.specificField.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>

            {/* Campo secundario (main_concern o exercise_frequency) */}
            <Field label={cfg.secondaryField.label}>
              <select
                value={secondary}
                onChange={(e) => setSecondary(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Selecciona...</option>
                {cfg.secondaryField.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>

            {/* Interés (qué tipo de sesión) */}
            <Field label="¿Qué te interesa más?">
              <select
                value={mainInterest}
                onChange={(e) => setMainInterest(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Selecciona...</option>
                {content.interests.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>

            {/* Mensaje libre */}
            <Field label="¿Algo que quieras contarnos? (opcional)">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Lo que sientas que necesitamos saber."
                className={`${inputClass} resize-none`}
              />
            </Field>

            {errorMsg && (
              <div
                role="alert"
                className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              >
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="group mt-2 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-medium text-ink-900 shadow-glow-primary transition-all hover:bg-primary-glow hover:shadow-glow-primary-strong disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  Enviar y respirar
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-bone/50">
              Tus datos son privados. Solo los lee Miguel y el equipo AMARTE.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-sm text-bone placeholder:text-bone/30 transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-eyebrow text-bone/60">
        {label}
      </span>
      {children}
    </label>
  );
}

// ============================================
// FINAL CTA
// ============================================

function FinalCTA({ content }: Props) {
  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-primary opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-radial-secondary opacity-25" />
      <div className="container-x relative text-center">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="h-display text-4xl sm:text-6xl text-balance"
        >
          {content.finalCtaTitle}
          <br />
          <span className="bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
            {content.finalCtaSubtitle}
          </span>
        </motion.h2>

        <motion.a
          href="#form"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="group mt-10 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-10 text-base font-medium text-ink-900 shadow-glow-primary transition-all hover:bg-primary-glow hover:shadow-glow-primary-strong"
        >
          {content.finalCtaButton}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </motion.a>
      </div>
    </section>
  );
}

// ============================================
// INCLUSIVITY NOTE
// ============================================

function InclusivityNote({ content }: Props) {
  return (
    <section className="border-t border-white/[0.06] bg-ink-900 py-10">
      <div className="container-x">
        <p className="mx-auto max-w-3xl text-center text-xs text-bone/50 leading-relaxed sm:text-sm">
          {content.inclusivityNote}
        </p>
      </div>
    </section>
  );
}
