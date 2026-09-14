// PageMeta — meta tags por ruta (title + description + canonical absoluta + OG).
// Sin librerías nuevas: manipula document.head con useEffect, igual que el
// patrón ya usado en EventPage/GenderPage. No renderiza UI (retorna null),
// por lo que no afecta layout mobile ni accesibilidad de adultos mayores.
//
// Uso: <PageMeta title="…" description="…" path="/ruta" />
//  - title: <title> + og:title
//  - description: meta[name=description] + og:description
//  - path: ruta relativa ("/evento/mi-slug") → canonical absoluta + og:url
//  - ogType: "website" por defecto; EventPage pasa ogType="event".

import { useEffect } from "react";
import { siteConfig } from "../data/siteConfig";

type PageMetaProps = {
  title: string;
  description: string;
  /** Ruta relativa tal como aparece en el router, ej. "/corporativo" o "/evento/mi-slug". */
  path: string;
  ogType?: string;
};

function setMetaTag(name: string, content: string, isProperty = false) {
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

export function PageMeta({ title, description, path, ogType = "website" }: PageMetaProps) {
  useEffect(() => {
    const canonical = `${siteConfig.siteUrl}${path}`;

    document.title = title;
    setMetaTag("description", description);
    setMetaTag("og:title", title, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:url", canonical, true);
    setMetaTag("og:type", ogType, true);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    let created = false;
    const previous = link?.getAttribute("href") ?? null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
      created = true;
    }
    link.setAttribute("href", canonical);

    return () => {
      // Restaurar valores base del index.html al desmontar (navegación SPA).
      document.title = siteConfig.seoTitle;
      setMetaTag("description", siteConfig.seoDescription);
      if (created) {
        link?.remove();
      } else if (previous) {
        link?.setAttribute("href", previous);
      } else {
        link?.removeAttribute("href");
      }
    };
  }, [title, description, path, ogType]);

  return null;
}
