// Página por evento /evento/{slug}.
// SEO: title + description + og:image dinámicos en el <head> via document.title/meta.
// Permite reserva directa con ReservationModal.

import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Video,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { fetchEventBySlug, type EventRow } from "../lib/supabase";
import { siteConfig } from "../data/siteConfig";
import { ReservationModal } from "../components/ReservationModal";
import { CTAButton } from "../components/CTAButton";
import { Skeleton, SkeletonCard, SkeletonText, ScreenReaderLoading } from "../components/Skeleton";

export function EventPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    let mounted = true;
    fetchEventBySlug(slug).then((ev) => {
      if (!mounted) return;
      if (!ev) {
        setNotFound(true);
      } else {
        setEvent(ev);
      }
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [slug]);

  // SEO: meta tags dinámicos
  useEffect(() => {
    if (!event) return;
    const fullTitle = `${event.title} — ${siteConfig.brandName}`;
    document.title = fullTitle;
    setMeta("description", event.description ?? siteConfig.seoDescription);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", event.description ?? siteConfig.seoDescription, true);
    if (event.cover_image_url) {
      setMeta("og:image", event.cover_image_url, true);
    }
    setMeta("og:url", `${siteConfig.siteUrl}/evento/${event.slug}`, true);
    setMeta("og:type", "event", true);

    return () => {
      // Restaurar al desmontar
      document.title = siteConfig.seoTitle;
      setMeta("description", siteConfig.seoDescription);
    };
  }, [event]);

  // Schema.org JSON-LD para Google Events
  useEffect(() => {
    if (!event) return;
    const startDate = event.date_iso;
    const endDate = new Date(
      new Date(event.date_iso).getTime() + event.duration_min * 60 * 1000,
    ).toISOString();

    const location =
      event.format === "online"
        ? {
            "@type": "VirtualLocation",
            url: event.online_url ?? `${siteConfig.siteUrl}/evento/${event.slug}`,
          }
        : {
            "@type": "Place",
            name: event.venue_name ?? `AMARTE — ${event.city ?? "Ecuador"}`,
            address: {
              "@type": "PostalAddress",
              streetAddress: event.venue_address ?? "",
              addressLocality: event.city ?? "",
              addressCountry: "EC",
            },
          };

    const offers =
      event.price_amount != null
        ? {
            "@type": "Offer",
            price: event.price_amount,
            priceCurrency: event.price_currency,
            availability:
              event.spots_available > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/SoldOut",
            url: `${siteConfig.siteUrl}/evento/${event.slug}`,
            validFrom: new Date().toISOString(),
          }
        : undefined;

    const jsonLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": event.format === "online" ? "OnlineEventAttendanceMode" : "Event",
      name: event.title,
      description: event.description ?? siteConfig.seoDescription,
      startDate,
      endDate,
      eventAttendanceMode:
        event.format === "online"
          ? "https://schema.org/OnlineEventAttendanceMode"
          : "https://schema.org/OfflineEventAttendanceMode",
      eventStatus:
        event.status === "cancelled"
          ? "https://schema.org/EventCancelled"
          : "https://schema.org/EventScheduled",
      location,
      image: event.cover_image_url ? [event.cover_image_url] : undefined,
      organizer: {
        "@type": "Organization",
        name: siteConfig.brandName,
        url: siteConfig.siteUrl,
      },
      offers,
      maximumAttendeeCapacity: event.spots_total,
      remainingAttendeeCapacity: event.spots_available,
    };
    // Limpiar undefined del JSON-LD
    Object.keys(jsonLd).forEach((k) => jsonLd[k] === undefined && delete jsonLd[k]);
    // OnlineEventAttendanceMode no es un @type valido — corregir
    if (event.format === "online") jsonLd["@type"] = "Event";

    const scriptId = "event-jsonld";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [event]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink text-bone">
        <ScreenReaderLoading label="Cargando evento…" />
        <article className="mx-auto max-w-3xl px-4 pb-20 pt-24 sm:px-6 sm:pt-32">
          <Skeleton className="h-3 w-32" />
          <div className="mt-6">
            <Skeleton className="mb-3 h-4 w-40" />
            <Skeleton className="mb-2 h-10 w-5/6" />
            <Skeleton className="mb-2 h-10 w-3/4" />
            <SkeletonText lines={3} className="mt-5" />
          </div>
          <Skeleton className="mt-8 aspect-[16/9] w-full rounded-3xl" />
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <SkeletonCard>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="mt-4 h-12 w-full rounded-full" />
          </SkeletonCard>
        </article>
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink px-4 text-bone">
        <div className="max-w-md text-center">
          <p className="text-xs uppercase tracking-eyebrow text-emerald-brand">404</p>
          <h1 className="mt-3 font-display text-3xl">Evento no encontrado</h1>
          <p className="mt-3 text-sm text-bone/75">
            Este evento ya no está disponible o el link es incorrecto.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-brand px-5 py-2.5 text-sm font-medium text-ink-900 hover:bg-emerald-glow"
          >
            <ArrowLeft className="size-4" /> Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date_iso);
  const now = new Date();
  const isPast = eventDate < now;
  const isSoldOut = event.status === "sold_out" || event.spots_available <= 0;
  const isOnline = event.format === "online";
  const FormatIcon = isOnline ? Video : MapPin;

  const dateFormatted = eventDate.toLocaleDateString("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeFormatted = eventDate.toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-ink text-bone">
      <article className="mx-auto max-w-3xl px-4 pb-20 pt-24 sm:px-6 sm:pt-32">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-eyebrow text-bone/60 hover:text-emerald-glow"
        >
          <ArrowLeft className="size-3" /> Todos los eventos
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-eyebrow text-emerald-brand">
            <FormatIcon className="size-3.5" />
            {event.format}
            {event.city && <span className="text-bone/40">·</span>}
            {event.city && <span>{event.city}</span>}
            {event.is_featured && (
              <span className="ml-2 inline-flex items-center gap-1 text-gold-warm">
                <Sparkles className="size-3" /> destacado
              </span>
            )}
          </div>
          <h1 className="mt-3 font-display text-3xl text-bone sm:text-4xl lg:text-5xl">
            {event.title}
          </h1>
          {event.description && (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-bone/80">
              {event.description}
            </p>
          )}
        </motion.header>

        {event.cover_image_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 overflow-hidden rounded-3xl border border-white/[0.06]"
          >
            <img
              src={event.cover_image_url}
              alt={event.title}
              loading="eager"
              className="aspect-[16/9] w-full object-cover"
            />
          </motion.div>
        )}

        {/* Details grid */}
        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailCard icon={Calendar} label="Fecha">
            <p className="capitalize">{dateFormatted}</p>
            <p className="text-sm text-bone/60">{timeFormatted}</p>
          </DetailCard>

          <DetailCard icon={Clock} label="Duración">
            <p>{event.duration_min} minutos</p>
            <p className="text-sm text-bone/60">~{Math.round(event.duration_min / 60 * 10) / 10}h</p>
          </DetailCard>

          {event.venue_name ? (
            <DetailCard icon={MapPin} label="Venue">
              <p>{event.venue_name}</p>
              {event.venue_address && (
                <p className="text-sm text-bone/60">{event.venue_address}</p>
              )}
            </DetailCard>
          ) : isOnline ? (
            <DetailCard icon={Video} label="Online">
              <p>Zoom link al confirmar</p>
              <p className="text-sm text-bone/60">Conexión cualquier país</p>
            </DetailCard>
          ) : null}

          <DetailCard icon={Users} label="Cupos">
            {isSoldOut ? (
              <p className="text-red-300">Agotado</p>
            ) : (
              <>
                <p>
                  {event.spots_available}{" "}
                  <span className="text-sm text-bone/60">de {event.spots_total} disponibles</span>
                </p>
                {event.spots_available <= 3 && event.spots_available > 0 && (
                  <p className="text-sm text-amber-300">¡Últimos cupos!</p>
                )}
              </>
            )}
          </DetailCard>
        </div>

        {/* Price + CTA */}
        <div className="mt-10 rounded-3xl border border-emerald-brand/20 bg-gradient-to-br from-emerald-deep/20 via-transparent to-transparent p-6 sm:p-8">
          {event.price_amount != null && (
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-eyebrow text-emerald-brand">Inversión</p>
                <p className="mt-1 font-display text-3xl">
                  ${event.price_amount} {event.price_currency}
                </p>
              </div>
              {event.deposit_amount != null && (
                <div className="text-right">
                  <p className="text-xs uppercase tracking-eyebrow text-bone/60">Depósito para reservar</p>
                  <p className="mt-1 font-display text-xl text-emerald-glow">
                    ${event.deposit_amount} {event.deposit_currency}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {isPast ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-bone/60">
                <CheckCircle2 className="size-4" /> Este evento ya ocurrió
              </div>
            ) : isSoldOut ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-300">
                Agotado · síguenos para próximas fechas
              </div>
            ) : (
              <CTAButton
                onClick={() => setReserveOpen(true)}
                fullWidth
                className="sm:w-auto"
              >
                Reservar mi cupo
              </CTAButton>
            )}
          </div>
        </div>

        {event.tags && event.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs text-bone/70"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      <ReservationModal
        event={event}
        isOpen={reserveOpen}
        onClose={() => setReserveOpen(false)}
      />
    </div>
  );
}

function DetailCard({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Calendar;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-eyebrow text-bone/60">
        <Icon className="size-3.5" /> {label}
      </div>
      <div className="mt-2 text-base text-bone">{children}</div>
    </div>
  );
}

function setMeta(name: string, content: string, isProperty = false) {
  if (typeof document === "undefined") return;
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}
