// YouthPage — Landing dedicada AMARTE Jóvenes (ruta /jovenes)
// Target dual: padres (B2C) + colegios (B2B).
// Niños y adolescentes 9-17 años. Pauta digital + entrada a ASECCBI / FIDAL.

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Heart,
  Brain,
  Shield,
  GraduationCap,
  Home,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Phone,
  School,
  BookOpen,
  Award,
  TrendingUp,
  Activity,
  Plus,
  Minus,
} from "lucide-react";
import { submitYouthInquiry, isValidEmail } from "../lib/supabase";
import { trackLeadFormSubmit, trackPageView } from "../lib/tracking";
import { COUNTRIES, DEFAULT_COUNTRY, type Country } from "../data/countries";

// ============================================
// CONTENIDO
// ============================================

const REALITY_STATS = [
  {
    value: "1ª",
    label: "causa de muerte en niños 10-14 años en Ecuador es el suicidio",
    source: "INEC · Defunciones 2023",
  },
  {
    value: "1.949",
    label: "menores presentaron ideación o intento de suicidio en 2023",
    source: "Ministerio de Salud Pública · 2024",
  },
  {
    value: "6 de 10",
    label: "estudiantes ecuatorianos han sido víctimas de bullying",
    source: "UNICEF + Ministerio de Educación",
  },
  {
    value: "7h22min",
    label: "diarios frente a pantallas en adolescentes",
    source: "XNSPY · 2025",
  },
];

const BENEFITS = [
  {
    icon: Heart,
    title: "Reduce ansiedad y estrés",
    body: "Estudios demuestran reducción significativa de ansiedad con respiración diafragmática y coherente.",
    source: "Vlemincx et al., 2021 (p<0.001) · Telles et al., 2019",
  },
  {
    icon: Brain,
    title: "Mejora concentración y memoria",
    body: "Tras solo 18 minutos de respiración guiada, mejora la atención con efecto medio (Cohen's d 0.46-0.50).",
    source: "Telles et al., Yoga Therapy 2019",
  },
  {
    icon: Shield,
    title: "Regula impulsividad y agresividad",
    body: "Adolescentes en programas estructurados reducen agresión verbal -24% e impulsividad -19%.",
    source: "Franco et al., Frontiers in Psychology 2016",
  },
  {
    icon: Users,
    title: "Reduce comportamiento de bullying",
    body: "Programas de respiración + mindfulness en escuelas reducen significativamente conducta bullying.",
    source: "Liu, Xiao & Tang, 2022 · efecto 0.89",
  },
  {
    icon: TrendingUp,
    title: "Mejora rendimiento académico",
    body: "Programas SEL muestran ganancia de 11 puntos percentiles en notas escolares.",
    source: "Durlak et al., 270.034 estudiantes",
  },
  {
    icon: Activity,
    title: "Mejor sueño y autorregulación",
    body: "La exhalación prolongada activa el sistema parasimpático, mejorando latencia de sueño en adolescentes.",
    source: "Sleep Foundation + ensayos NIH",
  },
];

const SESSIONS_BY_AGE = [
  {
    range: "9-12 años",
    badge: "Infantes / Tweens",
    duration: "20-30 min",
    color: "lavender",
    metaphor: "Soplar la vela. Oler la flor. La abeja que zumba.",
    techniques: [
      "Respiración del oso (diafragmática lúdica)",
      "Bhramari / Bumblebee (zumbido vibracional)",
      "Box breathing con cuento guiado",
    ],
    focus: "Pensamiento concreto, alta imaginación, necesidad de movimiento. Bloques de 3-5 min con juego, sonidos y visualización.",
  },
  {
    range: "13-15 años",
    badge: "Adolescencia media",
    duration: "30-45 min",
    color: "coral",
    metaphor: "Identidad emergente. Picos de ansiedad escolar.",
    techniques: [
      "Coherent breathing 5.5 rpm (HRV óptimo)",
      "4-7-8 (Andrew Weil) para ansiedad",
      "Box breathing extendido pre-examen",
    ],
    focus: "Sensibilidad social alta. Psicoeducación breve (nervio vago, cortisol) + técnica + cierre integrador.",
  },
  {
    range: "16-18 años",
    badge: "Adolescencia tardía",
    duration: "45-60 min",
    color: "emerald",
    metaphor: "Presión académica y vocacional. Capacidad casi adulta de introspección.",
    techniques: [
      "Respiración alternada (Nadi Shodhana suave)",
      "Coherent breathing extendida",
      "Protocolo somático adaptado",
    ],
    focus: "Más cercano a formato adulto pero SIN hiperventilación intensa, SIN retenciones largas, SIN coaching subliminal.",
  },
];

const SCHOOL_TIERS = [
  {
    tier: "Piloto",
    price: "USD 650",
    description: "Workshop de 1 día con un grado (~30 alumnos) + reporte de impacto",
    features: [
      "Sesión de 90 min adaptada por edad",
      "Pre-test y post-test breve",
      "Reporte cualitativo de resultados",
      "Recomendaciones para continuar",
    ],
    recommended: false,
  },
  {
    tier: "Semestral",
    price: "USD 5.800",
    description: "12 sesiones para 2-4 grados (50-150 alumnos) + 2 talleres para padres",
    features: [
      "Curriculum adaptado a 1 semestre escolar",
      "Sesiones quincenales en aula",
      "2 talleres complementarios para familias",
      "Medición con escala RCADS en español",
      "Reporte final por estudiante anónimo",
    ],
    recommended: true,
  },
  {
    tier: "Curriculum Anual",
    price: "USD 18.500",
    description: "Programa completo + capacitación para 8 docentes/DECE + materiales + sesión mensual con maestros",
    features: [
      "Integración curricular alineada a SEL del MinEduc",
      "Capacitación AMARTE Kids a 8 docentes/DECE",
      "Materiales didácticos físicos y digitales",
      "Sesión mensual de seguimiento con maestros",
      "4 talleres para padres durante el año",
      "Reporte anual de impacto institucional",
    ],
    recommended: false,
  },
];

const FAMILY_TIERS = [
  {
    tier: "Esencial",
    price: "USD 35",
    perChild: " por niño",
    description: "Workshop único de 1.5h en grupo pequeño (8-12 niños)",
    features: [
      "Una experiencia introductoria",
      "Manual de técnicas en casa para padres",
      "Edades agrupadas (9-12 / 13-15 / 16-18)",
    ],
    recommended: false,
  },
  {
    tier: "Programa 6 Semanas",
    price: "USD 180",
    perChild: " por niño",
    description: "1 sesión por semana de 75 min · 6 semanas consecutivas",
    features: [
      "Curriculum progresivo por edad",
      "Manual ampliado de práctica en casa",
      "Grupo de WhatsApp con familias",
      "Sesión final con padres",
    ],
    recommended: true,
  },
  {
    tier: "Premium Familiar",
    price: "USD 320",
    perChild: " por familia",
    description: "Programa de 8 semanas + 2 sesiones familiares (padres + hijos juntos)",
    features: [
      "Programa Kids de 8 semanas",
      "2 sesiones AMARTE en Familia",
      "Manual para padres",
      "Llamada de seguimiento mensual",
      "Acceso a biblioteca grabada AMARTE Kids",
    ],
    recommended: false,
  },
];

const SAFETY_YES = [
  "Respiración diafragmática y exhalación prolongada (lo más seguro y demostrado)",
  "Box breathing 4-4-4-4 sin riesgo de hipoxia",
  "Coherent breathing a 5.5 respiraciones por minuto",
  "Bhramari / zumbido para los más pequeños — calma autonómica natural",
  "Sesiones de 20-60 min según edad (nunca 90 min como en adultos)",
  "Adulto del colegio o tutor SIEMPRE presente",
  "Asentimiento del menor + consentimiento parental obligatorio",
  "Pantalla de screening médica antes de cualquier sesión",
];

const SAFETY_NO = [
  "Hiperventilación intensa estilo Wim Hof (puede causar síncope o convulsión)",
  "Respiración holotrópica (Grof) — contraindicada en menores",
  "Kapalabhati / Breath of Fire (riesgo neumotórax, no apto para vías respiratorias en desarrollo)",
  "Retenciones de aire prolongadas (>30 segundos)",
  "Antifaces obligatorios — pueden gatillar ansiedad o trauma",
  "Coaching subliminal hipnótico (controvertido éticamente con menores)",
  "Sesiones de 90 min — la atención infantil no se sostiene tanto",
  "Promesas de cura. No somos terapia psiquiátrica — somos herramienta complementaria.",
];

const CONTRAINDICATIONS = [
  "Epilepsia o historial convulsivo",
  "Asma severa (permitir uso de inhalador)",
  "Trauma reciente o PTSD activo (solo con derivación profesional)",
  "Trastornos psicóticos o disociativos",
  "Cardiopatías congénitas o arritmias",
  "Embarazo adolescente",
  "Cirugía abdominal o torácica reciente (<6 meses)",
  "Glaucoma o desprendimiento de retina",
  "Diabetes tipo 1 descompensada",
  "Hipertensión secundaria no controlada",
];

const METHODOLOGY_VS = [
  {
    category: "AMARTE Jóvenes",
    duration: "20-60 min según edad",
    risk: "Bajo (técnicas validadas pediátricamente)",
    audience: "Niños y adolescentes 9-17",
    evidence: "RCADS + STAI-C + Cohen's d 0.46-0.89",
    isOurs: true,
  },
  {
    category: "Wim Hof Method",
    duration: "30-45 min",
    risk: "Alto (excluye <14 años por hiperventilación)",
    audience: "Adultos sanos",
    evidence: "PLOS One 2024 — excluye menores",
    isOurs: false,
  },
  {
    category: "Holotropic (Grof)",
    duration: "2-3 horas",
    risk: "Alto (contraindicado en adolescentes)",
    audience: "Adultos en marco terapéutico",
    evidence: "Cleveland Clinic desaconseja en jóvenes",
    isOurs: false,
  },
  {
    category: "9D Breathwork adulto",
    duration: "90 min",
    risk: "Medio-alto (hiperventilación + antifaces)",
    audience: "Adultos · 9D Kids subdesarrollado",
    evidence: "Sin track pediátrico formal documentado",
    isOurs: false,
  },
  {
    category: "Mindfulness genérico",
    duration: "5-15 min/día",
    risk: "Muy bajo",
    audience: "Niños y adultos",
    evidence: "MYRIAD Oxford: no mejora universal",
    isOurs: false,
  },
];

const SCHOOL_PROCESS = [
  {
    n: "01",
    title: "Conversemos",
    body: "Llamada de 30 min con tu DECE, rectoría o psicología escolar. Sin compromiso. Entendemos el contexto del colegio.",
    icon: Phone,
  },
  {
    n: "02",
    title: "Propuesta personalizada",
    body: "Diseñamos formato adaptado a tu institución: grado, número de alumnos, calendario académico, presupuesto.",
    icon: BookOpen,
  },
  {
    n: "03",
    title: "Piloto opcional",
    body: "Workshop de 1 día con un grado para validar el ajuste cultural antes de comprometerse a programa mayor.",
    icon: Sparkles,
  },
  {
    n: "04",
    title: "Implementación",
    body: "Llevamos AMARTE al aula. Facilitador certificado + adulto del colegio presente. Materiales incluidos.",
    icon: GraduationCap,
  },
  {
    n: "05",
    title: "Reporte de impacto",
    body: "Medición pre y post con escalas validadas (RCADS). Reporte cualitativo + cuantitativo + recomendaciones.",
    icon: Award,
  },
];

const FAQS_PARENTS = [
  {
    q: "¿Mi hijo tiene la edad correcta?",
    a: "Trabajamos con niños desde 9 años. Antes de esa edad el sistema nervioso y la metacognición no están listos para instrucciones interoceptivas. Si tu hijo tiene menos de 9, te recomendamos esperar o probar yoga infantil suave.",
  },
  {
    q: "¿Esto es como meditación?",
    a: "No. Mindfulness y meditación trabajan principalmente con atención. Breathwork trabaja con el sistema nervioso autónomo a través de patrones específicos de respiración. Es fisiológico, medible, y no requiere quedarse quieto en silencio largos periodos.",
  },
  {
    q: "¿Es seguro? ¿Mi hijo se va a sentir extraño?",
    a: "Las técnicas que usamos están validadas pediátricamente y no incluyen hiperventilación intensa, retenciones largas ni estados alterados de consciencia. Los niños suelen sentirse más calmados y relajados al terminar — no 'raros' ni 'volados'.",
  },
  {
    q: "¿Necesito estar presente?",
    a: "Para niños 9-12 recomendamos presencia parental al menos en las primeras sesiones. Para adolescentes 13+ es opcional. Siempre hay un adulto responsable del colegio o de AMARTE presente.",
  },
  {
    q: "¿Y si mi hijo tiene ansiedad o ya está en terapia?",
    a: "Breathwork es COMPLEMENTARIO a terapia psicológica/psiquiátrica, no la reemplaza. Si tu hijo tiene un diagnóstico activo, te pediremos consentimiento de su terapeuta antes de empezar.",
  },
  {
    q: "¿Y mi hijo neurodivergente / TDAH / espectro autista?",
    a: "Adaptamos. Hay evidencia que respiración consciente ayuda con autorregulación en TDAH y autismo. Te pediremos detalles para diseñar la mejor sesión y ratio facilitador-niño.",
  },
];

const FAQS_SCHOOLS = [
  {
    q: "¿Esto es religioso, espiritual o 'new age'?",
    a: "No. Nuestro programa es 100% secular, basado en neurociencia y fisiología del sistema nervioso autónomo. Sin posturas de yoga, sin 'namasté', sin mantras. Lenguaje compatible con cualquier orientación religiosa o cultural del colegio.",
  },
  {
    q: "¿Cómo se alinea con el currículo del Ministerio de Educación?",
    a: "AMARTE Jóvenes se integra como herramienta concreta de Educación Socioemocional (DECE obligatorio desde 2016) y alinea con el marco CASEL — específicamente con la competencia de Autogestión. Te entregamos documento de alineación curricular.",
  },
  {
    q: "¿Hay tiempo en el horario para esto?",
    a: "Inner Explorer demuestra que 5-10 minutos al inicio de clase recuperan tiempo lectivo al reducir disrupciones en 60%. No necesitas crear materia nueva — se integra en momentos clave del día.",
  },
  {
    q: "¿Qué evidencia tienen?",
    a: "Más de 10 años de papers en revistas como Frontiers in Psychology, International Journal of Yoga Therapy, Developmental Psychology. Citamos: Durlak 2011 (270K estudiantes), Schonert-Reichl 2015 (MindUP RCT), Franco 2016, Telles 2019, Vlemincx 2021, MYRIAD Oxford 2022.",
  },
  {
    q: "¿Cómo medimos resultados?",
    a: "Usamos escala validada RCADS (Revised Child Anxiety and Depression Scale) en español + STAI-C antes y después del programa. Entregamos reporte cuantitativo + cualitativo al final.",
  },
  {
    q: "¿Pueden capacitar a nuestros docentes?",
    a: "Sí. El tier Curriculum Anual incluye capacitación AMARTE Kids para 8 docentes y/o el equipo DECE — esto crea sostenibilidad y permite continuidad año tras año sin depender 100% de nosotros.",
  },
];

const CHILD_CONCERNS = [
  { value: "ansiedad", label: "Ansiedad o nerviosismo" },
  { value: "sueño", label: "Problemas para dormir" },
  { value: "bullying", label: "Acoso escolar / problemas sociales" },
  { value: "pantallas", label: "Demasiado tiempo en pantallas" },
  { value: "academico", label: "Estrés académico / concentración" },
  { value: "emociones", label: "Dificultad para regular emociones" },
  { value: "duelo", label: "Duelo o cambio familiar" },
  { value: "otro", label: "Otro / Conversémoslo" },
];

const INSTITUTION_TYPES = [
  { value: "privado", label: "Privado" },
  { value: "fiscomisional", label: "Fiscomisional" },
  { value: "fiscal", label: "Fiscal / público" },
  { value: "bi", label: "Bachillerato Internacional (BI)" },
  { value: "otro", label: "Otro" },
];

const SCHOOL_FORMATS = [
  { value: "piloto", label: "Piloto · Workshop 1 día" },
  { value: "semestral", label: "Programa Semestral" },
  { value: "anual", label: "Curriculum Integral Anual" },
  { value: "capacitacion", label: "Solo capacitación a docentes" },
  { value: "indefinido", label: "Aún no estoy seguro" },
];

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export function YouthPage() {
  useEffect(() => {
    document.title = "AMARTE Jóvenes · Breathwork para niños y colegios en Ecuador";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Breathwork adaptado para niños y adolescentes 9-17 años en Ecuador. Programas para familias y colegios. Regulación emocional con base neurocientífica, alineado al currículo SEL del Ministerio de Educación."
      );
    }
    trackPageView();
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-ink text-bone antialiased">
      <YouthHero />
      <YouthRealityStats />
      <YouthWhatIs />
      <YouthBenefits />
      <YouthSessionByAge />
      <YouthForSchools />
      <YouthForFamilies />
      <YouthSafety />
      <YouthMethodologyVs />
      <YouthSchoolProcess />
      <YouthCertification />
      <YouthVoices />
      <YouthFAQ />
      <YouthForm />
      <YouthFinalCTA />
    </main>
  );
}

// ============================================
// 1. HERO unificado emocional
// ============================================

function YouthHero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink pb-20 pt-28 sm:pt-32 lg:pb-28">
      <div className="pointer-events-none absolute inset-0 bg-radial-lavender opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-radial-coral opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />

      <div className="container-x relative">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-lavender-soft/40 bg-lavender-deep/20 px-4 py-1.5 text-[10px] uppercase tracking-eyebrow text-lavender-soft"
            >
              <Sparkles className="size-3" /> AMARTE Jóvenes · 9 a 17 años
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="h-display mt-5 text-[2.6rem] leading-[0.95] sm:text-6xl lg:text-7xl text-balance"
            >
              Tu hijo tiene herramientas
              <br />
              <span className="bg-gradient-to-r from-lavender-soft via-coral-warm to-gold-warm bg-clip-text text-transparent">
                que tú no tuviste a su edad.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 max-w-2xl text-lg text-bone/80 sm:text-xl"
            >
              Regulación emocional con base neurocientífica para niños y adolescentes 9-17 años.
              Para tu casa. Para tu colegio. <strong className="text-bone">Sin promesas mágicas — con evidencia real.</strong>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <a
                href="#contacto"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-coral-warm px-8 text-base font-medium text-ink-900 shadow-glow-gold transition-all hover:bg-coral-soft hover:shadow-glow-emerald-strong"
              >
                Conoce el programa
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#colegios"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-emerald-brand/40 bg-emerald-deep/20 px-8 text-base font-medium text-emerald-glow transition-all hover:bg-emerald-deep/40"
              >
                <School className="size-4" />
                Llevar a mi colegio
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-bone/60"
            >
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3 text-emerald-glow" /> Basado en evidencia científica
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3 text-emerald-glow" /> Alineado al currículo del Ministerio
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3 text-emerald-glow" /> Protocolos adaptados por edad
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-lavender-soft/20 bg-gradient-to-br from-lavender-deep/30 via-ink-800 to-coral-warm/10 p-8 shadow-glow-emerald">
              <div className="absolute inset-0 bg-noise opacity-40 mix-blend-overlay" />
              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-bone/10 px-3 py-1 text-[10px] uppercase tracking-eyebrow text-bone/70">
                    <Activity className="size-3" /> Lo que la ciencia muestra
                  </div>
                  <p className="mt-6 text-3xl font-light leading-tight text-bone sm:text-4xl">
                    "Después de 10 sesiones, los adolescentes redujeron su agresividad verbal en
                    <span className="text-coral-warm"> -24%</span> y su impulsividad en <span className="text-lavender-soft">-19%</span>."
                  </p>
                </div>
                <div className="mt-8 border-t border-bone/10 pt-4 text-xs text-bone/60">
                  Franco et al., Frontiers in Psychology 2016 · n=27 adolescentes 12-19 años
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// 2. REALITY STATS — Lo que el sistema no te está contando
// ============================================

function YouthRealityStats() {
  return (
    <section className="relative bg-ink-900 py-20 sm:py-28">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-bone/20 bg-bone/5 px-4 py-1.5 text-[10px] uppercase tracking-eyebrow text-bone/70">
            <AlertTriangle className="size-3" /> La realidad de Ecuador
          </span>
          <h2 className="h-display mt-5 text-4xl leading-tight sm:text-5xl text-balance">
            Lo que el sistema no te está contando.
          </h2>
          <p className="mt-4 text-lg text-bone/70">
            Datos públicos. Fuentes oficiales. Sin sensacionalismo.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REALITY_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-2xl border border-bone/10 bg-ink/50 p-6 backdrop-blur"
            >
              <div className="text-4xl font-light text-coral-warm sm:text-5xl">{stat.value}</div>
              <p className="mt-3 text-sm text-bone/85 leading-snug">{stat.label}</p>
              <p className="mt-3 text-[10px] uppercase tracking-eyebrow text-bone/40">{stat.source}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto mt-14 max-w-3xl rounded-3xl border border-lavender-soft/30 bg-gradient-to-br from-lavender-deep/20 via-ink to-coral-warm/10 p-8 sm:p-10"
        >
          <p className="text-center text-xl text-bone sm:text-2xl">
            Pero hay <span className="text-lavender-soft">algo que sí funciona</span> —
            <br />
            y la ciencia lo demostró.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// 3. WHAT IS — No es meditación
// ============================================

function YouthWhatIs() {
  return (
    <section className="relative bg-ink py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-radial-emerald opacity-30" />
      <div className="container-x relative">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-brand/30 bg-emerald-deep/20 px-4 py-1.5 text-[10px] uppercase tracking-eyebrow text-emerald-glow">
              <Brain className="size-3" /> Qué es realmente
            </span>
            <h2 className="h-display mt-5 text-4xl leading-tight sm:text-5xl text-balance">
              No es meditación.
              <br />
              <span className="bg-gradient-to-r from-emerald-glow to-lavender-soft bg-clip-text text-transparent">
                Es la fisiología de la calma.
              </span>
            </h2>
            <p className="mt-6 text-lg text-bone/80 leading-relaxed">
              AMARTE Jóvenes enseña a niños y adolescentes a usar su respiración como
              <strong className="text-bone"> herramienta concreta</strong> para regular su sistema nervioso autónomo —
              el sistema que controla la ansiedad, el sueño, la concentración y las emociones.
            </p>
            <p className="mt-4 text-base text-bone/70">
              Sin posturas de yoga. Sin mantras. Sin pedirles que "vacíen la mente". Solo respirar
              de formas específicas que la neurociencia ya validó como efectivas.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-brand/30 bg-emerald-deep/15 p-6">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-eyebrow text-emerald-glow">
                  <CheckCircle2 className="size-4" /> Lo que SÍ es
                </div>
                <ul className="mt-4 space-y-2.5 text-sm text-bone/85">
                  <li>· Breathwork adaptado pediátricamente</li>
                  <li>· Regulación del sistema nervioso autónomo</li>
                  <li>· Herramienta de autogestión SEL</li>
                  <li>· Basado en neurociencia y fisiología</li>
                  <li>· Validado con escalas clínicas (RCADS, STAI-C)</li>
                  <li>· Compatible con cualquier creencia religiosa</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-coral-warm/30 bg-coral-warm/5 p-6">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-eyebrow text-coral-warm">
                  <XCircle className="size-4" /> Lo que NO es
                </div>
                <ul className="mt-4 space-y-2.5 text-sm text-bone/85">
                  <li>· Meditación new-age o espiritualidad</li>
                  <li>· Yoga ni posturas físicas</li>
                  <li>· Hiperventilación estilo Wim Hof</li>
                  <li>· Terapia psicológica o psiquiátrica</li>
                  <li>· Cura mágica para todos los problemas</li>
                  <li>· Coaching subliminal o hipnosis</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// 4. BENEFITS — Respaldado por la ciencia
// ============================================

function YouthBenefits() {
  return (
    <section className="bg-ink-900 py-20 sm:py-28">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-warm/30 bg-gold-warm/10 px-4 py-1.5 text-[10px] uppercase tracking-eyebrow text-gold-warm">
            <Award className="size-3" /> Beneficios documentados
          </span>
          <h2 className="h-display mt-5 text-4xl leading-tight sm:text-5xl">
            Respaldado por la ciencia,
            <br />
            <span className="text-gold-warm">no por la moda.</span>
          </h2>
          <p className="mt-4 text-lg text-bone/70">
            Cada beneficio cita un estudio real, no un titular de Instagram.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-2xl border border-bone/10 bg-ink/40 p-6 transition-colors hover:border-lavender-soft/30"
            >
              <b.icon className="size-7 text-lavender-soft" />
              <h3 className="mt-4 text-lg font-medium text-bone">{b.title}</h3>
              <p className="mt-2 text-sm text-bone/70 leading-relaxed">{b.body}</p>
              <p className="mt-4 border-t border-bone/10 pt-3 text-[11px] text-bone/40 italic">
                {b.source}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 5. SESSION BY AGE — Cada edad respira diferente
// ============================================

function YouthSessionByAge() {
  return (
    <section className="relative bg-ink py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-radial-lavender opacity-30" />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-lavender-soft/30 bg-lavender-deep/20 px-4 py-1.5 text-[10px] uppercase tracking-eyebrow text-lavender-soft">
            <Clock className="size-3" /> Protocolos por edad
          </span>
          <h2 className="h-display mt-5 text-4xl leading-tight sm:text-5xl text-balance">
            Cada edad respira diferente.
          </h2>
          <p className="mt-4 text-lg text-bone/70">
            No es el mismo programa para un niño de 10 que para un adolescente de 17.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {SESSIONS_BY_AGE.map((s, i) => {
            const colorMap: Record<string, { border: string; bg: string; text: string }> = {
              lavender: {
                border: "border-lavender-soft/40",
                bg: "bg-lavender-deep/15",
                text: "text-lavender-soft",
              },
              coral: {
                border: "border-coral-warm/40",
                bg: "bg-coral-warm/5",
                text: "text-coral-warm",
              },
              emerald: {
                border: "border-emerald-brand/40",
                bg: "bg-emerald-deep/20",
                text: "text-emerald-glow",
              },
            };
            const c = colorMap[s.color];
            return (
              <motion.div
                key={s.range}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`rounded-3xl border ${c.border} ${c.bg} p-7 backdrop-blur`}
              >
                <div className={`text-xs uppercase tracking-eyebrow ${c.text}`}>{s.badge}</div>
                <h3 className="mt-2 text-3xl font-light text-bone">{s.range}</h3>
                <div className="mt-3 inline-flex items-center gap-2 text-sm text-bone/60">
                  <Clock className="size-3.5" /> {s.duration}
                </div>
                <p className="mt-5 text-sm italic text-bone/75 leading-relaxed">
                  "{s.metaphor}"
                </p>
                <ul className="mt-5 space-y-2 text-sm text-bone/85">
                  {s.techniques.map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <CheckCircle2 className={`mt-0.5 size-4 ${c.text} shrink-0`} />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-bone/10 pt-4 text-xs text-bone/60 leading-relaxed">
                  {s.focus}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 6. FOR SCHOOLS (B2B)
// ============================================

function YouthForSchools() {
  return (
    <section id="colegios" className="relative bg-ink-900 py-20 sm:py-28">
      <div className="container-x">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-brand/30 bg-emerald-deep/20 px-4 py-1.5 text-[10px] uppercase tracking-eyebrow text-emerald-glow">
              <School className="size-3" /> Para colegios
            </span>
            <h2 className="h-display mt-5 text-4xl leading-tight sm:text-5xl text-balance">
              Lleva regulación emocional
              <br />
              <span className="text-emerald-glow">a tu aula.</span>
            </h2>
            <p className="mt-6 text-lg text-bone/80 leading-relaxed">
              AMARTE Jóvenes se alinea directamente con la <strong className="text-bone">Educación Socioemocional</strong> que
              el Ministerio de Educación incluye en el currículo priorizado, y con el marco
              internacional <strong className="text-bone">CASEL</strong> que tu colegio BI ya conoce.
            </p>
            <div className="mt-8 space-y-3 text-sm text-bone/75">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 text-emerald-glow shrink-0" />
                <span>Compatible con DECE obligatorio (desde 2016)</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 text-emerald-glow shrink-0" />
                <span>Alineado a 5 competencias CASEL — especialmente Autogestión</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 text-emerald-glow shrink-0" />
                <span>Califica para componente CAS de Bachillerato Internacional</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 text-emerald-glow shrink-0" />
                <span>Medición con escalas clínicas validadas (RCADS, STAI-C en español)</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 text-emerald-glow shrink-0" />
                <span>100% secular — compatible con cualquier orientación del colegio</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4">
              {SCHOOL_TIERS.map((t, i) => (
                <motion.div
                  key={t.tier}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`rounded-2xl border p-6 transition-all ${
                    t.recommended
                      ? "border-emerald-brand/50 bg-emerald-deep/15 shadow-glow-emerald"
                      : "border-bone/10 bg-ink/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-medium text-bone">{t.tier}</h3>
                        {t.recommended && (
                          <span className="rounded-full bg-emerald-brand/20 px-2.5 py-0.5 text-[10px] uppercase tracking-eyebrow text-emerald-glow">
                            Recomendado
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-bone/70">{t.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-light text-bone">{t.price}</div>
                    </div>
                  </div>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-bone/80">
                        <CheckCircle2 className="mt-0.5 size-4 text-emerald-glow shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
              <p className="mt-2 text-center text-xs text-bone/50">
                Precios referenciales. Cotización personalizada en 24h tras tu solicitud.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// 7. FOR FAMILIES (B2C)
// ============================================

function YouthForFamilies() {
  return (
    <section className="relative bg-ink py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-radial-coral opacity-30" />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-coral-warm/40 bg-coral-warm/10 px-4 py-1.5 text-[10px] uppercase tracking-eyebrow text-coral-warm">
            <Home className="size-3" /> Para familias
          </span>
          <h2 className="h-display mt-5 text-4xl leading-tight sm:text-5xl text-balance">
            Para tu casa, tu rutina,
            <br />
            <span className="text-coral-warm">tu vínculo.</span>
          </h2>
          <p className="mt-4 text-lg text-bone/70">
            Empieza con una sesión. Crece con un programa. Sostén con la familia entera.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {FAMILY_TIERS.map((t, i) => (
            <motion.div
              key={t.tier}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl border p-6 ${
                t.recommended
                  ? "border-coral-warm/50 bg-gradient-to-br from-coral-warm/10 via-ink-800 to-lavender-deep/15 shadow-glow-gold"
                  : "border-bone/10 bg-ink/40"
              }`}
            >
              {t.recommended && (
                <div className="absolute -top-3 left-6 rounded-full bg-coral-warm px-3 py-1 text-[10px] uppercase tracking-eyebrow text-ink-900">
                  Más elegido
                </div>
              )}
              <h3 className="text-xl font-medium text-bone">{t.tier}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-light text-bone">{t.price}</span>
                <span className="text-xs text-bone/60">{t.perChild}</span>
              </div>
              <p className="mt-3 text-sm text-bone/70">{t.description}</p>
              <ul className="mt-5 space-y-2 text-sm text-bone/85">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 text-coral-warm shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contacto"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-coral-warm/40 bg-coral-warm/10 px-5 py-3 text-sm text-coral-warm transition-colors hover:bg-coral-warm/20"
              >
                Reservar lugar
                <ArrowRight className="size-3.5" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 8. SAFETY — Qué SÍ / Qué NO
// ============================================

function YouthSafety() {
  return (
    <section className="bg-ink-900 py-20 sm:py-28">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-brand/30 bg-emerald-deep/20 px-4 py-1.5 text-[10px] uppercase tracking-eyebrow text-emerald-glow">
            <Shield className="size-3" /> Seguridad ante todo
          </span>
          <h2 className="h-display mt-5 text-4xl leading-tight sm:text-5xl text-balance">
            Lo que <span className="text-emerald-glow">SÍ</span> hacemos.
            <br />
            Lo que <span className="text-coral-warm">NO</span> hacemos.
          </h2>
          <p className="mt-4 text-lg text-bone/70">
            Transparencia total para que decidas con tranquilidad.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-emerald-brand/30 bg-emerald-deep/10 p-7"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-6 text-emerald-glow" />
              <h3 className="text-2xl font-medium text-bone">Lo que SÍ hacemos</h3>
            </div>
            <ul className="mt-5 space-y-3">
              {SAFETY_YES.map((s) => (
                <li key={s} className="flex items-start gap-3 text-sm text-bone/85 leading-relaxed">
                  <CheckCircle2 className="mt-0.5 size-4 text-emerald-glow shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-coral-warm/30 bg-coral-warm/5 p-7"
          >
            <div className="flex items-center gap-3">
              <XCircle className="size-6 text-coral-warm" />
              <h3 className="text-2xl font-medium text-bone">Lo que NO hacemos</h3>
            </div>
            <ul className="mt-5 space-y-3">
              {SAFETY_NO.map((s) => (
                <li key={s} className="flex items-start gap-3 text-sm text-bone/85 leading-relaxed">
                  <XCircle className="mt-0.5 size-4 text-coral-warm shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-10 max-w-4xl rounded-2xl border border-bone/15 bg-ink/40 p-7"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 text-gold-warm" />
            <h3 className="text-lg font-medium text-bone">Contraindicaciones — consultar antes</h3>
          </div>
          <p className="mt-3 text-sm text-bone/70">
            Si tu hijo tiene alguna de estas condiciones, hablemos antes de empezar para diseñar
            una sesión adecuada o derivarte con un profesional especializado.
          </p>
          <ul className="mt-5 grid gap-x-6 gap-y-2 text-sm text-bone/80 sm:grid-cols-2">
            {CONTRAINDICATIONS.map((c) => (
              <li key={c} className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 rounded-full bg-gold-warm shrink-0" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// 9. METHODOLOGY VS
// ============================================

function YouthMethodologyVs() {
  return (
    <section className="bg-ink py-20 sm:py-28">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-warm/30 bg-gold-warm/10 px-4 py-1.5 text-[10px] uppercase tracking-eyebrow text-gold-warm">
            <Activity className="size-3" /> Comparativa
          </span>
          <h2 className="h-display mt-5 text-4xl leading-tight sm:text-5xl text-balance">
            En qué nos diferenciamos.
          </h2>
          <p className="mt-4 text-lg text-bone/70">
            No todo lo que se llama "breathwork" es apto para menores.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-bone/10 bg-ink-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-bone/10 bg-ink/40 text-left">
                  <th className="px-5 py-4 text-xs uppercase tracking-eyebrow text-bone/60">Método</th>
                  <th className="px-5 py-4 text-xs uppercase tracking-eyebrow text-bone/60">Duración</th>
                  <th className="px-5 py-4 text-xs uppercase tracking-eyebrow text-bone/60">Riesgo</th>
                  <th className="px-5 py-4 text-xs uppercase tracking-eyebrow text-bone/60">Audiencia</th>
                  <th className="px-5 py-4 text-xs uppercase tracking-eyebrow text-bone/60">Evidencia</th>
                </tr>
              </thead>
              <tbody>
                {METHODOLOGY_VS.map((m) => (
                  <tr
                    key={m.category}
                    className={`border-b border-bone/5 last:border-0 ${
                      m.isOurs ? "bg-lavender-deep/10" : ""
                    }`}
                  >
                    <td className="px-5 py-4 font-medium text-bone">
                      {m.isOurs && <span className="mr-2 text-lavender-soft">★</span>}
                      {m.category}
                    </td>
                    <td className="px-5 py-4 text-bone/70">{m.duration}</td>
                    <td className="px-5 py-4 text-bone/70">{m.risk}</td>
                    <td className="px-5 py-4 text-bone/70">{m.audience}</td>
                    <td className="px-5 py-4 text-bone/70">{m.evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// 10. SCHOOL PROCESS
// ============================================

function YouthSchoolProcess() {
  return (
    <section className="bg-ink-900 py-20 sm:py-28">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-brand/30 bg-emerald-deep/20 px-4 py-1.5 text-[10px] uppercase tracking-eyebrow text-emerald-glow">
            <GraduationCap className="size-3" /> Proceso para colegios
          </span>
          <h2 className="h-display mt-5 text-4xl leading-tight sm:text-5xl text-balance">
            5 pasos para llevar AMARTE
            <br />
            a tu colegio.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {SCHOOL_PROCESS.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl border border-bone/10 bg-ink/40 p-5"
            >
              <div className="text-xs font-mono text-emerald-glow">{p.n}</div>
              <p.icon className="mt-3 size-6 text-bone/70" />
              <h3 className="mt-3 text-base font-medium text-bone">{p.title}</h3>
              <p className="mt-2 text-xs text-bone/65 leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 11. CERTIFICATION — Próximamente
// ============================================

function YouthCertification() {
  return (
    <section className="bg-ink py-20 sm:py-28">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-gold-warm/30 bg-gradient-to-br from-gold-warm/10 via-ink-800 to-lavender-deep/20 p-10 sm:p-14"
        >
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-warm/40 bg-gold-warm/15 px-4 py-1.5 text-[10px] uppercase tracking-eyebrow text-gold-warm">
              <Award className="size-3" /> Próximamente
            </span>
            <h2 className="h-display mt-5 text-3xl leading-tight sm:text-4xl text-balance">
              Forma a tu equipo en
              <br />
              <span className="bg-gradient-to-r from-gold-warm to-lavender-soft bg-clip-text text-transparent">
                AMARTE Kids Facilitator.
              </span>
            </h2>
            <p className="mt-5 max-w-2xl text-base text-bone/80 leading-relaxed">
              Pronto abriremos la <strong className="text-bone">primera certificación hispana</strong> de facilitador
              de breathwork pediátrico — diseñada para docentes, psicólogos escolares (DECE),
              terapeutas y facilitadores adultos que quieren especializarse en niños y
              adolescentes con protocolos seguros.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="text-sm text-bone/70">
                <div className="text-xs uppercase tracking-eyebrow text-gold-warm">Módulos</div>
                <div className="mt-1">Neurociencia del desarrollo, técnicas por edad, ética y consentimiento, manejo de crisis</div>
              </div>
              <div className="text-sm text-bone/70">
                <div className="text-xs uppercase tracking-eyebrow text-gold-warm">Formato</div>
                <div className="mt-1">Online + práctica presencial en Quito · 3 meses</div>
              </div>
              <div className="text-sm text-bone/70">
                <div className="text-xs uppercase tracking-eyebrow text-gold-warm">Acceso anticipado</div>
                <div className="mt-1">Avisos por WhatsApp + tarifa especial fundadores</div>
              </div>
            </div>
            <a
              href="#contacto"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold-warm/40 bg-gold-warm/15 px-6 py-3 text-sm text-gold-warm transition-colors hover:bg-gold-warm/25"
            >
              Quiero acceso anticipado
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// 12. VOICES (placeholder)
// ============================================

function YouthVoices() {
  return (
    <section className="bg-ink-900 py-20 sm:py-28">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-bone/20 bg-bone/5 px-4 py-1.5 text-[10px] uppercase tracking-eyebrow text-bone/70">
            <Heart className="size-3" /> Voces
          </span>
          <h2 className="h-display mt-5 text-4xl leading-tight sm:text-5xl text-balance">
            Voces de quienes ya
            <br />
            <span className="text-lavender-soft">respiran con nosotros.</span>
          </h2>
          <p className="mt-4 text-sm text-bone/55">
            Estamos en proceso de recoger testimonios reales del primer piloto escolar. Pronto los publicaremos aquí.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              from: "Padres",
              text: "Mi hija de 13 me pidió que la enseñara a respirar antes del examen. Algo cambió.",
              icon: Home,
            },
            {
              from: "Estudiantes",
              text: "Cuando me pongo nervioso me acuerdo de la caja y respiro así. Funciona.",
              icon: Sparkles,
            },
            {
              from: "DECE",
              text: "Por primera vez tenemos una herramienta concreta que los chicos quieren usar.",
              icon: GraduationCap,
            },
          ].map((v, i) => (
            <motion.div
              key={v.from}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-dashed border-bone/15 bg-ink/30 p-6"
            >
              <v.icon className="size-6 text-lavender-soft/60" />
              <p className="mt-4 text-base italic text-bone/70 leading-relaxed">"{v.text}"</p>
              <div className="mt-5 border-t border-bone/10 pt-3 text-xs uppercase tracking-eyebrow text-bone/40">
                {v.from} · próximamente con nombres reales
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 13. FAQ DUAL
// ============================================

function YouthFAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"parents" | "schools">("parents");

  const currentFaqs = activeTab === "parents" ? FAQS_PARENTS : FAQS_SCHOOLS;

  return (
    <section className="bg-ink py-20 sm:py-28">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="h-display text-4xl leading-tight sm:text-5xl text-balance">
            Preguntas que se hacen
            <br />
            los padres. Y los colegios.
          </h2>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="flex gap-2 rounded-full border border-bone/15 bg-ink-900 p-1">
            <button
              onClick={() => {
                setActiveTab("parents");
                setOpenIndex(null);
              }}
              className={`flex-1 rounded-full px-5 py-2.5 text-sm transition-colors ${
                activeTab === "parents"
                  ? "bg-coral-warm text-ink-900"
                  : "text-bone/70 hover:text-bone"
              }`}
            >
              <Home className="mr-2 inline size-3.5" />
              Para padres
            </button>
            <button
              onClick={() => {
                setActiveTab("schools");
                setOpenIndex(null);
              }}
              className={`flex-1 rounded-full px-5 py-2.5 text-sm transition-colors ${
                activeTab === "schools"
                  ? "bg-emerald-brand text-ink-900"
                  : "text-bone/70 hover:text-bone"
              }`}
            >
              <School className="mr-2 inline size-3.5" />
              Para colegios
            </button>
          </div>

          <div className="mt-8 space-y-3">
            {currentFaqs.map((faq, i) => {
              const id = `${activeTab}-${i}`;
              const isOpen = openIndex === id;
              return (
                <div
                  key={id}
                  className="overflow-hidden rounded-2xl border border-bone/10 bg-ink-900"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-ink/40"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-medium text-bone">{faq.q}</span>
                    {isOpen ? (
                      <Minus className="size-4 text-bone/60 shrink-0" />
                    ) : (
                      <Plus className="size-4 text-bone/60 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="border-t border-bone/10 px-5 py-4 text-sm text-bone/75 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// 14. FORM DUAL
// ============================================

function YouthForm() {
  const [inquiryType, setInquiryType] = useState<"parent" | "school" | null>(null);
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Common
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Parent
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentWhatsapp, setParentWhatsapp] = useState("");
  const [childAge, setChildAge] = useState<number | "">("");
  const [childCount, setChildCount] = useState<number>(1);
  const [childConcerns, setChildConcerns] = useState<string>("");

  // School
  const [institutionName, setInstitutionName] = useState("");
  const [institutionType, setInstitutionType] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [studentCountTotal, setStudentCountTotal] = useState<number | "">("");
  const [targetGrades, setTargetGrades] = useState("");
  const [formatInterest, setFormatInterest] = useState("");

  const validParent = useMemo(
    () =>
      parentName.trim().length >= 2 &&
      parentWhatsapp.trim().length >= 7 &&
      (parentEmail === "" || isValidEmail(parentEmail)),
    [parentName, parentWhatsapp, parentEmail]
  );

  const validSchool = useMemo(
    () =>
      institutionName.trim().length >= 2 &&
      contactName.trim().length >= 2 &&
      isValidEmail(contactEmail),
    [institutionName, contactName, contactEmail]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inquiryType) return;
    setError(null);
    setSubmitting(true);
    try {
      const payload =
        inquiryType === "parent"
          ? {
              inquiryType: "parent" as const,
              parentName,
              parentEmail: parentEmail || undefined,
              parentWhatsapp: country.code + parentWhatsapp.replace(/\D/g, ""),
              parentCountryCode: country.code,
              parentCountryName: country.name,
              childAge: typeof childAge === "number" ? childAge : undefined,
              childCount,
              childConcerns,
              city,
              message,
              honeypot,
            }
          : {
              inquiryType: "school" as const,
              institutionName,
              institutionType,
              contactRole,
              contactName,
              contactEmail,
              contactPhone,
              studentCountTotal: typeof studentCountTotal === "number" ? studentCountTotal : undefined,
              targetGrades,
              formatInterest,
              city,
              message,
              honeypot,
            };
      const res = await submitYouthInquiry(payload);
      if (!res.ok) {
        setError(res.error || "Error enviando, intenta de nuevo.");
        return;
      }
      trackLeadFormSubmit({
        source: inquiryType === "parent" ? "youth_parent_inquiry" : "youth_school_inquiry",
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section id="contacto" className="bg-ink-900 py-20 sm:py-28">
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl rounded-3xl border border-emerald-brand/30 bg-emerald-deep/20 p-10 text-center"
          >
            <CheckCircle2 className="mx-auto size-12 text-emerald-glow" />
            <h2 className="h-display mt-6 text-3xl">Gracias. Recibimos tu mensaje.</h2>
            <p className="mt-4 text-base text-bone/80">
              Te contactaremos en las próximas 24h por WhatsApp. Si es urgente, escríbenos directo
              al <a href="https://wa.me/593995656078" className="text-emerald-glow underline">+593 99 565 6078</a>.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contacto" className="bg-ink-900 py-20 sm:py-28">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="h-display text-4xl leading-tight sm:text-5xl text-balance">
            Conversemos.
          </h2>
          <p className="mt-4 text-lg text-bone/70">
            Cuéntanos quién eres y qué buscas. Te respondemos en 24h.
          </p>
        </div>

        {!inquiryType ? (
          <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
            <button
              onClick={() => setInquiryType("parent")}
              className="group rounded-3xl border border-coral-warm/30 bg-coral-warm/5 p-8 text-left transition-all hover:border-coral-warm/60 hover:bg-coral-warm/10"
            >
              <Home className="size-8 text-coral-warm" />
              <h3 className="mt-5 text-xl font-medium text-bone">Soy padre / madre</h3>
              <p className="mt-2 text-sm text-bone/70">
                Quiero información para mi hijo/a o nuestra familia.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm text-coral-warm">
                Empezar
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
            <button
              onClick={() => setInquiryType("school")}
              className="group rounded-3xl border border-emerald-brand/30 bg-emerald-deep/15 p-8 text-left transition-all hover:border-emerald-brand/60 hover:bg-emerald-deep/30"
            >
              <School className="size-8 text-emerald-glow" />
              <h3 className="mt-5 text-xl font-medium text-bone">Represento un colegio</h3>
              <p className="mt-2 text-sm text-bone/70">
                Quiero llevar AMARTE Jóvenes a mi institución educativa.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm text-emerald-glow">
                Empezar
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-12 max-w-2xl space-y-5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setInquiryType(null)}
                className="text-xs text-bone/60 underline hover:text-bone"
              >
                ← Cambiar tipo
              </button>
              <span className="text-xs uppercase tracking-eyebrow text-bone/50">
                {inquiryType === "parent" ? "Padre / madre" : "Colegio"}
              </span>
            </div>

            {/* Honeypot oculto */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="absolute -left-[9999px]"
              tabIndex={-1}
              autoComplete="off"
            />

            {inquiryType === "parent" ? (
              <>
                <Field label="Tu nombre">
                  <input
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    required
                    className="input"
                    placeholder="María González"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="WhatsApp">
                    <div className="flex">
                      <select
                        value={country.code}
                        onChange={(e) => {
                          const c = COUNTRIES.find((co) => co.code === e.target.value);
                          if (c) setCountry(c);
                        }}
                        className="rounded-l-xl border border-r-0 border-bone/15 bg-ink/60 px-3 text-sm text-bone"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} +{c.code}
                          </option>
                        ))}
                      </select>
                      <input
                        value={parentWhatsapp}
                        onChange={(e) => setParentWhatsapp(e.target.value)}
                        required
                        className="input rounded-l-none"
                        placeholder="99 565 6078"
                        type="tel"
                      />
                    </div>
                  </Field>
                  <Field label="Email (opcional)">
                    <input
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      className="input"
                      placeholder="tucorreo@ejemplo.com"
                      type="email"
                    />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Edad del niño/a (años)">
                    <input
                      value={childAge}
                      onChange={(e) =>
                        setChildAge(e.target.value === "" ? "" : parseInt(e.target.value, 10) || "")
                      }
                      className="input"
                      type="number"
                      min={6}
                      max={18}
                      placeholder="12"
                    />
                  </Field>
                  <Field label="¿Cuántos hijos?">
                    <input
                      value={childCount}
                      onChange={(e) => setChildCount(parseInt(e.target.value, 10) || 1)}
                      className="input"
                      type="number"
                      min={1}
                      max={6}
                    />
                  </Field>
                </div>
                <Field label="¿Qué te trae aquí? (opcional)">
                  <select
                    value={childConcerns}
                    onChange={(e) => setChildConcerns(e.target.value)}
                    className="input"
                  >
                    <option value="">Selecciona una opción</option>
                    {CHILD_CONCERNS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </>
            ) : (
              <>
                <Field label="Nombre de la institución">
                  <input
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    required
                    className="input"
                    placeholder="Colegio ..."
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Tipo de institución">
                    <select
                      value={institutionType}
                      onChange={(e) => setInstitutionType(e.target.value)}
                      className="input"
                      required
                    >
                      <option value="">Selecciona</option>
                      {INSTITUTION_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Cargo">
                    <input
                      value={contactRole}
                      onChange={(e) => setContactRole(e.target.value)}
                      className="input"
                      placeholder="Rector / DECE / Psicólogo"
                    />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Tu nombre">
                    <input
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                      className="input"
                      placeholder="Tu nombre"
                    />
                  </Field>
                  <Field label="Email institucional">
                    <input
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                      className="input"
                      type="email"
                      placeholder="tu@colegio.edu.ec"
                    />
                  </Field>
                </div>
                <Field label="Teléfono (opcional)">
                  <input
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="input"
                    type="tel"
                    placeholder="02 ... / 099 ..."
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Estudiantes en total">
                    <input
                      value={studentCountTotal}
                      onChange={(e) =>
                        setStudentCountTotal(
                          e.target.value === "" ? "" : parseInt(e.target.value, 10) || ""
                        )
                      }
                      className="input"
                      type="number"
                      min={1}
                      placeholder="500"
                    />
                  </Field>
                  <Field label="Grados objetivo">
                    <input
                      value={targetGrades}
                      onChange={(e) => setTargetGrades(e.target.value)}
                      className="input"
                      placeholder="8vo-10mo EGB"
                    />
                  </Field>
                </div>
                <Field label="Formato de interés">
                  <select
                    value={formatInterest}
                    onChange={(e) => setFormatInterest(e.target.value)}
                    className="input"
                  >
                    <option value="">Selecciona</option>
                    {SCHOOL_FORMATS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </>
            )}

            <Field label="Ciudad (opcional)">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input"
                placeholder="Quito, Guayaquil, Cuenca..."
              />
            </Field>

            <Field label="Algo más que quieras contarnos (opcional)">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input min-h-[100px] resize-y"
                placeholder="Contexto, fechas tentativas, dudas..."
              />
            </Field>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-coral-warm/30 bg-coral-warm/10 px-4 py-3 text-sm text-coral-warm"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={
                submitting || (inquiryType === "parent" ? !validParent : !validSchool)
              }
              className={`group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full px-8 text-base font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                inquiryType === "parent"
                  ? "bg-coral-warm text-ink-900 hover:bg-coral-soft"
                  : "bg-emerald-brand text-ink-900 hover:bg-emerald-glow"
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-bone/50">
              Te respondemos en menos de 24h. No compartimos tus datos.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-eyebrow text-bone/60">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

// ============================================
// 15. FINAL CTA
// ============================================

function YouthFinalCTA() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-lavender opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-radial-coral opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-display text-4xl leading-[1.05] sm:text-6xl text-balance"
          >
            Tu hijo no necesita ser perfecto.
            <br />
            <span className="bg-gradient-to-r from-lavender-soft via-coral-warm to-gold-warm bg-clip-text text-transparent">
              Necesita herramientas.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-6 text-lg text-bone/80 sm:text-xl"
          >
            Empieza con una sesión, una conversación, un primer paso. Estamos aquí.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10"
          >
            <a
              href="#contacto"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-coral-warm px-10 text-base font-medium text-ink-900 shadow-glow-gold transition-all hover:bg-coral-soft"
            >
              Conversemos
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
