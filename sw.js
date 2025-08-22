const CACHE_NAME = 'xmode-v1.1.0';
const STATIC_CACHE = 'xmode-static-v1.1.0';
const DYNAMIC_CACHE = 'xmode-dynamic-v1.1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/favicon.svg',
  '/manifest.json',
  '/ICON2.png',
  '/404.html',
  '/robots.txt',
  '/sitemap.xml',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Cairo:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE).then(cache => {
                console.log('Opened static cache');
                return cache.addAll(urlsToCache);
            }),
            caches.open(DYNAMIC_CACHE).then(cache => {
                console.log('Opened dynamic cache');
                return cache;
            })
        ])
    );
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

// Fetch event with cache strategy
self.addEventListener('fetch', event => {
    const { request } = event;
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (request.destination === 'image') {
        // Cache images with cache-first strategy
        event.respondWith(
            caches.match(request).then(response => {
                return response || fetch(request).then(fetchResponse => {
                    return caches.open(DYNAMIC_CACHE).then(cache => {
                        cache.put(request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
        );
    } else if (request.destination === 'style' || request.destination === 'script') {
        // Cache CSS and JS with stale-while-revalidate strategy
        event.respondWith(
            caches.match(request).then(cachedResponse => {
                const fetchPromise = fetch(request).then(networkResponse => {
                    return caches.open(DYNAMIC_CACHE).then(cache => {
                        cache.put(request, networkResponse.clone());
                        return networkResponse;
                    });
                });
                return cachedResponse || fetchPromise;
            })
        );
    } else {
        // Default network-first strategy for other requests
        event.respondWith(
            fetch(request).then(response => {
                return caches.open(DYNAMIC_CACHE).then(cache => {
                    cache.put(request, response.clone());
                    return response;
                });
            }).catch(() => {
                return caches.match(request);
            })
        );
    }
});

// Activate event with cache cleanup
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Take control of all clients
            return self.clients.claim();
        })
    );
});

// Background sync for offline functionality
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// Push notification handling
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'X_MODE - New Update Available!',
        icon: '/ICON2.png',
        badge: '/ICON2.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Visit Website',
                icon: '/ICON2.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/ICON2.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('X_MODE', options)
    );
});

// Background sync function
function doBackgroundSync() {
    // Implement background sync logic here
    console.log('Background sync completed');
}

// Notification click handling
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Error handling
self.addEventListener('error', event => {
    console.error('Service Worker Error:', event.error);
});

// Unhandled rejection handling
self.addEventListener('unhandledrejection', event => {
    console.error('Service Worker Unhandled Rejection:', event.reason);
});
