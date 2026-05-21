import { useEffect } from "react";
import { siteConfig } from "../data/siteConfig";
import { FAQS } from "../data/faqs";

function aggregateRating() {
  const ts = siteConfig.testimonials ?? [];
  if (!ts.length) return null;
  const sum = ts.reduce((s, t) => s + (t.rating ?? 5), 0);
  return {
    "@type": "AggregateRating",
    ratingValue: (sum / ts.length).toFixed(1),
    reviewCount: ts.length,
    bestRating: 5,
    worstRating: 1,
  };
}

export function StructuredData() {
  useEffect(() => {
    const id = "amarte-jsonld";
    document.getElementById(id)?.remove();

    const data = [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.brandName,
        url: siteConfig.siteUrl,
        description: siteConfig.seoDescription,
        sameAs: [siteConfig.instagramUrl],
        email: siteConfig.contactEmail,
        ...(aggregateRating() && {
          aggregateRating: aggregateRating(),
          review: (siteConfig.testimonials ?? []).map((t) => ({
            "@type": "Review",
            reviewBody: t.quote,
            author: { "@type": "Person", name: t.name },
            reviewRating: {
              "@type": "Rating",
              ratingValue: t.rating ?? 5,
              bestRating: 5,
              worstRating: 1,
            },
          })),
        }),
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.brandName,
        url: siteConfig.siteUrl,
      },
      {
        "@context": "https://schema.org",
        "@type": "Event",
        name: `${siteConfig.brandName} · Breathwork Inmersivo`,
        description:
          "Experiencia presencial de respiración, sonido y frecuencias para regular el sistema nervioso.",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: "Quito, Ecuador",
          address: { "@type": "PostalAddress", addressLocality: "Quito", addressCountry: "EC" },
        },
        organizer: {
          "@type": "Organization",
          name: siteConfig.brandName,
          url: siteConfig.siteUrl,
        },
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/LimitedAvailability",
          url: siteConfig.whatsappGroupUrl,
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ];

    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  return null;
}
