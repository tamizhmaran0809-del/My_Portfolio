// ================================================
// THEME PREFIX
// One shared JS file for both index.html (wt-...) and dark_theme.html (dk-...).
// Each page declares its own prefix on <body data-prefix="wt|dk">, and every
// class this file touches is built from that prefix, so the classes stay
// wt- / dk- specific per page while the JS logic itself is identical.
// ================================================
const PFX = document.body.dataset.prefix || 'wt';
const IS_DARK = PFX === 'dk';
const cls = (name) => PFX + '-' + name;      // e.g. cls('visible')  -> "wt-visible"
const sel = (name) => '.' + cls(name);        // e.g. sel('nav-link') -> ".wt-nav-link"

// ================================================
// TYPING EFFECT
// ================================================
const typingEl = document.getElementById('typing');
const words = ['Python Full Stack Developer'];
let wIdx = 0, cIdx = 0, deleting = false;

function typeEffect() {
    const word = words[wIdx];
    if (!deleting) {
        typingEl.textContent = word.slice(0, ++cIdx);
        if (cIdx === word.length) { deleting = true; setTimeout(typeEffect, 1800); return; }
    } else {
        typingEl.textContent = word.slice(0, --cIdx);
        if (cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; }
    }
    setTimeout(typeEffect, deleting ? 45 : 95);
}
typeEffect();


// ================================================
// SCROLL ANIMATIONS
// ================================================
const animEls = document.querySelectorAll(sel('animate-fade-up') + ', ' + sel('animate-fade-left'));

const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => entry.target.classList.add(cls('visible')), delay * 1000);
            animObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

animEls.forEach(el => {
    const parent = el.parentElement;
    const siblings = Array.from(parent.children).filter(c =>
        c.classList.contains(cls('animate-fade-up')) || c.classList.contains(cls('animate-fade-left')));
    const idx = siblings.indexOf(el);
    if (idx > 0) el.dataset.delay = (idx * 0.12).toFixed(2);
    animObserver.observe(el);
});


// ================================================
// SKILL BARS
// ================================================
const skillFills = document.querySelectorAll(sel('skill-fill'));
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.width + '%';
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });
skillFills.forEach(fill => skillObserver.observe(fill));


// ================================================
// COUNTER ANIMATION
// ================================================
const counters = document.querySelectorAll(sel('counter'));
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = +el.dataset.target;
            const step = target / (1500 / 16);
            let current = 0;
            const tick = () => {
                current = Math.min(current + step, target);
                el.textContent = Math.floor(current);
                if (current < target) requestAnimationFrame(tick);
                else el.textContent = target;
            };
            tick();
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));


// ================================================
// ACTIVE NAV
// ================================================
const sections = document.querySelectorAll(sel('section'));
const navLinks = document.querySelectorAll(sel('nav-link'));

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(secEl => { if (window.scrollY + 200 >= secEl.offsetTop) current = secEl.id; });
    navLinks.forEach(link => {
        link.classList.remove(cls('active'));
        if (link.getAttribute('href') === '#' + current) link.classList.add(cls('active'));
    });
}, { passive: true });

// SMOOTH SCROLL FIX — hero buttons + all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


// ================================================
// THEME SWITCH — navigates between index.html (light) and
// dark_theme.html (dark) instead of toggling a class, since the two
// themes now live in fully separate HTML/CSS files.
// ================================================
const themeToggle = document.getElementById('themeToggle');

function goToOtherTheme() {
    const next = themeToggle && themeToggle.dataset.next;
    if (next) window.location.href = next;
}

if (themeToggle) {
    themeToggle.addEventListener('click', goToOtherTheme);
}

// Bell click also swaps theme (bell's on/off look is baked into the page already)
function toggleBell() {
    goToOtherTheme();
}


// ================================================
// MOBILE SIDEBAR
// ================================================
const sidebar   = document.getElementById('sidebar');
const hamburger = document.getElementById('hamburger');
const overlay   = document.getElementById('overlay');

function openSidebar()  {
    sidebar.classList.add(cls('open'));
    overlay.classList.add(cls('visible'));
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
}
function closeSidebar() {
    sidebar.classList.remove(cls('open'));
    overlay.classList.remove(cls('visible'));
    setTimeout(() => { overlay.style.display = 'none'; }, 350);
    document.body.style.overflow = '';
}


hamburger.addEventListener('click', function (e) {
    e.stopPropagation();

    if (sidebar.classList.contains(cls('open'))) {
        closeSidebar();
    } else {
        openSidebar();
    }
});


// ================================================
// PROJECT MODAL
// ================================================
const modal      = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc  = document.getElementById('modalDesc');
const modalTech  = document.getElementById('modalTech');
const modalIcon  = document.getElementById('modalIcon');
const modalClose = document.getElementById('closeModal');
const modalBdrop = document.getElementById('modalBackdrop');

const iconMap = {
    'CSC CRM': '<i class="fa-solid fa-users-gear"></i>',
    'Attendance System': '<i class="fa-solid fa-clipboard-check"></i>',
    'E-Commerce Platform': '<i class="fa-solid fa-cart-shopping"></i>'
};

document.querySelectorAll(sel('project-more')).forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const card = this.closest(sel('project-card'));

        modalTitle.textContent = card.dataset.title;
        modalDesc.textContent  = card.dataset.desc;
        modalIcon.innerHTML    = iconMap[card.dataset.title] || '<i class="fa-solid fa-code"></i>';

        modalTech.innerHTML = '';
        (card.dataset.tech || '').split(',').forEach(t => {
            const span = document.createElement('span');
            span.textContent = t.trim();
            modalTech.appendChild(span);
        });

        modal.classList.add(cls('open'));
        document.body.style.overflow = 'hidden';
    });
});

function closeModal() { modal.classList.remove(cls('open')); document.body.style.overflow = ''; }
modalClose.addEventListener('click', closeModal);
modalBdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ================================================
// CONTACT FORM
// ================================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        const name    = document.getElementById('name').value.trim();
        const email   = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name) {
            e.preventDefault();
            showAlert('Please enter your name.', 'error');
            return;
        }
        if (!emailRx.test(email)) {
            e.preventDefault();
            showAlert('Please enter a valid email.', 'error');
            return;
        }
        if (message.length < 10) {
            e.preventDefault();
            showAlert('Message must be at least 10 characters.', 'error');
            return;
        }
        // Valid — let the browser submit the form to FormSubmit.
        // This only works once the site is hosted (not opened as a
        // local file), because FormSubmit needs a real http/https URL.
    });
}

function showAlert(msg, type) {
    const existing = document.querySelector('.custom-alert');
    if (existing) existing.remove();
    const alert = document.createElement('div');
    alert.className = 'custom-alert';
    alert.style.cssText = `position:fixed;bottom:28px;right:28px;padding:14px 22px;border-radius:12px;font-size:0.9rem;font-weight:600;color:#fff;background:${type === 'success' ? '#16a34a' : '#dc2626'};box-shadow:0 8px 28px rgba(0,0,0,0.2);z-index:9999;max-width:320px;animation:slideIn 0.4s ease;`;
    alert.textContent = msg;
    const s = document.createElement('style');
    s.textContent = '@keyframes slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}';
    document.head.appendChild(s);
    document.body.appendChild(alert);
    setTimeout(() => { alert.style.opacity = '0'; alert.style.transition = 'opacity 0.3s'; setTimeout(() => alert.remove(), 300); }, 3500);
}

// ================================================
// SCROLL-TO-TOP BUTTON
// ================================================
const scrollBtn = document.getElementById('scrollTopBtn');
const prefix = document.body.dataset.prefix || '';   
const showClass = prefix ? `${prefix}-show` : 'show';

window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle(showClass, window.scrollY > 300);
}, { passive: true });

scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ================================================
// CANVAS LIGHT EFFECT
// Each page is permanently one theme now, so the light intensity target
// is fixed per page instead of toggled at runtime.
// ================================================
let lightIntensity = IS_DARK ? 1 : 0.14;
let flickerVal     = 1;
let flickerTarget  = 1;

const canvas = document.getElementById('lightCanvas');
const ctx    = canvas.getContext('2d');

function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Bell tip position (centre-bottom of the rim)
function getBellTip() {
    const rim = document.querySelector(sel('bell-rim'));
    if (!rim) return { x: canvas.width / 2, y: canvas.height * 0.42 };
    const r = rim.getBoundingClientRect();
    return { x: r.left + r.width / 1.6, y: r.bottom - 4 };
}

function drawLight(tip, intensity) {
    if (intensity < 0.001) return;

    const cx = tip.x;
    const cy = tip.y;
    const W  = canvas.width;
    const H  = canvas.height;

    const coneAngle = 52 * Math.PI / 180;
    const coneLen   = H - cy + 40;

    // Cone
    ctx.save();
    const coneW = Math.tan(coneAngle) * coneLen;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - coneW, H + 40);
    ctx.lineTo(cx + coneW, H + 40);
    ctx.closePath();
    ctx.clip();

    const coneGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coneLen);
    coneGrad.addColorStop(0.00, `rgba(244,232,255,${0.55 * intensity})`);
    coneGrad.addColorStop(0.08, `rgba(215,166,255,${0.45 * intensity})`);
    coneGrad.addColorStop(0.22, `rgba(174,82,255,${0.30 * intensity})`);
    coneGrad.addColorStop(0.45, `rgba(122,47,255,${0.14 * intensity})`);
    coneGrad.addColorStop(0.70, `rgba(91,39,224,${0.05 * intensity})`);
    coneGrad.addColorStop(1.00, `rgba(65,25,180,0)`);
    ctx.fillStyle = coneGrad;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    // Halo
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, 55);
    halo.addColorStop(0,    `rgba(255,246,255,${0.55 * intensity})`);
    halo.addColorStop(0.15, `rgba(226,178,255,${0.40 * intensity})`);
    halo.addColorStop(0.4,  `rgba(172,79,255,${0.18 * intensity})`);
    halo.addColorStop(1,    `rgba(111,47,255,0)`);
    ctx.beginPath();
    ctx.arc(cx, cy, 55, 0, Math.PI * 2);
    ctx.fillStyle = halo;
    ctx.fill();

    // Ambient
    const ambientGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.9);
    ambientGrad.addColorStop(0,    `rgba(176,78,255,${0.06 * intensity})`);
    ambientGrad.addColorStop(0.3,  `rgba(118,57,255,${0.03 * intensity})`);
    ambientGrad.addColorStop(0.65, `rgba(75,44,215,${0.015 * intensity})`);
    ambientGrad.addColorStop(1,    `rgba(48,24,155,0)`);
    ctx.fillStyle = ambientGrad;
    ctx.fillRect(0, 0, W, H);

    // Ceiling
    const ceilGrad = ctx.createRadialGradient(cx, 0, 0, cx, 0, 160);
    ceilGrad.addColorStop(0,   `rgba(201,137,255,${0.10 * intensity})`);
    ceilGrad.addColorStop(0.4, `rgba(133,68,255,${0.04 * intensity})`);
    ceilGrad.addColorStop(1,   `rgba(75,33,190,0)`);
    ctx.fillStyle = ceilGrad;
    ctx.fillRect(0, 0, W, H * 0.35);

    // God rays
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const numRays = 6;
    for (let i = 0; i < numRays; i++) {
        const spread   = (i / (numRays - 1) - 0.5) * coneAngle * 2;
        const rayAngle = Math.PI / 2 + spread;
        const rayLen   = coneLen * (0.6 + Math.random() * 0.15);
        const ex = cx + Math.cos(rayAngle) * rayLen;
        const ey = cy + Math.sin(rayAngle) * rayLen;

        const rayGrad = ctx.createLinearGradient(cx, cy, ex, ey);
        rayGrad.addColorStop(0,   `rgba(221,170,255,${0.06 * intensity})`);
        rayGrad.addColorStop(0.4, `rgba(160,76,255,${0.02 * intensity})`);
        rayGrad.addColorStop(1,   `rgba(111,45,255,0)`);

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = rayGrad;
        ctx.lineWidth   = 2 + (1 - Math.abs(i / (numRays - 1) - 0.5) * 2) * 6;
        ctx.stroke();
    }
    ctx.restore();
}

function updateFlicker() {
    if (Math.random() < 0.04) flickerTarget = 0.88 + Math.random() * 0.14;
    flickerVal += (flickerTarget - flickerVal) * 0.12;
}

function render() {
    const target = IS_DARK ? 1 : 0.14;
    lightIntensity += (target - lightIntensity) * 0.055;

    if (IS_DARK && lightIntensity > 0.5) {
        updateFlicker();
    } else {
        flickerVal = 1;
    }

    const finalIntensity = Math.min(lightIntensity * flickerVal, 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (finalIntensity > 0.005) drawLight(getBellTip(), finalIntensity);

    requestAnimationFrame(render);
}

render();


// ================================================
// DNA BACKGROUND EFFECT — GOLD THEME
// Dark theme  -> bright/warm gold tones
// Light theme -> deeper gold/bronze tones (so it stays visible on white)
// ================================================
(function () {
  const canvas = document.getElementById('dna-bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Gold palette — swap between dark/light automatically
  const DNA_COLORS = IS_DARK
    ? ['rgba(255,215,120,', 'rgba(212,175,55,', 'rgba(255,193,7,', 'rgba(255,230,160,']
    : ['rgba(180,140,20,', 'rgba(150,110,10,', 'rgba(200,160,40,', 'rgba(120,90,10,'];

  const HELIX_COLOR_A = IS_DARK ? 'rgba(255,215,120,' : 'rgba(150,110,10,';
  const HELIX_COLOR_B = IS_DARK ? 'rgba(212,175,55,'  : 'rgba(180,140,20,';
  const WEB_LINE_COLOR = IS_DARK ? 'rgba(255,215,120,' : 'rgba(150,110,10,';
  const WEB_LINE_ALPHA = IS_DARK ? 0.10 : 0.12;

  class DnaParticle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 3 + 1;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.color = DNA_COLORS[Math.floor(Math.random() * DNA_COLORS.length)];
      this.alpha = Math.random() * 0.5 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += 0.02;
      if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) this.reset();
    }
    draw() {
      const a = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + a + ')';
      ctx.fill();
    }
  }

  class DnaHelixDot {
    constructor(i, total, side) {
      this.i = i;
      this.total = total;
      this.side = side;
    }
    getPos(t) {
      const progress = this.i / this.total;
      const x = W * 0.78 + Math.sin(progress * Math.PI * 4 + t + (this.side === 1 ? Math.PI : 0)) * 55;
      const y = H * 0.1 + progress * (H * 0.82);
      return { x, y };
    }
    draw(t) {
      const { x, y } = this.getPos(t);
      const alpha = 0.5 + 0.3 * Math.abs(Math.sin(this.i / this.total * Math.PI * 4 + t));
      const color = this.side === 0 ? `${HELIX_COLOR_A}${alpha})` : `${HELIX_COLOR_B}${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      return { x, y };
    }
  }

  const dnaParticles = Array.from({ length: 80 }, () => new DnaParticle());
  const HELIX_COUNT = 32;
  const dnaDotsA = Array.from({ length: HELIX_COUNT }, (_, i) => new DnaHelixDot(i, HELIX_COUNT, 0));
  const dnaDotsB = Array.from({ length: HELIX_COUNT }, (_, i) => new DnaHelixDot(i, HELIX_COUNT, 1));

  let dnaT = 0;
  function dnaAnimate() {
    ctx.clearRect(0, 0, W, H);
    dnaParticles.forEach((p) => { p.update(); p.draw(); });

    for (let i = 0; i < dnaParticles.length; i++) {
      for (let j = i + 1; j < dnaParticles.length; j++) {
        const dx = dnaParticles[i].x - dnaParticles[j].x;
        const dy = dnaParticles[i].y - dnaParticles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(dnaParticles[i].x, dnaParticles[i].y);
          ctx.lineTo(dnaParticles[j].x, dnaParticles[j].y);
          ctx.strokeStyle = `${WEB_LINE_COLOR}${WEB_LINE_ALPHA * (1 - d / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    const posA = dnaDotsA.map((d) => d.draw(dnaT));
    const posB = dnaDotsB.map((d) => d.draw(dnaT));

    for (let i = 0; i < HELIX_COUNT; i += 3) {
      if (posA[i] && posB[i]) {
        const grad = ctx.createLinearGradient(posA[i].x, posA[i].y, posB[i].x, posB[i].y);
        grad.addColorStop(0, `${HELIX_COLOR_A}.35)`);
        grad.addColorStop(1, `${HELIX_COLOR_B}.35)`);
        ctx.beginPath();
        ctx.moveTo(posA[i].x, posA[i].y);
        ctx.lineTo(posB[i].x, posB[i].y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    for (let i = 1; i < HELIX_COUNT; i++) {
      ctx.beginPath();
      ctx.moveTo(posA[i - 1].x, posA[i - 1].y);
      ctx.lineTo(posA[i].x, posA[i].y);
      ctx.strokeStyle = `${HELIX_COLOR_A}.25)`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(posB[i - 1].x, posB[i - 1].y);
      ctx.lineTo(posB[i].x, posB[i].y);
      ctx.strokeStyle = `${HELIX_COLOR_B}.25)`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    dnaT += 0.012;
    requestAnimationFrame(dnaAnimate);
  }
  dnaAnimate();
})();