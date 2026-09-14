// scripts/route-meta.mjs
// Tabla canónica de meta por ruta para el prerender estático (T4).
// IMPORTANTE — fuente espejo: cada entrada replica EXACTAMENTE los props
// del <PageMeta> de su página (src/pages/*.tsx, no editables en T4).
// Si cambias un title/description en una página, actualiza aquí la entrada
// gemela o el HTML prerenderizado quedará desfasado (el script no lo
// detecta: documenta el drift como riesgo conocido, ver plan futuro en T4).
//
// Rutas excluidas a propósito:
// - "/" (home = dist/index.html base, ya con su meta)
// - "/evento/:slug" (dinámica por slug de Supabase; prerender total = futuro)
// - "/admin/*" (no indexable; jamás generar copias estáticas)
// - "*" (404; debe seguir sirviendo el fallback SPA genérico)

export const SITE_URL = "https://breathwork.amarteinc.com";

export const ROUTE_META = [
  {
    route: "/corporativo",
    // src/pages/CorporatePage.tsx:171-175
    title: "AMARTE Corporativo · Breathwork para empresas en Ecuador",
    description:
      "Experiencias inmersivas de breathwork para equipos empresariales. Reducción de estrés, cohesión, productividad. Sesiones presenciales en Ecuador + online. Cotización personalizada.",
  },
  {
    route: "/mujeres",
    // src/pages/gender/genderContent.ts:44-46 (WOMEN_CONTENT)
    title: "AMARTE Breathwork para mujeres · Respiración cíclica en Ecuador",
    description:
      "Breathwork para mujeres y personas con ciclo. Respiración consciente que respeta tu fase del ciclo, embarazo, postparto, perimenopausia y menopausia. Sesiones en Ecuador y online.",
  },
  {
    route: "/hombres",
    // src/pages/gender/genderContent.ts:359-361 (MEN_CONTENT)
    title: "AMARTE Breathwork para hombres · Respiración, fuerza y recuperación en Ecuador",
    description:
      "Breathwork para hombres en Ecuador. Reduce cortisol, mejora HRV y sueño, baja la reactividad. Performance + recuperación + permiso de sentir. Sesiones presenciales y online.",
  },
  {
    route: "/jovenes",
    // src/pages/YouthPage.tsx:439-443
    title: "AMARTE Jóvenes · Breathwork para niños y colegios en Ecuador",
    description:
      "Breathwork adaptado para niños y adolescentes 9-17 años en Ecuador. Programas para familias y colegios. Regulación emocional con base neurocientífica, alineado al currículo SEL del Ministerio de Educación.",
  },
  {
    route: "/proceso",
    // src/pages/ProcessPage.tsx:38-42
    title: "Cómo construimos cada experiencia — AMARTE",
    description:
      "Cada sesión AMARTE tiene intención narrativa, capas sonoras diseñadas, frecuencias específicas y ambiente físico cuidado al detalle. Descubre qué pasa antes de que entres.",
  },
  {
    route: "/sobre-amarte",
    // src/pages/AboutPage.tsx:38-42
    title: "Sobre AMARTE · Una marca de respiración inmersiva",
    description:
      "AMARTE no nació de un curso ni de una franquicia. Nació de una historia personal y de la convicción de que el silencio bien diseñado puede regular lo que la vida acelerada desordena.",
  },
  {
    route: "/presentaciones",
    // src/pages/PresentacionesPage.tsx:77-81 (title = `Presentaciones — ${brandName}`)
    title: "Presentaciones — AMARTE",
    description:
      "Todas las experiencias AMARTE en un solo lugar: corporativo, jóvenes y colegios, mujeres, hombres y eventos. Elige una categoría para abrir su presentación.",
  },
  {
    route: "/test",
    // src/pages/TestPage.tsx:32-36
    title: "Test del sistema nervioso · 6 preguntas, 2 minutos — AMARTE",
    description:
      "¿Está tu sistema nervioso desregulado? Responde 6 preguntas en 2 minutos y descubre si AMARTE puede acompañarte. No es diagnóstico médico, es una guía rápida.",
  },
];
