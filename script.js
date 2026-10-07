/* =========================================================
   Ahmed Sayem — Portfolio script
   ========================================================= */

const root = document.documentElement;

/* ---------- 保存 (save settings safely) ---------- */
function save(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { }
}

/* ---------- 言語切替 (Language: 日本語 ⇄ English) ---------- */
document.getElementById('langBtn').addEventListener('click', () => {
    const next = root.dataset.lang === 'ja' ? 'en' : 'ja';
    root.dataset.lang = next;
    root.lang = next;
    save('lang', next);
});

/* ---------- ダークモード (Dark / light) ---------- */
document.getElementById('themeBtn').addEventListener('click', () => {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const current = root.dataset.theme || (systemDark ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    save('theme', next);
});

/* ---------- ナビ: スクロールで背景をつける ---------- */
const nav = document.getElementById('nav');
const hero = document.querySelector('.hero');
function updateNav() {
    nav.classList.toggle('is-solid', window.scrollY > hero.offsetHeight - 80);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ---------- スマホメニュー (Mobile menu) ---------- */
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
function setMenu(open) {
    navLinks.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    if (open) nav.classList.add('is-solid'); else updateNav();
}
menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('is-open')));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* ---------- 今いるセクションのリンクに線 (active link) ---------- */
const links = [...navLinks.querySelectorAll('a')];
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id));
    });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => observer.observe(s));

/* ---------- 年 (footer year) ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- 桜の花びら (Sakura petals in the hero) ---------- */
(function petals() {
    const canvas = document.getElementById('petals');
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr, items = [], running = true;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.clientWidth; h = canvas.clientHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function make(startTop) {
        return {
            x: Math.random() * w,
            y: startTop ? -20 : Math.random() * h,
            size: 6 + Math.random() * 7,
            speed: 0.35 + Math.random() * 0.55,
            drift: 0.3 + Math.random() * 0.6,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.02,
            sway: Math.random() * Math.PI * 2,
            alpha: 0.35 + Math.random() * 0.45
        };
    }

    function drawPetal(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#F2A9BC';
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.6, p.size * 0.7, p.size * 0.8, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.8, -p.size * 0.9, -p.size * 0.6, 0, -p.size);
        ctx.fill();
        ctx.restore();
    }

    function tick() {
        if (!running) return;
        ctx.clearRect(0, 0, w, h);
        items.forEach((p, i) => {
            p.sway += 0.012;
            p.y += p.speed;
            p.x += Math.sin(p.sway) * p.drift + 0.25;
            p.angle += p.spin;
            if (p.y > h + 20 || p.x > w + 20) items[i] = make(true);
            drawPetal(p);
        });
        requestAnimationFrame(tick);
    }

    resize();
    const count = w < 700 ? 12 : 22;
    for (let i = 0; i < count; i++) items.push(make(false));
    window.addEventListener('resize', resize);

    // ヒーローが見えない時は止める (pause when off screen)
    new IntersectionObserver(([e]) => {
        const wasRunning = running;
        running = e.isIntersecting;
        if (running && !wasRunning) tick();
    }).observe(canvas);

    tick();
})();

