import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Wind } from "lucide-react";
import { siteConfig } from "../data/siteConfig";
import { trackWhatsappClick } from "../lib/tracking";

const STORAGE_KEY = "amarte_exit_seen";

export function ExitIntent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let armed = false;
    // Solo activamos después de 8s de navegación (evita falsos positivos al abrir tab)
    const arm = setTimeout(() => (armed = true), 8000);

    const onLeave = (e: MouseEvent) => {
      if (!armed) return;
      // Solo cuando el cursor sale por el borde superior (intención de cerrar/cambiar tab)
      if (e.clientY > 0) return;
      if (e.relatedTarget) return;
      sessionStorage.setItem(STORAGE_KEY, "1");
      setOpen(true);
    };

    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      document.documentElement.removeEventListener("mouseleave", onLeave);
      clearTimeout(arm);
    };
  }, []);

  const close = () => setOpen(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/80 px-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-title"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="gradient-border relative w-full max-w-lg overflow-hidden rounded-3xl bg-ink-900 p-7 sm:p-9"
          >
            <button
              onClick={close}
              aria-label="Cerrar"
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-white/10 text-bone/70 transition-colors hover:border-bone/30 hover:text-bone"
            >
              <X className="size-4" />
            </button>

            <div className="grid size-12 place-items-center rounded-full border border-emerald-brand/40 bg-emerald-deep/40">
              <Wind className="size-5 text-emerald-glow" strokeWidth={1.6} />
            </div>

            <h3 id="exit-title" className="h-display mt-5 text-2xl text-bone sm:text-3xl text-balance">
              Antes de irte —{" "}
              <span className="bg-gradient-to-r from-emerald-brand to-gold-warm bg-clip-text text-transparent">
                respira hondo.
              </span>
            </h3>
            <p className="lede mt-3">
              Si llegaste hasta aquí, hay algo que tu sistema nervioso te está pidiendo.
              Únete al grupo y recibe primero la próxima fecha. Salir es un click.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={siteConfig.whatsappGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackWhatsappClick("hero_secondary");
                  close();
                }}
                className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-emerald-brand px-6 text-sm font-medium text-ink-900 shadow-glow-emerald transition-all hover:bg-emerald-glow hover:shadow-glow-emerald-strong"
              >
                <MessageCircle className="size-4" strokeWidth={1.8} />
                Unirme al grupo
              </a>
              <button
                onClick={close}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 px-5 text-sm text-bone/70 transition-colors hover:border-bone/30 hover:text-bone"
              >
                Ahora no
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
