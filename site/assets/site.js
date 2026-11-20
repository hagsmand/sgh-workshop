// Helpers for the workshop pages. No framework, no network.
(function () {
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* some browsers block storage on file:// */ } },
  };
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- copy buttons ---------- */
  function copyText(text, button) {
    var done = function () {
      var old = button.getAttribute('data-label') || button.textContent;
      button.setAttribute('data-label', old);
      button.textContent = 'Copied';
      button.classList.add('ok');
      setTimeout(function () { button.textContent = old; button.classList.remove('ok'); }, 1400);
    };
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { button.textContent = 'Press Ctrl+C'; }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button.copy');
    if (!b) return;
    var box = b.closest('[data-copyable]');
    var src = box && (box.querySelector('pre code') || box.querySelector('p'));
    if (src) copyText(src.textContent.replace(/\n$/, ''), b);
  });

  /* ---------- step progress (saved per page) ---------- */
  var page = document.body.getAttribute('data-page') || location.pathname;
  var boxes = Array.prototype.slice.call(document.querySelectorAll('.step .gutter input[type=checkbox]'));
  var wrap = document.getElementById('progress-wrap');
  var label = document.getElementById('progress-label');
  var fill = document.getElementById('progress-fill');
  function paint() {
    if (!wrap) return;
    var total = boxes.length, done = boxes.filter(function (b) { return b.checked; }).length;
    if (!total) { wrap.hidden = true; return; }
    wrap.hidden = false;
    label.textContent = done + ' of ' + total + ' steps';
    fill.style.width = (done / total * 100) + '%';
  }
  boxes.forEach(function (b, i) {
    var key = 'ghh:' + page + ':' + i;
    b.checked = store.get(key) === '1';
    b.closest('.step').classList.toggle('done', b.checked);
    b.addEventListener('change', function () {
      store.set(key, b.checked ? '1' : '0');
      b.closest('.step').classList.toggle('done', b.checked);
      paint();
    });
  });
  paint();

  /* ---------- home: floor plan pins link to the problem list and the sheets ---------- */
  var pins = document.querySelectorAll('.plan .pin');
  function hl(n, on) {
    document.querySelectorAll('[data-hl="' + n + '"]').forEach(function (el) { el.classList.toggle('hl', on); });
    var pin = document.querySelector('.plan .pin[data-n="' + n + '"]');
    if (pin) pin.classList.toggle('on', on);
  }
  pins.forEach(function (pin) {
    var n = pin.getAttribute('data-n');
    pin.addEventListener('mouseenter', function () { hl(n, true); });
    pin.addEventListener('mouseleave', function () { hl(n, false); });
    pin.addEventListener('focus', function () { hl(n, true); });
    pin.addEventListener('blur', function () { hl(n, false); });
    pin.addEventListener('click', function () { var t = pin.getAttribute('data-href'); if (t) location.href = t; });
    pin.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); var t = pin.getAttribute('data-href'); if (t) location.href = t; } });
  });
  document.querySelectorAll('.problems li[data-hl], a.sheet[data-hl]').forEach(function (el) {
    var n = el.getAttribute('data-hl');
    el.addEventListener('mouseenter', function () { hl(n, true); });
    el.addEventListener('mouseleave', function () { hl(n, false); });
  });

  /* ---------- scorecard (lab 4) ---------- */
  var sc = document.getElementById('scorecard');
  if (sc) {
    var rows = sc.querySelectorAll('tr[data-row]');
    rows.forEach(function (r) {
      var key = 'ghh:score:' + r.getAttribute('data-row');
      var saved = store.get(key);
      if (saved) { var el = r.querySelector('input[value="' + saved + '"]'); if (el) el.checked = true; }
      r.addEventListener('change', function (ev) { if (ev.target.checked) store.set(key, ev.target.value); });
    });
    var btn = document.getElementById('score-copy');
    btn.addEventListener('click', function () {
      var lines = [], sum = 0, n = 0;
      rows.forEach(function (r) {
        var c = r.querySelector('input:checked');
        lines.push(r.getAttribute('data-label') + ': ' + (c ? c.value : 'not scored'));
        if (c) { sum += Number(c.value); n++; }
      });
      lines.push('Average: ' + (n ? (sum / n).toFixed(1) : 'n/a') + ' of 5');
      copyText(lines.join('\n'), btn);
    });
  }

  /* ---------- reveal the active rail item on small screens ---------- */
  var cur = document.querySelector('.rail a[aria-current="page"]');
  if (cur && cur.scrollIntoView && window.matchMedia('(max-width: 900px)').matches) {
    var ol = cur.closest('ol');
    if (ol) ol.scrollLeft = cur.parentElement.offsetLeft - 12;
  }
})();
