// TYPING EFFECT
const typingEl = document.getElementById('typing');
const words = ['Python Full Stack Developer', 'Django & REST API Expert', 'Web Application Builder'];
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

// SCROLL ANIMATIONS
const animEls = document.querySelectorAll('.animate-fade-up, .animate-fade-left');

const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => entry.target.classList.add('visible'), delay * 1000);
            animObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

animEls.forEach(el => {
    const parent = el.parentElement;
    const siblings = Array.from(parent.children).filter(c =>
        c.classList.contains('animate-fade-up') || c.classList.contains('animate-fade-left'));
    const idx = siblings.indexOf(el);
    if (idx > 0) el.dataset.delay = (idx * 0.12).toFixed(2);
    animObserver.observe(el);
});

// SKILL BARS
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.width + '%';
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });
skillFills.forEach(fill => skillObserver.observe(fill));

// COUNTER ANIMATION
const counters = document.querySelectorAll('.counter');
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

// ACTIVE NAV
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => { if (window.scrollY + 200 >= sec.offsetTop) current = sec.id; });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
}, { passive: true });

// DARK MODE
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function applyTheme(dark) {
    document.body.classList.toggle('dark', dark);
    themeIcon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
}

applyTheme(localStorage.getItem('theme') === 'dark');
themeToggle.addEventListener('click', () => applyTheme(!document.body.classList.contains('dark')));

// MOBILE SIDEBAR
const sidebar   = document.getElementById('sidebar');
const hamburger = document.getElementById('hamburger');
const overlay   = document.getElementById('overlay');

function openSidebar()  { sidebar.classList.add('open'); overlay.classList.add('visible'); overlay.style.display = 'block'; document.body.style.overflow = 'hidden'; }
function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('visible'); setTimeout(() => { overlay.style.display = 'none'; }, 350); document.body.style.overflow = ''; }

hamburger.addEventListener('click', openSidebar);
overlay.addEventListener('click', closeSidebar);
document.querySelectorAll('.nav-link').forEach(link => { link.addEventListener('click', () => { if (window.innerWidth <= 768) closeSidebar(); }); });

// PROJECT MODAL
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

document.querySelectorAll('.project-more').forEach(btn => {
    btn.addEventListener('click', function (e) {

        e.stopPropagation();

        const card = this.closest('.project-card');

        modalTitle.textContent = card.dataset.title;
        modalDesc.textContent  = card.dataset.desc;

        modalIcon.innerHTML =
            iconMap[card.dataset.title] ||
            '<i class="fa-solid fa-code"></i>';

        modalTech.innerHTML = '';

        (card.dataset.tech || '').split(',').forEach(t => {
            const span = document.createElement('span');
            span.textContent = t.trim();
            modalTech.appendChild(span);
        });

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
});

function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }
modalClose.addEventListener('click', closeModal);
modalBdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// CONTACT FORM
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name    = document.getElementById('name').value.trim();
        const email   = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!name)               { showAlert('Please enter your name.', 'error'); return; }
        if (!emailRx.test(email)){ showAlert('Please enter a valid email.', 'error'); return; }
        if (message.length < 10) { showAlert('Message must be at least 10 characters.', 'error'); return; }
        showAlert("Message sent! I'll get back to you soon.", 'success');
        contactForm.reset();
    });
}

function showAlert(msg, type) {
    const existing = document.querySelector('.custom-alert');
    if (existing) existing.remove();
    const alert = document.createElement('div');
    alert.className = 'custom-alert';
    alert.style.cssText = `position:fixed;bottom:28px;right:28px;padding:14px 22px;border-radius:12px;font-size:0.9rem;font-weight:600;color:#fff;background:${type==='success'?'#16a34a':'#dc2626'};box-shadow:0 8px 28px rgba(0,0,0,0.2);z-index:9999;max-width:320px;animation:slideIn 0.4s ease;`;
    alert.textContent = msg;
    const s = document.createElement('style');
    s.textContent = '@keyframes slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}';
    document.head.appendChild(s);
    document.body.appendChild(alert);
    setTimeout(() => { alert.style.opacity='0'; alert.style.transition='opacity 0.3s'; setTimeout(()=>alert.remove(),300); }, 3500);
}


// Up Arrow

const scrollBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollBtn.classList.add('show');
    } else {
        scrollBtn.classList.remove('show');
    }
});

scrollBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});


// Bell
const bellToggle = document.getElementById("bellToggle");

bellToggle.addEventListener("change", () => {
    const isDark = document.body.classList.contains("dark");

    // toggle theme using SAME logic as moon
    applyTheme(!isDark);
});