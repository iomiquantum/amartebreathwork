// HomePage — Landing principal de AMARTE (ruta /)
// Estructura optimizada para conversión: funnel claro de arriba a abajo.
// Las secciones de profundización viven en /proceso, /sobre-amarte y /test.

import { Suspense, lazy } from "react";
import { Hero } from "../components/Hero";
import { TrustBar } from "../components/TrustBar";
import { ProblemSection } from "../components/ProblemSection";
import { SectionSkeleton } from "../components/SectionSkeleton";

// Lazy below-the-fold sections
const NerveTest = lazy(() =>
  import("../components/NerveTest").then((m) => ({ default: m.NerveTest }))
);
const ExperienceSection = lazy(() =>
  import("../components/ExperienceSection").then((m) => ({ default: m.ExperienceSection }))
);
const FrequenciesPlayer = lazy(() =>
  import("../components/FrequenciesPlayer").then((m) => ({ default: m.FrequenciesPlayer }))
);
const Gallery = lazy(() =>
  import("../components/Gallery").then((m) => ({ default: m.Gallery }))
);
const Testimonials = lazy(() =>
  import("../components/Testimonials").then((m) => ({ default: m.Testimonials }))
);
const BenefitsSection = lazy(() =>
  import("../components/BenefitsSection").then((m) => ({ default: m.BenefitsSection }))
);
const SectionBanner = lazy(() =>
  import("../components/SectionBanner").then((m) => ({ default: m.SectionBanner }))
);
const GuideSection = lazy(() =>
  import("../components/GuideSection").then((m) => ({ default: m.GuideSection }))
);
const EventsCalendar = lazy(() =>
  import("../components/EventsCalendar").then((m) => ({ default: m.EventsCalendar }))
);
const WhatsappCommunity = lazy(() =>
  import("../components/WhatsappCommunity").then((m) => ({ default: m.WhatsappCommunity }))
);
const CinematicQuote = lazy(() =>
  import("../components/CinematicQuote").then((m) => ({ default: m.CinematicQuote }))
);
const FAQ = lazy(() => import("../components/FAQ").then((m) => ({ default: m.FAQ })));
const LeadForm = lazy(() =>
  import("../components/LeadForm").then((m) => ({ default: m.LeadForm }))
);
const FinalCTA = lazy(() =>
  import("../components/FinalCTA").then((m) => ({ default: m.FinalCTA }))
);

export function HomePage() {
  return (
    <main>
      {/* ========================================================
          1. ATENCIÓN — Hero con slider narrativo
         ======================================================== */}
      <Hero />

      {/* ========================================================
          2. CREDIBILIDAD INMEDIATA — TrustBar
         ======================================================== */}
      <TrustBar />

      <Suspense fallback={<SectionSkeleton />}>
        {/* ========================================================
            3. PROBLEMA — Te identificas con esto?
           ======================================================== */}
        <ProblemSection />

        {/* ========================================================
            4. INTERACTIVO #1 — Test del sistema nervioso
            (engancha cognitivamente y autoidentifica)
           ======================================================== */}
        <NerveTest />

        {/* ========================================================
            5. SOLUCIÓN — Qué es la experiencia
           ======================================================== */}
        <ExperienceSection />

        {/* ========================================================
            6. INTERACTIVO #2 — Frecuencias en vivo
            (sentir el producto antes de comprar)
           ======================================================== */}
        <FrequenciesPlayer />

        {/* ========================================================
            7. ATMÓSFERA — Manifiestos + Gallery (visual fuerte)
           ======================================================== */}
        <Gallery />

        {/* ========================================================
            8. PRUEBA SOCIAL — Testimonios (movido arriba)
           ======================================================== */}
        <Testimonials />

        {/* ========================================================
            9. TRANSFORMACIÓN — Beneficios
           ======================================================== */}
        <BenefitsSection />

        {/* ========================================================
            10. BANNER — Profundización proceso
           ======================================================== */}
        <SectionBanner
          eyebrow="El proceso completo"
          title="¿Curioso por cómo construimos cada sesión?"
          description="Diseño narrativo, capas sonoras, frecuencias específicas y ambiente físico. Mira el detalle de lo que pasa antes de que cierres los ojos."
          cta="Ver el proceso →"
          href="/proceso"
          image="/sections/experience.jpg"
          alt="Sesión inmersiva AMARTE en auditorio con audífonos verdes brillando"
        />

        {/* ========================================================
            11. GUÍA — Quién está detrás (StoryBrand)
           ======================================================== */}
        <GuideSection />

        {/* ========================================================
            12. BANNER — Profundización sobre AMARTE
           ======================================================== */}
        <SectionBanner
          eyebrow="La historia"
          title="AMARTE no nació de una franquicia."
          description="Una marca de respiración inmersiva nacida de una historia personal. Manifiesto, diferenciadores y el origen completo."
          cta="Conocer AMARTE →"
          href="/sobre-amarte"
          image="/sections/origin.jpg"
          alt="Grupo en sesión AMARTE en sillones reclinables, audífonos verdes brillando"
          reverse
        />

        {/* ========================================================
            13. OFERTA CONCRETA — Eventos próximos
           ======================================================== */}
        <EventsCalendar />

        {/* ========================================================
            14. COMUNIDAD — Grupo WhatsApp
           ======================================================== */}
        <WhatsappCommunity />

        {/* ========================================================
            15. CLIMAX EMOCIONAL — Cinematic quote + breath pacer
           ======================================================== */}
        <CinematicQuote />

        {/* ========================================================
            16. OBJECTION HANDLING — FAQ
           ======================================================== */}
        <FAQ />

        {/* ========================================================
            17. CAPTURA — Lead form
           ======================================================== */}
        <LeadForm />

        {/* ========================================================
            18. CIERRE — Final CTA con background fuerte
           ======================================================== */}
        <FinalCTA />
      </Suspense>
    </main>
  );
}
