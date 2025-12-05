(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    // Ensure a hero section exists; if not, create one right before News
    var news = document.getElementById('news');
    var hero = document.getElementById('hero');

    if (!hero) {
      hero = document.createElement('section');
      hero.id = 'hero';
      hero.className = 'hero';
      hero.setAttribute('data-section', 'hero');

      var container = document.createElement('div');
      container.className = 'container hero-grid';

      var content = document.createElement('div');
      content.className = 'hero-content';

      var h1 = document.createElement('h1');
      h1.innerHTML = 'SPORTS COUNCIL <span class="hero-sub">IISERB</span>';
      content.appendChild(h1);

      var p = document.createElement('p');
      p.textContent = 'Where passion meets performance — the Sports Council IISERB drives sporting excellence, events, tournaments, and student engagement across campus.';
      content.appendChild(p);

      var quick = document.createElement('div');
      quick.className = 'hero-quick-links';
      quick.innerHTML = '<a href="#events">Events</a>\
<a href="#bookings">Bookings</a>\
<a href="#scores">Live Scores</a>';
      content.appendChild(quick);

      var media = document.createElement('div');
      media.className = 'hero-media';

      ;['hero-photo-1', 'hero-photo-2', 'hero-photo-3'].forEach(function (cls) {
        var d = document.createElement('div');
        d.className = 'hero-photo ' + cls;
        media.appendChild(d);
      });

      container.appendChild(content);
      container.appendChild(media);
      hero.appendChild(container);

      if (news && news.parentNode) {
        news.parentNode.insertBefore(hero, news);
      } else {
        // Fallback: prepend to main
        var main = document.querySelector('main') || document.body;
        main.insertBefore(hero, main.firstChild);
      }
    }

    var mediaEl = hero.querySelector('.hero-media');
    if (!mediaEl) {
      mediaEl = hero.querySelector('#heroSlider') || document.getElementById('heroSlider');
      if (mediaEl) mediaEl.classList.add('hero-media');
    }
    if (!mediaEl) return;

    var slides = Array.prototype.slice.call(mediaEl.querySelectorAll('.hero-photo'));
    if (slides.length === 0) {
      var imgs = mediaEl.querySelectorAll('img');
      if (imgs && imgs.length) {
        Array.prototype.forEach.call(imgs, function (img) {
          var d = document.createElement('div');
          d.className = 'hero-photo';
          if (img.src) d.style.backgroundImage = 'url("' + img.src + '")';
          mediaEl.insertBefore(d, img);
          if (img.parentNode) img.parentNode.removeChild(img);
        });
      }
      slides = Array.prototype.slice.call(mediaEl.querySelectorAll('.hero-photo'));
    }
    if (slides.length === 0) {
      ;['hero-photo-1', 'hero-photo-2', 'hero-photo-3'].forEach(function (cls) {
        var d = document.createElement('div');
        d.className = 'hero-photo ' + cls;
        mediaEl.appendChild(d);
      });
      slides = Array.prototype.slice.call(mediaEl.querySelectorAll('.hero-photo'));
    }

    // Ensure controls exist as overlay outside the scrolling container
    function ensureControls() {
      // Ensure wrapper exists
      var wrap = mediaEl.closest('.hero-media-wrap');
      if (!wrap) {
        wrap = document.createElement('div');
        wrap.className = 'hero-media-wrap';
        // Insert wrap before mediaEl and move mediaEl inside
        mediaEl.parentNode.insertBefore(wrap, mediaEl);
        wrap.appendChild(mediaEl);
      }

      // Remove any controls that may be inside the scrolling container
      var internalBtns = mediaEl.querySelectorAll('.hero-control');
      if (internalBtns && internalBtns.length) {
        Array.prototype.forEach.call(internalBtns, function (btn) {
          if (btn && btn.parentNode) btn.parentNode.removeChild(btn);
        });
      }

      // Ensure overlay container exists
      var overlay = wrap.querySelector('.hero-controls');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'hero-controls';
        wrap.appendChild(overlay);
      }

      // Ensure prev/next buttons exist
      var prev = overlay.querySelector('.hero-control.prev');
      if (!prev) {
        prev = document.createElement('button');
        prev.className = 'hero-control prev';
        prev.setAttribute('aria-label', 'Previous');
        prev.type = 'button';
        prev.innerHTML = '‹';
        overlay.appendChild(prev);
      }
      var next = overlay.querySelector('.hero-control.next');
      if (!next) {
        next = document.createElement('button');
        next.className = 'hero-control next';
        next.setAttribute('aria-label', 'Next');
        next.type = 'button';
        next.innerHTML = '›';
        overlay.appendChild(next);
      }

      // Wire up events
      prev.addEventListener('click', function () { goTo(current - 1); });
      next.addEventListener('click', function () { goTo(current + 1); });
    }

    var current = 0;
    var timer = null;
    var paused = false;

    function paneWidth() { return mediaEl.clientWidth; }

    function goTo(index, smooth) {
      if (smooth === void 0) smooth = true;
      if (slides.length === 0) return;
      current = (index + slides.length) % slides.length;
      var x = current * paneWidth();
      try {
        mediaEl.scrollTo({ left: x, behavior: smooth ? 'smooth' : 'auto' });
      } catch (e) {
        mediaEl.scrollLeft = x;
      }
    }

    function startAuto() {
      stopAuto();
      timer = setInterval(function () {
        if (!paused) goTo(current + 1);
      }, 2000);
    }

    function stopAuto() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    ensureControls();

    mediaEl.addEventListener('mouseenter', function () { paused = true; });
    mediaEl.addEventListener('mouseleave', function () { paused = false; });
    mediaEl.addEventListener('touchstart', function () { paused = true; }, { passive: true });
    window.addEventListener('blur', function () { paused = true; });
    window.addEventListener('focus', function () { paused = false; });

    var wrapEl = mediaEl.closest('.hero-media-wrap');
    if (wrapEl) {
      wrapEl.addEventListener('mouseenter', function () { paused = true; });
      wrapEl.addEventListener('mouseleave', function () { paused = false; });
    }
    var overlayEl = wrapEl ? wrapEl.querySelector('.hero-controls') : null;
    if (overlayEl) {
      overlayEl.addEventListener('mouseenter', function () { paused = true; });
      overlayEl.addEventListener('mouseleave', function () { paused = false; });
      overlayEl.addEventListener('touchstart', function () { paused = true; }, { passive: true });
    }

    startAuto();
    window.addEventListener('resize', function () { goTo(current, false); });
    goTo(0, false);

    // Ensure heading, welcome, and quick-links exist in the text panel
    var contentEl = hero.querySelector('.hero-content');
    if (contentEl) {
      var h1El = contentEl.querySelector('h1');
      if (!h1El) {
        h1El = document.createElement('h1');
        contentEl.insertBefore(h1El, contentEl.firstChild);
      }
      h1El.innerHTML = 'SPORTS COUNCIL <span class="hero-sub">IISERB</span>';

      var p2 = contentEl.querySelector('p') || document.createElement('p');
      if (!p2.parentNode) contentEl.appendChild(p2);
      p2.textContent = 'Where passion meets performance — the Sports Council IISERB drives sporting excellence, events, tournaments, and student engagement across campus.';

      if (!contentEl.querySelector('.hero-quick-links')) {
        var ql = document.createElement('div');
        ql.className = 'hero-quick-links';
        ql.innerHTML = '<a href="#events">Events</a>\
<a href="#bookings">Bookings</a>\
<a href="#scores">Live Scores</a>';
        contentEl.appendChild(ql);
      }
    }
  });
})();
