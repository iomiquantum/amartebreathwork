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
  heroSchedule: "Sesiones cada 15 días · Jueves en la noche · Cupos limitados",

  // CTAs
  ctaPrimary: "Unirme al grupo de WhatsApp",
  ctaSecondary: "Ver cómo funciona",
  ctaFloatingMobile: "Entrar al grupo",
  ctaFloatingDesktop: "WhatsApp",
  ctaMicrocopy:
    "Recibe primero fechas, ubicación, horarios, valores y cupos disponibles.",

  // WhatsApp — REEMPLAZAR aquí cuando tengas el grupo y el número
  whatsappGroupUrl: "https://chat.whatsapp.com/REEMPLAZAR_AQUI",
  whatsappMessageUrl:
    "https://wa.me/593XXXXXXXXX?text=Hola%2C%20quiero%20unirme%20al%20grupo%20para%20recibir%20informaci%C3%B3n%20de%20las%20pr%C3%B3ximas%20experiencias%20inmersivas%20de%20respiraci%C3%B3n%2C%20sonido%20y%20frecuencias.",

  // Próxima experiencia
  nextDate: "Por anunciar",
  location: "Quito · Por anunciar",
  time: "Jueves · 19:30",
  duration: "60 a 90 minutos",
  capacity: "Cupos limitados",
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
      "Así nació AMARTE. No como una clase. Como un ritual nocturno, cada 15 días, para que tu sistema nervioso pueda volver a casa.",
    ],
  },

  // Contacto
  contactEmail: "TODO_EMAIL",
  instagram: "TODO_IG",
  instagramUrl: "TODO_IG_URL",

  // SEO
  seoTitle: "AMARTE | Breathwork Inmersivo · Regula tu sistema nervioso",
  seoDescription:
    "Experiencia auditiva inmersiva de respiración, sonido y frecuencias. Sesiones presenciales cada 15 días, jueves en la noche.",
  siteUrl: "TODO_URL",

  // Hooks rotativos (se ciclan en el hero cada 5s con fade)
  heroHooks: [
    "Tu cuerpo no está cansado. Tu sistema nervioso está saturado.",
    "Una noche para apagar el ruido y volver a ti.",
    "Respira. Escucha. Regula. Vuelve a ti.",
    "No vienes solo a respirar. Vienes a vivir una experiencia.",
    "Cuando el ruido externo baja, puedes escucharte otra vez.",
  ],

  // Testimonios (placeholders editables — reemplaza con voces reales después de la primera sesión)
  testimonials: [
    {
      quote:
        "Llegué con la cabeza llena. Salí sintiendo el cuerpo otra vez. No esperaba que algo tan simple me moviera tanto.",
      name: "María José",
      role: "Diseñadora · Quito",
      rating: 5,
    },
    {
      quote:
        "No es respirar y ya. Es bajar el volumen de todo lo que estás cargando. Dormí como hace meses no dormía.",
      name: "Andrés",
      role: "Founder · Quito",
      rating: 5,
    },
    {
      quote:
        "Me reconcilié con mi propia respiración. Es la pausa que no sabía que necesitaba.",
      name: "Camila",
      role: "Periodista · Quito",
      rating: 5,
    },
  ] as Array<{ quote: string; name: string; role: string; rating: number }>,

  // Guía / facilitador
  guide: {
    name: "Miguel Valencia",
    role: "Fundador y guía",
    bio: "Diseña experiencias auditivas inmersivas combinando respiración consciente, sonido y frecuencias. Trabaja desde el cruce entre música, neurociencia aplicada y bienestar moderno para crear espacios donde el sistema nervioso pueda volver a casa.",
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

  // Lugares donde fuiste mencionado (placeholders — reemplaza por logos reales)
  press: ["Revista Mundo", "Podcast Ec", "Diario El Comercio", "El Universo"],

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
