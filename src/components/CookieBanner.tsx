import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";

const KEY = "amarte_cookie_consent";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(KEY)) return;
    const t = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const accept = () => {
    localStorage.setItem(KEY, "accepted");
    setShow(false);
  };
  const decline = () => {
    localStorage.setItem(KEY, "declined");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          role="region"
          aria-label="Aviso de cookies"
          aria-live="polite"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl sm:inset-x-auto sm:left-4 sm:right-4"
        >
          <div className="card-dark flex flex-col items-start gap-4 rounded-2xl border-emerald-brand/20 bg-ink-900/95 p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:p-5">
            <div className="flex items-start gap-3 sm:flex-1">
              <Cookie className="mt-0.5 size-5 flex-shrink-0 text-emerald-glow" strokeWidth={1.6} />
              <p className="text-xs text-bone/85 sm:text-sm">
                Usamos cookies básicas para entender cómo se usa la página. Sin venderle
                tus datos a nadie.{" "}
                <a href="/privacidad.html" className="underline decoration-emerald-brand/40 underline-offset-2 hover:text-emerald-glow">
                  Más detalles
                </a>
                .
              </p>
            </div>
            <div className="flex w-full gap-2 sm:w-auto sm:flex-shrink-0">
              <button
                onClick={decline}
                className="h-10 flex-1 rounded-full border border-white/10 px-4 text-xs text-bone/80 transition-colors hover:border-bone/30 hover:text-bone sm:flex-none"
              >
                Solo esenciales
              </button>
              <button
                onClick={accept}
                className="h-10 flex-1 rounded-full bg-emerald-brand px-5 text-xs font-medium text-ink-900 shadow-glow-emerald transition-all hover:bg-emerald-glow sm:flex-none"
              >
                Aceptar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
