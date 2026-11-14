// English / Arabic switch: remembers the choice in this browser, starts from the browser language.
(function () {
  var h = document.documentElement, k = 'uniroot_lang', l = null;
  try { l = localStorage.getItem(k); } catch (e) {}
  if (!l) l = (navigator.language || '').toLowerCase().indexOf('ar') === 0 ? 'ar' : 'en';
  function set(v) {
    h.lang = v; h.dir = v === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem(k, v); } catch (e) {}
    var b = document.getElementById('langBtn'); if (b) b.textContent = v === 'ar' ? 'English' : 'عربي';
  }
  set(l);
  document.addEventListener('DOMContentLoaded', function () {
    set(h.lang);
    var b = document.getElementById('langBtn');
    if (b) b.onclick = function () { set(h.lang === 'ar' ? 'en' : 'ar'); };
  });
})();
