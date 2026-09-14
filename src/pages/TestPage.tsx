// TestPage — Test del sistema nervioso (ruta /test)
// Página interactiva: test + comparación + para quién + captura.

import { useEffect, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { trackPageView } from "../lib/tracking";
import { PageMeta } from "../components/PageMeta";
import { SectionSkeleton } from "../components/SectionSkeleton";
import { NerveTest } from "../components/NerveTest";
import { useWhatsappCTA } from "../lib/whatsapp";
import { CTAButton } from "../components/CTAButton";

const Comparison = lazy(() =>
  import("../components/Comparison").then((m) => ({ default: m.Comparison }))
);
const ForWhoSection = lazy(() =>
  import("../components/ForWhoSection").then((m) => ({ default: m.ForWhoSection }))
);

export function TestPage() {
  const wa = useWhatsappCTA("final_cta");

  useEffect(() => {
    trackPageView();
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      <PageMeta
        title="Test del sistema nervioso · 6 preguntas, 2 minutos — AMARTE"
        description="¿Está tu sistema nervioso desregulado? Responde 6 preguntas en 2 minutos y descubre si AMARTE puede acompañarte. No es diagnóstico médico, es una guía rápida."
        path="/test"
      />
      {/* Hero compacto */}
      <section className="relative isolate overflow-hidden bg-ink pb-16 pt-32 sm:pt-36">
        <div className="pointer-events-none absolute inset-0 bg-radial-emerald opacity-60" />
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />

        <div className="container-tight relative">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-eyebrow text-bone/60 transition hover:text-bone"
          >
            <ArrowLeft className="size-3.5" />
            Volver al home
          </Link>

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="eyebrow mt-8 block"
          >
            Test · 2 minutos
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="h-display mt-4 text-4xl sm:text-6xl text-balance"
          >
            ¿Está tu sistema nervioso{" "}
            <span className="bg-gradient-to-r from-emerald-brand via-emerald-glow to-gold-warm bg-clip-text text-transparent">
              desregulado?
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lede mt-6 max-w-2xl text-balance"
          >
            Responde con honestidad. No es diagnóstico médico — es una guía rápida para
            saber si AMARTE puede acompañarte. 6 preguntas, 2 minutos.
          </motion.p>
        </div>
      </section>

      <NerveTest />

      <Suspense fallback={<SectionSkeleton />}>
        <ForWhoSection />
        <Comparison />
      </Suspense>

      {/* CTA final */}
      <section className="relative isolate overflow-hidden bg-ink-900 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-radial-emerald opacity-60" />
        <div className="container-tight relative text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
            className="h-display text-3xl sm:text-5xl text-balance"
          >
            Si te reconociste,{" "}
            <span className="text-emerald-brand">esto es para ti.</span>
          </motion.h2>
          <p className="lede mt-5 text-balance">
            Una noche cada 15 días para bajar el ruido, soltar el estrés y volver al
            cuerpo. Sin cursos previos, sin requisitos.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <CTAButton {...wa}>Quiero la próxima sesión</CTAButton>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink-900 px-5 py-3 text-sm text-bone transition hover:border-emerald-brand/40 hover:text-emerald-glow"
            >
              Ver fechas y ciudades
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
