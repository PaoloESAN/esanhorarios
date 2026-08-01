self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    console.error('[SW] Error al parsear el push payload:', error);
  }

  const title = data.title || '¡Nuevo Horario Detectado!';
  const options = {
    body: data.body || 'Se ha publicado un nuevo archivo en la plataforma.',
    icon: data.icon || '/icon.png',
    badge: data.badge || '/badge.png',
    data: { url: data.url || '/' },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if ('focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow(url);
      })
  );
});
