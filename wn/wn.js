// What's new + Categories (Bio · Physics · Math · Cosmic). Each folder holds an Arabic column and an English column.
// Content: wn/content.json = { badge: number|null, items: [ {id, cat, lang:'ar'|'en', type, title, sub, text, ref, poster, date, show, isNew} ] }
// Owner mode (?own=uniroot369): add, edit, hide, reorder, mark new, set the red badge number by hand, and Publish to the site.
(function () {
  var CATS = [
    { k: 'bio', en: 'Bio', ar: 'أحياء', c: '#e6b85c' },
    { k: 'physics', en: 'Physics', ar: 'فيزياء', c: '#f3cf7a' },
    { k: 'math', en: 'Math', ar: 'رياضيات', c: '#fff0c8' },
    { k: 'cosmic', en: 'Cosmic', ar: 'كوني', c: '#c8943f' }
  ];
  var TY = { article: '📄', note: '✎', image: '◩', video: '▶', link: '↗' };
  var TYN = { article: ['Article', 'مقال'], note: ['Note', 'ملاحظة'], image: ['Image', 'صورة'], video: ['Video', 'فيديو'], link: ['Link', 'رابط'] };
  var DK = 'uniroot_wn_draft2', h = document.documentElement, data = { badge: null, items: [], moved: {} }, open = {};
  var L = function () { return h.lang === 'ar' ? 'ar' : 'en'; };
  var own = function () { return h.classList.contains('own'); };
  var AD = function (s) { return String(s).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function el(t, c, html) { var e = document.createElement(t); if (c) e.className = c; if (html != null) e.innerHTML = html; return e; }
  function folder(c) { return '<svg viewBox="0 0 26 22"><path d="M1 4.5C1 3.1 2.1 2 3.5 2h6l2.5 2.6h10.5c1.4 0 2.5 1.1 2.5 2.5v11.4c0 1.4-1.1 2.5-2.5 2.5h-19C2.1 21 1 19.9 1 18.5z" fill="none" stroke="' + c + '" stroke-width="1.5"/><path d="M1 8h24" stroke="' + c + '" stroke-opacity=".45" stroke-width="1.2"/></svg>'; }
  // older content was one bilingual item per entry: split it into an Arabic item and an English item
  function normalize(d) {
    if (Array.isArray(d)) {
      var out = [];
      d.forEach(function (i) {
        ['ar', 'en'].forEach(function (l) {
          if (!i['title_' + l]) return;
          out.push({ id: i.id + '-' + l, cat: i.cat, lang: l, type: i.type, title: i['title_' + l], sub: i['sub_' + l] || '', text: i['text_' + l] || '', ref: i.ref || '', date: i.date || '', show: i.show !== false, isNew: !!i.isNew });
        });
      });
      return { badge: null, items: out, moved: {} };
    }
    return { badge: d && d.badge != null && d.badge !== '' ? d.badge : null, items: (d && d.items) || [], moved: (d && d.moved) || {} };
  }
  var btn = el('button', 'wnBtn'); btn.type = 'button';
  var shade = el('div', 'wnShade'), panel = el('aside', 'wnPanel'), form = el('div', 'wnForm'), view = el('div', 'wnView');
  panel.setAttribute('aria-label', "What's new");
  panel.innerHTML = '<div class="wnHead"><h3></h3><button type="button" class="wnX" aria-label="Close">×</button></div><div class="wnBody"></div>' +
    '<div class="wnBar wnOwn"><span></span><label><i></i><b class="bl"></b><input type="number" min="0" max="99" inputmode="numeric"></label><button type="button" data-a="pub" class="pub">Publish</button><button type="button" data-a="copy">Copy</button><button type="button" data-a="reset">Reset</button></div>';
  var body = panel.querySelector('.wnBody'), badgeIn = panel.querySelector('.wnBar input');

  function save() { try { localStorage.setItem(DK, JSON.stringify(data)); } catch (e) {} }
  function visible() { return data.items.filter(function (i) { return own() || i.show !== false; }); }
  function badgeNum() { if (data.badge != null && data.badge !== '') return +data.badge || 0; return data.items.filter(function (i) { return i.show !== false && i.isNew; }).length; }
  function render() {
    var l = L(), ar = l === 'ar', n = badgeNum();
    btn.innerHTML = '<span>' + (ar ? 'ما الجديد' : "what's new") + '</span><i>' + (ar ? '؟' : '?') + '</i><b></b>';
    btn.classList.toggle('has', n > 0); btn.querySelector('b').textContent = ar ? AD(n) : n;
    panel.querySelector('h3').textContent = ar ? 'ما الجديد؟' : "What's new?";
    panel.classList.toggle('wnOwner', own());
    var sp = panel.querySelector('.wnBar span'); if (!sp.style.color) sp.textContent = ar ? 'وضع المالك' : 'Owner mode';
    panel.querySelector('.wnBar .bl').textContent = ar ? 'رقم الدايرة' : 'Badge';
    badgeIn.placeholder = ar ? 'تلقائي' : 'auto'; if (document.activeElement !== badgeIn) badgeIn.value = data.badge == null ? '' : data.badge;
    panel.querySelector('[data-a=pub]').textContent = ar ? 'نشر' : 'Publish';
    panel.querySelector('[data-a=copy]').textContent = ar ? 'نسخ' : 'Copy';
    panel.querySelector('[data-a=reset]').textContent = ar ? 'استرجاع المنشور' : 'Reset';
    body.innerHTML = '';
    renderPage();
    var pub = data.items.filter(function (i) { return i.show !== false; }), pick = function (arr) { var best = null; arr.forEach(function (i) { if (!best || (i.date || '') > (best.date || '')) best = i; }); return best; };
    var latest = pick(pub.filter(function (i) { return i.lang === l; })) || pick(pub);
    if (latest) { var lb = el('div', 'wnLatest'); lb.appendChild(el('small', '', ar ? 'الأحدث' : 'LATEST')); lb.appendChild(row(latest, true)); body.appendChild(lb); }
    body.appendChild(el('div', 'wnCatT', ar ? 'الأقسام' : 'Categories'));
    CATS.forEach(function (c) {
      var list = visible().filter(function (i) { return i.cat === c.k; }).concat(movedItems(c.k));
      var f = el('div', 'wnF' + (open[c.k] ? ' o' : ''));
      var cnt = list.filter(function (i) { return i.show !== false && (i.lang === l || i.lang === 'both'); }).length;
      var hb = el('button', '', folder(c.c) + '<span class="nm">' + c[l] + '</span><span class="ct">' + (ar ? AD(cnt) : cnt) + '</span><span class="chev">›</span>');
      hb.type = 'button'; hb.onclick = function () { open[c.k] = !open[c.k]; render(); };
      f.appendChild(hb);
      var cols = el('div', 'wnCols');
      [['en', 'English'], ['ar', 'العربية']].forEach(function (lc) {
        var col = el('div', 'wnCol ' + lc[0]); col.appendChild(el('h5', '', lc[1]));
        var li = list.filter(function (i) { return i.lang === lc[0] || (i.virtual && i.lang === lc[0]); });
        if (!li.length) col.appendChild(el('div', 'wnEmpty', lc[0] === 'ar' ? 'لا يوجد بعد.' : 'Nothing yet.'));
        li.forEach(function (i) { col.appendChild(row(i)); });
        var add = el('div', 'wnAdd wnOwn'), ab = el('button', '', lc[0] === 'ar' ? '+ إضافة' : '+ Add'); ab.type = 'button';
        ab.onclick = function () { edit({ cat: c.k, lang: lc[0], type: 'note', show: true, isNew: true, date: new Date().toISOString().slice(0, 10) }); };
        add.appendChild(ab); col.appendChild(add); cols.appendChild(col);
      });
      f.appendChild(cols); body.appendChild(f);
    });
  }
  function row(i, plain) {
    var r = el('div', 'wnI ' + (i.lang || 'en') + (i.show === false ? ' hid' : '') + (i.virtual ? ' sec' : ''));
    r.dir = i.lang === 'ar' ? 'rtl' : 'ltr';
    r.innerHTML = '<span class="ty">' + (TY[i.type] || '•') + '</span><span class="tx"><div class="tt">' + esc(i.title) + (i.isNew ? '<span class="nw">NEW</span>' : '') + '</div>' + (i.sub ? '<div class="sb">' + esc(i.sub) + '</div>' : '') + (i.date ? '<div class="dt">' + esc(i.date) + '</div>' : '') + '</span>';
    r.onclick = function (e) { if (e.target.closest('.wnTools')) return; show(i); };
    if (!plain && i.virtual) {
      var tv = el('span', 'wnTools wnOwn'), xb = el('button', '', '📌'); xb.type = 'button'; xb.title = i.lang === 'ar' ? 'إرجاع إلى الصفحة' : 'Back to the page';
      xb.onclick = function () { delete data.moved[i.ref]; save(); render(); }; tv.appendChild(xb); r.appendChild(tv);
    } else if (!plain) {
      var t = el('span', 'wnTools wnOwn');
      [['eye', i.show === false ? '◌' : '◉'], ['new', '★'], ['pin', '📌'], ['up', '↑'], ['edit', '✎'], ['del', '🗑']].forEach(function (b) {
        var x = el('button', '', b[1]); x.type = 'button'; x.title = b[0]; if (b[0] === 'pin' && i.pin) x.style.cssText = 'background:#f3cf7a;border-color:#f3cf7a';
        x.onclick = function () {
          var k = data.items.indexOf(i);
          if (b[0] === 'eye') i.show = i.show === false;
          if (b[0] === 'new') i.isNew = !i.isNew;
          if (b[0] === 'pin') i.pin = !i.pin;
          if (b[0] === 'up') { var same = data.items.map(function (o, n) { return o.cat === i.cat && o.lang === i.lang ? n : -1; }).filter(function (n) { return n >= 0; }); var p = same.indexOf(k); if (p > 0) { var j = same[p - 1]; data.items[k] = data.items[j]; data.items[j] = i; } }
          if (b[0] === 'edit') return edit(i);
          if (b[0] === 'del') data.items.splice(k, 1);
          save(); render();
        };
        t.appendChild(x);
      });
      r.appendChild(t);
    }
    return r;
  }
  function yt(u) { var m = String(u).match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/); return m ? 'https://www.youtube.com/embed/' + m[1] : null; }
  var PLAY = '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z" fill="#f3cf7a"/></svg>', PAUSE = '<svg viewBox="0 0 24 24"><path d="M6.5 4.5h3.6v15H6.5zM13.9 4.5h3.6v15h-3.6z" fill="#f3cf7a"/></svg>',
    FS = '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="#f3cf7a" stroke-width="2"/></svg>';
  function fmt(s) { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  // gold player: thin yellow seek bar, play/pause, time, fullscreen
  function player(src, poster) {
    var w = el('div', 'urp');
    w.innerHTML = '<video playsinline preload="metadata"' + (poster ? ' poster="' + esc(poster) + '"' : '') + ' src="' + esc(src) + '"></video><div class="big">' + PLAY + '</div>' +
      '<div class="ctl"><button type="button" class="pp" aria-label="Play">' + PLAY + '</button><div class="bar"><div class="trk"><div class="buf"></div><div class="fil"></div><div class="knob"></div></div></div><span class="tm">0:00 / 0:00</span><button type="button" class="fs" aria-label="Full screen">' + FS + '</button></div>';
    var v = w.querySelector('video'), pp = w.querySelector('.pp'), bar = w.querySelector('.bar'), fil = w.querySelector('.fil'), knob = w.querySelector('.knob'), buf = w.querySelector('.buf'), tm = w.querySelector('.tm'), idle;
    function tog() { if (v.paused) v.play(); else v.pause(); }
    function upd() { var p = v.duration ? v.currentTime / v.duration : 0; fil.style.width = p * 100 + '%'; knob.style.left = p * 100 + '%'; tm.textContent = fmt(v.currentTime) + ' / ' + fmt(v.duration); try { if (v.buffered.length) buf.style.width = v.buffered.end(v.buffered.length - 1) / v.duration * 100 + '%'; } catch (e) {} }
    function wake() { w.classList.remove('idle'); clearTimeout(idle); idle = setTimeout(function () { w.classList.add('idle'); }, 2200); }
    v.onclick = tog; w.querySelector('.big').onclick = tog; pp.onclick = tog;
    v.onplay = function () { w.classList.add('playing'); pp.innerHTML = PAUSE; wake(); };
    v.onpause = function () { w.classList.remove('playing'); pp.innerHTML = PLAY; };
    v.ontimeupdate = upd; v.onloadedmetadata = upd; v.onprogress = upd;
    w.onpointermove = wake;
    function seek(e) { var r = bar.getBoundingClientRect(), p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)); if (v.duration) { v.currentTime = p * v.duration; upd(); } }
    bar.onpointerdown = function (e) { bar.classList.add('drag'); bar.setPointerCapture(e.pointerId); seek(e); bar.onpointermove = seek; };
    bar.onpointerup = bar.onpointercancel = function () { bar.classList.remove('drag'); bar.onpointermove = null; };
    w.querySelector('.fs').onclick = function () { var t = w.requestFullscreen ? w : v; if (document.fullscreenElement) document.exitFullscreen(); else if (t.requestFullscreen) t.requestFullscreen(); else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen(); };
    return w;
  }
  function closeView() { var v = view.querySelector('video'); if (v) v.pause(); view.classList.remove('on'); view.innerHTML = ''; }
  function show(i) {
    if ((i.type === 'article' || i.type === 'section') && i.ref) { var b = document.querySelector('[data-art="' + i.ref + '"]'); if (b) { close(); b.click(); return; } }
    if (i.type === 'link' && i.ref) { window.open(i.ref, '_blank', 'noopener'); return; }
    var ar = i.lang === 'ar', box = el('div', 'bx' + (ar ? ' ar' : ''));
    box.innerHTML = '<h4>' + esc(i.title) + '</h4>';
    if (i.type === 'image' && i.ref) box.insertAdjacentHTML('beforeend', '<img src="' + esc(i.ref) + '" alt="">');
    if (i.type === 'video' && i.ref) { var e = yt(i.ref); if (e) box.insertAdjacentHTML('beforeend', '<iframe src="' + e + '" allowfullscreen></iframe>'); else box.appendChild(player(i.ref, i.poster)); }
    if (i.text || i.sub) box.appendChild(el('div', 'tx', esc(i.text || i.sub)));
    var r = el('div', 'r'), cb = el('button', '', ar ? 'إغلاق' : 'Close'); cb.type = 'button'; cb.onclick = closeView; r.appendChild(cb); box.appendChild(r);
    view.innerHTML = ''; view.appendChild(box); view.classList.add('on');
  }
  view.onclick = function (e) { if (e.target === view) closeView(); };
  function edit(i) {
    var isNew = data.items.indexOf(i) < 0, lang = i.lang || 'en', ui = L() === 'ar';
    var F = [['title', ui ? 'العنوان' : 'Title'], ['sub', ui ? 'سطر قصير' : 'Short line'], ['text', ui ? 'النص' : 'Text'], ['ref', ui ? 'رابط / مسار الفيديو أو الصورة / يوتيوب / اسم المقال' : 'Link / video or image path / YouTube / article key'], ['poster', ui ? 'صورة غلاف الفيديو (اختياري)' : 'Video poster (optional)'], ['date', ui ? 'التاريخ' : 'Date']];
    var hs = '<form><label>' + (ui ? 'اللغة' : 'Language') + '</label><div class="seg"><button type="button" data-v="ar">العربية</button><button type="button" data-v="en">English</button></div>' +
      '<label>' + (ui ? 'الفولدر' : 'Folder') + '</label><select name="cat">' + CATS.map(function (c) { return '<option value="' + c.k + '"' + (c.k === i.cat ? ' selected' : '') + '>' + c.en + ' · ' + c.ar + '</option>'; }).join('') + '</select>' +
      '<label>' + (ui ? 'النوع' : 'Type') + '</label><select name="type">' + Object.keys(TY).map(function (t) { return '<option value="' + t + '"' + (t === i.type ? ' selected' : '') + '>' + TYN[t][ui ? 1 : 0] + '</option>'; }).join('') + '</select><div class="fl">';
    F.forEach(function (f) { var big = f[0] === 'text', txt = f[0] === 'title' || f[0] === 'sub' || f[0] === 'text'; hs += '<label>' + f[1] + '</label>' + (big ? '<textarea name="text" class="tx"></textarea>' : '<input name="' + f[0] + '"' + (txt ? ' class="tx"' : ' dir="ltr"') + '>'); });
    hs += '</div><div class="r"><button type="button" data-c>' + (ui ? 'إلغاء' : 'Cancel') + '</button><button class="p">' + (ui ? 'حفظ' : 'Save') + '</button></div></form>';
    form.innerHTML = hs; form.classList.add('on');
    var fm = form.querySelector('form');
    F.forEach(function (f) { fm.elements[f[0]].value = i[f[0]] || ''; });
    function setLang(v) { lang = v; fm.querySelectorAll('.seg button').forEach(function (b) { b.classList.toggle('on', b.dataset.v === v); }); fm.querySelector('.fl').className = 'fl ' + v; fm.querySelectorAll('.tx').forEach(function (x) { x.dir = v === 'ar' ? 'rtl' : 'ltr'; }); }
    fm.querySelectorAll('.seg button').forEach(function (b) { b.onclick = function () { setLang(b.dataset.v); }; }); setLang(lang);
    form.querySelector('[data-c]').onclick = function () { form.classList.remove('on'); };
    fm.onsubmit = function (e) {
      e.preventDefault(); i.lang = lang; i.cat = fm.elements.cat.value; i.type = fm.elements.type.value;
      F.forEach(function (f) { i[f[0]] = (fm.elements[f[0]].value || '').trim(); });
      if (!i.title) { fm.elements.title.focus(); return; }
      if (isNew) { i.id = 'i' + Date.now(); data.items.unshift(i); }
      open[i.cat] = true; save(); form.classList.remove('on'); render();
    };
  }
  badgeIn.oninput = function () { var v = badgeIn.value.trim(); data.badge = v === '' ? null : Math.max(0, Math.min(99, parseInt(v, 10) || 0)); save(); var keep = badgeIn.value; render(); badgeIn.value = keep; };
  function movedItems(cat) {
    var out = []; Object.keys(data.moved || {}).forEach(function (id) { if (data.moved[id] !== cat) return; var s = document.querySelector('[data-wn="' + id + '"]'); if (!s) return;
      ['ar', 'en'].forEach(function (l) { out.push({ virtual: true, type: 'section', ref: id, cat: cat, lang: l, title: s.getAttribute('data-wn-' + l), show: true }); }); });
    return out;
  }
  var pick = el('div', 'wnPick');
  function chooseFolder(id) {
    var ar = L() === 'ar'; pick.innerHTML = '<div class="bx"><b>' + (ar ? 'انقل هذا القسم إلى فولدر:' : 'Move this section to a folder:') + '</b></div>';
    var bx = pick.firstChild;
    CATS.forEach(function (c) { var b = el('button', '', c[L()]); b.type = 'button'; b.onclick = function () { data.moved[id] = c.k; save(); pick.classList.remove('on'); render(); }; bx.appendChild(b); });
    var cb = el('button', '', ar ? 'إلغاء' : 'Cancel'); cb.type = 'button'; cb.style.opacity = '.7'; cb.onclick = function () { pick.classList.remove('on'); }; bx.appendChild(cb);
    pick.classList.add('on');
  }
  function card(i) {
    var c = el('div', 'pc' + (i.lang === 'ar' ? ' ar' : '') + (i.type === 'video' ? ' wide' : '')); c.dir = i.lang === 'ar' ? 'rtl' : 'ltr'; var ar = i.lang === 'ar';
    c.appendChild(el('h4', '', esc(i.title)));
    if (i.type === 'video' && i.ref) { var e = yt(i.ref); if (e) c.insertAdjacentHTML('beforeend', '<div class="urp"><iframe src="' + e + '" allowfullscreen style="width:100%;aspect-ratio:16/9;border:0"></iframe></div>'); else c.appendChild(player(i.ref, i.poster)); }
    if (i.type === 'image' && i.ref) c.insertAdjacentHTML('beforeend', '<img src="' + esc(i.ref) + '" alt="">');
    if (i.sub || i.text) c.appendChild(el('p', '', esc(i.type === 'note' ? (i.text || i.sub) : i.sub)));
    if (i.type === 'article' && i.ref) { var g = el('button', 'go', ar ? 'اقرأ المقال' : 'Read the article'); g.type = 'button'; g.onclick = function () { var b = document.querySelector('[data-art="' + i.ref + '"]'); if (b) b.click(); }; c.appendChild(g); }
    if (i.type === 'link' && i.ref) c.insertAdjacentHTML('beforeend', '<a class="go" href="' + esc(i.ref) + '" target="_blank" rel="noopener">' + (ar ? 'افتح' : 'Open') + ' ↗</a>');
    var u = el('button', 'unpin', ar ? '📌 إلى الفولدر' : '📌 Back to folder'); u.type = 'button'; u.onclick = function () { i.pin = false; save(); render(); }; c.appendChild(u);
    return c;
  }
  function renderPage() {
    var l = L();
    document.querySelectorAll('[data-wn]').forEach(function (s) {
      var id = s.getAttribute('data-wn'); s.style.display = data.moved && data.moved[id] ? 'none' : '';
      if (!s.querySelector(':scope > .wnSec')) { var b = el('button', 'wnSec'); b.type = 'button'; b.onclick = function () { chooseFolder(id); }; s.appendChild(b); }
      s.querySelector(':scope > .wnSec').textContent = l === 'ar' ? '📁 إلى فولدر' : '📁 To a folder';
    });
    document.querySelectorAll('.wnPin').forEach(function (box) {
      var cat = box.getAttribute('data-cat'); box.innerHTML = '';
      var all = data.items.filter(function (i) { return i.pin && i.cat === cat && i.show !== false; }), mine = all.filter(function (i) { return i.lang === l; });
      (mine.length ? mine : all).forEach(function (i) { box.appendChild(card(i)); });
    });
    document.querySelectorAll('.band').forEach(function (b) {
      var vis = Array.prototype.some.call(b.children, function (k) { return !k.classList.contains('bandH') && k.style.display !== 'none' && (!k.classList.contains('wnPin') || k.children.length); });
      b.classList.toggle('empty', !vis);
    });
  }
  function openP() { render(); h.classList.add('wnOpen'); }
  function close() { h.classList.remove('wnOpen'); }
  btn.onclick = openP; shade.onclick = close; panel.querySelector('.wnX').onclick = close;
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (view.classList.contains('on')) closeView(); else close(); } });
  panel.querySelector('[data-a=copy]').onclick = function () {
    var s = JSON.stringify(data, null, 1);
    (navigator.clipboard ? navigator.clipboard.writeText(s) : Promise.reject()).then(function () { alert('Copied.'); }, function () { prompt('Copy this:', s); });
  };
  // Publish: writes wn/content.json to the site repo with the owner's GitHub token (kept only in this browser).
  var REPO = 'komy439/Unirootscience.com', TK = 'uniroot_wn_token', PATH = 'wn/content.json';
  function b64(s) { return btoa(unescape(encodeURIComponent(s))); }
  function tokenForm(done) {
    form.innerHTML = '<form><label>GitHub token (saved on this device only)</label><input name="t" autocomplete="off" placeholder="github_pat_..."><div class="r"><button type="button" data-c>Cancel</button><button class="p">Save</button></div></form>';
    form.classList.add('on');
    form.querySelector('[data-c]').onclick = function () { form.classList.remove('on'); };
    form.querySelector('form').onsubmit = function (e) { e.preventDefault(); var t = new FormData(e.target).get('t').trim(); if (!t) return; try { localStorage.setItem(TK, t); } catch (x) {} form.classList.remove('on'); done(t); };
  }
  function status(msg, ok) { var sp = panel.querySelector('.wnBar span'); sp.textContent = msg; sp.style.color = ok === false ? '#ff7a6b' : ok ? '#8fe08a' : ''; }
  function publish(t) {
    var ar = L() === 'ar', H = { Authorization: 'Bearer ' + t, Accept: 'application/vnd.github+json' }, url = 'https://api.github.com/repos/' + REPO + '/contents/' + PATH;
    status(ar ? 'جارٍ النشر…' : 'Publishing…');
    fetch(url + '?ref=main&t=' + Date.now(), { headers: H, cache: 'no-store' }).then(function (r) {
      if (r.status === 401 || r.status === 403) throw 'auth'; return r.ok ? r.json() : {};
    }).then(function (cur) {
      return fetch(url, { method: 'PUT', headers: H, body: JSON.stringify({ message: 'Update What\'s new content', content: b64(JSON.stringify(data, null, 1) + '\n'), sha: cur.sha, branch: 'main' }) });
    }).then(function (r) {
      if (r.status === 401 || r.status === 403) throw 'auth'; if (!r.ok) throw 'http ' + r.status;
      status(ar ? 'تم النشر ✓ يظهر للناس خلال دقيقة أو اثنتين' : 'Published ✓ live in 1–2 minutes', true);
    }).catch(function (e) {
      if (e === 'auth') { try { localStorage.removeItem(TK); } catch (x) {} status(ar ? 'المفتاح غير صالح، أدخله من جديد' : 'Token rejected, enter it again', false); return; }
      status((ar ? 'لم يتم النشر: ' : 'Not published: ') + e, false);
    });
  }
  panel.querySelector('[data-a=pub]').onclick = function () { var t = null; try { t = localStorage.getItem(TK); } catch (x) {} if (t) publish(t); else tokenForm(publish); };
  panel.querySelector('[data-a=reset]').onclick = function () { try { localStorage.removeItem(DK); } catch (e) {} load(); };
  function load() {
    var draft = null; try { draft = own() && JSON.parse(localStorage.getItem(DK) || 'null'); } catch (e) {}
    if (draft) { data = normalize(draft); render(); return; }
    if (window.WN_DATA) { data = normalize(JSON.parse(JSON.stringify(window.WN_DATA))); render(); return; }
    fetch('wn/content.json?v=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (d) { data = normalize(d); render(); }).catch(function () { render(); });
  }
  document.addEventListener('DOMContentLoaded', function () {
    [btn, shade, panel, form, view, pick].forEach(function (e) { document.body.appendChild(e); });
    load();
    document.querySelectorAll('[data-l]').forEach(function (b) { b.addEventListener('click', function () { setTimeout(render, 0); }); });
  });
})();
