import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { USERS_DB } from '@/lib/server/db';

const N8N_GATEWAY_URL =
  process.env.N8N_GATEWAY_URL ?? 'https://n8n.growtzy.com/webhook/api/v1/gateway';

const SECRET = process.env.SESSION_SECRET ?? 'nexusdash-dev-secret-2024';

/**
 * Decode the simple token made by /api/auth/login and extract the email.
 * Token format: base64url(email:timestamp:secret)
 */
function decodeToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split(':');
    // Must have at least 3 parts: email, timestamp, secret (secret may have colons)
    if (parts.length < 3) return null;
    const email = parts[0];
    const secret = parts.slice(2).join(':');
    if (secret !== SECRET) return null;
    return email;
  } catch {
    return null;
  }
}

function getUserByToken(token: string) {
  const email = decodeToken(token);
  if (!email) return null;
  return USERS_DB.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function POST(req: NextRequest) {
  // ── 1. Extract token from Authorization header, cookie, or body ──────────
  let token = req.headers.get('authorization')?.replace('Bearer ', '') ?? '';

  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get('nexusdash_token')?.value ?? '';
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        payload: {
          success: false,
          errorCode: 'UNKNOWN_ERROR',
          message: 'Request body must be JSON.',
        },
      },
      { status: 400 }
    );
  }

  // Also check token in the body (for client-side requests)
  if (!token && body?.userToken) {
    token = body.userToken;
  }

  // ── 2. Validate token ─────────────────────────────────────────────────────
  if (!token) {
    return NextResponse.json(
      {
        success: false,
        payload: {
          success: false,
          errorCode: 'SESSION_EXPIRED',
          message: 'No se encontró sesión activa. Inicia sesión nuevamente.',
        },
      },
      { status: 401 }
    );
  }

  const dbUser = getUserByToken(token);

  if (!dbUser) {
    return NextResponse.json(
      {
        success: false,
        payload: {
          success: false,
          errorCode: 'SESSION_EXPIRED',
          message: 'La sesión ha expirado o el token es inválido. Inicia sesión nuevamente.',
        },
      },
      { status: 401 }
    );
  }

  // ── 3. Forward request to n8n with GHL credentials ───────────────────────
  const { action, dateRange } = body;

  const n8nPayload = {
    action,
    dateRange,
    ghlLocationId: dbUser.ghlLocationId,
    userToken: token,
  };

  try {
    const n8nRes = await fetch(N8N_GATEWAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(n8nPayload),
    });

    const responseText = await n8nRes.text();

    if (!n8nRes.ok) {
      console.error('[gateway] n8n returned error:', n8nRes.status, responseText);
      return NextResponse.json(
        {
          success: false,
          payload: {
            success: false,
            errorCode: 'UNKNOWN_ERROR',
            message: `Error del backend n8n (${n8nRes.status}): ${responseText}`,
          },
        },
        { status: 502 }
      );
    }

    // Pass through the n8n response as-is
    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        {
          success: false,
          payload: {
            success: false,
            errorCode: 'UNKNOWN_ERROR',
            message: `n8n no devolvió JSON válido: ${responseText}`,
          },
        },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error('[gateway] Network error calling n8n:', err);
    return NextResponse.json(
      {
        success: false,
        payload: {
          success: false,
          errorCode: 'UNKNOWN_ERROR',
          message: `Error de red al conectar con n8n: ${err?.message ?? 'Error desconocido'}`,
        },
      },
      { status: 503 }
    );
  }
}
