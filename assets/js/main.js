/* ============================================================
   Boss Hog Clearing Co. — site interactions
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };

  /* ---------------- DATA ---------------- */
  var services = [
    { num: '01', name: 'Land Clearing',       tag: 'Most booked',     desc: 'Whole lots and acreage taken from jungle to job-ready. Brush, small trees and debris — gone.' },
    { num: '02', name: 'Brush Removal',       tag: 'Fast turnaround', desc: 'Cedar, mesquite and ten years of “I’ll get to it” — pulled, piled and hauled off your land.' },
    { num: '03', name: 'Forestry Mulching',   tag: 'No haul-off',     desc: 'Brush ground to mulch right where it stands. No burn pile, no haul-off, and it slows regrowth.' },
    { num: '04', name: 'Fence Line Clearing', tag: 'Ranch ready',     desc: 'Clean runs for new wire or reclaiming the old. Posts visible, corners square, brush gone.' },
    { num: '05', name: 'Trail Clearing',      tag: 'Recreation',      desc: 'Riding, hunting and walking trails cut through your land — not through everything else on it.' },
    { num: '06', name: 'Property Cleanup',    tag: 'Full service',    desc: 'Dump piles, old structures, construction debris — loaded, hauled, done. The “finally dealt with it” service.' }
  ];
  var towns = [
    { name: 'Celina', x: '36%', y: '31%', dot: '#C0470F' }, { name: 'Prosper', x: '38%', y: '43%', dot: '#C0470F' },
    { name: 'Frisco', x: '32%', y: '54%', dot: '#C0470F' }, { name: 'Anna', x: '56%', y: '28%', dot: '#C0470F' },
    { name: 'Melissa', x: '60%', y: '38%', dot: '#C0470F' }, { name: 'Princeton', x: '64%', y: '52%', dot: '#C0470F' },
    { name: 'Farmersville', x: '74%', y: '55%', dot: '#C8851E' }, { name: 'Denton', x: '14%', y: '44%', dot: '#C8851E' },
    { name: 'Gunter', x: '37%', y: '21%', dot: '#C8851E' }, { name: 'Van Alstyne', x: '58%', y: '15%', dot: '#C8851E' },
    { name: 'Sherman', x: '57%', y: '8%', dot: '#C8851E' }, { name: 'Greenville', x: '82%', y: '62%', dot: '#C8851E' },
    { name: 'Royse City', x: '71%', y: '69%', dot: '#C8851E' }, { name: 'Rockwall', x: '63%', y: '78%', dot: '#8A7E6E' },
    { name: 'Forney', x: '58%', y: '88%', dot: '#8A7E6E' }, { name: 'Terrell', x: '70%', y: '85%', dot: '#8A7E6E' },
    { name: 'Plano', x: '42%', y: '65%', dot: '#8A7E6E' }, { name: 'Pilot Point', x: '21%', y: '26%', dot: '#8A7E6E' }
  ];
  var faqs = [
    { q: 'How fast can you get to my property?', a: 'For anything in the Collin–Grayson corridor, usually within days, not weeks. One machine means a tight schedule — but it also means when we commit a date, we show up on it. Text a photo and a location and you’ll get a real answer same day.' },
    { q: 'What size trees and brush can you handle?', a: 'Brush, cedar, mesquite and trees up to roughly 8–10 inches across are right in our wheelhouse. Bigger timber or 5+ acre wooded tracts we’ll assess honestly — if a job needs bigger iron than ours, we’ll tell you straight instead of grinding your budget away.' },
    { q: 'How does pricing work?', a: 'Per acre, based on how thick the vegetation is — roughly $1,200–2,500/acre for light brush up to $3,500–6,000/acre for heavy wooded clearing, plus a mobilization fee that depends on distance. Text us a photo for an exact, free quote.' },
    { q: 'Do you haul off the debris?', a: 'Your choice. We can mulch it in place (forestry mulching — nothing to haul, feeds the soil), pile it for burning where permitted, or load and haul it away with the trailer. We’ll price each option in the quote.' },
    { q: 'Are you insured?', a: 'Yes — fully insured for the work we do, and happy to provide documentation for builders and GCs who need it for their sub list.' }
  ];

  /* ---------------- RENDER LISTS ---------------- */
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  var svcGrid = $('#svcGrid');
  if (svcGrid) {
    svcGrid.innerHTML = services.map(function (s, i) {
      return '<article class="svc" data-reveal data-reveal-delay="' + ((i % 3) * 90) + '">' +
        '<span class="tick tick--tl"></span><span class="tick tick--br"></span>' +
        '<div class="svc__ghost" aria-hidden="true">' + s.num + '</div>' +
        '<div class="svc__top"><span class="svc__num">' + s.num + '</span><span class="svc__tag">' + esc(s.tag) + '</span></div>' +
        '<h3 class="svc__name">' + esc(s.name) + '</h3>' +
        '<p class="svc__desc">' + esc(s.desc) + '</p>' +
      '</article>';
    }).join('');
  }

  var radar = $('#radar');
  if (radar) {
    var html = '';
    towns.forEach(function (t) {
      html += '<div class="town" style="left:' + t.x + ';top:' + t.y + '">' +
        '<span style="background:' + t.dot + '"></span><span>' + esc(t.name) + '</span></div>';
    });
    radar.insertAdjacentHTML('beforeend', html);
  }

  var faqList = $('#faqList');
  if (faqList) {
    faqList.innerHTML = faqs.map(function (f, i) {
      return '<div class="faq' + (i === 0 ? ' open' : '') + '" data-reveal data-reveal-delay="' + (i * 60) + '">' +
        '<button class="faq__q" aria-expanded="' + (i === 0) + '"><span>' + esc(f.q) + '</span><span class="faq__icon">+</span></button>' +
        '<div class="faq__a"><div><p>' + esc(f.a) + '</p></div></div></div>';
    }).join('');
    $$('.faq__q', faqList).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var faq = btn.parentNode, open = faq.classList.contains('open');
        $$('.faq', faqList).forEach(function (f) { f.classList.remove('open'); $('.faq__q', f).setAttribute('aria-expanded', 'false'); });
        if (!open) { faq.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
      });
    });
  }

  /* ---------------- REVEAL ON SCROLL ---------------- */
  (function () {
    var els = $$('[data-reveal]');
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var d = parseInt(en.target.getAttribute('data-reveal-delay') || '0', 10);
          setTimeout(function () { en.target.classList.add('in'); }, d);
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---------------- COUNT-UPS ---------------- */
  (function () {
    var els = $$('[data-count]');
    if (!els.length) return;
    function fmt(v, f) {
      if (f === 'ftin') { var ft = Math.floor(v), inch = Math.round((v - ft) * 12); return ft + "'" + inch + '"'; }
      if (f === 'dec') return v.toFixed(1);
      return Math.round(v).toLocaleString('en-US');
    }
    function run(el) {
      if (reduce) return;
      var target = parseFloat(el.getAttribute('data-count')), f = el.getAttribute('data-count-format') || 'int', start = performance.now();
      (function step(now) {
        var p = Math.min(1, (now - start) / 1300), e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(target * e, f);
        if (p < 1) requestAnimationFrame(step);
      })(start);
    }
    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.5 });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---------------- NAV ---------------- */
  (function () {
    var nav = $('#nav'), toggle = $('#navToggle'), links = $('#navLinks');
    if (!nav || !toggle) return;
    function close() { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    if (links) $$('a', links).forEach(function (a) { a.addEventListener('click', close); });
    // tap outside or press Escape to close the mobile menu
    document.addEventListener('click', function (e) { if (nav.classList.contains('open') && !nav.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  })();

  /* ---------------- BEFORE / AFTER SLIDER ---------------- */
  (function () {
    var el = $('#baSlider'); if (!el) return;
    var clip = $('#baBeforeWrap'), line = $('#baLine'), hand = $('#baHandle');
    var pos = 50, dragging = false, grabbed = false;
    function apply() {
      clip.style.clipPath = 'inset(0 ' + (100 - pos) + '% 0 0)';
      line.style.left = pos + '%'; hand.style.left = pos + '%';
      el.setAttribute('aria-valuenow', Math.round(pos));
    }
    function posFrom(e) { var r = el.getBoundingClientRect(); return Math.max(2, Math.min(98, ((e.clientX - r.left) / r.width) * 100)); }
    el.addEventListener('pointerdown', function (e) { grabbed = true; dragging = true; try { el.setPointerCapture(e.pointerId); } catch (x) {} pos = posFrom(e); apply(); e.preventDefault(); });
    el.addEventListener('pointermove', function (e) { if (dragging) { pos = posFrom(e); apply(); } });
    window.addEventListener('pointerup', function () { dragging = false; });
    window.addEventListener('pointercancel', function () { dragging = false; });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { grabbed = true; pos = Math.max(2, pos - 4); apply(); }
      else if (e.key === 'ArrowRight') { grabbed = true; pos = Math.min(98, pos + 4); apply(); }
    });
    apply();
    if (!reduce) {
      (function sweep(now) { if (!grabbed) { pos = 50 + Math.sin(now / 2200) * 14; apply(); } requestAnimationFrame(sweep); })(0);
    }
  })();

  /* ---------------- QUOTE FORM (homepage mini) ---------------- */
  (function () {
    var form = $('#quoteForm'); if (!form) return;
    var chipWrap = $('#quoteChips');
    var labels = ['Land clearing', 'Brush removal', 'Forestry mulching', 'Fence line', 'Trail clearing', 'Property cleanup', 'Something else'];
    var selected = { 'Land clearing': true };
    chipWrap.innerHTML = labels.map(function (l) {
      return '<button type="button" class="chip" aria-pressed="' + (!!selected[l]) + '" data-chip="' + esc(l) + '">' + esc(l) + '</button>';
    }).join('');
    $$('.chip', chipWrap).forEach(function (c) {
      c.addEventListener('click', function () {
        var l = c.getAttribute('data-chip'), on = !selected[l]; selected[l] = on; c.setAttribute('aria-pressed', on);
      });
    });
    // Leads are delivered to bosshogclearingco.com. The form POSTs to the
    // handler on their own domain; if that endpoint isn't reachable we fall
    // back to an email to the same domain so the request still gets there.
    var ENDPOINT = form.getAttribute('action') || 'https://bosshogclearingco.com/quote-request';
    var LEAD_EMAIL = 'quotes@bosshogclearingco.com';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var picks = Object.keys(selected).filter(function (k) { return selected[k]; });
      fd.append('services', picks.join(', '));
      fd.append('source', 'homepage');
      var subject = 'Quote request — ' + (fd.get('name') || 'New') + (fd.get('city') ? ' (' + fd.get('city') + ')' : '');
      var body = [
        'New quote request — Boss Hog Clearing Co.',
        'Name: ' + (fd.get('name') || '—'),
        'Phone: ' + (fd.get('phone') || '—'),
        'Location: ' + (fd.get('city') || '—'),
        'Needs: ' + (picks.join(', ') || '—'),
        'Notes: ' + (fd.get('notes') || '—')
      ].join('\n');
      function done() { form.classList.add('hidden'); $('#quoteSuccess').classList.remove('hidden'); }
      function emailFallback() {
        try { window.location.href = 'mailto:' + LEAD_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body); } catch (x) {}
        done();
      }
      if (window.fetch) {
        fetch(ENDPOINT, { method: 'POST', body: fd })
          .then(function (r) { if (r && r.ok) { done(); } else { emailFallback(); } })
          .catch(emailFallback);
      } else { emailFallback(); }
    });
    var reset = $('#quoteReset');
    if (reset) reset.addEventListener('click', function () { form.reset(); $('#quoteSuccess').classList.add('hidden'); form.classList.remove('hidden'); });
  })();

  /* ============================================================
     HERO — 3D parallax, spotlight, cigar smoke, embers, fog
     ============================================================ */
  (function () {
    var hero = $('#hero'); if (!hero) return;
    var photo = $('#heroPhoto'), copy = $('#heroCopy'), spot = $('#heroSpot');
    var layers = $$('[data-depth]', hero);
    var smokeCv = $('#heroSmoke'), fxCv = $('#heroFx');
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    // pointer + scroll state, eased
    var mx = 0, my = 0, mxT = 0, myT = 0, sp = 0, spT = 0;

    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      mxT = ((e.clientX - r.left) / r.width) * 2 - 1;
      myT = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (spot) { spot.style.setProperty('--sx', ((e.clientX - r.left) / r.width * 100) + '%'); spot.style.setProperty('--sy', ((e.clientY - r.top) / r.height * 100) + '%'); }
    });
    hero.addEventListener('pointerleave', function () { mxT = 0; myT = 0; });

    // device tilt on mobile
    if (coarse && window.DeviceOrientationEvent && !reduce) {
      window.addEventListener('deviceorientation', function (e) {
        if (e.gamma == null) return;
        mxT = Math.max(-1, Math.min(1, e.gamma / 28));
        myT = Math.max(-1, Math.min(1, (e.beta - 45) / 28));
      });
    }

    window.addEventListener('scroll', function () {
      spT = Math.max(0, Math.min(1, (window.scrollY || 0) / (window.innerHeight * 0.9)));
      if (Math.abs((window.scrollY || 0) - lastScrollY) > 40) { lastScrollY = window.scrollY || 0; smokeBoost = Math.min(smokeBoost + 2, 6); }
    }, { passive: true });

    function applyParallax() {
      layers.forEach(function (l) {
        var d = parseFloat(l.getAttribute('data-depth')) || 0;
        if (l === photo) {
          l.style.transform = 'translate3d(' + (mx * -d) + 'px,' + (my * -d * 0.55 + sp * 52) + 'px,0) rotateY(' + (mx * 3) + 'deg) rotateX(' + (-my * 2) + 'deg) scale(' + (1.02 + sp * 0.07) + ')';
        } else {
          l.style.transform = 'translate3d(' + (mx * -d) + 'px,' + (my * -d * 0.6) + 'px,0)';
        }
      });
      if (copy) { copy.style.transform = 'translateY(' + (sp * -56) + 'px)'; copy.style.opacity = String(Math.max(0, 1 - sp * 1.2)); }
    }

    /* ---- particle sprites ---- */
    function sprite(size, stops) {
      var c = document.createElement('canvas'); c.width = c.height = size;
      var ctx = c.getContext('2d'), g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      stops.forEach(function (s) { g.addColorStop(s[0], s[1]); });
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size); return c;
    }
    var smokeSprite, emberSprite, fogSprite;
    var smokeParts = [], emberParts = [], fogParts = [];
    var lastSmoke = 0, smokeBoost = 0, lastScrollY = 0;
    var EMBERS = coarse ? 9 : 16, FOGS = coarse ? 3 : 5;

    function sizeCanvases() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      [smokeCv, fxCv].forEach(function (cv) { if (!cv) return; var r = cv.getBoundingClientRect(); cv.width = Math.max(2, Math.round(r.width * dpr)); cv.height = Math.max(2, Math.round(r.height * dpr)); });
    }

    function newEmber(rndY) { return { x: Math.random(), y: rndY ? Math.random() : 1.05, vy: 0.00035 + Math.random() * 0.0006, drift: Math.random() * 10, size: 2 + Math.random() * 3.5, tw: 1.5 + Math.random() * 2.5 }; }
    function newFog() { return { x: Math.random(), y: 0.82 + Math.random() * 0.16, vx: (Math.random() - 0.5) * 0.00012, size: 140 + Math.random() * 200, seed: Math.random() * 10 }; }

    function spawnSmoke(w, h) {
      var ex = 0.578 * w, ey = 0.345 * h;
      smokeParts.push({ x: ex + (Math.random() * 14 - 7) * dpr, y: ey + (Math.random() * 8 - 4) * dpr,
        vx: (0.06 + Math.random() * 0.3) * dpr, vy: (-0.45 - Math.random() * 0.5) * dpr,
        size: (9 + Math.random() * 10) * dpr, grow: (0.16 + Math.random() * 0.2) * dpr,
        seed: Math.random() * 10, born: performance.now(), life: 3200 + Math.random() * 2200 });
      if (smokeParts.length > 70) smokeParts.shift();
    }

    function drawSmoke(now) {
      var ctx = smokeCv.getContext('2d'), w = smokeCv.width, h = smokeCv.height;
      ctx.clearRect(0, 0, w, h);
      var interval = smokeBoost > 0 ? 70 : 150;
      if (now - lastSmoke > interval) { lastSmoke = now; spawnSmoke(w, h); if (smokeBoost > 0) smokeBoost -= 0.5; }
      var next = [];
      for (var i = 0; i < smokeParts.length; i++) {
        var p = smokeParts[i], f = (now - p.born) / p.life;
        if (f >= 1) continue;
        p.x += p.vx + Math.sin(now / 900 + p.seed) * 0.34 * dpr; p.y += p.vy; p.vy *= 0.9985; p.size += p.grow;
        ctx.globalAlpha = Math.min(1, f * 5) * Math.pow(1 - f, 1.5) * 0.85;
        ctx.drawImage(smokeSprite, p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
        next.push(p);
      }
      ctx.globalAlpha = 1; smokeParts = next;
    }

    function drawFx(now) {
      var ctx = fxCv.getContext('2d'), w = fxCv.width, h = fxCv.height;
      ctx.clearRect(0, 0, w, h);
      for (var j = 0; j < fogParts.length; j++) {
        var f = fogParts[j]; f.x += f.vx; if (f.x < -0.3) f.x = 1.3; if (f.x > 1.3) f.x = -0.3;
        var s = f.size * dpr * (1 + 0.1 * Math.sin(now / 4000 + f.seed));
        ctx.globalAlpha = 0.55; ctx.drawImage(fogSprite, f.x * w - s, f.y * h - s * 0.5, s * 2, s);
      }
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < emberParts.length; i++) {
        var p = emberParts[i]; p.y -= p.vy; if (p.y < -0.05) emberParts[i] = newEmber(false);
        var x = (p.x + Math.sin(now / 1400 + p.drift) * 0.012) * w, y = p.y * h;
        var a = (0.35 + 0.65 * Math.abs(Math.sin(now / 1000 * (1 / p.tw) + p.drift))) * 0.8, sz = p.size * dpr;
        ctx.globalAlpha = a; ctx.drawImage(emberSprite, x - sz, y - sz, sz * 2, sz * 2);
      }
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    }

    // init
    smokeSprite = sprite(128, [[0, 'rgba(226,220,210,0.55)'], [0.35, 'rgba(214,206,194,0.28)'], [1, 'rgba(210,200,188,0)']]);
    emberSprite = sprite(32, [[0, 'rgba(255,196,110,1)'], [0.25, 'rgba(245,140,60,0.85)'], [1, 'rgba(232,97,28,0)']]);
    fogSprite = sprite(256, [[0, 'rgba(180,140,100,0.16)'], [0.5, 'rgba(150,110,80,0.08)'], [1, 'rgba(120,90,60,0)']]);
    for (var e = 0; e < EMBERS; e++) emberParts.push(newEmber(true));
    for (var g = 0; g < FOGS; g++) fogParts.push(newFog());
    sizeCanvases();
    window.addEventListener('resize', sizeCanvases);

    if (reduce) { applyParallax(); return; }
    (function tick(now) {
      mx += (mxT - mx) * 0.08; my += (myT - my) * 0.08; sp += (spT - sp) * 0.12;
      applyParallax();
      if (smokeCv) drawSmoke(now);
      if (fxCv) drawFx(now);
      requestAnimationFrame(tick);
    })(performance.now());
  })();
})();
