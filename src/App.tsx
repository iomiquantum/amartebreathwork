import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Header } from "./components/Header";
import { FloatingWhatsappButton } from "./components/FloatingWhatsappButton";
import { StructuredData } from "./components/StructuredData";
import { Splash } from "./components/Splash";
import { SideRail } from "./components/SideRail";
import { ToastProvider } from "./lib/toast";
import { WhatsappGateProvider } from "./lib/whatsappGate";
import { WhatsappGateModal } from "./components/WhatsappGateModal";
import { trackPageView, initEngagementTracking, captureUtmParams } from "./lib/tracking";
import { HomePage } from "./pages/HomePage";

// Lazy: CorporatePage solo se carga si el usuario visita /corporativo
const CorporatePage = lazy(() =>
  import("./pages/CorporatePage").then((m) => ({ default: m.CorporatePage }))
);

// Lazy: globales footer-zone
const Footer = lazy(() => import("./components/Footer").then((m) => ({ default: m.Footer })));
const ExitIntent = lazy(() =>
  import("./components/ExitIntent").then((m) => ({ default: m.ExitIntent }))
);
const CookieBanner = lazy(() =>
  import("./components/CookieBanner").then((m) => ({ default: m.CookieBanner }))
);

function App() {
  const location = useLocation();

  useEffect(() => {
    // 1. Cargar Meta + GA4 + TikTok + Clarity (si tienen IDs en siteConfig)
    import("./lib/pixels").then(({ initPixels }) => initPixels());
    // 2. Capturar UTM params si vienen en la URL (para tracking de campañas)
    captureUtmParams();
    // 3. Iniciar tracking de scroll depth + time on page
    const cleanup = initEngagementTracking();
    return cleanup;
  }, []);

  // Track PageView en cada cambio de ruta
  useEffect(() => {
    trackPageView();
  }, [location.pathname]);

  return (
    <ToastProvider>
      <WhatsappGateProvider>
        <Splash />
        <div className="min-h-screen bg-ink text-bone antialiased">
          <StructuredData />
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/corporativo"
              element={
                <Suspense fallback={<div className="min-h-screen" />}>
                  <CorporatePage />
                </Suspense>
              }
            />
            <Route path="*" element={<HomePage />} />
          </Routes>
          <Suspense fallback={null}>
            <Footer />
            <ExitIntent />
            <CookieBanner />
          </Suspense>
          <FloatingWhatsappButton />
          <SideRail />
          <WhatsappGateModal />
          <Analytics />
          <SpeedInsights />
        </div>
      </WhatsappGateProvider>
    </ToastProvider>
  );
}

export default App;
