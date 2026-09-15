// Canonical server module. Copies in Be On are checked by scripts/sync-security.mjs.
import { createHmac, randomUUID } from 'node:crypto';
import { isIP } from 'node:net';

export class SubmissionError extends Error {
  constructor(status, code) { super(code); this.status = status; this.code = code; }
}
const fail = (status, code) => { throw new SubmissionError(status, code); };
const common = {
  city: 'text:80', user_agent: 'text:255', utm_source: 'text:150',
  utm_medium: 'text:150', utm_campaign: 'text:150', honeypot_value: 'text:200',
};
const country = { country_code: 'text:5', country_name: 'text:80' };
const person = { name: '!text:100', whatsapp: '!phone', email: 'email' };
export const FORM_SCHEMAS = {
  lead: { table: 'breathwork_leads', fields: { ...common, ...country, ...person,
    intent: 'enum:soltar_estres,dormir_mejor,calmar_mente,reconectar,experiencia_diferente,respirar_mejor', source: 'text:80' } },
  newsletter: { table: 'breathwork_subscribers', fields: { email: '!email', source: 'enum:landing,ice' } },
  reservation: { table: 'breathwork_reservations', fields: { ...common, ...country, ...person,
    email: '!email', event_id: '!uuid', payment_method: '!enum:transferencia,efectivo,payphone' } },
  corporate: { table: 'breathwork_corporate_inquiries', fields: { ...common,
    contact_name: '!text:100', contact_email: '!email', contact_role: 'text:100', contact_whatsapp: 'phone',
    contact_country_code: 'text:5', company_name: '!text:150', company_size: 'text:80', industry: 'text:100',
    format: 'enum:presencial,online,hibrido,no_definido', estimated_date: 'date', estimated_people: 'int:100000',
    primary_goal: 'text:500', message: 'text:2000' } },
  gender: { table: 'breathwork_gender_inquiries', fields: { ...common, ...country, ...person,
    audience: '!enum:men,women,other', age_range: 'text:50', main_interest: 'text:500', message: 'text:2000',
    life_stage: 'text:100', main_concern: 'text:500', main_goal: 'text:500', exercise_frequency: 'text:80' } },
  youth: { table: 'breathwork_youth_inquiries', fields: { ...common,
    inquiry_type: '!enum:parent,school,other', parent_name: 'text:100', parent_email: 'email', parent_whatsapp: 'phone',
    parent_country_code: 'text:5', parent_country_name: 'text:80', child_age: 'int:17', child_count: 'int:100',
    child_concerns: 'text:2000', institution_name: 'text:150', institution_type: 'text:100', contact_role: 'text:100',
    contact_name: 'text:100', contact_email: 'email', contact_phone: 'phone', student_count_total: 'int:100000',
    target_grades: 'text:200', format_interest: 'text:100', estimated_date: 'date', message: 'text:2000' } },
  beon: { table: 'leads', fields: { name: '!text:80', phone: '!phone', email: 'email',
    source: '!enum:comunidad,comunidad-pauta,otro', user_agent: 'text:255' } },
};

export function validatePayload(kind, input) {
  const schema = Object.hasOwn(FORM_SCHEMAS, kind) && FORM_SCHEMAS[kind];
  if (!schema || !input || typeof input !== 'object' || Array.isArray(input)) fail(400, 'invalid_form');
  if (Object.keys(input).some(k => !Object.hasOwn(schema.fields, k))) fail(400, 'unknown_field');
  const out = {};
  for (const [key, rawRule] of Object.entries(schema.fields)) {
    const required = rawRule.startsWith('!');
    const rule = required ? rawRule.slice(1) : rawRule;
    let value = input[key];
    if (value === null || value === undefined || value === '') {
      if (required) fail(400, 'invalid_field');
      continue;
    }
    if (rule.startsWith('int:')) {
      if (!Number.isInteger(value) || value < 1 || value > Number(rule.slice(4))) fail(400, 'invalid_field');
    } else {
      if (typeof value !== 'string' || value.length > 2000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) fail(400, 'invalid_field');
      value = value.trim();
      if (required && value.length < 2) fail(400, 'invalid_field');
      if (rule.startsWith('text:') && value.length > Number(rule.slice(5))) fail(400, 'invalid_field');
      if (rule === 'email') {
        if (value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) fail(400, 'invalid_field');
        value = value.toLowerCase();
      }
      if (rule === 'phone') {
        if (!/^[+0-9() -]{7,30}$/.test(value)) fail(400, 'invalid_field');
        value = value.replace(/[() -]/g, '');
        if (!/^\+?[0-9]{7,20}$/.test(value)) fail(400, 'invalid_field');
      }
      if (rule === 'uuid' && !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(value)) fail(400, 'invalid_field');
      if (rule === 'date' && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0,10) !== value)) fail(400, 'invalid_field');
      if (rule.startsWith('enum:') && !rule.slice(5).split(',').includes(value)) fail(400, 'invalid_field');
    }
    if (required && typeof value === 'string' && !value) fail(400, 'invalid_field');
    out[key] = value;
  }
  if (out.honeypot_value) fail(400, 'invalid_form');
  if (kind === 'youth') {
    const parent = out.inquiry_type === 'parent';
    if (parent && (!out.parent_name || !out.parent_whatsapp || (out.child_age !== undefined && out.child_age < 9))) fail(400, 'invalid_field');
    if (out.inquiry_type === 'school' && (!out.institution_name || !out.contact_name || !out.contact_email)) fail(400, 'invalid_field');
  }
  return { table: schema.table, payload: out };
}

// Only trust the hosting provider's overwritten header, never user X-Forwarded-For.
export function trustedClientIp(headers, vercel) {
  if (!vercel) return '127.0.0.1'; // local development shares a single quota
  const ip = headers.get('x-vercel-forwarded-for')?.trim();
  if (!ip || !isIP(ip)) fail(503, 'untrusted_network');
  return ip;
}
export function rateLimitIdentity(ip) {
  if (isIP(ip) === 4) return ip;
  if (isIP(ip) !== 6) fail(503, 'untrusted_network');
  const canonical = new URL(`http://[${ip}]/`).hostname.slice(1,-1);
  const [left, right] = canonical.split('::');
  const a = left ? left.split(':') : [];
  const b = right ? right.split(':') : [];
  const parts = (right !== undefined ? [...a,...Array(8-a.length-b.length).fill('0'),...b] : a).map(x => x.padStart(4,'0'));
  if (parts.slice(0,5).every(x => x === '0000') && parts[5] === 'ffff') {
    const n = parseInt(parts[6]+parts[7],16);
    return [24,16,8,0].map(shift => (n >>> shift)&255).join('.');
  }
  return parts.slice(0,4).join(':') + '::/64';
}
export function allowedOrigins(env) {
  return (env.FORM_ALLOWED_ORIGINS || 'https://breathwork.amarteinc.com,https://amarte-be-on-web.vercel.app')
    .split(',').map(s => s.trim()).filter(Boolean);
}

export async function verifyTurnstile(token, env, fetchFn = fetch) {
  if (!env.TURNSTILE_SECRET_KEY || !env.TURNSTILE_HOSTNAMES) fail(503, 'security_unconfigured');
  if (typeof token !== 'string' || !token || token.length > 2048) fail(400, 'verification_required');
  let data;
  try {
    const res = await fetchFn('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', body: new URLSearchParams({secret: env.TURNSTILE_SECRET_KEY, response: token}),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) fail(503, 'verification_unavailable');
    data = await res.json();
  } catch { fail(503, 'verification_unavailable'); }
  if (data.success !== true || data.action !== 'amarte_form' ||
      !env.TURNSTILE_HOSTNAMES.split(',').map(s => s.trim()).includes(data.hostname)) fail(400, 'verification_failed');
}

export async function submitSecureForm({kind, input, token, ip, db, env = process.env, fetchFn = fetch}) {
  const {table, payload} = validatePayload(kind, input);
  if (!db || !env.RATE_LIMIT_SECRET || env.RATE_LIMIT_SECRET.length < 32) fail(503, 'security_unconfigured');
  const digest = value => createHmac('sha256', env.RATE_LIMIT_SECRET).update(value).digest('hex');
  const quota = async (scope, value, limit, window) => {
    const {data, error} = await db.rpc('consume_form_quota', {
      p_scope: scope, p_key: digest(value), p_limit: limit, p_window_seconds: window,
    });
    if (error || typeof data !== 'boolean') fail(503, 'protection_unavailable');
    if (!data) fail(429, 'rate_limited');
  };
  // Separate committed RPC transactions: even invalid/replayed tokens consume quota.
  await quota('form-ip', rateLimitIdentity(ip), 20, 600);
  await verifyTurnstile(token, env, fetchFn);
  const contacts = [payload.email, payload.contact_email, payload.parent_email, payload.whatsapp, payload.phone, payload.contact_phone, payload.parent_whatsapp].filter(Boolean);
  for (const contact of new Set(contacts)) await quota('form-contact', `${kind}:${contact}`, 5, 3600);
  // Emergency circuit breaker against distributed abuse. Adjust after measuring real traffic.
  await quota('form-global', 'all', 500, 3600);
  let reservationId;
  if (kind === 'reservation') {
    const {data: event, error} = await db.from('breathwork_events')
      .select('id,status,date_iso,spots_available,price_amount,price_currency,deposit_amount,deposit_currency')
      .eq('id', payload.event_id).maybeSingle();
    if (error) fail(503, 'storage_unavailable');
    if (!event || event.status !== 'published' || !Number.isFinite(Date.parse(event.date_iso)) ||
        Date.parse(event.date_iso) <= Date.now() || !(event.spots_available > 0)) fail(409, 'event_unavailable');
    payload.amount = event.deposit_amount ?? event.price_amount;
    payload.currency = event.deposit_amount != null ? event.deposit_currency : event.price_currency;
    if (!(Number(payload.amount) > 0) || !/^[A-Z]{3}$/.test(payload.currency)) fail(409, 'event_unavailable');
    if (payload.payment_method === 'payphone') fail(409, 'payment_unavailable'); // no verified integration yet
    reservationId = randomUUID();
    payload.id = reservationId;
    payload.payment_status = 'pending';
    payload.admin_notes = `tracking_code:${reservationId}`;
  }
  const {error} = await db.from(table).insert(payload);
  if (error && !(kind === 'newsletter' && error.code === '23505')) fail(503, 'storage_unavailable');
  return {ok: true, ...(reservationId ? {reservationId} : {})};
}
