# N8N Auth Endpoint — Payload & Response Specification

**Endpoint:** `POST https://n8n.growtzy.com/webhook/api/v1/auth`  
**Triggered by:** Frontend login form  
**Transport security:** HTTPS (TLS) — credentials are sent as plain text in the body, protected by transport encryption.

---

## 1. Request Payload

```json
{
  "action":   "LOGIN",
  "username": "andres@empresa.com",
  "password": "miContraseña123"
}
```

| Campo      | Tipo   | Descripción                                      |
|------------|--------|--------------------------------------------------|
| `action`   | string | Siempre `"LOGIN"` — identifica la operación      |
| `username` | string | Email o nombre de usuario ingresado en el form   |
| `password` | string | Contraseña en texto plano (protegida por TLS)    |

---

## 2. Respuestas esperadas

### 2.1 ✅ Login exitoso — HTTP 200

```json
{
  "success": true,
  "payload": {
    "success": true,
    "user": {
      "userId":     "usr_abc123",
      "username":   "andres@empresa.com",
      "email":      "andres@empresa.com",
      "role":       "admin",
      "locationId": "PLsKcTpoijAF5iHuqikq9",
      "token":      "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      "expiresAt":  "2025-05-06T21:00:00.000Z"
    }
  }
}
```

**Acción del frontend:** Guarda la sesión en `localStorage` (`nexusdash_session`) y redirige a `/dashboard`.

---

### 2.2 ❌ Usuario no existe — HTTP 200 (o 401)

```json
{
  "success": false,
  "payload": {
    "success":   false,
    "errorCode": "INVALID_USERNAME",
    "message":   "El usuario no fue encontrado en la base de datos."
  }
}
```

**Acción del frontend:** Muestra banner: *"El usuario no existe. Verifica e inténtalo de nuevo."*

---

### 2.3 ❌ Contraseña incorrecta — HTTP 200 (o 401)

```json
{
  "success": false,
  "payload": {
    "success":   false,
    "errorCode": "INVALID_PASSWORD",
    "message":   "La contraseña es incorrecta."
  }
}
```

**Acción del frontend:** Muestra banner: *"Contraseña incorrecta. Verifica e inténtalo de nuevo."*

---

### 2.4 🚫 Usuario sin permisos — HTTP 200 (o 403)

```json
{
  "success": false,
  "payload": {
    "success":   false,
    "errorCode": "NO_PERMISSIONS",
    "message":   "Tu cuenta no tiene permisos para acceder al dashboard."
  }
}
```

**Acción del frontend:** Muestra banner: *"Tu cuenta no tiene permisos para acceder al dashboard."* No redirige.

---

### 2.5 ⏰ Sesión expirada (flujos secundarios) — HTTP 200 (o 401)

```json
{
  "success": false,
  "payload": {
    "success":   false,
    "errorCode": "SESSION_EXPIRED",
    "message":   "La sesión ha expirado. Inicia sesión nuevamente."
  }
}
```

**Acción del frontend:** Limpia `localStorage`, muestra banner, redirige a `/login`.

---

### 2.6 🔴 Error de servidor — HTTP 500

El frontend captura cualquier respuesta no-`200` como `UNKNOWN_ERROR`. No se requiere cuerpo específico del servidor.

**Acción del frontend:** Muestra banner: *"Ocurrió un error inesperado. Inténtalo de nuevo."*

---

### 2.7 📡 Error de red / timeout

El frontend usa `AbortSignal.timeout(10_000)`. Si la petición excede 10 segundos o falla la conexión:

**Acción del frontend:** Muestra banner: *"No se pudo conectar con el servidor. Verifica tu conexión."*

---

## 3. Campos que el frontend espera en `user`

| Campo        | Tipo   | Requerido | Descripción                                              |
|--------------|--------|-----------|----------------------------------------------------------|
| `userId`     | string | ✅        | ID único del usuario en la base de datos                 |
| `username`   | string | ✅        | Nombre o email del usuario                               |
| `email`      | string | ⬜        | Email del usuario (para mostrar en UI)                   |
| `role`       | string | ⬜        | Rol: `"admin"`, `"viewer"`, etc.                         |
| `locationId` | string | ✅        | GHL Location ID — reemplaza el hardcoded anterior        |
| `token`      | string | ✅        | Token de sesión — se enviará en cada request al gateway  |
| `expiresAt`  | string | ⬜        | ISO 8601 — si no se envía, el cliente asume 8 h          |

> **Nota sobre `locationId`:** Este campo reemplaza el valor hardcodeado `"PLsKcTpoijAF5iHuqikq9"` que existía en `api.ts`. A partir de ahora, `ghlLocationId` que se envía al gateway `POST /api/v1/gateway` proviene del objeto de sesión guardado en `localStorage`.

---

## 4. Formato alternativo (respuesta plana sin `payload`)

El frontend también acepta respuesta **sin el wrapper `payload`**:

```json
{
  "success": true,
  "user": { ... }
}
```

```json
{
  "success":   false,
  "errorCode": "INVALID_PASSWORD",
  "message":   "..."
}
```

La función `loginWithN8n` en `src/lib/auth.ts` evalúa `body?.payload ?? body` para cubrir ambos formatos.

---

## 5. Código de mapeo (referencia)

```typescript
// src/lib/auth.ts
const errorCode: AuthErrorCode = mapErrorCode(payload?.errorCode ?? payload?.error_code);
```

El backend puede enviar `errorCode` en camelCase o `error_code` en snake_case — ambos son aceptados.

---

## 6. Diagrama de flujo

```
[Usuario] → POST /auth {action, username, password}
               │
        ┌──────▼────────────────────────────────────────────┐
        │              N8N Webhook                           │
        │  1. Buscar usuario en BD por username              │
        │  2. Si no existe → errorCode: INVALID_USERNAME     │
        │  3. Verificar contraseña                           │
        │  4. Si no coincide → errorCode: INVALID_PASSWORD   │
        │  5. Verificar rol/permisos                         │
        │  6. Si sin acceso → errorCode: NO_PERMISSIONS      │
        │  7. Generar token + calcular expiresAt             │
        │  8. Responder con { success: true, user: {...} }   │
        └────────────────────────────────────────────────────┘
               │
        [Frontend] → guarda sesión → redirige a /dashboard
```
