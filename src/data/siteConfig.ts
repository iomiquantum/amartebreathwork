export const siteConfig = {
  brandName: "AMARTE",
  category: "BREATHWORK INMERSIVO",
  tagline: "Respiración · Sonido · Frecuencias",

  // Hero
  heroEyebrow: "BREATHWORK INMERSIVO",
  heroTitle: "Regula tu sistema nervioso.",
  heroSubtitle:
    "Tu cuerpo no está cansado. Tu sistema nervioso está saturado.",
  heroParagraph:
    "Vive una experiencia presencial de respiración, sonido y frecuencias diseñada para ayudarte a bajar el ruido mental, soltar tensión y volver a ti.",
  heroSchedule: "Experiencias presenciales en Ecuador + online · Cupos limitados por ciudad",

  // CTAs
  ctaPrimary: "Unirme al grupo de WhatsApp",
  ctaSecondary: "Ver cómo funciona",
  ctaFloatingMobile: "Entrar al grupo",
  ctaFloatingDesktop: "WhatsApp",
  ctaMicrocopy:
    "Recibe primero fechas, ubicación, horarios, valores y cupos disponibles.",

  // WhatsApp — grupo privado + mensaje directo
  whatsappGroupUrl: "https://chat.whatsapp.com/CqOmZpEIVGL54FPOj4xXYI?mode=gi_t",
  whatsappMessageUrl:
    "https://wa.me/593995656078?text=Hola%2C%20quiero%20unirme%20al%20grupo%20para%20recibir%20informaci%C3%B3n%20de%20las%20pr%C3%B3ximas%20experiencias%20inmersivas%20de%20respiraci%C3%B3n%2C%20sonido%20y%20frecuencias.",

  // Próxima experiencia (placeholder mientras no hay eventos en DB)
  nextDate: "Revisa el calendario",
  location: "Ecuador · Multi-ciudad + online",
  time: "Según ciudad y formato",
  duration: "60 a 90 minutos",
  capacity: "Cupos limitados por evento",
  // Cuando tengas la fecha confirmada, llena este ISO (ej: "2026-06-26T19:30:00-05:00").
  // Si lo dejas vacío, el countdown muestra "Por anunciar" con estilo.
  nextDateISO: "",

  // Próximas fechas (para sección Schedule). Cuando confirmes calendarios, llena estas.
  upcomingSessions: [
    // { dateISO: "2026-06-26T19:30:00-05:00", label: "Sesión 01", location: "Quito · CUMBAYÁ", spots: 12 },
  ] as Array<{ dateISO: string; label: string; location: string; spots: number }>,

  // Origen narrativo
  origin: {
    eyebrow: "Origen",
    title: "Cómo nace AMARTE.",
    paragraphs: [
      "Veníamos de años de hacer música. Estudios, sesiones, pantallas, deadlines. Trabajábamos rodeados de sonido — pero el cuerpo no escuchaba.",
      "Empezamos a notarlo en gente cercana: amigos, equipos, parejas. Mentes que no paraban. Hombros que no bajaban. Respiraciones cada vez más cortas.",
      "Combinamos lo que sabemos hacer — diseño sonoro, atmósferas, frecuencias — con lo que el cuerpo necesita: respiración, silencio, presencia.",
      "Así nació AMARTE. No como una clase. Como un ritual sensorial que viaja por Ecuador — presencial y online — para que tu sistema nervioso pueda volver a casa donde estés.",
    ],
  },

  // Frecuencias para preview (FrequenciesPlayer)
  // Cada una mapea a un "problema" del usuario. 40 segundos de preview.
  frequencies: [
    {
      hz: 174,
      label: "174 Hz",
      problem: "Para el estrés acumulado",
      benefit: "Sensación de base, seguridad y descanso del cuerpo.",
      color: "emerald",
    },
    {
      hz: 396,
      label: "396 Hz",
      problem: "Para soltar lo que cargas",
      benefit: "Asociada a liberación emocional y peso interno.",
      color: "gold",
    },
    {
      hz: 528,
      label: "528 Hz",
      problem: "Para respirar más profundo",
      benefit: "Conocida como frecuencia de coherencia cardio-respiratoria.",
      color: "emerald",
    },
    {
      hz: 741,
      label: "741 Hz",
      problem: "Para despejar la mente",
      benefit: "Vinculada a claridad mental y limpieza de ruido cognitivo.",
      color: "gold",
    },
  ] as Array<{
    hz: number;
    label: string;
    problem: string;
    benefit: string;
    color: "emerald" | "gold";
  }>,

  // Contacto
  contactEmail: "breathwork@amarteinc.com",
  instagram: "@amarteinc1212",
  instagramUrl: "https://www.instagram.com/amarteinc1212",
  tiktok: "@amarteinc1212",
  tiktokUrl: "https://www.tiktok.com/@amarteinc1212",

  // SEO
  seoTitle: "AMARTE | Breathwork Inmersivo · Regula tu sistema nervioso",
  seoDescription:
    "Experiencia auditiva inmersiva de respiración, sonido y frecuencias. Sesiones presenciales cada 15 días, jueves en la noche.",
  siteUrl: "https://breathwork.amarteinc.com",

  // Hooks rotativos (se ciclan en el hero cada 5s con fade)
  heroHooks: [
    "Tu cuerpo no está cansado. Tu sistema nervioso está saturado.",
    "Una noche para apagar el ruido y volver a ti.",
    "Respira. Escucha. Regula. Vuelve a ti.",
    "No vienes solo a respirar. Vienes a vivir una experiencia.",
    "Cuando el ruido externo baja, puedes escucharte otra vez.",
  ],

  // Testimonios — vacíos por ahora. Se llenan después de las primeras sesiones reales.
  // Soporta texto (quote) y/o video (videoUrl + videoPoster).
  // Si videoUrl está presente, el card muestra el video con thumbnail.
  // Ejemplo con video:
  //   { name: "Andrés", role: "Founder · Quito", rating: 5,
  //     quote: "Salí distinto.",
  //     videoUrl: "https://amarteinc.com/videos/andres.mp4",
  //     videoPoster: "https://amarteinc.com/videos/andres-poster.jpg" }
  testimonials: [] as Array<{
    quote: string;
    name: string;
    role: string;
    rating?: number;
    videoUrl?: string;
    videoPoster?: string;
  }>,

  // Guía / facilitador
  guide: {
    name: "Miguel Valencia",
    role: "Fundador y guía",
    bio: "Diseña experiencias auditivas inmersivas combinando respiración consciente, sonido y frecuencias. Trabaja desde el cruce entre música, neurociencia aplicada y bienestar moderno para crear espacios donde el sistema nervioso pueda volver a casa.",
    // Foto del guía. Placeholder de Unsplash mientras tienes foto real.
    // Cuando la tengas: sube a /public/guide.jpg y cambia photo a "/guide.jpg"
    photo:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&h=1000&fit=crop&crop=faces&q=85",
    credentials: [
      "Experiencia diseñando rituales sensoriales",
      "Investigación aplicada en regulación a través del sonido",
      "Enfoque integrador: cuerpo, respiración y atmósfera",
    ],
  },

  // Empresas / corporativo
  corporate: {
    headline: "Tus equipos también necesitan pausar.",
    body:
      "Diseñamos experiencias inmersivas privadas para empresas, agencias y equipos saturados. Una noche para que tu gente respire — y vuelva al trabajo distinta.",
    cta: "Hablemos de tu equipo",
    benefits: [
      "Sesiones privadas para 8–40 personas",
      "Diseño sonoro personalizado",
      "Ambientación e instalación incluida",
      "Reporte interno de impacto post-sesión",
    ],
  },

  // Lugares donde fuiste mencionado. Vacío hasta tener menciones reales.
  // Ejemplos cuando tengas: ["Diario El Comercio", "Podcast Bienestar Hoy", ...]
  press: [] as string[],

  // IDs de pixels y analytics. Cuando los tengas, pégalos aquí y se activan automáticamente.
  // Dejar vacío para no cargar tracking (útil en desarrollo).
  metaPixelId: "", // Ej: "1234567890123456" (de business.facebook.com → Events Manager)
  gaMeasurementId: "", // Ej: "G-XXXXXXXXXX" (de analytics.google.com)
  tiktokPixelId: "", // Ej: "C..." (de TikTok Ads Manager)
  clarityProjectId: "", // Ej: "abcd1234ef" (de clarity.microsoft.com → Setup)

  // Newsletter (Supabase tabla `subscribers` opcional)
  newsletter: {
    title: "¿No usas WhatsApp?",
    body:
      "Suscribite a 1 email mensual con la próxima fecha y prácticas cortas para regular tu sistema nervioso. Sin spam, sin venta agresiva.",
    cta: "Suscribirme",
  },

  // Galería atmosférica (etiquetas de mood — sustituye por imágenes reales cuando las tengas)
  gallery: [
    { label: "Audífonos", mood: "Intimidad sonora" },
    { label: "Luz cálida", mood: "Calma nocturna" },
    { label: "Ondas", mood: "Frecuencias guía" },
    { label: "Respiración", mood: "Cuerpo presente" },
  ],
};

export type SiteConfig = typeof siteConfig;
