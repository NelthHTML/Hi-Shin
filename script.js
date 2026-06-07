/* =====================================================================
   DIVISION HI SHIN — Interactions
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- Preloader ---------- */
  window.addEventListener('load', function () {
    var pre = document.getElementById('preloader');
    if (pre) {
      setTimeout(function () { pre.classList.add('is-done'); }, 650);
    }
  });

  /* ---------- Cached elements ---------- */
  var nav        = document.getElementById('nav');
  var navLinks   = document.getElementById('navLinks');
  var navToggle  = document.getElementById('navToggle');
  var progress   = document.getElementById('scrollProgress');
  var links      = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var sections   = links
    .map(function (l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  /* ---------- Scroll handler (nav state + progress) ---------- */
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;

    if (nav) nav.classList.toggle('is-scrolled', y > 40);

    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  /* ---------- Active link via IntersectionObserver ---------- */
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          links.forEach(function (l) {
            l.classList.toggle('is-active', l.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Mobile menu ---------- */
  function closeMenu() {
    if (navLinks) navLinks.classList.remove('is-open');
    if (navToggle) navToggle.classList.remove('is-open');
  }
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
  }
  links.forEach(function (l) { l.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Hero particles (floating embers/sparks) ---------- */
  var host = document.getElementById('heroParticles');
  if (host && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var COUNT = window.innerWidth < 760 ? 22 : 46;
    var frag = document.createDocumentFragment();

    if (!document.getElementById('hsParticleAnim')) {
      var style = document.createElement('style');
      style.id = 'hsParticleAnim';
      style.textContent =
        '@keyframes hsFloat{0%{transform:translateY(0) translateX(0);opacity:0}' +
        '10%{opacity:var(--o)}90%{opacity:var(--o)}' +
        '100%{transform:translateY(-110vh) translateX(var(--dx));opacity:0}}';
      document.head.appendChild(style);
    }

    for (var i = 0; i < COUNT; i++) {
      var p = document.createElement('span');
      p.className = 'particle';
      var size = (Math.random() * 2.6 + 0.8).toFixed(2);
      var dur  = (Math.random() * 16 + 12).toFixed(1);
      var delay = (Math.random() * -28).toFixed(1);
      var op   = (Math.random() * 0.5 + 0.15).toFixed(2);
      var dx   = (Math.random() * 80 - 40).toFixed(0) + 'px';

      p.style.cssText =
        'left:' + (Math.random() * 100).toFixed(2) + '%;' +
        'bottom:-10px;' +
        'width:' + size + 'px;height:' + size + 'px;' +
        '--o:' + op + ';--dx:' + dx + ';' +
        'box-shadow:0 0 ' + (size * 3).toFixed(0) + 'px rgba(95,160,239,0.8);' +
        'animation:hsFloat ' + dur + 's linear ' + delay + 's infinite;';
      frag.appendChild(p);
    }
    host.appendChild(frag);
  }

  /* ---------- Subtle parallax on hero emblem ---------- */
  var emblemWrap = document.querySelector('.hero__emblem-wrap');
  if (emblemWrap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('mousemove', function (e) {
      var cx = (e.clientX / window.innerWidth - 0.5);
      var cy = (e.clientY / window.innerHeight - 0.5);
      emblemWrap.style.transform = 'translate(' + (cx * 16).toFixed(1) + 'px,' + (cy * 16).toFixed(1) + 'px)';
    }, { passive: true });
  }
})();
