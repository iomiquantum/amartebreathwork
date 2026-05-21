// Edge Function: daily-backup
// Hace dump JSON de todas las tablas de negocio y lo sube a Supabase Storage (bucket "backups").
// Invocación: HTTP POST con header `x-backup-secret: <vault.backup_secret>`.
// Programado por pg_cron a las 04:00 UTC diarias (23:00 Ecuador la noche anterior).

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const TABLES = [
  "breathwork_leads",
  "breathwork_subscribers",
  "breathwork_events",
  "breathwork_reservations",
  "breathwork_corporate_inquiries",
  "amarte_bank_config",
];

const BUCKET = "backups";
const RETENTION_DAYS = 30;

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const { data: expectedSecret, error: secretErr } = await supabase.rpc(
    "get_backup_secret",
  );
  if (secretErr || !expectedSecret) {
    return new Response(
      JSON.stringify({ error: "Vault secret unavailable", details: secretErr?.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const provided = req.headers.get("x-backup-secret");
  if (provided !== expectedSecret) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const startedAt = new Date();
  const dateKey = startedAt.toISOString().slice(0, 10);
  const timeKey = startedAt.toISOString().replace(/[:.]/g, "-");
  const dump: Record<string, unknown> = {
    _metadata: {
      generated_at: startedAt.toISOString(),
      project: "amarteinc",
      tables: TABLES,
    },
  };

  const summary: Record<string, { rows: number; bytes: number }> = {};

  for (const table of TABLES) {
    const { data, error } = await supabase.from(table).select("*");
    if (error) {
      return new Response(
        JSON.stringify({ error: `Failed reading ${table}`, details: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
    dump[table] = data ?? [];
    const json = JSON.stringify(data ?? []);
    summary[table] = { rows: data?.length ?? 0, bytes: json.length };
  }

  const payload = JSON.stringify(dump, null, 2);
  const fileName = `${dateKey}/backup-${timeKey}.json`;

  const uploadRes = await supabase.storage
    .from(BUCKET)
    .upload(fileName, payload, {
      contentType: "application/json",
      upsert: true,
    });

  if (uploadRes.error) {
    return new Response(
      JSON.stringify({ error: "Upload failed", details: uploadRes.error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  // Retention: borrar carpetas (YYYY-MM-DD) con fecha < hoy - RETENTION_DAYS
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const cutoffKey = cutoff.toISOString().slice(0, 10);
  const { data: folders } = await supabase.storage.from(BUCKET).list("", {
    limit: 1000,
  });

  const deletedFolders: string[] = [];
  if (folders) {
    for (const folder of folders) {
      if (!folder.name || !/^\d{4}-\d{2}-\d{2}$/.test(folder.name)) continue;
      if (folder.name < cutoffKey) {
        const { data: filesInFolder } = await supabase.storage
          .from(BUCKET)
          .list(folder.name, { limit: 1000 });
        if (filesInFolder && filesInFolder.length > 0) {
          const paths = filesInFolder.map((f) => `${folder.name}/${f.name}`);
          await supabase.storage.from(BUCKET).remove(paths);
          deletedFolders.push(folder.name);
        }
      }
    }
  }

  const elapsedMs = Date.now() - startedAt.getTime();

  return new Response(
    JSON.stringify({
      ok: true,
      file: fileName,
      bucket: BUCKET,
      size_bytes: payload.length,
      tables: summary,
      retention_days: RETENTION_DAYS,
      deleted_old_folders: deletedFolders,
      elapsed_ms: elapsedMs,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
});
