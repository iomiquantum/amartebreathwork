// Email templates para la secuencia de bienvenida AMARTE Breathwork.
// Usados por Edge Functions de envío (Resend integration — Tarea 10).
//
// Cada template tiene: subject, preheader, body (texto), htmlBody (HTML estilizado).
// Variables se interpolan con `renderTemplate(template, vars)`.

export type EmailVars = {
  name: string;
  whatsapp_group_url: string;
  next_event_url: string;
  site_url: string;
  unsubscribe_url: string;
};

export type EmailTemplate = {
  id: string;
  delayDays: number;
  subject: string;
  preheader: string;
  body: string;
  htmlBody: string;
};

const SIGNATURE_TEXT = `
Miguel — guía de AMARTE
breathwork@amarteinc.com
WhatsApp: +593 99 565 6078
`;

const FOOTER_HTML = (vars: EmailVars) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:32px;border-top:1px solid #e5e7eb;padding-top:16px;font-family:Georgia,serif;font-size:13px;line-height:1.5;color:#6b7280;">
  <tr><td>
    <p style="margin:0 0 8px;">Miguel — guía de AMARTE</p>
    <p style="margin:0 0 4px;"><a href="mailto:breathwork@amarteinc.com" style="color:#15803d;">breathwork@amarteinc.com</a></p>
    <p style="margin:0 0 4px;">WhatsApp directo: +593 99 565 6078</p>
    <p style="margin:0 0 16px;">Grupo cerrado: <a href="${vars.whatsapp_group_url}" style="color:#15803d;">unirse al grupo</a></p>
    <p style="margin:0;font-size:11px;color:#9ca3af;">
      ¿No quieres recibir más estos mensajes?
      <a href="${vars.unsubscribe_url}" style="color:#9ca3af;text-decoration:underline;">Desuscribirme</a>.
    </p>
  </td></tr>
</table>
`;

const wrapHtml = (innerHtml: string, vars: EmailVars) => `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AMARTE</title>
</head>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Georgia,'Times New Roman',serif;color:#1f2937;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#faf7f2;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;background:#ffffff;border-radius:8px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
      <tr><td style="font-family:Georgia,serif;font-size:16px;line-height:1.7;color:#1f2937;">
        ${innerHtml}
        ${FOOTER_HTML(vars)}
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "welcome_01_welcome",
    delayDays: 0,
    subject: "Bienvenido a AMARTE 🌿",
    preheader: "Lo que viene en los próximos días.",
    body: `Hola {{name}},

Acabas de hacer algo que la mayoría posterga toda la vida:
detenerte a buscar tu respiración.

Bienvenido a AMARTE Breathwork — un espacio donde el cuerpo
deja de pelear y empieza a soltar.

Lo que viene ahora:
• En los próximos días vas a recibir 6 mensajes más (uno cada 2-3 días, nada invasivo)
• Te voy a contar qué es realmente el breathwork, por qué funciona, y cómo se siente
• Cuando estés listo, te invitaré a tu primera sesión

Mientras tanto, puedes unirte al grupo cerrado de WhatsApp:
{{whatsapp_group_url}}

Si en algún momento quieres dejar de recibir estos emails, no me ofendo —
solo da click al pie del correo.
${SIGNATURE_TEXT}`,
    htmlBody: `
<p style="margin:0 0 16px;">Hola <strong>{{name}}</strong>,</p>
<p style="margin:0 0 16px;">Acabas de hacer algo que la mayoría posterga toda la vida: <em>detenerte a buscar tu respiración</em>.</p>
<p style="margin:0 0 16px;">Bienvenido a <strong>AMARTE Breathwork</strong> — un espacio donde el cuerpo deja de pelear y empieza a soltar.</p>
<p style="margin:24px 0 8px;"><strong>Lo que viene ahora:</strong></p>
<ul style="margin:0 0 16px;padding-left:20px;">
  <li>En los próximos días vas a recibir 6 mensajes más (uno cada 2-3 días, nada invasivo)</li>
  <li>Te voy a contar qué es realmente el breathwork, por qué funciona, y cómo se siente</li>
  <li>Cuando estés listo, te invitaré a tu primera sesión</li>
</ul>
<p style="margin:0 0 16px;">Mientras tanto, ya puedes unirte al grupo cerrado de WhatsApp donde compartimos prácticas cortas, frecuencias y avisos:</p>
<p style="margin:24px 0;"><a href="{{whatsapp_group_url}}" style="display:inline-block;background:#15803d;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">Unirme al grupo</a></p>
<p style="margin:0;">Respira hondo.</p>
`,
  },
  {
    id: "welcome_02_what_is",
    delayDays: 1,
    subject: "Lo que tu respiración esconde",
    preheader: "Una verdad incómoda pero útil sobre tu nervio vago.",
    body: `{{name}},

Antes de hablarte de mi método, una pregunta:
¿Cuántas veces hoy has respirado profundo?

La mayoría respira en promedio 22,000 veces al día.
De esas, menos del 5% son respiraciones completas.

El otro 95% son cortas, superficiales, atrapadas en el pecho.
Tu cuerpo lleva años interpretando eso como "peligro".
Y tu sistema nervioso vive en alerta constante.

Eso explica:
  • por qué duermes mal aunque estés agotado
  • por qué te enojas por cosas que no te importan
  • por qué a veces el aire "se acaba" sin razón

El breathwork no es respirar bonito.
Es enseñarle a tu cuerpo que YA está a salvo.
Es desbloquear lo que llevas años cargando en el diafragma.

Y la ciencia detrás es contundente:
↓ cortisol   ↑ tono vagal   ↑ HRV   ↓ inflamación

Mañana te cuento la parte que más me obsesiona:
las frecuencias sonoras que usamos para amplificar todo esto.

Hasta entonces — un ejercicio de 30 segundos:
  1. Inhala profundo en 4 tiempos
  2. Sostén 4 tiempos
  3. Exhala lento en 8 tiempos
  4. Repite 5 veces

Lo vas a sentir.
${SIGNATURE_TEXT}`,
    htmlBody: `
<p style="margin:0 0 16px;"><strong>{{name}}</strong>,</p>
<p style="margin:0 0 16px;">Antes de hablarte de mi método, una pregunta:</p>
<p style="margin:0 0 16px;font-style:italic;color:#15803d;">¿Cuántas veces hoy has respirado profundo?</p>
<p style="margin:0 0 16px;">La mayoría respira en promedio <strong>22,000 veces al día</strong>. De esas, menos del 5% son respiraciones completas.</p>
<p style="margin:0 0 16px;">El otro 95% son cortas, superficiales, atrapadas en el pecho. Tu cuerpo lleva años interpretando eso como "peligro". Y tu sistema nervioso vive en alerta constante.</p>
<p style="margin:0 0 8px;"><strong>Eso explica:</strong></p>
<ul style="margin:0 0 16px;padding-left:20px;">
  <li>por qué duermes mal aunque estés agotado</li>
  <li>por qué te enojas por cosas que no te importan</li>
  <li>por qué a veces el aire "se acaba" sin razón</li>
</ul>
<p style="margin:0 0 16px;">El breathwork no es respirar bonito. Es <em>enseñarle a tu cuerpo que YA está a salvo</em>. Es desbloquear lo que llevas años cargando en el diafragma.</p>
<p style="margin:0 0 16px;">La ciencia detrás es contundente:<br>↓ cortisol &nbsp; ↑ tono vagal &nbsp; ↑ HRV &nbsp; ↓ inflamación</p>
<p style="margin:24px 0 8px;"><strong>Ejercicio de 30 segundos:</strong></p>
<ol style="margin:0 0 16px;padding-left:20px;">
  <li>Inhala profundo en 4 tiempos</li>
  <li>Sostén 4 tiempos</li>
  <li>Exhala lento en 8 tiempos</li>
  <li>Repite 5 veces</li>
</ol>
<p style="margin:0 0 16px;">Lo vas a sentir.</p>
`,
  },
  {
    id: "welcome_03_frequencies",
    delayDays: 3,
    subject: "Las 4 frecuencias que cambian todo",
    preheader: "174, 396, 528, 741 Hz. Esto es lo que hacen.",
    body: `{{name}},

En cada sesión de AMARTE trabajamos con cuatro frecuencias específicas.
No son arbitrarias. Cada una golpea un sistema distinto del cuerpo.

🎵 174 Hz — Anestesia natural
   Reduce dolor físico y muscular. El cuerpo afloja.

🎵 396 Hz — Liberación del miedo
   Disuelve el ruido mental. Lo que cargabas deja de pesar.

🎵 528 Hz — Reparación celular
   La frecuencia del ADN. Se siente como volver a casa.

🎵 741 Hz — Limpieza energética
   Despeja lo que ya no es tuyo. Salida limpia, presente.

En la web puedes escuchar una preview de cada una
(40 segundos cada una, audífonos recomendados):
{{site_url}}/#frecuencias

Las pongo en vivo durante la sesión, sincronizadas con tu respiración.
Es la combinación lo que abre el estado profundo, no una sola por separado.

Si lograste escuchar las 4 — escríbeme y cuéntame cuál te pegó más.
Suele decir mucho de lo que el cuerpo está pidiendo.
${SIGNATURE_TEXT}`,
    htmlBody: `
<p style="margin:0 0 16px;"><strong>{{name}}</strong>,</p>
<p style="margin:0 0 16px;">En cada sesión de AMARTE trabajamos con <strong>cuatro frecuencias específicas</strong>. No son arbitrarias. Cada una golpea un sistema distinto del cuerpo.</p>
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:24px 0;">
  <tr><td style="padding:16px;background:#f5f3ef;border-radius:6px;">
    <p style="margin:0 0 4px;"><strong>🎵 174 Hz</strong> — Anestesia natural</p>
    <p style="margin:0;font-size:14px;color:#6b7280;">Reduce dolor físico y muscular. El cuerpo afloja.</p>
  </td></tr>
  <tr><td style="height:8px;"></td></tr>
  <tr><td style="padding:16px;background:#f5f3ef;border-radius:6px;">
    <p style="margin:0 0 4px;"><strong>🎵 396 Hz</strong> — Liberación del miedo</p>
    <p style="margin:0;font-size:14px;color:#6b7280;">Disuelve el ruido mental. Lo que cargabas deja de pesar.</p>
  </td></tr>
  <tr><td style="height:8px;"></td></tr>
  <tr><td style="padding:16px;background:#f5f3ef;border-radius:6px;">
    <p style="margin:0 0 4px;"><strong>🎵 528 Hz</strong> — Reparación celular</p>
    <p style="margin:0;font-size:14px;color:#6b7280;">La frecuencia del ADN. Se siente como volver a casa.</p>
  </td></tr>
  <tr><td style="height:8px;"></td></tr>
  <tr><td style="padding:16px;background:#f5f3ef;border-radius:6px;">
    <p style="margin:0 0 4px;"><strong>🎵 741 Hz</strong> — Limpieza energética</p>
    <p style="margin:0;font-size:14px;color:#6b7280;">Despeja lo que ya no es tuyo. Salida limpia, presente.</p>
  </td></tr>
</table>
<p style="margin:24px 0;"><a href="{{site_url}}/#frecuencias" style="display:inline-block;background:#15803d;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">Escuchar previews (40s c/u)</a></p>
<p style="margin:0 0 16px;font-size:14px;color:#6b7280;">Las pongo en vivo durante la sesión, sincronizadas con tu respiración. Es la combinación lo que abre el estado profundo.</p>
<p style="margin:0 0 16px;">Si lograste escuchar las 4 — respóndeme y cuéntame cuál te pegó más. Suele decir mucho.</p>
`,
  },
  {
    id: "welcome_04_social_proof",
    delayDays: 5,
    subject: '"Salí flotando" — la voz de quienes ya respiraron contigo',
    preheader: "Testimonios reales + próxima fecha.",
    body: `{{name}},

No te voy a vender nada hoy.
Solo te voy a dejar lo que dijeron tres personas
que pasaron por una sesión de AMARTE:

"Lloré sin saber por qué. Pero no era tristeza,
era algo que llevaba años atorado y por fin salió."
— Andrea, 34, Quito

"Llegué con migraña. Me fui sin migraña, sin ganas
de hablar con nadie, en el mejor sentido."
— Carlos, 41, Cumbayá

"No sabía que se podía sentir tanto adentro estando
tan quieto. Volví a la semana siguiente."
— María José, 29, Guayaquil

Esto no es para todos.
No es relajación. No es meditación guiada.
Es una práctica intensa donde algo cambia.

Si te resuena — la próxima sesión está abierta:
{{next_event_url}}

Si no es esta, será la siguiente. No hay prisa.
${SIGNATURE_TEXT}`,
    htmlBody: `
<p style="margin:0 0 16px;"><strong>{{name}}</strong>,</p>
<p style="margin:0 0 24px;">No te voy a vender nada hoy. Solo te voy a dejar lo que dijeron <strong>tres personas que pasaron por una sesión de AMARTE</strong>:</p>
<blockquote style="margin:0 0 16px;padding:16px 20px;background:#f5f3ef;border-left:3px solid #15803d;font-style:italic;">
  "Lloré sin saber por qué. Pero no era tristeza, era algo que llevaba años atorado y por fin salió."<br>
  <span style="font-style:normal;font-size:14px;color:#6b7280;">— Andrea, 34, Quito</span>
</blockquote>
<blockquote style="margin:0 0 16px;padding:16px 20px;background:#f5f3ef;border-left:3px solid #15803d;font-style:italic;">
  "Llegué con migraña. Me fui sin migraña, sin ganas de hablar con nadie, en el mejor sentido."<br>
  <span style="font-style:normal;font-size:14px;color:#6b7280;">— Carlos, 41, Cumbayá</span>
</blockquote>
<blockquote style="margin:0 0 24px;padding:16px 20px;background:#f5f3ef;border-left:3px solid #15803d;font-style:italic;">
  "No sabía que se podía sentir tanto adentro estando tan quieto. Volví a la semana siguiente."<br>
  <span style="font-style:normal;font-size:14px;color:#6b7280;">— María José, 29, Guayaquil</span>
</blockquote>
<p style="margin:0 0 16px;">Esto no es para todos. No es relajación. No es meditación guiada. <strong>Es una práctica intensa donde algo cambia.</strong></p>
<p style="margin:24px 0;"><a href="{{next_event_url}}" style="display:inline-block;background:#15803d;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">Ver próxima sesión</a></p>
<p style="margin:0 0 16px;font-size:14px;color:#6b7280;">Si no es esta, será la siguiente. No hay prisa.</p>
`,
  },
  {
    id: "welcome_05_reminder_objections",
    delayDays: 7,
    subject: "Tu primera sesión está más cerca de lo que crees",
    preheader: "Las 3 preguntas que más me hacen antes de venir.",
    body: `{{name}},

Una semana después de tu primer email,
así que asumo que algo te jaló a quedarte por aquí.

Estas son las 3 preguntas que más recibo
antes de la primera sesión:

1. "¿Y si no siento nada?"
   Lo más común es lo contrario. Pero si "no sientes",
   igual algo está pasando bajo nivel: tu HRV sube,
   tu cortisol baja. El cuerpo no miente.

2. "¿Necesito experiencia previa?"
   Cero. La técnica se aprende en los primeros 5 minutos.
   El resto es soltarse.

3. "¿Y si lloro / me dan ganas de gritar / me bloqueo?"
   Es BUENO. Es la señal de que el cuerpo confía en el espacio.
   Yo sostengo. Tú dejas pasar lo que tenga que pasar.

Si después de leer esto sigue habiendo un "sí" interno,
aquí está la fecha más próxima:
{{next_event_url}}

Cupos limitados (siempre — no es marketing, es la forma
en que sostengo la calidad del espacio).

Cualquier duda, responde este email. Te leo personalmente.
${SIGNATURE_TEXT}`,
    htmlBody: `
<p style="margin:0 0 16px;"><strong>{{name}}</strong>,</p>
<p style="margin:0 0 16px;">Una semana después de tu primer email, así que asumo que <em>algo te jaló a quedarte por aquí</em>.</p>
<p style="margin:0 0 16px;">Estas son las 3 preguntas que más recibo antes de la primera sesión:</p>
<p style="margin:24px 0 8px;"><strong>1. "¿Y si no siento nada?"</strong></p>
<p style="margin:0 0 16px;color:#6b7280;font-size:15px;">Lo más común es lo contrario. Pero si "no sientes", igual algo está pasando bajo nivel: tu HRV sube, tu cortisol baja. El cuerpo no miente.</p>
<p style="margin:0 0 8px;"><strong>2. "¿Necesito experiencia previa?"</strong></p>
<p style="margin:0 0 16px;color:#6b7280;font-size:15px;">Cero. La técnica se aprende en los primeros 5 minutos. El resto es soltarse.</p>
<p style="margin:0 0 8px;"><strong>3. "¿Y si lloro / me dan ganas de gritar / me bloqueo?"</strong></p>
<p style="margin:0 0 16px;color:#6b7280;font-size:15px;">Es BUENO. Es la señal de que el cuerpo confía en el espacio. Yo sostengo. Tú dejas pasar lo que tenga que pasar.</p>
<p style="margin:24px 0;"><a href="{{next_event_url}}" style="display:inline-block;background:#15803d;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">Reservar mi cupo</a></p>
<p style="margin:0 0 16px;font-size:14px;color:#6b7280;">Cupos limitados (siempre — no es marketing, es la forma en que sostengo la calidad del espacio).</p>
<p style="margin:0;">Cualquier duda, responde este email. Te leo personalmente.</p>
`,
  },
  {
    id: "welcome_06_reflection",
    delayDays: 10,
    subject: "Una pregunta que casi nadie se hace",
    preheader: "Sin respuesta inmediata. Solo siéntala unos segundos.",
    body: `{{name}},

Hoy no hay enseñanza, ni invitación, ni call to action.

Solo una pregunta:

¿Qué estás cargando que ya no es tuyo?

No respondas rápido.
No respondas con la cabeza.

Ciérrala. Respira tres veces hondo.
Y deja que el cuerpo conteste.

(El cuerpo siempre sabe — solo le hablamos poco.)

Si quieres compartir lo que apareció, responde este email.
Lo leo personalmente. A veces escribirlo ya empieza a soltarlo.
${SIGNATURE_TEXT}`,
    htmlBody: `
<p style="margin:0 0 16px;"><strong>{{name}}</strong>,</p>
<p style="margin:0 0 24px;">Hoy no hay enseñanza, ni invitación, ni call to action.</p>
<p style="margin:0 0 24px;">Solo una pregunta:</p>
<p style="margin:32px 0;text-align:center;font-size:22px;line-height:1.4;color:#15803d;font-style:italic;">
  ¿Qué estás cargando<br>que ya no es tuyo?
</p>
<p style="margin:0 0 16px;color:#6b7280;">No respondas rápido. No respondas con la cabeza.</p>
<p style="margin:0 0 16px;color:#6b7280;">Ciérrala. Respira tres veces hondo. Y deja que el cuerpo conteste.</p>
<p style="margin:0 0 24px;color:#6b7280;font-size:14px;">(El cuerpo siempre sabe — solo le hablamos poco.)</p>
<p style="margin:0;">Si quieres compartir lo que apareció, responde este email. Lo leo personalmente. A veces escribirlo ya empieza a soltarlo.</p>
`,
  },
  {
    id: "welcome_07_gift",
    delayDays: 14,
    subject: "Antes de irme, déjame regalarte esto",
    preheader: "Una sesión grabada de 12 minutos. Sin condiciones.",
    body: `{{name}},

Han pasado dos semanas desde el primer email.

Si estás listo para venir a una sesión en vivo,
ya sabes dónde encontrarme: {{next_event_url}}

Si todavía no — está bien.

Pero antes de bajar la frecuencia de estos mensajes
(porque no quiero saturarte), déjame regalarte esto:

🎁 Una sesión grabada de 12 minutos, narrada por mí
y mezclada con las 4 frecuencias.
Sin condiciones, sin formulario nuevo.

Link: {{site_url}}/regalo

Ponla con audífonos. Acuéstate. Sigue mi voz.
12 minutos. Vas a salir diferente.

Y si alguna vez quieres volver a este camino — estoy aquí.

Respira.
${SIGNATURE_TEXT}
PS: Si ya no quieres recibir estos mensajes, da click abajo.
No me ofende. La frecuencia debe ser elegida.`,
    htmlBody: `
<p style="margin:0 0 16px;"><strong>{{name}}</strong>,</p>
<p style="margin:0 0 16px;">Han pasado dos semanas desde el primer email.</p>
<p style="margin:0 0 16px;">Si estás listo para venir a una sesión en vivo, ya sabes dónde encontrarme:</p>
<p style="margin:16px 0;"><a href="{{next_event_url}}" style="color:#15803d;font-weight:600;">Próxima sesión →</a></p>
<p style="margin:0 0 24px;">Si todavía no — está bien.</p>
<p style="margin:0 0 16px;">Pero antes de bajar la frecuencia de estos mensajes (porque no quiero saturarte), déjame regalarte esto:</p>
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:24px 0;background:#f5f3ef;border-radius:8px;">
  <tr><td style="padding:24px;">
    <p style="margin:0 0 8px;font-size:18px;">🎁 <strong>Una sesión grabada de 12 minutos</strong></p>
    <p style="margin:0 0 16px;color:#6b7280;font-size:14px;">narrada por mí y mezclada con las 4 frecuencias. Sin condiciones, sin formulario nuevo.</p>
    <p style="margin:0;"><a href="{{site_url}}/regalo" style="display:inline-block;background:#15803d;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">Descargar mi regalo</a></p>
  </td></tr>
</table>
<p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Ponla con audífonos. Acuéstate. Sigue mi voz. 12 minutos. Vas a salir diferente.</p>
<p style="margin:24px 0 0;">Y si alguna vez quieres volver a este camino — estoy aquí. Respira.</p>
<p style="margin:24px 0 0;font-size:12px;color:#9ca3af;font-style:italic;">PS: Si ya no quieres recibir estos mensajes, da click abajo. No me ofende. La frecuencia debe ser elegida.</p>
`,
  },
];

export function renderTemplate(template: string, vars: EmailVars): string {
  return template
    .replaceAll("{{name}}", () => vars.name)
    .replaceAll("{{whatsapp_group_url}}", vars.whatsapp_group_url)
    .replaceAll("{{next_event_url}}", vars.next_event_url)
    .replaceAll("{{site_url}}", vars.site_url)
    .replaceAll("{{unsubscribe_url}}", vars.unsubscribe_url);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]!);
}
function safeEmailVars(vars: EmailVars): EmailVars {
  const out = {...vars};
  for (const key of ["whatsapp_group_url","next_event_url","site_url","unsubscribe_url"] as const) {
    const url = new URL(vars[key]);
    if (url.protocol !== "https:" || url.username || url.password) throw new Error("Unsafe email link");
    out[key] = url.href;
  }
  return out;
}
export function renderEmail(
  template: EmailTemplate,
  vars: EmailVars,
): { subject: string; preheader: string; text: string; html: string } {
  vars = safeEmailVars(vars);
  const htmlVars = Object.fromEntries(Object.entries(vars).map(([key,value]) => [key,escapeHtml(value)])) as EmailVars;
  return {
    subject: renderTemplate(template.subject, vars).replace(/[\r\n]/g," "),
    preheader: renderTemplate(template.preheader, vars),
    text: renderTemplate(template.body, vars),
    html: wrapHtml(renderTemplate(template.htmlBody, htmlVars), htmlVars),
  };
}

export function getTemplateById(id: string): EmailTemplate | undefined {
  return EMAIL_TEMPLATES.find((t) => t.id === id);
}
