'use strict';

/* ==================================================
   script.js — Portfolio Interactive Effects
   Terminal text, stat counters, physics & scroll
   ================================================== */

// Ensure clean dark theme
try { localStorage.removeItem('theme'); } catch(e) {}
document.documentElement.removeAttribute('data-theme');

// ===== Hero Label Cycler =====
(function labelCycler() {
  const labelEl = document.getElementById('heroLabel');
  const headlineEl = document.getElementById('heroHeadline');
  const subEl = document.getElementById('heroSub');
  if (!labelEl || !headlineEl || !subEl) return;

  const roles = [
    {
      label: 'A Software Engineer who',
      headline: 'Builds systems<br>that <span class="highlight-circle">scale</span>...',
      sub: 'Because if the architecture is right, everything else follows.'
    },
    {
      label: 'An Open-Source Contributor who',
      headline: 'Empowers the<br>developer <span class="highlight-circle">community</span>...',
      sub: 'Because building together creates better software for everyone.'
    },
    {
      label: 'A System Architect who',
      headline: 'Designs resilient<br><span class="highlight-circle">cloud</span> infrastructure...',
      sub: 'Ensuring high availability and fault tolerance at every layer.'
    },
    {
      label: 'A Pianist who',
      headline: 'Composes melodies<br>from the <span class="highlight-circle">heart</span>...',
      sub: 'Bridging the gap between logic and creative expression.'
    },
    {
      label: 'A Photographer who',
      headline: 'Captures stories<br>through the <span class="highlight-circle">lens</span>...',
      sub: 'Finding beauty in the seemingly ordinary details of the world.'
    }
  ];
  let idx = 0;

  setInterval(() => {
    idx = (idx + 1) % roles.length;
    const currentRole = roles[idx];

    // STAGGERED FADE OUT
    [
      { el: labelEl, delay: 0 },
      { el: headlineEl, delay: 50 },
      { el: subEl, delay: 100 }
    ].forEach(({el, delay}) => {
      setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-12px)';
        el.style.filter = 'blur(4px)';
        el.style.transition = 'all 0.4s ease-out';
      }, delay);
    });

    // WAIT for fade out, then SWAP and FADE IN
    setTimeout(() => {
      labelEl.textContent = currentRole.label;
      headlineEl.innerHTML = currentRole.headline;
      subEl.textContent = currentRole.sub;

      // Reset starting position for entry
      [labelEl, headlineEl, subEl].forEach(el => {
        el.style.transform = 'translateY(20px)';
      });
      // Force reflow
      void labelEl.offsetWidth;

      // STAGGERED FADE IN with spring bounce
      [
        { el: labelEl, delay: 0 },
        { el: headlineEl, delay: 100 },
        { el: subEl, delay: 200 }
      ].forEach(({el, delay}) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          el.style.filter = 'blur(0)';
          // custom spring timing easing
          el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.6s ease';
        }, delay);
      });
    }, 550); // wait for out-animation
  }, 4500); // 4.5s cycle
})();

// ===== Terminal Typing Effect =====
(function terminal() {
  const el = document.getElementById('terminalText');
  if (!el) return;

  const lines = [
    'git status --short',
    'docker compose up -d backend worker redis',
    'pytest tests/integration/ -v --benchmark',
    'kubectl get pods -n production -l app=core-api',
    'curl -s https://api.kartikdhiman.dev/health | jq .status',
    'python -m etl.pipeline --mode=incremental'
  ];

  let lineIdx = 0;
  let charIdx = 0;
  let isDeleting = false;


  function type() {
    const current = lines[lineIdx];
    if (!isDeleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(type, 2500);
        return;
      }
      setTimeout(type, 40 + Math.random() * 30);
    } else {
      el.textContent = current.substring(0, charIdx);
      charIdx--;
      if (charIdx < 0) {
        isDeleting = false;
        charIdx = 0;
        lineIdx = (lineIdx + 1) % lines.length;
        setTimeout(type, 500);
        return;
      }
      setTimeout(type, 20);
    }
  }

  setTimeout(type, 1200);
})();

// ===== Stat Counter Animation =====
(function statCounters() {
  const nums = document.querySelectorAll('.stat-num');
  if (!nums.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        animateCount(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  nums.forEach(n => observer.observe(n));

  function animateCount(el, target) {
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();

// ===== Illuminating Floating HUD Dock (Reveals from Page 2 onwards) =====
(function floatingHUD() {
  const dock = document.getElementById('floatingDock');
  const hero = document.getElementById('hero');
  const items = document.querySelectorAll('.dock-nav-item');
  const sections = document.querySelectorAll('.section');
  if (!dock) return;

  function handleScroll() {
    const heroH = hero ? hero.offsetHeight : 600;
    // Reveal once user scrolls past 60% of the first page
    if (window.scrollY > heroH * 0.6) {
      dock.classList.add('dock-visible');
    } else {
      dock.classList.remove('dock-visible');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Active section illumination
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        items.forEach(item => {
          item.classList.toggle('active', item.getAttribute('data-nav') === id);
        });
      }
    });
  }, { threshold: 0.2, rootMargin: '-80px 0px -40% 0px' });

  sections.forEach(s => {
    if (s.id) observer.observe(s);
  });
})();

// ===== Reveal on Scroll =====
(function reveal() {
  const els = document.querySelectorAll(
    '.timeline-item, .tech-bento-grid, .project-row, .contact-inner, .code-preview, .work-competencies-card'
  );
  els.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
})();

// ===== Work Experience Competency Bar Animation =====
(function compBars() {
  const card = document.querySelector('.work-competencies-card');
  if (!card) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        card.classList.add('is-animated');
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(card);
})();

// ===== Smooth Scroll for Navigation & Action Links =====
document.querySelectorAll('.dock-btn, .dock-nav-item, .dock-action-btn, .dock-brand, .strip-action, .nav-link, .btn-glow, .btn-outline, .floating-back-top, .hero-brand-logo').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.getElementById(href.substring(1)) ||
                     document.getElementById(link.getAttribute('data-target'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== Floating Return to Top Pill =====
(function backToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 350);
  }, { passive: true });
})();

// ===== Tech Stack Category Filter Hub =====
(function techFilter() {
  const filterBtns = document.querySelectorAll('.tech-filter-btn');
  const pods = document.querySelectorAll('.tech-pod');
  if (!filterBtns.length || !pods.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetFilter = btn.getAttribute('data-filter');

      pods.forEach(pod => {
        const podCat = pod.getAttribute('data-category');
        if (targetFilter === 'all' || podCat === targetFilter) {
          pod.classList.remove('is-hidden');
          pod.style.opacity = '0';
          pod.style.transform = 'translateY(12px)';
          setTimeout(() => {
            pod.style.transition = 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
            pod.style.opacity = '1';
            pod.style.transform = 'translateY(0)';
          }, 20);
        } else {
          pod.classList.add('is-hidden');
        }
      });
    });
  });
})();

// ===== Particles =====
document.addEventListener('DOMContentLoaded', function () {
  if (typeof particlesJS === 'undefined') return;

  particlesJS('particles-js', {
    particles: {
      number: { value: 40, density: { enable: true, value_area: 900 } },
      color: { value: ['#00d4ff', '#00ff88'] },
      shape: { type: 'circle' },
      opacity: { value: 0.08, random: true, anim: { enable: true, speed: 0.3, opacity_min: 0.02 } },
      size: { value: 2.5, random: true },
      line_linked: { enable: true, distance: 150, color: '#00d4ff', opacity: 0.05, width: 1 },
      move: { enable: true, speed: 0.4, direction: 'none', random: true, straight: false, out_mode: 'out' }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
      modes: { grab: { distance: 140, line_linked: { opacity: 0.15 } }, push: { particles_nb: 2 } }
    },
    retina_detect: true
  });
});