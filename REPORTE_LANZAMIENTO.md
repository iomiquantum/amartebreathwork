# 🚀 AMARTE Breathwork — Reporte de Lanzamiento

> **Fecha:** 2026-05-20
> **Sesión:** Setup inicial completo (Supabase + Vercel + Dominio custom)
> **Estado:** ✅ **EN PRODUCCIÓN**
> **Próximo trabajo:** llenar placeholders y configurar pauta digital

---

## 📊 TL;DR (lo que hay que saber en 30 segundos)

- ✅ **Landing pública:** https://breathwork.amarteinc.com — con SSL automático
- ✅ **Lead capture funcionando** — probado con 1 registro real (Miguel · Quito · "reconectar")
- ✅ **Backend:** Supabase `amarteinc` (proyecto unificado para todo el ecosistema Amarte)
- ✅ **Hosting:** Vercel con auto-deploy desde GitHub `iomiquantum/amartebreathwork`
- ⚠️ **Pendiente:** placeholders críticos (WhatsApp group URL, número, Instagram, email)

---

## 🌐 URLs y accesos rápidos

| Recurso | URL |
|---|---|
| 🟢 **Landing producción** | https://breathwork.amarteinc.com |
| 🟡 Landing fallback (Vercel default) | https://amartebreathwork.vercel.app |
| 📂 Repo GitHub | https://github.com/iomiquantum/amartebreathwork |
| 🚀 Dashboard Vercel | https://vercel.com/dashboard → proyecto `amartebreathwork` |
| 🗄️ Dashboard Supabase | https://supabase.com/dashboard → proyecto `amarteinc` (login con `amarteinc@gmail.com`) |
| 🌍 DNS (name.com) | https://name.com → My Domains → `amarteinc.com` |

---

## 🏗️ Arquitectura final

```
🌐 amarteinc.com (DNS en name.com)
├─ amarteinc.com         → Lovable (sitio principal, no tocar)
├─ www.amarteinc.com     → Lovable
└─ breathwork.amarteinc.com → Vercel ✨ (esta es la nueva)
                              │
                              ▼
                         📦 GitHub: iomiquantum/amartebreathwork
                              │  (auto-deploy en cada push a main)
                              ▼
                         🗄️ Supabase: proyecto "amarteinc"
                              ├─ public.breathwork_leads
                              └─ public.breathwork_subscribers
```

### Decisión arquitectónica clave: proyecto Supabase UNIFICADO

Decidimos llamar al proyecto Supabase **`amarteinc`** (no `amartebreathwork`) para que UN SOLO proyecto cubra TODO el ecosistema futuro:

- 🔵 `breathwork.amarteinc.com` → tablas `breathwork_*`
- 🟢 `app.amarteinc.com` (futuro app de respiración) → tablas `app_*`
- 🟡 `retiros.amarteinc.com` (futuro) → tablas `retiros_*`
- 🟠 `eventos.amarteinc.com` (futuro) → tablas `eventos_*`
- 🔴 Tablas compartidas → `users`, `shared_*` (cross-producto)

**Razón:** un mismo usuario puede inscribirse a breathwork Y luego retiros Y luego usar la app — todo bajo una DB unificada hace más fácil la gestión, analytics cross-producto, login compartido futuro, y ahorra costos (1 proyecto Pro = $25/mes para TODA la marca, no $25 × cada producto).

---

## 💻 Stack técnico

### Frontend (repo `amartebreathwork`)
- **Vite 8** + **React 19** + **TypeScript**
- **Tailwind CSS 3** (paleta esmeralda + dorado + negro cinematográfico)
- **Framer Motion** (animaciones)
- **Lucide React** (íconos)
- **@supabase/supabase-js** (cliente DB)
- **@vercel/analytics** + **@vercel/speed-insights** (instalados, listos)
- **Lazy loading** de 25+ secciones below-the-fold (performance optimizada)

### Backend (Supabase)
- **Postgres 17** (versión `17.6.1.121`)
- **Region:** `sa-east-1` (São Paulo) — más cerca de Ecuador
- **Plan:** Free tier (suficiente para muchos años con uso esperado)
- **RLS:** habilitado en todas las tablas
- **Auto-RLS function:** restringida (solo postgres role puede ejecutarla)

### Hosting (Vercel)
- **Plan:** Hobby (Free)
- **Framework detectado:** Vite (auto)
- **Build command:** `npm run build`
- **Output:** `dist`
- **SSL:** automático via Let's Encrypt
- **CDN:** edge network global de Vercel

---

## 🗄️ Esquema de base de datos

### `public.breathwork_leads`
Leads capturados desde el form de la landing.

| Columna | Tipo | Default | Descripción |
|---|---|---|---|
| `id` | UUID | `gen_random_uuid()` | Primary key |
| `created_at` | TIMESTAMPTZ | `NOW()` | Fecha de creación |
| `name` | TEXT | — | Nombre (no vacío) |
| `whatsapp` | TEXT | — | WhatsApp (no vacío) |
| `city` | TEXT | NULL | Ciudad (opcional) |
| `intent` | TEXT | NULL | Intención: soltar_estres, dormir_mejor, calmar_mente, reconectar, experiencia_diferente, respirar_mejor |
| `source` | TEXT | `'landing'` | Origen del lead |
| `user_agent` | TEXT | NULL | User agent del navegador |

**Índices:**
- `idx_breathwork_leads_whatsapp` (búsqueda rápida + futura prevención de duplicados)
- `idx_breathwork_leads_created_at` (orden cronológico inverso)

**Policies RLS:**
- `breathwork_leads_public_insert` — rol `anon` puede INSERT (necesario para el form público)
- `breathwork_leads_authenticated_select` — rol `authenticated` puede SELECT (tú en el dashboard)

### `public.breathwork_subscribers`
Suscriptores al newsletter (form alternativo en la landing).

| Columna | Tipo | Default | Descripción |
|---|---|---|---|
| `id` | UUID | `gen_random_uuid()` | Primary key |
| `created_at` | TIMESTAMPTZ | `NOW()` | Fecha de creación |
| `email` | TEXT | — | Email único |
| `source` | TEXT | `'landing'` | Origen |

**Policies RLS:** mismo patrón que `breathwork_leads`.

---

## 🔐 Credenciales y secretos

### Variables de entorno en Vercel
Configuradas en Vercel project → Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://ajhajtousbarhsfugxbo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi... (la anon key pública)
```

> ⚠️ La `anon key` es **pública** (se sirve al navegador). NO es un secreto. La seguridad de los datos depende de RLS.

### Credenciales que SÍ son secretas (NO compartir)
- 🔑 **Database password Postgres** — generada al crear el proyecto. Solo se usa si te conectas con un cliente Postgres directo (pgAdmin/DBeaver). **Guardada por el usuario en su password manager.**
- 🔑 **Service role key** — NO la usamos en este proyecto. Disponible en Supabase → Settings → API si la necesitas para Edge Functions o admin tasks.

### Cuentas y owners
- 📧 **Supabase project owner:** `amarteinc@gmail.com`
- 📧 **GitHub owner:** `iomiquantum` (cuenta principal de `miguelvalencia0531@gmail.com`)
- 📧 **Vercel owner:** cuenta principal del usuario (`miguelvalencia0531@gmail.com`)
- 📧 **name.com owner:** cuenta del usuario (donde está registrado `amarteinc.com`)

---

## 🤖 Conexión MCP de Claude

Claude está conectado vía MCP de Supabase al proyecto `amarteinc` (org `Amarte Inc`).

**Limitación importante:** el MCP de Supabase de Claude solo permite **UNA org por conexión**. Mientras está apuntando a `Amarte Inc`, NO ve los proyectos de la org `iomiquantum's Org` (Silent Run, Colección Sagrada). Para trabajar en esos otros proyectos, hay que re-autorizar el MCP en `claude.ai → Settings → Connectors → Supabase` y elegir la otra org.

**Cuando regreses a trabajar Amarte:** verifica que el MCP esté apuntando a `Amarte Inc` (Claude puede chequear con `list_organizations`).

---

## ✅ Lo que hicimos HOY (cronología)

1. **Diagnóstico inicial:** decidimos subdominio + Vercel + Supabase como stack
2. **Decisión estratégica:** cuentas Supabase separadas por marca (no mezclar con Silent Run / Colección)
3. **Cross-account membership:** invitamos a `miguelvalencia0531` como Administrator a Amarte Inc → bloqueó creación de proyectos free por límite heredado
4. **Cambio de rol a Developer:** liberó el bloqueo pero perdió permisos para autorizar MCP
5. **Re-autorización MCP desde `amarteinc@gmail.com`:** funcionó (es Owner real)
6. **Proyecto Supabase creado:** `amarteinc` en region São Paulo, con `Enable automatic RLS` y `Data API` habilitados
7. **Migración 1:** Creación de `breathwork_leads` (primera versión, con columnas en español — INCORRECTA)
8. **Bug detectado:** el código del repo apunta a `public.leads`, mi tabla era `public.breathwork_leads` con columnas en español que no coincidían
9. **Migración 2:** DROP + recreación de `breathwork_leads` con schema correcto (`name`, `whatsapp`, `city`, `intent`, `source`, `user_agent`) + creación de `breathwork_subscribers`
10. **Bug 2 detectado:** "permission denied for table" porque desmarcamos `Automatically expose new tables` al crear el proyecto (por buenas prácticas de seguridad)
11. **Migración 3:** GRANTs explícitos a `anon` (INSERT) y `authenticated` (SELECT) en ambas tablas
12. **Code fix:** actualizamos `src/lib/supabase.ts` para apuntar a `breathwork_leads` y `breathwork_subscribers` en lugar de `leads` y `subscribers`
13. **Push a GitHub:** commit `b392e3f` — Vercel auto-deploy
14. **Test exitoso:** lead Miguel registrado correctamente en la DB
15. **Dominio custom:** agregamos `breathwork.amarteinc.com` en Vercel → obtuvimos CNAME → creamos registro en name.com → propagación inmediata
16. **SSL automático:** Vercel emitió certificado en minutos
17. **Verificación final:** HTTPS funcional, HSTS, redirect HTTP→HTTPS, HTTP/2

---

## 🐛 Issues encontrados y resueltos

| # | Issue | Fix |
|---|---|---|
| 1 | Tabla `leads` no existía (código apuntaba ahí) | DROP + recreación como `breathwork_leads` con schema correcto |
| 2 | Columnas en español (`nombre`) vs código en inglés (`name`) | Recreación con columnas en inglés |
| 3 | Columnas faltantes (`city`, `intent`, `user_agent`) | Agregadas en migración 2 |
| 4 | `permission denied for table breathwork_leads` | GRANTs explícitos en migración 3 (porque desmarcamos auto-expose) |
| 5 | MCP no veía Amarte org (membresía cruzada no sirve para MCP) | Re-autorización del MCP desde `amarteinc@gmail.com` |
| 6 | Bloqueo de creación de proyectos free al ser Administrator | Cambio de rol a Developer |

---

## ⚠️ Pendientes (en orden de prioridad)

### 🔴 CRÍTICOS antes de hacer marketing/pauta

Editar `src/data/siteConfig.ts`:

1. **`whatsappGroupUrl`** (línea 24) — actualmente `"https://chat.whatsapp.com/REEMPLAZAR_AQUI"` → reemplazar con link real del grupo de WhatsApp cuando lo crees
2. **`whatsappMessageUrl`** (línea 25) — número placeholder `593XXXXXXXXX` → reemplazar con número WhatsApp real (ej. `593999943636`)

### 🟠 IMPORTANTES (afectan UX/profesionalismo)

3. **`contactEmail`** (línea ~85) — `"TODO_EMAIL"` → cambiar a email real (sugerido: `hola@amarteinc.com` o similar)
4. **`instagram`** (línea ~86) — `"TODO_IG"` → tu @ de Instagram
5. **`instagramUrl`** (línea ~87) — `"TODO_IG_URL"` → link completo a Instagram
6. **`siteUrl`** (línea ~92) — `"TODO_URL"` → cambiar a `https://breathwork.amarteinc.com` (importante para SEO/sharing)

### 🟡 CONTENIDO (cuando definas calendario)

7. **`nextDateISO`** (línea ~38) — `""` → formato ISO de la primera fecha (ej. `"2026-06-26T19:30:00-05:00"`)
8. **`upcomingSessions`** (línea ~42) — array vacío → llenar con 2-3 próximas sesiones

### 🟢 PAUTA DIGITAL (cuando inicies campañas)

9. **Meta Pixel** — `index.html` línea ~62: está comentado el snippet. Cuando tengas el Pixel ID de Facebook Business, descomentar y reemplazar `YOUR_PIXEL_ID`. **Crítico antes de pautar en Meta Ads.**
10. **Google Analytics 4** — no instalado. Si quieres tracking adicional, agregar GA4 script.
11. **TikTok Pixel** — no instalado. Si vas a pautar en TikTok, agregar.

### 🔵 LIMPIEZA (cosmético)

12. **Eliminar org duplicada en Supabase** — quedaron dos orgs en `amarteinc@gmail.com`: "Amarte" + "Amarte Inc". Mantener "Amarte Inc" (donde está el proyecto). Eliminar "Amarte" (vacía):
    - Login con `amarteinc@gmail.com`
    - Seleccionar org "Amarte"
    - Settings → General → scroll abajo → Delete organization

---

## 📅 Para MAÑANA — plan sugerido

### Opción A: Activar para marketing (1-2 horas)
1. Crear grupo de WhatsApp y obtener link de invitación
2. Pasar a Claude los datos de los placeholders → arreglar en 5 min
3. Probar end-to-end: registro → mensaje "Gracias" → click "Entrar al grupo" → llega al grupo
4. Si todo OK, considerar lanzar campaña Meta Ads

### Opción B: Empezar la app móvil (si quieres avanzar Amarte como app)
1. Decidir stack móvil: React Native + Expo (recomendado para reusar código) vs nativo (Swift/Kotlin)
2. Crear nuevo repo `amarteinc-app` (o similar)
3. Setup proyecto Expo + conectarlo al MISMO Supabase `amarteinc` (con sus propias tablas `app_*`)
4. Estructura inicial: login con email + número, perfil de usuario, biblioteca de audios

### Opción C: Pulir y testear más (1-2 horas)
1. Test exhaustivo en mobile (iPhone + Android)
2. Verificar todos los CTAs (botones que abren WhatsApp)
3. Test cookie banner, exit intent, newsletter
4. Speed test con Lighthouse → optimizar si <90 score

### Opción D: Crear página admin para ver leads
1. Página `/admin` en el repo amartebreathwork
2. Autenticación simple (magic link de Supabase)
3. Tabla con leads + exportar CSV
4. Filtros por fecha, ciudad, intención

---

## 🔧 Comandos útiles para referencia

### Desarrollo local
```bash
cd amartebreathwork
npm install
npm run dev          # → http://localhost:5173
npm run build        # → /dist
npm run preview      # → sirve /dist localmente
```

### Variables de entorno locales
Crear `.env.local`:
```
VITE_SUPABASE_URL=https://ajhajtousbarhsfugxbo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc... (la real)
```

### Ver leads desde Supabase dashboard
1. Login con `amarteinc@gmail.com`
2. Proyecto `amarteinc` → Table Editor → `breathwork_leads`
3. O usar SQL Editor: `SELECT * FROM breathwork_leads ORDER BY created_at DESC LIMIT 100;`

### Verificar DNS / dominio
```bash
dig +short breathwork.amarteinc.com CNAME
# Debe responder: e92efb80f6c910d4.vercel-dns-017.com
```

---

## 📚 Recursos / Docs útiles

- **Supabase docs:** https://supabase.com/docs
- **Vercel docs:** https://vercel.com/docs
- **Vite docs:** https://vitejs.dev/guide/
- **Tailwind v3 docs:** https://tailwindcss.com/docs
- **Supabase JS SDK:** https://supabase.com/docs/reference/javascript
- **Limits del Free plan Supabase:** https://supabase.com/docs/guides/platform/billing-faq

---

## 🎯 Métricas del lanzamiento

- **Tiempo total de setup:** ~3 horas
- **Migraciones SQL aplicadas:** 4
- **Commits al repo (hoy):** 1
- **Bugs encontrados y fixed:** 6
- **Reconexiones MCP:** 1
- **Costo:** **$0/mes** (todo en planes Free)

---

## 💡 Lecciones aprendidas

1. **Supabase Free aplica el límite de 2 proyectos POR USUARIO** (admin/owner), no por organización. Y una org HEREDA el límite agotado de cualquier admin/owner invitado.
2. **El rol "Developer" en Supabase NO afecta el límite free** y puede hacer casi todo (tablas, RLS, SQL) excepto crear nuevos proyectos.
3. **El MCP de Supabase de Claude es 1-org-por-conexión.** Cambiar de org requiere re-autorizar en Claude Settings.
4. **Desmarcar "Automatically expose new tables" requiere GRANTs explícitos.** RLS sola no es suficiente — la tabla necesita GRANTs base al rol anon/authenticated.
5. **DNS de name.com propagó en segundos** (no 24-48 hs como advierten). Vercel emitió SSL en 2-5 min.

---

## 🤖 Para Claude (próxima sesión)

Cuando IOMI regrese a trabajar este proyecto:

1. **Verificar MCP:** llamar `list_organizations` — debe ver "Amarte Inc". Si no, indicar al usuario re-autorizar.
2. **Verificar estado:** llamar `list_projects` → verificar `amarteinc` está `ACTIVE_HEALTHY`. Si pausó (1 semana sin actividad), pedir al usuario reactivar.
3. **Revisar este reporte primero** para no repetir contexto.
4. **Memorias relevantes activas:**
   - `[[project-amarteinc]]` — visión y stack
   - `[[reference-supabase-limits]]` — todas las lecciones sobre límites de Supabase
   - `[[feedback-supabase-separation]]` — preferencia de cuentas separadas por marca

---

**Documento generado por Claude el 2026-05-20 al final de la sesión de lanzamiento.**
**Para actualizar: editar este archivo y commit a `main`. Vercel no re-deploya (solo es markdown).**
