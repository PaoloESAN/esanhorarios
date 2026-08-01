# Servidor de Notificaciones (Web Push)

Servidor independiente (Bun + Elysia) que detecta nuevos archivos `.xlsx` en el panel de la universidad y envía notificaciones Web Push a los suscriptores del frontend.

## Desarrollo

```bash
bun install
bun run dev
```

## Producción

```bash
bun install
bun run start
```

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `VAPID_PUBLIC_KEY` | Clave pública VAPID |
| `VAPID_PRIVATE_KEY` | Clave privada VAPID |
| `VAPID_SUBJECT` | Opcional. `mailto:...` para VAPID |
| `TARGET_URL` | URL del panel de la universidad con los `.xlsx` |
| `SESSION_COOKIE` | Cookie de sesión para `TARGET_URL` |
| `DATA_FILE` | Opcional. Ruta del JSON de persistencia (usa un Volume de Railway para sobrevivir deploys) |
| `PORT` | Puerto (Railway lo asigna) |

Ver la sección "Sistema de Notificaciones" en el README raíz del proyecto para el flujo completo con el frontend (Vercel).
