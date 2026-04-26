/* ============================================
   DR. SUSMITA SARKER — PREMIUM MEDICAL WEBSITE
   script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ===== NAVBAR SCROLL EFFECT ===== */
  const navbar = document.getElementById('navbar');

  const handleNavbarScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run on load


  /* ===== HAMBURGER MENU ===== */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  /* ===== SCROLL REVEAL ANIMATION ===== */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally un-observe after reveal for performance
        // revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ===== ACTIVE NAV LINK HIGHLIGHTING ===== */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link[href^="#"]');

  const activeSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => activeSectionObserver.observe(sec));


  /* ===== ANIMATED COUNTER FOR STATS ===== */
  const counters = document.querySelectorAll('.stat-num');
  let countersStarted = false;

  const animateCounter = (el, target, suffix = '') => {
    const duration = 1800;
    const start = performance.now();
    const startVal = 0;

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startVal + (target - startVal) * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        counters.forEach(counter => {
          const text = counter.textContent;
          const num = parseInt(text.replace(/\D/g, ''), 10);
          const suffix = text.includes('+') ? '+' : (text.includes('K') ? 'K+' : '');
          const realNum = text.includes('K') ? 5 : num;
          animateCounter(counter, realNum, suffix);
        });
      }
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }


  /* ===== PARALLAX TILT ON HERO IMAGE ===== */
  const heroImageWrap = document.querySelector('.hero-image-wrap');
  if (heroImageWrap && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 12;
      const y = (clientY / innerHeight - 0.5) * 12;
      heroImageWrap.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });

    heroImageWrap.addEventListener('mouseleave', () => {
      heroImageWrap.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
  }


  /* ===== FLOATING CARDS ENHANCED ANIMATION ===== */
  const floatCards = document.querySelectorAll('.float-card');
  floatCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.3}s`;
  });


  /* ===== SERVICE CARD RIPPLE EFFECT ===== */
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 0; height: 0;
        background: rgba(46,125,97,0.12);
        border-radius: 50%;
        transform: translate(-50%,-50%);
        animation: rippleEffect 0.6s ease-out forwards;
        pointer-events: none;
        z-index: 0;
      `;
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Inject ripple keyframe
  if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = `
      @keyframes rippleEffect {
        to { width: 300px; height: 300px; opacity: 0; }
      }
      .nav-link.active-link {
        color: var(--green) !important;
      }
      .nav-link.active-link::after {
        width: 100% !important;
      }
    `;
    document.head.appendChild(style);
  }


  /* ===== EXPERTISE ITEMS STAGGER ===== */
  const expertiseItems = document.querySelectorAll('.expertise-item');
  expertiseItems.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.08}s`;
    item.classList.add('reveal-right');
  });
  // Re-observe after adding class
  expertiseItems.forEach(el => revealObserver.observe(el));


  /* ===== HOSPITAL CARDS STAGGER ===== */
  const hospitalCards = document.querySelectorAll('.hospital-card');
  hospitalCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.15}s`;
  });


  /* ===== SCROLL PROGRESS INDICATOR ===== */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    background: linear-gradient(90deg, #2E7D61, #f48fb1);
    z-index: 9999;
    transition: width 0.1s ease;
    border-radius: 0 2px 2px 0;
  `;
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });


  /* ===== TYPEWRITER EFFECT ON HERO BADGE ===== */
  const heroBadge = document.querySelector('.hero-badge span');
  if (heroBadge) {
    const originalText = heroBadge.textContent;
    heroBadge.textContent = '';
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      heroBadge.textContent += originalText[charIndex];
      charIndex++;
      if (charIndex >= originalText.length) clearInterval(typeInterval);
    }, 40);
  }


  /* ===== FOOTER LINKS HOVER TRAIL ===== */
  const footerLinks = document.querySelectorAll('.footer-links a, .footer-services a');
  footerLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.paddingLeft = '8px';
    });
    link.addEventListener('mouseleave', () => {
      link.style.paddingLeft = '';
    });
  });


  /* ===== APPOINTMENT SECTION PULSE ===== */
  const apptIcon = document.querySelector('.appt-icon');
  if (apptIcon) {
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
      @keyframes apptPulse {
        0%, 100% { box-shadow: 0 12px 40px rgba(46,125,97,0.3), 0 0 0 0 rgba(46,125,97,0.3); }
        50%       { box-shadow: 0 12px 40px rgba(46,125,97,0.3), 0 0 0 16px rgba(46,125,97,0); }
      }
      .appt-icon { animation: apptPulse 2.5s ease-in-out infinite; }
    `;
    document.head.appendChild(pulseStyle);
  }


  /* ===== LAZY LOAD MAP IFRAME ===== */
  const mapIframe = document.querySelector('.map-wrapper iframe');
  if (mapIframe) {
    const mapObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const src = mapIframe.getAttribute('src');
        if (!mapIframe.src || mapIframe.src !== src) {
          mapIframe.src = src;
        }
        mapObserver.disconnect();
      }
    }, { threshold: 0.1 });
    mapObserver.observe(mapIframe);
  }


  /* ===== HERO TITLE LINE ANIMATION ===== */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(30px)';
    setTimeout(() => {
      heroTitle.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0)';
    }, 200);
  }

  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle) {
    heroSubtitle.style.opacity = '0';
    heroSubtitle.style.transform = 'translateY(20px)';
    setTimeout(() => {
      heroSubtitle.style.transition = 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s';
      heroSubtitle.style.opacity = '1';
      heroSubtitle.style.transform = 'translateY(0)';
    }, 300);
  }

  const heroActions = document.querySelector('.hero-actions');
  if (heroActions) {
    heroActions.style.opacity = '0';
    heroActions.style.transform = 'translateY(20px)';
    setTimeout(() => {
      heroActions.style.transition = 'opacity 0.9s ease 0.4s, transform 0.9s ease 0.4s';
      heroActions.style.opacity = '1';
      heroActions.style.transform = 'translateY(0)';
    }, 400);
  }

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    heroStats.style.opacity = '0';
    setTimeout(() => {
      heroStats.style.transition = 'opacity 0.9s ease 0.6s';
      heroStats.style.opacity = '1';
    }, 500);
  }


  /* ===== CONSOLE BRANDING ===== */
  console.log(
    '%c Dr. Susmita Sarker %c Gynecological Oncology Specialist ',
    'background: #2E7D61; color: white; padding: 4px 8px; border-radius: 4px 0 0 4px; font-weight: bold;',
    'background: #F8BBD0; color: #1c2b1c; padding: 4px 8px; border-radius: 0 4px 4px 0;'
  );

});
