const CACHE_NAME = 'portfolio-cache-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/js/script.js',
  '/images/profil.png',
  '/images/icons/profil.png',
  // Tambahkan file-file penting lainnya (misalnya, gambar proyek) jika perlu
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache dibuka');
        return cache.addAll(urlsToCache); 
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request); 
      })
  );
});