/* ════════════════════════════════════════════════════════════
   TIMETABLE PRO — LANDING PAGE JAVASCRIPT
   ════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── NAVBAR SCROLL ─── */
  const navbar = document.getElementById('navbar');

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top
    const btt = document.getElementById('backToTop');
    if (window.scrollY > 500) {
      btt.classList.add('visible');
    } else {
      btt.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── HAMBURGER MENU ─── */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    mobileOverlay.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
  });

  mobileOverlay.addEventListener('click', closeMenu);

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    mobileOverlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  /* ─── HERO PARTICLES ─── */
  function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const count = window.innerWidth > 768 ? 30 : 15;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        bottom: ${Math.random() * 20}%;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        animation-duration: ${Math.random() * 15 + 10}s;
        animation-delay: ${Math.random() * 10}s;
        opacity: ${Math.random() * 0.6 + 0.2};
      `;
      container.appendChild(p);
    }
  }

  createParticles();

  /* ─── COUNT-UP ANIMATION ─── */
  function animateCountUp(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      // Format large numbers
      if (target >= 1000) {
        el.textContent = current.toLocaleString('en-IN');
      } else {
        el.textContent = current;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (target >= 1000) {
          el.textContent = target.toLocaleString('en-IN');
        } else {
          el.textContent = target;
        }
      }
    }

    requestAnimationFrame(update);
  }

  /* ─── INTERSECTION OBSERVER ─── */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  // Reveal cards
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || (i * 80);
        setTimeout(() => {
          el.classList.add('revealed');
        }, Number(delay));
        revealObserver.unobserve(el);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-card').forEach((card, i) => {
    card.dataset.delay = i * 80;
    revealObserver.observe(card);
  });

  // Count-up observers
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCountUp(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.stat-num[data-target], .sm-num[data-target]').forEach(el => {
    countObserver.observe(el);
  });

  /* ─── ROLE TABS ─── */
  const rolePanels = document.querySelectorAll('.role-panel');
  const roleTabs = document.querySelectorAll('.role-tab');

  window.switchRole = function (index) {
    roleTabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
      tab.setAttribute('aria-selected', (i === index).toString());
    });
    rolePanels.forEach((panel, i) => {
      panel.classList.toggle('active', i === index);
    });
  };

  /* ─── SMOOTH SCROLL for anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── ACTIVE NAV LINK on scroll ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let current = '';
    const navH = 80;
    sections.forEach(section => {
      const top = section.offsetTop - navH - 40;
      if (window.pageYOffset >= top) {
        current = section.id;
      }
    });

    navLinkEls.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === current) {
        link.style.color = 'var(--primary-light)';
      } else {
        link.style.color = '';
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ─── HERO SCROLL CUE fade-out ─── */
  const scrollCue = document.getElementById('scrollCue');
  if (scrollCue) {
    window.addEventListener('scroll', () => {
      const opacity = Math.max(0, 1 - window.scrollY / 200);
      scrollCue.style.opacity = opacity;
    }, { passive: true });
  }

  /* ─── FALLBACK: Christ College Logo ─── */
  const christLogo = document.getElementById('christLogo');
  if (christLogo) {
    // Try multiple relative paths
    const logoPaths = [
      '../assets/christ_college_logo.png',
      '../brochure/christ_college_logo.png',
      '../presentation/christ_college_logo.png',
    ];

    let logoIndex = 0;

    function tryNextLogo() {
      if (logoIndex < logoPaths.length) {
        christLogo.src = logoPaths[logoIndex++];
      } else {
        // If all paths fail, show a text fallback
        christLogo.parentElement.innerHTML = `
          <div style="width:80px;height:80px;background:linear-gradient(135deg,#1a2238,#0d1120);
                      border-radius:50%;display:flex;align-items:center;justify-content:center;
                      font-size:28px;font-weight:900;color:#6c63ff;">CC</div>
        `;
      }
    }

    christLogo.addEventListener('error', tryNextLogo);
  }

  /* ─── DASHBOARD MOCKUP — subtle hover interactions ─── */
  const dmNavItems = document.querySelectorAll('.dm-nav-item');
  dmNavItems.forEach(item => {
    item.addEventListener('click', function () {
      dmNavItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /* ─── PRICING CARD subtle shimmer animation ─── */
  document.querySelectorAll('.price-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      this.style.background = `
        radial-gradient(circle at ${x}% ${y}%, rgba(14,165,160,0.08) 0%, transparent 60%),
        var(--bg-card)
      `;
    });
    card.addEventListener('mouseleave', function () {
      this.style.background = '';
    });
  });

  /* ─── FEATURE CARD shimmer on hover ─── */
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      this.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(14,165,160,0.06) 0%, transparent 50%), var(--bg-card)`;
    });
    card.addEventListener('mouseleave', function () {
      this.style.background = '';
    });
  });

  console.log('%c✦ Timetable Pro', 'font-size:24px;font-weight:900;color:#0ea5a0;');
  console.log('%cEnd-to-End Examination & Timetable Management Platform', 'font-size:12px;color:#14c8c2;');
  console.log('%cPowered by Christ Innovation Center', 'font-size:11px;color:#00d4aa;');

})();
