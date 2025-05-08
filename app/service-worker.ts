/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope

const CACHE_NAME = "acadguide-cache-v1"

// Resources to cache
const STATIC_RESOURCES = [
  "/",
  "/dashboard/student",
  "/dashboard/instructor",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
]

// Install event - cache static resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_RESOURCES)
    }),
  )

  // Activate immediately
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME).map((cacheName) => caches.delete(cacheName)),
      )
    }),
  )

  // Take control of all clients
  self.clients.claim()
})

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return

  // Skip browser-extension requests and non-http requests
  if (!event.request.url.startsWith("http")) return

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if available
      if (cachedResponse) {
        return cachedResponse
      }

      // Otherwise fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache if response is not valid
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response to cache it and return it
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // If network request fails and we don't have a cached response,
          // return a fallback page for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("/")
          }

          return new Response("Network error occurred", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
          })
        })
    }),
  )
})

// Handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

export {}
