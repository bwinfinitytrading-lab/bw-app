/* หน้าครอบแอปมือถือ BW (PWA) — ฝังหน้า Apps Script เต็มจอ
 * หน้าในส่ง postMessage 'bw-ready' เมื่อโหลดผ่าน (ล็อกอินผ่าน) · ไม่มาใน WAIT ms = ฝังไม่ได้ (มักเป็น iPhone กันคุกกี้)
 * -> โชว์ปุ่มเปิดแบบเต็ม + จำไว้ (localStorage) ครั้งหน้าเปิดแบบเต็มทันที · ?reset ล้างที่จำไว้ */
(function () {
  var b = document.body, URL_ = b.getAttribute('data-exec'), KEY = 'bw-full:' + b.getAttribute('data-app'), WAIT = 9000;
  var ORIGIN = 'https://script.google.com', ok = false;
  function store(fn) { try { return fn(window.localStorage); } catch (e) { return null; } }
  if (/[?&]reset\b/.test(location.search)) store(function (s) { s.removeItem(KEY); });

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('../sw.js', { scope: './' }).catch(function () {});

  function full() { store(function (s) { s.setItem(KEY, '1'); }); location.href = URL_; }
  document.getElementById('go').onclick = full;
  document.getElementById('go').href = URL_;

  if (store(function (s) { return s.getItem(KEY); })) { location.replace(URL_); return; }

  var f = document.getElementById('f');
  window.addEventListener('message', function (e) {
    if (e.data === 'bw-ready' && /\.googleusercontent\.com$|^https:\/\/script\.google\.com$/.test(e.origin)) {
      ok = true; b.className = 'ready';
    }
  });
  f.src = URL_;
  setTimeout(function () { if (!ok) b.className = 'fallback'; }, WAIT);
})();
