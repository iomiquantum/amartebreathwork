import { createClient } from '@supabase/supabase-js';
import { allowedOrigins, trustedClientIp, submitSecureForm, SubmissionError } from '../server/form-security.mjs';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Vary', 'Origin');
  const origin = req.headers.origin;
  if (typeof origin !== 'string' || !allowedOrigins(process.env).includes(origin)) return res.status(403).json({ok:false, error:'origin_denied'});
  res.setHeader('Access-Control-Allow-Origin', origin);
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ok:false}); }
  if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) return res.status(415).json({ok:false});
  try {
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (!raw || Buffer.byteLength(raw) > 16384) return res.status(413).json({ok:false});
    const body = JSON.parse(raw);
    if (!body || !['lead','newsletter','reservation','corporate','gender','youth'].includes(body.kind)) return res.status(400).json({ok:false});
    const headers = new Headers();
    for (const [k,v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k,v);
    const ip = trustedClientIp(headers, process.env.VERCEL === '1');
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const db = url && key ? createClient(url,key,{auth:{persistSession:false, autoRefreshToken:false},
      global:{fetch:(url,options) => fetch(url,{...options,signal:AbortSignal.timeout(8000)})}}) : null;
    const result = await submitSecureForm({kind:body.kind,input:body.payload,token:body.token,ip,db});
    return res.status(200).json(result);
  } catch (error) {
    const status = error instanceof SubmissionError ? error.status : error instanceof SyntaxError ? 400 : 503;
    const code = error instanceof SubmissionError ? error.code : 'request_failed';
    if (status === 429) res.setHeader('Retry-After', '3600');
    // No payloads, tokens, IP addresses or provider error details in logs/responses.
    if (status >= 500) console.error('[forms]', {code});
    return res.status(status).json({ok:false,error:code});
  }
}
