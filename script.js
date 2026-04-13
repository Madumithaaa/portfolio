/* ============================================
   MADUMITHA S — AI FUTURISTIC PORTFOLIO
   script.js
   ============================================ */

'use strict';

/* ─── Utility: throttle ─────────────────────── */
function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) { last = now; fn.apply(this, args); }
  };
}

/* ─── 1. Custom Bubble Cursor ───────────────── */
(function initCursor() {
  const bubble = document.getElementById('cursorBubble');
  const dot    = document.getElementById('cursorDot');
  if (!bubble || !dot) return;

  let bx = 0, by = 0, dx = 0, dy = 0;

  document.addEventListener('mousemove', (e) => {
    dx = e.clientX;
    dy = e.clientY;
    dot.style.left = dx + 'px';
    dot.style.top  = dy + 'px';
  });

  /* Smooth bubble follow */
  function animateBubble() {
    bx += (dx - bx) * 0.12;
    by += (dy - by) * 0.12;
    bubble.style.left = bx + 'px';
    bubble.style.top  = by + 'px';
    requestAnimationFrame(animateBubble);
  }
  animateBubble();

  /* Hover effect on interactive elements */
  const interactiveSelector = 'a, button, .btn, .project-card, .skill-tag, .contact-item, .social-icon, .nav-link, input, textarea';

  document.querySelectorAll(interactiveSelector).forEach(el => {
    el.addEventListener('mouseenter', () => bubble.classList.add('hover'));
    el.addEventListener('mouseleave', () => bubble.classList.remove('hover'));
  });

  /* Hide cursor when leaving window */
  document.addEventListener('mouseleave', () => { bubble.style.opacity = '0'; dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { bubble.style.opacity = '1'; dot.style.opacity = '1'; });
})();

/* ─── 2. Particle Canvas ───────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  const PARTICLE_COUNT = 90;
  const colors = ['rgba(0,245,255,', 'rgba(168,85,247,', 'rgba(59,130,246,'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.6 + 0.1,
    };
  }

  function initParticleArray() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      /* Connect nearby particles */
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = p.color + (0.15 * (1 - dist / 120)) + ')';
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      /* Draw particle */
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      /* Move */
      p.x += p.vx;
      p.y += p.vy;

      /* Wrap around edges */
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
      if (p.y < -5) p.y = H + 5;
      if (p.y > H + 5) p.y = -5;
    });
    requestAnimationFrame(drawParticles);
  }

  resize();
  initParticleArray();
  drawParticles();

  window.addEventListener('resize', throttle(() => { resize(); initParticleArray(); }, 300));
})();

/* ─── 3. Sticky Navbar ──────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = throttle(() => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, 50);

  window.addEventListener('scroll', onScroll);
})();

/* ─── 4. Mobile Hamburger Menu ──────────────── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  /* Close on link click */
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  /* Close on outside click */
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    }
  });
})();

/* ─── 5. Active Nav Link on Scroll ─────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const onScroll = throttle(() => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }, 80);

  window.addEventListener('scroll', onScroll);
})();

/* ─── 6. Typewriter Effect ──────────────────── */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Web Developer.',
    'Python Programmer.',
    'Full Stack Enthusiast.',
    'Creative Coder.',
    'Problem Solver.',
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;
  const typingSpeed = 90, deletingSpeed = 50, pauseTime = 1800;

  function type() {
    const phrase = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(type, pauseTime);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    setTimeout(type, deleting ? deletingSpeed : typingSpeed);
  }

  setTimeout(type, 800);
})();

/* ─── 7. Scroll Reveal ──────────────────────── */
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
})();

/* ─── 8. Skill Bar Animations ───────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width') + '%';
        setTimeout(() => { fill.style.width = width; }, 200);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
})();

/* ─── 9. Back to Top ────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const onScroll = throttle(() => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, 100);

  window.addEventListener('scroll', onScroll);

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─── 10. Contact Form ──────────────────────── */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  if (!form) return;

  const fields = {
    name:    { el: document.getElementById('contact-name'),    errEl: document.getElementById('nameError'),    validate: v => v.trim().length >= 2 ? '' : 'Name must be at least 2 characters.' },
    email:   { el: document.getElementById('contact-email'),   errEl: document.getElementById('emailError'),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email.' },
    message: { el: document.getElementById('contact-message'), errEl: document.getElementById('messageError'), validate: v => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.' },
  };

  /* Live validation */
  Object.values(fields).forEach(({ el, errEl, validate }) => {
    if (!el) return;
    el.addEventListener('blur', () => {
      const err = validate(el.value);
      if (errEl) errEl.textContent = err;
      el.style.borderColor = err ? '#f87171' : '';
    });
    el.addEventListener('input', () => {
      if (errEl && errEl.textContent) {
        const err = validate(el.value);
        errEl.textContent = err;
        el.style.borderColor = err ? '#f87171' : '';
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    Object.values(fields).forEach(({ el, errEl, validate }) => {
      if (!el) return;
      const err = validate(el.value);
      if (errEl) errEl.textContent = err;
      if (err) {
        valid = false;
        el.style.borderColor = '#f87171';
      } else {
        el.style.borderColor = '';
      }
    });

    if (!valid) return;

    /* Simulate submission */
    const submitBtn = document.getElementById('contact-submit');
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
    }

    setTimeout(() => {
      form.reset();
      if (successMsg) successMsg.classList.add('show');
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        submitBtn.disabled = false;
      }
      setTimeout(() => { if (successMsg) successMsg.classList.remove('show'); }, 5000);
    }, 1500);
  });
})();

/* ─── 11. Smooth Hover Ripple on Cards ──────── */
(function initRipple() {
  const cards = document.querySelectorAll('.glass');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 6;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
      card.style.transform = `translateY(-6px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
})();

/* ─── 12. Page Load Animation ───────────────── */
(function initPageLoad() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
})();

/* ─── 13. Easter Egg: Konami Code ───────────── */
(function initKonami() {
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;
  document.addEventListener('keydown', (e) => {
    if (e.key === code[idx]) {
      idx++;
      if (idx === code.length) {
        idx = 0;
        triggerEasterEgg();
      }
    } else {
      idx = 0;
    }
  });

  function triggerEasterEgg() {
    const msg = document.createElement('div');
    msg.textContent = '🚀 You found the secret! Madumitha is awesome! 🚀';
    Object.assign(msg.style, {
      position: 'fixed', top: '50%', left: '50%',
      transform: 'translate(-50%,-50%)',
      background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(168,85,247,0.15))',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(0,245,255,0.4)',
      color: '#fff',
      padding: '24px 36px',
      borderRadius: '16px',
      fontFamily: "'Orbitron', monospace",
      fontSize: '1rem',
      fontWeight: '700',
      zIndex: '99999',
      textAlign: 'center',
      boxShadow: '0 0 60px rgba(0,245,255,0.3)',
      animation: 'fadeIn 0.4s ease',
    });
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
  }
})();
