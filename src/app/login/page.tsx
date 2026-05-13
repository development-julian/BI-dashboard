'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AuthErrorCode } from '@/lib/auth';
import { Eye, EyeOff, LogIn, AlertCircle, Loader2 } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Error message map
// ─────────────────────────────────────────────────────────────────────────────

const ERROR_MESSAGES: Record<AuthErrorCode, string> = {
  INVALID_USERNAME: 'El usuario no existe. Verifica e inténtalo de nuevo.',
  INVALID_PASSWORD: 'Contraseña incorrecta. Verifica e inténtalo de nuevo.',
  NO_PERMISSIONS:   'Tu cuenta no tiene permisos para acceder al dashboard.',
  SESSION_EXPIRED:  'Tu sesión expiró. Inicia sesión de nuevo.',
  NETWORK_ERROR:    'No se pudo conectar con el servidor. Verifica tu conexión.',
  UNKNOWN_ERROR:    'Ocurrió un error inesperado. Inténtalo de nuevo.',
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername]     = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPw]   = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [errorCode, setErrorCode]   = useState<AuthErrorCode | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorCode(null);
    setSubmitting(true);

    const result = await login(username.trim(), password);

    if (!result.success) {
      setErrorCode(result.errorCode ?? 'UNKNOWN_ERROR');
    }
    // On success the AuthContext already redirects to /dashboard

    setSubmitting(false);
  }

  return (
    <div className="login-root">
      {/* ── Animated gradient background ── */}
      <div className="login-bg" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <main className="login-card" role="main">
        {/* Logo + heading */}
        <div className="login-header">
          <div className="login-logo" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 28 L16 4 L28 28 Z" fill="hsl(226 100% 59%)" opacity="0.9" />
              <path d="M10 28 L16 16 L22 28 Z" fill="hsl(226 100% 75%)" opacity="0.7" />
            </svg>
          </div>
          <h1 className="login-title">NexusDash</h1>
          <p className="login-subtitle">Inicia sesión para continuar</p>
        </div>

        {/* Error banner */}
        {errorCode && (
          <div className="login-error" role="alert" aria-live="assertive">
            <AlertCircle size={16} />
            <span>{ERROR_MESSAGES[errorCode]}</span>
          </div>
        )}

        {/* Form */}
        <form id="login-form" className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="login-username" className="field-label">
              Usuario
            </label>
            <input
              id="login-username"
              name="username"
              type="text"
              autoComplete="username"
              autoFocus
              required
              className="field-input"
              placeholder="tu@correo.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="field-group">
            <label htmlFor="login-password" className="field-label">
              Contraseña
            </label>
            <div className="password-wrapper">
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="field-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="pw-toggle"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onClick={() => setShowPw((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            className="login-btn"
            disabled={isSubmitting || !username || !password}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="spin" />
                <span>Verificando…</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>Iniciar sesión</span>
              </>
            )}
          </button>
        </form>

        <p className="login-footer">
          ¿Problemas para acceder?{' '}
          <a href="mailto:soporte@growtzy.com" className="login-link">
            Contacta soporte
          </a>
        </p>
      </main>

      <style>{`
        /* ── Layout ───────────────────────────────────────────────────────── */
        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: hsl(224 22% 8%);
          position: relative;
          overflow: hidden;
          padding: 1rem;
        }

        /* ── Animated blobs ──────────────────────────────────────────────── */
        .login-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
          animation: float 8s ease-in-out infinite alternate;
        }
        .blob-1 {
          width: 500px; height: 500px;
          background: hsl(226 100% 59%);
          top: -120px; left: -80px;
          animation-delay: 0s;
        }
        .blob-2 {
          width: 400px; height: 400px;
          background: hsl(280 80% 60%);
          bottom: -100px; right: -60px;
          animation-delay: -3s;
        }
        .blob-3 {
          width: 300px; height: 300px;
          background: hsl(160 80% 40%);
          top: 60%; left: 55%;
          animation-delay: -6s;
        }
        @keyframes float {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, -30px) scale(1.08); }
        }

        /* ── Card ────────────────────────────────────────────────────────── */
        .login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          background: hsl(224 21% 14% / 0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid hsl(224 21% 22%);
          border-radius: 1.25rem;
          padding: 2.5rem 2rem;
          box-shadow:
            0 0 0 1px hsl(226 100% 59% / 0.08),
            0 25px 50px hsl(224 22% 5% / 0.6);
          animation: fade-in 0.4s ease;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Header ──────────────────────────────────────────────────────── */
        .login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }
        .login-logo svg {
          width: 48px;
          height: 48px;
          drop-shadow(0 0 12px hsl(226 100% 59% / 0.5));
          filter: drop-shadow(0 0 10px hsl(226 100% 59% / 0.4));
        }
        .login-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: hsl(220 20% 97%);
          letter-spacing: -0.02em;
          margin: 0;
        }
        .login-subtitle {
          font-size: 0.875rem;
          color: hsl(220 9% 55%);
          margin: 0;
        }

        /* ── Error banner ────────────────────────────────────────────────── */
        .login-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: hsl(0 80% 55% / 0.12);
          border: 1px solid hsl(0 80% 55% / 0.35);
          border-radius: 0.625rem;
          padding: 0.75rem 1rem;
          margin-bottom: 1.25rem;
          color: hsl(0 80% 70%);
          font-size: 0.875rem;
          animation: fade-in 0.25s ease;
        }

        /* ── Form ────────────────────────────────────────────────────────── */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .field-label {
          font-size: 0.8125rem;
          font-weight: 500;
          color: hsl(220 9% 70%);
          letter-spacing: 0.01em;
        }
        .field-input {
          width: 100%;
          background: hsl(224 22% 10%);
          border: 1px solid hsl(224 21% 22%);
          border-radius: 0.625rem;
          padding: 0.7rem 1rem;
          color: hsl(220 20% 97%);
          font-size: 0.9375rem;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .field-input::placeholder {
          color: hsl(220 9% 40%);
        }
        .field-input:focus {
          border-color: hsl(226 100% 59%);
          box-shadow: 0 0 0 3px hsl(226 100% 59% / 0.2);
        }
        .field-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ── Password wrapper ────────────────────────────────────────────── */
        .password-wrapper {
          position: relative;
        }
        .password-wrapper .field-input {
          padding-right: 2.75rem;
        }
        .pw-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: hsl(220 9% 50%);
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .pw-toggle:hover { color: hsl(220 20% 80%); }

        /* ── Submit button ───────────────────────────────────────────────── */
        .login-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          margin-top: 0.25rem;
          background: linear-gradient(135deg, hsl(226 100% 59%), hsl(246 100% 65%));
          color: #fff;
          font-size: 0.9375rem;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          border: none;
          border-radius: 0.625rem;
          cursor: pointer;
          transition: opacity 0.2s, box-shadow 0.2s, transform 0.15s;
          box-shadow: 0 4px 16px hsl(226 100% 59% / 0.4);
        }
        .login-btn:hover:not(:disabled) {
          opacity: 0.92;
          box-shadow: 0 6px 24px hsl(226 100% 59% / 0.5);
          transform: translateY(-1px);
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* ── Spinner ─────────────────────────────────────────────────────── */
        .spin {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ── Footer ──────────────────────────────────────────────────────── */
        .login-footer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.8125rem;
          color: hsl(220 9% 50%);
        }
        .login-link {
          color: hsl(226 100% 70%);
          text-decoration: none;
          font-weight: 500;
        }
        .login-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
