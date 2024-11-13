/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from "workbox-precaching";

// Utilisation de Workbox pour précacher les fichiers générés automatiquement par Webpack
precacheAndRoute(self.__WB_MANIFEST);

// Ajout d'un cache dynamique pour les autres requêtes non précachées
self.addEventListener("fetch", (event) => {
  // Vérifie que la requête est de type GET pour éviter les erreurs de mise en cache avec POST
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((fetchResponse) => {
          return caches.open("dynamic-cache-v1").then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        })
      );
    })
  );
});

// Gestion de l'activation du service worker pour nettoyer les caches obsolètes
self.addEventListener("activate", (event) => {
  const cacheWhitelist = ["pwa-cache-v1", "dynamic-cache-v1"];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
