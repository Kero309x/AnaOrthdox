// v9 safety worker: no fetch interception and no response caching.
// Retire only this application's inherited caches, never other apps' caches.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => /^ana-orthodox-(shell|content)-/.test(key)).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});
