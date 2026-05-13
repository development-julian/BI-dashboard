// ─────────────────────────────────────────────────────────────────────────────
// BASE DE DATOS SIMULADA (SERVER-SIDE ONLY)
// Este archivo nunca llegará al navegador. Aquí guardamos las credenciales reales
// de GoHighLevel y las contraseñas de los usuarios.
// ─────────────────────────────────────────────────────────────────────────────

export interface UserDB {
  email: string;
  passwordHash: string; // En un entorno real, sería un hash de bcrypt
  role: string;
  ghlLocationId: string;
  ghlApiKey: string;
}

// Simulamos los usuarios que antes estaban en n8n
export const USERS_DB: UserDB[] = [
  {
    email: 'demo@growtzy.com',
    passwordHash: 'demo123', // En producción, hashea esto
    role: 'admin',
    ghlLocationId: 'PLsKcTpoijAF5iHuqikq',
    ghlApiKey: 'pit-70227a18-e313-4fc3-8eec-dc222a01f497',
  },
  {
    email: 'andres@empresa.com',
    passwordHash: 'miContraseña123',
    role: 'admin',
    ghlLocationId: 'PLsKcTpoijAF5iHuqikq9',
    ghlApiKey: 'pit-ejemplo-api-key',
  }
];

export function findUserByEmail(email: string): UserDB | undefined {
  return USERS_DB.find(u => u.email.toLowerCase() === email.toLowerCase());
}
