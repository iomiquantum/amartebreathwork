# 📲 PLAN: Auto-WhatsApp con Meta Cloud API

> **Estado:** PENDIENTE — implementación programada para próxima sesión
> **Objetivo:** Cuando un lead se inscriba en `breathwork.amarteinc.com`, recibe automáticamente un WhatsApp con el link al grupo en menos de 30 segundos
> **Beneficio estratégico:** Activar pauta digital (Meta Ads / Instagram Ads) con conversión maximizada + construir base de contactos atada al Business Account para campañas futuras + integrar con CRM y Bot AI

---

## 🎯 Visión completa (3 fases)

### 🥇 Fase 1: Auto-mensaje de bienvenida (próxima sesión)

```
Usuario llena form en breathwork.amarteinc.com
       ↓
INSERT en breathwork_leads (Supabase)
       ↓
🪝 Database Webhook dispara automáticamente
       ↓
🤖 Supabase Edge Function recibe el lead
       ↓
📲 Edge Function llama a Meta WhatsApp Cloud API
       ↓
✅ Meta envía WhatsApp al usuario en <30 segundos:

   "Hola Miguel, gracias por registrarte a AMARTE.
    Aquí tu link al grupo privado: https://chat.whatsapp.com/xxxx
    Ahí anunciamos primero las próximas fechas. 🌿"
```

### 🥈 Fase 2: CRM + Segmentación (semanas siguientes)
- Sincronizar contactos a CRM (Notion, HubSpot, o construir custom en Supabase)
- Etiquetar leads por `intent` capturado en el form (soltar_estres, dormir_mejor, etc.)
- Broadcasts segmentados según comportamiento
- Tracking de funnel: ¿quién leyó el mensaje? ¿quién entró al grupo? ¿quién compró?

### 🥉 Fase 3: Bot AI conversacional (mes 2-3)
- Bot AI (Claude/GPT) que responde automáticamente preguntas frecuentes
- Calificación automática de leads ("hot/warm/cold")
- Flujos de venta inteligentes con IA
- Handoff a humano cuando se requiera

**Importante:** la arquitectura de Fase 1 está diseñada para soportar Fases 2-3 sin reescribir nada. La base que pongamos mañana escala a todo.

---

## 🏗️ Arquitectura técnica detallada

### Componentes necesarios

```
┌──────────────────────────────────────────────────────────────┐
│  FRONTEND (Vercel)                                            │
│  ├─ breathwork.amarteinc.com                                  │
│  └─ Form con opt-in checkbox + envío a Supabase              │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│  SUPABASE (DB + Backend)                                      │
│  ├─ Tabla: breathwork_leads (ya existe ✅)                   │
│  ├─ Database Webhook → dispara Edge Function al INSERT       │
│  └─ Edge Function: whatsapp-welcome                           │
│       ├─ Recibe el record del lead                           │
│       ├─ Llama a Meta WhatsApp Cloud API                     │
│       └─ Loggea resultado                                    │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│  META WHATSAPP CLOUD API                                      │
│  ├─ Business Account: AMARTE                                  │
│  ├─ Phone Number: el número de Amarte (a registrar)          │
│  ├─ Template: amarte_welcome_breathwork (Utility)            │
│  └─ Envía WhatsApp al usuario                                │
└──────────────────────────────────────────────────────────────┘
                              ↓
                    📱 Usuario recibe WhatsApp
                    + queda como contacto en BA
                    → marketing futuro habilitado
```

### Stack tecnológico

| Capa | Tech | Costo |
|---|---|---|
| Frontend | Vite + React + TS (ya existe) | $0 |
| DB | Supabase Postgres (ya existe) | $0 (Free tier) |
| Backend serverless | Supabase Edge Functions (Deno) | $0 (500K invocations/mes incluidas) |
| Webhook | Supabase Database Webhooks | $0 |
| API mensajería | Meta WhatsApp Cloud API | $0 hasta 1,000 conversaciones/mes |
| **Total mensual estimado (primeros meses):** | | **$0** |

---

## ✅ Decisiones tomadas (sesión anterior)

### 🎯 Categoría del template: MIXTO
- **Mensaje de bienvenida (Fase 1):** categoría **Utility** ($0.008/mensaje en Ecuador, aprobación fácil)
- **Campañas marketing futuras (Fase 2):** crear templates **Marketing** aparte ($0.04+/mensaje, más libertad de copy)

### 🎯 Cuenta Meta Business
- **Estado:** ✅ Ya verificada (de campañas Facebook Ads previas)
- **Acción requerida:** crear App de tipo Business + agregar producto WhatsApp

### 🎯 Número de WhatsApp
- **Estado:** ✅ Usuario tiene número asignado disponible
- **Decisión:** ese número se dedica a Cloud API → deja de funcionar en WhatsApp normal/Business app
- **Acción requerida:** confirmar número exacto + registrar en Meta

### 🎯 Opt-in del usuario
- **Decisión:** agregar texto/checkbox claro en el form antes de "Confirmar y enviar"
- **Por qué:** política de Meta exige consentimiento explícito para mensajes "Business-Initiated"
- **Texto sugerido:** "Al confirmar aceptas recibir un WhatsApp inmediato con el link al grupo y información de próximas experiencias"

---

## 📋 Prerequisitos antes de empezar (lista de chequeo)

Antes de la próxima sesión, IOMI debe tener listo:

- [ ] **Acceso a Meta Business Manager verificado** (link: https://business.facebook.com)
  - Confirmar que cuenta Amarte está visible y verificada
- [ ] **Número WhatsApp dedicado** disponible (chip + acceso al SIM para recibir SMS de verificación)
- [ ] **Link de grupo de WhatsApp creado** (para incluir en el mensaje automático)
- [ ] **Datos de Amarte para opt-in legal:**
  - Email de contacto (sugerido: `hola@amarteinc.com`)
  - Nombre legal de la empresa o persona responsable
- [ ] **Logo cuadrado de Amarte** (opcional, para header del template — 5MB max, formato JPG/PNG)
- [ ] **Texto del mensaje de bienvenida** ya pensado (sugerencia abajo)

---

## ✏️ Texto sugerido del template (revisar antes de aprobación)

### Template name: `amarte_welcome_breathwork`
### Categoría: Utility
### Idioma: Spanish (es)

**Header (opcional, imagen):**
- Logo AMARTE cuadrado

**Body:**
```
Hola {{1}} 🌿

Gracias por registrarte a AMARTE — Breathwork Inmersivo.

Aquí tu acceso al grupo privado donde anunciamos primero las
próximas fechas, ubicación y cupos disponibles:

👉 {{2}}

Nos vemos pronto. Respira.
```

**Variables:**
- `{{1}}` = primer nombre del usuario
- `{{2}}` = link del grupo WhatsApp

**Footer (opcional):**
```
AMARTE · Quito, Ecuador
```

**Buttons (opcional, recomendado):**
- Botón **"Entrar al grupo"** → URL directo al grupo (alternativa al link en body)

**Por qué esta estructura funciona:**
- ✅ Categoría Utility (transaccional, responde a acción del usuario) → aprobación rápida
- ✅ Sin promociones ni precios (eso es Marketing) → categoría correcta
- ✅ Personalizado con nombre → mejor conversión
- ✅ Acción clara (un link, un botón) → claridad UX
- ✅ Tono coherente con el branding (respira, calma, presencia)

---

## 🛠️ Plan de implementación paso a paso (próxima sesión)

### FASE 1.A — Setup Meta (1 hora activa)

#### Paso 1: Crear App en Meta for Developers (10 min)
1. Ir a https://developers.facebook.com
2. My Apps → Create App → tipo Business
3. Nombre: `AMARTE WhatsApp`
4. Vincular a Business Account de Amarte

#### Paso 2: Agregar producto WhatsApp a la app (5 min)
1. Dashboard de la app → Add Products → WhatsApp → Set up
2. Te muestra: número de prueba + Access Token + Phone Number ID + Business Account ID
3. **GUARDAR estos IDs** (los necesita Claude para configurar)

#### Paso 3: Registrar número real de Amarte (15 min)
1. WhatsApp Manager → Phone numbers → Add phone number
2. Ingresar número (formato internacional)
3. Verificación por SMS o llamada
4. **El número deja de funcionar en WhatsApp normal/Business app desde aquí**

#### Paso 4: Crear template (10 min)
1. WhatsApp Manager → Message Templates → Create
2. Pegar el contenido del template definido arriba
3. Submit for approval
4. **Esperar 24-48h primera aprobación**

#### Paso 5: Generar Permanent Access Token (10 min)
1. Business Settings → System Users → Add → tipo "Admin"
2. Generate Token → seleccionar app WhatsApp → permisos `whatsapp_business_messaging` + `whatsapp_business_management`
3. **Copiar el token** (es PERMANENTE, no temporal de 24h como el del Dashboard)
4. ⚠️ **Guardar en password manager — no compartir**

---

### FASE 1.B — Setup Supabase + Código (1 hora activa, hecho por Claude)

#### Paso 6: Modificar LeadForm.tsx — agregar opt-in (10 min, Claude)
Cambios:
- Agregar checkbox o texto claro de consentimiento en Step 2 (Confirmación)
- Texto: "Al confirmar aceptas recibir un WhatsApp con el link al grupo y información de las experiencias"
- Si checkbox: bloquear botón submit hasta marcar
- Si solo texto: dejar implícito el consentimiento al hacer submit

#### Paso 7: Crear Supabase Edge Function `whatsapp-welcome` (30 min, Claude)
Código pseudo (Deno/TypeScript):
```typescript
import { serve } from "https://deno.land/std/http/server.ts";

const META_TOKEN = Deno.env.get("META_WHATSAPP_TOKEN");
const PHONE_NUMBER_ID = Deno.env.get("META_PHONE_NUMBER_ID");
const GROUP_URL = Deno.env.get("WHATSAPP_GROUP_URL");

serve(async (req) => {
  // 1. Recibir webhook de Supabase
  const payload = await req.json();
  const lead = payload.record;

  // 2. Validar opt-in y formato de número
  if (!lead.whatsapp) return new Response("no whatsapp", { status: 400 });
  const cleanNumber = lead.whatsapp.replace(/\D/g, "");

  // 3. Llamar Meta API
  const res = await fetch(
    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${META_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: cleanNumber,
        type: "template",
        template: {
          name: "amarte_welcome_breathwork",
          language: { code: "es" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: lead.name.split(" ")[0] },
                { type: "text", text: GROUP_URL }
              ]
            }
          ]
        }
      })
    }
  );

  // 4. Loggear resultado
  if (!res.ok) {
    console.error("Meta API error:", await res.text());
    return new Response("meta error", { status: 500 });
  }

  return new Response("ok");
});
```

#### Paso 8: Configurar secrets en Supabase (5 min, Claude guía + usuario pega)
En Supabase Dashboard → Edge Functions → Secrets:
- `META_WHATSAPP_TOKEN` = (Permanent Access Token del Paso 5)
- `META_PHONE_NUMBER_ID` = (del Paso 2)
- `WHATSAPP_GROUP_URL` = (link del grupo Amarte)

#### Paso 9: Configurar Database Webhook (5 min, Claude)
En Supabase Dashboard → Database → Webhooks:
- Name: `breathwork_leads_to_whatsapp`
- Table: `breathwork_leads`
- Events: `INSERT`
- Type: HTTP Request → POST a la URL de la Edge Function
- Headers: incluir auth

#### Paso 10: Test end-to-end (15 min, Claude + usuario)
1. Esperar aprobación de template (si todavía no llegó)
2. Llenar form con número de prueba (el del propio usuario)
3. Verificar que llega WhatsApp en <30 segundos
4. Verificar logs en Supabase Edge Function
5. Si hay error: diagnosticar con `get_logs`

---

## 💰 Costos detallados

### Plan gratuito Meta Cloud API:
- **Primeras 1,000 conversaciones/mes:** GRATIS ✅
- **Conversación = ventana de 24h con un usuario** (no por mensaje individual)

### Después de 1,000 conversaciones/mes (Ecuador):
| Tipo de conversación | Costo aprox. |
|---|---|
| Utility (transaccional) | $0.008 USD |
| Marketing (promocional) | $0.0408 USD |
| Authentication (códigos) | $0.015 USD |
| Service (post-respuesta usuario, 24h) | GRATIS |

### Proyección para Amarte (estimado conservador):
| Escala | Leads/mes | Mensajes/mes | Costo |
|---|---|---|---|
| Mes 1 (validación) | ~100 | ~100 | $0 (free tier) |
| Mes 3 (con pauta) | ~500 | ~500 | $0 (free tier) |
| Mes 6 (escalando) | ~1,500 | ~1,500 | ~$4-8 USD/mes |
| Mes 12 (consolidado) | ~5,000 | ~5,000 | ~$32-40 USD/mes |

**Comparación con alternativas:**
- Wati: $39-99/mes desde día 1
- 360dialog: $20/mes base + costos por mensaje
- Twilio: ~$0.05/mensaje desde el primero (sin tier gratuito)
- **Meta Cloud API directo: $0 hasta que crezcas mucho** ⭐

---

## ⚠️ Riesgos y mitigaciones

### Riesgo 1: Template rechazado por Meta
**Probabilidad:** Baja (template es claramente Utility, sin promoción)
**Mitigación:** ajustar copy y reenviar (aprobación segunda vez en minutos)

### Riesgo 2: Quality Rating del número baja a Yellow/Red
**Síntoma:** muchos usuarios bloquean/reportan
**Probabilidad:** Baja (con opt-in claro y mensaje útil)
**Mitigación:**
- Solo enviar a usuarios que SE INSCRIBIERON activamente
- No abusar de Marketing posterior
- Monitorear Quality Rating en Meta Business Manager semanalmente

### Riesgo 3: Edge Function falla (timeout, error API)
**Probabilidad:** Media
**Mitigación:**
- Logs en Supabase para diagnóstico
- Retry logic en código (3 intentos con backoff)
- Notificación a admin si falla 5+ veces seguidas
- Fallback: si Edge Function falla, el lead sigue guardado en DB (no se pierde nada)

### Riesgo 4: Excederse del free tier sin planearlo
**Probabilidad:** Baja
**Mitigación:**
- Alertas en Meta Business Manager
- Monitoreo mensual de conversations count
- Si crece rápido: agregar tarjeta a Meta para seguir operando sin corte

### Riesgo 5: Pérdida del Permanent Access Token
**Mitigación:**
- Guardar en password manager principal
- Backup en email seguro
- Token se puede regenerar desde Business Settings si se pierde

---

## 🎁 Casos de uso futuros que esta arquitectura habilita

Una vez Fase 1 esté en producción, podemos agregar fácilmente:

### Inmediato (sin trabajo adicional):
- ✅ Cada lead en `breathwork_leads` tiene su WhatsApp guardado → base de datos para campañas futuras
- ✅ Cuando el usuario responda tu mensaje → se abre ventana de 24h gratis para chatear

### Próximas semanas (1-2 días de trabajo):
- 📊 **Dashboard de leads** con métricas: enviados, entregados, leídos, respondieron
- 📧 **Broadcast manual** desde Supabase: SELECT leads + mandar template Marketing a todos
- 🏷️ **Etiquetado automático** por intent (soltar_estres → "estresados", dormir_mejor → "insomnio", etc.)
- 📅 **Recordatorios automáticos** 24h antes de cada sesión a inscritos confirmados

### Próximos meses (proyecto más grande):
- 🤖 **Bot AI con Claude/GPT** que responde preguntas frecuentes ("¿cuándo es?", "¿precio?", "¿dónde?")
- 🛒 **Embudo de venta automatizado**: lead → bienvenida → recordatorio → confirmación de asistencia → seguimiento post-experiencia
- 💳 **Cobro automático** con Payphone integrado al flujo
- 🧠 **Calificación de leads con AI**: bot evalúa interés y solo manda los hot leads a humano

### Largo plazo (semestre):
- 🌐 **Multi-canal:** mismo backend manda WhatsApp + Email + SMS según preferencia del usuario
- 📱 **App móvil de Amarte** lee misma base de datos → unifica web + app + WhatsApp
- 🔗 **CRM custom en Supabase** que reemplaza HubSpot/Notion → todo bajo tu control

---

## 🚨 Lo que IOMI no debe olvidar

1. **El número que registres en Meta Cloud API ya no se puede usar en WhatsApp normal.** Comprar chip nuevo o asumir que pierdes el WhatsApp normal de ese número.

2. **Templates son la única forma de enviar mensajes Business-Initiated** (sin que usuario haya escrito antes). Pero después de la primera respuesta del usuario, tienes 24h libres para chatear sin templates.

3. **Meta puede bloquear tu número si:**
   - Mucha gente lo bloquea
   - Te reportan como spam
   - Mandas marketing repetitivo sin opt-in claro

4. **Mantén el opt-in visible y honesto.** Si bajo Quality Rating, puedes perder acceso a la API.

5. **El Permanent Access Token NO expira.** Una vez generado, sirve para siempre. Pero si lo pierdes o sospechas filtración, regenerarlo rota la seguridad.

6. **Costos son por CONVERSACIÓN (24h), no por mensaje.** Si en 24h le mandas 10 mensajes al mismo usuario, cuenta como 1 conversación.

---

## 📝 Recordatorios técnicos para Claude (próxima sesión)

Cuando IOMI retome este trabajo, Claude debe:

1. **Verificar MCP Supabase está apuntando a Amarte Inc:**
   - `list_organizations` → confirmar "Amarte Inc" visible
   - Si ve `iomiquantum's Org` → pedir al usuario re-autorizar

2. **Verificar proyecto activo:**
   - `list_projects` → `amarteinc` debe estar `ACTIVE_HEALTHY`
   - Si está pausado por inactividad → unpause

3. **Leer este documento al inicio** para no repetir contexto

4. **Memorias relevantes:**
   - `[[project-amarteinc]]` — visión y estado del proyecto
   - `[[reference-supabase-limits]]` — comportamiento de roles y permisos

5. **Pasos exactos a ejecutar:**
   - Pedir IDs de Meta (Phone Number ID, Business Account ID)
   - NO pedir Access Token aquí — el usuario lo pega directamente en Supabase Secrets
   - Modificar `src/components/LeadForm.tsx` para opt-in
   - Crear Edge Function via MCP `deploy_edge_function`
   - Configurar webhook desde dashboard (Claude guía, usuario hace clicks)
   - Test end-to-end con el número del propio usuario

---

## 🎯 Métricas de éxito (KPIs)

Después de implementar, monitorear:

| Métrica | Target inicial | Target a 3 meses |
|---|---|---|
| Tiempo de entrega WhatsApp post-form | < 60 seg | < 30 seg |
| Tasa de entrega (delivered) | > 95% | > 98% |
| Tasa de lectura (read) | > 60% | > 80% |
| Tasa de click en link al grupo | > 40% | > 60% |
| Conversión form → grupo WhatsApp | ~30% (sin auto) | > 70% (con auto) |
| Quality Rating del número Meta | 🟢 Green | 🟢 Green |
| Errores Edge Function | < 1% | < 0.5% |

---

## 📚 Recursos y documentación oficial

- **Meta for Developers (WhatsApp):** https://developers.facebook.com/docs/whatsapp
- **WhatsApp Cloud API Quickstart:** https://developers.facebook.com/docs/whatsapp/cloud-api/get-started
- **Template guidelines:** https://developers.facebook.com/docs/whatsapp/message-templates/guidelines
- **Pricing detalles:** https://developers.facebook.com/docs/whatsapp/pricing
- **Quality Rating:** https://developers.facebook.com/docs/whatsapp/cloud-api/support/quality
- **Supabase Edge Functions:** https://supabase.com/docs/guides/functions
- **Supabase Database Webhooks:** https://supabase.com/docs/guides/database/webhooks

---

## ✅ Checklist final para mañana

Antes de pedirle a Claude que avance:

**Información que IOMI debe tener lista:**
- [ ] Número WhatsApp confirmado en formato internacional (ej. `593999123456`)
- [ ] Link del grupo de WhatsApp Amarte (https://chat.whatsapp.com/xxxxx)
- [ ] Acceso al chip/dispositivo para recibir SMS de verificación del número
- [ ] Login a Meta Business Manager funcionando

**Decisiones pendientes:**
- [ ] ¿Opt-in con checkbox explícito o solo texto claro? (recomendación: texto claro arriba del botón)
- [ ] ¿Incluir botón en el template o solo link en body? (recomendación: incluir botón, mejor UX)
- [ ] ¿Header con logo o sin header? (recomendación: con logo si lo tienes en JPG/PNG cuadrado)

---

**Documento creado:** 2026-05-21 (al final de la sesión 1)
**Próxima sesión planeada:** cuando IOMI retome con esta info lista
**Owner:** Claude + IOMI

🌿 **Cuando termines mañana, tendrás un sistema que captura leads y los engancha automáticamente — listo para escalar con pauta digital y bot AI.**
