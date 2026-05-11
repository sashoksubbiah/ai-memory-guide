/* shared.js — navigation, progress bar, quiz, fade-in, sidebar */

// ── Progress bar ──────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = pct + '%';
}, { passive: true });

// ── Sidebar toggle (mobile) ────────────────────────────────────
function toggleSidebar() {
  document.querySelector('.sidebar')?.classList.toggle('open');
}
document.addEventListener('click', e => {
  const sb = document.querySelector('.sidebar');
  const btn = document.querySelector('.sidebar-toggle');
  if (sb && btn && !sb.contains(e.target) && !btn.contains(e.target)) {
    sb.classList.remove('open');
  }
});

// ── Expand active nav sub-menu ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const cur = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item > a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const name = href.split('/').pop();
    if (name === cur) {
      a.classList.add('active');
      const sub = a.nextElementSibling;
      if (sub?.classList.contains('nav-sub')) sub.classList.add('open');
      a.closest('.nav-item')?.parentElement?.closest('.nav-item')
        ?.querySelector('.nav-sub')?.classList.add('open');
    }
  });
  document.querySelectorAll('.nav-sub a').forEach(a => {
    if ((a.getAttribute('href')||'').split('/').pop() === cur) {
      a.classList.add('active');
      a.closest('.nav-sub')?.classList.add('open');
    }
  });
});

// ── In-page TOC active tracking ───────────────────────────────
function initTocTracking() {
  const toc = document.querySelector('.toc-aside');
  if (!toc) return;
  const links = toc.querySelectorAll('a');
  const targets = [];
  links.forEach(a => {
    const id = a.getAttribute('href')?.slice(1);
    if (id) { const el = document.getElementById(id); if (el) targets.push({ el, a }); }
  });
  if (!targets.length) return;
  window.addEventListener('scroll', () => {
    let cur = targets[0];
    targets.forEach(t => { if (window.scrollY >= t.el.offsetTop - 130) cur = t; });
    links.forEach(a => a.classList.remove('active'));
    cur?.a.classList.add('active');
  }, { passive: true });
}

// ── Fade-up observer ──────────────────────────────────────────
function initFade() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade').forEach(el => obs.observe(el));
}

// ── Quiz utility ──────────────────────────────────────────────
function answerQuiz(qid, el, correct, explanation) {
  const box = document.getElementById(qid);
  if (!box || box.querySelector('.correct')) return;
  el.classList.add(correct ? 'correct' : 'wrong');
  const fb = document.getElementById(qid + '-fb');
  if (!fb) return;
  fb.className = 'quiz-feedback show ' + (correct ? 'ok' : 'bad');
  fb.textContent = (correct ? '✓ Correct! ' : '✗ Not quite. ') + (explanation || '');
}

// ── append chat msg ───────────────────────────────────────────
function appendMsg(container, role, text) {
  const m = document.createElement('div');
  m.className = 'msg ' + role;
  m.textContent = text;
  container.appendChild(m);
  container.scrollTop = container.scrollHeight;
  return m;
}
function appendSys(container, text) {
  const m = document.createElement('div');
  m.className = 'msg sys';
  m.textContent = text;
  container.appendChild(m);
  container.scrollTop = container.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
  initFade();
  initTocTracking();
});
