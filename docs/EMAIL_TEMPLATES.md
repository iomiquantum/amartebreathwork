# 📧 AMARTE Breathwork — Welcome Email Sequence

> **Propósito:** Secuencia de 7 emails enviados automáticamente tras capturar un lead. Diseñada para nutrir, educar y convertir sin forzar.
>
> **Tono:** cálido, profundo, espacioso. Como si Miguel te escribiera personalmente. Sin urgencia falsa, sin manipulación.
>
> **Implementación técnica:** templates en `supabase/functions/_shared/email-templates.ts`. Se enviarán vía Resend desde `breathwork@amarteinc.com` cuando esté lista la integración (Tarea 10).
>
> **Variables disponibles en cada template:** `{{name}}`, `{{whatsapp_group_url}}`, `{{next_event_url}}`, `{{site_url}}`, `{{unsubscribe_url}}`

---

## 📅 Cronograma

| # | Día | Subject | Objetivo |
|---|---|---|---|
| 1 | 0 (inmediato) | Bienvenido a AMARTE 🌿 | Confirmación + qué esperar |
| 2 | +1 | Lo que tu respiración esconde | Educación: qué es breathwork |
| 3 | +3 | Las 4 frecuencias que cambian todo | Educación: 174/396/528/741 Hz |
| 4 | +5 | "Salí flotando" — la voz de quienes ya respiraron contigo | Social proof + invitación a próximo evento |
| 5 | +7 | Tu primera sesión está más cerca de lo que crees | Recordatorio próximo evento + objeción busters |
| 6 | +10 | Una pregunta que casi nadie se hace | Reflexión profunda, abrir conversación |
| 7 | +14 | Antes de irme, déjame regalarte esto | Reactivación: guía PDF / audio / oferta |

---

## EMAIL 1 — Bienvenida (Día 0, inmediato)

**Subject:** Bienvenido a AMARTE 🌿
**Preheader:** Lo que viene en los próximos días.

```
Hola {{name}},

Acabas de hacer algo que la mayoría posterga toda la vida:
detenerte a buscar tu respiración.

Bienvenido a AMARTE Breathwork — un espacio donde el cuerpo
deja de pelear y empieza a soltar.

Lo que viene ahora:
• En los próximos días vas a recibir 6 mensajes más
  (uno cada 2-3 días, nada invasivo)
• Te voy a contar qué es realmente el breathwork,
  por qué funciona, y cómo se siente
• Cuando estés listo, te invitaré a tu primera sesión

Mientras tanto, ya puedes unirte al grupo cerrado de WhatsApp
donde compartimos prácticas cortas, frecuencias y avisos:

  👉 {{whatsapp_group_url}}

Si en algún momento quieres dejar de recibir estos emails,
no me ofendo — solo da click al pie del correo.

Respira hondo.
Miguel — guía de AMARTE
breathwork@amarteinc.com
```

---

## EMAIL 2 — Lo que tu respiración esconde (Día +1)

**Subject:** Lo que tu respiración esconde
**Preheader:** Una verdad incómoda pero útil sobre tu nervio vago.

```
{{name}},

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
   ↓ cortisol  ↑ tono vagal  ↑ HRV  ↓ inflamación

Mañana te cuento la parte que más me obsesiona:
las frecuencias sonoras que usamos para amplificar todo esto.

Hasta entonces — un ejercicio de 30 segundos:
   1. Inhala profundo en 4 tiempos
   2. Sostén 4 tiempos
   3. Exhala lento en 8 tiempos
   4. Repite 5 veces

Lo vas a sentir.

Miguel
```

---

## EMAIL 3 — Las 4 frecuencias (Día +3)

**Subject:** Las 4 frecuencias que cambian todo
**Preheader:** 174, 396, 528, 741 Hz. Esto es lo que hacen.

```
{{name}},

En cada sesión de AMARTE trabajamos con cuatro
frecuencias específicas. No son arbitrarias.
Cada una golpea un sistema distinto del cuerpo.

  🎵 174 Hz — Anestesia natural
     Reduce dolor físico y muscular.
     El cuerpo entiende que puede aflojar.

  🎵 396 Hz — Liberación del miedo
     Disuelve el ruido mental.
     Lo que llevabas cargando deja de tener peso.

  🎵 528 Hz — Reparación celular
     La frecuencia del ADN.
     Se siente como volver a casa, literalmente.

  🎵 741 Hz — Limpieza energética
     Despeja lo que ya no es tuyo.
     Salida limpia, presente.

En la web puedes escuchar una preview de cada una
(40 segundos cada una, audífonos recomendados):

  👉 {{site_url}}/#frecuencias

Las pongo en vivo durante la sesión, sincronizadas
con tu respiración. Es la combinación lo que abre el
estado profundo, no una sola por separado.

Si lograste escuchar las 4 — escríbeme y cuéntame
cuál te pegó más. Suele decir mucho de lo que el
cuerpo está pidiendo.

Miguel
```

---

## EMAIL 4 — Social proof + invitación (Día +5)

**Subject:** "Salí flotando" — la voz de quienes ya respiraron contigo
**Preheader:** Testimonios reales + próxima fecha.

```
{{name}},

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

  👉 {{next_event_url}}

Si no es esta, será la siguiente.
No hay prisa. Solo cuando estés listo.

Miguel
```

---

## EMAIL 5 — Recordatorio + objeción busters (Día +7)

**Subject:** Tu primera sesión está más cerca de lo que crees
**Preheader:** Las 3 preguntas que más me hacen antes de venir.

```
{{name}},

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

  👉 {{next_event_url}}

Cupos limitados (siempre — no es marketing, es la
forma en que sostengo la calidad del espacio).

Cualquier duda, responde este email.
Te leo personalmente.

Miguel
```

---

## EMAIL 6 — Reflexión profunda (Día +10)

**Subject:** Una pregunta que casi nadie se hace
**Preheader:** Sin respuesta inmediata. Solo siéntala unos segundos.

```
{{name}},

Hoy no hay enseñanza, ni invitación, ni call to action.

Solo una pregunta:

   ¿Qué estás cargando que ya no es tuyo?

No respondas rápido.
No respondas con la cabeza.

Ciérrala. Respira tres veces hondo.
Y deja que el cuerpo conteste.

(El cuerpo siempre sabe — solo le hablamos poco.)

Si quieres compartir lo que apareció,
responde este email. Lo leo personalmente.
A veces escribirlo ya empieza a soltarlo.

Miguel
breathwork@amarteinc.com
```

---

## EMAIL 7 — Reactivación / regalo (Día +14)

**Subject:** Antes de irme, déjame regalarte esto
**Preheader:** Una sesión grabada de 12 minutos. Sin condiciones.

```
{{name}},

Han pasado dos semanas desde el primer email.

Si estás listo para venir a una sesión en vivo:
ya sabes dónde encontrarme.

  👉 {{next_event_url}}

Si todavía no — está bien.

Pero antes de bajar la frecuencia de estos mensajes
(porque no quiero saturarte), déjame regalarte esto:

  🎁 Una sesión grabada de 12 minutos, narrada por mí
     y mezclada con las 4 frecuencias.
     Sin condiciones, sin formulario nuevo.

  👉 [Link al audio en {{site_url}}/regalo]

Ponla con audífonos. Acuéstate. Sigue mi voz.
12 minutos. Vas a salir diferente.

Y si alguna vez quieres volver a este camino
— estoy aquí.

Respira.
Miguel
breathwork@amarteinc.com
WhatsApp directo: +593 99 565 6078
Grupo cerrado: {{whatsapp_group_url}}

PS: Si ya no quieres recibir estos mensajes, da click abajo.
No me ofende. La frecuencia debe ser elegida.
```

---

## 🛠 Notas de implementación

### Resend setup (Tarea 10)
- Remitente: `Miguel @ AMARTE <breathwork@amarteinc.com>`
- Reply-To: `breathwork@amarteinc.com`
- Categoría/tag: `welcome-sequence`
- Tracking: pixel + click tracking activos (Resend default)

### Trigger en DB
- Cuando se inserte un row en `breathwork_leads`, programar:
  - email1: en cola inmediata
  - email2-7: con cron + tabla `email_queue` con `send_at` calculado
- Anti-spam: si el email es vacío, skip toda la secuencia y solo mandar via WhatsApp

### Unsubscribe
- Footer con link a `/unsubscribe?email={{email}}&token={{hmac}}`
- Token = HMAC(email, secret) para evitar enumeration

### Variables a inyectar
- `{{name}}` → primer nombre del lead (si solo viene full, tomar la primera palabra)
- `{{whatsapp_group_url}}` → constante del siteConfig
- `{{next_event_url}}` → query a `breathwork_events` filtrando status='published' + date_iso > now() + featured first
- `{{site_url}}` → constante
- `{{unsubscribe_url}}` → generado con HMAC

### A/B test sugerido (futuro)
- Email 4 (social proof) y Email 5 (objeción busters) son las palancas de conversión.
- Probar variantes con subject más directo: "El próximo evento es el 12 de junio" vs el actual.

---

**Última actualización:** 2026-05-21 — sesión paralela
