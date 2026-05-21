import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Quote, Star, Play, Pause } from "lucide-react";
import { siteConfig } from "../data/siteConfig";
import { SectionHeader } from "./SectionHeader";

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < rating ? "fill-gold-warm text-gold-warm" : "text-white/15"
          }`}
          strokeWidth={1.4}
        />
      ))}
    </div>
  );
}

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  rating?: number;
  videoUrl?: string;
  videoPoster?: string;
};

function VideoTestimonial({ t }: { t: Testimonial }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <motion.figure
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55 }}
      className="card-dark group relative overflow-hidden"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <video
          ref={ref}
          src={t.videoUrl}
          poster={t.videoPoster}
          preload="metadata"
          playsInline
          onEnded={() => setPlaying(false)}
          className="size-full object-cover"
        />
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pausar video" : "Reproducir video"}
          className={`absolute inset-0 grid place-items-center transition-opacity duration-300 ${
            playing ? "opacity-0 hover:opacity-100 bg-ink/30" : "opacity-100 bg-ink/30"
          }`}
        >
          <span className="grid size-16 place-items-center rounded-full bg-emerald-brand text-ink-900 shadow-glow-emerald-strong transition-transform group-hover:scale-105">
            {playing ? <Pause className="size-6" strokeWidth={2} /> : <Play className="size-6 translate-x-0.5" strokeWidth={2} />}
          </span>
        </button>
      </div>
      <div className="p-6">
        <Stars rating={t.rating ?? 5} />
        {t.quote && (
          <blockquote className="mt-3 text-sm leading-relaxed text-bone/85 text-balance">
            "{t.quote}"
          </blockquote>
        )}
        <figcaption className="mt-4 flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full border border-emerald-brand/30 bg-emerald-deep/40 font-display text-xs text-emerald-glow">
            {t.name
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")}
          </span>
          <div>
            <p className="text-sm font-medium text-bone">{t.name}</p>
            <p className="text-xs text-muted">{t.role}</p>
          </div>
        </figcaption>
      </div>
    </motion.figure>
  );
}

function TextTestimonial({ t, i }: { t: Testimonial; i: number }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: i * 0.08 }}
      className="card-dark group relative overflow-hidden p-7"
    >
      <Quote className="absolute right-4 top-4 size-10 text-emerald-brand/10" strokeWidth={1.4} />
      <Stars rating={t.rating ?? 5} />
      <blockquote className="relative mt-4 font-display text-lg leading-relaxed text-bone/95 text-balance">
        "{t.quote}"
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full border border-emerald-brand/30 bg-emerald-deep/40 font-display text-xs text-emerald-glow">
          {t.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")}
        </span>
        <div>
          <p className="text-sm font-medium text-bone">{t.name}</p>
          <p className="text-xs text-muted">{t.role}</p>
        </div>
      </figcaption>
    </motion.figure>
  );
}

function EmptyState() {
  return (
    <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 0.85, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="card-dark relative overflow-hidden p-7"
        >
          <Quote className="absolute right-4 top-4 size-10 text-emerald-brand/10" strokeWidth={1.4} />
          <div className="flex items-center gap-0.5 opacity-30">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star key={j} className="size-3.5 text-white/15" strokeWidth={1.4} />
            ))}
          </div>
          <div className="mt-4 space-y-2.5">
            <div className="h-3 w-full rounded-full bg-white/[0.04]" />
            <div className="h-3 w-5/6 rounded-full bg-white/[0.04]" />
            <div className="h-3 w-2/3 rounded-full bg-white/[0.04]" />
          </div>
          <div className="mt-6 flex items-center gap-3 opacity-60">
            <span className="size-9 rounded-full border border-white/10 bg-white/[0.02]" />
            <div className="space-y-1.5">
              <div className="h-2.5 w-20 rounded-full bg-white/[0.04]" />
              <div className="h-2 w-14 rounded-full bg-white/[0.03]" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function Testimonials() {
  const testimonials = siteConfig.testimonials as Testimonial[];
  const hasTestimonials = testimonials?.length > 0;

  return (
    <section id="voces" className="relative bg-ink py-24 sm:py-32">
      <div className="container-x">
        <SectionHeader
          eyebrow="Voces"
          title={hasTestimonials ? "Lo que se siente" : "Pronto, las voces"}
          highlight={hasTestimonials ? "después de la sesión." : "de la primera experiencia."}
          subtitle={
            hasTestimonials
              ? "Pequeñas frases y videos reales de quienes ya pasaron por la experiencia."
              : "Los testimonios reales se publicarán después de las primeras sesiones, con consentimiento explícito de cada participante."
          }
        />

        {hasTestimonials ? (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) =>
              t.videoUrl ? (
                <VideoTestimonial key={t.name + i} t={t} />
              ) : (
                <TextTestimonial key={t.name + i} t={t} i={i} />
              )
            )}
          </div>
        ) : (
          <EmptyState />
        )}

        {hasTestimonials && (
          <p className="mt-8 text-center text-xs text-muted">
            Voces compartidas con consentimiento.
          </p>
        )}
      </div>
    </section>
  );
}
