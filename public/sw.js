
// Service Worker for Risk Reward Reflector Trading Journal PWA

const CACHE_NAME = 'risk-reward-reflector-v1';
const OFFLINE_URL = '/offline.html';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  // Add CSS and JS files that will be generated in the build process
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or fetch from network
self.addEventListener('fetch', (event) => {
  // Exclude Supabase API requests from caching
  if (event.request.url.includes('supabase.co')) {
    return;
  }

  // For non-API requests, implement stale-while-revalidate strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the response from the cached version
        if (response) {
          // Still fetch the resource in the background to update cache
          fetch(event.request).then((networkResponse) => {
            if (networkResponse) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            }
          });
          return response;
        }

        // Not in cache - fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Cache the fetched resource
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch(() => {
            // Network request failed, check if it's a navigation request
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
          });
      })
  );
});

// Background sync for trades created while offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-trades') {
    event.waitUntil(syncOfflineTrades());
  }
});

// Function to sync offline trades
async function syncOfflineTrades() {
  try {
    const offlineTradesRequest = await self.indexedDB.open('offlineTrades', 1);
    // Implementation would pull from IndexedDB and sync with Supabase
    // This is a placeholder for the background sync functionality
    
    // We would need a more complex implementation with proper IndexedDB setup
    // and integration with Supabase client to actually sync the trades
  } catch (error) {
    console.error('Error syncing offline trades:', error);
  }
}
