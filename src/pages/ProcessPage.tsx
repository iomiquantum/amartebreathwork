// ProcessPage — Cómo construimos cada experiencia (ruta /proceso)
// Página de profundización con todo el detalle técnico+artístico del proceso.

import { useEffect, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { trackPageView } from "../lib/tracking";
import { PageMeta } from "../components/PageMeta";
import { SectionSkeleton } from "../components/SectionSkeleton";
import { HowItWorks } from "../components/HowItWorks";
import { useWhatsappCTA } from "../lib/whatsapp";
import { CTAButton } from "../components/CTAButton";

const BehindTheScenes = lazy(() =>
  import("../components/BehindTheScenes").then((m) => ({ default: m.BehindTheScenes }))
);
const IncludesSection = lazy(() =>
  import("../components/IncludesSection").then((m) => ({ default: m.IncludesSection }))
);
const AudioWavePreview = lazy(() =>
  import("../components/AudioWavePreview").then((m) => ({ default: m.AudioWavePreview }))
);
const EventFormat = lazy(() =>
  import("../components/EventFormat").then((m) => ({ default: m.EventFormat }))
);

export function ProcessPage() {
  const wa = useWhatsappCTA("final_cta");

  useEffect(() => {
    trackPageView();
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      <PageMeta
        title="Cómo construimos cada experiencia — AMARTE"
        description="Cada sesión AMARTE tiene intención narrativa, capas sonoras diseñadas, frecuencias específicas y ambiente físico cuidado al detalle. Descubre qué pasa antes de que entres."
        path="/proceso"
      />
      {/* Hero compacto */}
      <section className="relative isolate overflow-hidden bg-ink pb-16 pt-32 sm:pt-36">
        <div className="pointer-events-none absolute inset-0 bg-radial-emerald opacity-50" />
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
            El proceso
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="h-display mt-4 text-4xl sm:text-6xl text-balance"
          >
            Cómo construimos{" "}
            <span className="bg-gradient-to-r from-emerald-brand via-emerald-glow to-gold-warm bg-clip-text text-transparent">
              cada experiencia.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lede mt-6 max-w-2xl text-balance"
          >
            No es improvisar y prender música. Cada sesión tiene una intención narrativa,
            capas sonoras diseñadas, frecuencias específicas y un ambiente físico
            cuidado al detalle. Esto es lo que pasa antes de que entres.
          </motion.p>
        </div>
      </section>

      <Suspense fallback={<SectionSkeleton />}>
        <HowItWorks />
        <BehindTheScenes />
        <IncludesSection />
        <AudioWavePreview />
        <EventFormat />
      </Suspense>

      {/* CTA final de página */}
      <section className="relative isolate overflow-hidden bg-ink-900 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-radial-emerald opacity-50" />
        <div className="container-tight relative text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
            className="h-display text-3xl sm:text-5xl text-balance"
          >
            ¿Listo para vivirlo?
          </motion.h2>
          <p className="lede mt-5 text-balance">
            El proceso es solo la mitad. La otra mitad la pones tú al cerrar los ojos.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <CTAButton {...wa}>Unirme al grupo</CTAButton>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink-900 px-5 py-3 text-sm text-bone transition hover:border-emerald-brand/40 hover:text-emerald-glow"
            >
              Ver fechas en home
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
