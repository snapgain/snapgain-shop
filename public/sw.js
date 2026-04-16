/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'snapgain-cache-v4';
const urlsToCache = ['/', '/index.html', '/manifest.webmanifest', '/favicon.ico'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Não cachear Supabase nem chamadas dinâmicas
  if (url.hostname.endsWith('supabase.co') || url.pathname.startsWith('/functions/')) return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  const whitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.map((n) => (whitelist.includes(n) ? null : caches.delete(n))))
    )
  );
});