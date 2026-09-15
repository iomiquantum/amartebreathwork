// Sincroniza los builds embebidos de ICE y PLANT dentro de BW.
// Uso: node scripts/sync-embeds.mjs
// Flujo por app (reproducible: doble corrida byte a byte idéntica):
//   1. Rebuild determinista: tsc -b && vite build --base /<sub>/
//   2. Copia dist/* -> public/<sub>/ (sobrescribe; crea dirs)
//   3. Poda archivos obsoletos del embed (p. ej. chunks con hash viejo)
//      salvo PRESERVE (legales de otro carril, no vienen de dist)
//   4. Escribe public/<sub>/.embed-build.json (registro determinista, sin timestamps)
// Requiere node_modules instalados en cada repo fuente. No toca package.json.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const bwRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const opusRoot = dirname(bwRoot);

// Preservados: los mantiene otro carril, no forman parte de dist.
const PRESERVE = new Set(["privacidad.html", "terminos.html"]);

const APPS = [
  {
    name: "ice",
    dir: process.env.ICE_DIR ?? join(opusRoot, "ICE-RESET-INMERSIVO"),
  },
  {
    name: "plant",
    dir: process.env.PLANT_DIR ?? join(opusRoot, "PLANT-SOUND-IMMERSION"),
  },
];

const sha256File = (path) =>
  createHash("sha256").update(readFileSync(path)).digest("hex");

function listFilesRecursive(dir, base = dir) {
  const out = [];
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...listFilesRecursive(full, base));
    else out.push(relative(base, full));
  }
  return out;
}

function bin(dir, name) {
  const path = join(dir, "node_modules", ".bin", name);
  if (!existsSync(path)) throw new Error(`falta binario local: ${path} (npm install?)`);
  return path;
}

function pkgVersion(dir, name) {
  return JSON.parse(
    readFileSync(join(dir, "node_modules", name, "package.json"), "utf8"),
  ).version;
}

function sourceInfo(dir) {
  try {
    const commit = execFileSync("git", ["rev-parse", "--short", "HEAD"], {
      cwd: dir,
      encoding: "utf8",
    }).trim();
    const dirty =
      execFileSync("git", ["status", "--porcelain"], {
        cwd: dir,
        encoding: "utf8",
      }).trim() !== "";
    return { commit, dirty };
  } catch {
    return { commit: "sin-git", dirty: true };
  }
}

function buildApp({ name, dir }) {
  if (!existsSync(join(dir, "package.json")))
    throw new Error(`no existe repo fuente: ${dir}`);
  execFileSync(bin(dir, "tsc"), ["-b"], { cwd: dir, stdio: "inherit" });
  execFileSync(bin(dir, "vite"), ["build", "--base", `/${name}/`], {
    cwd: dir,
    stdio: "inherit",
  });
}

function syncApp({ name, dir }) {
  const dist = join(dir, "dist");
  const target = join(bwRoot, "public", name);
  if (!existsSync(dist)) throw new Error(`no existe dist: ${dist}`);

  const distFiles = listFilesRecursive(dist);
  const distSet = new Set(distFiles);

  // 1. Copia dist -> target (sobrescribe).
  for (const rel of distFiles) {
    const dest = join(target, rel);
    mkdirSync(dirname(dest), { recursive: true });
    cpSync(join(dist, rel), dest);
  }

  // 2. Poda obsoletos (no están en dist ni en PRESERVE); limpia dirs vacíos.
  const pruneDirs = [];
  const walk = (d) => {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
        pruneDirs.push(full);
      } else {
        const rel = relative(target, full);
        if (!distSet.has(rel) && !PRESERVE.has(rel) && entry !== ".embed-build.json") {
          rmSync(full);
          console.log(`prune ${name}/${rel}`);
        }
      }
    }
  };
  mkdirSync(target, { recursive: true });
  walk(target);
  for (const d of pruneDirs.sort().reverse()) {
    if (readdirSync(d).length === 0) rmSync(d, { recursive: true });
  }

  // 3. Registro determinista del build embebido (sin timestamps).
  const files = {};
  for (const rel of distFiles) files[rel] = sha256File(join(target, rel));
  const record = {
    app: name,
    base: `/${name}/`,
    source: { dir, ...sourceInfo(dir) },
    builder: {
      node: process.version,
      tsc: pkgVersion(dir, "typescript"),
      vite: pkgVersion(dir, "vite"),
    },
    files,
  };
  writeFileSync(
    join(target, ".embed-build.json"),
    `${JSON.stringify(record, null, 2)}\n`,
  );

  const manifest = createHash("sha256")
    .update(distFiles.map((f) => `${f}:${files[f]}`).join("\n"))
    .digest("hex");
  console.log(
    `SYNC ${name} base=/${name}/ files=${distFiles.length} manifest=${manifest} commit=${record.source.commit}${record.source.dirty ? "+dirty" : ""}`,
  );
  return manifest;
}

const manifests = {};
for (const app of APPS) {
  console.log(`== build ${app.name} (${app.dir}) ==`);
  buildApp(app);
  manifests[app.name] = syncApp(app);
}
console.log("sync-embeds ok");
