const version = "0.9-adjst";
const cacheName = `praytime-${version}`;
self.addEventListener("install", (e) => {
	e.waitUntil(
		caches.open(cacheName).then((cache) => {
			return cache
				.addAll([
					`./`,
					`./index.html`,
					`./js/vue.global.min.js`,
					`./js/adhan.umd.min.js`,
					`./js/dayjs.min.js`,
					`./js/duration.js`,
					`./style.css`,
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
