/**
 * NERRF — National Environmental Risk Reduction Framework
 * Main JavaScript · v2.0 — Nature Theme
 */

(function () {
  'use strict';

  /* ── Helpers ──────────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Sticky Header ────────────────────────────────────────── */
  const header = $('#site-header');
  function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ── Mobile Nav ───────────────────────────────────────────── */
  const toggle   = $('#nav-toggle');
  const navLinks = $('#nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    $$('.nav-link', navLinks).forEach(link => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('click', e => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) closeNav();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeNav(); toggle.focus(); }
    });
  }

  function closeNav() {
    navLinks.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* ── Active Nav Link ──────────────────────────────────────── */
  const navAnchors = $$('.nav-link[href^="#"]');
  const sections   = navAnchors.map(a => $(a.getAttribute('href'))).filter(Boolean);

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ── Scroll Reveal ────────────────────────────────────────── */
  const revealSelectors = [
    '.mission-item',
    '.about-text',
    '.about-images',
    '.challenge-item',
    '.effect-pill',
    '.effects-image-wrap',
    '.solution-image-col',
    '.component-item',
    '.impact-card',
    '.outcome-stat',
    '.matters-image-col',
    '.matters-content',
    '.pillar',
    '.involved-text',
    '.future-item',
    '.contact-text',
    '.contact-form-wrap',
  ];

  if (!prefersReducedMotion) {
    revealSelectors.forEach(sel => {
      $$(sel).forEach((el, i) => {
        el.classList.add('reveal');
        // Stagger siblings that share the same parent
        const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
        const idx = siblings.indexOf(el);
        if (idx > 0) el.style.transitionDelay = (idx * 90) + 'ms';
      });
    });

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

    $$('.reveal').forEach(el => revealObserver.observe(el));
  }

  /* ── Contact Form Validation ──────────────────────────────── */
  const form        = $('#contact-form');
  const formWrap    = $('.contact-form-wrap');
  const successBox  = $('#form-success');
  const resetBtn    = $('#form-reset');
  const submitBtn   = $('#form-submit');

  if (form) {
    // Real-time validation on blur
    $$('.form-input[required]', form).forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) validateField(input);
      });
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();

      // Validate all required fields
      const requiredFields = $$('.form-input[required]', form);
      let valid = true;
      requiredFields.forEach(f => { if (!validateField(f)) valid = false; });
      if (!valid) { requiredFields.find(f => f.classList.contains('error'))?.focus(); return; }

      // Loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Simulate async send (replace with real fetch in production)
      await new Promise(r => setTimeout(r, 1400));

      // Form readjustment: since success message is commented out, just reset
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      form.reset();
      $$('.form-input', form).forEach(f => f.classList.remove('error'));
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        $$('.form-input', form).forEach(f => f.classList.remove('error'));
        $$('.form-error', form).forEach(e => { e.textContent = ''; e.classList.remove('visible'); });
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        form.hidden = false;
        if (successBox) successBox.hidden = true;
      });
    }
  }

  function validateField(field) {
    const errorEl = field.parentElement.querySelector('.form-error');
    let msg = '';

    if (field.validity.valueMissing) {
      msg = 'This field is required.';
    } else if (field.type === 'email' && field.validity.typeMismatch) {
      msg = 'Please enter a valid email address.';
    } else if (field.value.trim().length < 2 && field.type !== 'email') {
      msg = 'Please enter at least 2 characters.';
    }

    if (msg) {
      field.classList.add('error');
      if (errorEl) { errorEl.textContent = msg; errorEl.classList.add('visible'); }
      return false;
    } else {
      field.classList.remove('error');
      if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('visible'); }
      return true;
    }
  }

  /* ── Subtle hero parallax on scroll ──────────────────────── */
  if (!prefersReducedMotion) {
    const heroImg = $('.hero-img');
    function heroParallax() {
      if (!heroImg) return;
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroImg.style.transform = `scale(1.04) translateY(${y * 0.25}px)`;
      }
    }
    window.addEventListener('scroll', heroParallax, { passive: true });
  }

  /* ── Log ──────────────────────────────────────────────────── */
  console.log('%cNERRF v2.0 · Nature Theme', 'color:#40916c;font-weight:700;font-size:13px;');
})();
