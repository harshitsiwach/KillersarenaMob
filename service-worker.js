const CACHE_NAME = 'killers-arena-mob-cache-v1';
const urlsToCache = [
  'index.html',
  'Build/KA-Mob.data',
  'Build/KA-Mob.framework.js',
  'Build/KA-Mob.loader.js',
  'Build/KA-Mob.wasm',
  'TemplateData/favicon.ico',
  'TemplateData/fullscreen-button.png',
  'TemplateData/progress-bar-empty-dark.png',
  'TemplateData/progress-bar-empty-light.png',
  'TemplateData/progress-bar-full-dark.png',
  'TemplateData/progress-bar-full-light.png',
  'TemplateData/style.css',
  'TemplateData/unity-logo-dark.png',
  'TemplateData/unity-logo-light.png',
  'TemplateData/webgl-logo.png',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the response to be consumed by the cache
            // and the app, we need to clone it.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', function(event) {

  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});