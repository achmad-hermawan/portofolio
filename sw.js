const CACHE_NAME = 'portfolio-v3.0-clean';

// PERBAIKAN PATH:
// Hapus 'assets/css/' dan 'assets/js/' karena file sekarang ada di root (sejajar index.html)
const URLS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './assets/css/style.css',   
    './assets/js/script.js',   
    './images/profil.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// 1. INSTALL
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Opened Cache');
                return cache.addAll(URLS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// 2. ACTIVATE
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 3. FETCH
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});