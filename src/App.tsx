import { Suspense, lazy, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { TrustBar } from "./components/TrustBar";
import { ProblemSection } from "./components/ProblemSection";
import { FloatingWhatsappButton } from "./components/FloatingWhatsappButton";
import { StructuredData } from "./components/StructuredData";
import { Splash } from "./components/Splash";
import { SectionSkeleton } from "./components/SectionSkeleton";
import { SideRail } from "./components/SideRail";
import { ToastProvider } from "./lib/toast";
import { trackPageView } from "./lib/tracking";

// Lazy below-the-fold sections
const ExperienceSection = lazy(() =>
  import("./components/ExperienceSection").then((m) => ({ default: m.ExperienceSection }))
);
const HowItWorks = lazy(() =>
  import("./components/HowItWorks").then((m) => ({ default: m.HowItWorks }))
);
const IncludesSection = lazy(() =>
  import("./components/IncludesSection").then((m) => ({ default: m.IncludesSection }))
);
const Gallery = lazy(() =>
  import("./components/Gallery").then((m) => ({ default: m.Gallery }))
);
const AudioWavePreview = lazy(() =>
  import("./components/AudioWavePreview").then((m) => ({ default: m.AudioWavePreview }))
);
const Comparison = lazy(() =>
  import("./components/Comparison").then((m) => ({ default: m.Comparison }))
);
const NerveTest = lazy(() =>
  import("./components/NerveTest").then((m) => ({ default: m.NerveTest }))
);
const BenefitsSection = lazy(() =>
  import("./components/BenefitsSection").then((m) => ({ default: m.BenefitsSection }))
);
const ForWhoSection = lazy(() =>
  import("./components/ForWhoSection").then((m) => ({ default: m.ForWhoSection }))
);
const Manifesto = lazy(() =>
  import("./components/Manifesto").then((m) => ({ default: m.Manifesto }))
);
const OriginStory = lazy(() =>
  import("./components/OriginStory").then((m) => ({ default: m.OriginStory }))
);
const BehindTheScenes = lazy(() =>
  import("./components/BehindTheScenes").then((m) => ({ default: m.BehindTheScenes }))
);
const GuideSection = lazy(() =>
  import("./components/GuideSection").then((m) => ({ default: m.GuideSection }))
);
const Testimonials = lazy(() =>
  import("./components/Testimonials").then((m) => ({ default: m.Testimonials }))
);
const PressStrip = lazy(() =>
  import("./components/PressStrip").then((m) => ({ default: m.PressStrip }))
);
const EventFormat = lazy(() =>
  import("./components/EventFormat").then((m) => ({ default: m.EventFormat }))
);
const Schedule = lazy(() =>
  import("./components/Schedule").then((m) => ({ default: m.Schedule }))
);
const WhatsappCommunity = lazy(() =>
  import("./components/WhatsappCommunity").then((m) => ({ default: m.WhatsappCommunity }))
);
const Differentiators = lazy(() =>
  import("./components/Differentiators").then((m) => ({ default: m.Differentiators }))
);
const CinematicQuote = lazy(() =>
  import("./components/CinematicQuote").then((m) => ({ default: m.CinematicQuote }))
);
const FAQ = lazy(() => import("./components/FAQ").then((m) => ({ default: m.FAQ })));
const LeadForm = lazy(() =>
  import("./components/LeadForm").then((m) => ({ default: m.LeadForm }))
);
const Newsletter = lazy(() =>
  import("./components/Newsletter").then((m) => ({ default: m.Newsletter }))
);
const CorporateSection = lazy(() =>
  import("./components/CorporateSection").then((m) => ({ default: m.CorporateSection }))
);
const ShareSection = lazy(() =>
  import("./components/ShareSection").then((m) => ({ default: m.ShareSection }))
);
const ResponsibleNotice = lazy(() =>
  import("./components/ResponsibleNotice").then((m) => ({ default: m.ResponsibleNotice }))
);
const FinalCTA = lazy(() =>
  import("./components/FinalCTA").then((m) => ({ default: m.FinalCTA }))
);
const Footer = lazy(() => import("./components/Footer").then((m) => ({ default: m.Footer })));
const ExitIntent = lazy(() =>
  import("./components/ExitIntent").then((m) => ({ default: m.ExitIntent }))
);
const CookieBanner = lazy(() =>
  import("./components/CookieBanner").then((m) => ({ default: m.CookieBanner }))
);
const WaveDivider = lazy(() =>
  import("./components/WaveDivider").then((m) => ({ default: m.WaveDivider }))
);

function App() {
  useEffect(() => {
    trackPageView();
  }, []);

  return (
    <ToastProvider>
      <Splash />
      <div className="min-h-screen bg-ink text-bone antialiased">
        <StructuredData />
        <Header />
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
            <Schedule />
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
        <Suspense fallback={null}>
          <Footer />
          <ExitIntent />
          <CookieBanner />
        </Suspense>
        <FloatingWhatsappButton />
        <SideRail />
        <Analytics />
        <SpeedInsights />
      </div>
    </ToastProvider>
  );
}

export default App;
