// This is an empty service worker file
// It exists to prevent MIME type errors when the browser requests it
// The actual service worker functionality is disabled in the app

// Self-destroying service worker
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Return empty for all fetch requests
self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});