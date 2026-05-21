// FAQs compartidas entre FAQ.tsx (UI) y StructuredData.tsx (Schema.org JSON-LD).
// Single source of truth para no tener inconsistencias entre lo que ve el usuario
// y lo que Google indexa para rich snippets.

export interface FAQ {
  q: string;
  a: string;
}

export const FAQS: FAQ[] = [
  {
    q: "¿Esto es una clase de breathwork?",
    a: "No. Es una experiencia auditiva inmersiva que integra respiración guiada, sonido y frecuencias. No está diseñada como una clase teórica, sino como una vivencia sensorial.",
  },
  {
    q: "¿En qué ciudades hay experiencias?",
    a: "Hacemos eventos presenciales en distintas ciudades de Ecuador (Quito, Guayaquil, Cuenca y otras según demanda). También hay sesiones online para quienes están fuera del país o prefieren vivirla desde casa. Revisa el calendario para ver fechas y ciudades disponibles.",
  },
  {
    q: "¿Hay experiencias online?",
    a: "Sí. Algunas experiencias se transmiten en vivo desde nuestro estudio con calidad auditiva profesional. Solo necesitas audífonos y un lugar donde no te interrumpan. La inscripción incluye link privado el día del evento.",
  },
  {
    q: "¿Necesito experiencia previa?",
    a: "No. La experiencia está guiada paso a paso y puedes vivirla aunque nunca hayas practicado respiración consciente.",
  },
  {
    q: "¿Qué debo llevar?",
    a: "Para presencial: ropa cómoda, mente abierta, llegar unos minutos antes. Para online: audífonos, un espacio sin interrupciones y una manta o cobija. Los detalles específicos se comparten dentro del grupo antes de cada sesión.",
  },
  {
    q: "¿Cada cuánto se realizan?",
    a: "Hacemos varias experiencias al mes, distribuidas entre ciudades de Ecuador y online. La frecuencia depende de cada ciudad — revisa el calendario para ver fechas confirmadas.",
  },
  {
    q: "¿Cuánto dura?",
    a: "La duración estimada es de 60 a 90 minutos, dependiendo del formato de cada experiencia (presencial u online).",
  },
  {
    q: "¿Es terapia o tratamiento médico?",
    a: "No. Es una experiencia de bienestar complementaria. No reemplaza atención médica, psicológica o psiquiátrica.",
  },
  {
    q: "¿Puedo ir si estoy muy estresado?",
    a: "Sí, la experiencia está pensada para personas que buscan una pausa profunda. Si tienes alguna condición médica, respiratoria, cardíaca, psiquiátrica, embarazo o estás bajo tratamiento, consulta con un profesional antes de participar.",
  },
  {
    q: "¿Cómo me entero de la próxima fecha en mi ciudad?",
    a: "Únete al grupo privado de WhatsApp. Ahí se anuncian primero las fechas por ciudad, horarios, valores y cupos disponibles. También puedes revisar el calendario en esta página.",
  },
  {
    q: "¿El grupo de WhatsApp tiene costo?",
    a: "No. El grupo es gratuito y sirve para recibir información de las próximas experiencias en todo Ecuador.",
  },
  {
    q: "¿Cómo funcionan los pagos?",
    a: "Cada experiencia tiene su valor (varía por ciudad y formato). Reservas con un depósito ($20 USD por defecto) vía PayPhone o transferencia bancaria. El resto se paga el día del evento. Las cancelaciones con más de 48h de anticipación pueden ser reembolsadas.",
  },
];
