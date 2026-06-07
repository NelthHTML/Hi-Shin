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

/* =====================================================================
   ADMIN EDIT MODE
   ---------------------------------------------------------------------
   • Cliquez sur le cadenas (en bas à gauche) ou faites Ctrl+Maj+E.
   • Mot de passe par défaut : "hishin"  →  changez-le ci-dessous.
   • Les modifications sont enregistrées dans CE navigateur (localStorage).
   • « Exporter le site » télécharge un index.html avec vos textes intégrés.
   ===================================================================== */
(function () {
  'use strict';

  var ADMIN_PASS = 'hishin';                 // ← mot de passe administrateur
  var STORE_KEY  = 'hishin_content_v1';      // clé de sauvegarde locale

  var root = document.querySelector('[data-edit-root]');
  if (!root) return;

  var SELECTOR = 'h1, h2, h3, h4, p, li, blockquote, .section__kicker';
  var els = Array.prototype.slice.call(root.querySelectorAll(SELECTOR));

  // Assign stable keys by document order
  els.forEach(function (el, i) { el.setAttribute('data-edit', 'e' + i); });

  // ---- storage helpers ----
  function loadMap() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveMap(map) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(map)); return true; }
    catch (e) { return false; }
  }

  // ---- apply saved overrides on every load ----
  var saved = loadMap();
  els.forEach(function (el) {
    var k = el.getAttribute('data-edit');
    if (saved[k] != null) el.innerHTML = saved[k];
  });

  // ---- elements ----
  var lock    = document.getElementById('adminLock');
  var bar     = document.getElementById('adminBar');
  var status  = document.getElementById('adminStatus');
  var bExport = document.getElementById('adminExport');
  var bJson   = document.getElementById('adminExportJson');
  var bReset  = document.getElementById('adminReset');
  var bExit   = document.getElementById('adminExit');
  var modal   = document.getElementById('adminModal');
  var passIn  = document.getElementById('adminPass');
  var errEl   = document.getElementById('adminError');
  var bEnter  = document.getElementById('adminEnter');
  var bCancel = document.getElementById('adminCancel');

  var editing = false;
  var statusTimer = null;

  function setStatus(msg, saved) {
    if (!status) return;
    status.textContent = msg;
    status.classList.toggle('is-saved', !!saved);
    if (saved) {
      clearTimeout(statusTimer);
      statusTimer = setTimeout(function () {
        status.textContent = 'Cliquez sur un texte pour le modifier.';
        status.classList.remove('is-saved');
      }, 2200);
    }
  }

  function enter() {
    editing = true;
    document.body.classList.add('admin-mode');
    if (bar) bar.hidden = false;
    els.forEach(function (el) {
      el.setAttribute('contenteditable', 'true');
      el.spellcheck = false;
    });
    setStatus('Mode édition activé — cliquez sur un texte pour le modifier.');
  }

  function exit() {
    editing = false;
    document.body.classList.remove('admin-mode');
    if (bar) bar.hidden = true;
    els.forEach(function (el) { el.removeAttribute('contenteditable'); });
  }

  function openModal() {
    if (!modal) return;
    modal.hidden = false;
    if (errEl) errEl.hidden = true;
    if (passIn) { passIn.value = ''; setTimeout(function () { passIn.focus(); }, 40); }
  }
  function closeModal() { if (modal) modal.hidden = true; }
  function tryEnter() {
    if (passIn && passIn.value === ADMIN_PASS) { closeModal(); enter(); }
    else { if (errEl) errEl.hidden = false; if (passIn) passIn.select(); }
  }
  function toggle() {
    if (editing) { exit(); return; }
    openModal();
  }

  // ---- save on edit ----
  els.forEach(function (el) {
    el.addEventListener('input', function () {
      var map = loadMap();
      map[el.getAttribute('data-edit')] = el.innerHTML;
      setStatus(saveMap(map) ? 'Modifications enregistrées ✓' : 'Échec de sauvegarde locale', true);
    });
    // keep edits clean: paste as plain text
    el.addEventListener('paste', function (e) {
      e.preventDefault();
      var text = (e.clipboardData || window.clipboardData).getData('text');
      document.execCommand('insertText', false, text);
    });
  });

  // ---- download helper ----
  function download(filename, content, type) {
    var blob = new Blob([content], { type: type || 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 120);
  }

  // ---- export full HTML with edits baked in ----
  function exportHTML() {
    var clone = document.documentElement.cloneNode(true);
    ['#adminBar', '#adminLock', '#hsParticleAnim'].forEach(function (sel) {
      var n = clone.querySelector(sel); if (n) n.remove();
    });
    var hp = clone.querySelector('#heroParticles'); if (hp) hp.innerHTML = '';
    var body = clone.querySelector('body'); if (body) body.classList.remove('admin-mode');
    Array.prototype.forEach.call(clone.querySelectorAll('[contenteditable]'), function (n) {
      n.removeAttribute('contenteditable'); n.removeAttribute('spellcheck');
    });
    Array.prototype.forEach.call(clone.querySelectorAll('[data-edit]'), function (n) {
      n.removeAttribute('data-edit');
    });
    Array.prototype.forEach.call(clone.querySelectorAll('.reveal.is-visible'), function (n) {
      n.classList.remove('is-visible');
    });
    var n1 = clone.querySelector('#nav');       if (n1) n1.classList.remove('is-scrolled');
    var n2 = clone.querySelector('#navLinks');  if (n2) n2.classList.remove('is-open');
    var n3 = clone.querySelector('#navToggle'); if (n3) n3.classList.remove('is-open');

    download('index.html', '<!DOCTYPE html>\n' + clone.outerHTML, 'text/html;charset=utf-8');
    setStatus('Site exporté — remplacez votre index.html par le fichier téléchargé.', true);
  }

  function exportJSON() {
    download('hishin-textes.json', JSON.stringify(loadMap(), null, 2), 'application/json;charset=utf-8');
    setStatus('Textes exportés en JSON.', true);
  }

  // ---- reset (two-step confirmation, no blocking dialog) ----
  var resetArmed = false, resetTimer = null;
  function reset() {
    if (!resetArmed) {
      resetArmed = true;
      if (bReset) { bReset.textContent = '↺ Confirmer ?'; bReset.classList.add('is-armed'); }
      resetTimer = setTimeout(function () {
        resetArmed = false;
        if (bReset) { bReset.textContent = '↺ Réinitialiser'; bReset.classList.remove('is-armed'); }
      }, 3000);
      return;
    }
    clearTimeout(resetTimer);
    localStorage.removeItem(STORE_KEY);
    location.reload();
  }

  // ---- wire up ----
  if (lock)    lock.addEventListener('click', toggle);
  if (bExit)   bExit.addEventListener('click', exit);
  if (bExport) bExport.addEventListener('click', exportHTML);
  if (bJson)   bJson.addEventListener('click', exportJSON);
  if (bReset)  bReset.addEventListener('click', reset);

  if (bEnter)  bEnter.addEventListener('click', tryEnter);
  if (bCancel) bCancel.addEventListener('click', closeModal);
  if (passIn)  passIn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); tryEnter(); }
    else if (e.key === 'Escape') { closeModal(); }
  });
  if (modal) modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
      e.preventDefault(); toggle();
    }
  });
})();
