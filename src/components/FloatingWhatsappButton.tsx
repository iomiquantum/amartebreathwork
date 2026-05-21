import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "../data/siteConfig";
import { useWhatsappCTA } from "../lib/whatsapp";

export function FloatingWhatsappButton() {
  const [visible, setVisible] = useState(false);
  const wa = useWhatsappCTA("floating_button");

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Mobile: full-width sticky bottom */}
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:hidden"
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/95 to-transparent" />
            <a
              {...wa}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-emerald-brand text-base font-medium text-ink-900 shadow-glow-emerald-strong"
            >
              <MessageCircle className="size-5" strokeWidth={1.8} />
              {siteConfig.ctaFloatingMobile}
            </a>
          </motion.div>

          {/* Desktop: floating round button bottom-right */}
          <motion.a
            {...wa}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="group fixed bottom-6 right-6 z-40 hidden h-14 items-center gap-2 rounded-full bg-emerald-brand px-5 text-sm font-medium text-ink-900 shadow-glow-emerald-strong transition-transform hover:scale-105 sm:flex"
            aria-label="Abrir WhatsApp"
          >
            <span className="absolute -inset-2 rounded-full bg-emerald-brand/30 blur-xl group-hover:bg-emerald-brand/40" aria-hidden />
            <MessageCircle className="relative size-5" strokeWidth={1.8} />
            <span className="relative">{siteConfig.ctaFloatingDesktop}</span>
          </motion.a>
        </>
      )}
    </AnimatePresence>
  );
}
