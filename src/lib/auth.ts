// ─────────────────────────────────────────────────────────────────────────────
// Auth types & session helpers
// ─────────────────────────────────────────────────────────────────────────────

export const N8N_AUTH_URL = 'https://n8n.growtzy.com/webhook/api/v1/auth';

export interface AuthUser {
  userId: string;
  username: string;
  email: string;
  role: string;
  locationId: string;
  token: string;
  /** ISO timestamp when the session expires */
  expiresAt: string;
}

export type AuthErrorCode =
  | 'INVALID_USERNAME'
  | 'INVALID_PASSWORD'
  | 'NO_PERMISSIONS'
  | 'SESSION_EXPIRED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  errorCode?: AuthErrorCode;
  message?: string;
}

// ── Storage key ──────────────────────────────────────────────────────────────
const SESSION_KEY = 'nexusdash_session';

/** Persist user session to localStorage */
export function saveSession(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

/** Retrieve session from localStorage. Returns null if absent or expired. */
export function getSession(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const user: AuthUser = JSON.parse(raw);
    if (new Date(user.expiresAt) < new Date()) {
      clearSession();
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

/** Remove session from localStorage (logout) */
export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

// ─────────────────────────────────────────────────────────────────────────────
// N8N login request
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sends credentials to the N8N authentication webhook.
 *
 * REQUEST PAYLOAD (POST JSON):
 * {
 *   "action":   "LOGIN",
 *   "username": string,   // the value from the username input
 *   "password": string    // the value from the password input (plain text — TLS in transit)
 * }
 *
 * See /docs/n8n-auth-spec.md for full response contracts.
 */
export async function loginWithN8n(
  username: string,
  password: string
): Promise<AuthResult> {
  try {
    const res = await fetch(N8N_AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'LOGIN', username, password }),
      signal: AbortSignal.timeout(10_000), // 10 s timeout
    });

    // ── Network-level error ───────────────────────────────────────────────
    if (!res.ok) {
      return {
        success: false,
        errorCode: 'UNKNOWN_ERROR',
        message: `El servidor respondió con estado ${res.status}. Verifica el flujo de N8N.`,
      };
    }

    let body: any;
    try {
      body = await res.json();
    } catch {
      return {
        success: false,
        errorCode: 'UNKNOWN_ERROR',
        message: 'El backend no devolvió JSON válido.',
      };
    }

    // ── Normalise: N8N wraps responses in { success, payload } or flat ───
    const payload = body?.payload ?? body;

    if (payload?.success === true && payload?.user) {
      const user: AuthUser = {
        userId:     payload.user.userId     ?? payload.user.id ?? '',
        username:   payload.user.username   ?? username,
        email:      payload.user.email      ?? '',
        role:       payload.user.role       ?? 'viewer',
        locationId: payload.user.locationId ?? '',
        token:      payload.user.token      ?? payload.token ?? '',
        expiresAt:  payload.user.expiresAt  ?? new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      };
      saveSession(user);
      return { success: true, user };
    }

    // ── Map backend error codes to frontend error codes ──────────────────
    const errorCode: AuthErrorCode = mapErrorCode(payload?.errorCode ?? payload?.error_code);
    return {
      success: false,
      errorCode,
      message: payload?.message ?? 'Error de autenticación.',
    };
  } catch (err: any) {
    if (err?.name === 'AbortError' || err?.name === 'TimeoutError') {
      return {
        success: false,
        errorCode: 'NETWORK_ERROR',
        message: 'Tiempo de espera agotado. Verifica tu conexión e inténtalo de nuevo.',
      };
    }
    return {
      success: false,
      errorCode: 'NETWORK_ERROR',
      message: `Error de red: ${err?.message ?? 'Error desconocido.'}`,
    };
  }
}

function mapErrorCode(raw?: string): AuthErrorCode {
  const map: Record<string, AuthErrorCode> = {
    INVALID_USERNAME: 'INVALID_USERNAME',
    INVALID_PASSWORD: 'INVALID_PASSWORD',
    NO_PERMISSIONS:   'NO_PERMISSIONS',
    SESSION_EXPIRED:  'SESSION_EXPIRED',
  };
  return map[raw ?? ''] ?? 'UNKNOWN_ERROR';
}
