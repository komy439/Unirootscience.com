// Likes and private comments (Firebase). Any element <div class="fbBar" data-key data-title data-lang> becomes a bar: ♥ count · 💬 comment.
// Visitors get an anonymous id (no account, no personal data). A visitor sees only their own comments and the owner's replies.
// The owner signs in with Google (unirootscience@gmail.com) from owner mode to read every comment and reply.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, signInAnonymously, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, doc, getDoc, runTransaction, collection, addDoc, query, where, getDocs, orderBy, limit, updateDoc, deleteDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const app = initializeApp({
  apiKey: 'AIzaSyD72E8EyfRz3euZcQechlNjgBde1bh0lS4',
  authDomain: 'uniroot-ab501.firebaseapp.com',
  projectId: 'uniroot-ab501',
  storageBucket: 'uniroot-ab501.firebasestorage.app',
  messagingSenderId: '128582490283',
  appId: '1:128582490283:web:0a78a582741059ce407fee'
});
const auth = getAuth(app), db = getFirestore(app), OWNER = 'unirootscience@gmail.com';
const h = document.documentElement;
const L = () => (h.lang === 'ar' ? 'ar' : 'en');
const AD = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const N = (n, l) => (l === 'ar' ? AD(n) : String(n));
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const T = {
  like: ['Like', 'إعجاب'], comment: ['Leave a comment', 'اترك تعليقًا'], send: ['Send', 'إرسال'], sending: ['Sending…', 'جارٍ الإرسال…'],
  ph: ['Your comment… only you and uni root can see it.', 'تعليقك… لا يراه غيرك أنت وuni root.'], name: ['Name (optional)', 'الاسم (اختياري)'],
  email: ['Contact method for a reply: email or WhatsApp (optional)', 'وسيلة التواصل للرد: إيميل أو واتساب (اختياري)'], yours: ['Your comments', 'تعليقاتك'],
  reply: ['uni root replied', 'ردّ uni root'], sent: ['Sent ✓', 'تم الإرسال ✓'], err: ['Could not send. Try again.', 'تعذّر الإرسال. حاول مرة أخرى.'],
  private: ['Private: only you and uni root see your comments.', 'خاص: تعليقاتك لا يراها غيرك أنت وuni root.'],
  where: ['You will not get notifications from the site. Replies are given on request: they appear here, under your comment, when you come back from this same device and browser, or through the contact method you add below.', 'لن تصلك إشعارات من الموقع. والرد حسب الطلب: يظهر هنا تحت تعليقك حين تعود من نفس الجهاز ونفس المتصفح، أو عبر وسيلة التواصل التي تحددها بالأسفل.']
};
const t = (k, l) => T[k][l === 'ar' ? 1 : 0];

let user = null, ready;
const waitUser = new Promise(res => { ready = res; });
onAuthStateChanged(auth, u => {
  user = u;
  if (!u) { signInAnonymously(auth).catch(e => status('auth: ' + (e.code || e.message))); return; }
  ready(u); document.querySelectorAll('.fbBar[data-on]').forEach(refresh); updateOwner(); updateBell(); hashGo();
});
const isOwner = () => !!(user && user.email === OWNER && user.emailVerified);
function status(m) { const s = document.querySelector('.wnBar span'); if (s && h.classList.contains('own')) { s.textContent = m; s.style.color = '#ff7a6b'; } }

/* ---------- bars ---------- */
function build(b) {
  if (b.dataset.on) return; b.dataset.on = '1';
  b.innerHTML = '<button type="button" class="fbLike" aria-pressed="false"><span class="hrt">♡</span><b>·</b></button><button type="button" class="fbCm"><span>💬</span><i></i></button><div class="fbBox" hidden></div>';
  b.querySelector('.fbLike').onclick = () => like(b);
  b.querySelector('.fbCm').onclick = () => { const x = b.querySelector('.fbBox'); x.hidden = !x.hidden; if (!x.hidden) box(b); };
  label(b); refresh(b);
}
function lang(b) { return b.dataset.lang || L(); }
function label(b) { const l = lang(b); b.dir = l === 'ar' ? 'rtl' : 'ltr'; b.querySelector('.fbLike').title = t('like', l); b.querySelector('.fbCm i').textContent = t('comment', l); }
async function refresh(b) {
  const k = b.dataset.key, l = lang(b);
  try {
    const s = await getDoc(doc(db, 'likes', k)); b.dataset.n = s.exists() ? s.data().count || 0 : 0;
    b.querySelector('.fbLike b').textContent = N(b.dataset.n, l);
    if (user) { const m = await getDoc(doc(db, 'likes', k, 'by', user.uid)); setLiked(b, m.exists()); }
  } catch (e) { b.querySelector('.fbLike b').textContent = '·'; }
}
function setLiked(b, on) { const x = b.querySelector('.fbLike'); x.setAttribute('aria-pressed', on); x.querySelector('.hrt').textContent = on ? '♥' : '♡'; }
async function like(b) {
  const u = await waitUser, k = b.dataset.key, x = b.querySelector('.fbLike'); if (x.disabled) return; x.disabled = true;
  const was = x.getAttribute('aria-pressed') === 'true', n0 = +b.dataset.n || 0;
  setLiked(b, !was); b.dataset.n = n0 + (was ? -1 : 1); x.querySelector('b').textContent = N(b.dataset.n, lang(b));
  try {
    await runTransaction(db, async tx => {
      const Lr = doc(db, 'likes', k), Br = doc(db, 'likes', k, 'by', u.uid);
      const ls = await tx.get(Lr), bs = await tx.get(Br), c = ls.exists() ? ls.data().count || 0 : 0;
      if (bs.exists()) { tx.delete(Br); tx.update(Lr, { count: c - 1 }); }
      else { tx.set(Br, { t: 1 }); if (ls.exists()) tx.update(Lr, { count: c + 1 }); else tx.set(Lr, { count: 1 }); }
    });
  } catch (e) { status('like: ' + (e.code || e.message)); }
  x.disabled = false; refresh(b);
}
async function box(b) {
  const l = lang(b), x = b.querySelector('.fbBox');
  if (!x.dataset.on) {
    x.dataset.on = '1';
    x.innerHTML = '<p class="fbP">🔒 ' + t('private', l) + '<br>↩ ' + t('where', l) + '</p><textarea maxlength="2000"></textarea><div class="fbR"><input class="nm" maxlength="80"><input class="em" maxlength="120" dir="ltr"></div><div class="fbS"><button type="button" class="fbGo"></button><span></span></div><div class="fbMine"></div>';
    x.querySelector('textarea').placeholder = t('ph', l); x.querySelector('.nm').placeholder = t('name', l); x.querySelector('.em').placeholder = t('email', l);
    x.querySelector('.fbGo').textContent = t('send', l);
    x.querySelector('.fbGo').onclick = () => send(b);
  }
  mine(b);
}
async function send(b) {
  const l = lang(b), x = b.querySelector('.fbBox'), ta = x.querySelector('textarea'), go = x.querySelector('.fbGo'), st = x.querySelector('.fbS span');
  const text = ta.value.trim(); if (!text) { ta.focus(); return; }
  go.disabled = true; st.textContent = t('sending', l); st.style.color = '';
  try {
    const u = await waitUser;
    await addDoc(collection(db, 'comments'), { uid: u.uid, item: b.dataset.key, title: b.dataset.title || b.dataset.key, lang: l, text, name: x.querySelector('.nm').value.trim(), email: x.querySelector('.em').value.trim(), page: location.pathname, ts: serverTimestamp() });
    ta.value = ''; st.textContent = t('sent', l); mine(b);
  } catch (e) { st.textContent = t('err', l); st.style.color = '#ff7a6b'; }
  go.disabled = false;
}
const when = (ts, l) => { try { const d = ts.toDate(); return d.toLocaleDateString(l === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return ''; } };
async function mine(b) {
  const l = lang(b), w = b.querySelector('.fbMine');
  try {
    const u = await waitUser, s = await getDocs(query(collection(db, 'comments'), where('uid', '==', u.uid), where('item', '==', b.dataset.key)));
    const a = s.docs.map(d => d.data()).sort((p, q) => ((q.ts && q.ts.seconds) || 9e9) - ((p.ts && p.ts.seconds) || 9e9));
    w.innerHTML = a.length ? '<h6>' + t('yours', l) + '</h6>' + a.map(c => '<div class="fbC"><p>' + esc(c.text) + '</p><small>' + when(c.ts, l) + '</small>' + (c.reply ? '<div class="fbRep"><b>' + t('reply', l) + '</b><p>' + esc(c.reply) + '</p></div>' : '') + '</div>').join('') : '';
  } catch (e) { w.innerHTML = ''; }
}

/* ---------- owner inbox ---------- */
const inbox = document.createElement('div'); inbox.className = 'fbIn';
document.body.appendChild(inbox);
const isUnread = (id, c) => !c.seen && !lsGet('uniroot_notif_seen', []).includes(id);
async function updateOwner() {
  const ob = document.querySelector('.wnBar [data-a=inbox]'); if (!ob) return;
  ob.textContent = (L() === 'ar' ? '💬 التعليقات' : '💬 Comments');
  if (!isOwner()) return;
  try { const s = await getDocs(query(collection(db, 'comments'), orderBy('ts', 'desc'), limit(300))); const n = s.docs.filter(d => isUnread(d.id, d.data())).length; if (n) { const b = document.createElement('b'); b.className = 'fbRed'; b.textContent = N(n, L()); ob.appendChild(b); } } catch (e) {}
}
function paintCount() { const b = inbox.querySelector('.hd .fbRed'); if (!b) return; const n = inbox.querySelectorAll('.it.unread').length; b.hidden = !n; b.textContent = N(n, L()); }
async function openInbox() {
  const ar = L() === 'ar';
  if (!isOwner()) {
    try { await signInWithPopup(auth, new GoogleAuthProvider()); } catch (e) { status('sign-in: ' + (e.code || e.message)); return; }
    if (!isOwner()) { status(ar ? 'هذا الحساب ليس حساب المالك' : 'Not the owner account'); await signOut(auth); return; }
  }
  inbox.dir = ar ? 'rtl' : 'ltr';
  inbox.innerHTML = '<div class="bx"><div class="hd"><h4>' + (ar ? 'التعليقات' : 'Comments') + ' <b class="fbRed" hidden></b></h4><button type="button" class="x">×</button></div><div class="ls">' + (ar ? 'جارٍ التحميل…' : 'Loading…') + '</div><div class="ft"><button type="button" class="out">' + (ar ? 'خروج من حساب المالك' : 'Sign out of owner') + '</button></div></div>';
  inbox.classList.add('on');
  inbox.querySelector('.x').onclick = () => inbox.classList.remove('on');
  inbox.querySelector('.out').onclick = async () => { await signOut(auth); inbox.classList.remove('on'); };
  const ls = inbox.querySelector('.ls');
  try {
    const s = await getDocs(query(collection(db, 'comments'), orderBy('ts', 'desc'), limit(300)));
    if (!s.size) { ls.textContent = ar ? 'لا توجد تعليقات بعد.' : 'No comments yet.'; return; }
    ls.innerHTML = '';
    s.docs.forEach(d => {
      const c = d.data(), el = document.createElement('div'); let un = isUnread(d.id, c);
      el.className = 'it' + (un ? ' unread' : '') + (c.reply ? ' done' : ''); el.dir = c.lang === 'ar' ? 'rtl' : 'ltr';
      const pv = esc(c.text.slice(0, 90)) + (c.text.length > 90 ? '…' : '');
      el.innerHTML = '<div class="op"><i class="dot"></i><div class="mt"><b>' + esc(c.title) + '</b><span>' + esc(c.name || (ar ? 'بدون اسم' : 'No name')) + ' · ' + when(c.ts, c.lang) + '</span>' + (c.reply ? '<em class="rp">' + (ar ? '✓ تم الرد' : '✓ replied') + '</em>' : '') + '</div><div class="pv">' + pv + '</div></div>' +
        '<div class="full" hidden><div class="ct">' + (c.email ? (/@/.test(c.email) ? '<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a>' : /^[+\d\s-]{7,}$/.test(c.email) ? '<a href="https://wa.me/' + esc(c.email.replace(/[^\d]/g, '').replace(/^0/, '20')) + '" target="_blank" rel="noopener">WhatsApp ' + esc(c.email) + '</a>' : esc(c.email)) : '') + '</div><p>' + esc(c.text) + '</p><textarea placeholder="' + (ar ? 'ردّك…' : 'Your reply…') + '">' + esc(c.reply || '') + '</textarea><div class="ac"><button type="button" class="sv">' + (ar ? 'حفظ الرد' : 'Save reply') + '</button><button type="button" class="dl">🗑</button><span></span></div></div>';
      el.querySelector('.op').onclick = async () => {
        const f = el.querySelector('.full'); f.hidden = !f.hidden; el.classList.toggle('open', !f.hidden);
        if (!f.hidden && un) {   // opened: its red mark goes away, here and in the bell
          un = false; el.classList.remove('unread');
          const sn = lsGet('uniroot_notif_seen', []); if (!sn.includes(d.id)) { sn.push(d.id); lsSet('uniroot_notif_seen', sn.slice(-500)); }
          try { await updateDoc(d.ref, { seen: true }); } catch (e) {}
          updateOwner(); updateBell(); paintCount();
        }
      };
      el.querySelector('.sv').onclick = async () => { const r = el.querySelector('textarea').value.trim(), sp = el.querySelector('.ac span'); try { await updateDoc(d.ref, { reply: r, replyTs: serverTimestamp() }); sp.textContent = '✓'; el.classList.toggle('done', !!r); updateOwner(); } catch (e) { sp.textContent = e.code || 'error'; } };
      el.querySelector('.dl').onclick = async () => { try { await deleteDoc(d.ref); el.remove(); updateOwner(); paintCount(); } catch (e) {} };
      ls.appendChild(el);
    });
    paintCount();
  } catch (e) { ls.textContent = (ar ? 'تعذّر التحميل: ' : 'Could not load: ') + (e.code || e.message); }
}

/* ---------- owner notifications: what came from outside (new comments, new likes) ---------- */
// A bell in owner mode shows a list. Tapping one takes you straight to its place and the comment opens with a reply box; it then leaves the list.
const NS = 'uniroot_notif_seen', NL = 'uniroot_notif_likes';
const lsGet = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || 'null') || d; } catch (e) { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const bell = document.createElement('button'); bell.type = 'button'; bell.className = 'fbBell'; bell.innerHTML = '🔔<b hidden></b>';
const nl = document.createElement('div'); nl.className = 'fbNl';
const pop = document.createElement('div'); pop.className = 'fbPop';
document.body.append(bell, nl, pop);
let NOTES = [];
async function collect() {
  const out = [], seen = new Set(lsGet(NS, []));
  if (isOwner()) {
    try {
      const s = await getDocs(query(collection(db, 'comments'), orderBy('ts', 'desc'), limit(300)));
      s.docs.forEach(d => { const c = d.data(); if (!c.reply && !c.seen && !seen.has(d.id)) out.push({ kind: 'c', id: d.id, ref: d.ref, c, key: c.item, lang: c.lang, title: c.title, ts: (c.ts && c.ts.seconds) || 0 }); });
    } catch (e) {}
  }
  try {
    const base = lsGet(NL, null), s = await getDocs(collection(db, 'likes')), now = {};
    s.docs.forEach(d => { now[d.id] = d.data().count || 0; });
    if (!base) lsSet(NL, now);   // first time: today's counts are the starting point
    else Object.keys(now).forEach(k => { const n = now[k] - (base[k] || 0); if (n > 0) out.push({ kind: 'l', id: 'like:' + k, key: k, n, count: now[k], title: (window.WNtitle ? window.WNtitle(k) : k), ts: 0 }); });
  } catch (e) {}
  return out.sort((a, b) => (a.kind === b.kind ? b.ts - a.ts : a.kind === 'c' ? -1 : 1));
}
async function updateBell() {
  if (!h.classList.contains('own')) { bell.hidden = true; return; }
  bell.hidden = false; NOTES = await collect();
  const n = NOTES.length, b = bell.querySelector('b'); b.hidden = !n; b.textContent = N(n, L());
  bell.title = L() === 'ar' ? 'الإشعارات' : 'Notifications';
  const ob = document.querySelector('.wnBar [data-a=notif]'); if (ob) ob.textContent = '🔔' + (n ? ' ' + N(n, L()) : '');
  if (nl.classList.contains('on')) listNotes();
}
async function openNotes() {
  const ar = L() === 'ar';
  if (!isOwner()) {
    try { await signInWithPopup(auth, new GoogleAuthProvider()); } catch (e) { status('sign-in: ' + (e.code || e.message)); return; }
    if (!isOwner()) { status(ar ? 'هذا الحساب ليس حساب المالك' : 'Not the owner account'); await signOut(auth); return; }
  }
  nl.classList.toggle('on'); if (nl.classList.contains('on')) { nl.innerHTML = '<p class="em">' + (ar ? 'جارٍ التحميل…' : 'Loading…') + '</p>'; await updateBell(); listNotes(); }
}
function listNotes() {
  const ar = L() === 'ar'; nl.dir = ar ? 'rtl' : 'ltr';
  nl.innerHTML = '<div class="hd"><b>' + (ar ? 'الإشعارات' : 'Notifications') + '</b><button type="button" class="x">×</button></div>' +
    (NOTES.length ? '' : '<p class="em">' + (ar ? 'لا جديد.' : 'Nothing new.') + '</p>');
  nl.querySelector('.x').onclick = () => nl.classList.remove('on');
  NOTES.forEach(o => {
    const r = document.createElement('button'); r.type = 'button'; r.className = 'it ' + o.kind;
    r.innerHTML = o.kind === 'c'
      ? '<i>💬</i><span><b>' + esc(o.c.name || (ar ? 'تعليق' : 'A comment')) + '</b> · ' + esc(o.title) + '<em dir="' + (o.lang === 'ar' ? 'rtl' : 'ltr') + '">' + esc(o.c.text.slice(0, 110)) + (o.c.text.length > 110 ? '…' : '') + '</em><small>' + when(o.c.ts, L()) + '</small></span>'
      : '<i>♥</i><span><b>+' + N(o.n, L()) + '</b> ' + (ar ? 'إعجاب' : (o.n > 1 ? 'likes' : 'like')) + ' · ' + esc(o.title) + '<small>' + (ar ? 'المجموع ' : 'total ') + N(o.count, L()) + '</small></span>';
    r.onclick = () => goNote(o); nl.appendChild(r);
  });
}
async function markSeen(o) {
  if (o.kind === 'l') { const b = lsGet(NL, {}); b[o.key] = o.count; lsSet(NL, b); }
  else { const s = lsGet(NS, []); if (!s.includes(o.id)) { s.push(o.id); lsSet(NS, s.slice(-500)); } try { await updateDoc(o.ref, { seen: true }); } catch (e) {} }
  NOTES = NOTES.filter(x => x.id !== o.id); updateBell();
}
function samePage(p) { const n = x => (x || '/').replace(/index\.html$/, ''); return n(p) === n(location.pathname); }
function goNote(o) {
  nl.classList.remove('on');
  if (o.kind === 'c' && o.c.page && !samePage(o.c.page)) { markSeen(o); location.href = o.c.page + '#fbgo=' + encodeURIComponent(o.id); return; }
  const t = window.WNgo ? window.WNgo(o.key, o.lang) : document.querySelector('.fbBar[data-key="' + o.key + '"]');
  markSeen(o);
  if (t) setTimeout(() => { t.scrollIntoView({ behavior: 'smooth', block: 'center' }); t.classList.add('fbFlash'); setTimeout(() => t.classList.remove('fbFlash'), 2600); }, 120);
  if (o.kind === 'c') showPop(o);
}
function showPop(o) {
  const ar = L() === 'ar', c = o.c; pop.dir = ar ? 'rtl' : 'ltr';
  pop.innerHTML = '<div class="hd"><b>💬 ' + esc(o.title) + '</b><button type="button" class="x">×</button></div><div class="mt">' + esc(c.name || (ar ? 'بدون اسم' : 'No name')) + (c.email ? ' · ' + esc(c.email) : '') + ' · ' + when(c.ts, c.lang) + '</div><p dir="' + (c.lang === 'ar' ? 'rtl' : 'ltr') + '">' + esc(c.text) + '</p><textarea placeholder="' + (ar ? 'ردّك…' : 'Your reply…') + '"></textarea><div class="ac"><button type="button" class="sv">' + (ar ? 'حفظ الرد' : 'Save reply') + '</button><span></span></div>';
  pop.classList.add('on'); pop.querySelector('.x').onclick = () => pop.classList.remove('on');
  pop.querySelector('.sv').onclick = async () => { const r = pop.querySelector('textarea').value.trim(), sp = pop.querySelector('.ac span'); if (!r) return; try { await updateDoc(o.ref, { reply: r, replyTs: serverTimestamp() }); sp.textContent = '✓'; updateOwner(); setTimeout(() => pop.classList.remove('on'), 900); } catch (e) { sp.textContent = e.code || 'error'; } };
}
async function hashGo() {   // arriving from another page: #fbgo=<comment id>
  const m = location.hash.match(/fbgo=([^&]+)/); if (!m) return; const id = decodeURIComponent(m[1]);
  history.replaceState(null, '', location.pathname + location.search);
  await waitUser; for (let i = 0; i < 40 && !isOwner(); i++) await new Promise(r => setTimeout(r, 150));
  if (!isOwner()) return;
  try { const s = await getDoc(doc(db, 'comments', id)); if (!s.exists()) return; const c = s.data(); setTimeout(() => goNote({ kind: 'c', id, ref: s.ref, c, key: c.item, lang: c.lang, title: c.title, ts: 0 }), 600); } catch (e) {}
}
bell.onclick = openNotes; bell.hidden = true;
new MutationObserver(updateBell).observe(h, { attributes: true, attributeFilter: ['class', 'lang'] });
setInterval(() => { if (h.classList.contains('own')) updateBell(); }, 60000);

/* ---------- wire up ---------- */
function scan() {
  document.querySelectorAll('.fbBar:not([data-on])').forEach(build);
  const ob = document.querySelector('.wnBar [data-a=inbox]'); if (ob && !ob.dataset.on) { ob.dataset.on = '1'; ob.onclick = openInbox; updateOwner(); }
  const nb = document.querySelector('.wnBar [data-a=notif]'); if (nb && !nb.dataset.on) { nb.dataset.on = '1'; nb.onclick = openNotes; updateBell(); }
}
new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
new MutationObserver(() => document.querySelectorAll('.fbBar[data-on]').forEach(b => { if (!b.dataset.lang) { label(b); refresh(b); } })).observe(h, { attributes: true, attributeFilter: ['lang'] });
scan();
