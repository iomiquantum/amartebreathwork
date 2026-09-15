# Implementación de seguridad — AMARTE

Documento de continuidad para retomar mañana con Muse Code. Fecha: 2026-09-15.

## Estado actual

La auditoría y las defensas nuevas están preparadas **solo en local**. No se ha hecho commit, push, despliegue ni ejecución de migraciones en Supabase.

Proyectos involucrados:

- `AMARTEBREATHWORK` — sitio Vite, API `/api/forms`, panel admin y Supabase principal.
- `AMARTE BE ON 2026/amarte-be-on-web` — sitio Next.js y Server Action de comunidad.
- `ICE-RESET-INMERSIVO` y `PLANT-SOUND-IMMERSION` — sitios Vite y builds embebidos en Breathwork.

Pruebas locales realizadas:

- Breathwork: `npm run build` correcto.
- Be On: `npm run build` correcto con Next 16.3.5.
- ICE y Plant: builds correctos al sincronizar los embeds.
- Seguridad: 14 pruebas, 14 correctas, 0 fallos.
- Las pruebas cubren manipulación de campos, límites, Turnstile falso o repetido, RLS, MFA/AAL2, reservas, backups, CSV y límites HTTP.

## Riesgos que se corrigieron en código

1. Formularios que podían depender solo del honeypot o del navegador.
2. Rate limit en memoria que se perdía entre instancias serverless.
3. Usuarios autenticados con posibilidad de consultar o modificar tablas sensibles si las políticas eran permisivas.
4. Reservas que podían enviar desde el cliente precio, moneda o estado de pago manipulados.
5. Exportación CSV susceptible a fórmulas al abrirse en Excel o Sheets.
6. Backups sujetos al límite de paginación de Supabase.
7. Panel admin sin requisito de segundo factor en la capa de base de datos.
8. Dependencias con avisos de seguridad, incluyendo una versión vulnerable de Next.
9. Service Worker que podía cachear rutas que deben permanecer siempre frescas.
10. HTML de emails sin escape suficiente para variables controladas por usuarios.

## Archivos principales preparados

- `server/form-security.mjs`: validación común, Turnstile, cuotas, origen e IP.
- `api/forms.mjs`: endpoint seguro de formularios en Breathwork.
- `src/lib/secureForms.ts` y `src/lib/turnstile.ts`: cliente del endpoint y verificación visual.
- `supabase/migrations/20260915010000_form_security.sql`: cuotas, RLS, admin y MFA.
- `tests/security/forms.test.mjs` y `tests/security/database.test.mjs`: pruebas automatizadas.
- `src/components/AdminMfa.tsx`: segundo factor TOTP para el admin.
- `scripts/sync-security.mjs`: evita divergencia entre la copia canónica y Be On/ICE.
- `src/lib/csv.ts`: escape contra CSV injection.
- `public/sw.js`: exclusión de rutas sensibles del cache.

## Orden de implementación para mañana

### Fase 0 — Respaldo y revisión

1. Abrir los cuatro proyectos y confirmar el `git status`.
2. Crear una copia local o rama de respaldo antes de tocar el árbol actual.
3. Revisar el diff de seguridad por archivo.
4. No usar `git reset --hard`, checkout destructivo ni limpiar archivos sin identificar.
5. Confirmar que las modificaciones previas de Muse forman parte del mismo árbol y no se sobrescriben.

### Fase 1 — Cuentas y secretos

Crear en Cloudflare Turnstile un sitio para cada origen que envíe formularios. No pegar secretos en el repositorio.

Variables necesarias en Vercel y en el entorno local:

```text
VITE_TURNSTILE_SITE_KEY=clave_publica
TURNSTILE_SECRET_KEY=clave_privada
TURNSTILE_HOSTNAMES=breathwork.amarteinc.com,amarte-be-on-web.vercel.app
RATE_LIMIT_SECRET=secreto_aleatorio_de_al_menos_32_caracteres
FORM_ALLOWED_ORIGINS=https://breathwork.amarteinc.com,https://amarte-be-on-web.vercel.app
NEXT_PUBLIC_TURNSTILE_SITE_KEY=clave_publica
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Requisitos:

- Rotar cualquier secreto que haya sido expuesto fuera del gestor de variables.
- Confirmar que la service role key solo exista en Vercel/Edge/server y nunca en `VITE_*` ni `NEXT_PUBLIC_*`.
- Configurar los dominios de producción y preview de forma deliberada; no permitir `*`.
- Activar MFA en la cuenta de Supabase, Vercel, GitHub y Cloudflare.

### Fase 2 — Base de datos Supabase

1. Hacer un backup/exportación manual antes de migrar.
2. Revisar nombres reales de tablas, columnas y usuarios en producción.
3. Ejecutar `supabase/migrations/20260915010000_form_security.sql` en el proyecto Breathwork.
4. Ejecutar la migración equivalente de Be On en su proyecto Supabase, si utiliza una base separada.
5. Confirmar que `amarte_private.form_quotas` y `amarte_private.admin_users` no sean accesibles para `anon` ni `authenticated`.
6. Confirmar que `consume_form_quota` solo tenga `EXECUTE` para `service_role`.
7. Confirmar que las tablas de leads no tengan policies antiguas permisivas (`USING (true)` o `WITH CHECK (true)`).
8. Confirmar que el bucket `backups` sea privado y que solo `service_role` pueda operar sobre él.
9. Registrar los usuarios admin reales en `amarte_private.admin_users` por UUID, no solo por email.
10. Activar TOTP/MFA en Supabase Auth y completar el enrolamiento de cada administrador.

La política del panel exige `aal2`: tener solo el magic link ya no basta para leer o cambiar datos.

### Fase 3 — Formularios y cliente

1. Ejecutar `node scripts/sync-security.mjs --check`.
2. Confirmar que los formularios de Breathwork llamen a `/api/forms`.
3. Confirmar que Be On use la Server Action protegida.
4. Configurar el endpoint de formularios para ICE/Plant cuando se conecten formularios reales.
5. Confirmar que el valor de Turnstile se consuma una sola vez y expire correctamente.
6. Probar éxito, error de base, límite, token falso, token repetido y origen no permitido.
7. Confirmar que ningún mensaje de error devuelva SQL, tokens, IP, PII o secretos.

### Fase 4 — Pruebas de publicación

Ejecutar, en este orden:

```bash
node --test tests/security/*.test.mjs
npm run build
npm test
npm audit
node scripts/sync-security.mjs --check
```

Para Be On:

```bash
npm run build
npm audit
```

Para ICE y Plant:

```bash
npm run build
npm audit
```

Después del despliegue, probar desde un navegador real:

- Formulario válido.
- Campo obligatorio omitido.
- Honeypot lleno.
- Turnstile cancelado.
- Token Turnstile reutilizado.
- Más de 20 intentos por IP en 10 minutos.
- Más de 5 envíos por contacto en una hora.
- Reserva con precio manipulado en DevTools.
- Acceso admin sin MFA y con MFA.
- Usuario autenticado que no pertenece a `admin_users`.
- Exportación CSV con nombres que comienzan por `=`, `+`, `-` y `@`.

### Fase 5 — Observación y cierre

Durante las primeras 24–48 horas revisar:

- Logs de Vercel sin PII ni tokens.
- Errores 401, 403, 409, 429 y 503.
- Tasa de falsos positivos de Turnstile.
- Cuotas acumuladas en `amarte_private.form_quotas`.
- Backups completos y restaurables.
- Que `/admin`, `/api`, `/be-on`, `/comunidad`, `/respira` y `/gracias` no sean servidos desde el cache del Service Worker.

## Pendientes que todavía faltan

Estos puntos no deben declararse resueltos hasta verificarlos:

1. Ejecutar la migración en producción y comprobar sus permisos con consultas de auditoría.
2. Crear y configurar las claves Turnstile reales.
3. Activar MFA en cada cuenta admin y guardar los códigos de recuperación en un gestor seguro.
4. Confirmar que el plan de Supabase/Vercel permita las funciones y cuotas previstas.
5. Configurar WAF/rate limiting de Vercel o Cloudflare como segunda barrera de red.
6. Configurar alertas de caída, picos de 429/503 y consumo de Supabase.
7. Probar restauración real de un backup, no solo su creación.
8. Revisar retención y eliminación de PII con el responsable legal de AMARTE.
9. Revisar SPF, DKIM y DMARC del dominio de correo para evitar suplantación.
10. Revisar dependencias en CI y activar Dependabot/Renovate con actualización controlada.
11. Añadir revisión de secretos con `gitleaks` o equivalente antes de cada push.
12. Hacer una prueba externa de cabeceras y TLS después del deploy.
13. Confirmar que los formularios de ICE y Plant no prometan persistencia si todavía solo guardan datos localmente.
14. Crear un procedimiento de respuesta: congelar deploy, revocar claves, revisar logs, restaurar backup y notificar si hubiera una filtración.

## Reversión

Si un formulario falla tras el despliegue:

1. Desactivar temporalmente el CTA o el endpoint mediante Vercel, sin borrar datos.
2. Mantener las tablas y backups intactos.
3. Revisar primero variables, Turnstile, grants y logs sanitizados.
4. Revertir el deployment desde Vercel al último deployment conocido, sin eliminar la migración.
5. Si la migración produjo un problema, restaurar desde el backup y corregirla en una nueva migración; no editar una migración ya aplicada.

## Regla de cierre

No hacer commit ni push hasta que:

- los builds estén verdes,
- las 14 pruebas de seguridad sigan pasando,
- la migración haya sido revisada y aplicada en el proyecto correcto,
- Turnstile y MFA hayan sido probados con credenciales reales,
- exista un backup verificable,
- y el dueño haya revisado el flujo visible de formularios y admin.

