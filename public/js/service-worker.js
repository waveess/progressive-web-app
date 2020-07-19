const FILES_TO_CACHE = [
    "../index.html",
    "./idb.js",
    "./index.js",
    "../css/styles.css",
    "../icons/icon-72x72.png",
    "../icons/icon-96x96.png",
    "../icons/icon-128x128.png",
    "../icons/icon-144x144.png",
    "../icons/icon-152x152.png",
    "../icons/icon-192x192.png",
    "../icons/icon-384x384.png",
    "../icons/icon-512x512.png" 
];

const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

self.addEventListener('fetch', function(e) {
    console.log('fetch request:' + e.request.url)
    e.respondWith(
        caches.match(e.request)
        .then(function(request) {
            if(request) {
                console.log('responding with cache: ' + e.request.url)
                return request
            } else {
                console.log('file not cached, fetching: ' + e.request.url);
                return fetch(e.request);
            }
        })
    )
})