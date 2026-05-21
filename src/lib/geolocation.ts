// Detección de país por IP para pre-seleccionar el selector en WhatsappGateModal.
// Usa ipapi.co como provider (free tier: 1000 req/día, sin key).
// Cachea el resultado en sessionStorage para no refetchear cada apertura del modal.

import { COUNTRIES, type Country, findCountryByCode } from "../data/countries";

// Mapeo ISO 3166-1 alpha-2 → phone country code (sin '+')
// Solo los países soportados en COUNTRIES; el resto retorna undefined.
const ISO_TO_PHONE: Record<string, string> = {
  EC: "593",
  CO: "57",
  PE: "51",
  MX: "52",
  US: "1",
  CA: "1",
  ES: "34",
  AR: "54",
  CL: "56",
  BR: "55",
  VE: "58",
  BO: "591",
  PY: "595",
  UY: "598",
  PA: "507",
  CR: "506",
  GB: "44",
  FR: "33",
  DE: "49",
  IT: "39",
};

const CACHE_KEY = "amarte_geo_country_iso";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

type CacheEntry = { iso: string; t: number };

function readCache(): string | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry;
    if (Date.now() - parsed.t > CACHE_TTL_MS) return null;
    return parsed.iso;
  } catch {
    return null;
  }
}

function writeCache(iso: string) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ iso, t: Date.now() }));
  } catch {
    /* ignore quota / private mode errors */
  }
}

export async function detectCountry(signal?: AbortSignal): Promise<Country | null> {
  const cachedIso = readCache();
  if (cachedIso) {
    const code = ISO_TO_PHONE[cachedIso];
    if (code) return findCountryByCode(code) ?? null;
  }

  try {
    const res = await fetch("https://ipapi.co/json/", {
      signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { country_code?: string };
    const iso = data.country_code?.toUpperCase();
    if (!iso) return null;
    writeCache(iso);
    const phoneCode = ISO_TO_PHONE[iso];
    if (!phoneCode) return null;
    return findCountryByCode(phoneCode) ?? null;
  } catch {
    return null;
  }
}

// Convenience: array de países disponibles (proxied desde data/countries para no duplicar imports)
export { COUNTRIES };
