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

// Lazy: EventPage para rutas /evento/:slug
const EventPage = lazy(() =>
  import("./pages/EventPage").then((m) => ({ default: m.EventPage }))
);

// Lazy: landings dedicadas por género
const WomenPage = lazy(() =>
  import("./pages/WomenPage").then((m) => ({ default: m.WomenPage }))
);
const MenPage = lazy(() =>
  import("./pages/MenPage").then((m) => ({ default: m.MenPage }))
);

// Lazy: vertical jóvenes/colegios
const YouthPage = lazy(() =>
  import("./pages/YouthPage").then((m) => ({ default: m.YouthPage }))
);

// Lazy: NotFoundPage para rutas no reconocidas
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage }))
);

// Lazy: admin bundle (todo /admin/* en un solo chunk)
const AdminLogin = lazy(() =>
  import("./pages/admin/AdminLogin").then((m) => ({ default: m.AdminLogin }))
);
const AdminLayout = lazy(() =>
  import("./pages/admin/AdminLayout").then((m) => ({ default: m.AdminLayout }))
);
const AdminDashboard = lazy(() =>
  import("./pages/admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard }))
);
const AdminEvents = lazy(() =>
  import("./pages/admin/AdminEvents").then((m) => ({ default: m.AdminEvents }))
);
const AdminReservations = lazy(() =>
  import("./pages/admin/AdminReservations").then((m) => ({ default: m.AdminReservations }))
);
const AdminLeads = lazy(() =>
  import("./pages/admin/AdminLeads").then((m) => ({ default: m.AdminLeads }))
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
    // 1. Cargar Meta + GA4 + TikTok + Clarity SOLO si el usuario ya aceptó cookies.
    //    Si aún no decidió (unset) o declinó, no cargamos pixels.
    //    Si después acepta vía CookieBanner, escuchamos el evento y cargamos.
    import("./lib/pixels").then(({ initPixels }) => initPixels());

    let unsubConsent: (() => void) | undefined;
    import("./lib/consent").then(({ onConsentChange }) => {
      unsubConsent = onConsentChange((state) => {
        if (state === "accepted") {
          import("./lib/pixels").then(({ initPixels }) => initPixels());
        }
      });
    });

    // 2. Capturar UTM params si vienen en la URL (para tracking de campañas)
    captureUtmParams();
    // 3. Iniciar tracking de scroll depth + time on page (no requiere consent)
    const cleanup = initEngagementTracking();
    return () => {
      cleanup?.();
      unsubConsent?.();
    };
  }, []);

  // Track PageView en cada cambio de ruta
  useEffect(() => {
    trackPageView();
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    // Layout admin: sin Header público, sin Splash, sin footer, sin WA flotante.
    return (
      <Suspense fallback={<div className="min-h-screen bg-ink" />}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="reservations" element={<AdminReservations />} />
            <Route path="leads" element={<AdminLeads />} />
          </Route>
        </Routes>
      </Suspense>
    );
  }

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
            <Route
              path="/evento/:slug"
              element={
                <Suspense fallback={<div className="min-h-screen bg-ink" />}>
                  <EventPage />
                </Suspense>
              }
            />
            <Route
              path="/mujeres"
              element={
                <Suspense fallback={<div className="min-h-screen" />}>
                  <WomenPage />
                </Suspense>
              }
            />
            <Route
              path="/hombres"
              element={
                <Suspense fallback={<div className="min-h-screen" />}>
                  <MenPage />
                </Suspense>
              }
            />
            <Route
              path="/jovenes"
              element={
                <Suspense fallback={<div className="min-h-screen" />}>
                  <YouthPage />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={
                <Suspense fallback={<div className="min-h-screen bg-ink" />}>
                  <NotFoundPage />
                </Suspense>
              }
            />
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
