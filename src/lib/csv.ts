// Quoting alone does not prevent spreadsheet formula execution.
export function csvCell(value: unknown): string {
  if (value == null) return '""';
  let text = String(value);
  if (/^[\s\u0000-\u001f]*[=+\-@]/.test(text) || /^[\t\r\n]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
