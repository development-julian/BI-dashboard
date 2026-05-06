import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/server/db';
import { signToken } from '@/lib/server/jwt';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('[DEBUG LOGIN] Incoming body:', body);
    const { action, username, password } = body;

    if (action !== 'LOGIN' || !username || !password) {
      return NextResponse.json({
        success: false,
        errorCode: 'MISSING_FIELDS',
        message: 'Faltan campos requeridos.'
      }, { status: 200 });
    }

    const user = findUserByEmail(username);
    if (!user) {
      return NextResponse.json({
        success: false,
        errorCode: 'INVALID_USERNAME',
        message: `Usuario no encontrado. Intentaste con: "${username}"`
      }, { status: 200 });
    }

    if (user.passwordHash !== password) {
      return NextResponse.json({
        success: false,
        errorCode: 'INVALID_PASSWORD',
        message: `Contraseña incorrecta para el usuario ${username}. Intentaste con: "${password}"`
      }, { status: 200 });
    }

    // Generar el token
    const token = signToken({ email: user.email });

    // La fecha de expiración para el frontend
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();

    // Guardar el token en una cookie para que los Server Components puedan leerlo
    const response = NextResponse.json({
      success: true,
      payload: {
        success: true,
        user: {
          userId: `usr_${Buffer.from(user.email).toString('base64').substring(0, 8)}`,
          username: user.email,
          email: user.email,
          role: user.role,
          locationId: user.ghlLocationId,
          token,
          expiresAt
        }
      }
    });

    response.cookies.set('nexusdash_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 8 * 60 * 60 // 8 hours
    });

    return response;

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({
      success: false,
      errorCode: 'UNKNOWN_ERROR',
      message: 'Error interno del servidor.'
    }, { status: 500 });
  }
}
