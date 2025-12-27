const CACHE_NAME = 'night-prayer-v1';

const STATIC_ASSETS = [
	'./',
	'./manifest.json',
	'./icons/icon-192.png',
	'./icons/icon-512.png'
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(STATIC_ASSETS);
		})
	);
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter((name) => name !== CACHE_NAME)
					.map((name) => caches.delete(name))
			);
		})
	);
	self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	// Skip non-GET requests and external requests
	if (event.request.method !== 'GET') return;

	const url = new URL(event.request.url);

	// Skip Google Fonts and external resources
	if (url.origin !== location.origin) return;

	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			if (cachedResponse) {
				// Return cache but update in background
				event.waitUntil(
					fetch(event.request).then((response) => {
						if (response.ok) {
							caches.open(CACHE_NAME).then((cache) => {
								cache.put(event.request, response);
							});
						}
					}).catch(() => {})
				);
				return cachedResponse;
			}

			return fetch(event.request).then((response) => {
				if (response.ok) {
					const responseClone = response.clone();
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, responseClone);
					});
				}
				return response;
			}).catch(() => {
				// Return offline fallback for navigation requests
				if (event.request.mode === 'navigate') {
					return caches.match('./');
				}
			});
		})
	);
});
