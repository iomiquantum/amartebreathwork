// 404 page friendly — mensaje claro + CTA al home + eventos recientes.
// Marca status 404 vía meta refresh para que Google/scrapers lo identifiquen.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, Calendar, MessageCircle, ArrowRight } from "lucide-react";
import { siteConfig } from "../data/siteConfig";
import { fetchUpcomingEvents, type EventRow } from "../lib/supabase";

export function NotFoundPage() {
  const [events, setEvents] = useState<EventRow[]>([]);

  useEffect(() => {
    document.title = `Página no encontrada — ${siteConfig.brandName}`;
    // Marcar noindex para que Google no indexe 404s
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, nofollow");
    return () => {
      document.title = siteConfig.seoTitle;
      meta?.setAttribute("content", "index, follow");
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchUpcomingEvents(3).then((evs) => {
      if (mounted) setEvents(evs);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-ink text-bone">
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 py-24 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-brand/30 bg-emerald-deep/20 px-3 py-1 text-xs sm:text-[11px] uppercase tracking-eyebrow text-emerald-glow">
            <Compass className="size-3" /> 404
          </div>

          <h1 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl">
            Esta página no existe.
          </h1>
          <p className="mt-4 text-base text-bone/80 sm:text-lg">
            El link que seguiste puede estar roto, o la página ya no está disponible.
            Pero respira — todavía hay caminos para reconectar con AMARTE.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-brand px-6 text-sm font-medium text-ink-900 shadow-glow-emerald transition-all hover:bg-emerald-glow"
            >
              Volver al inicio <ArrowRight className="size-4" />
            </Link>
            <a
              href={siteConfig.whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-6 text-sm text-bone hover:border-emerald-brand/50 hover:text-emerald-glow"
            >
              <MessageCircle className="size-4" />
              Unirme al grupo WhatsApp
            </a>
          </div>

          {events.length > 0 && (
            <div className="mt-12 border-t border-white/[0.06] pt-8">
              <p className="text-xs uppercase tracking-eyebrow text-bone/60">
                Próximos eventos
              </p>
              <ul className="mt-4 space-y-2">
                {events.map((e) => (
                  <li key={e.id}>
                    <Link
                      to={e.slug ? `/evento/${e.slug}` : "/"}
                      className="group flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-emerald-brand/30 hover:bg-white/[0.04]"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-bone group-hover:text-emerald-glow">
                          {e.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          <Calendar className="mr-1 inline size-3" />
                          {new Date(e.date_iso).toLocaleDateString("es-EC", {
                            day: "numeric",
                            month: "long",
                          })}
                          {e.city && ` · ${e.city}`}
                        </p>
                      </div>
                      <ArrowRight className="size-4 shrink-0 text-bone/40 group-hover:translate-x-0.5 group-hover:text-emerald-glow" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
