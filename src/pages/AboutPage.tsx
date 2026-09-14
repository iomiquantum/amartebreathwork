// AboutPage — Quién está detrás de AMARTE (ruta /sobre-amarte)
// Storytelling profundo: origen, manifiesto, diferenciadores, prensa.

import { useEffect, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { trackPageView } from "../lib/tracking";
import { PageMeta } from "../components/PageMeta";
import { SectionSkeleton } from "../components/SectionSkeleton";
import { OriginStory } from "../components/OriginStory";
import { useWhatsappCTA } from "../lib/whatsapp";
import { CTAButton } from "../components/CTAButton";

const GuideSection = lazy(() =>
  import("../components/GuideSection").then((m) => ({ default: m.GuideSection }))
);
const Manifesto = lazy(() =>
  import("../components/Manifesto").then((m) => ({ default: m.Manifesto }))
);
const Differentiators = lazy(() =>
  import("../components/Differentiators").then((m) => ({ default: m.Differentiators }))
);
const PressStrip = lazy(() =>
  import("../components/PressStrip").then((m) => ({ default: m.PressStrip }))
);

export function AboutPage() {
  const wa = useWhatsappCTA("final_cta");

  useEffect(() => {
    trackPageView();
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      <PageMeta
        title="Sobre AMARTE · Una marca de respiración inmersiva"
        description="AMARTE no nació de un curso ni de una franquicia. Nació de una historia personal y de la convicción de que el silencio bien diseñado puede regular lo que la vida acelerada desordena."
        path="/sobre-amarte"
      />
      {/* Hero compacto */}
      <section className="relative isolate overflow-hidden bg-ink pb-16 pt-32 sm:pt-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url(/hero/cascada-bg.jpg)" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/80 to-ink" />
        <div className="pointer-events-none absolute inset-0 bg-radial-emerald opacity-50" />

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
            Sobre AMARTE
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="h-display mt-4 text-4xl sm:text-6xl text-balance"
          >
            Una marca de{" "}
            <span className="bg-gradient-to-r from-emerald-brand via-emerald-glow to-gold-warm bg-clip-text text-transparent">
              respiración inmersiva.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lede mt-6 max-w-2xl text-balance"
          >
            AMARTE no nació de un curso ni de una franquicia. Nació de una historia
            personal y de la convicción de que el silencio bien diseñado puede regular
            lo que la vida acelerada desordena.
          </motion.p>
        </div>
      </section>

      <OriginStory />

      <Suspense fallback={<SectionSkeleton />}>
        <GuideSection />
        <Manifesto />
        <Differentiators />
        <PressStrip />
      </Suspense>

      {/* CTA final */}
      <section className="relative isolate overflow-hidden bg-ink py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-50" />
        <div className="container-tight relative text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
            className="h-display text-3xl sm:text-5xl text-balance"
          >
            La mejor forma de conocernos es vivirlo.
          </motion.h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <CTAButton {...wa}>Quiero vivir la experiencia</CTAButton>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink-900 px-5 py-3 text-sm text-bone transition hover:border-emerald-brand/40 hover:text-emerald-glow"
            >
              Ver próximas fechas
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
