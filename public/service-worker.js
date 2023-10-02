const version = "0.4-new";
const cacheName = `praytime-${version}`;
self.addEventListener("install", (e) => {
	e.waitUntil(
		caches.open(cacheName).then((cache) => {
			return cache
				.addAll([
					`./`,
					`./index.html`,
					`./js/prayerTimes.js`,
					`./js/salahItem.js`,
					`./js/vue.global.min.js`,
					`./style.css`,
					`./bg_pattern.svg`,
				])
				.then(() => self.skipWaiting());
		})
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches
			.open(cacheName)
			.then((cache) => cache.match(event.request, { ignoreSearch: true }))
			.then((response) => {
				return response || fetch(event.request);
			})
	);
});
