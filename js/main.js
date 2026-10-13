/* Eclipse Hair Salon — behaviour. No dependencies. */
(function () {
  'use strict';

  var root = document.documentElement;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Current year in footer ---- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---- Colour theme: follow OS unless the visitor has chosen ---- */
  var THEME_KEY = 'eclipse-theme';
  try {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) {}

  function currentTheme() {
    var explicit = root.getAttribute('data-theme');
    if (explicit) return explicit;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  /* ---- Header: solid background after the hero ---- */
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile navigation panel ---- */
  var menuToggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('primary-nav');
  function closeNav() {
    if (!header) return;
    header.classList.remove('nav-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  }
  if (menuToggle && header) {
    menuToggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  if (nav) {
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* ---- Scroll reveal with a gentle stagger ---- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (!prefersReduced && 'IntersectionObserver' in window) {
    var groups = new Map();
    revealables.forEach(function (el) {
      var parent = el.parentElement;
      var idx = groups.get(parent) || 0;
      el.style.setProperty('--reveal-delay', Math.min(idx, 6) * 70 + 'ms');
      groups.set(parent, idx + 1);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---- Opening hours & "Open now" status ---- */
  // Minutes from midnight; null means closed that day.
  var HOURS = {
    0: null,
    1: null,
    2: [600, 1080],
    3: [600, 1080],
    4: [600, 1200],
    5: [600, 1200],
    6: [540, 1020]
  };
  var DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function fmt(min) {
    var h = Math.floor(min / 60), m = min % 60;
    var ampm = h >= 12 ? 'PM' : 'AM';
    var hh = h % 12 || 12;
    return hh + (m ? ':' + String(m).padStart(2, '0') : '') + ' ' + ampm;
  }

  function statusFor(now) {
    var day = now.getDay();
    var minutes = now.getHours() * 60 + now.getMinutes();
    var today = HOURS[day];
    if (today && minutes >= today[0] && minutes < today[1]) {
      return { open: true, label: 'Open — closes ' + fmt(today[1]) };
    }
    // Find the next opening within the coming week.
    for (var i = 0; i < 7; i++) {
      var d = (day + i) % 7;
      var slot = HOURS[d];
      if (!slot) continue;
      if (i === 0 && minutes >= slot[1]) continue; // already past today's close
      if (i === 0 && minutes < slot[0]) {
        return { open: false, label: 'Closed — opens today at ' + fmt(slot[0]) };
      }
      return { open: false, label: 'Closed — opens ' + DAY_NAMES[d] + ' at ' + fmt(slot[0]) };
    }
    return { open: false, label: 'Closed' };
  }

  function updateHours() {
    var now = new Date();
    var status = statusFor(now);

    var badge = document.querySelector('[data-open-badge]');
    if (badge) {
      badge.textContent = status.open ? 'Open now' : 'Closed';
      badge.setAttribute('data-state', status.open ? 'open' : 'closed');
    }

    var heroStatus = document.querySelector('[data-open-status]');
    if (heroStatus) heroStatus.textContent = status.label;

    var today = now.getDay();
    document.querySelectorAll('[data-day]').forEach(function (row) {
      var isToday = Number(row.getAttribute('data-day')) === today;
      if (isToday) row.setAttribute('aria-current', 'true');
      else row.removeAttribute('aria-current');
    });
  }
  updateHours();
  setInterval(updateHours, 60000);

  /* ---- Gallery lightbox ---- */
  var lightbox = document.getElementById('lightbox');
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.tile'));
  if (lightbox && tiles.length) {
    var lbImage = document.getElementById('lb-image');
    var lbCaption = document.getElementById('lb-caption');
    var index = 0;
    var lastFocused = null;
    var focusables = Array.prototype.slice.call(lightbox.querySelectorAll('button'));

    var render = function () {
      var tile = tiles[index];
      var img = tile.querySelector('img');
      lbImage.src = tile.getAttribute('href');
      lbImage.alt = img ? img.alt : '';
      lbCaption.textContent = tile.getAttribute('data-caption') || '';
    };

    var open = function (i, trigger) {
      index = i;
      lastFocused = trigger || document.activeElement;
      render();
      lightbox.hidden = false;
      document.body.classList.add('lb-open');
      var closeBtn = lightbox.querySelector('[data-lb="close"]');
      if (closeBtn) closeBtn.focus();
    };

    var close = function () {
      lightbox.hidden = true;
      document.body.classList.remove('lb-open');
      lbImage.src = '';
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    };

    var step = function (dir) {
      index = (index + dir + tiles.length) % tiles.length;
      render();
    };

    tiles.forEach(function (tile, i) {
      tile.addEventListener('click', function (e) {
        e.preventDefault();
        open(i, tile);
      });
    });

    lightbox.addEventListener('click', function (e) {
      var action = e.target.closest('[data-lb]');
      if (action) {
        var kind = action.getAttribute('data-lb');
        if (kind === 'close') close();
        if (kind === 'prev') step(-1);
        if (kind === 'next') step(1);
      } else if (e.target === lightbox) {
        close();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'Tab') {
        // Keep focus inside the dialog.
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // Swipe support on touch devices.
    var startX = 0, startY = 0, swiping = false;
    lightbox.addEventListener('touchstart', function (e) {
      var t = e.changedTouches[0];
      startX = t.clientX; startY = t.clientY; swiping = true;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (!swiping) return;
      swiping = false;
      var t = e.changedTouches[0];
      var dx = t.clientX - startX;
      var dy = t.clientY - startY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    }, { passive: true });
  }
})();
