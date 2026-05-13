import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/server/db';

// Simple token: base64(email:timestamp:secret) — not cryptographic, fine for local dev
const SECRET = process.env.SESSION_SECRET ?? 'nexusdash-dev-secret-2024';

function makeToken(email: string): string {
  const payload = `${email}:${Date.now()}:${SECRET}`;
  return Buffer.from(payload).toString('base64url');
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, payload: { success: false, errorCode: 'UNKNOWN_ERROR', message: 'Request body must be JSON.' } },
      { status: 400 }
    );
  }

  const { username, password, action } = body ?? {};

  if (action !== 'LOGIN') {
    return NextResponse.json(
      { success: false, payload: { success: false, errorCode: 'UNKNOWN_ERROR', message: 'Invalid action.' } },
      { status: 400 }
    );
  }

  if (!username || !password) {
    return NextResponse.json(
      { success: false, payload: { success: false, errorCode: 'INVALID_USERNAME', message: 'Username and password are required.' } },
      { status: 400 }
    );
  }

  const dbUser = findUserByEmail(username.trim());

  if (!dbUser) {
    return NextResponse.json(
      { success: false, payload: { success: false, errorCode: 'INVALID_USERNAME', message: 'El usuario no existe.' } },
      { status: 401 }
    );
  }

  // Plain-text comparison (dev only — use bcrypt in production)
  if (dbUser.passwordHash !== password) {
    return NextResponse.json(
      { success: false, payload: { success: false, errorCode: 'INVALID_PASSWORD', message: 'Contraseña incorrecta.' } },
      { status: 401 }
    );
  }

  const token = makeToken(dbUser.email);
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(); // 8 hours

  // Set an httpOnly cookie as well (optional but helpful for SSR)
  const response = NextResponse.json({
    success: true,
    payload: {
      success: true,
      user: {
        userId: dbUser.email,
        username: dbUser.email,
        email: dbUser.email,
        role: dbUser.role,
        locationId: dbUser.ghlLocationId,
        token,
        expiresAt,
      },
    },
  });

  response.cookies.set('nexusdash_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 8 * 60 * 60, // 8 hours in seconds
  });

  return response;
}
