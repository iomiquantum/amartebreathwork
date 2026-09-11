// Verifica que las subrutas /ice, /plant y /be-on queden bien configuradas.
// Uso: node scripts/verify-subpaths.mjs (exit 1 si algo falla)
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failures = 0;
const check = (ok, msg) => {
  console.log(`${ok ? "ok" : "FAIL"} - ${msg}`);
  if (!ok) failures += 1;
};

for (const name of ["ice", "plant"]) {
  const html = join(root, "public", name, "index.html");
  check(existsSync(html), `public/${name}/index.html existe`);
  if (existsSync(html)) {
    const content = readFileSync(html, "utf8");
    check(
      content.includes(`/${name}/assets/`),
      `public/${name}/index.html usa base /${name}/`,
    );
    check(
      !content.includes('src="/assets/') && !content.includes('href="/assets/'),
      `public/${name}/index.html sin rutas absolutas /assets/`,
    );
  }
}

const vercel = JSON.parse(
  readFileSync(join(root, "vercel.json"), "utf8"),
);
const rewrites = vercel.rewrites ?? [];
check(
  rewrites.some(
    (r) =>
      r.source === "/be-on/:path*" &&
      String(r.destination).includes("/be-on/:path*"),
  ),
  "vercel.json proxea /be-on/:path* al backend",
);

const hub = readFileSync(
  join(root, "src", "pages", "PresentacionesPage.tsx"),
  "utf8",
);
for (const href of ['"/ice"', '"/plant"', '"/be-on"']) {
  check(hub.includes(`href: ${href}`), `hub enlaza a ${href}`);
}
check(!hub.includes("127.0.0.1"), "hub sin links a localhost");

if (failures > 0) {
  console.error(`${failures} verificación(es) fallida(s)`);
  process.exit(1);
}
console.log("subrutas ok");
