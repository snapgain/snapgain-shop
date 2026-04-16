/* global self */
/* eslint-disable no-restricted-globals */

const CACHE_NAME = "snapgain-ebook-v2"; // ✅ mudei para v2 pra forçar refresh do cache
const OFFLINE_URL = "/offline.html";

const CACHE_ASSETS = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Install event - cache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
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
  self.clients.claim();
});

// Fetch event - network first, fallback to cache/offline
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Skip chrome extensions and other non-http requests
  if (!event.request.url.startsWith("http")) return;

  // ✅ NÃO interferir com Supabase / APIs
  if (event.request.url.includes("supabase.co") || event.request.url.includes("/api/")) {
    return; // deixa o browser lidar direto
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // ✅ Se falhar/for inválido, não cacheia
        if (!response || response.status !== 200) return response;

        // Cachea arquivos "normais" do app
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(async () => {
        // Network failed → tenta cache
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;

        // ✅ Se for navegação (abrir página), serve offline.html
        if (event.request.mode === "navigate") {
          const offline = await caches.match(OFFLINE_URL);
          return offline || new Response("Offline", { status: 503 });
        }

        return new Response("Offline", { status: 503 });
      })
  );
});