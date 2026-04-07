// PWA en Rails - Demo 3 | RubySur - 13/04/2026
// app/views/pwa/service-worker.js
const CACHE_NAME = "doctors-v1"

// 1. Install: pre-cachear la página offline
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(["/offline.html"]))
  )
  self.skipWaiting()
})

// 2. Activate: limpiar caches viejos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((n) => n !== CACHE_NAME)
          .map((n) => caches.delete(n))
      )
    )
  )
  self.clients.claim()
})

// 3. Fetch: estrategia mixta
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  // Assets estáticos → Cache First (instantáneo)
  if (url.pathname.match(/\.(css|js|png|jpg|svg|woff2)$/)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached
        return fetch(event.request).then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, clone))
          return response
        })
      })
    )
    return
  }

  // Navegación HTML → Network First con fallback offline
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match("/offline.html"))
    )
    return
  }
})
