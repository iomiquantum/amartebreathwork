// HomePage — Landing principal de AMARTE (ruta /)
// Todas las secciones del home viven aquí. Header/Footer/modals son globales en App.tsx.

import { Suspense, lazy } from "react";
import { Hero } from "../components/Hero";
import { TrustBar } from "../components/TrustBar";
import { ProblemSection } from "../components/ProblemSection";
import { SectionSkeleton } from "../components/SectionSkeleton";

// Lazy below-the-fold sections
const ExperienceSection = lazy(() =>
  import("../components/ExperienceSection").then((m) => ({ default: m.ExperienceSection }))
);
const HowItWorks = lazy(() =>
  import("../components/HowItWorks").then((m) => ({ default: m.HowItWorks }))
);
const IncludesSection = lazy(() =>
  import("../components/IncludesSection").then((m) => ({ default: m.IncludesSection }))
);
const Gallery = lazy(() =>
  import("../components/Gallery").then((m) => ({ default: m.Gallery }))
);
const AudioWavePreview = lazy(() =>
  import("../components/AudioWavePreview").then((m) => ({ default: m.AudioWavePreview }))
);
const Comparison = lazy(() =>
  import("../components/Comparison").then((m) => ({ default: m.Comparison }))
);
const NerveTest = lazy(() =>
  import("../components/NerveTest").then((m) => ({ default: m.NerveTest }))
);
const BenefitsSection = lazy(() =>
  import("../components/BenefitsSection").then((m) => ({ default: m.BenefitsSection }))
);
const ForWhoSection = lazy(() =>
  import("../components/ForWhoSection").then((m) => ({ default: m.ForWhoSection }))
);
const Manifesto = lazy(() =>
  import("../components/Manifesto").then((m) => ({ default: m.Manifesto }))
);
const OriginStory = lazy(() =>
  import("../components/OriginStory").then((m) => ({ default: m.OriginStory }))
);
const BehindTheScenes = lazy(() =>
  import("../components/BehindTheScenes").then((m) => ({ default: m.BehindTheScenes }))
);
const GuideSection = lazy(() =>
  import("../components/GuideSection").then((m) => ({ default: m.GuideSection }))
);
const Testimonials = lazy(() =>
  import("../components/Testimonials").then((m) => ({ default: m.Testimonials }))
);
const PressStrip = lazy(() =>
  import("../components/PressStrip").then((m) => ({ default: m.PressStrip }))
);
const EventFormat = lazy(() =>
  import("../components/EventFormat").then((m) => ({ default: m.EventFormat }))
);
const EventsCalendar = lazy(() =>
  import("../components/EventsCalendar").then((m) => ({ default: m.EventsCalendar }))
);
const FrequenciesPlayer = lazy(() =>
  import("../components/FrequenciesPlayer").then((m) => ({ default: m.FrequenciesPlayer }))
);
const WhatsappCommunity = lazy(() =>
  import("../components/WhatsappCommunity").then((m) => ({ default: m.WhatsappCommunity }))
);
const Differentiators = lazy(() =>
  import("../components/Differentiators").then((m) => ({ default: m.Differentiators }))
);
const CinematicQuote = lazy(() =>
  import("../components/CinematicQuote").then((m) => ({ default: m.CinematicQuote }))
);
const FAQ = lazy(() => import("../components/FAQ").then((m) => ({ default: m.FAQ })));
const LeadForm = lazy(() =>
  import("../components/LeadForm").then((m) => ({ default: m.LeadForm }))
);
const Newsletter = lazy(() =>
  import("../components/Newsletter").then((m) => ({ default: m.Newsletter }))
);
const CorporateSection = lazy(() =>
  import("../components/CorporateSection").then((m) => ({ default: m.CorporateSection }))
);
const ShareSection = lazy(() =>
  import("../components/ShareSection").then((m) => ({ default: m.ShareSection }))
);
const ResponsibleNotice = lazy(() =>
  import("../components/ResponsibleNotice").then((m) => ({ default: m.ResponsibleNotice }))
);
const FinalCTA = lazy(() =>
  import("../components/FinalCTA").then((m) => ({ default: m.FinalCTA }))
);
const WaveDivider = lazy(() =>
  import("../components/WaveDivider").then((m) => ({ default: m.WaveDivider }))
);

export function HomePage() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <ProblemSection />
      <Suspense fallback={<SectionSkeleton />}>
        <ExperienceSection />
        <WaveDivider />
        <HowItWorks />
        <IncludesSection />
        <AudioWavePreview />
        <FrequenciesPlayer />
        <Gallery />
        <NerveTest />
        <Comparison />
        <BenefitsSection />
        <ForWhoSection />
        <OriginStory />
        <BehindTheScenes />
        <Manifesto />
        <GuideSection />
        <Testimonials />
        <PressStrip />
        <EventFormat />
        <EventsCalendar />
        <WhatsappCommunity />
        <Differentiators />
        <CinematicQuote />
        <FAQ />
        <LeadForm />
        <Newsletter />
        <CorporateSection />
        <ShareSection />
        <ResponsibleNotice />
        <FinalCTA />
      </Suspense>
    </main>
  );
}
