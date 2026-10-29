/* =========================================================
   Portfolio de copywriting
   Interacciones simples, sin dependencias
   ========================================================= */

(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const nav = document.querySelector('#nav-principal');
  const navToggle = document.querySelector('.nav-toggle');
  const navLabel = document.querySelector('.nav-toggle__label');
  const navDropdown = document.querySelector('.nav__item--dropdown');
  const navDropdownToggle = document.querySelector('.nav__dropdown-toggle');

  /* ---------- Menú de navegación en celular ---------- */

  const setNavState = (open) => {
    if (!nav || !navToggle) return;

    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);

    if (navLabel) {
      navLabel.textContent = open ? 'Cerrar' : 'Menú';
    }
  };

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      setNavState(!isOpen);
      if (isOpen) {
        navDropdown?.classList.remove('is-open');
        navDropdownToggle?.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (navDropdownToggle && navDropdown) {
    navDropdownToggle.addEventListener('click', (event) => {
      // On desktop, allow hover; on click just prevent default if needed
      if (window.innerWidth > 820) {
        event.preventDefault();
        const isOpen = navDropdown.classList.contains('is-open');
        navDropdown.classList.toggle('is-open', !isOpen);
        navDropdownToggle.setAttribute('aria-expanded', String(!isOpen));
      } else {
        event.preventDefault();
        const isOpen = navDropdown.classList.contains('is-open');
        navDropdown.classList.toggle('is-open', !isOpen);
        navDropdownToggle.setAttribute('aria-expanded', String(!isOpen));
      }
    });
  }

  if (navDropdown) {
    navDropdown.addEventListener('mouseenter', () => {
      if (window.innerWidth > 820) {
        navDropdown.classList.add('is-open');
        navDropdownToggle?.setAttribute('aria-expanded', 'true');
      }
    });
    navDropdown.addEventListener('mouseleave', () => {
      if (window.innerWidth > 820) {
        navDropdown.classList.remove('is-open');
        navDropdownToggle?.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (nav) {
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        setNavState(false);
        navDropdown?.classList.remove('is-open');
        navDropdownToggle?.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (navToggle?.getAttribute('aria-expanded') === 'true') {
        setNavState(false);
        navToggle.focus();
      }
      navDropdown?.classList.remove('is-open');
      navDropdownToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('click', (event) => {
    if (navToggle?.getAttribute('aria-expanded') === 'true') {
      if (nav?.contains(event.target) || navToggle.contains(event.target)) {
        // keep open
      } else {
        setNavState(false);
      }
    }
    if (navDropdown && !navDropdown.contains(event.target)) {
      if (window.innerWidth > 820) {
        navDropdown.classList.remove('is-open');
        navDropdownToggle?.setAttribute('aria-expanded', 'false');
      }
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) {
      setNavState(false);
      navDropdown?.classList.remove('is-open');
      navDropdownToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Borde del header al hacer scroll ---------- */

  let framePending = false;

  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 8);
    framePending = false;
  };

  window.addEventListener('scroll', () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateHeader);
  }, { passive: true });

  updateHeader();

  /* ---------- Año automático ---------- */

  const year = document.querySelector('#year');
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  /* ---------- CTA hacia el brief ---------- */

  const brief = document.querySelector('#brief');
  const briefTitle = document.querySelector('#brief-title');
  const briefLink = document.querySelector('[data-brief-link]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (briefLink && brief) {
    briefLink.addEventListener('click', (event) => {
      event.preventDefault();

      brief.scrollIntoView({
        behavior: reducedMotion.matches ? 'auto' : 'smooth',
        block: 'start'
      });

      brief.classList.remove('is-highlighted');
      // Reinicia la animación si se hace clic más de una vez.
      void brief.offsetWidth;
      brief.classList.add('is-highlighted');

      window.setTimeout(() => brief.classList.remove('is-highlighted'), 1900);

      if (briefTitle) {
        briefTitle.setAttribute('tabindex', '-1');
        window.setTimeout(() => {
          briefTitle.focus({ preventScroll: true });
        }, reducedMotion.matches ? 0 : 450);
      }
    });
  }

  /* ---------- Aparición progresiva al hacer scroll ---------- */

  const revealItems = document.querySelectorAll('[data-reveal]');

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      instance.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px'
  });

  revealItems.forEach((item) => observer.observe(item));
})();
