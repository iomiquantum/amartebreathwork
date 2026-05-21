// CorporatePricing — Sección de inversión transparente para /corporativo
// Filosofía: sin paquetes prefabricados. Un solo "desde" que comunica accesibilidad
// y deja espacio para que cada empresa cotice según su realidad.

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Headphones,
  UserCheck,
  FileText,
  Sparkles,
  Clock4,
  Infinity as InfinityIcon,
} from "lucide-react";

const INCLUDES = [
  {
    icon: Headphones,
    title: "Sesión inmersiva completa",
    body: "60-90 min con audífonos individuales, sonido envolvente profesional y guía paso a paso.",
  },
  {
    icon: UserCheck,
    title: "Guía AMARTE certificado",
    body: "Equipo entrenado en regulación del sistema nervioso. Sin improvisación, sin riesgo.",
  },
  {
    icon: Sparkles,
    title: "Equipo desplazado a ti",
    body: "Llevamos todo (audífonos, sonido, ambientación) a tu oficina, hotel o venue. Sin costo extra.",
  },
  {
    icon: FileText,
    title: "Reporte cualitativo post-sesión",
    body: "Testimonios reales, momentos clave y recomendaciones específicas para tu equipo.",
  },
  {
    icon: Clock4,
    title: "Acompañamiento humano + tecnológico",
    body: "Check-in personal a los 7 días + acceso a frecuencias y respiraciones guiadas para sostener el estado.",
  },
  {
    icon: InfinityIcon,
    title: "Cotización personalizada en 24h",
    body: "Sin formularios eternos, sin call de descubrimiento de una hora. Te respondemos rápido y claro.",
  },
];

export function CorporatePricing() {
  return (
    <section id="inversion" className="relative bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-orange opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />

      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-[10px] uppercase tracking-eyebrow text-orange-brand">
            Inversión
          </span>
          <h2 className="h-display mt-4 text-4xl sm:text-5xl text-balance">
            No es un evento.{" "}
            <span className="bg-gradient-to-r from-orange-brand via-orange-glow to-gold-warm bg-clip-text text-transparent">
              Es una intervención.
            </span>
          </h2>
          <p className="lede mt-5">
            No vendemos paquetes prefabricados. Tu inversión se diseña según el reto real
            de tu equipo, no según un menú estándar.
          </p>
        </div>

        {/* Card central de pricing */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-14 max-w-3xl"
        >
          <div className="gradient-border rounded-[2rem] bg-ink-900 p-8 sm:p-12">
            <div className="flex flex-col items-center text-center">
              <span className="text-[10px] uppercase tracking-eyebrow text-gold-warm">
                Desde
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-7xl tabular-nums tracking-tightest text-bone sm:text-8xl">
                  $32
                </span>
                <span className="font-display text-2xl text-bone/60 sm:text-3xl">USD</span>
              </div>
              <p className="mt-2 text-sm uppercase tracking-eyebrow text-bone/60">
                por persona
              </p>

              <p className="mt-6 max-w-xl text-base text-bone/80 leading-relaxed sm:text-lg">
                A más personas en tu equipo,{" "}
                <span className="text-orange-glow font-medium">menor costo por persona.</span>
                <br />
                <span className="text-bone/60 text-sm sm:text-base">
                  Cotizamos sobre objetivos, tamaño y formato — no sobre tarifa fija.
                </span>
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#cotizar"
                  className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-orange-brand px-8 text-base font-medium text-ink-900 shadow-glow-orange transition-all hover:bg-orange-glow hover:shadow-glow-orange-strong"
                >
                  Cotizar para mi equipo
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href="#beneficios"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-white/15 px-7 text-base text-bone transition-colors hover:border-orange-brand/60 hover:text-orange-glow"
                >
                  Ver qué incluye
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lo que SIEMPRE incluye */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="text-center">
            <span className="inline-block text-[10px] uppercase tracking-eyebrow text-orange-brand">
              Lo que siempre incluye
            </span>
            <h3 className="font-display mt-3 text-2xl text-bone sm:text-3xl">
              Sin sorpresas, sin letra pequeña, sin costos ocultos
            </h3>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDES.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="card-dark group flex gap-4 p-5 transition-all hover:border-orange-brand/30"
                >
                  <div className="grid size-10 flex-shrink-0 place-items-center rounded-xl border border-orange-brand/40 bg-orange-deep/40 text-orange-glow">
                    <Icon className="size-4" strokeWidth={1.7} />
                  </div>
                  <div>
                    <div className="flex items-start gap-1.5">
                      <Check className="mt-0.5 size-4 flex-shrink-0 text-orange-brand" strokeWidth={2} />
                      <h4 className="font-display text-base text-bone leading-snug">
                        {item.title}
                      </h4>
                    </div>
                    <p className="mt-2 pl-5 text-sm text-bone/70 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Disclaimer custom enterprise */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 rounded-2xl border border-gold-warm/20 bg-gold-warm/[0.04] p-6 text-center sm:p-7"
          >
            <p className="text-sm text-bone/80 sm:text-base">
              <span className="text-gold-warm">Para grupos de 100+ o programas anuales:</span>{" "}
              cotizamos sobre objetivos específicos del año.
              <br className="hidden sm:block" />
              Sin techo, sin paquete fijo —{" "}
              <a href="#cotizar" className="text-orange-glow underline underline-offset-4">
                cuéntanos qué tienes en mente
              </a>
              .
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
