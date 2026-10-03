/* service worker ขั้นต่ำ — ให้ Android ขึ้นปุ่ม "ติดตั้งแอป" · ไม่แคชอะไร (ข้อมูลต้องสดเสมอ) */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function () {});
