// English / Arabic: two buttons, same content. Remembers the choice; starts from the browser language.
(function () {
  var h = document.documentElement, k = 'uniroot_lang', l = null;
  try { l = localStorage.getItem(k); } catch (e) {}
  if (!l) l = (navigator.language || '').toLowerCase().indexOf('ar') === 0 ? 'ar' : 'en';
  function set(v) {
    h.lang = v; h.dir = v === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem(k, v); } catch (e) {}
    document.querySelectorAll('[data-l]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.l === v); });
  }
  set(l);
  // owner mode: open the site once with ?own=uniroot369 to see the download buttons (?own=0 hides them again)
  try { var q = location.search + location.hash; if (q.indexOf('own=uniroot369') >= 0) localStorage.setItem('uniroot_own', '1'); if (q.indexOf('own=0') >= 0) localStorage.removeItem('uniroot_own'); if (localStorage.getItem('uniroot_own')) h.classList.add('own'); } catch (e) {}
  document.addEventListener('DOMContentLoaded', function () {
    set(h.lang);
    document.querySelectorAll('[data-l]').forEach(function (b) { b.onclick = function () { set(b.dataset.l); }; });
  });
})();
