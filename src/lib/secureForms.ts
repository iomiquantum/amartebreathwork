import { requestFormToken } from './turnstile';
export async function submitSecurePayload(kind: string, payload: Record<string, unknown>): Promise<{ok:boolean; error?:string; reservationId?:string}> {
  try {
    const token = await requestFormToken(import.meta.env.VITE_TURNSTILE_SITE_KEY);
    const response = await fetch('/api/forms', {method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({kind,payload,token}), signal:AbortSignal.timeout(30000)});
    if (!response.ok) return {ok:false,error:response.status === 429
      ? 'Recibimos varios intentos. Espera una hora o escríbenos por WhatsApp.'
      : 'No pudimos guardar tus datos. Inténtalo de nuevo o escríbenos por WhatsApp.'};
    const result = await response.json();
    if (result.ok !== true) throw new Error('not_persisted');
    return {ok:true,reservationId:result.reservationId};
  } catch {
    return {ok:false,error:'No pudimos completar la verificación o el envío. Inténtalo de nuevo o escríbenos por WhatsApp.'};
  }
}
