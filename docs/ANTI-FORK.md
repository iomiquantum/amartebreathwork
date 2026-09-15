# ANTI-FORK — Inventario de duplicación y plan de convergencia

Fase 2, tareas 2.4 + 2.5. Fecha: 2026-09-14. Sin commit/push (regla del plan).
Canónico: `AMARTEBREATHWORK` (BW). Repos satélite: `ICE-RESET-INMERSIVO` (ICE),
`PLANT-SOUND-IMMERSION` (PLANT).

## 1. Qué se hizo en este paso (seguro, sin extraer paquetes)

- **Tracking único (2.4):** BW `src/lib/tracking.ts` es el canónico y NO se tocó.
  ICE y PLANT `src/lib/tracking.ts` son copias vendored de la misma lógica con
  SOLO 3 adaptaciones por repo: clave de consentimiento propia, evento de
  consentimiento propio y `initPixelsFromConfig()` local (sus repos no tienen
  `lib/pixels.ts`). Incluyen el sanitizador PII de Fase 0 (`LeadMarketingSignal`:
  solo `source`/`method` llegan a vendors; `name`/`whatsapp`/`city`/`intent` se
  descartan). **0 `console.log("[track]")` en prod** (antes: ICE 13, PLANT 6, BW 0).
- **Utils compartidos por reexport diferido (2.5):** ICE y PLANT `src/lib/utils.ts`
  son idénticos entre sí (md5 `cef4e8c8e95d`) y exponen la misma firma canónica
  `cn` (compatible clsx: strings, arrays, objetos) + `scrollToId` con offset
  `-24px`. Subset sin dependencias porque `clsx`/`tailwind-merge` no están en sus
  `package.json` (fuera de alcance). El reexport real (`@amarte/ui-landing`) queda
  como plan §3: extraerlo ahora rompería builds (deps + paths `@/` distintos).
- **Configs con misma riqueza (2.4):** ICE y PLANT `src/data/siteConfig.ts` suman
  bloques `metaPixelId/gaMeasurementId/tiktokPixelId/clarityProjectId` (`""` =
  no cargan nada), `seoTitle/seoDescription/siteUrl`, contacto/redes placeholder,
  `newsletter`, `gallery`, `press`; PLANT además `testimonials`,
  `upcomingSessions`, CTAs extendidos. Ningún valor real/PII: todo `""`/vacío
  hasta que el dueño lo llene. No se renombró ningún campo usado por componentes
  (`nextEventISO` ICE, `microcopyHero` PLANT, etc. se mantienen; renombrar
  exigiría tocar componentes = fuera de alcance, ver §3).

## 2. Inventario md5 de duplicados (12 primeros dígitos)

18 componentes con el mismo basename en los 3 repos, los 3 divergentes (0 %
idénticos byte a byte = fork confirmado). Más 3 archivos base (`lib/tracking.ts`,
`lib/utils.ts`, `data/siteConfig.ts`) = 21 lógicos. (El plan hablaba de 17; la
medición real da 18 componentes + 3 base.)

| Archivo | BW | ICE | PLANT |
|---|---|---|---|
| BenefitsSection.tsx | cf5fb63a385f | 8da062a2bbd5 | 63bf347f6d26 |
| CinematicQuote.tsx | 49ea44342fed | fba6bee6cb36 | b6f4ce20b183 |
| Differentiators.tsx | a5fa3dbaafac | 825a20c1dc6c | 60c60fa16f59 |
| EventFormat.tsx | b2cb96c393f2 | 6bde208f3c5e | 7b3f5a0860b3 |
| ExperienceSection.tsx | 7c7cdcceb888 | 9a883a0b1be6 | 1ad9ae06277b |
| FAQ.tsx | 0dd62b89e998 | 0626bd8be842 | aed7f554e6b8 |
| FinalCTA.tsx | c8536274d272 | 9842baccb5fc | 9574b2c7375d |
| FloatingWhatsappButton.tsx | 676bcaeebcaa | b7d8c2dedf3b | e7802f04a252 |
| Footer.tsx | 290649fb0109 | f8ba761bdc17 | 29e1b72d19ac |
| ForWhoSection.tsx | 4048d829d690 | 49d1c85d1a25 | 7c85a9b6691d |
| Hero.tsx | e6b7353e68fa | 6fa234bc3e78 | 9246386366c7 |
| HowItWorks.tsx | c0bdd94b502d | 38613bd43199 | 2bb7d4d098c0 |
| IncludesSection.tsx | ee9e3c8e9db3 | 0648399cce4b | 9c46353352bb |
| ProblemSection.tsx | be5ad8467978 | 47e0eb5bb7f1 | 3dd042096282 |
| ResponsibleNotice.tsx | 8b7ed3b5fb93 | 10cdabcf736e | 6bfc84ddcc67 |
| SectionHeader.tsx | 639d21a1f29e | f0ef6ec16f92 | 2b1094f6a9ae |
| TrustBar.tsx | eb27ebdf24ec | a1ae4e05136a | 95b403294ed3 |
| WhatsappCommunity.tsx | ee2c0c3574e2 | 9a0400d12256 | 30f5afd9f87b |
| lib/tracking.ts | 66c5c54e156c | cead8c20ec08 | bce0efbdf984 |
| lib/utils.ts | 219dd9ffd631 | cef4e8c8e95d | cef4e8c8e95d |
| data/siteConfig.ts | fdbcd81eec07 | 53361fa34503 | 63431b657dc0 |

Notas: `lib/utils.ts` ICE ≡ PLANT (mismo md5) tras este paso. BW difiere por
`clsx`/`tailwind-merge`. Los `tracking.ts` satélite difieren del canónico SOLO en
consent-keys/eventos/`initPixelsFromConfig` (auditable por diff).

## 3. Plan del resto (NO ejecutado: riesgoso en este paso)

1. **`packages/ui-landing` (extracción completa):** NO extraído — riesgoso porque
   los 18 componentes tienen copy/estructura divergente por marca (no son
   idénticos, ver md5), los paths `@/` solo existen en PLANT, y mover imports
   rompería ~60 archivos fuera de alcance. Pasos: (a) parametrizar por
   `siteConfig` + `children`/props de marca; (b) publicar interno vía workspaces
   npm o `tsconfig paths`; (c) migrar repo por repo con builds verdes.
2. **Reexport real:** cuando exista el paquete, `ICE/PLANT src/lib/tracking.ts`
   → `export * from "@amarte/ui-landing/tracking"` + `CONSENT_STORAGE_KEY` por
   parámetro; igual para `utils.ts`.
3. **Renombres de config pendientes:** `nextEventISO` (ICE) ↔ `nextDateISO` (BW),
   `upcomingDates` (ICE) ↔ `upcomingSessions` (BW), `microcopyHero/Exit` (PLANT)
   ↔ `ctaMicrocopy` (BW). Requieren tocar componentes: fuera de alcance aquí.
4. **PLANT sin banner de consentimiento:** su tracking queda en no-op hasta crear
   `CookieConsent.tsx` que escriba `plant-sound-consent=accepted` y despache
   `plant-sound-consent-changed` (hoy ningún vendor dispara en PLANT).

## 4. Verificación de este paso

- `npm run build` verde en los 3 repos (tsc + vite).
- `grep -rn '[track]' src` → 0 en los 3 (antes 0/13/6).
- `grep -rn '[track]' dist/assets/*.js` → 0 en los 3 (R3).
- Harness Node 24 `strip-types` sobre los 3 `tracking.ts`: consent/DNT/PII (R2/R3).
