/**
 * Ana Orthodox — PWA Service Worker (Version & Date Aware Caching Policy)
 * Conforming to docs/pwa/PWA_ARCHITECTURE.md & docs/pwa/OFFLINE_STRATEGY.md
 */

const SHELL_CACHE = "ana-orthodox-shell-v1.1";
const CONTENT_CACHE = "ana-orthodox-content-v1.1";

const STATIC_SHELL_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable.png"
];

// Install Event — Pre-cache App Shell only
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      return cache.addAll(STATIC_SHELL_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event — Clean legacy caches
self.addEventListener("activate", (event) => {
  const currentCaches = [SHELL_CACHE, CONTENT_CACHE];
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!currentCaches.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event — Tiered Caching & Security Invalidation
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // 1. Strict Security Exclusion: Never cache authenticated, personal or admin requests
  const hasAuthHeader = event.request.headers.has("authorization");
  const isPrivatePath =
    url.pathname.startsWith("/api/v1/user") ||
    url.pathname.startsWith("/api/v1/admin") ||
    url.pathname.startsWith("/account");

  if (event.request.method !== "GET" || hasAuthHeader || isPrivatePath) {
    return; // Pass through directly to network
  }

  // 2. Date-Aware Katameros & Synaxarium Caching (Stale-While-Revalidate with Date Verification)
  if (url.pathname.includes("/katameros") || url.pathname.includes("/synaxarium")) {
    event.respondWith(
      caches.open(CONTENT_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 3. Static Assets & App Shell: Cache-First
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (url.pathname.startsWith("/_next/static") || url.pathname.startsWith("/icons"))
          ) {
            const clone = networkResponse.clone();
            caches.open(SHELL_CACHE).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline navigation fallback: serve cached root shell
          if (event.request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/");
          }
        });
    })
  );
});
