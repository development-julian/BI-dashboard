import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/server/db';
import { verifyToken } from '@/lib/server/jwt';

// La URL real de tu servidor n8n
const N8N_TARGET_URL = 'https://n8n.growtzy.com/webhook/api/v1/gateway';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, dateRange, userToken } = body;

    console.log('[DEBUG GATEWAY] Incoming userToken:', userToken ? userToken.substring(0, 10) + '...' : 'EMPTY');

    // 1. Verificar la sesión
    const payload = verifyToken(userToken);
    if (!payload || !payload.email) {
      return NextResponse.json({
        success: false,
        payload: {
          success: false,
          errorCode: 'SESSION_EXPIRED',
          message: 'La sesión ha expirado o el token es inválido. Inicia sesión nuevamente.'
        }
      }, { status: 401 });
    }

    // 2. Buscar al usuario y sus credenciales seguras
    const user = findUserByEmail(payload.email);
    if (!user) {
      return NextResponse.json({
        success: false,
        payload: {
          success: false,
          errorCode: 'SESSION_EXPIRED',
          message: 'El usuario ya no existe.'
        }
      }, { status: 401 });
    }

    // 3. Hacer la petición real a n8n, pasándole las credenciales seguras
    // Nota: El frontend nos enviaba un ghlLocationId, pero por seguridad, 
    // usamos exclusivamente el que está guardado en nuestro backend (user.ghlLocationId)
    const n8nResponse = await fetch(N8N_TARGET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action,
        dateRange,
        ghlLocationId: user.ghlLocationId,
        ghlApiKey: user.ghlApiKey
      })
    });

    if (!n8nResponse.ok) {
      return NextResponse.json({
        success: false,
        message: `Error comunicándose con n8n: Status ${n8nResponse.status}`
      }, { status: 502 });
    }

    const n8nData = await n8nResponse.json();
    
    // 4. Devolver la respuesta al frontend tal cual como vino de n8n
    return NextResponse.json(n8nData);

  } catch (error) {
    console.error('Gateway Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error interno en el servidor gateway.'
    }, { status: 500 });
  }
}
