# Historial de trabajo — sesión AMARTE (10-sep-2026)

Documento vivo: registra TODO lo hecho en esta sesión para no perder contexto.
Última actualización: cierre de Fase 1 del PLAN-MAESTRO.

## 1. Estado actual (una mirada)

- **En vivo y verificado:** `https://breathwork.amarteinc.com/` + `/presentaciones`,
  `/corporativo`, `/jovenes`, `/mujeres`, `/hombres`, `/proceso`, `/sobre-amarte`,
  `/ice/`, `/plant/`, `/be-on`, `/be-on/comunidad` (deploy `b30d631`, ● Ready).
- **Sin commitear:** oleada GEO (llms/JSON-LD ICE-PLANT-BEON) + PLAN-MAESTRO
  Fase 0 (PASS verificado a mano) + Fase 1 (PASS según verificación).
- **Regla vigente del dueño:** nada se commitea/pushea ni se publica sin su OK
  explícito. Excepción ya autorizada: este documento (`docs/`) sí se sube a git.

## 2. Línea de tiempo de la sesión

1. **Hub `/presentaciones`** (commit `cd850e7`): página índice con 8 tarjetas
   (5 verticales + ICE/Plant/Be On). Links iniciales a `localhost` (bug).
2. **Popup de salida eliminado** de todas las presentaciones (mismo commit;
   `ExitIntent` desactivado en `App.tsx`, componente conservado sin uso).
3. **Saga de deploy Vercel** (resuelta): pushes atorados en `UNKNOWN`/`Blocked`.
   Causas reales encontradas, en orden: (a) commits firmados con email del Mac
   (`contacto@impulsar.corp`) no matcheado en GitHub; (b) repo privado + plan
   Hobby sin colaboración (bloqueo "contributing access"). Fixes: identidad git
   `iomiquantum <miguelvalencia0531@gmail.com>` (repo + global) y ciclo
   público → deploy → privado. Receta guardada en §6.
4. **Subrutas en vivo** (`ed9c2c8` + `7780a67`): `/ice` y `/plant` embebidos como
   estáticos (rebuild con `--base`), `/be-on` por proxy al backend
   `amarte-be-on-web.vercel.app` (strip-prefix + rutas + `_next`; BEON sin
   basePath por revert `a014271`). `vercel.json` con rewrites + `verify-subpaths`.
5. **Oleadas 1 y 2 de optimización** (commit `b30d631`, deploy verificado):
   fuentes únicas, OG/canonical absolutas, Supabase lazy, AVIF/WebP + hero
   prioritario, meta por ruta (`PageMeta`), trackers diferidos, sitemap 8 URLs,
   textos mínimos legibles + targets amplios, prerender de meta post-build.
6. **Página `/proyecto`**: creada, rechazada por el dueño (básica, sin
   estructura) → **ELIMINADA por completo** (código, plan y sitemap revertidos,
   build limpio). No reintentarla sin nuevo plan aprobado.
7. **Oleada GEO** (sin commit): `llms.txt` + JSON-LD en ICE/PLANT/BEON. Sin datos
   inventados (grep: 0 fechas/direcciones/precios/teléfonos).
8. **PLAN-MAESTRO** (`docs/PLAN-MAESTRO.md`, 4 secciones, 8 auditorías):
   Top 10 + fases 0–4 + paralelo/secuencial + riesgos. P0 estrella: BEON perdía
   leads en silencio (`supabase.ts:31-33` + `lead.ts:65-77`) + PII en logs.
9. **Fase 0 ejecutada y verificada a mano** (sin commit): 0.1–0.5 PASS —
   error sin redirect falso, PII fuera de píxeles/logs, gate de consent en ICE.
10. **Fase 1 ejecutada** (sin commit, verificación PASS): 1.1–1.6 — canonical+OG
    BEON, headers/CSP, sitemap 11 URLs, legales ICE/PLANT + allowlist `source`.

## 3. Mapa de repos y commits (esta sesión)

Breathwork (`iomiquantum/amartebreathwork`, rama `main`, repo hoy PRIVADO):
- `cd850e7` hub + sin popup · `e2e6f13` sitemap · `ed9c2c8` embeds+proxy ·
  `7780a67` proxy sin prefijo · `43bbce6` .gitignore · `b30d631` oleadas 1+2.
- Remoto al día hasta `b30d631`. Sin commitear: GEO + Fase 0 + Fase 1
  (~25 rutas BW + embeds + BEON aparte).

BEON (`iomiquantum/amarte-be-on-web`, PRIVADO, deploy propio en Vercel):
- `f3bda9a` basePath (luego revertido `a014271`; NO usar basePath).
- Sin commitear: JsonLd + `llms.txt` (GEO) + Fase 0 (lead) + Fase 1
  (canonical/OG/headers/allowlist).

ICE y PLANT: SIN git (solo `dist/` local). Riesgo registrado (PLAN-MAESTRO 4.1).

## 4. Lo publicado en vivo (verificado por contenido, no por status)

Deploy `b30d631` ● Ready: hash nuevo, título prerenderizado
"Presentaciones — AMARTE" en shell, títulos ICE/PLANT/BEON reales,
`/llms.txt` y OGs en 200. Pendiente de publicar: GEO + Fases 0–1
(requieren ciclo público → deploy → privado).

## 5. Lecciones operativas (no perder)

- Vercel Hobby + repo privado + autor no-matcheado = deployments `Blocked`.
  Fix: `git config user.email` = email de GitHub + repo público temporal.
- `vercel ls/inspect/logs` con CLI logueado; `vercel whoami` puede mostrar un
  usuario y el deploy correr con otra identidad: ante duda, `vercel logout` +
  `login` con la cuenta dueña y `vercel teams ls` (✔ = miembro).
- Los 200 de Vercel engañan (fallback SPA): verificar siempre por CONTENIDO
  (títulos, hashes de chunk, sitemap).
- `gh repo edit --visibility public|private --accept-visibility-change-consequences`.
- Auditoría pre-publicar: `git grep -E "eyJ|sb_secret|service_role.*key"` sin valores.

## 6. Pendiente (orden)

1. Fases 0–4: TODAS terminadas con PASS (23/23). Verificado a mano lo crítico:
   leads sin éxito falso, PII fuera de píxeles/logs, consent ICE, sync
   reproducible, `npm test` verde, CSP documentada.
2. Decisión de publicación (ciclo público/deploy/privado) de GEO + Fases 0–4.
3. Publicar oleada GEO + Fases (mismo ciclo).
4. BEON: commit/push propio + su deploy (repo privado → mismo muro Hobby).
5. Datos reales de negocio para schemas (fechas/lugar/precio ICE-PLANT,
   WhatsApp ICE, próxima charla Be On) + validación legal LOPDP.
6. ICE/PLANT a git + `sync:embeds` + harness (Fase 4).
