// Canonical implementation stays in BW; prevent drift in standalone consumers.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const beon = resolve(root,'../AMARTE BE ON 2026/amarte-be-on-web');
const ice = resolve(root,'../ICE-RESET-INMERSIVO');
const copies = [
  ['server/form-security.mjs',beon+'/src/lib/security/form-security.mjs'],
  ['server/form-security.d.mts',beon+'/src/lib/security/form-security.d.mts'],
  ['src/lib/turnstile.ts',beon+'/src/lib/turnstile.ts'],
  ['src/lib/turnstile.ts',ice+'/src/lib/turnstile.ts'],
];
for (const [source,target] of copies) {
  const content = readFileSync(resolve(root,source));
  if (process.argv.includes('--check')) {
    if (!content.equals(readFileSync(target))) throw new Error(`Security copy differs: ${target}`);
  } else writeFileSync(target,content);
}
console.log('Security copies match');
