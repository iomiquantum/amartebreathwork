// Canonical browser helper; loads only when the visitor submits a form.
type Turnstile = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: Turnstile } }
let loading: Promise<Turnstile> | undefined;
function load(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (loading) return loading;
  loading = new Promise<Turnstile>((resolve, reject) => {
    const script = document.createElement('script');
    const timer = window.setTimeout(() => { script.remove(); loading = undefined; reject(new Error('verification_unavailable')); }, 15000);
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => {
      window.clearTimeout(timer);
      if (window.turnstile) resolve(window.turnstile);
      else { loading = undefined; reject(new Error('verification_unavailable')); }
    };
    script.onerror = () => { window.clearTimeout(timer); script.remove(); loading = undefined; reject(new Error('verification_unavailable')); };
    document.head.append(script);
  });
  return loading;
}
let active = false;
export async function requestFormToken(sitekey: string | undefined): Promise<string> {
  if (!sitekey) throw new Error('security_unconfigured');
  if (active) throw new Error('verification_pending');
  active = true;
  try {
    const api = await load();
    return await new Promise<string>((resolve, reject) => {
      const previous = document.activeElement as HTMLElement | null;
      const dialog = document.createElement('dialog');
      dialog.setAttribute('aria-label', 'Verificación de seguridad');
      dialog.style.cssText = 'padding:24px;border:1px solid #aaa;border-radius:16px;max-width:95vw;background:#fff;color:#111;';
      const title = document.createElement('p');
      title.textContent = 'Verifica que eres una persona para enviar tus datos.';
      const container = document.createElement('div');
      const cancel = document.createElement('button');
      cancel.type = 'button'; cancel.textContent = 'Cancelar';
      cancel.style.cssText = 'display:block;padding:12px;margin-top:12px;';
      dialog.append(title, container, cancel);
      document.body.append(dialog);
      let widget: string | undefined;
      let settled = false;
      const finish = (token?: string) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        if (widget) api.remove(widget);
        dialog.close(); dialog.remove(); previous?.focus();
        if (token) resolve(token); else reject(new Error('verification_cancelled'));
      };
      const timer = window.setTimeout(() => finish(), 120000);
      cancel.onclick = () => finish();
      dialog.oncancel = (event) => { event.preventDefault(); finish(); };
      // Capture stops underlying reservation dialogs from closing/trapping focus.
      dialog.addEventListener('keydown', (event) => event.stopPropagation());
      try {
        dialog.showModal();
        widget = api.render(container, {sitekey, action:'amarte_form', theme:'light',
          callback:(token: string) => finish(token), 'error-callback':() => finish(),
          'expired-callback':() => finish(), 'timeout-callback':() => finish()});
        cancel.focus();
      } catch { finish(); }
    });
  } finally { active = false; }
}
