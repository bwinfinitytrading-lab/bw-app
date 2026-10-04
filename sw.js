/* service worker ขั้นต่ำ — ให้ Android ขึ้นปุ่ม "ติดตั้งแอป" · ส่งต่อไปเน็ตทุกครั้ง ไม่แคช (ข้อมูลต้องสดเสมอ) */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(fetch(e.request));
});
