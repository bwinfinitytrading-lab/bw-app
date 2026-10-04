/* service worker ขั้นต่ำ — ให้ Android ขึ้นปุ่ม "ติดตั้งแอป" · ถามเน็ตใหม่ทุกครั้ง (no-cache) ไม่ใช้ของเก่าในเครื่อง
 * v3: แก้ลิงก์แล้วแอปที่ติดตั้งไว้ต้องเห็นของใหม่ทันที ไม่ต้องรอแคช 10 นาทีของ GitHub Pages */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;
  e.respondWith(fetch(u.href, { cache: 'no-cache', credentials: 'same-origin' }));
});
