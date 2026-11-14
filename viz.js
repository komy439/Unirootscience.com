// uni root · site visuals: hero wave ribbons, orbits, ripple interference, living cell, skeleton, CTA waves.
(function () {
  'use strict';
  var BLUE = [255, 240, 205], RED = [230, 165, 70], VIO = [243, 207, 122];
  var OCOL = ['#ffffff', '#f3cf7a', '#e6b85c', '#fff0c8', '#c8943f', '#f3cf7a', '#ffe29a', '#e6b85c', '#fff0c8', '#c8943f', '#f3cf7a', '#ffd77a'];
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR = Math.min(2, window.devicePixelRatio || 1);
  var logo = new Image(); logo.src = 'img/logo.png';
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function hexA(h, a) { var n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }
  // run a draw function only while its canvas is on screen
  function stage(cv, ratio, fn) {
    if (!cv) return;
    var x = cv.getContext('2d'), vis = false, t0 = performance.now(), W = 0, H = 0;
    function fit() { var w = cv.clientWidth, h = ratio ? w * ratio : cv.clientHeight; if (ratio) cv.style.height = h + 'px'; W = Math.round(w * DPR); H = Math.round(h * DPR); cv.width = W; cv.height = H; }
    fit(); addEventListener('resize', fit);
    new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }, { rootMargin: '80px' }).observe(cv);
    (function loop(now) { if (vis) fn(x, W, H, reduce ? 2 : (now - t0) / 1000); requestAnimationFrame(loop); })(t0);
  }

  /* ---------- hero background: slow golden rays and dust, like the end of a session ---------- */
  function rays(x, W, H, t, cx, cy, n, alpha) {
    x.save(); x.translate(cx, cy); x.rotate(t * .05); var L = Math.hypot(W, H);
    for (var i = 0; i < n; i++) { var a0 = i * 2 * Math.PI / n, a1 = a0 + Math.PI / n * .14; x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, L, a0, a1); x.closePath();
      var g = x.createRadialGradient(0, 0, 0, 0, 0, L * .7); g.addColorStop(0, 'rgba(243,207,122,' + alpha + ')'); g.addColorStop(1, 'rgba(243,207,122,0)'); x.fillStyle = g; x.fill(); }
    x.restore();
  }
  function dust(x, W, H, t, n) { x.globalCompositeOperation = 'lighter'; for (var i = 0; i < n; i++) { var px = (i * 197.3 + t * 9 * (1 + i % 3)) % W, py = (i * 83.7 + H - t * 14 * (1 + i % 4)) % H; py = py < 0 ? py + H : py; var a = .25 + .35 * Math.abs(Math.sin(t * .8 + i)); x.fillStyle = 'rgba(243,207,122,' + a + ')'; x.beginPath(); x.arc(px, py, (.8 + i % 3 * .7) * DPR, 0, 7); x.fill(); } x.globalCompositeOperation = 'source-over'; }
  stage(document.getElementById('heroBg'), 0, function (x, W, H, t) {
    var g = x.createRadialGradient(W * .7, H * .48, 0, W * .7, H * .48, Math.max(W, H) * .8); g.addColorStop(0, '#2a2b31'); g.addColorStop(.55, '#17181c'); g.addColorStop(1, '#0c0c0e');
    x.fillStyle = g; x.fillRect(0, 0, W, H); rays(x, W, H, t, W * .7, H * .48, 18, .05); dust(x, W, H, t, 70);
  });
  Array.prototype.forEach.call(document.querySelectorAll('canvas.qbg'), function (cv) { stage(cv, 0, function (x, W, H, t) {
    x.clearRect(0, 0, W, H); rays(x, W, H, t * .7, W / 2, H / 2, 22, .045); dust(x, W, H, t, 40);
    var g = x.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.min(W, H) * .5); g.addColorStop(0, 'rgba(243,207,122,.10)'); g.addColorStop(1, 'rgba(243,207,122,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  }); });

  /* ---------- the end-of-session sun: dark disk, turning rays, orbits 4 and 7 lit gold, the logo rising ---------- */
  function sun(x, W, t) {
    var c = W / 2, R = W * .47; x.clearRect(0, 0, W, W);
    var dg = x.createRadialGradient(c, c, R * .2, c, c, R); dg.addColorStop(0, '#1d1d22'); dg.addColorStop(1, '#0d0d10'); x.fillStyle = dg; x.beginPath(); x.arc(c, c, R, 0, 7); x.fill();
    x.strokeStyle = 'rgba(200,200,215,.25)'; x.lineWidth = .7 * DPR; x.stroke();
    x.save(); x.beginPath(); x.arc(c, c, R, 0, 7); x.clip(); x.translate(c, c); x.rotate(t * .08);
    for (var i = 0; i < 16; i++) { var a0 = i * Math.PI / 8; x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, R, a0, a0 + Math.PI / 8 * .2); x.closePath(); var g = x.createRadialGradient(0, 0, R * .1, 0, 0, R); g.addColorStop(0, 'rgba(243,207,122,.28)'); g.addColorStop(1, 'rgba(243,207,122,0)'); x.fillStyle = g; x.fill(); }
    x.restore();
    var flash = Math.max(0, Math.sin(t * .9) - .85) / .15;   // a short flash now and then
    x.globalCompositeOperation = 'lighter';
    var hg = x.createRadialGradient(c, c, 0, c, c, R * .62); hg.addColorStop(0, 'rgba(255,238,190,' + (.45 + .35 * flash) + ')'); hg.addColorStop(.35, 'rgba(243,207,122,.18)'); hg.addColorStop(1, 'rgba(243,207,122,0)'); x.fillStyle = hg; x.beginPath(); x.arc(c, c, R * .62, 0, 7); x.fill();
    [[7, R * .56, .2], [4, R * .3, -.25]].forEach(function (o) {
      var n = o[0], r = o[1], rot = t * o[2] * .2, pts = [];
      x.strokeStyle = 'rgba(243,207,122,.85)'; x.lineWidth = 1 * DPR; x.shadowColor = '#f3cf7a'; x.shadowBlur = 5 * DPR; x.beginPath(); x.arc(c, c, r, 0, 7); x.stroke();
      for (var i = 0; i < n; i++) { var an = -Math.PI / 2 + i * 2 * Math.PI / n + rot; pts.push([c + r * Math.cos(an), c + r * Math.sin(an)]); }
      x.lineWidth = .6 * DPR; x.beginPath(); pts.forEach(function (p, i) { i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]); }); x.closePath(); x.strokeStyle = 'rgba(243,207,122,.7)'; x.stroke();
      if (n === 7) pts.forEach(function (p) { x.beginPath(); x.moveTo(c, c); x.lineTo(p[0], p[1]); x.strokeStyle = 'rgba(243,207,122,.18)'; x.stroke(); });
      pts.forEach(function (p, i) { var pu = .7 + .3 * Math.sin(t * 2 + i); var lg = x.createRadialGradient(p[0], p[1], 0, p[0], p[1], 8 * DPR); lg.addColorStop(0, 'rgba(255,240,200,' + pu + ')'); lg.addColorStop(1, 'rgba(243,207,122,0)'); x.fillStyle = lg; x.beginPath(); x.arc(p[0], p[1], 8 * DPR, 0, 7); x.fill(); x.fillStyle = '#fff3d0'; x.beginPath(); x.arc(p[0], p[1], 1.8 * DPR, 0, 7); x.fill(); });
    });
    x.shadowBlur = 0; x.globalCompositeOperation = 'source-over';
    var lr = R * .19; if (logo.naturalWidth) { x.save(); x.beginPath(); x.arc(c, c, lr, 0, 7); x.clip(); x.drawImage(logo, c - lr, c - lr, lr * 2, lr * 2); x.restore(); }
    x.strokeStyle = 'rgba(243,207,122,.9)'; x.lineWidth = .9 * DPR; x.beginPath(); x.arc(c, c, lr * 1.08, 0, 7); x.stroke();
    if (flash > 0) { x.globalCompositeOperation = 'lighter'; x.fillStyle = 'rgba(255,240,200,' + (.25 * flash) + ')'; x.beginPath(); x.arc(c, c, R, 0, 7); x.fill(); x.globalCompositeOperation = 'source-over'; }
  }

  /* ---------- orbits (hero picture and the orbit lab) ---------- */
  function orbits(x, W, t, lit, mode, speed) {
    var c = W / 2, R = W * .43, step = R / 12.3;
    x.clearRect(0, 0, W, W); x.globalCompositeOperation = 'lighter';
    for (var n = 1; n <= 12; n++) {
      var r = (n + .25) * step, col = OCOL[n - 1], on = lit.indexOf(n) >= 0, a = on ? 1 : (mode === 'silence' ? .2 : .34);
      if (mode === 'pulse' && on) a = .5 + .5 * Math.abs(Math.sin(t * 2.4 + n));
      x.strokeStyle = hexA(col, a * .85); x.lineWidth = (on ? 1 : .5) * DPR; x.beginPath(); x.arc(c, c, r, 0, 7); x.stroke();
      var sp = mode === 'silence' ? 0 : speed * (.25 + (13 - n) * .03) * (n % 2 ? 1 : -1);
      for (var i = 0; i < n; i++) {
        var an = i * 2 * Math.PI / n + t * sp + n * .4, px = c + r * Math.cos(an), py = c + r * Math.sin(an);
        if (on) { var gl = x.createRadialGradient(px, py, 0, px, py, 7 * DPR); gl.addColorStop(0, hexA(col, .8 * a)); gl.addColorStop(1, hexA(col, 0)); x.fillStyle = gl; x.beginPath(); x.arc(px, py, 7 * DPR, 0, 7); x.fill(); }
        x.fillStyle = hexA(col, on ? a : a * 1.4); x.beginPath(); x.arc(px, py, (on ? 2 : 1.2) * DPR, 0, 7); x.fill();
      }
    }
    x.globalCompositeOperation = 'source-over';
    // ring numbers 1-12 along one diagonal
    x.font = (9 * DPR) + 'px ui-monospace,monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
    for (var m = 1; m <= 12; m++) { var rr = (m + .25) * step, la = -Math.PI * .25; x.fillStyle = lit.indexOf(m) >= 0 ? 'rgba(255,240,200,.95)' : 'rgba(243,207,122,.45)'; x.fillText(String(m), c + (rr + step * .45) * Math.cos(la), c + (rr + step * .45) * Math.sin(la)); }
    x.textAlign = 'start'; x.textBaseline = 'alphabetic';
    var lr = step * .9, g2 = x.createRadialGradient(c, c, lr * .7, c, c, lr * 2.6); g2.addColorStop(0, 'rgba(243,207,122,.3)'); g2.addColorStop(1, 'rgba(243,207,122,0)');
    x.fillStyle = g2; x.beginPath(); x.arc(c, c, lr * 2.6, 0, 7); x.fill();
    if (logo.naturalWidth) { x.save(); x.beginPath(); x.arc(c, c, lr, 0, 7); x.clip(); x.drawImage(logo, c - lr, c - lr, lr * 2, lr * 2); x.restore(); }
  }
  var sets = [[2, 4, 7, 10], [3, 5, 8, 11], [4, 7], [6, 9, 12], [2, 7, 8]], hs = 0, ht = 0;
  stage(document.getElementById('heroOrb'), 1, function (x, W, H, t) {
    if (t - ht > 3.2) { ht = t; hs = (hs + 1) % sets.length; }
    sun(x, W, t);
  });
  var lab = { mode: 'order', speed: .6, paused: false, tt: 0, last: 0 }, LIT = { order: [1, 2, 3, 5, 8, 9, 11], pulse: [4, 6, 7, 10, 12], silence: [4, 7] };
  document.querySelectorAll('[data-mode]').forEach(function (b, _, all) { b.onclick = function () { lab.mode = b.dataset.mode; all.forEach(function (o) { o.setAttribute('aria-pressed', o === b); }); }; });
  var spd = document.getElementById('spd'); if (spd) spd.oninput = function () { lab.speed = spd.value / 100; };
  stage(document.getElementById('orbLab'), 1, function (x, W, H, t) {
    var dt = lab.last ? t - lab.last : 0; lab.last = t; lab.tt += dt;
    orbits(x, W, lab.tt, LIT[lab.mode], lab.mode, lab.speed);
  });

  /* ---------- ripple tank: two sources, blue and red, interfering ---------- */
  var rip = { fb: 9, fr: 12, sep: .42 };
  ['fb', 'fr', 'sep'].forEach(function (k) { var el = document.getElementById('r_' + k); if (el) el.oninput = function () { rip[k] = k === 'sep' ? el.value / 100 : +el.value; }; });
  (function () {
    var cv = document.getElementById('ripple'); if (!cv) return;
    // light and sound leave one point; light runs back and forth until sound reaches the end, where they meet
    var RATIO = 874030, PASSES = 9, TS = 9, HOLD = 4.2;      // c / v(air, 343 m/s) ≈ 874,030
    function fmt(n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
    stage(cv, 1, function (x, W, H, t) {
      var ar = document.documentElement.lang === 'ar', F = ar ? 'Ami,serif' : 'Poppins,sans-serif';
      var bg = x.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * .75); bg.addColorStop(0, '#1d1d22'); bg.addColorStop(1, '#0b0b0d'); x.fillStyle = bg; x.fillRect(0, 0, W, H);
      var x0 = W * .08, x1 = W * .92, Lw = x1 - x0, yL = H * .27, yS = H * .49, yC = H * .7;
      var cyc = (t % (TS + HOLD)), prog = Math.min(1, cyc / TS), done = cyc >= TS;
      var WHITE = '255,250,240', GOLD = '232,170,72';
      // start and end lines
      x.setLineDash([3 * DPR, 5 * DPR]); x.strokeStyle = 'rgba(243,207,122,.35)'; x.lineWidth = .8 * DPR;
      [x0, x1].forEach(function (X) { x.beginPath(); x.moveTo(X, H * .12); x.lineTo(X, H * .77); x.stroke(); }); x.setLineDash([]);
      x.font = (11 * DPR) + 'px ' + F; x.fillStyle = 'rgba(243,207,122,.85)'; x.textAlign = 'center';
      x.fillText(ar ? 'بداية التعريض' : 'EXPOSURE START', x0 + 30 * DPR, H * .1); x.fillText(ar ? 'نهاية التعريض' : 'EXPOSURE END', x1 - 30 * DPR, H * .1);
      // lane labels in the colour of their wave
      x.textAlign = 'left'; x.font = '600 ' + (14 * DPR) + 'px ' + F;
      x.fillStyle = 'rgb(' + WHITE + ')'; x.fillText(ar ? 'الضوء' : 'LIGHT', x0 + 8 * DPR, yL - H * .11);
      x.fillStyle = 'rgb(' + GOLD + ')'; x.fillText(ar ? 'الصوت' : 'SOUND', x0 + 8 * DPR, yS - H * .115);
      x.font = (10.5 * DPR) + 'px ui-monospace,monospace';
      x.fillStyle = 'rgba(' + WHITE + ',.7)'; x.fillText('c ≈ 299,792,458 m/s', x0 + 8 * DPR, yL - H * .08);
      x.fillStyle = 'rgba(' + GOLD + ',.8)'; x.fillText('v ≈ 343 m/s', x0 + 8 * DPR, yS - H * .085);
      x.globalCompositeOperation = 'lighter';
      // LIGHT: every pass leaves a faint fast line; the head carries a tight bright wave
      var s = prog * PASSES, k = Math.min(PASSES - 1, Math.floor(s)), fr = done ? 1 : s - k, fwd = k % 2 === 0, hx = fwd ? x0 + fr * Lw : x1 - fr * Lw;
      x.strokeStyle = 'rgba(' + WHITE + ',' + (.12 + .25 * Math.min(1, k / PASSES)) + ')'; x.lineWidth = .6 * DPR;
      if (k > 0 || fr > 0) { x.beginPath(); var a = k > 0 ? x0 : Math.min(x0, hx), b = k > 0 ? x1 : hx; for (var X = a; X <= b; X += 2) { var y = yL + H * .012 * Math.sin(X * .25); X === a ? x.moveTo(X, y) : x.lineTo(X, y); } x.stroke(); }
      x.beginPath(); var tail = Lw * .22;
      for (var d = 0; d <= tail; d += 1.5) { var X2 = fwd ? hx - d : hx + d; if (X2 < x0 || X2 > x1) break; var env = 1 - d / tail, y2 = yL + H * .055 * env * Math.sin(d * .32 - t * 30); d ? x.lineTo(X2, y2) : x.moveTo(X2, y2); }
      x.strokeStyle = 'rgba(' + WHITE + ',.95)'; x.lineWidth = 1.2 * DPR; x.shadowColor = 'rgba(' + WHITE + ',.9)'; x.shadowBlur = 10 * DPR; x.stroke(); x.shadowBlur = 0;
      var lg = x.createRadialGradient(hx, yL, 0, hx, yL, 12 * DPR); lg.addColorStop(0, 'rgba(' + WHITE + ',1)'); lg.addColorStop(1, 'rgba(' + WHITE + ',0)'); x.fillStyle = lg; x.beginPath(); x.arc(hx, yL, 12 * DPR, 0, 7); x.fill();
      // SOUND: one slow wave growing from the start to its front
      var sx = x0 + prog * Lw;
      x.beginPath(); for (var X3 = x0; X3 <= sx; X3 += 2) { var y3 = yS + H * .06 * Math.sin((X3 - x0) / Lw * 6.283 * 3 - t * 2.2); X3 === x0 ? x.moveTo(X3, y3) : x.lineTo(X3, y3); }
      x.strokeStyle = 'rgba(' + GOLD + ',.95)'; x.lineWidth = 1.4 * DPR; x.shadowColor = 'rgba(' + GOLD + ',.9)'; x.shadowBlur = 10 * DPR; x.stroke(); x.shadowBlur = 0;
      var sy = yS + H * .06 * Math.sin(prog * 6.283 * 3 - t * 2.2), sg = x.createRadialGradient(sx, sy, 0, sx, sy, 12 * DPR); sg.addColorStop(0, 'rgba(' + GOLD + ',1)'); sg.addColorStop(1, 'rgba(' + GOLD + ',0)'); x.fillStyle = sg; x.beginPath(); x.arc(sx, sy, 12 * DPR, 0, 7); x.fill();
      // the meeting at the end
      if (done && cyc - TS < 1.2) { var m = (cyc - TS) / 1.2, mr = (10 + 50 * m) * DPR, mg = x.createRadialGradient(x1, (yL + yS) / 2, 0, x1, (yL + yS) / 2, mr); mg.addColorStop(0, 'rgba(255,248,225,' + (.8 * (1 - m)) + ')'); mg.addColorStop(1, 'rgba(243,207,122,0)'); x.fillStyle = mg; x.beginPath(); x.arc(x1, (yL + yS) / 2, mr, 0, 7); x.fill();
        x.strokeStyle = 'rgba(255,248,225,' + (.9 * (1 - m)) + ')'; x.lineWidth = 1.2 * DPR; x.beginPath(); x.moveTo(x1, yL); x.lineTo(x1, yS); x.stroke(); }
      x.globalCompositeOperation = 'source-over';
      // the combined wave: born at the end in the instant they meet, running back towards the start
      var COMB = '255,226,154';
      x.textAlign = 'left'; x.font = '600 ' + (14 * DPR) + 'px ' + F; x.fillStyle = 'rgba(' + COMB + ',' + (done ? 1 : .35) + ')'; x.fillText(ar ? 'موجة الأثر المشترك' : 'COMBINED EFFECT', x0 + 8 * DPR, yC - H * .09);
      x.font = (10.5 * DPR) + 'px ui-monospace,monospace'; x.fillStyle = 'rgba(' + COMB + ',' + (done ? .75 : .25) + ')'; x.fillText(ar ? 'الضوء + الصوت ← عند الالتقاء' : 'light + sound, from the meeting', x0 + 8 * DPR, yC - H * .06);
      x.strokeStyle = 'rgba(' + COMB + ',.12)'; x.lineWidth = .6 * DPR; x.beginPath(); x.moveTo(x0, yC); x.lineTo(x1, yC); x.stroke();
      if (done) {
        var cp = Math.min(1, (cyc - TS) / (HOLD * .7)), front = x1 - cp * Lw, fade = Math.min(1, (TS + HOLD - cyc) / .6);
        x.globalCompositeOperation = 'lighter'; x.beginPath();
        for (var X4 = x1; X4 >= front; X4 -= 1.5) {
          var dd = (x1 - X4) / Lw, env = Math.exp(-dd * 1.2) * Math.min(1, (X4 - front) / (Lw * .06) + .15);
          var y4 = yC + H * .06 * env * (Math.sin(dd * 6.283 * 3 + t * 2.2) + .4 * Math.sin(dd * 6.283 * 22 + t * 14));
          X4 === x1 ? x.moveTo(X4, y4) : x.lineTo(X4, y4);
        }
        var cg = x.createLinearGradient(x1, 0, x0, 0); cg.addColorStop(0, 'rgba(255,250,240,' + fade + ')'); cg.addColorStop(1, 'rgba(232,170,72,' + fade + ')');
        x.strokeStyle = cg; x.lineWidth = 1.5 * DPR; x.shadowColor = 'rgba(' + COMB + ',.9)'; x.shadowBlur = 12 * DPR; x.stroke(); x.shadowBlur = 0;
        var fy = yC, fg2 = x.createRadialGradient(front, fy, 0, front, fy, 14 * DPR); fg2.addColorStop(0, 'rgba(' + COMB + ',' + fade + ')'); fg2.addColorStop(1, 'rgba(' + COMB + ',0)'); x.fillStyle = fg2; x.beginPath(); x.arc(front, fy, 14 * DPR, 0, 7); x.fill();
        x.globalCompositeOperation = 'source-over';
      }
      // the count: light's trips = c / v
      var trips = done ? RATIO : Math.floor(prog * RATIO);
      x.textAlign = 'center'; x.font = (11 * DPR) + 'px ' + F; x.fillStyle = 'rgba(243,207,122,.8)';
      x.fillText(ar ? 'مشاوير الضوء حتى يصل الصوت' : 'LIGHT TRIPS WHILE SOUND CROSSES ONCE', W / 2, H * .835);
      x.font = '600 ' + (24 * DPR) + 'px Poppins,sans-serif'; x.fillStyle = done ? '#fff3d0' : '#ffffff'; x.fillText(fmt(trips), W / 2, H * .895);
      x.font = (10.5 * DPR) + 'px ui-monospace,monospace'; x.fillStyle = 'rgba(243,207,122,.7)'; x.fillText('c ÷ v ≈ ' + fmt(RATIO), W / 2, H * .94);
      x.textAlign = 'start';
    });
  })();

  /* ---------- living cell: charges on the membrane (+ outside, − inside) and a zeta-potential wave passing round ---------- */
  stage(document.getElementById('cellCv'), 1, function (x, W, H, t) {
    var c = W / 2, cy = H / 2, R = W * .3;
    var bg = x.createRadialGradient(c, cy, 0, c, cy, W * .75); bg.addColorStop(0, '#1d1d22'); bg.addColorStop(1, '#0b0b0d'); x.fillStyle = bg; x.fillRect(0, 0, W, H);
    function rad(a, o) { return R * (1 + .03 * Math.sin(a * 5 + t * 1.1) + .02 * Math.sin(a * 9 - t * 1.6)) + (o || 0); }
    var zeta = (t * .7) % (Math.PI * 2);                     // where the wave is now
    function near(a) { var d = Math.abs(((a - zeta) % 6.283 + 9.425) % 6.283 - 3.1416); return Math.max(0, 1 - d / .55); }
    // cytoplasm
    var g = x.createRadialGradient(c - R * .2, cy - R * .25, R * .1, c, cy, R * 1.1); g.addColorStop(0, 'rgba(255,230,170,.16)'); g.addColorStop(1, 'rgba(200,140,60,.08)');
    x.beginPath(); for (var a = 0; a <= 6.3; a += .05) { var r = rad(a); a ? x.lineTo(c + r * Math.cos(a), cy + r * Math.sin(a)) : x.moveTo(c + r, cy); } x.closePath(); x.fillStyle = g; x.fill();
    x.globalCompositeOperation = 'lighter';
    // the slipping plane (where the zeta potential is measured): a fine dotted ring
    var Rz = R * 1.3;
    for (var d = 0; d < 120; d++) { var da = d / 120 * 6.283, k = near(da); x.fillStyle = 'rgba(243,207,122,' + (.18 + .7 * k) + ')'; x.beginPath(); x.arc(c + Rz * Math.cos(da), cy + Rz * Math.sin(da), (.7 + k * 1.4) * DPR, 0, 7); x.fill(); }
    // membrane: two thin layers
    [-4, 4].forEach(function (off) { x.beginPath(); for (var b = 0; b <= 6.3; b += .04) { var r2 = rad(b, off * DPR); b ? x.lineTo(c + r2 * Math.cos(b), cy + r2 * Math.sin(b)) : x.moveTo(c + r2, cy); } x.closePath(); x.strokeStyle = 'rgba(255,236,190,.7)'; x.lineWidth = .8 * DPR; x.stroke(); });
    // the wave: a bright arc running round the membrane and out to the slipping plane
    x.save(); x.lineCap = 'round';
    for (var s = 0; s < 14; s++) { var a0 = zeta - s * .04, f = 1 - s / 14; x.strokeStyle = 'rgba(255,248,225,' + (.9 * f) + ')'; x.lineWidth = (2.2 * f + .4) * DPR; x.beginPath(); x.arc(c, cy, rad(a0), a0 - .04, a0); x.stroke(); }
    var hx = c + rad(zeta) * Math.cos(zeta), hy = cy + rad(zeta) * Math.sin(zeta), hg = x.createRadialGradient(hx, hy, 0, hx, hy, 16 * DPR); hg.addColorStop(0, 'rgba(255,248,225,.9)'); hg.addColorStop(1, 'rgba(243,207,122,0)'); x.fillStyle = hg; x.beginPath(); x.arc(hx, hy, 16 * DPR, 0, 7); x.fill();
    x.restore();
    // charges: + outside, − inside; where the wave passes they flip
    x.font = '600 ' + (13 * DPR) + 'px Poppins,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    for (var q = 0; q < 32; q++) {
      var qa = q / 32 * 6.283, k2 = near(qa), flip = k2 > .45, ro = rad(qa, 13 * DPR), ri = rad(qa, -13 * DPR);
      x.fillStyle = 'rgba(243,207,122,' + (.65 + .35 * k2) + ')'; x.fillText(flip ? '−' : '+', c + ro * Math.cos(qa), cy + ro * Math.sin(qa));
      x.fillStyle = 'rgba(255,248,232,' + (.55 + .45 * k2) + ')'; x.fillText(flip ? '+' : '−', c + ri * Math.cos(qa), cy + ri * Math.sin(qa));
    }
    // ζ label riding with the wave on the slipping plane
    x.font = 'italic ' + (15 * DPR) + 'px Georgia,serif'; x.fillStyle = 'rgba(255,240,200,.95)'; x.fillText('ζ', c + (Rz + 16 * DPR) * Math.cos(zeta), cy + (Rz + 16 * DPR) * Math.sin(zeta));
    x.textAlign = 'start'; x.textBaseline = 'alphabetic';
    // organelles and nucleus
    for (var o = 0; o < 12; o++) { var oa = o * 2.4 + t * .1 * (o % 2 ? 1 : -1), orr = R * (.45 + .3 * ((o * 37) % 10) / 10), ox2 = c + orr * Math.cos(oa), oy = cy + orr * Math.sin(oa) * .9; var og = x.createRadialGradient(ox2, oy, 0, ox2, oy, 6 * DPR); og.addColorStop(0, 'rgba(255,230,170,.8)'); og.addColorStop(1, 'rgba(243,207,122,0)'); x.fillStyle = og; x.beginPath(); x.arc(ox2, oy, 6 * DPR, 0, 7); x.fill(); }
    var nr = R * (.28 + .012 * Math.sin(t * 2)), ng = x.createRadialGradient(c, cy, 0, c, cy, nr * 1.8); ng.addColorStop(0, 'rgba(255,255,255,.9)'); ng.addColorStop(.3, 'rgba(255,220,140,.6)'); ng.addColorStop(1, 'rgba(243,207,122,0)');
    x.fillStyle = ng; x.beginPath(); x.arc(c, cy, nr * 1.8, 0, 7); x.fill(); x.strokeStyle = 'rgba(255,255,255,.45)'; x.lineWidth = .7 * DPR; x.beginPath(); x.arc(c, cy, nr, 0, 7); x.stroke();
    x.globalCompositeOperation = 'source-over';
  });

  /* ---------- the body: the gold figure stays still; only light pulses travel along its three orbits ---------- */
  (function () {
    var cv = document.getElementById('bodyCv'); if (!cv) return;
    var im = new Image(); im.src = 'img/body.jpg';
    var IW = 890, IH = 1036, ORB = [[428, 490, 104, 400, 0], [431, 488, 398, 115, .4538], [431, 488, 398, 115, -.4538]];
    stage(cv, IH / IW, function (x, W, H, t) {
      x.fillStyle = '#0b0b0d'; x.fillRect(0, 0, W, H);
      if (!im.naturalWidth) return;
      x.drawImage(im, 0, 0, W, H); var k = W / IW;
      x.globalCompositeOperation = 'lighter';
      ORB.forEach(function (e, n) {
        var cs = Math.cos(e[4]), sn = Math.sin(e[4]);
        for (var c = 0; c < 2; c++) {
          var head = t * (.5 + n * .08) + c * Math.PI + n * 2.1;
          for (var j = 0; j < 22; j++) {
            var a = head - j * .04, px = e[2] * Math.cos(a), py = e[3] * Math.sin(a);
            var X = (e[0] + px * cs - py * sn) * k, Y = (e[1] + px * sn + py * cs) * k, f = 1 - j / 22, rr = (j ? 2.4 * f : 6) * DPR;
            var lg = x.createRadialGradient(X, Y, 0, X, Y, rr * 2.2); lg.addColorStop(0, 'rgba(255,250,232,' + f + ')'); lg.addColorStop(1, 'rgba(243,207,122,0)'); x.fillStyle = lg; x.beginPath(); x.arc(X, Y, rr * 2.2, 0, 7); x.fill();
          }
        }
      });
      x.globalCompositeOperation = 'source-over';
    });
  })();

  /* ---------- brain waves: the gold head, with a live brain-wave trace running outward ---------- */
  (function () {
    var cv = document.getElementById('brainCv'); if (!cv) return;
    var im = new Image(); im.src = 'img/brain.jpg';
    var IW = 1231, IH = 1220;
    function sig(s) { var v = Math.sin(s * 1.7) * .5 + Math.sin(s * 3.9 + 1.3) * .35 + Math.sin(s * 7.3 + .4) * .25 + Math.sin(s * .55) * .4; var spk = Math.pow(Math.max(0, Math.sin(s * .9 + 2)), 14) * 1.4; return v + (Math.sin(s * 2.3) > 0 ? spk : -spk); }
    stage(cv, IH / IW, function (x, W, H, t) {
      x.fillStyle = '#0b0b0d'; x.fillRect(0, 0, W, H);
      if (im.naturalWidth) x.drawImage(im, 0, 0, W, H);
      var cx = W * .5, y0 = H * .238, step = 6 * DPR, L0 = W * .06, R0 = W * .94;
      x.globalCompositeOperation = 'lighter'; x.lineJoin = 'round';
      [[0, 1.6, 1], [.22, .8, .4], [.44, .6, .2]].forEach(function (L) {
        x.beginPath();
        for (var X = L0; X <= R0; X += step) {
          var d = Math.abs(X - cx) / W, inside = Math.max(0, 1 - d * 2.3), amp = H * (.012 + .075 * inside);
          var y = y0 + amp * sig(d * 26 - (t - L[0]) * 3.2) * (X < cx ? 1 : -1) * .85;
          X === L0 ? x.moveTo(X, y) : x.lineTo(X, y);
        }
        var gr = x.createLinearGradient(L0, 0, R0, 0); gr.addColorStop(0, 'rgba(255,240,200,0)'); gr.addColorStop(.12, 'rgba(255,244,214,' + L[2] + ')'); gr.addColorStop(.88, 'rgba(255,244,214,' + L[2] + ')'); gr.addColorStop(1, 'rgba(255,240,200,0)');
        x.strokeStyle = gr; x.lineWidth = L[1] * DPR; if (!L[0]) { x.shadowColor = 'rgba(243,207,122,1)'; x.shadowBlur = 14 * DPR; } x.stroke(); x.shadowBlur = 0;
      });
      x.globalCompositeOperation = 'source-over';
    });
  })();

  /* ---------- time: a clock bouncing like a ball on the fabric of space-time, smoke at its lower edge ---------- */
  (function () {
    var cv = document.getElementById('timeCv'); if (!cv) return;
    var smoke = [], last = 0;
    stage(cv, .85, function (x, W, H, t) {
      var dt = last ? Math.min(.05, t - last) : 0; last = t;
      var bg = x.createRadialGradient(W / 2, H * .55, 0, W / 2, H * .55, Math.max(W, H) * .8); bg.addColorStop(0, '#22211f'); bg.addColorStop(1, '#0b0b0d'); x.fillStyle = bg; x.fillRect(0, 0, W, H);
      var period = 2.2, p = (t / period) % 1, hgt = 4 * p * (1 - p);                       // 0 at impact, 1 at the top
      var q = Math.max(0, 1 - Math.min(p, 1 - p) / .16), depth = .12 + .85 * q * q;        // the fabric dips at impact
      var cx = W / 2, hz = H * .34, N = 30, M = 24;
      function P(u, v) {
        var X = (u - .5) * 2.6, Z = v * 1.6 + .35, dz = Z - 1.05, r = Math.hypot(X, dz);
        var y = -depth / (1 + r * r * 7) + .05 * Math.sin(Z * 7 - t * 1.8) * (1 - .5 * q) + .03 * Math.sin(X * 2.4 + Z * 3 - t * 1.1) + .04 * q * Math.sin(r * 14 - t * 9) / (1 + r * 4);
        var sc = 1 / Z; return [cx + X * sc * W * .42, hz + (.55 - y) * sc * H * .55];
      }
      x.lineWidth = .7 * DPR;
      for (var j = 0; j <= M; j++) { x.beginPath(); for (var i = 0; i <= N; i++) { var pp = P(i / N, j / M); i ? x.lineTo(pp[0], pp[1]) : x.moveTo(pp[0], pp[1]); } x.strokeStyle = 'rgba(243,207,122,' + (.14 + .4 * (1 - j / M)) + ')'; x.stroke(); }
      for (var i2 = 0; i2 <= N; i2++) { x.beginPath(); for (var j2 = 0; j2 <= M; j2++) { var qq = P(i2 / N, j2 / M); j2 ? x.lineTo(qq[0], qq[1]) : x.moveTo(qq[0], qq[1]); } x.strokeStyle = 'rgba(243,207,122,.2)'; x.stroke(); }
      // the ball-clock: touches the bottom of the dip at impact, rises between
      var bottom = P(.5, (1.05 - .35) / 1.6), R = Math.min(W, H) * .13, squash = 1 - .12 * q;
      var ccx = cx, oy = bottom[1] - R * squash - hgt * H * .36 + R * .25 * q;
      // smoke from the lower edge
      if (!reduce) for (var e = 0; e < 2; e++) { var ea = Math.PI * (.15 + .7 * Math.random()); smoke.push({ x: ccx + Math.cos(ea) * R * .9, y: oy + Math.sin(ea) * R * squash * .9, vx: (Math.random() - .5) * 34 * DPR, vy: (4 + Math.random() * 8) * DPR, life: 0, max: .7 + Math.random() * .5 }); }
      x.globalCompositeOperation = 'lighter';
      smoke = smoke.filter(function (s) { s.life += dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vy *= .985; s.vx *= .99; return s.life < s.max; });
      smoke.forEach(function (s) { var f = s.life / s.max, rr = (5 + 22 * f) * DPR, a = .1 * (1 - f); var sg = x.createRadialGradient(s.x, s.y, 0, s.x, s.y, rr); sg.addColorStop(0, 'rgba(230,215,185,' + a + ')'); sg.addColorStop(1, 'rgba(200,180,140,0)'); x.fillStyle = sg; x.beginPath(); x.arc(s.x, s.y, rr, 0, 7); x.fill(); });
      var hg = x.createRadialGradient(ccx, oy, R * .6, ccx, oy, R * 2.2); hg.addColorStop(0, 'rgba(243,207,122,.16)'); hg.addColorStop(1, 'rgba(243,207,122,0)'); x.fillStyle = hg; x.beginPath(); x.arc(ccx, oy, R * 2.2, 0, 7); x.fill();
      x.globalCompositeOperation = 'source-over';
      x.save(); x.translate(ccx, oy); x.scale(1 / squash, squash);
      var fg = x.createRadialGradient(0, -R * .3, 0, 0, 0, R); fg.addColorStop(0, '#24221d'); fg.addColorStop(1, '#0f0e0c'); x.fillStyle = fg; x.beginPath(); x.arc(0, 0, R, 0, 7); x.fill();
      // the lower rim dissolves into smoke: fade the bottom of the ring
      var rg = x.createLinearGradient(0, -R, 0, R); rg.addColorStop(0, 'rgba(243,207,122,.95)'); rg.addColorStop(.55, 'rgba(243,207,122,.7)'); rg.addColorStop(1, 'rgba(243,207,122,0)');
      x.strokeStyle = rg; x.lineWidth = 1.2 * DPR; x.beginPath(); x.arc(0, 0, R, 0, 7); x.stroke();
      for (var k = 0; k < 60; k++) { var a = k * Math.PI / 30, big = k % 5 === 0, r1 = R * (big ? .78 : .85), r2 = R * .9, fade = Math.min(1, Math.max(0, (1 - Math.sin(a)) * .9)); x.beginPath(); x.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); x.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); x.strokeStyle = 'rgba(255,240,200,' + ((big ? .9 : .4) * fade) + ')'; x.lineWidth = (big ? 1.1 : .6) * DPR; x.stroke(); }
      var now = new Date(), sec = now.getSeconds() + now.getMilliseconds() / 1000, mn = now.getMinutes() + sec / 60, hr = (now.getHours() % 12) + mn / 60;
      function hand(f, len, w, col) { var an = f * 2 * Math.PI - Math.PI / 2; x.beginPath(); x.moveTo(-Math.cos(an) * len * .12, -Math.sin(an) * len * .12); x.lineTo(Math.cos(an) * len, Math.sin(an) * len); x.strokeStyle = col; x.lineWidth = w * DPR; x.lineCap = 'round'; x.stroke(); }
      hand(hr / 12, R * .48, 2, '#fff3d0'); hand(mn / 60, R * .7, 1.3, '#fff3d0'); hand(sec / 60, R * .8, .7, '#f3cf7a');
      x.fillStyle = '#f3cf7a'; x.beginPath(); x.arc(0, 0, 2.2 * DPR, 0, 7); x.fill();
      x.restore();
    });
  })();

  /* ---------- π: light runs round a circle like the session timer, and turns back just before it closes ---------- */
  stage(document.getElementById('piCv'), 1, function (x, W, H, t) {
    x.clearRect(0, 0, W, H);
    var c = W / 2, R = W * .44, T = 7, u = (t % T) / T, tri = u < .5 ? u * 2 : 2 - u * 2, ease = tri * tri * (3 - 2 * tri);
    var start = -Math.PI / 2, span = ease * (Math.PI * 2 - .32), end = start + span;
    x.strokeStyle = 'rgba(243,207,122,.18)'; x.lineWidth = .8 * DPR; x.beginPath(); x.arc(c, c, R, 0, 7); x.stroke();
    x.globalCompositeOperation = 'lighter'; x.lineCap = 'round';
    x.strokeStyle = 'rgba(243,207,122,.85)'; x.lineWidth = 1.6 * DPR; x.shadowColor = 'rgba(243,207,122,.9)'; x.shadowBlur = 10 * DPR; x.beginPath(); x.arc(c, c, R, start, end); x.stroke(); x.shadowBlur = 0;
    var hx = c + R * Math.cos(end), hy = c + R * Math.sin(end), g = x.createRadialGradient(hx, hy, 0, hx, hy, 14 * DPR); g.addColorStop(0, 'rgba(255,250,235,1)'); g.addColorStop(1, 'rgba(243,207,122,0)'); x.fillStyle = g; x.beginPath(); x.arc(hx, hy, 14 * DPR, 0, 7); x.fill();
    x.fillStyle = 'rgba(255,240,200,.8)'; x.beginPath(); x.arc(c, c - R, 2 * DPR, 0, 7); x.fill();
    x.globalCompositeOperation = 'source-over';
  });

  /* ---------- 19 Hz: waves run straight through the words (a canvas over the quote) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('canvas.qwave'), function (cv) {
    stage(cv, 0, function (x, W, H, t) {
      x.clearRect(0, 0, W, H); x.globalCompositeOperation = 'lighter';
      for (var l = 0; l < 5; l++) {
        var y0 = H * (.3 + l * .1), amp = H * (.05 + .015 * Math.sin(l * 1.7)), k = 19 / W * (1 + l * .03), sp = 2 + l * .35;
        x.beginPath(); for (var X = 0; X <= W; X += 3) { var env = Math.sin(Math.PI * X / W), y = y0 + amp * env * Math.sin(X * k * Math.PI - t * sp + l); X ? x.lineTo(X, y) : x.moveTo(X, y); }
        x.strokeStyle = 'rgba(' + (l % 2 ? '243,207,122' : '255,244,214') + ',' + (l === 2 ? .75 : .32) + ')'; x.lineWidth = (l === 2 ? 1.2 : .7) * DPR;
        if (l === 2) { x.shadowColor = 'rgba(243,207,122,.9)'; x.shadowBlur = 8 * DPR; } x.stroke(); x.shadowBlur = 0;
      }
      x.globalCompositeOperation = 'source-over';
    });
  });

  /* ---------- CTA background waves ---------- */
  

  /* ---------- header + reveal ---------- */
  var hd = document.querySelector('header.top'); function hs2() { if (hd) hd.classList.toggle('s', scrollY > 30); } addEventListener('scroll', hs2); hs2();
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }); }, { threshold: .12 });
  document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });

  /* ---------- articles: read in a window, or download the PDF ---------- */
  (function () {
    var m = document.getElementById('artm'); if (!m || !window.ARTS) return;
    var c = m.querySelector('.artc'), a = m.querySelector('.arta');
    function esc(t) { return t.replace(/[&<>]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[ch]; }); }
    function open(k) {
      var l = document.documentElement.lang === 'ar' ? 'ar' : 'en', d = ARTS[k][l];
      c.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr'); c.lang = l;
      c.innerHTML = '<div class="kick">UNI ROOT</div><h2>' + esc(d[0]) + '</h2>' + d[1].map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
      var src = document.querySelector('[data-art="' + k + '"]').parentNode.querySelector(l === 'ar' ? 'a.ar-only' : 'a.en-only'); a.innerHTML = ''; var dl = src.cloneNode(true); dl.className = 'btn p'; dl.removeAttribute('lang'); a.appendChild(dl);
      m.hidden = false; document.body.style.overflow = 'hidden'; requestAnimationFrame(function () { m.classList.add('on'); });
    }
    function close() { m.classList.remove('on'); document.body.style.overflow = ''; setTimeout(function () { m.hidden = true; }, 250); }
    document.querySelectorAll('[data-art]').forEach(function (b) { b.onclick = function () { open(b.dataset.art); }; });
    m.querySelector('.artx').onclick = close; m.onclick = function (e) { if (e.target === m) close(); };
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && !m.hidden) close(); });
  })();

  /* ---------- uni root signal: try it by hand ---------- */
  (function(){if(!document.getElementById('sgSp'))return;

const OCOL2=['#ffffff','#ff7a00','#ffd000','#1f6fff','#0037d4','#9000ff','#ff4433','#ffaa00','#22e04a','#00b4ff','#0024a0','#ffd000'];
const OC=n=>n===1?'#e00000':OCOL2[n-1],LIT=[1,4,7];
let STEP=45;const FINAL=2.5,TRIPS=5;
const DR=f=>{let n=f;while(n>9)n=String(n).split('').reduce((a,b)=>a+ +b,0);return n};   // digital root of the frequency
const FREQS=[1147,1285,1471,1852,1714,1528];
let FQ=1147,CYC=DR(FQ),CT=(STEP-FINAL)/CYC;
function recalc(){CYC=Math.max(1,DR(FQ));const fin=Math.min(FINAL,STEP*.15);CT=(STEP-fin)/CYC}
const F={end:0,start:.09,move:.18,gather:.78,back:.86,done:1};   // phases inside one journey (fraction)
const speed=1;
const $=id=>document.getElementById(id);
function pair(sl,nm,on){const S=$(sl),N=$(nm);S.oninput=()=>{N.value=S.value;on(+S.value)};N.oninput=()=>{const v=+N.value;if(!isFinite(v)||v<=0)return;if(v>=+S.min&&v<=+S.max)S.value=v;on(v)}}
const st={v:15,d:9};
pair('sgfqS','sgfqN',v=>{FQ=Math.round(v);recalc();t=0});
pair('sgvS','sgvN',v=>{st.v=Math.min(20,v)});
pair('sgdS','sgdN',v=>{st.d=Math.min(50,Math.max(1,v))});
pair('sgtS','sgtN',v=>{STEP=Math.max(2,v);recalc();t=0});
const frac=v=>v-Math.floor(v),AMP=()=>Math.max(.15,st.v/20),DUTY=()=>st.d/100;
// one impulse: arrival -> recoil backward -> push forward -> fading ring; blends to a sine as duty -> 50%
function imp(p,D){const tau=.06+.6*D,r1=D*1.3,r2=D*1.8,a=D,b=a+r1,c=b+r2;
  if(p<a)return Math.sin(Math.PI*p/a);if(p<b)return -.65*Math.sin(Math.PI*(p-a)/r1);if(p<c)return .8*Math.sin(Math.PI*(p-b)/r2);
  return Math.exp(-(p-c)/tau)*Math.sin(2*Math.PI*(p-c)*3.2)*.22}
function wave(n,u,ph){const D=DUTY(),k=n*1.5,sharp=Math.max(0,Math.min(1,(.5-D)/.43));
  return AMP()*(sharp*imp(frac(u*k-ph*n*.25),D)+(1-sharp)*Math.sin(2*Math.PI*u*k-ph*n*2-n))}
const sp=document.getElementById('sgSp'),cb=document.getElementById('sgCb');
function fit(c){const W=c.clientWidth,H=c.clientHeight,d=2;if(!W||!H)return null;if(c.width!==Math.round(W*d)||c.height!==Math.round(H*d)){c.width=Math.round(W*d);c.height=Math.round(H*d)}const x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,W,H);return{x,W,H}}
function glow(x,X,Y,r,a,col){if(a<=0)return;const g=x.createRadialGradient(X,Y,0,X,Y,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);x.fillStyle=g;x.beginPath();x.arc(X,Y,r,0,7);x.fill()}
const sumAt=(u,ph)=>{let v=0;LIT.forEach(n=>{v+=Math.sin(2*Math.PI*n*u*1.5-ph*n-n)});return v/LIT.length};
function spectrum(ph){const g=fit(sp);if(!g)return;const{x,W,H}=g,mid=H/2,A=H*.4;
  for(let n=1;n<=12;n++){const on=LIT.includes(n),c=OC(n),phase=2*Math.PI*n*ph*.5;x.save();x.strokeStyle=c;x.globalAlpha=on?.95:.15;x.lineWidth=on?2.2:1;if(on){x.shadowColor=c;x.shadowBlur=8}x.beginPath();
    for(let X=0;X<=W;X+=1.5){const u=X/W,y=on?mid-A*wave(n,u,ph):mid-A*.8*Math.sin(2*Math.PI*n*u*1.5-phase-n);X?x.lineTo(X,y):x.moveTo(X,y)}x.stroke();x.restore()}}
function draw(t,el){const g=fit(cb);if(!g)return;const{x,W,H}=g,cx=W/2,half0=W/2-24,yL=H*.3,yS=H*.55,yC=H*.8,mid=(yL+yC)/2;
  x.strokeStyle='#3a3a40';x.lineWidth=1.5;x.beginPath();x.moveTo(cx,4);x.lineTo(cx,H-4);x.stroke();
  x.globalCompositeOperation='lighter';
  const FIN=Math.min(FINAL,STEP*.15);if(t>=STEP-FIN){ // the meeting in the middle
    const q=(t-(STEP-FIN))/FIN,f=Math.sin(Math.min(1,q*1.4)*Math.PI*.5),out=q>.7?1-(q-.7)/.3*.55:1;
    x.fillStyle=`rgba(255,248,225,${.35*(1-q)})`;x.fillRect(0,0,W,H);
    glow(x,cx,mid,30+90*f,out,'255,250,240');glow(x,cx,mid,12+20*f,out,'255,255,255');
    for(let k=0;k<16;k++){const a=k*Math.PI/8+el*.3,r1=18,r2=30+90*f;x.strokeStyle=`rgba(255,236,190,${.35*out})`;x.lineWidth=1;x.beginPath();x.moveTo(cx+Math.cos(a)*r1,mid+Math.sin(a)*r1);x.lineTo(cx+Math.cos(a)*r2,mid+Math.sin(a)*r2);x.stroke()}
    x.globalCompositeOperation='source-over';return}
  const c=Math.floor(t/CT),u=(t%CT)/CT,half=half0*(1-c/CYC),dir=c%2===0?1:-1;   // distance shrinks every journey
  const A=cx-dir*half,B=cx+dir*half,L=B-A,P=(a,b)=>Math.max(0,Math.min(1,(u-a)/(b-a)));
  // faint marks of the earlier, wider journeys
  for(let k=0;k<c;k++){const h=half0*(1-k/CYC);x.fillStyle='rgba(230,184,92,.18)';[cx-h,cx+h].forEach(X=>{x.fillRect(X-.5,mid-6,1,12)})}
  // 1 · arrival lights first, 2 · then the start
  const pa=P(F.end,F.end+.05),ps=P(F.start,F.start+.05),pulse=.8+.2*Math.sin(el*5);
  if(u<F.end+.06){x.fillStyle=`rgba(255,248,225,${.22*(1-P(F.end,F.end+.06))})`;x.fillRect(B-26,0,52,H)}
  glow(x,B,mid,24,.85*pa*pulse,'255,244,214');
  if(u>=F.start){if(u<F.start+.06){x.fillStyle=`rgba(255,248,225,${.22*(1-P(F.start,F.start+.06))})`;x.fillRect(A-26,0,52,H)}
    const land=u>F.back+.09?1+.7*Math.sin(P(F.back+.09,1)*Math.PI):1;glow(x,A,mid,24*land,.85*ps*pulse,'255,236,190')}
  x.fillStyle='rgba(255,250,240,.9)';[A,B].forEach(X=>{x.beginPath();x.arc(X,mid,2.5,0,7);x.fill()});
  // 3 · motion: light back and forth, sound slow, combined forming
  const pr=P(F.move,F.gather);
  if(u>=F.move&&u<F.gather+.01){
    const s=pr*TRIPS,k=Math.min(TRIPS-1,Math.floor(s)),fr=pr>=1?1:s-k,fw=k%2===0,hx=fw?A+fr*L:B-fr*L;
    x.beginPath();const tail=Math.abs(L)*.2,sg=Math.sign(L);for(let d=0;d<=tail;d+=1.5){const X=fw?hx-sg*d:hx+sg*d,env=1-d/tail,y=yL-H*.08*AMP()*env*imp(frac(d/(tail/3)),DUTY());d?x.lineTo(X,y):x.moveTo(X,y)}
    x.strokeStyle='rgba(255,246,223,.95)';x.lineWidth=1.3;x.shadowColor='rgba(255,246,223,.9)';x.shadowBlur=8;x.stroke();x.shadowBlur=0;glow(x,hx,yL,9,1,'255,250,235');
    const sx=A+pr*L;x.beginPath();for(let i=0;i<=120*pr;i++){const v=i/120,X=A+v*L,y=yS+H*.07*AMP()*sumAt(v,el*3);i?x.lineTo(X,y):x.moveTo(X,y)}
    x.strokeStyle='rgba(232,169,72,.95)';x.lineWidth=1.6;x.shadowColor='rgba(232,169,72,.9)';x.shadowBlur=8;x.stroke();x.shadowBlur=0;glow(x,sx,yS+H*.07*AMP()*sumAt(pr,el*3),9,1,'232,169,72');
    x.beginPath();for(let i=0;i<=200*pr;i++){const v=i/200,X=A+v*L,tex=imp(frac(v*TRIPS*3-el*2),DUTY()),y=yC-H*.09*AMP()*(sumAt(v,el*3)*.6+.5*tex);i?x.lineTo(X,y):x.moveTo(X,y)}
    x.strokeStyle='rgba(255,226,154,.8)';x.lineWidth=1.5;x.shadowColor='rgba(255,226,154,.8)';x.shadowBlur=6;x.stroke();x.shadowBlur=0}
  // 4 · gather at the arrival
  if(u>=F.gather&&u<F.back+.01){const e=P(F.gather,F.back)**2;x.beginPath();for(let i=0;i<=160;i++){const v=i/160,X=B-L*(1-e)+v*L*(1-e),y=yC-(yC-mid)*e-(1-e)*H*.09*sumAt(v,el*3);i?x.lineTo(X,y):x.moveTo(X,y)}
    x.strokeStyle='rgba(255,236,190,.9)';x.lineWidth=1.6+2*e;x.shadowColor='rgba(255,236,190,1)';x.shadowBlur=8+10*e;x.stroke();x.shadowBlur=0;glow(x,B,mid,14+26*e,.5+.5*e,'255,250,235')}
  // 5 · cylinder beam back to the origin
  if(u>=F.back){const q=P(F.back,F.back+.09),e=1-(1-q)**2,fade=1-P(.96,1),head=B-L*e,R=3+6*AMP(),lo=Math.min(head,B),w=Math.abs(B-head);
    let gr=x.createLinearGradient(0,mid-R*2.6,0,mid+R*2.6);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,`rgba(255,255,255,${.3*fade})`);gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(lo,mid-R*2.6,w,R*5.2);
    gr=x.createLinearGradient(0,mid-R,0,mid+R);gr.addColorStop(0,`rgba(150,152,160,${.55*fade})`);gr.addColorStop(.35,`rgba(235,238,245,${.9*fade})`);gr.addColorStop(.5,`rgba(255,255,255,${fade})`);gr.addColorStop(.65,`rgba(235,238,245,${.9*fade})`);gr.addColorStop(1,`rgba(150,152,160,${.55*fade})`);x.fillStyle=gr;x.fillRect(lo,mid-R,w,R*2);
    for(let k=0;k<5;k++){const v=(el*1.4+k/5)%1;glow(x,B-(B-head)*v,mid,R*1.6,.5*fade,'255,255,255')}
    x.fillStyle=`rgba(255,255,255,${fade})`;[B,head].forEach(X=>{x.beginPath();x.ellipse(X,mid,R*.45,R,0,0,7);x.fill()});glow(x,head,mid,R*3.2,fade,'255,255,255')}
  x.globalCompositeOperation='source-over'}
let last=0,t=0,ph=0;
function loop(ts){const now=ts/1000,dt=last?Math.min(.1,now-last):0;last=now;t+=dt*speed;if(t>=STEP+1)t=0;ph+=dt;
  const tt=Math.min(t,STEP);document.getElementById('sgInfo').textContent=tt.toFixed(1)+' / '+STEP+' s  ·  '+FQ+' Hz → '+CYC+' journeys';document.getElementById('sgPg').style.width=(tt/STEP*100)+'%';
  spectrum(ph);draw(Math.min(t,STEP-.001),now);if(vis)requestAnimationFrame(loop);else{running=false;last=0}}
let vis=false,running=false;new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis&&!running){running=true;requestAnimationFrame(loop)}}).observe(sp.closest('.sig'));

  })();
})();
