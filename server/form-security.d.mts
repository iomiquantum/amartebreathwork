export class SubmissionError extends Error { status: number; code: string; }
export function trustedClientIp(headers: Headers, vercel: boolean): string;
export function submitSecureForm(options: {kind:string; input:Record<string,unknown>; token:unknown; ip:string; db:unknown; env?:NodeJS.ProcessEnv}): Promise<{ok:boolean; reservationId?:string}>;
