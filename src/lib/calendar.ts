import { siteConfig } from "../data/siteConfig";

function formatICS(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function buildICS(opts: { dateISO: string; durationMin?: number; title?: string; location?: string; description?: string }) {
  const start = new Date(opts.dateISO);
  const end = new Date(start.getTime() + (opts.durationMin ?? 90) * 60 * 1000);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AMARTE//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${start.getTime()}@amarteinc.com`,
    `DTSTAMP:${formatICS(new Date())}`,
    `DTSTART:${formatICS(start)}`,
    `DTEND:${formatICS(end)}`,
    `SUMMARY:${opts.title ?? `${siteConfig.brandName} · Breathwork Inmersivo`}`,
    `LOCATION:${opts.location ?? siteConfig.location}`,
    `DESCRIPTION:${(opts.description ?? "Experiencia presencial de respiración, sonido y frecuencias.").replace(/\n/g, "\\n")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return lines;
}

export function downloadICS(opts: Parameters<typeof buildICS>[0]) {
  const ics = buildICS(opts);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `amarte-${new Date(opts.dateISO).toISOString().slice(0, 10)}.ics`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
