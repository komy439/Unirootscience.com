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

// About sits in the top row directly above What's new: same outer edge, same width; the language switch steps inward to make room.
// On narrow screens it sits beside What's new instead.
(function(){var ro;function tog(){var b=document.querySelector('header [data-l]');return b?b.parentElement:null}
function place(){var a=document.querySelector('nav a.navAbout'),w=document.querySelector('.wnBtn'),t=tog();if(!a||!w||!t){setTimeout(place,200);return}
 var rtl=document.documentElement.dir==='rtl';t.style.marginInlineEnd='';a.classList.add('dock');
 var r=w.getBoundingClientRect();
 if(innerWidth>760){t.style.marginInlineEnd=(r.width+10)+'px';var tr=t.getBoundingClientRect();a.style.top=tr.top+'px';a.style.height=tr.height+'px';a.style.width=r.width+'px';a.style.justifyContent='center';
   if(rtl){a.style.left=r.left+'px';a.style.right='auto'}else{a.style.right=(innerWidth-r.right)+'px';a.style.left='auto'}}
 else{a.style.width='';a.style.justifyContent='';a.style.top=r.top+'px';a.style.height=r.height+'px';
   if(rtl){a.style.left=(r.right+8)+'px';a.style.right='auto'}else{a.style.right=(innerWidth-r.left+8)+'px';a.style.left='auto'}}
 if(!ro&&window.ResizeObserver){ro=new ResizeObserver(function(){requestAnimationFrame(place)});ro.observe(w)}}
 addEventListener('resize',place);document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-l]'))setTimeout(place,80)});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',place);else place();setTimeout(place,900);})();
