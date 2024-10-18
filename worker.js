const staticFiles = 'dev-offline-files';
const assets = [
    "./",
    "./index.html",
    "./user.html",
    "./admin/index.html",
    "./css/default.css",
    "./css/style.css",
    "./css/admin.css",
    "./css/user.css",
    "./css/theme-icon-anim.css",
    "./js/global.js",
    "./js/script.js",
    "./js/user.js",
    "./js/animations/custom.anim.js",
    "./assets/logo.svg",
    "./assets/logo.ico",
    "./assets/logo.png",
    "./manifest.json",
    "./js/loader.js"
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticFiles).then(cache => {
            cache.addAll(assets);
        })
    );
});

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request);
        })
    );
});