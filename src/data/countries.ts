// Códigos país para el selector de WhatsApp. Ecuador primero (default).
// Más comunes para AMARTE (Latam + España + USA).
// Si necesitas otro país, agrégalo aquí en el orden que prefieras.

export interface Country {
  code: string; // sin '+', ej. "593"
  name: string;
  flag: string; // emoji
}

export const COUNTRIES: Country[] = [
  { code: "593", name: "Ecuador", flag: "🇪🇨" },
  { code: "57", name: "Colombia", flag: "🇨🇴" },
  { code: "51", name: "Perú", flag: "🇵🇪" },
  { code: "52", name: "México", flag: "🇲🇽" },
  { code: "1", name: "Estados Unidos", flag: "🇺🇸" },
  { code: "34", name: "España", flag: "🇪🇸" },
  { code: "54", name: "Argentina", flag: "🇦🇷" },
  { code: "56", name: "Chile", flag: "🇨🇱" },
  { code: "55", name: "Brasil", flag: "🇧🇷" },
  { code: "58", name: "Venezuela", flag: "🇻🇪" },
  { code: "591", name: "Bolivia", flag: "🇧🇴" },
  { code: "595", name: "Paraguay", flag: "🇵🇾" },
  { code: "598", name: "Uruguay", flag: "🇺🇾" },
  { code: "507", name: "Panamá", flag: "🇵🇦" },
  { code: "506", name: "Costa Rica", flag: "🇨🇷" },
  { code: "44", name: "Reino Unido", flag: "🇬🇧" },
  { code: "33", name: "Francia", flag: "🇫🇷" },
  { code: "49", name: "Alemania", flag: "🇩🇪" },
  { code: "39", name: "Italia", flag: "🇮🇹" },
];

export const DEFAULT_COUNTRY = COUNTRIES[0]; // Ecuador

export function findCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}
