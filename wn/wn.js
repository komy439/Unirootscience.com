// What's new + Categories (Bio · Physics · Math · Cosmic). Content comes from wn/content.json.
// Owner mode (?own=uniroot369) shows tools to hide/show, add, edit, reorder and mark items as new.
(function () {
  var CATS = [
    { k: 'bio', en: 'Bio', ar: 'أحياء', c: '#e6b85c' },
    { k: 'physics', en: 'Physics', ar: 'فيزياء', c: '#f3cf7a' },
    { k: 'math', en: 'Math', ar: 'رياضيات', c: '#fff0c8' },
    { k: 'cosmic', en: 'Cosmic', ar: 'كوني', c: '#c8943f' }
  ];
  var TY = { article: '📄', note: '✎', image: '◩', video: '▶', link: '↗' };
  var DK = 'uniroot_wn_draft', h = document.documentElement, items = [], open = {};
  var L = function () { return h.lang === 'ar' ? 'ar' : 'en'; };
  var T = function (o, f) { var l = L(); return (o[f + '_' + l] || o[f + '_' + (l === 'ar' ? 'en' : 'ar')] || ''); };
  var own = function () { return h.classList.contains('own'); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function el(t, c, html) { var e = document.createElement(t); if (c) e.className = c; if (html != null) e.innerHTML = html; return e; }
  function folder(c) { return '<svg viewBox="0 0 26 22"><path d="M1 4.5C1 3.1 2.1 2 3.5 2h6l2.5 2.6h10.5c1.4 0 2.5 1.1 2.5 2.5v11.4c0 1.4-1.1 2.5-2.5 2.5h-19C2.1 21 1 19.9 1 18.5z" fill="none" stroke="' + c + '" stroke-width="1.5"/><path d="M1 8h24" stroke="' + c + '" stroke-opacity=".45" stroke-width="1.2"/></svg>'; }

  var btn = el('button', 'wnBtn'); btn.type = 'button';
  var shade = el('div', 'wnShade'), panel = el('aside', 'wnPanel'), form = el('div', 'wnForm'), view = el('div', 'wnView');
  panel.setAttribute('aria-label', "What's new");
  panel.innerHTML = '<div class="wnHead"><h3></h3><button type="button" class="wnX" aria-label="Close">×</button></div><div class="wnBody"></div>' +
    '<div class="wnBar wnOwn"><span></span><button type="button" data-a="pub" class="pub">Publish</button><button type="button" data-a="copy">Copy</button><button type="button" data-a="reset">Reset</button></div>';
  var body = panel.querySelector('.wnBody');

  function save() { try { localStorage.setItem(DK, JSON.stringify(items)); } catch (e) {} }
  function visible() { return items.filter(function (i) { return own() || i.show !== false; }); }
  function render() {
    var l = L();
    btn.innerHTML = '<span>' + (l === 'ar' ? 'ما الجديد' : "what's new") + '</span><i>' + (l === 'ar' ? '؟' : '?') + '</i><b></b>';
    var nNew = items.filter(function (i) { return i.show !== false && i.isNew; }).length;
    btn.classList.toggle('has', nNew > 0); btn.querySelector('b').textContent = l === 'ar' ? String(nNew).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }) : nNew;
    panel.querySelector('h3').textContent = l === 'ar' ? 'ما الجديد؟' : "What's new?";
    panel.classList.toggle('wnOwner', own());
    var sp = panel.querySelector('.wnBar span'); if (!sp.style.color) sp.textContent = l === 'ar' ? 'وضع المالك' : 'Owner mode'; panel.querySelector('[data-a=pub]').textContent = l === 'ar' ? 'نشر' : 'Publish'; panel.querySelector('[data-a=copy]').textContent = l === 'ar' ? 'نسخ' : 'Copy'; panel.querySelector('[data-a=reset]').textContent = l === 'ar' ? 'استرجاع المنشور' : 'Reset';
    body.innerHTML = '';
    var latest = items.filter(function (i) { return i.show !== false; }).sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); })[0];
    if (latest) {
      var lb = el('div', 'wnLatest'); lb.appendChild(el('small', '', l === 'ar' ? 'الأحدث' : 'LATEST')); lb.appendChild(row(latest, true)); body.appendChild(lb);
    }
    body.appendChild(el('div', 'wnCatT', l === 'ar' ? 'الأقسام' : 'Categories'));
    CATS.forEach(function (c) {
      var list = visible().filter(function (i) { return i.cat === c.k; });
      var f = el('div', 'wnF' + (open[c.k] ? ' o' : ''));
      var hb = el('button', '', folder(c.c) + '<span class="nm">' + c[l] + '</span><span class="ct">' + list.filter(function (i) { return i.show !== false; }).length + '</span><span class="ar">›</span>');
      hb.type = 'button'; hb.onclick = function () { open[c.k] = !open[c.k]; render(); };
      f.appendChild(hb);
      var w = el('div', 'wnL');
      if (!list.length) w.appendChild(el('div', 'wnEmpty', l === 'ar' ? 'لا يوجد محتوى بعد.' : 'Nothing here yet.'));
      list.forEach(function (i) { w.appendChild(row(i)); });
      var add = el('div', 'wnAdd wnOwn'); var ab = el('button', '', l === 'ar' ? '+ إضافة' : '+ Add'); ab.type = 'button'; ab.onclick = function () { edit({ cat: c.k, type: 'note', show: true, isNew: true, date: new Date().toISOString().slice(0, 10) }); }; add.appendChild(ab); w.appendChild(add);
      f.appendChild(w); body.appendChild(f);
    });
  }
  function row(i, plain) {
    var r = el('div', 'wnI' + (i.show === false ? ' hid' : ''));
    r.innerHTML = '<span class="ty">' + (TY[i.type] || '•') + '</span><span class="tx"><div class="tt">' + esc(T(i, 'title')) + (i.isNew ? '<span class="nw">NEW</span>' : '') + '</div>' + (T(i, 'sub') ? '<div class="sb">' + esc(T(i, 'sub')) + '</div>' : '') + (i.date ? '<div class="dt">' + esc(i.date) + '</div>' : '') + '</span>';
    r.onclick = function (e) { if (e.target.closest('.wnTools')) return; show(i); };
    if (!plain) {
      var t = el('span', 'wnTools wnOwn');
      [['eye', i.show === false ? '◌' : '◉'], ['new', '★'], ['up', '↑'], ['edit', '✎'], ['del', '🗑']].forEach(function (b) {
        var x = el('button', '', b[1]); x.type = 'button'; x.title = b[0];
        x.onclick = function () {
          var k = items.indexOf(i);
          if (b[0] === 'eye') i.show = i.show === false;
          if (b[0] === 'new') i.isNew = !i.isNew;
          if (b[0] === 'up') { var same = items.map(function (o, n) { return o.cat === i.cat ? n : -1; }).filter(function (n) { return n >= 0; }); var p = same.indexOf(k); if (p > 0) { var j = same[p - 1]; items[k] = items[j]; items[j] = i; } }
          if (b[0] === 'edit') return edit(i);
          if (b[0] === 'del') { if (!window.confirm || true) items.splice(k, 1); }
          save(); render();
        };
        t.appendChild(x);
      });
      r.appendChild(t);
    }
    return r;
  }
  function yt(u) { var m = String(u).match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/); return m ? 'https://www.youtube.com/embed/' + m[1] : null; }
  function show(i) {
    if (i.type === 'article' && i.ref) { var b = document.querySelector('[data-art="' + i.ref + '"]'); if (b) { close(); b.click(); return; } }
    if (i.type === 'link' && i.ref) { window.open(i.ref, '_blank', 'noopener'); return; }
    var l = L(), m = '';
    if (i.type === 'image' && i.ref) m = '<img src="' + esc(i.ref) + '" alt="">';
    if (i.type === 'video' && i.ref) { var e = yt(i.ref); m = e ? '<iframe src="' + e + '" allowfullscreen></iframe>' : ''; }
    view.innerHTML = '<div class="bx"><h4>' + esc(T(i, 'title')) + '</h4>' + m + '<div class="tx">' + esc(T(i, 'text') || T(i, 'sub')) + '</div><div class="r"><button type="button">' + (l === 'ar' ? 'إغلاق' : 'Close') + '</button></div></div>';
    view.querySelector('button').onclick = function () { view.classList.remove('on'); view.innerHTML = ''; };
    view.classList.add('on');
  }
  function edit(i) {
    var isNew = items.indexOf(i) < 0, f = ['title_en', 'title_ar', 'sub_en', 'sub_ar', 'text_en', 'text_ar', 'ref', 'date'];
    var lab = { title_en: 'Title (EN)', title_ar: 'العنوان (AR)', sub_en: 'Short line (EN)', sub_ar: 'سطر قصير (AR)', text_en: 'Text (EN)', text_ar: 'النص (AR)', ref: 'Link / image URL / YouTube / article key', date: 'Date' };
    var hs = '<form><label>Folder</label><select name="cat">' + CATS.map(function (c) { return '<option value="' + c.k + '"' + (c.k === i.cat ? ' selected' : '') + '>' + c.en + ' · ' + c.ar + '</option>'; }).join('') + '</select>' +
      '<label>Type</label><select name="type">' + Object.keys(TY).map(function (t) { return '<option' + (t === i.type ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select>';
    f.forEach(function (k) { var ar = /_ar$/.test(k), big = /^text/.test(k); hs += '<label>' + lab[k] + '</label>' + (big ? '<textarea name="' + k + '"' + (ar ? ' dir="rtl"' : '') + '>' + esc(i[k] || '') + '</textarea>' : '<input name="' + k + '"' + (ar ? ' dir="rtl"' : '') + ' value="' + esc(i[k] || '') + '">'); });
    hs += '<div class="r"><button type="button" data-c>Cancel</button><button class="p">Save</button></div></form>';
    form.innerHTML = hs; form.classList.add('on');
    form.querySelector('[data-c]').onclick = function () { form.classList.remove('on'); };
    form.querySelector('form').onsubmit = function (e) {
      e.preventDefault(); var d = new FormData(e.target);
      ['cat', 'type'].concat(f).forEach(function (k) { i[k] = (d.get(k) || '').trim(); });
      if (isNew) { i.id = 'i' + Date.now(); items.unshift(i); }
      open[i.cat] = true; save(); form.classList.remove('on'); render();
    };
  }
  function openP() { render(); h.classList.add('wnOpen'); }
  function close() { h.classList.remove('wnOpen'); }
  btn.onclick = openP; shade.onclick = close; panel.querySelector('.wnX').onclick = close;
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  panel.querySelector('[data-a=copy]').onclick = function () {
    var s = JSON.stringify(items, null, 1);
    (navigator.clipboard ? navigator.clipboard.writeText(s) : Promise.reject()).then(function () { alert('Copied. Send it to publish.'); }, function () { prompt('Copy this:', s); });
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
      return fetch(url, { method: 'PUT', headers: H, body: JSON.stringify({ message: 'Update What\'s new content', content: b64(JSON.stringify(items, null, 1) + '\n'), sha: cur.sha, branch: 'main' }) });
    }).then(function (r) {
      if (r.status === 401 || r.status === 403) throw 'auth'; if (!r.ok) throw 'http ' + r.status;
      status(ar ? 'تم النشر ✓ يظهر للناس خلال دقيقة أو اثنتين' : 'Published ✓ live in 1–2 minutes', true);
    }).catch(function (e) {
      if (e === 'auth') { try { localStorage.removeItem(TK); } catch (x) {} status(ar ? 'المفتاح غير صالح، أدخله من جديد' : 'Token rejected, enter it again', false); return; }
      status((ar ? 'لم يتم النشر: ' : 'Not published: ') + e, false);
    });
  }
  panel.querySelector('[data-a=pub]').onclick = function () {
    var t = null; try { t = localStorage.getItem(TK); } catch (x) {}
    if (t) publish(t); else tokenForm(publish);
  };
  panel.querySelector('[data-a=reset]').onclick = function () { try { localStorage.removeItem(DK); } catch (e) {} load(); };

  function load() {
    var draft = null; try { draft = own() && JSON.parse(localStorage.getItem(DK) || 'null'); } catch (e) {}
    if (draft) { items = draft; render(); return; }
    if (window.WN_DATA) { items = JSON.parse(JSON.stringify(window.WN_DATA)); render(); return; }
    fetch('wn/content.json?v=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (d) { items = d; render(); }).catch(function () { items = []; render(); });
  }
  document.addEventListener('DOMContentLoaded', function () {
    [btn, shade, panel, form, view].forEach(function (e) { document.body.appendChild(e); });
    load();
    document.querySelectorAll('[data-l]').forEach(function (b) { b.addEventListener('click', function () { setTimeout(render, 0); }); });
  });
})();
