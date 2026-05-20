import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, MessageCircle, Send, Check, Share2 } from "lucide-react";
import { siteConfig } from "../data/siteConfig";

export function ShareSection() {
  const [copied, setCopied] = useState(false);

  const url = siteConfig.siteUrl;
  const text = "Encontré esta experiencia y me hizo pensar en ti — respiración, sonido y frecuencias para regular el sistema nervioso.";

  const links = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* no-op */
    }
  };

  const native = async () => {
    if (typeof navigator === "undefined" || !navigator.share) {
      copyLink();
      return;
    }
    try {
      await navigator.share({ title: siteConfig.brandName, text, url });
    } catch {
      /* user cancelled */
    }
  };

  return (
    <section
      id="compartir"
      aria-label="Compartir"
      className="relative bg-ink-900 py-16 sm:py-20"
    >
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="eyebrow">Comunidad</span>
          <h3 className="h-display mt-3 text-2xl sm:text-3xl text-balance">
            Compartilo con alguien{" "}
            <span className="bg-gradient-to-r from-emerald-brand to-gold-warm bg-clip-text text-transparent">
              que lo necesita.
            </span>
          </h3>
          <p className="lede mx-auto mt-3 max-w-xl text-balance">
            Una pausa que no llega es una pausa perdida. Tal vez alguien cercano la necesita más de lo que crees.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-5 text-sm text-bone transition-all hover:border-emerald-brand/50 hover:bg-emerald-deep/30 hover:text-emerald-glow"
            >
              <MessageCircle className="size-4" strokeWidth={1.6} />
              WhatsApp
            </a>
            <a
              href={links.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-5 text-sm text-bone transition-all hover:border-emerald-brand/50 hover:bg-emerald-deep/30 hover:text-emerald-glow"
            >
              <Send className="size-4" strokeWidth={1.6} />
              Telegram
            </a>
            <a
              href={links.x}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-5 text-sm text-bone transition-all hover:border-emerald-brand/50 hover:bg-emerald-deep/30 hover:text-emerald-glow"
            >
              <span className="font-display text-base leading-none">X</span>
            </a>
            <button
              type="button"
              onClick={copyLink}
              className="group inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-5 text-sm text-bone transition-all hover:border-emerald-brand/50 hover:bg-emerald-deep/30 hover:text-emerald-glow"
            >
              {copied ? (
                <>
                  <Check className="size-4 text-emerald-glow" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="size-4" strokeWidth={1.6} />
                  Copiar link
                </>
              )}
            </button>
            <button
              type="button"
              onClick={native}
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-emerald-brand px-5 text-sm font-medium text-ink-900 shadow-glow-emerald hover:bg-emerald-glow"
            >
              <Share2 className="size-4" strokeWidth={1.8} />
              Compartir
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
