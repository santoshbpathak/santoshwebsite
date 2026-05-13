/**
 * Santosh B. Pathak — main.js
 * Handles: nav, mobile menu, scroll reveal, work tabs,
 * insights filter, contact form, newsletter form.
 */

(function () {
  'use strict';

  /* ============ NAV ============ */
  function initNav() {
    const nav = document.getElementById('nav');
    const burger = document.getElementById('nav-burger');
    const links = document.getElementById('nav-links');
    if (!nav) return;

    // Scroll state
    const onScroll = () => {
      nav.classList.toggle('nav--scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Active page link
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    const navLinks = nav.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      // Match exact or prefix for sub-pages
      if (href && (path === href || (href !== '/' && path.startsWith(href.replace('.html', ''))))) {
        link.classList.add('nav__link--active');
      }
    });

    // Mobile burger
    if (burger && links) {
      burger.addEventListener('click', () => {
        const isOpen = links.classList.toggle('nav__links--open');
        burger.setAttribute('aria-expanded', isOpen);
        burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      });

      // Close on link click (mobile)
      links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          links.classList.remove('nav__links--open');
          burger.setAttribute('aria-expanded', 'false');
          burger.setAttribute('aria-label', 'Open menu');
        });
      });

      // Close on outside click
      document.addEventListener('click', e => {
        if (!nav.contains(e.target)) {
          links.classList.remove('nav__links--open');
          burger.setAttribute('aria-expanded', 'false');
        }
      });

      // Close on Escape
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && links.classList.contains('nav__links--open')) {
          links.classList.remove('nav__links--open');
          burger.setAttribute('aria-expanded', 'false');
          burger.focus();
        }
      });
    }
  }

  /* ============ SCROLL REVEAL ============ */
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: make everything visible
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /* ============ WORK TABS ============ */
  function initWorkTabs() {
    const tabs = document.querySelectorAll('.work-tab');
    const panels = document.querySelectorAll('.work-panel');
    if (!tabs.length || !panels.length) return;

    function activateTab(id) {
      tabs.forEach(t => t.classList.toggle('work-tab--active', t.dataset.tab === id));
      panels.forEach(p => p.classList.toggle('work-panel--active', p.dataset.panel === id));
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => activateTab(tab.dataset.tab));
      tab.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activateTab(tab.dataset.tab);
        }
      });
      tab.setAttribute('role', 'button');
      tab.setAttribute('tabindex', '0');
    });

    // Activate first tab if none active
    if (!document.querySelector('.work-tab--active')) {
      activateTab(tabs[0].dataset.tab);
    }
  }

  /* ============ INSIGHTS FILTER ============ */
  function initInsightsFilter() {
    const catBtns = document.querySelectorAll('.cat-btn');
    const insights = document.querySelectorAll('.insight[data-cat]');
    if (!catBtns.length) return;

    function filterCat(cat) {
      catBtns.forEach(b => b.classList.toggle('cat-btn--active', b.dataset.cat === cat));

      insights.forEach(card => {
        const matches = cat === 'all' || card.dataset.cat === cat;
        if (matches) {
          card.removeAttribute('hidden');
          // Re-apply featured span on first card only when showing All
          if (cat === 'all' && card.classList.contains('insight--feat-candidate')) {
            card.classList.add('insight--feat');
          }
        } else {
          card.setAttribute('hidden', '');
          card.classList.remove('insight--feat');
        }
      });
    }

    catBtns.forEach(btn => {
      btn.addEventListener('click', () => filterCat(btn.dataset.cat));
    });
  }

  /* ============ CONTACT FORM ============ */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const success = document.getElementById('contact-success');
    const radios = document.querySelectorAll('.form-radio');
    if (!form) return;

    // Radio pill selection
    radios.forEach(label => {
      label.addEventListener('click', () => {
        radios.forEach(r => r.classList.remove('form-radio--active'));
        label.classList.add('form-radio--active');
      });
    });

    // Form submission
    form.addEventListener('submit', e => {
      e.preventDefault();
      // In production, send to a form backend (Netlify Forms, Formspree, etc.)
      form.style.display = 'none';
      if (success) {
        success.classList.add('is-visible');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  /* ============ NEWSLETTER FORM ============ */
  function initNewsletterForms() {
    document.querySelectorAll('.newsletter__form').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          btn.textContent = 'Subscribed — see you next Tuesday ✓';
          btn.disabled = true;
          btn.style.opacity = '0.7';
        }
      });
    });
  }

  /* ============ DISC (link to work page) ============ */
  function initDisc() {
    const disc = document.querySelector('.disc');
    if (!disc) return;
    disc.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = disc.getAttribute('href') || 'work.html';
      }
    });
  }

  /* ============ SMOOTH ANCHOR SCROLLING ============ */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ============ INIT ============ */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initReveal();
    initWorkTabs();
    initInsightsFilter();
    initContactForm();
    initNewsletterForms();
    initDisc();
    initSmoothAnchors();
  });

})();
