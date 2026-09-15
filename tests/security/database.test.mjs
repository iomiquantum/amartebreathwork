import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
const bwMigration = readFileSync(new URL('../../supabase/migrations/20260915010000_form_security.sql',import.meta.url),'utf8');
const tables=['breathwork_leads','breathwork_subscribers','breathwork_reservations','breathwork_corporate_inquiries','breathwork_gender_inquiries','breathwork_youth_inquiries','breathwork_events','amarte_bank_config'];
const admin='11111111-1111-4111-8111-111111111111';
const outsider='22222222-2222-4222-8222-222222222222';
async function setup() {
  const db=new PGlite();
  await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;
    create schema auth;create schema storage;
    create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
    insert into auth.users values ('${admin}','breathwork@amarteinc.com',now()),('${outsider}','outsider@example.com',now());
    create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    create function auth.jwt() returns jsonb language sql as $$select jsonb_build_object('aal',current_setting('request.jwt.claim.aal',true))$$;
    create table storage.buckets(id text primary key,public boolean);
    create table storage.objects(id uuid default gen_random_uuid(),bucket_id text);
    alter table storage.objects enable row level security;
    grant usage on schema storage to anon,authenticated;
    grant all on storage.objects to anon,authenticated;
    create policy broad_old_policy on storage.objects for all to anon,authenticated using(true) with check(true);
    insert into storage.buckets values ('backups',true);
    insert into storage.objects(bucket_id) values ('backups'),('images');
    create function public.count_lead_attempts(text) returns int language sql security definer as $$select 1$$;
    grant execute on function public.count_lead_attempts(text) to anon,authenticated;
  `);
  for(const t of tables) await db.exec(`create table public.${t}(id uuid primary key default gen_random_uuid(),status text default 'published',name text);
    alter table public.${t} enable row level security;
    grant all on public.${t} to anon,authenticated;
    create policy old_allow_all on public.${t} for all to anon,authenticated using(true) with check(true);
    insert into public.${t}(name) values ('sensitive');`);
  await db.exec(bwMigration);
  await db.exec("select set_config('request.jwt.claim.aal','aal2',false)");
  return db;
}
async function asRole(db,role,uid,sql) {
  await db.exec(`set role ${role};select set_config('request.jwt.claim.sub','${uid}',false);`);
  try {return await db.query(sql);} finally {await db.exec('reset role');}
}
test('actual SQL migration removes anonymous writes and non-admin data access, even with formerly permissive policies',async()=>{
  const db=await setup();
  try {
    for(const t of tables.slice(0,6)) {
      await assert.rejects(()=>asRole(db,'anon','',`insert into public.${t}(name) values ('bot')`));
      await assert.rejects(()=>asRole(db,'anon','',`select * from public.${t}`));
      assert.equal((await asRole(db,'authenticated',outsider,`select * from public.${t}`)).rows.length,0);
      await assert.rejects(()=>asRole(db,'authenticated',outsider,`insert into public.${t}(name) values ('bot')`));
      assert.equal((await asRole(db,'authenticated',outsider,`delete from public.${t} returning id`)).rows.length,0);
      assert.equal((await asRole(db,'authenticated',admin,`select * from public.${t}`)).rows.length,1);
      assert.equal((await asRole(db,'service_role','',`insert into public.${t}(name) values ('gateway') returning id`)).rows.length,1);
    }
    await assert.rejects(()=>asRole(db,'anon','',"select public.count_lead_attempts('0991234567')"));
    await assert.rejects(()=>asRole(db,'authenticated',outsider,'select * from amarte_private.admin_users'));
  } finally {await db.close();}
});
test('public events remain visible but drafts and writes are admin-only; backups stay private',async()=>{
  const db=await setup();
  try {
    await db.exec("insert into breathwork_events(status) values ('draft')");
    assert.equal((await asRole(db,'anon','', 'select * from breathwork_events')).rows.length,1);
    assert.equal((await asRole(db,'authenticated',outsider, 'select * from breathwork_events')).rows.length,1);
    assert.equal((await asRole(db,'authenticated',admin, 'select * from breathwork_events')).rows.length,2);
    assert.equal((await asRole(db,'authenticated',outsider,"update amarte_bank_config set name='attacker' returning id")).rows.length,0);
    assert.equal((await asRole(db,'anon','', 'select * from storage.objects')).rows.length,1);
    assert.equal((await db.query("select public from storage.buckets where id='backups'")).rows[0].public,false);
  } finally {await db.close();}
});
test('durable quota permits exactly limit, rejects excess and survives a new caller; expired rows reset',async()=>{
  const db=await setup();const key='a'.repeat(64);
  try {
    const sql=`select public.consume_form_quota('form-ip','${key}',5,3600) as allowed`;
    await assert.rejects(()=>asRole(db,'anon','',sql));
    await assert.rejects(()=>asRole(db,'authenticated',outsider,sql));
    const results=[];
    for(let i=0;i<30;i++) results.push((await asRole(db,'service_role','',sql)).rows[0].allowed);
    assert.equal(results.filter(Boolean).length,5);
    await db.exec("update amarte_private.form_quotas set window_start=now()-interval '2 hours'");
    assert.equal((await asRole(db,'service_role','',sql)).rows[0].allowed,true);
    await db.exec("update amarte_private.form_quotas set window_start=now()-interval '3 days';select public.cleanup_form_quotas()");
    assert.equal((await db.query('select * from amarte_private.form_quotas')).rows.length,0);
  } finally {await db.close();}
});

test('an enrolled admin without the second factor cannot read or modify private data',async()=>{
  const db=await setup();
  try {
    await db.exec("select set_config('request.jwt.claim.aal','aal1',false)");
    assert.equal((await asRole(db,'authenticated',admin,'select * from breathwork_leads')).rows.length,0);
    assert.equal((await asRole(db,'authenticated',admin,"update amarte_bank_config set name='compromised' returning id")).rows.length,0);
  } finally {await db.close();}
});
