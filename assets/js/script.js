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

// ===== Ambient Light Background Particles =====
(function initAmbientParticles() {
  function setupParticlesJS() {
    if (typeof particlesJS !== 'undefined') {
      try {
        particlesJS('particles-js', {
          particles: {
            number: {
              value: 58,
              density: { enable: true, value_area: 850 }
            },
            color: {
              value: ['#00d4ff', '#00ff88', '#38bdf8']
            },
            shape: { type: 'circle' },
            opacity: {
              value: 0.32,
              random: true,
              anim: {
                enable: true,
                speed: 0.8,
                opacity_min: 0.12,
                sync: false
              }
            },
            size: {
              value: 2.6,
              random: true,
              anim: {
                enable: true,
                speed: 1.4,
                size_min: 1.2,
                sync: false
              }
            },
            line_linked: {
              enable: true,
              distance: 140,
              color: '#00d4ff',
              opacity: 0.14,
              width: 1
            },
            move: {
              enable: true,
              speed: 0.65,
              direction: 'none',
              random: true,
              straight: false,
              out_mode: 'out',
              bounce: false
            }
          },
          interactivity: {
            detect_on: 'window',
            events: {
              onhover: { enable: true, mode: 'grab' },
              onclick: { enable: true, mode: 'push' },
              resize: true
            },
            modes: {
              grab: {
                distance: 150,
                line_linked: { opacity: 0.32 }
              },
              push: { particles_nb: 3 }
            }
          },
          retina_detect: true
        });
        return true;
      } catch (err) {
        console.warn('particlesJS init failed, falling back to native canvas:', err);
      }
    }
    return false;
  }

  function startNativeCanvas() {
    const container = document.getElementById('particles-js');
    if (!container) return;
    if (container.querySelector('canvas')) return; // already active

    const canvas = document.createElement('canvas');
    canvas.className = 'native-particle-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const colors = ['#00d4ff', '#00ff88', '#38bdf8'];
    const count = Math.min(65, Math.max(35, Math.floor((width * height) / 22000)));
    const particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 1.6 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.25 + 0.15,
        alphaSpeed: (Math.random() * 0.006 + 0.003) * (Math.random() < 0.5 ? 1 : -1)
      });
    }

    const mouse = { x: null, y: null };
    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });
    window.addEventListener('mouseleave', function () {
      mouse.x = null;
      mouse.y = null;
    });

    let running = true;
    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running) requestAnimationFrame(loop);
    });

    function loop() {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      // Particle physics & rendering
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        p.alpha += p.alphaSpeed;
        if (p.alpha > 0.42) { p.alpha = 0.42; p.alphaSpeed = -p.alphaSpeed; }
        else if (p.alpha < 0.14) { p.alpha = 0.14; p.alphaSpeed = -p.alphaSpeed; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Interaction with mouse cursor
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = '#00d4ff';
            ctx.globalAlpha = (1 - dist / 150) * 0.32;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        // Ambient constellation lines between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 135) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#00d4ff';
            ctx.globalAlpha = (1 - dist / 135) * 0.14;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  function init() {
    if (!setupParticlesJS()) {
      startNativeCanvas();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// ===== Interactive Natural Perching & Peeking Cat Easter Egg =====
(function siteCat() {
  const cat = document.getElementById('siteCat');
  const speech = document.getElementById('catSpeech');
  if (!cat || !speech) return;

  const purrQuotes = [
    'Purr purr... 😺',
    'Meow! 🐾',
    'Mrrrp? 🐾',
    'Purrrrrr... ❤️',
    'Mew! 🐾',
    'Purr... purr... ✨',
    '*kneads paws* 🐾',
    '*purr* =^.^=',
    'Meow meow! 🐾',
    '*happy tail swish* 🐱'
  ];

  const petResponses = [
    'Purrrrrr! ❤️ =^.^=',
    '*purr purr purr* 🐾',
    'Meow! =^.^=',
    '*head bumps hand* ❤️',
    '*happy purrs* 🐱',
    '*kneads happily* 🐾'
  ];

  let isBusy = false;
  let routineTimer = null;
  let speechTimer = null;
  let actionTimeout = null;

  function showMeow(text, duration = 2800) {
    speech.textContent = text;
    cat.classList.add('has-speech');
    clearTimeout(speechTimer);
    speechTimer = setTimeout(() => {
      cat.classList.remove('has-speech');
    }, duration);
  }

  function resetCat() {
    cat.className = 'site-cat';
    cat.style.transition = '';
    cat.style.left = '';
    cat.style.top = '';
    cat.style.right = '';
    cat.style.transform = '';
    isBusy = false;
  }

  function hideCat(callback) {
    cat.classList.remove('has-speech');
    cat.classList.add('is-hiding');
    setTimeout(() => {
      resetCat();
      if (callback) callback();
    }, 380);
  }

  // Find visible horizontal cards currently on screen
  function getPerchableCards() {
    const selectors = [
      '.bento-stat-card',
      '.timeline-content',
      '.tech-pod',
      '.work-competencies-card',
      '.code-preview',
      '.hero-terminal',
      '.bento-passion-card',
      '.project-row'
    ];
    const elements = document.querySelectorAll(selectors.join(', '));
    const viewH = window.innerHeight;
    const viewW = window.innerWidth;
    const list = [];

    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top >= 75 && rect.bottom <= viewH - 30 && rect.width >= 120) {
        list.push({
          el,
          rect,
          surfaceY: Math.round(rect.top - 38), // Paws at Y=38 rest directly on card top border
          perchX: Math.round(rect.left + Math.max(15, Math.min(rect.width - 70, rect.width * (0.35 + Math.random() * 0.35))))
        });
      }
    });

    return list;
  }

  // Perch on a card top border: paws resting naturally on the edge
  function perchOnCard(card) {
    const { surfaceY, perchX } = card;

    cat.className = 'site-cat';
    cat.style.left = `${perchX}px`;
    cat.style.top = `${surfaceY}px`;
    cat.style.right = 'auto';
    void cat.offsetWidth;

    // Cat emerges smoothly from behind the card
    cat.classList.add('is-visible');

    const firstMsg = purrQuotes[Math.floor(Math.random() * purrQuotes.length)];
    setTimeout(() => {
      if (!isBusy || cat.classList.contains('is-hiding')) return;
      showMeow(firstMsg, 2400);
    }, 250);

    // After 1.5s, cat pats/kneads the card border
    actionTimeout = setTimeout(() => {
      if (!isBusy || cat.classList.contains('is-hiding')) return;
      cat.classList.add('is-patting');

      // Purr again
      setTimeout(() => {
        if (!isBusy || cat.classList.contains('is-hiding')) return;
        showMeow('Purr purr... ❤️', 2200);
      }, 800);

      // Duck down and hide after 4.5 seconds
      actionTimeout = setTimeout(() => {
        if (!isBusy || cat.classList.contains('is-hiding')) return;
        hideCat();
      }, 3400);

    }, 1500);
  }

  // Peek out from screen left or right edge
  function peekFromScreenEdge() {
    const isLeft = Math.random() > 0.5;
    const viewH = window.innerHeight;
    const targetY = Math.max(100, Math.floor(Math.random() * (viewH - 220) + 100));

    cat.className = 'site-cat';
    cat.style.top = `${targetY}px`;

    if (isLeft) {
      cat.style.left = '10px';
      cat.style.right = 'auto';
    } else {
      cat.style.right = '10px';
      cat.style.left = 'auto';
    }
    void cat.offsetWidth;

    cat.classList.add('is-visible');

    const msg = purrQuotes[Math.floor(Math.random() * purrQuotes.length)];
    setTimeout(() => {
      if (!isBusy || cat.classList.contains('is-hiding')) return;
      showMeow(msg, 2600);
    }, 280);

    // Stays for 3.8s, then ducks back into the edge
    actionTimeout = setTimeout(() => {
      if (!isBusy || cat.classList.contains('is-hiding')) return;
      hideCat();
    }, 3800);
  }

  // Main Director Routine
  function startCatRoutine() {
    if (isBusy) return;
    isBusy = true;

    const cards = getPerchableCards();

    // 70% chance to perch on a card, 30% chance to peek from screen edge
    if (cards.length > 0 && Math.random() < 0.7) {
      const chosen = cards[Math.floor(Math.random() * cards.length)];
      perchOnCard(chosen);
    } else {
      peekFromScreenEdge();
    }
  }

  function scheduleNext() {
    clearTimeout(routineTimer);
    // Appears every 14 to 20 seconds
    const delay = Math.floor(Math.random() * 6000) + 14000;
    routineTimer = setTimeout(() => {
      startCatRoutine();
      scheduleNext();
    }, delay);
  }

  // Click on Cat: Purr & Pet celebration Easter Egg!
  cat.addEventListener('click', () => {
    if (cat.classList.contains('is-pet')) return;
    clearTimeout(actionTimeout);
    clearTimeout(speechTimer);
    clearTimeout(routineTimer);

    const petText = petResponses[Math.floor(Math.random() * petResponses.length)];
    speech.textContent = petText;
    cat.classList.add('has-speech', 'is-pet');

    setTimeout(() => {
      resetCat();
      scheduleNext();
    }, 850);
  });

  // Duck and hide smoothly on scroll to prevent misalignment
  let scrollDebounce;
  window.addEventListener('scroll', () => {
    if (isBusy && !cat.classList.contains('is-pet')) {
      clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(() => {
        clearTimeout(actionTimeout);
        hideCat();
      }, 60);
    }
  }, { passive: true });

  // First appearance 3 seconds after page loads!
  setTimeout(() => {
    startCatRoutine();
    scheduleNext();
  }, 3000);
})();