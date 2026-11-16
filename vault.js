// Download with a personal code. Every paper sits in vault/ encrypted with its own key; a code unwraps that key on the reader's device.
// The owner (?own=uniroot369) gets a panel to give a named person a code, or take it back.
(function () {
  var q = new URLSearchParams(location.search), DOC = q.get('d'), L = document.documentElement.lang === 'en' ? 'en' : 'ar', AR = L === 'ar';
  var REPO = 'komy439/Unirootscience.com', TK = 'uniroot_wn_token', OWN = false;
  try { OWN = !!localStorage.getItem('uniroot_own'); } catch (e) {}
  var te = new TextEncoder(), S = crypto.subtle;
  function u8(b64) { var s = atob(b64), a = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a; }
  function b64(a) { var s = ''; a = new Uint8Array(a); for (var i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s); }
  function norm(c) { return (c || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
  function idOf(code) { return S.digest('SHA-256', te.encode('uniroot:' + norm(code))).then(function (h) { return hex(h).slice(0, 16); }); }
  function kdf(pass, salt, it) { return S.importKey('raw', te.encode(pass), 'PBKDF2', false, ['deriveKey']).then(function (k) { return S.deriveKey({ name: 'PBKDF2', salt: salt, iterations: it, hash: 'SHA-256' }, k, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']); }); }
  function dec(key, iv, ct) { return S.decrypt({ name: 'AES-GCM', iv: iv }, key, ct); }
  function enc(key, iv, pt) { return S.encrypt({ name: 'AES-GCM', iv: iv }, key, pt); }
  function rnd(n) { return crypto.getRandomValues(new Uint8Array(n)); }
  function newCode() { var a = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789', r = rnd(12), s = ''; for (var i = 0; i < 12; i++) { s += a[r[i] % a.length]; if (i === 3 || i === 7) s += '-'; } return s; }
  function getJSON(p) { return fetch(p + '?t=' + Date.now(), { cache: 'no-store' }).then(function (r) { if (!r.ok) throw 0; return r.json(); }); }
  function el(t, c, h) { var e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  var T = function (a, e) { return AR ? a : e; };

  var css = '.vb{font:500 13px Inter,system-ui,sans-serif;color:#f3cf7a;border:1px solid rgba(243,207,122,.4);border-radius:999px;padding:6px 12px;background:none;cursor:pointer;white-space:nowrap}' +
    '.vm{position:fixed;inset:0;z-index:20;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;padding:16px}.vm[hidden]{display:none}' +
    '.vc{width:100%;max-width:440px;max-height:90vh;overflow:auto;background:linear-gradient(#1a1712,#0b0907);border:1px solid rgba(243,207,122,.3);border-radius:16px;padding:22px;color:#fff3d0;font:14px Inter,system-ui,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.6)}' +
    'html[lang=ar] .vc{font-family:Ami,serif;font-size:17px}.vc h3{margin:0 0 6px;color:#f3cf7a;font-size:1.25em}.vc p{margin:0 0 14px;color:#cfc6b2;line-height:1.7}' +
    '.vc input,.vc select{width:100%;box-sizing:border-box;background:#0b0907;border:1px solid rgba(243,207,122,.35);border-radius:10px;color:#fff3d0;padding:10px 12px;font:16px Inter,system-ui,sans-serif;margin-bottom:10px}' +
    '.vc .code{letter-spacing:.15em;text-align:center;text-transform:uppercase;direction:ltr}.vr{display:flex;gap:8px;flex-wrap:wrap;margin-top:4px}' +
    '.vc .go{font:600 14px Inter,system-ui,sans-serif;color:#0b0907;background:linear-gradient(#f6dc97,#d9b25a);border:0;border-radius:999px;padding:9px 18px;cursor:pointer}' +
    '.vc .no2{font:500 14px Inter,system-ui,sans-serif;color:#f3cf7a;background:none;border:1px solid rgba(243,207,122,.4);border-radius:999px;padding:8px 16px;cursor:pointer}' +
    '.vc .st{min-height:1.4em;margin-top:10px;font-size:.92em;color:#cfc6b2}.vc .st.bad{color:#ff8a70}.vc .st.ok{color:#9fe0a0}' +
    '.vg{border-top:1px solid rgba(243,207,122,.15);padding:10px 0;display:flex;gap:10px;align-items:center}.vg div{flex:1;min-width:0}.vg b{color:#fff3d0}.vg small{display:block;color:#8c8270;font-family:Inter,system-ui,sans-serif;font-size:11.5px}' +
    '.vg button{font:500 12px Inter,system-ui,sans-serif;color:#ff8a70;background:none;border:1px solid rgba(255,138,112,.45);border-radius:999px;padding:5px 10px;cursor:pointer}' +
    '.vout{background:#0b0907;border:1px dashed rgba(243,207,122,.5);border-radius:10px;padding:12px;margin:10px 0;white-space:pre-wrap;font-size:.95em;line-height:1.7}.vsec{margin-top:18px}';
  document.head.appendChild(el('style', null, css));

  function modal(html) { var m = el('div', 'vm'), c = el('div', 'vc', html); m.appendChild(c); m.onclick = function (e) { if (e.target === m) m.remove(); }; document.body.appendChild(m); return c; }
  function st(c, msg, cls) { var s = c.querySelector('.st'); s.textContent = msg; s.className = 'st' + (cls ? ' ' + cls : ''); }

  // ---------- reader: download with a code ----------
  function stampPDF(bytes, name) {
    return loadLib().then(function () {
      var P = window.PDFLib;
      return P.PDFDocument.load(bytes).then(function (pdf) {
        var cv = document.createElement('canvas'), x = cv.getContext('2d'), txt = T('نسخة خاصة بـ ' + name + ' · uni root · unirootscience.com', 'Personal copy for ' + name + ' · uni root · unirootscience.com');
        x.font = '600 34px ' + (AR ? 'Ami, serif' : 'Inter, sans-serif'); cv.width = Math.ceil(x.measureText(txt).width) + 20; cv.height = 52;
        x.font = '600 34px ' + (AR ? 'Ami, serif' : 'Inter, sans-serif'); x.fillStyle = 'rgba(140,110,40,0.85)'; x.textBaseline = 'middle'; x.direction = AR ? 'rtl' : 'ltr'; x.textAlign = 'center'; x.fillText(txt, cv.width / 2, 26);
        var png = u8(cv.toDataURL('image/png').split(',')[1]);
        return pdf.embedPng(png).then(function (img) {
          pdf.getPages().forEach(function (p) {
            var W = p.getWidth(), H = p.getHeight(), w = Math.min(W * .62, img.width * .3), h = w * img.height / img.width;
            p.drawImage(img, { x: (W - w) / 2, y: 10, width: w, height: h, opacity: .9 });
            var w2 = W * .8, h2 = w2 * img.height / img.width;
            p.drawImage(img, { x: W * .14, y: H * .28, width: w2, height: h2, opacity: .1, rotate: P.degrees(32) });
          });
          pdf.setTitle(txt); pdf.setAuthor('Ahmed Elkomy · uni root');
          return pdf.save();
        });
      });
    });
  }
  var libP = null;
  function loadLib() { if (window.PDFLib) return Promise.resolve(); if (libP) return libP; libP = new Promise(function (ok, no) { var s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js'; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); return libP; }
  function openDownload() {
    var c = modal('<h3>' + T('تحميل بكود', 'Download with a code') + '</h3><p>' + T('اكتب الكود اللي وصلك من uni root.', 'Enter the code you received from uni root.') + '</p>' +
      '<input class="code" placeholder="XXXX-XXXX-XXXX" autocomplete="off" spellcheck="false"><div class="vr"><button class="go" type="button">' + T('حمّل الملف', 'Download') + '</button><button class="no2" type="button">' + T('إلغاء', 'Cancel') + '</button></div><div class="st"></div>');
    var inp = c.querySelector('input'); inp.focus();
    c.querySelector('.no2').onclick = function () { c.parentNode.remove(); };
    function go() {
      var code = inp.value; if (norm(code).length < 12) { st(c, T('الكود ناقص.', 'The code is incomplete.'), 'bad'); return; }
      st(c, T('جارٍ التحقق…', 'Checking…'));
      var G, name;
      Promise.all([idOf(code), getJSON('vault/grants.json')]).then(function (r) {
        var id = r[0], gs = r[1].grants.filter(function (g) { return g.id === id && g.doc === DOC; });
        G = gs.filter(function (g) { return g.lang === L; })[0] || gs[0];
        if (!G) throw 'nocode';
        name = G.name;
        return kdf(norm(code), u8(G.salt), G.it || 150000).then(function (k) { return dec(k, u8(G.iv), u8(G.wk)); });
      }).then(function (raw) {
        st(c, T('جارٍ تجهيز نسختك…', 'Preparing your copy…'));
        return Promise.all([S.importKey('raw', raw, 'AES-GCM', false, ['decrypt']), fetch('vault/' + DOC + '-' + G.lang + '.bin').then(function (r) { return r.arrayBuffer(); })]);
      }).then(function (r) { var b = new Uint8Array(r[1]); return dec(r[0], b.slice(0, 12), b.slice(12)); })
        .then(function (pdf) { return stampPDF(pdf, name).catch(function () { return pdf; }); })
        .then(function (out) {
          var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([out], { type: 'application/pdf' }));
          a.download = 'uni-root-' + DOC + '-' + G.lang + '.pdf'; document.body.appendChild(a); a.click(); a.remove();
          st(c, T('تم. نسختك الخاصة اتحمّلت.', 'Done. Your personal copy is downloading.'), 'ok');
        }).catch(function (e) { st(c, e === 'nocode' ? T('الكود غير صحيح أو لم يعد صالحًا لهذا الملف.', 'This code is not valid for this file.') : T('تعذّر فك الملف بهذا الكود.', 'Could not open the file with this code.'), 'bad'); });
    }
    c.querySelector('.go').onclick = go; inp.onkeydown = function (e) { if (e.key === 'Enter') go(); };
  }

  // ---------- owner: give a code / take it back ----------
  function gh(path, t) { return fetch('https://api.github.com/repos/' + REPO + '/contents/' + path + '?ref=main&t=' + Date.now(), { headers: { Authorization: 'Bearer ' + t, Accept: 'application/vnd.github+json' }, cache: 'no-store' }).then(function (r) { if (r.status === 401) throw 'auth'; if (!r.ok) throw 'net'; return r.json(); }).then(function (j) { return { sha: j.sha, data: JSON.parse(decodeURIComponent(escape(atob(j.content.replace(/\n/g, ''))))) }; }); }
  function put(path, t, data, sha, msg) { return fetch('https://api.github.com/repos/' + REPO + '/contents/' + path, { method: 'PUT', headers: { Authorization: 'Bearer ' + t, Accept: 'application/vnd.github+json' }, body: JSON.stringify({ message: msg, content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 1) + '\n'))), sha: sha, branch: 'main' }) }).then(function (r) { if (r.status === 401) throw 'auth'; if (!r.ok) throw 'net'; return r.json(); }); }
  function token() { var t = null; try { t = localStorage.getItem(TK); } catch (e) {} return t; }
  function masterKey(pass, keys) { return kdf(pass, u8(keys.salt), keys.it); }
  function fileKey(mk, keys, doc, lang) { var w = keys.keys[doc + '|' + lang]; if (!w) return Promise.reject('nofile'); return dec(mk, u8(w.iv), u8(w.ct)); }
  function openOwner(title) {
    var c = modal('<h3>' + T('أكواد التحميل', 'Download codes') + '</h3><p>' + title + '</p>' +
      '<input type="password" class="mp" placeholder="' + T('كلمة سر المالك', 'Owner password') + '" autocomplete="off">' +
      (token() ? '' : '<input class="tk" placeholder="GitHub token" autocomplete="off">') +
      '<div class="vsec"><b>' + T('كود جديد', 'New code') + '</b><input class="nm" placeholder="' + T('اسم الشخص', 'Person’s name') + '"><select class="lg"><option value="both">' + T('العربي والإنجليزي', 'Arabic and English') + '</option><option value="ar">' + T('العربي فقط', 'Arabic only') + '</option><option value="en">' + T('الإنجليزي فقط', 'English only') + '</option></select>' +
      '<div class="vr"><button class="go mk" type="button">' + T('أنشئ الكود', 'Create the code') + '</button><button class="no2 x" type="button">' + T('إغلاق', 'Close') + '</button></div><div class="st"></div><div class="res"></div></div>' +
      '<div class="vsec"><b>' + T('الأكواد الحالية لهذا الملف', 'Current codes for this file') + '</b><div class="lst"></div></div>' +
      '<div class="vsec"><button class="no2 cp" type="button">' + T('تغيير كلمة سر المالك', 'Change owner password') + '</button></div>');
    var mp = c.querySelector('.mp'); try { mp.value = sessionStorage.getItem('uniroot_vp') || ''; } catch (e) {}
    c.querySelector('.x').onclick = function () { c.parentNode.remove(); };
    function tk() { var i = c.querySelector('.tk'); if (i && i.value.trim()) { try { localStorage.setItem(TK, i.value.trim()); } catch (e) {} } return token(); }
    function err(e) { st(c, e === 'auth' ? T('مفتاح GitHub غير صالح.', 'GitHub token rejected.') : e === 'pass' ? T('كلمة السر غير صحيحة.', 'Wrong password.') : e === 'nofile' ? T('الملف غير موجود في الخزنة.', 'File not in the vault.') : T('حصل خطأ، جرّب تاني.', 'Something went wrong, try again.'), 'bad'); if (e === 'auth') try { localStorage.removeItem(TK); } catch (x) {} }
    function list() {
      var t = tk(), box = c.querySelector('.lst'); if (!t) { box.innerHTML = '<p>' + T('محتاج مفتاح GitHub.', 'GitHub token needed.') + '</p>'; return; }
      gh('vault/grants.json', t).then(function (g) {
        var mine = g.data.grants.filter(function (x) { return x.doc === DOC; }), by = {};
        mine.forEach(function (x) { (by[x.id] = by[x.id] || []).push(x); });
        var ids = Object.keys(by); box.innerHTML = ids.length ? '' : '<p>' + T('لا يوجد.', 'None.') + '</p>';
        ids.forEach(function (id) { var a = by[id], r = el('div', 'vg', '<div><b></b><small></small></div><button type="button">' + T('إلغاء الكود', 'Revoke') + '</button>');
          r.querySelector('b').textContent = a[0].name; r.querySelector('small').textContent = a.map(function (x) { return x.lang.toUpperCase(); }).join(' + ') + ' · ' + a[0].date;
          r.querySelector('button').onclick = function () { if (!confirm(T('إلغاء كود ', 'Revoke the code for ') + a[0].name + '?')) return; st(c, T('جارٍ الإلغاء…', 'Revoking…'));
            gh('vault/grants.json', t).then(function (g2) { g2.data.grants = g2.data.grants.filter(function (x) { return !(x.id === id && x.doc === DOC); }); return put('vault/grants.json', t, g2.data, g2.sha, 'Revoke a download code'); })
              .then(function () { st(c, T('اتلغى. التغيير بيظهر على الموقع خلال دقيقة.', 'Revoked. Live on the site within a minute.'), 'ok'); list(); }).catch(err); };
          box.appendChild(r); });
      }).catch(function (e) { box.innerHTML = ''; err(e); });
    }
    list();
    c.querySelector('.mk').onclick = function () {
      var pass = mp.value, name = c.querySelector('.nm').value.trim(), lg = c.querySelector('.lg').value, t = tk();
      if (!pass || !name) { st(c, T('اكتب كلمة السر واسم الشخص.', 'Enter the password and the name.'), 'bad'); return; }
      if (!t) { st(c, T('محتاج مفتاح GitHub.', 'GitHub token needed.'), 'bad'); return; }
      var langs = lg === 'both' ? ['ar', 'en'] : [lg], code = newCode(), keys;
      st(c, T('جارٍ الإنشاء…', 'Creating…'));
      getJSON('vault/keys.json').then(function (k) { keys = k; return masterKey(pass, keys); })
        .then(function (mk) { return Promise.all(langs.map(function (l) { return fileKey(mk, keys, DOC, l).catch(function (e) { throw e === 'nofile' ? e : 'pass'; }); })); })
        .then(function (raws) { try { sessionStorage.setItem('uniroot_vp', pass); } catch (e) {}
          return idOf(code).then(function (id) { var salt = rnd(16); return kdf(norm(code), salt, 150000).then(function (wk) {
            return Promise.all(raws.map(function (raw, i) { var iv = rnd(12); return enc(wk, iv, raw).then(function (ct) { return { id: id, name: name, doc: DOC, lang: langs[i], date: new Date().toISOString().slice(0, 10), salt: b64(salt), it: 150000, iv: b64(iv), wk: b64(ct) }; }); })); }); }); })
        .then(function (recs) { return gh('vault/grants.json', t).then(function (g) { g.data.grants = g.data.grants.concat(recs); return put('vault/grants.json', t, g.data, g.sha, 'Add a download code'); }); })
        .then(function () {
          var url = location.origin + location.pathname + '?d=' + DOC;
          var msg = T('أهلًا ' + name + '،\nده كود تحميل نسختك الخاصة من «' + title + '»:\n' + code + '\nافتح الرابط ده، واضغط «تحميل بكود»، واكتب الكود:\n' + url, 'Hello ' + name + ',\nHere is the code for your personal copy of “' + title + '”:\n' + code + '\nOpen this link, press “Download with a code”, and enter it:\n' + url);
          var res = c.querySelector('.res'); res.innerHTML = '<div class="vout"></div><div class="vr"><button class="go" type="button">' + T('انسخ الرسالة', 'Copy the message') + '</button></div>';
          res.querySelector('.vout').textContent = msg; res.querySelector('.go').onclick = function () { navigator.clipboard && navigator.clipboard.writeText(msg); this.textContent = T('اتنسخت ✓', 'Copied ✓'); };
          st(c, T('الكود جاهز. بيشتغل على الموقع خلال دقيقة.', 'Code ready. Works on the site within a minute.'), 'ok'); c.querySelector('.nm').value = ''; list();
        }).catch(err);
    };
    c.querySelector('.cp').onclick = function () {
      var pass = mp.value, np = prompt(T('كلمة السر الجديدة (8 حروف على الأقل):', 'New password (at least 8 characters):')), t = tk();
      if (!np || np.length < 8) return; if (!pass || !t) { st(c, T('اكتب كلمة السر الحالية الأول.', 'Enter the current password first.'), 'bad'); return; }
      st(c, T('جارٍ التغيير…', 'Changing…'));
      var cur; gh('vault/keys.json', t).then(function (k) { cur = k; return masterKey(pass, k.data); }).then(function (mk) {
        var names = Object.keys(cur.data.keys); return Promise.all(names.map(function (n) { var w = cur.data.keys[n]; return dec(mk, u8(w.iv), u8(w.ct)).catch(function () { throw 'pass'; }); })).then(function (raws) {
          var salt = rnd(16); return kdf(np, salt, cur.data.it).then(function (nk) { return Promise.all(raws.map(function (raw) { var iv = rnd(12); return enc(nk, iv, raw).then(function (ct) { return { iv: b64(iv), ct: b64(ct) }; }); })).then(function (ws) {
            var keys = {}; names.forEach(function (n, i) { keys[n] = ws[i]; }); return put('vault/keys.json', t, { v: 1, salt: b64(salt), it: cur.data.it, keys: keys }, cur.sha, 'Change the vault password'); }); }); }); })
        .then(function () { mp.value = np; try { sessionStorage.setItem('uniroot_vp', np); } catch (e) {} st(c, T('اتغيرت كلمة السر.', 'Password changed.'), 'ok'); }).catch(err);
    };
  }

  window.UNIROOT_VAULT = function (bar, title) {
    var b = el('button', 'vb', T('تحميل بكود', 'Download with a code')); b.type = 'button'; b.onclick = openDownload; bar.insertBefore(b, bar.lastElementChild);
    if (OWN) { var o = el('button', 'vb', '🔑'); o.type = 'button'; o.title = T('أكواد التحميل', 'Download codes'); o.onclick = function () { openOwner(title); }; bar.insertBefore(o, bar.lastElementChild); }
  };
})();
