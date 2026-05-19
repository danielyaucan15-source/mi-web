/* ============================================
   El Navajero · Barbería Premium · Ecuador
   web.js
   ============================================ */

/* ── MENÚ MÓVIL ── */
(function initMobileMenu() {
  const burger = document.querySelector('.nav-burger');
  const menu   = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
  });

  // Cierra el menú al hacer clic en un enlace
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    });
  });
})();


/* ── NAV: SHRINK AL HACER SCROLL ── */
(function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.padding = '.7rem 4rem';
      nav.style.background = 'rgba(10,10,8,.97)';
    } else {
      nav.style.padding = '';
      nav.style.background = '';
    }
  }, { passive: true });
})();


/* ── ANIMACIÓN AL ENTRAR EN VIEWPORT (Intersection Observer) ── */
(function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.service-card, .testi-card, .stat, .price-col, .feat, .contact-item'
  );

  if (!targets.length) return;

  // Preparar estado inicial
  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .55s ease, transform .55s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();


/* ── CONTADORES ANIMADOS (Stats) ── */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;

  // Extrae el número de un string como "15+", "8k+", "★4.9"
  function parseValue(str) {
    const num = parseFloat(str.replace(/[^\d.]/g, ''));
    return isNaN(num) ? null : num;
  }

  function animateCounter(el, target, suffix, decimals) {
    const duration = 1600;
    const start    = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current  = eased * target;
      el.textContent = (decimals ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();
      const num = parseValue(raw);
      if (num === null) return;

      // Detecta sufijo y decimales
      const suffix   = raw.replace(/[\d.]/g, '');
      const decimals = raw.includes('.');
      animateCounter(el, num, suffix, decimals);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
})();


/* ── SMOOTH SCROLL para navegación interna ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.querySelector('nav')?.offsetHeight || 70;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── INDICADOR DE HORARIO EN TIEMPO REAL ── */
(function initHoursIndicator() {
  const badge = document.querySelector('.open-badge');
  if (!badge) return;

  // Zona horaria de Ecuador (UTC-5)
  const now  = new Date();
  const ec   = new Date(now.toLocaleString('en-US', { timeZone: 'America/Guayaquil' }));
  const day  = ec.getDay();   // 0=Dom, 1=Lun ... 6=Sáb
  const hour = ec.getHours();
  const min  = ec.getMinutes();
  const time = hour + min / 60;

  // Horarios: Lun–Vie 9–20 | Sáb 8–19 | Dom 9–15
  let isOpen = false;
  if (day >= 1 && day <= 5) isOpen = time >= 9 && time < 20;      // Lun–Vie
  else if (day === 6)        isOpen = time >= 8 && time < 19;      // Sáb
  else if (day === 0)        isOpen = time >= 9 && time < 15;      // Dom

  badge.textContent = isOpen ? '✔ Abierto ahora' : '✖ Cerrado';
  badge.style.color = isOpen ? '#4caf50' : '#e57373';
})();
