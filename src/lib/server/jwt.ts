import crypto from 'crypto';

const SECRET_KEY = process.env.AUTH_SECRET || 'super-secret-key-for-local-dev-change-in-prod';

export function signToken(payload: object, expiresInHours: number = 8): string {
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString();
  const tokenPayload = JSON.stringify({ ...payload, exp: expiresAt });
  
  const dataB64 = Buffer.from(tokenPayload).toString('base64');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(tokenPayload).digest('hex');
  
  return `${dataB64}.${signature}`;
}

export function verifyToken(token: string): any | null {
  if (!token) return null;
  
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  
  const [dataB64, signature] = parts;
  
  try {
    const payloadStr = Buffer.from(dataB64, 'base64').toString('utf8');
    const expectedSig = crypto.createHmac('sha256', SECRET_KEY).update(payloadStr).digest('hex');
    
    if (signature !== expectedSig) return null;
    
    const payload = JSON.parse(payloadStr);
    if (new Date() > new Date(payload.exp)) return null; // Expired
    
    return payload;
  } catch (e) {
    return null;
  }
}
