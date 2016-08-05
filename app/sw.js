'use strict';

// In a service worker, `self` refers to the `ServiceWorkerGlobalScope` object:
// the service worker itself.
console.log('Started', self);

self.addEventListener('install', function(event) {
  // By default an old service worker will stay running until all tabs
  // that use it are closed or unloaded. A new service worker will remain in
  // the `waiting` state.
  // When `skipWaiting()` is called, the service worker will skip the
  // waiting state and immediately activate.
  // Handy for debugging.
  self.skipWaiting();
  console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});

self.addEventListener('push', function(event) {
  console.log('Push message', event);
  var title = 'Push message';
  event.waitUntil(
    self.registration.showNotification(title, {
      body: 'The Message',
      icon: 'images/icon.png',
      tag: 'my-tag'
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification click: tag', event.notification.tag);
  event.notification.close();
  var url = 'https://www.youtube.com/watch?v=L2e5aboF_ss';
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    })
    .then(function(windowClients) {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
