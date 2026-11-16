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

// dock the About button beside the What's new button: same top, same height, its edge 8px from What's new
(function(){var ro;function place(){var a=document.querySelector('nav a.navAbout'),w=document.querySelector('.wnBtn');if(!a||!w){setTimeout(place,200);return}
 var r=w.getBoundingClientRect(),rtl=document.documentElement.dir==='rtl';a.classList.add('dock');a.style.top=r.top+'px';a.style.height=r.height+'px';
 if(rtl){a.style.left=(r.right+8)+'px';a.style.right='auto'}else{a.style.right=(innerWidth-r.left+8)+'px';a.style.left='auto'}
 if(!ro&&window.ResizeObserver){ro=new ResizeObserver(place);ro.observe(w)}}
 addEventListener('resize',place);document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-l]'))setTimeout(place,80)});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',place);else place();setTimeout(place,900);})();
