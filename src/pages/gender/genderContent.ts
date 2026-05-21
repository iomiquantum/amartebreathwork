// Copy de las landings /mujeres y /hombres. Todo en un solo lugar para editar fácil.
// El componente GenderPage es agnóstico — solo renderiza lo que recibe.

import {
  Activity,
  Anchor,
  Baby,
  BedDouble,
  Brain,
  Briefcase,
  Compass,
  Dumbbell,
  EyeOff,
  Flame,
  Flower2,
  HandHeart,
  Heart,
  HeartHandshake,
  HeartPulse,
  Moon,
  Mountain,
  Rocket,
  ShieldCheck,
  Sparkles,
  Sun,
  Sunset,
  Target,
  Waves,
  Wind,
  Zap,
} from "lucide-react";
import type { GenderContent } from "./types";

// ============================================
// MUJERES
// ============================================

export const WOMEN_CONTENT: GenderContent = {
  audience: "women",
  route: "/mujeres",
  themeClass: "theme-women",
  trackingSource: "women_landing",

  seoTitle: "AMARTE Breathwork para mujeres · Respiración cíclica en Ecuador",
  seoDescription:
    "Breathwork para mujeres y personas con ciclo. Respiración consciente que respeta tu fase del ciclo, embarazo, postparto, perimenopausia y menopausia. Sesiones en Ecuador y online.",

  // Hero
  heroEyebrow: "Para mujeres y personas con ciclo",
  heroTitleLine1: "Tu respiración no es plana.",
  heroTitleLine2: "Es lunar.",
  heroSubhead:
    "AMARTE Breathwork para mujeres: una experiencia que respeta tu ciclo, tu etapa de vida y tu sistema nervioso cíclico. No es bienestar genérico. Es regreso a tu cuerpo como aliado.",
  heroCtaPrimary: "Quiero conocer mi sesión",
  heroCtaSecondary: "Ver la ciencia",
  heroBadgeLeft: "Respuesta personalizada en 24h",
  heroBadgeRight: "Ecuador + online",
  heroVisualLabel: "Cíclico",

  // Stats — todos con fuentes reales
  stats: [
    { value: "2×", label: "más ansiedad y depresión en mujeres latinoamericanas que en hombres", source: "Lancet Regional 2025" },
    { value: "55.8 h", label: "trabaja la mujer ecuatoriana por semana entre lo pagado y lo invisible", source: "Banco Mundial" },
    { value: "52%", label: "menos sofocos en menopausia con paced breathing a 6 ciclos por minuto", source: "RCT publicado · PMC" },
    { value: "1 de 3", label: "ha vivido violencia física o sexual a lo largo de su vida", source: "OMS · prevalencia global" },
  ],

  // Problem
  problemEyebrow: "Quizás te suena",
  problemTitle: "Ya sabes lo que te dicen.",
  problemTitleHighlight: "Pero nadie te explicó esto.",
  problemBullets: [
    "Tu fase folicular pide algo distinto a tu fase lútea — y nadie te enseñó la diferencia.",
    "El embarazo y el postparto necesitan respiración suave. No Wim Hof. No retenciones largas.",
    "La perimenopausia tiene una respiración. La menopausia también. Y casi nadie habla de eso.",
    "Cargas trabajo pagado + carga mental invisible. Tu sistema nervioso necesita más regulación, no más exigencia.",
    "Tu cuerpo guarda cosas que tu mente prefiere no nombrar. La respiración llega ahí cuando las palabras no llegan.",
  ],
  problemClosing:
    "Aquí no te decimos que respires más. Te enseñamos a respirar contigo.",

  // ARQUETIPOS — 6 perfiles concretos con datos LATAM
  archetypesEyebrow: "¿Te identificas?",
  archetypesTitle: "Seis mujeres distintas.",
  archetypesTitleHighlight: "Una respiración para cada una.",
  archetypesLede:
    "No diseñamos sesiones genéricas. Estos son los perfiles que más llegan a AMARTE — quizás uno te describe mejor que los demás. La sesión se adapta a ti, no al revés.",
  archetypes: [
    {
      icon: Briefcase,
      name: "La profesional al borde",
      ageRange: "28 – 40 años",
      profile: "Jornadas que no terminan, decisiones todo el día, sueño que no se entrega. Decir 'no' se siente imposible. El cuerpo empieza a quejarse antes que la mente.",
      stat: "46% de los trabajadores en Latinoamérica reportó burnout en 2024 — las mujeres más que los hombres (15% vs 12% en forma frecuente).",
      source: "Buk · Estudio Burnout Laboral 2025",
    },
    {
      icon: Baby,
      name: "La mamá agotada",
      ageRange: "28 – 42 años",
      profile: "Postparto, lactancia, sueño de 4 horas a pedazos. La expectativa de 'lo tengo todo' pesa como otra carga. Te quieres a tu bebé y a la vez quieres recuperar tu cuerpo.",
      stat: "13 a 35% de las latinoamericanas vive depresión postparto (media 17.7%). En Ecuador, hasta 34% en algunos estudios.",
      source: "MGYF revisión sistemática · Hospital IESS Cuenca",
    },
    {
      icon: Sunset,
      name: "La mujer en transición hormonal",
      ageRange: "40 – 55 años",
      profile: "Perimenopausia y menopausia: sofocos, insomnio, ansiedad que aparece sin motivo claro, cuerpo que cambia. 'No me reconozco.' Y casi nadie te explicó que esto venía.",
      stat: "80% de las mujeres en perimenopausia experimenta síntomas vasomotores; en 50% afecta la calidad de vida diaria.",
      source: "Harvard Health · PMC menopausia",
    },
    {
      icon: HandHeart,
      name: "La cuidadora invisible",
      ageRange: "35 – 60 años",
      profile: "Hijos, padres mayores, casa, trabajo. Trabajas más horas que tu pareja — la mayoría sin pago. Cuando paras, el cuerpo cobra todo junto.",
      stat: "Las mujeres en Ecuador trabajan 55.8 horas a la semana — 6 horas más que los hombres, casi todo trabajo no remunerado.",
      source: "Banco Mundial · INEC Ecuador",
    },
    {
      icon: ShieldCheck,
      name: "La que carga lo no nombrado",
      ageRange: "Cualquier edad",
      profile: "Trauma, violencia, pérdida, abuso silenciado. La terapia ayuda, pero hay capas que solo el cuerpo puede soltar. La respiración llega ahí sin pedirte que cuentes nada.",
      stat: "1 de cada 3 mujeres ha vivido violencia física o sexual a lo largo de su vida (OMS). En Ecuador supera el 30%.",
      source: "OMS · CEPAL",
    },
    {
      icon: Compass,
      name: "La que quiere reconectar",
      ageRange: "Cualquier edad",
      profile: "Sin crisis declarada. Solo la sensación de vivir desconectada del cuerpo. Yoga ayudó. La meditación ayudó. Pero falta algo que el cuerpo necesita más directo.",
      stat: "El consumo de meditación y mindfulness creció 18.9% anual en 2024 — las mujeres representan ~70% del mercado.",
      source: "McKinsey Future of Wellness",
    },
  ],

  // Science
  scienceEyebrow: "La evidencia",
  scienceTitle: "Lo que dice la ciencia,",
  scienceTitleHighlight: "no el wellness genérico.",
  scienceCards: [
    {
      icon: Moon,
      title: "Tu sistema nervioso es cíclico",
      body: "La actividad vagal cardíaca cae de la fase folicular a la lútea. Significa que la segunda mitad del ciclo tu cuerpo está más reactivo, aunque tú no lo nombres. Breathwork es regulación cíclica, no genérica.",
    },
    {
      icon: Waves,
      title: "Paced breathing reduce sofocos 52%",
      body: "Un RCT con respiración a 6 ciclos por minuto, dos veces al día, mostró 52% menos sofocos en menopausia. También mejora sueño, PMS y estabilidad emocional.",
    },
    {
      icon: Sparkles,
      title: "Estrógeno y progesterona moldean tu aire",
      body: "Las dos hormonas regulan tu ventilación pulmonar y tu respuesta autonómica. Tu cuerpo ya está cambiando con el ciclo: la respiración consciente lo acompaña en lugar de pelear con él.",
    },
    {
      icon: ShieldCheck,
      title: "Embarazo: solo técnicas seguras",
      body: "Wim Hof y holotrópico están contraindicados en embarazo. Lo seguro es diafragmática suave, coherencia cardíaca y pranayama lenta. AMARTE adapta cada sesión a tu trimestre.",
    },
  ],

  // Experience
  experienceEyebrow: "La experiencia",
  experienceTitle: "60 minutos para",
  experienceTitleHighlight: "regresar a ti.",
  experienceLede:
    "No te pedimos que medites. No te pedimos que entiendas. Solo te pedimos que respires — el resto lo hace tu cuerpo.",
  experienceBullets: [
    "Sonido binaural y frecuencias 174 – 528 Hz",
    "Respiración guiada en español, voz cálida, sin tecnicismos",
    "Iluminación baja, colchonetas, antifaz opcional",
    "Sin religión, sin escenas incómodas, sin contactos no consentidos",
    "Cierre con integración: bebida cálida y silencio compartido",
  ],

  // Life stages
  lifeStagesEyebrow: "Para cada etapa",
  lifeStagesTitle: "Tu cuerpo no es el mismo a los 25 que a los 45.",
  lifeStagesTitleHighlight: "Tu respiración tampoco debería serlo.",
  lifeStagesLede:
    "Adaptamos cada sesión a la fase del ciclo o de la vida en la que estés. No te exigimos una técnica que tu cuerpo no necesita hoy.",
  lifeStages: [
    {
      icon: Sun,
      badge: "Ciclo regular",
      title: "Folicular fuerte, lútea suave",
      body: "En tus días de más energía abrimos espacio para respiraciones activadoras. En la segunda mitad del ciclo bajamos el ritmo, priorizamos coherencia cardíaca y descanso del sistema nervioso.",
    },
    {
      icon: Heart,
      badge: "Embarazo",
      title: "Suave y segura, cada trimestre",
      body: "Sin retenciones largas, sin hiperventilación. Diafragmática consciente, pranayama lenta y meditación guiada. Espacio para conectar con el bebé sin riesgo.",
    },
    {
      icon: HeartHandshake,
      badge: "Postparto",
      title: "Reordenar el cuerpo después de dar",
      body: "Cambios hormonales bruscos + falta de sueño = sistema nervioso saturado. Sesiones cortas, ritmo suave, comunidad de mamás reales. Bebé bienvenido en algunas sesiones.",
    },
    {
      icon: Wind,
      badge: "Perimenopausia",
      title: "Cuando todo fluctúa",
      body: "Sofocos, insomnio, ansiedad que aparece sin avisar. Paced breathing a 6 bpm como herramienta concreta, evidencia clínica detrás. Aquí no hay 'ya pasará'.",
    },
    {
      icon: Flower2,
      badge: "Menopausia",
      title: "Otro equilibrio, no menos vida",
      body: "Menos estrógeno no es menos potencia. Trabajamos respiración para sueño, ánimo estable y reconexión con un cuerpo que cambió — y sigue siendo tuyo.",
    },
  ],

  // Benefits
  benefitsEyebrow: "Lo que vas a notar",
  benefitsTitle: "Cambios reales,",
  benefitsTitleHighlight: "no promesas.",
  benefits: [
    {
      icon: Brain,
      title: "Ansiedad cíclica con menos picos",
      body: "Sobre todo la segunda mitad del ciclo, cuando el sistema nervioso está más reactivo. No es magia: es regulación parasimpática.",
    },
    {
      icon: BedDouble,
      title: "Sueño más profundo",
      body: "Especialmente en fase lútea y en perimenopausia. Vas a dormir distinto desde la primera semana.",
    },
    {
      icon: Activity,
      title: "Menos dolor menstrual y PMS",
      body: "La respiración diafragmática regular baja el tono simpático crónico que amplifica los síntomas.",
    },
    {
      icon: Sparkles,
      title: "Sofocos atenuados",
      body: "Sin reemplazar tratamiento médico, sí complementándolo. Herramienta que llevas a donde sea.",
    },
    {
      icon: Heart,
      title: "Cuerpo-mente reconectados",
      body: "Lo que la terapia conversacional sola a veces no toca. La respiración llega donde las palabras no llegan.",
    },
    {
      icon: HeartHandshake,
      title: "Comunidad real",
      body: "Mujeres reales en Ecuador. No influencers. No exigencia de pertenecer. Solo el alivio de no estar sola.",
    },
  ],

  // Guide
  guideEyebrow: "Quién facilita",
  guideTitle: "Miguel · facilitador AMARTE",
  guideQuote:
    "Soy hombre y guío mujeres con humildad. Aprendí de mujeres, leo evidencia, y entrego un espacio donde puedes cerrar los ojos sin sentirte vigilada. Si algo no te suena, no te toca; si todo se mueve, ahí estamos.",

  // FAQ
  faqEyebrow: "Preguntas frecuentes",
  faqTitle: "Lo que más nos preguntan",
  faqs: [
    {
      q: "¿Es seguro si estoy embarazada?",
      a: "Sí, pero solo con técnicas suaves: diafragmática, coherencia cardíaca y pranayama lenta. No usamos Wim Hof ni retenciones largas durante el embarazo. Cuéntanos tu trimestre en el formulario y te confirmamos qué sesión te conviene.",
    },
    {
      q: "¿Realmente sirve en menopausia y perimenopausia?",
      a: "Hay evidencia clínica directa: paced breathing a 6 ciclos por minuto reduce hasta 52% los sofocos, mejora el sueño y baja la ansiedad fluctuante. No reemplaza tu tratamiento médico, lo complementa.",
    },
    {
      q: "Soy hombre o persona no-binaria, ¿puedo asistir igual?",
      a: "Sí. Esta página usa lenguaje específico para hablar más cerca con mujeres y personas con ciclo, pero todas las sesiones AMARTE son para todes. Si te sientes más cómode con un grupo mixto o con un grupo específico, cuéntanos.",
    },
    {
      q: "¿Es terapia?",
      a: "No. Es una práctica somática complementaria a la terapia (no la sustituye). Si estás en proceso terapéutico, esto suma. Si nunca has hecho terapia, también puedes empezar aquí.",
    },
    {
      q: "¿Cuánto cuesta?",
      a: "Sesiones online desde $18 USD. Sesiones presenciales en Quito, Cumbayá y otras ciudades desde $35 USD. Eventos específicos pueden tener otro valor.",
    },
    {
      q: "¿Necesito experiencia previa?",
      a: "Cero. No hay forma 'correcta' de respirar. Si entras dispuesta, ya tienes lo que necesitas.",
    },
  ],

  // Form
  formEyebrow: "Tu sesión",
  formTitle: "Cuéntanos dónde estás",
  formTitleHighlight: "y te orientamos.",
  formLede:
    "No es un formulario más. Lo lee Miguel y te responde personalmente por WhatsApp en menos de 24h con la sesión que mejor se acomoda a tu cuerpo y tu momento.",
  ageRanges: [
    { value: "18-24", label: "18 – 24" },
    { value: "25-34", label: "25 – 34" },
    { value: "35-44", label: "35 – 44" },
    { value: "45-54", label: "45 – 54" },
    { value: "55+", label: "55 +" },
  ],
  interests: [
    { value: "presencial", label: "Sesión presencial en Ecuador" },
    { value: "online", label: "Sesión online" },
    { value: "uno_a_uno", label: "Sesión uno a uno (privada)" },
    { value: "grupo_mujeres", label: "Círculo solo de mujeres" },
    { value: "no_se", label: "Aún no sé, oriéntenme" },
  ],
  formConfig: {
    specificField: {
      key: "lifeStage",
      label: "¿En qué etapa de tu cuerpo estás?",
      options: [
        { value: "regular_cycle", label: "Ciclo regular" },
        { value: "pregnancy", label: "Embarazada" },
        { value: "postpartum", label: "Postparto (primer año)" },
        { value: "perimenopause", label: "Perimenopausia" },
        { value: "menopause", label: "Menopausia" },
        { value: "prefer_not", label: "Prefiero no decir" },
      ],
    },
    secondaryField: {
      key: "mainConcern",
      label: "¿Qué te trae hoy?",
      options: [
        { value: "stress", label: "Estrés y ansiedad" },
        { value: "sleep", label: "Sueño y descanso" },
        { value: "hormonal", label: "Síntomas hormonales (sofocos, ciclo, etc.)" },
        { value: "trauma", label: "Procesos somáticos / trauma" },
        { value: "burnout", label: "Burnout / carga mental" },
        { value: "curiosity", label: "Curiosidad / quiero probar" },
      ],
    },
  },

  // Final CTA
  finalCtaTitle: "Tu cuerpo ya sabe respirar.",
  finalCtaSubtitle: "Solo necesita un lugar para recordarlo.",
  finalCtaButton: "Quiero mi sesión",

  // Inclusivity note
  inclusivityNote:
    "AMARTE es para todes. Esta página usa lenguaje específico para hablar más cerca con mujeres y personas con ciclo menstrual, pero todas las personas son bienvenidas en cualquier sesión, sin importar identidad de género.",
};

// ============================================
// HOMBRES
// ============================================

export const MEN_CONTENT: GenderContent = {
  audience: "men",
  route: "/hombres",
  themeClass: "theme-men",
  trackingSource: "men_landing",

  seoTitle: "AMARTE Breathwork para hombres · Respiración, fuerza y recuperación en Ecuador",
  seoDescription:
    "Breathwork para hombres en Ecuador. Reduce cortisol, mejora HRV y sueño, baja la reactividad. Performance + recuperación + permiso de sentir. Sesiones presenciales y online.",

  // Hero
  heroEyebrow: "Para hombres y personas que se identifican como masculinas",
  heroTitleLine1: "Ser fuerte",
  heroTitleLine2: "es saber respirar.",
  heroSubhead:
    "AMARTE Breathwork para hombres: una herramienta concreta para rendir más, dormir mejor y bajar la reactividad. Sin terapia obligatoria. Sin alpha bro. Solo respiración real, con ciencia detrás.",
  heroCtaPrimary: "Quiero mi sesión",
  heroCtaSecondary: "Ver la ciencia",
  heroBadgeLeft: "Respuesta personalizada en 24h",
  heroBadgeRight: "Ecuador + online",
  heroVisualLabel: "Sostenido",

  // Stats — todos con fuentes reales
  stats: [
    { value: "3×", label: "más suicidios en hombres que en mujeres en Ecuador (13.2 vs 5.3 por 100K)", source: "Estudio nacional Ecuador" },
    { value: "95%", label: "de los hombres ya considera la salud mental tan importante como la física", source: "Men's Health Survey 2023" },
    { value: "1–2%", label: "baja la testosterona por año después de los 40. El cortisol crónico la baja más", source: "Stony Brook Medicine" },
    { value: "↑ HRV", label: "mejora medible con respiración estilo Wim Hof, ya respaldada peer-reviewed", source: "PLOS One systematic review 2023" },
  ],

  // Problem
  problemEyebrow: "Quizás te suena",
  problemTitle: "No te falta voluntad.",
  problemTitleHighlight: "Te sobra cortisol.",
  problemBullets: [
    "Llevas años respirando con el pecho, hablando con la mandíbula apretada, durmiendo con el teléfono cerca.",
    "El gimnasio ayuda. La terapia ayuda. Pero hay algo que solo se desbloquea cuando el aire vuelve al diafragma.",
    "En Latinoamérica el suicidio masculino sube — y nadie habla. El silencio no es fortaleza, es síntoma.",
    "El cortisol alto bloquea la testosterona. Si no regulas el estrés, no hay suplemento que compense.",
    "No necesitas otro hack de productividad. Necesitas una herramienta que tu cuerpo recuerde solo.",
  ],
  problemClosing:
    "Aquí no venimos a curarte. Venimos a darte una herramienta — y un lugar donde puedas usarla sin tener que explicarte.",

  // ARQUETIPOS — 6 perfiles concretos con datos LATAM
  archetypesEyebrow: "¿Te identificas?",
  archetypesTitle: "Seis hombres distintos.",
  archetypesTitleHighlight: "Una respiración para cada uno.",
  archetypesLede:
    "No diseñamos sesiones genéricas. Estos son los perfiles que más llegan a AMARTE — quizás uno te describe mejor que los demás. La sesión se adapta a ti, no al revés.",
  archetypes: [
    {
      icon: Briefcase,
      name: "El ejecutivo bajo presión",
      ageRange: "32 – 50 años",
      profile: "Decisiones difíciles todo el día. Sueño pobre. Mandíbula apretada. Hijos chicos en casa. El cuerpo empieza a quejarse antes de que te des cuenta.",
      stat: "17% de la gerencia media en LATAM sufre burnout frecuente — la cifra más alta del mercado laboral regional.",
      source: "Buk · Estudio Burnout 2025",
    },
    {
      icon: Rocket,
      name: "El emprendedor que no para",
      ageRange: "28 – 48 años",
      profile: "Cargas todo. Soledad de la silla del fundador. Sin vacaciones reales en años. Cortisol es tu combustible y tu sabotaje a la vez.",
      stat: "65% de los altos directivos en Latinoamérica prioriza beneficios de bienestar sobre aumento salarial.",
      source: "La Nota Económica · LATAM",
    },
    {
      icon: Baby,
      name: "El papá joven",
      ageRange: "28 – 42 años",
      profile: "Familia, trabajo, identidad nueva. Llegas a casa sin batería para tu hijo o tu pareja. Quieres estar presente — pero el cuerpo dice que ya no puede más.",
      stat: "1 de cada 10 padres reporta síntomas de depresión postparto paterna — y la gran mayoría nunca se diagnostica.",
      source: "JAMA Pediatrics · estudios paternal PPD",
    },
    {
      icon: Dumbbell,
      name: "El atleta amateur",
      ageRange: "25 – 45 años",
      profile: "Crossfit, running, triatlón, ciclismo. Buscas HRV, recovery medible, performance real. Tu wearable ya te dice que falta algo.",
      stat: "Breathwork tipo Wim Hof mejora HRV y respuesta al estrés con evidencia peer-reviewed publicada.",
      source: "PLOS One · systematic review 2023",
    },
    {
      icon: EyeOff,
      name: "El hombre en silencio",
      ageRange: "Cualquier edad",
      profile: "No hablas. Pones buena cara. Cargas sin nombrar. La descarga al volver a casa, al volante o adentro tuyo. Y nadie se entera hasta que algo se rompe.",
      stat: "Los hombres se suicidan 3× más que las mujeres en Ecuador. El silencio no es fortaleza — es síntoma.",
      source: "Estudio nacional Ecuador · PMC",
    },
    {
      icon: Anchor,
      name: "El hombre 45+",
      ageRange: "45 – 65 años",
      profile: "Andropausia silenciosa. Testosterona baja, sueño se rompe, energía falla, cuerpo cambia. Identidad también. Nadie te preparó para esto.",
      stat: "La testosterona baja 1 a 2% por año desde los 40. El cortisol crónico acelera el descenso. La respiración baja cortisol.",
      source: "Stony Brook Medicine",
    },
  ],

  // Science
  scienceEyebrow: "La evidencia",
  scienceTitle: "Datos duros,",
  scienceTitleHighlight: "no marketing.",
  scienceCards: [
    {
      icon: Wind,
      title: "Tu diafragma está rígido",
      body: "Bajo estrés crónico la respiración se vuelve torácica y superficial. El diafragma se contrae poco. Reentrenarlo no es romántico — es performance puro. Más volumen tidal, mejor recuperación.",
    },
    {
      icon: HeartPulse,
      title: "Wim Hof tiene papers reales",
      body: "Una revisión sistemática (PLOS One, 2023) muestra mejoras en variabilidad cardíaca, respuesta al estrés y recuperación cardiovascular. No es secta — es protocolo medido.",
    },
    {
      icon: Zap,
      title: "Cortisol bloquea testosterona",
      body: "Cuando el cortisol vive alto, la producción de testosterona baja. Respirar baja cortisol. La ecuación es directa: mejor respiración → mejor perfil hormonal masculino.",
    },
    {
      icon: ShieldCheck,
      title: "La ventana cultural ya se abrió",
      body: "95% de los hombres hoy dice que salud mental es tan importante como la física. Lo que antes era 'cosa rara' hoy es ventaja competitiva — en tu carrera, en tu casa y en tu cuerpo.",
    },
  ],

  // Experience
  experienceEyebrow: "La experiencia",
  experienceTitle: "60 minutos que",
  experienceTitleHighlight: "tu sistema nervioso no olvida.",
  experienceLede:
    "No te pedimos que hables. No te pedimos que llores. Solo te pedimos que respires — y que dejes que el cuerpo haga lo que ya sabe hacer.",
  experienceBullets: [
    "Sonido binaural y frecuencias 174 – 528 Hz",
    "Respiración guiada en español: box breathing, coherencia, Wim Hof opcional",
    "Iluminación baja, colchonetas, antifaz opcional",
    "Sin religión, sin obligación de compartir nada",
    "Cierre con silencio. Sales con el sistema nervioso reseteado.",
  ],

  // Life stages
  lifeStagesEyebrow: "Para cada etapa",
  lifeStagesTitle: "Tu cuerpo no es el mismo a los 25 que a los 45.",
  lifeStagesTitleHighlight: "Tu respiración tampoco debería serlo.",
  lifeStagesLede:
    "Adaptamos cada sesión a tu momento. No te ponemos a hacer Wim Hof si lo que necesitas es coherencia cardíaca, ni al revés.",
  lifeStages: [
    {
      icon: Mountain,
      badge: "20 – 30 · Performance",
      title: "Foco y recuperación",
      body: "Protocolos respiratorios pre y post entreno. Wim Hof, retenciones controladas, coherencia. Para entrenar más sin desgastarte y para que el cortisol no se desayune tu testosterona.",
    },
    {
      icon: Target,
      badge: "30 – 45 · Ejecutivo bajo presión",
      title: "Decisiones difíciles, sueño que no se entrega",
      body: "Hijos pequeños, deadline que no respeta, cuerpo que empieza a quejarse. Respirar antes de explotar. Box breathing entre reuniones. Sueño profundo otra vez.",
    },
    {
      icon: Compass,
      badge: "45 + · Andropausia",
      title: "Testosterona en descenso, recuperación más lenta",
      body: "1 a 2% menos T por año desde los 40. Si encima vives con cortisol alto, el descenso se acelera. Breathwork como ancla hormonal y mejor descanso.",
    },
    {
      icon: Dumbbell,
      badge: "Atleta amateur",
      title: "Más VO2, mejor HRV",
      body: "Protocolos respiratorios documentados: Wim Hof para tolerancia al estrés, box breathing para foco competitivo, coherencia para recovery. Datos visibles en Whoop / Garmin / Oura.",
    },
    {
      icon: Flame,
      badge: "Padre presente",
      title: "Regular para no descargar",
      body: "Lo que no procesas en tu sistema nervioso, lo descargas en tu familia. Breathwork no es egoísmo — es responsabilidad masculina. Tu casa también respira contigo.",
    },
  ],

  // Benefits
  benefitsEyebrow: "Lo que vas a notar",
  benefitsTitle: "Resultados medibles,",
  benefitsTitleHighlight: "no humo.",
  benefits: [
    {
      icon: HeartPulse,
      title: "Más HRV, mejor recuperación",
      body: "Variabilidad cardíaca más alta = sistema nervioso más resiliente. Lo ves en tu reloj a los 10 días.",
    },
    {
      icon: BedDouble,
      title: "Sueño profundo otra vez",
      body: "Más deep sleep, menos despertares. Tu Whoop o tu Oura lo va a confirmar antes que tú.",
    },
    {
      icon: Brain,
      title: "Foco sostenido",
      body: "Jornadas largas sin que el cerebro se nuble a las 3 PM. Sin café extra. Solo aire bien usado.",
    },
    {
      icon: Activity,
      title: "Reactividad baja",
      body: "Menos explosiones. Menos discusiones con tu pareja por tonterías. La pausa entre estímulo y respuesta se ensancha.",
    },
    {
      icon: Zap,
      title: "Energía hormonal estable",
      body: "Cortisol regulado → testosterona protegida. Libido y energía en el día sin altibajos.",
    },
    {
      icon: HeartHandshake,
      title: "Brotherhood real",
      body: "Hombres reales en Ecuador. No networking. No competencia. Solo el alivio de respirar entre pares.",
    },
  ],

  // Guide
  guideEyebrow: "Quién facilita",
  guideTitle: "Miguel · facilitador AMARTE",
  guideQuote:
    "Soy hombre y respiro con hombres porque sé lo que cuesta callarse. Aquí no hablamos por hablar — aquí respiramos. Si algo se mueve adentro, se mueve. Si no, también está bien. No vas a salir 'sanado', vas a salir con una herramienta que llevas contigo para siempre.",

  // FAQ
  faqEyebrow: "Preguntas frecuentes",
  faqTitle: "Lo que más nos preguntan",
  faqs: [
    {
      q: "¿Es Wim Hof?",
      a: "A veces. Depende de la sesión y de tu momento. Wim Hof es una de varias técnicas que usamos: también box breathing, coherencia cardíaca, pranayama. Nunca te obligamos a hacer algo si no estás listo.",
    },
    {
      q: "¿Tengo que llorar o compartir cosas?",
      a: "No. Tampoco tienes que aguantarte. Aquí no hay agenda emocional. Si tu cuerpo suelta algo, lo soltamos en silencio. Si no, también perfecto.",
    },
    {
      q: "¿Y si tengo presión alta o alguna condición médica?",
      a: "Hay técnicas que son seguras (coherencia cardíaca, diafragmática) y otras que requieren consulta previa (Wim Hof intenso, retenciones largas). Cuéntanos en el formulario y te orientamos antes de la sesión.",
    },
    {
      q: "¿Funciona si ya entreno fuerte?",
      a: "Más todavía. Breathwork es complemento directo al entreno: mejora VO2, recovery y HRV. Si llevas un wearable, los números los vas a ver subir.",
    },
    {
      q: "¿Es para mí si nunca he meditado?",
      a: "Especialmente para ti. Esto no es meditación. No hay que poner la mente en blanco ni quedarte quieto pensando. Es activo, físico, con sonido. Más cercano a un entreno que a un retiro.",
    },
    {
      q: "¿Cuánto cuesta?",
      a: "Sesiones online desde $18 USD. Presenciales en Quito, Cumbayá y otras ciudades desde $35 USD. Eventos específicos pueden tener otro valor.",
    },
  ],

  // Form
  formEyebrow: "Tu sesión",
  formTitle: "Cuéntanos dónde estás",
  formTitleHighlight: "y te orientamos.",
  formLede:
    "No es un formulario más. Lo lee Miguel y te responde personalmente por WhatsApp en menos de 24h. Te dice qué sesión te conviene y por qué — sin venderte de más.",
  ageRanges: [
    { value: "18-24", label: "18 – 24" },
    { value: "25-34", label: "25 – 34" },
    { value: "35-44", label: "35 – 44" },
    { value: "45-54", label: "45 – 54" },
    { value: "55+", label: "55 +" },
  ],
  interests: [
    { value: "presencial", label: "Sesión presencial en Ecuador" },
    { value: "online", label: "Sesión online" },
    { value: "uno_a_uno", label: "Sesión uno a uno (privada)" },
    { value: "grupo_hombres", label: "Círculo solo de hombres" },
    { value: "no_se", label: "Aún no sé, oriéntenme" },
  ],
  formConfig: {
    specificField: {
      key: "mainGoal",
      label: "¿Qué buscas primero?",
      options: [
        { value: "performance", label: "Rendimiento (foco, energía, recuperación)" },
        { value: "recovery", label: "Recuperación post-entreno / sueño" },
        { value: "stress", label: "Bajar estrés y reactividad" },
        { value: "relationships", label: "Presencia en relaciones (pareja, hijos)" },
        { value: "emotional_health", label: "Salud emocional / procesar lo guardado" },
        { value: "curiosity", label: "Curiosidad, quiero probar" },
      ],
    },
    secondaryField: {
      key: "exerciseFrequency",
      label: "¿Cuánto te mueves?",
      options: [
        { value: "sedentary", label: "Sedentario (casi nada)" },
        { value: "light", label: "Ligero (1 – 2 veces por semana)" },
        { value: "moderate", label: "Moderado (3 – 4 veces por semana)" },
        { value: "intense", label: "Intenso (5 + veces, atleta amateur)" },
      ],
    },
  },

  // Final CTA
  finalCtaTitle: "Tu fuerza ya no es lo que aguantas.",
  finalCtaSubtitle: "Es lo que puedes sostener respirando.",
  finalCtaButton: "Quiero mi sesión",

  // Inclusivity note
  inclusivityNote:
    "AMARTE es para todes. Esta página usa lenguaje específico para hablar más cerca con hombres y personas que se identifican como masculinas, pero todas las personas son bienvenidas en cualquier sesión, sin importar identidad de género.",
};
