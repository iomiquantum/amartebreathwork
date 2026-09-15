import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePayload, trustedClientIp, rateLimitIdentity, verifyTurnstile, submitSecureForm } from '../../server/form-security.mjs';
import handler from '../../api/forms.mjs';
import { csvCell } from '../../src/lib/csv.ts';
const env = { RATE_LIMIT_SECRET:'test-only-32-characters-not-a-real-secret', TURNSTILE_SECRET_KEY:'test-only', TURNSTILE_HOSTNAMES:'test.example' };
const goodFetch = async () => Response.json({success:true,hostname:'test.example',action:'amarte_form'});
const lead = {name:'Persona de prueba',whatsapp:'+593991234567'};
function fakeDb(options={}) {
  const writes=[];const quotas=[];
  return {writes,quotas, rpc:async (_name,args) => {quotas.push(args);return {data:options.allowed ?? true,error:options.quotaError ?? null};},
    from:table => ({insert:async payload => {writes.push({table,payload});return {error:options.insertError ?? null};},
      select:()=>({eq:()=>({maybeSingle:async()=>({data:options.event,error:null})})})})};
}
const run = (db, overrides={}) => submitSecureForm({kind:'lead',input:lead,token:'valid-token',ip:'192.0.2.1',db,env,fetchFn:goodFetch,...overrides});
test('rejects mass assignment, unknown forms, objects, control characters and oversized fields',()=>{
  for (const field of ['payment_status','admin_notes','amount','id','created_at','ip_address']) assert.throws(()=>validatePayload('lead',{...lead,[field]:'owned'}));
  for (const name of [{},'a'.repeat(101),'bad\u0000data','']) assert.throws(()=>validatePayload('lead',{...lead,name}));
  for (const kind of ['__proto__','constructor','unknown']) assert.throws(()=>validatePayload(kind,lead));
});
test('validates phone digits, email length, calendar dates and youth limits',()=>{
  assert.throws(()=>validatePayload('beon',{name:'Test',phone:'-------',source:'otro'}));
  assert.throws(()=>validatePayload('newsletter',{email:'a'.repeat(255)+'@example.com'}));
  assert.throws(()=>validatePayload('corporate',{contact_name:'Test',contact_email:'x@example.com',company_name:'Test',estimated_date:'2026-02-31'}));
  assert.throws(()=>validatePayload('youth',{inquiry_type:'parent',parent_name:'Test',parent_whatsapp:'0991234567',child_age:8}));
  assert.doesNotThrow(()=>validatePayload('youth',{inquiry_type:'parent',parent_name:'Test',parent_whatsapp:'0991234567'}));
  assert.equal(validatePayload('beon',{name:' Test ',phone:'+593 (99) 123-4567',email:' X@EXAMPLE.COM ',source:'otro'}).payload.email,'x@example.com');
});
test('trusts only Vercel header, normalizes mapped IP and limits an IPv6 /64 together',()=>{
  assert.throws(()=>trustedClientIp(new Headers({'x-forwarded-for':'192.0.2.1'}),true));
  assert.equal(trustedClientIp(new Headers({'x-vercel-forwarded-for':'192.0.2.2','x-forwarded-for':'fake'}),true),'192.0.2.2');
  assert.equal(rateLimitIdentity('::ffff:192.0.2.1'),'192.0.2.1');
  assert.equal(rateLimitIdentity('2001:db8::1'),rateLimitIdentity('2001:db8::abcd'));
});
test('Turnstile rejects forgery, wrong hostname/action, expired and duplicate tokens',async()=>{
  for (const data of [{success:false,'error-codes':['timeout-or-duplicate']},{success:true,hostname:'evil.example',action:'amarte_form'},{success:true,hostname:'test.example',action:'different'}])
    await assert.rejects(()=>verifyTurnstile('token',env,async()=>Response.json(data)));
  await assert.rejects(()=>verifyTurnstile('',env,goodFetch));
  await assert.rejects(()=>verifyTurnstile('x'.repeat(2049),env,goodFetch));
  await assert.rejects(()=>verifyTurnstile('token',{},goodFetch));
  await assert.rejects(()=>verifyTurnstile('token',env,async()=>{throw new Error('offline');}));
});
test('fails closed without configuration, quota store or verification; never writes',async()=>{
  for (const options of [{env:{}},{fetchFn:async()=>Response.json({success:false})}]) {
    const db=fakeDb();await assert.rejects(()=>run(db,options));assert.equal(db.writes.length,0);
  }
  const db=fakeDb({quotaError:{message:'offline'}});await assert.rejects(()=>run(db));assert.equal(db.writes.length,0);
});
test('quota rejection blocks writes and uses HMAC rather than raw contact or IP',async()=>{
  const db=fakeDb({allowed:false});await assert.rejects(()=>run(db),e=>e.status===429);assert.equal(db.writes.length,0);
  const ok=fakeDb();await run(ok);assert.equal(ok.writes.length,1);
  for(const q of ok.quotas) {assert.match(q.p_key,/^[0-9a-f]{64}$/);assert.ok(!q.p_key.includes('192.0.2.1'));}
});
test('storage failure cannot report success',async()=>{
  const db=fakeDb({insertError:{code:'XX000',message:'private database detail'}});
  await assert.rejects(()=>run(db),e=>e.code==='storage_unavailable' && !e.message.includes('private'));
});
test('reservation price, currency, ID and pending status are owned by server',async()=>{
  const event={status:'published',date_iso:'2099-01-01T12:00:00Z',spots_available:5,deposit_amount:30,deposit_currency:'USD'};
  const db=fakeDb({event});const input={...lead,email:'x@example.com',event_id:'11111111-1111-4111-8111-111111111111',payment_method:'transferencia'};
  const result=await run(db,{kind:'reservation',input});
  assert.equal(db.writes[0].payload.amount,30);assert.equal(db.writes[0].payload.payment_status,'pending');assert.match(result.reservationId,/^[a-f0-9-]{36}$/);
  for(const change of [{status:'draft'},{spots_available:0},{date_iso:'2000-01-01'}]) await assert.rejects(()=>run(fakeDb({event:{...event,...change}}),{kind:'reservation',input}));
  await assert.rejects(()=>run(fakeDb({event}),{kind:'reservation',input:{...input,payment_method:'payphone'}}));
});
test('CSV escapes delimiters, quotes and formula prefixes',()=>{
  for (const value of ['=1+1','+123','-1','@SUM(A1)','  =1','\t=1','\r=1']) assert.ok(csvCell(value).startsWith('"\''));
  assert.equal(csvCell('A,"B"'),'"A,""B"""');assert.equal(csvCell(null),'""');
});
async function http(req) {
  const r={headers:{},code:200,setHeader(k,v){this.headers[k]=v;},status(c){this.code=c;return this;},json(b){this.body=b;return this;},end(){return this;}};
  await handler(req,r);return r;
}
test('HTTP boundary rejects other origins, methods, content types and oversized requests',async()=>{
  const headers={origin:'https://breathwork.amarteinc.com','content-type':'application/json'};
  assert.equal((await http({method:'POST',headers:{...headers,origin:'https://evil.example'},body:{}})).code,403);
  assert.equal((await http({method:'GET',headers,body:{}})).code,405);
  assert.equal((await http({method:'POST',headers:{...headers,'content-type':'text/plain'},body:{}})).code,415);
  assert.equal((await http({method:'POST',headers,body:'x'.repeat(16385)})).code,413);
  assert.equal((await http({method:'POST',headers,body:'{bad'})).code,400);
  assert.equal((await http({method:'OPTIONS',headers})).headers['Access-Control-Allow-Origin'],headers.origin);
});
