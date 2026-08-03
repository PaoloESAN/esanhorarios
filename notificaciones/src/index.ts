import { Elysia } from 'elysia';
import cors from '@elysia/cors';
import { cron } from '@elysia/cron';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import * as cheerio from 'cheerio';
import webpush from 'web-push';

// Configuración de Llaves VAPID
const publicVapidKey = process.env.VAPID_PUBLIC_KEY || '';
const privateVapidKey = process.env.VAPID_PRIVATE_KEY || '';
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@esanhorarios.com';

if (publicVapidKey && privateVapidKey) {
  webpush.setVapidDetails(vapidSubject, publicVapidKey, privateVapidKey);
} else {
  console.warn('⚠️ ADVERTENCIA: Las llaves VAPID no están configuradas en las variables de entorno.');
}

// Persistencia en disco (sobrevive reinicios de Railway; usa un Volumen si quieres que dure entre deploys)
const DATA_FILE = process.env.DATA_FILE || './data/notificaciones.json';

interface PersistedData {
  subscriptions: webpush.PushSubscription[];
  processedFiles: string[];
}

function loadData(): PersistedData {
  try {
    if (existsSync(DATA_FILE)) {
      const parsed = JSON.parse(readFileSync(DATA_FILE, 'utf-8')) as Partial<PersistedData>;
      return {
        subscriptions: Array.isArray(parsed.subscriptions) ? parsed.subscriptions : [],
        processedFiles: Array.isArray(parsed.processedFiles) ? parsed.processedFiles : [],
      };
    }
  } catch (error) {
    console.error('No se pudo leer el archivo de datos:', error);
  }
  return { subscriptions: [], processedFiles: [] };
}

function saveData() {
  try {
    mkdirSync(dirname(DATA_FILE), { recursive: true });
    writeFileSync(DATA_FILE, JSON.stringify({ subscriptions, processedFiles: [...processedFiles] }, null, 2));
  } catch (error) {
    console.error('No se pudo guardar el archivo de datos:', error);
  }
}

const stored = loadData();
let subscriptions: webpush.PushSubscription[] = stored.subscriptions;
const processedFiles = new Set<string>(stored.processedFiles);

const TARGET_URL = process.env.TARGET_URL || 'https://tu-universidad.edu.pe/panel/horarios';
const COOKIE_SESSION = process.env.SESSION_COOKIE || '';

// Función del Scraper (Polling HTTP)
async function checkSchedule(): Promise<{ allFiles: string[]; newFiles: string[]; error?: string }> {
  console.log(`[${new Date().toISOString()}] 🔍 Verificando nuevos archivos .xlsx en la universidad...`);

  try {
    // Petición HTTP directa pasando cookies
    const res = await fetch(TARGET_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Cookie': COOKIE_SESSION,
      },
    });

    if (!res.ok) {
      throw new Error(`Error en respuesta HTTP: ${res.status} ${res.statusText}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const allFiles: string[] = [];
    const newFiles: string[] = [];

    // Ignora los archivos de talleres
    const isNormalSchedule = (fileUrl: string) => {
      const fileName = decodeURIComponent(new URL(fileUrl).pathname.split('/').pop() || fileUrl);
      return !/taller/i.test(fileName);
    };

    // Parseo de enlaces .xlsx (solo horarios normales, se ignoran talleres)
    $('a[href*=".xlsx"], a[href*=".XLSX"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        // Convertir URL relativa a absoluta
        const fullUrl = new URL(href, TARGET_URL).href;

        if (!isNormalSchedule(fullUrl)) return;

        allFiles.push(fullUrl);

        if (!processedFiles.has(fullUrl)) {
          processedFiles.add(fullUrl);
          newFiles.push(fullUrl);
        }
      }
    });

    if (newFiles.length > 0) {
      saveData();
      console.log(`¡Se encontraron ${newFiles.length} archivo(s) .xlsx nuevo(s)!`);

      // Detecta si algún archivo nuevo contiene "horario" en su nombre
      const fileName = (fileUrl: string) =>
        decodeURIComponent(new URL(fileUrl).pathname.split('/').pop() || fileUrl);
      const archivoHorario = newFiles.find((fileUrl) => /horari/i.test(fileName(fileUrl)));

      if (archivoHorario) {
        const versionMatch = fileName(archivoHorario).match(/v[-._\s]*(\d+)/i);
        const version = versionMatch ? versionMatch[1] : '?';
        console.log(`Nueva Versión V${version} del horario`);
        await sendPushNotification('¡Nuevo Horario Detectado!', `Nueva Versión V${version} del horario`, TARGET_URL);
      }
    }

    console.log(`Total de archivos .xlsx en la página: ${allFiles.length}`);
    for (const fileUrl of allFiles) {
      console.log(`  - ${fileUrl}`);
    }

    return { allFiles, newFiles };
  } catch (error) {
    console.error('Error durante la verificación:', error);
    return { allFiles: [], newFiles: [], error: error instanceof Error ? error.message : String(error) };
  }
}

// Envío de Notificaciones Web Push
async function sendPushNotification(title: string, body: string, url: string) {
  const payload = JSON.stringify({ title, body, url });

  const activeSubscriptions: webpush.PushSubscription[] = [];

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
      activeSubscriptions.push(sub); // Mantener suscripciones válidas
    } catch (err: any) {
      // Si la suscripción expiró o fue revocada (status 410 o 404), la descartamos
      if (err.statusCode === 410 || err.statusCode === 404) {
        console.log('Eliminando suscripción expirada.');
      } else {
        console.error('Error al enviar Web Push:', err);
        activeSubscriptions.push(sub);
      }
    }
  }

  subscriptions = activeSubscriptions;
  saveData();
}

// Instancia del Servidor ElysiaJS
const app = new Elysia()
  .use(cors())
  .get('/health', () => ({ status: 'ok' }))

  // Ejecuta el scraper al momento y devuelve los .xlsx encontrados (útil para probar)
  .get('/check', async () => {
    const result = await checkSchedule();
    return {
      ...result,
      lastCheck: new Date().toISOString(),
    };
  })

  // El frontend obtiene la clave pública para suscribirse
  .get('/vapid-public-key', () => ({ publicKey: publicVapidKey }))

  // Endpoint donde el frontend registra la suscripción push
  .post('/subscribe', ({ body }: { body: unknown }) => {
    const sub = body as webpush.PushSubscription;
    if (sub && sub.endpoint && sub.keys?.p256dh && sub.keys?.auth) {
      if (!subscriptions.some(s => s.endpoint === sub.endpoint)) {
        subscriptions.push(sub);
        saveData();
        console.log('Nueva suscripción registrada.');
      }
      return { success: true, message: 'Suscrito a notificaciones' };
    }
    return { success: false, message: 'Suscripción inválida' };
  })

  // Endpoint para eliminar una suscripción (por ejemplo, cuando el usuario desactiva)
  .post('/unsubscribe', ({ body }: { body: unknown }) => {
    const { endpoint } = (body ?? {}) as { endpoint?: string };
    if (!endpoint) {
      return { success: false, message: 'Endpoint faltante' };
    }
    const before = subscriptions.length;
    subscriptions = subscriptions.filter(s => s.endpoint !== endpoint);
    if (subscriptions.length !== before) {
      saveData();
      console.log('🧹 Suscripción eliminada.');
    }
    return { success: true, message: 'Suscripción eliminada' };
  })

  // Endpoint de prueba: envía una notificación simple a todos los suscriptores
  .post('/send-test', async () => {
    const count = subscriptions.length;
    if (count === 0) {
      return { success: false, message: 'No hay suscripciones registradas' };
    }
    await sendPushNotification('🔔 Prueba', 'Esta es una notificación de prueba.', TARGET_URL);
    return { success: true, message: `Notificación de prueba enviada a ${count} suscriptor(es)` };
  })

  // Tarea programada (Polling cada 5 minutos)
  .use(
    cron({
      name: 'xlsx-poller',
      pattern: '*/5 * * * *',
      run() {
        checkSchedule();
      }
    })
  )
  .listen(process.env.PORT || 3000);

console.log(`🚀 Servidor ElysiaJS corriendo en http://${app.server?.hostname}:${app.server?.port}`);
