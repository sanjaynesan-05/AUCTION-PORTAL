// Basic service worker for caching static assets
const CACHE_NAME = 'ipl-auction-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Use addAll with proper error handling
        return Promise.all(
          STATIC_CACHE_URLS.map(url =>
            fetch(url)
              .then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                }
              })
              .catch(() => {
                // Silently ignore cache failures
              })
          )
        );
      })
      .catch(() => {
        // Continue even if caching fails
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all clients
  self.clients.claim();
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(response => {
            // Check if it's a valid response
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }
            
            // Clone and cache successful responses
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(() => {
                // Silently ignore cache errors
              });
            
            return response;
          })
          .catch(() => {
            // Return cached response if network fails
            return caches.match(event.request);
          });
      })
      .catch(() => {
        // Return nothing if all else fails
        return new Response('Network error', { status: 503 });
      })
  );
});