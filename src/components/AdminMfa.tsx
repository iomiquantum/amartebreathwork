import { useEffect, useState, type ReactNode } from 'react';
import { checkAdminAccess, getAdminAuth } from '../lib/supabase';
import { signOut } from '../lib/auth';

export function AdminMfa({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'loading'|'enroll'|'verify'|'ready'|'error'>('loading');
  const [factorId, setFactorId] = useState('');
  const [qr, setQr] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const auth = await getAdminAuth();
        const {data: assurance, error: assuranceError} = await auth.mfa.getAuthenticatorAssuranceLevel();
        if (assuranceError) throw assuranceError;
        if (assurance?.currentLevel === 'aal2') {
          if (!await checkAdminAccess()) throw new Error('not_enrolled_admin');
          if (mounted) setMode('ready');
          return;
        }
        const {data, error} = await auth.mfa.listFactors();
        if (error) throw error;
        const factor = data?.totp.find(f => f.status === 'verified');
        if (mounted) { setFactorId(factor?.id ?? ''); setMode(factor ? 'verify' : 'enroll'); }
      } catch { if (mounted) { setError('No pudimos validar tu acceso. Reintenta o contacta al responsable del sitio.'); setMode('error'); } }
    })();
    return () => { mounted = false; };
  }, []);
  async function enroll() {
    setBusy(true); setError('');
    try {
      const auth = await getAdminAuth();
      const {data,error} = await auth.mfa.enroll({factorType:'totp',friendlyName:`AMARTE Admin ${Date.now()}`});
      if (error || !data) throw error;
      setFactorId(data.id);
      setQr(data.totp.qr_code.startsWith('data:') ? data.totp.qr_code : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(data.totp.qr_code)}`);
      setSecret(data.totp.secret); setMode('verify');
    } catch { setError('No pudimos activar el autenticador. Inténtalo de nuevo.'); }
    finally { setBusy(false); }
  }
  async function verify(event: React.FormEvent) {
    event.preventDefault();
    if (!/^\d{6}$/.test(code) || busy) return;
    setBusy(true); setError('');
    try {
      const auth = await getAdminAuth();
      const {error} = await auth.mfa.challengeAndVerify({factorId,code});
      if (error) throw error;
      if (!await checkAdminAccess()) throw new Error('not_enrolled_admin');
      setQr(''); setSecret(''); setCode(''); setMode('ready');
    } catch { setError('Código inválido o cuenta sin permiso administrativo. Revisa el código y vuelve a intentarlo.'); }
    finally { setBusy(false); }
  }
  if (mode === 'ready') return children;
  return <main className="grid min-h-screen place-items-center bg-ink p-6 text-bone">
    <section className="w-full max-w-md space-y-4 rounded-2xl border border-white/20 p-6">
      <h1 className="text-2xl">Verificación del administrador</h1>
      {mode === 'loading' && <p role="status">Comprobando acceso…</p>}
      {mode === 'enroll' && <><p>Protege tu cuenta con una aplicación de autenticación. La necesitarás además del enlace por correo.</p>
        <button type="button" disabled={busy} onClick={enroll} className="rounded border p-3">Configurar autenticador</button></>}
      {mode === 'verify' && <form onSubmit={verify} className="space-y-4">
        {qr && <><p>Escanea este código con tu autenticador. Guarda la clave en tu gestor de contraseñas; no la compartas.</p>
          <img src={qr} alt="Código QR para configurar tu autenticador" width={220} height={220}/>
          <details><summary>Ingresar clave manualmente</summary><code className="break-all">{secret}</code></details></>}
        <label className="block">Código de seis dígitos
          <input autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g,''))} required className="mt-2 block w-full rounded bg-white p-3 text-black"/>
        </label>
        <button disabled={busy} type="submit" className="rounded border p-3">{busy ? 'Verificando…' : 'Entrar'}</button>
      </form>}
      {error && <p role="alert">{error}</p>}
      <button type="button" onClick={() => void signOut()} className="underline">Cerrar sesión</button>
    </section>
  </main>;
}
