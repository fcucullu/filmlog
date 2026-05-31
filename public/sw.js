self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  if (e.request.url.includes("/api/") || e.request.url.includes("supabase")) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
