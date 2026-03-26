'use strict';

/* ================================================
   script.js — v4 Single-page scroll portfolio
   ================================================ */

// ===== Hero Typewriter =====
(function heroTypewriter() {
  const roles = [
    'Senior Software Engineer',
    'System Architect',
    'Pianist 🎹',
    'Photographer 📷',
    'Open-Source Contributor',
  ];

  const el = document.getElementById('heroRole');
  if (!el) return;

  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function tick() {
    const current = roles[roleIdx];
    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 90);
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 45);
    }
  }

  setTimeout(tick, 800);
})();

// ===== Dot-nav active on scroll =====
(function dotNav() {
  const links = document.querySelectorAll('.dot-link');
  const sections = [];

  links.forEach(link => {
    const id = link.getAttribute('href').replace('#', '');
    const sec = document.getElementById(id);
    if (sec) sections.push({ el: sec, link });
  });

  function update() {
    const scroll = window.scrollY + window.innerHeight / 3;
    let active = sections[0];

    sections.forEach(s => {
      if (s.el.offsetTop <= scroll) active = s;
    });

    links.forEach(l => l.classList.remove('active'));
    if (active) active.link.classList.add('active');
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ===== Reveal on scroll (IntersectionObserver) =====
(function revealOnScroll() {
  // Add .reveal class to all animatable elements
  const selectors = [
    '.about-grid', '.services-grid', '.service-card',
    '.resume-block', '.skills-grid',
    '.gallery-grid', '.gallery-item',
    '.contact-grid',
    '.sub-title',
    '.about-quote', '.about-meta',
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'));
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ===== Contact form validation =====
(function contactForm() {
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('formBtn');
  if (!form || !btn) return;

  const inputs = form.querySelectorAll('.form-field');
  inputs.forEach(inp => {
    inp.addEventListener('input', () => {
      btn.disabled = !form.checkValidity();
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    // No backend wired yet
    alert('Thanks for reaching out! (Form backend coming soon)');
    form.reset();
    btn.disabled = true;
  });
})();

// ===== Particles.js init =====
document.addEventListener('DOMContentLoaded', function () {
  if (typeof particlesJS === 'undefined') return;

  particlesJS('particles-js', {
    particles: {
      number: { value: 50, density: { enable: true, value_area: 900 } },
      color: { value: '#00d4e8' },
      shape: { type: 'circle' },
      opacity: { value: 0.2, random: true, anim: { enable: true, speed: 0.6, opacity_min: 0.04 } },
      size: { value: 2, random: true },
      line_linked: {
        enable: true,
        distance: 170,
        color: '#00d4e8',
        opacity: 0.08,
        width: 1
      },
      move: {
        enable: true,
        speed: 0.9,
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out',
        bounce: false
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true, mode: 'grab' },
        onclick: { enable: true, mode: 'push' },
        resize: true
      },
      modes: {
        grab: { distance: 160, line_linked: { opacity: 0.35 } },
        push: { particles_nb: 3 }
      }
    },
    retina_detect: true
  });
});