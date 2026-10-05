/* หน้าครอบแอปมือถือ BW (PWA) — ฝังหน้า Apps Script เต็มจอ
 * เปิดในเบราว์เซอร์ (ยังไม่ติดตั้ง) -> หน้า "ติดตั้งแอป" ก่อน (Android: ปุ่มติดตั้ง · iPhone: บอกขั้นตอนปุ่มแชร์) · กด "ใช้ในเบราว์เซอร์" ข้ามได้
 * เปิดจากไอคอน (standalone) -> ฝังหน้า Apps Script · หน้าในส่ง postMessage 'bw-ready' เมื่อโหลดผ่าน
 *   ไม่มาใน WAIT ms = ฝังไม่ได้ (มักเป็น iPhone กันคุกกี้) -> ปุ่มเปิดแบบเต็ม + จำไว้เฉพาะในแอปที่ติดตั้ง · ?reset ล้างที่จำไว้ */
(function () {
  var b = document.body, URL_ = b.getAttribute('data-exec'), KEY = 'bw-full:' + b.getAttribute('data-app'), WAIT = 9000, ok = false;
  var $ = function (id) { return document.getElementById(id); };
  function store(fn) { try { return fn(window.localStorage); } catch (e) { return null; } }
  if (/[?&]reset\b/.test(location.search)) store(function (s) { s.removeItem(KEY); });

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('../sw.js', { scope: './' }).catch(function () {});

  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var mobile = ios || /android|mobile/i.test(navigator.userAgent);
  var prompt = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); prompt = e; b.classList.add('can-install'); });
  window.addEventListener('appinstalled', function () { b.classList.add('installed'); });

  $('go').href = URL_;
  $('go').onclick = function (e) { e.preventDefault(); if (standalone) store(function (s) { s.setItem(KEY, '1'); }); location.href = URL_; };
  $('inst').onclick = function () {
    if (prompt) { prompt.prompt(); prompt.userChoice.then(function () { prompt = null; b.classList.remove('can-install'); }); }
    else b.classList.add('show-steps');
  };
  $('skip').onclick = function (e) { e.preventDefault(); start(); };

  function start() {
    b.className = '';
    if (standalone && store(function (s) { return s.getItem(KEY); })) { location.replace(URL_); return; }
    window.addEventListener('message', function (e) {
      if (e.data === 'bw-ready' && /\.googleusercontent\.com$|^https:\/\/script\.google\.com$/.test(e.origin)) { ok = true; b.className = 'ready'; }
    });
    $('f').src = URL_;
    setTimeout(function () { if (!ok) b.className = 'fallback'; }, WAIT);
  }

  if (standalone) start();
  else b.className = 'install' + (ios ? ' ios' : mobile ? ' android' : ' desktop');
})();
