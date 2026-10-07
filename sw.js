// Network-first: онлайн всегда свежая версия, офлайн работает копия из кэша.
const CACHE = 'burger-shell-v1';
const SHELL = ['burger-app.html', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r.url.split('?')[0], copy)); }
    return res;
  }).catch(() => caches.match(r.url.split('?')[0]).then(m => m || caches.match('burger-app.html'))));
});
