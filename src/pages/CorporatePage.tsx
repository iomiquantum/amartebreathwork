// CorporatePage — Landing dedicada para sesiones corporativas (ruta /corporativo)
// Target: empresas que quieren contratar AMARTE para sus equipos.
// Pauta digital puede apuntar directo aquí (B2B campaigns).

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  TrendingUp,
  Heart,
  Brain,
  Users,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Mail,
  Briefcase,
  Target,
  Plus,
  Minus,
} from "lucide-react";
import { PageMeta } from "../components/PageMeta";
import { submitCorporateInquiry, isValidEmail } from "../lib/supabase";
import { trackLeadFormSubmit, trackPageView } from "../lib/tracking";
import { COUNTRIES, DEFAULT_COUNTRY, type Country } from "../data/countries";
import { siteConfig } from "../data/siteConfig";
import { CorporateComparison } from "./corporativo/CorporateComparison";
import { CorporateAfterCare } from "./corporativo/CorporateAfterCare";
import { CorporatePricing } from "./corporativo/CorporatePricing";
import "./corporativo/corporate-theme.css";

// ============================================
// CONTENIDO
// ============================================

const STATS = [
  { value: "78%", label: "del equipo reporta estrés laboral crónico", source: "OMS 2023" },
  { value: "1 en 4", label: "considera renunciar por burnout", source: "Gallup" },
  { value: "23%", label: "más productividad post-experiencia de regulación", source: "estudios neurociencia" },
  { value: "60 min", label: "es lo que tu equipo necesita para volver a respirar", source: "AMARTE" },
];

const BENEFITS = [
  {
    icon: Brain,
    title: "Reducción de estrés inmediata",
    body: "Una sola sesión activa el sistema parasimpático. Tu equipo sale con cortisol más bajo, mente más clara y cuerpo descomprimido.",
  },
  {
    icon: Heart,
    title: "Mayor cohesión de equipo",
    body: "Vivir una experiencia inmersiva juntos crea conexión real — más allá del happy hour o el coffee break.",
  },
  {
    icon: TrendingUp,
    title: "Productividad sostenida",
    body: "Equipos regulados toman mejores decisiones, se comunican mejor y resuelven conflictos con más calma.",
  },
  {
    icon: Sparkles,
    title: "Beneficio diferencial",
    body: "Atrae y retén talento de alto nivel. Hoy buscan empresas que cuiden su salud mental, no solo el sueldo.",
  },
  {
    icon: Users,
    title: "Inclusivo y sin requisitos",
    body: "No necesitan saber meditar, ni estar en forma. Solo respirar y escuchar. 100% del equipo puede participar.",
  },
  {
    icon: Heart,
    title: "Métricas reales post-evento",
    body: "Recibes reporte cualitativo del impacto: testimonios, momentos clave, recomendaciones para próximos eventos.",
  },
];

const USE_CASES = [
  { title: "Offsite anual", body: "Cerrar el día con una experiencia que todos recordarán todo el año." },
  { title: "Team building diferente", body: "Sin trust falls ni dinámicas forzadas. Solo presencia compartida real." },
  { title: "Fin de trimestre", body: "Soltar la carga del Q antes de arrancar el próximo. Reset colectivo." },
  { title: "Reorganización / cambios", body: "Cuando hay reestructuras, fusiones o pivots. El cuerpo del equipo necesita procesarlo." },
  { title: "Onboarding C-level", body: "Para alinear cultura y energía con nuevo liderazgo." },
  { title: "Pre-evento importante", body: "Antes de un keynote, lanzamiento o cierre de venta crítico. Llegada en estado óptimo." },
];

const PROCESS = [
  { n: "01", title: "Conversemos", body: "Cuéntanos sobre tu equipo, sus retos actuales, qué buscas. Cotización personalizada en 24h." },
  { n: "02", title: "Diseñamos la sesión", body: "Adaptamos formato, intensidad y duración según tu objetivo y tamaño del equipo." },
  { n: "03", title: "Llevamos AMARTE", body: "Nosotros llevamos todo: audífonos, sonido, ambiente, guía. Tú solo aseguras el espacio." },
  { n: "04", title: "Tu equipo respira", body: "60-90 min de experiencia inmersiva diseñada para regulación y conexión real." },
  { n: "05", title: "Reporte post-evento", body: "Te entregamos análisis cualitativo del impacto, testimonios y recomendaciones." },
];

const FAQS = [
  {
    q: "¿Cuántas personas mínimo / máximo?",
    a: "Mínimo 8 personas para que justifique el setup. Máximo 40 por sesión para mantener calidad. Si tu equipo es más grande, hacemos múltiples sesiones.",
  },
  {
    q: "¿Necesitamos un lugar especial?",
    a: "Cualquier espacio cerrado donde quepan colchonetas o sillas reclinables sirve. Salas grandes, lobbies, oficinas con espacio amplio, hoteles, fincas. Si no tienes lugar, te recomendamos venues aliados.",
  },
  {
    q: "¿Cuánto cuesta una sesión corporativa?",
    a: "Depende de tamaño del equipo, ubicación y formato. El rango típico es $30-60 USD por persona. Cotización personalizada en 24h tras tu solicitud.",
  },
  {
    q: "¿Lo pueden hacer fuera de Quito?",
    a: "Sí. Llevamos AMARTE a Guayaquil, Cuenca, Loja, Manta y otras ciudades. También internacional en casos especiales (corporativos regionales).",
  },
  {
    q: "¿Es seguro para personas con condiciones médicas?",
    a: "La respiración guiada es suave (no es Wim Hof intenso). Compartimos un formulario previo donde participantes con condiciones específicas pueden consultarnos. En general, es accesible para todos.",
  },
  {
    q: "¿Cuánto tiempo dura?",
    a: "La experiencia central dura 60-90 minutos. Total con setup, llegada y cierre: 2 horas aproximadamente.",
  },
  {
    q: "¿Puedo combinarlo con un evento más grande?",
    a: "Sí, somos un módulo perfecto para offsites, retiros corporativos o convenciones. Trabajamos con organizadores y agencias de eventos.",
  },
  {
    q: "¿Hay opción online para equipos remotos?",
    a: "Sí. Diseñamos sesiones online en vivo desde nuestro estudio con calidad profesional. Cada participante necesita audífonos.",
  },
];

const COMPANY_SIZES = ["8-15 personas", "16-40 personas", "41-80 personas", "80-150 personas", "150+ personas"];
const GOALS = [
  { value: "bienestar", label: "Bienestar / Salud mental del equipo" },
  { value: "team_building", label: "Team building diferente" },
  { value: "offsite", label: "Offsite / Retiro anual" },
  { value: "retencion", label: "Retención de talento" },
  { value: "burnout", label: "Prevenir burnout post-período intenso" },
  { value: "lanzamiento", label: "Pre o post lanzamiento importante" },
  { value: "otro", label: "Otro / Conversémoslo" },
];

// ============================================
// COMPONENTE
// ============================================

export function CorporatePage() {
  // SEO + tracking + tema visual orange aplicado al body para que el Header
  // y demás componentes globales respeten la paleta del vertical B2B.
  useEffect(() => {
    document.title = "AMARTE Corporativo · Breathwork para empresas en Ecuador";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Experiencias inmersivas de breathwork para equipos empresariales. Reducción de estrés, cohesión, productividad. Sesiones presenciales en Ecuador + online. Cotización personalizada."
      );
    }
    document.body.setAttribute("data-vertical", "corporate");
    trackPageView();
    window.scrollTo(0, 0);

    return () => {
      document.body.removeAttribute("data-vertical");
    };
  }, []);

  return (
    <main className="bg-ink text-bone antialiased">
      <PageMeta
        title="AMARTE Corporativo · Breathwork para empresas en Ecuador"
        description="Experiencias inmersivas de breathwork para equipos empresariales. Reducción de estrés, cohesión, productividad. Sesiones presenciales en Ecuador + online. Cotización personalizada."
        path="/corporativo"
      />
      <CorporateHero />
      <CorporateStats />
      <CorporateBenefits />
      <CorporateComparison />
      <CorporateUseCases />
      <CorporateProcess />
      <CorporateLogistics />
      <CorporateAfterCare />
      <CorporatePricing />
      <CorporateFAQ />
      <CorporateForm />
      <CorporateFinalCTA />
    </main>
  );
}

// ============================================
// HERO
// ============================================

function CorporateHero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink pb-20 pt-28 sm:pt-32 lg:pb-28">
      <div className="pointer-events-none absolute inset-0 bg-radial-orange opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />

      <div className="container-x relative">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-orange-brand/30 bg-orange-deep/30 px-4 py-1.5 text-xs sm:text-[10px] uppercase tracking-eyebrow text-orange-glow"
            >
              <Building2 className="size-3" /> Para empresas
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="h-display mt-5 text-[2.6rem] leading-[0.95] sm:text-6xl lg:text-7xl text-balance"
            >
              Tu equipo no está cansado.
              <br />
              <span className="bg-gradient-to-r from-orange-brand via-orange-glow to-gold-warm bg-clip-text text-transparent">
                Su sistema nervioso está saturado.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lede mt-6 max-w-2xl"
            >
              Llevamos AMARTE a tu empresa: una experiencia inmersiva de respiración, sonido y
              frecuencias diseñada para que tu equipo vuelva a su mejor versión — más calmado,
              más conectado, más productivo.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <a
                href="#cotizar"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-orange-brand px-8 text-base font-medium text-ink-900 shadow-glow-orange transition-all hover:bg-orange-glow hover:shadow-glow-orange-strong"
              >
                Cotizar para mi equipo
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#beneficios"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/15 px-7 text-base text-bone transition-colors hover:border-orange-brand/60 hover:text-orange-glow"
              >
                Ver beneficios
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-bone/70"
            >
              <a href="#inversion" className="inline-flex items-center gap-2 transition-colors hover:text-orange-glow">
                <span className="text-orange-glow font-medium">Desde $32 USD</span>
                <span className="text-bone/50">/ persona</span>
              </a>
              <span className="inline-flex items-center gap-2">
                <Sparkles className="size-3.5 text-gold-warm" />
                Cotización en 24h
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-3.5 text-orange-brand" />
                Todo Ecuador + online
              </span>
            </motion.div>
          </div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2rem] gradient-border bg-ink">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-deep/40 via-ink-900 to-ink" />
              <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />

              {/* Grid de dots representando equipo */}
              <div className="absolute inset-0 grid place-items-center p-10">
                <div className="grid grid-cols-6 gap-3">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.7 }}
                      transition={{ duration: 0.5, delay: i * 0.03, type: "spring" }}
                      className="size-3 rounded-full bg-orange-brand"
                      style={{ boxShadow: "0 0 12px rgba(0,200,150,0.5)" }}
                    />
                  ))}
                </div>
              </div>

              {/* Labels */}
              <div className="absolute left-5 top-5 flex items-center gap-2 text-xs sm:text-[10px] uppercase tracking-eyebrow text-bone/60">
                <Building2 className="size-3 text-orange-brand" /> Sesión privada
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-xs sm:text-[10px] uppercase tracking-eyebrow text-bone/60">
                <span>Equipo completo</span>
                <span className="text-orange-brand">● Respirando juntos</span>
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

function CorporateStats() {
  return (
    <section className="relative border-y border-white/[0.06] bg-ink-900/60 py-14 sm:py-16">
      <div className="container-x">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="font-display text-4xl tabular-nums text-orange-glow sm:text-5xl">
                {s.value}
              </p>
              <p className="mt-3 text-sm text-bone/85 leading-snug">{s.label}</p>
              <p className="mt-1 text-xs sm:text-[10px] uppercase tracking-eyebrow text-muted">{s.source}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// BENEFITS
// ============================================

function CorporateBenefits() {
  return (
    <section id="beneficios" className="relative bg-ink py-24 sm:py-32">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-xs sm:text-[10px] uppercase tracking-eyebrow text-orange-brand">
            Beneficios
          </span>
          <h2 className="h-display mt-4 text-4xl sm:text-5xl text-balance">
            Lo que tu equipo gana en{" "}
            <span className="bg-gradient-to-r from-orange-brand to-gold-warm bg-clip-text text-transparent">
              una sola sesión.
            </span>
          </h2>
          <p className="lede mt-5">
            No es team building genérico. Es regulación real del sistema nervioso colectivo.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.06 }}
                className="card-dark group p-7 transition-all hover:border-orange-brand/30"
              >
                <div className="grid size-12 place-items-center rounded-2xl border border-orange-brand/40 bg-orange-deep/40 text-orange-glow">
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
// USE CASES
// ============================================

function CorporateUseCases() {
  return (
    <section className="relative bg-ink-900 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-40" />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-xs sm:text-[10px] uppercase tracking-eyebrow text-gold-warm">
            Cuándo lo necesitas
          </span>
          <h2 className="h-display mt-4 text-3xl sm:text-5xl text-balance">
            Momentos donde AMARTE{" "}
            <span className="bg-gradient-to-r from-gold-warm to-orange-brand bg-clip-text text-transparent">
              cambia el ritmo.
            </span>
          </h2>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((u, i) => (
            <motion.div
              key={u.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-gold-warm/30 hover:bg-white/[0.04]"
            >
              <h3 className="font-display text-lg text-bone">{u.title}</h3>
              <p className="mt-2 text-sm text-bone/70 leading-relaxed">{u.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// PROCESS
// ============================================

function CorporateProcess() {
  return (
    <section className="relative bg-ink py-24 sm:py-32">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-xs sm:text-[10px] uppercase tracking-eyebrow text-orange-brand">
            Cómo trabajamos
          </span>
          <h2 className="h-display mt-4 text-3xl sm:text-5xl text-balance">
            De la primera llamada{" "}
            <span className="bg-gradient-to-r from-orange-brand to-gold-warm bg-clip-text text-transparent">
              a tu equipo respirando.
            </span>
          </h2>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-orange-brand/0 via-orange-brand/40 to-orange-brand/0 sm:block lg:left-1/2" />

          <ol className="space-y-10 sm:space-y-12">
            {PROCESS.map((step, i) => {
              const isRight = i % 2 === 1;
              return (
                <motion.li
                  key={step.n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8 lg:gap-12"
                >
                  <div className={`relative z-10 sm:flex-shrink-0 ${isRight ? "lg:order-2 lg:ml-auto" : ""}`}>
                    <div className="grid size-12 place-items-center rounded-full border border-orange-brand/40 bg-ink-900 font-display text-base text-orange-glow shadow-glow-orange">
                      {step.n}
                    </div>
                  </div>
                  <div className={`card-dark relative w-full p-6 sm:p-7 lg:max-w-xl ${isRight ? "lg:mr-auto" : "lg:ml-auto"}`}>
                    <h3 className="font-display text-xl text-bone sm:text-2xl">{step.title}</h3>
                    <p className="mt-3 text-bone/70 leading-relaxed">{step.body}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

// ============================================
// LOGISTICS
// ============================================

function CorporateLogistics() {
  const items = [
    { icon: Users, label: "Tamaño", value: "8 - 40 personas (más en múltiples sesiones)" },
    { icon: Clock, label: "Duración", value: "60-90 min (total 2h con setup)" },
    { icon: MapPin, label: "Lugar", value: "Tu oficina, hotel, finca, o venue aliado" },
    { icon: Headphones, label: "Equipo", value: "Llevamos audífonos individuales + sonido pro" },
    { icon: Calendar, label: "Agenda", value: "Día/horario que mejor funcione para tu equipo" },
    { icon: Sparkles, label: "Modalidad", value: "Presencial · Online · Híbrido" },
  ];

  return (
    <section className="relative bg-ink-900 py-24 sm:py-32">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-xs sm:text-[10px] uppercase tracking-eyebrow text-orange-brand">
            Logística
          </span>
          <h2 className="h-display mt-4 text-3xl sm:text-5xl text-balance">
            Tú solo aseguras el espacio.
            <br />
            <span className="text-orange-glow">El resto lo llevamos nosotros.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="card-dark flex flex-col gap-3 p-6"
              >
                <Icon className="size-5 text-orange-brand" strokeWidth={1.6} />
                <div>
                  <p className="text-xs sm:text-[10px] uppercase tracking-eyebrow text-muted">{item.label}</p>
                  <p className="mt-1.5 font-display text-lg text-bone">{item.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FAQ
// ============================================

function CorporateFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative bg-ink py-24 sm:py-32">
      <div className="container-tight">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-xs sm:text-[10px] uppercase tracking-eyebrow text-orange-brand">
            Preguntas frecuentes
          </span>
          <h2 className="h-display mt-4 text-3xl sm:text-4xl text-balance">
            Lo que las empresas suelen preguntar
          </h2>
        </div>

        <div className="mt-12 divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015]">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-white/[0.025]"
                >
                  <span className="text-base font-medium text-bone sm:text-lg">{f.q}</span>
                  <span
                    className={`grid size-9 flex-shrink-0 place-items-center rounded-full border border-white/10 transition-all duration-300 ${
                      isOpen ? "rotate-45 border-orange-brand/50 bg-orange-deep/40 text-orange-glow" : "text-bone/70"
                    }`}
                  >
                    {isOpen ? <Minus className="size-4" strokeWidth={1.8} /> : <Plus className="size-4" strokeWidth={1.8} />}
                  </span>
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 pr-16 text-sm text-bone/80 leading-relaxed sm:text-base">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FORM B2B
// ============================================

function CorporateForm() {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [estimatedPeople, setEstimatedPeople] = useState("");
  const [estimatedDate, setEstimatedDate] = useState("");
  const [city, setCity] = useState("");
  const [format, setFormat] = useState<"presencial" | "online" | "hibrido" | "no_definido">("presencial");
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const canSubmit = useMemo(
    () =>
      contactName.trim().length > 1 &&
      isValidEmail(contactEmail) &&
      companyName.trim().length > 1 &&
      status !== "loading",
    [contactName, contactEmail, companyName, status]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");
    setError("");

    const cleanPhone = contactWhatsapp.replace(/\D/g, "");
    const phoneFull = cleanPhone ? `+${country.code}${cleanPhone}` : undefined;

    const res = await submitCorporateInquiry({
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      contactRole: contactRole.trim() || undefined,
      contactWhatsapp: phoneFull,
      contactCountryCode: country.code,
      companyName: companyName.trim(),
      companySize: companySize || undefined,
      format,
      city: city.trim() || undefined,
      estimatedDate: estimatedDate || undefined,
      estimatedPeople: estimatedPeople ? parseInt(estimatedPeople, 10) : undefined,
      primaryGoal: primaryGoal || undefined,
      message: message.trim() || undefined,
      honeypot,
    });

    if (res.ok) {
      setStatus("success");
      trackLeadFormSubmit({ source: "corporate_inquiry", company: companyName });
    } else {
      setStatus("error");
      setError(res.error ?? "No pudimos enviar tu solicitud. Intenta de nuevo.");
    }
  }

  if (status === "success") {
    return (
      <section id="cotizar" className="relative bg-ink-900 py-24 sm:py-32">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl rounded-3xl gradient-border p-10 text-center"
          >
            <div className="mx-auto grid size-16 place-items-center rounded-full border border-orange-brand/40 bg-orange-deep/40">
              <CheckCircle2 className="size-8 text-orange-glow" strokeWidth={1.6} />
            </div>
            <h3 className="font-display mt-6 text-3xl text-bone">
              Recibimos tu solicitud, {contactName.split(" ")[0]}.
            </h3>
            <p className="mt-4 text-bone/80 leading-relaxed">
              Vamos a revisarla y te respondemos en <strong className="text-orange-glow">menos de 24 horas</strong> a{" "}
              <strong className="text-bone">{contactEmail}</strong> con una propuesta personalizada
              para {companyName}.
            </p>
            <p className="mt-3 text-sm text-muted">
              Si necesitas algo urgente, escríbenos directo a{" "}
              <a href={`mailto:${siteConfig.contactEmail}`} className="py-0.5 text-orange-glow underline">
                {siteConfig.contactEmail}
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="cotizar" className="relative bg-ink-900 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-orange opacity-30" />
      <div className="container-tight relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-xs sm:text-[10px] uppercase tracking-eyebrow text-orange-brand">
            Cotización
          </span>
          <h2 className="h-display mt-4 text-3xl sm:text-5xl text-balance">
            Cuéntanos sobre tu equipo.
          </h2>
          <p className="lede mt-5">
            Te respondemos en <strong className="text-orange-glow">menos de 24h</strong> con una
            propuesta personalizada. Sin presión, sin compromiso.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto mt-12 max-w-2xl">
          {/* Honeypot */}
          <div style={{ position: "absolute", left: "-9999px" }} aria-hidden>
            <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>

          <div className="gradient-border rounded-3xl bg-ink-900 p-7 sm:p-10">
            {/* Sección: Empresa */}
            <div className="mb-7">
              <div className="flex items-center gap-2 text-xs sm:text-[10px] uppercase tracking-eyebrow text-orange-brand">
                <Briefcase className="size-3.5" /> Sobre tu empresa
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field id="company_name" label="Empresa" required value={companyName} onChange={setCompanyName} placeholder="Nombre de la empresa" />
                <SelectField id="company_size" label="Tamaño aprox." value={companySize} onChange={setCompanySize}>
                  <option value="">Selecciona...</option>
                  {COMPANY_SIZES.map((s) => (
                    <option key={s} value={s} className="bg-ink-900">{s}</option>
                  ))}
                </SelectField>
              </div>
            </div>

            {/* Sección: Sobre la sesión */}
            <div className="mb-7">
              <div className="flex items-center gap-2 text-xs sm:text-[10px] uppercase tracking-eyebrow text-orange-brand">
                <Target className="size-3.5" /> Sobre la sesión
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field id="estimated_people" label="Personas estimadas" type="number" value={estimatedPeople} onChange={setEstimatedPeople} placeholder="ej. 25" />
                <Field id="estimated_date" label="Fecha tentativa" type="date" value={estimatedDate} onChange={setEstimatedDate} />
              </div>

              <div className="mt-4">
                <label className="text-xs uppercase tracking-eyebrow text-bone/60">Modalidad</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {([
                    { v: "presencial", l: "Presencial" },
                    { v: "online", l: "Online" },
                    { v: "hibrido", l: "Híbrido" },
                    { v: "no_definido", l: "Por definir" },
                  ] as const).map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setFormat(opt.v)}
                      className={`rounded-full border px-4 py-2 text-xs transition-all ${
                        format === opt.v
                          ? "border-orange-brand/50 bg-orange-deep/50 text-orange-glow"
                          : "border-white/10 bg-white/[0.02] text-bone/80 hover:border-white/20"
                      }`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>

              {format !== "online" && (
                <div className="mt-4">
                  <Field id="city" label="Ciudad (si presencial)" value={city} onChange={setCity} placeholder="Quito, Guayaquil…" />
                </div>
              )}

              <div className="mt-4">
                <label className="text-xs uppercase tracking-eyebrow text-bone/60">Objetivo principal</label>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {GOALS.map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => setPrimaryGoal(g.value === primaryGoal ? "" : g.value)}
                      className={`rounded-xl border px-4 py-3 text-left text-xs transition-all ${
                        primaryGoal === g.value
                          ? "border-orange-brand/50 bg-orange-deep/30 text-orange-glow"
                          : "border-white/10 bg-white/[0.02] text-bone/80 hover:border-white/20"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sección: Tu contacto */}
            <div className="mb-7">
              <div className="flex items-center gap-2 text-xs sm:text-[10px] uppercase tracking-eyebrow text-orange-brand">
                <Mail className="size-3.5" /> Tus datos de contacto
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field id="contact_name" label="Nombre" required value={contactName} onChange={setContactName} placeholder="Tu nombre" />
                <Field id="contact_role" label="Cargo" value={contactRole} onChange={setContactRole} placeholder="HR Manager, CEO, etc." />
                <Field id="contact_email" label="Email" type="email" required value={contactEmail} onChange={setContactEmail} placeholder="tu@empresa.com" />

                <div>
                  <label htmlFor="contact_whatsapp" className="text-xs uppercase tracking-eyebrow text-bone/60">
                    WhatsApp (opcional)
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <select
                      value={country.code}
                      aria-label="País"
                      onChange={(e) => {
                        const c = COUNTRIES.find((x) => x.code === e.target.value);
                        if (c) setCountry(c);
                      }}
                      className="h-11 w-[5.5rem] rounded-xl border border-white/10 bg-white/[0.025] px-2 text-sm text-bone focus:border-orange-brand/50 focus:outline-none"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-ink-900">
                          {c.flag}+{c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      id="contact_whatsapp"
                      type="tel"
                      inputMode="numeric"
                      value={contactWhatsapp}
                      onChange={(e) => setContactWhatsapp(e.target.value)}
                      placeholder="número"
                      className="h-11 flex-1 rounded-xl border border-white/10 bg-white/[0.025] px-4 text-sm text-bone placeholder:text-muted/70 focus:border-orange-brand/50 focus:outline-none focus:ring-2 focus:ring-orange-brand/20"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="message" className="text-xs uppercase tracking-eyebrow text-bone/60">
                  Mensaje (opcional)
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Cuéntanos contexto, retos del equipo, fecha específica que tengas en mente, presupuesto, etc."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.025] p-4 text-sm text-bone placeholder:text-muted/70 focus:border-orange-brand/50 focus:outline-none focus:ring-2 focus:ring-orange-brand/20"
                />
              </div>
            </div>

            {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-orange-brand text-base font-medium text-ink-900 shadow-glow-orange transition-all hover:bg-orange-glow hover:shadow-glow-orange-strong disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "loading" ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  Enviar solicitud
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>

            <p className="mt-4 text-center text-xs text-muted">
              Te respondemos en menos de 24h. Sin compromiso. Sin spam.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

// ============================================
// FINAL CTA
// ============================================

function CorporateFinalCTA() {
  return (
    <section className="relative isolate overflow-hidden bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-orange" />
      <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-50" />

      <div className="container-tight relative text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="h-display text-4xl sm:text-6xl text-balance"
        >
          Tu equipo merece{" "}
          <span className="bg-gradient-to-r from-orange-brand via-orange-glow to-gold-warm bg-clip-text text-transparent">
            volver a respirar.
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="lede mx-auto mt-6 text-balance"
        >
          Una sesión puede cambiar el ritmo de tu equipo por meses. Hablemos.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10"
        >
          <a
            href="#cotizar"
            className="inline-flex h-14 items-center gap-2 rounded-full bg-orange-brand px-8 text-base font-medium text-ink-900 shadow-glow-orange-strong transition-all hover:bg-orange-glow"
          >
            <Building2 className="size-5" />
            Cotizar para mi empresa
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// HELPERS
// ============================================

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs uppercase tracking-eyebrow text-bone/60">
        {label}
        {required && <span className="ml-1 text-orange-brand">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 text-sm text-bone placeholder:text-muted/70 focus:border-orange-brand/50 focus:outline-none focus:ring-2 focus:ring-orange-brand/20"
      />
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs uppercase tracking-eyebrow text-bone/60">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-11 w-full rounded-xl border border-white/10 bg-white/[0.025] px-4 text-sm text-bone focus:border-orange-brand/50 focus:outline-none focus:ring-2 focus:ring-orange-brand/20"
      >
        {children}
      </select>
    </div>
  );
}
