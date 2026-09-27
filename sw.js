// Service worker: permite instalar la app y usarla sin internet.
// Sube CACHE cuando cambies archivos para forzar la actualización en el celular.
const CACHE = 'nanatsu-v12';
const APP = ['./', './index.html', './niveles.js', './sync.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);

    // Archivos propios: primero la red (para recibir actualizaciones), si no hay internet, la copia guardada.
    if (url.origin === location.origin) {
        e.respondWith(
            fetch(req)
                .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
                .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
        );
        return;
    }

    // Imágenes de la wiki y fuentes: no se interceptan. Sus respuestas son opacas (no se puede saber
    // si fallaron), y guardarlas podía dejar una imagen "rota" en caché para siempre.
});
