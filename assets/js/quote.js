/* Boss Hog Clearing Co. — dedicated quote landing page */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* service chips */
  var labels = ['Land clearing', 'Brush removal', 'Forestry mulching', 'Fence line clearing', 'Trail clearing', 'Property cleanup', 'Lot / site prep', 'Something else'];
  var selected = { 'Land clearing': true };
  var chipWrap = $('#rfqChips');
  if (chipWrap) {
    chipWrap.innerHTML = labels.map(function (l) {
      return '<button type="button" class="chip" aria-pressed="' + (!!selected[l]) + '" data-chip="' + esc(l) + '">' + esc(l) + '</button>';
    }).join('');
    [].forEach.call(chipWrap.querySelectorAll('.chip'), function (c) {
      c.addEventListener('click', function () {
        var l = c.getAttribute('data-chip'), on = !selected[l]; selected[l] = on; c.setAttribute('aria-pressed', on);
      });
    });
  }

  /* photo previews */
  var photoInput = $('#f-photos'), thumbs = $('#rfqThumbs'), photoCount = 0;
  if (photoInput && thumbs) {
    photoInput.addEventListener('change', function () {
      thumbs.innerHTML = ''; photoCount = (photoInput.files || []).length;
      [].slice.call(photoInput.files || []).slice(0, 8).forEach(function (file) {
        if (!/^image\//.test(file.type)) return;
        var img = document.createElement('img');
        img.alt = file.name; img.src = URL.createObjectURL(file);
        img.onload = function () { URL.revokeObjectURL(img.src); };
        thumbs.appendChild(img);
      });
    });
  }

  /* submit → POST the lead to bosshogclearingco.com, with an email-to-domain
     fallback so it always reaches them. (The "Text instead" / "Call" buttons
     remain for the fast mobile path.) */
  var form = $('#rfqForm');
  if (form) {
    var ENDPOINT = form.getAttribute('action') || 'https://bosshogclearingco.com/quote-request';
    var LEAD_EMAIL = 'quotes@bosshogclearingco.com';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var picks = Object.keys(selected).filter(function (k) { return selected[k]; });
      fd.append('services', picks.join(', '));
      fd.append('photos_count', String(photoCount));
      fd.append('source', 'quote-page');
      var subject = 'Quote request — ' + (fd.get('name') || 'New') + (fd.get('city') ? ' (' + fd.get('city') + ')' : '');
      var body = [
        'Quote request — Boss Hog Clearing Co.',
        'Name: ' + (fd.get('name') || '—'),
        'Phone: ' + (fd.get('phone') || '—'),
        'Email: ' + (fd.get('email') || '—'),
        'Location: ' + (fd.get('city') || '—'),
        'Acreage: ' + (fd.get('acres') || 'Not sure'),
        'Timeline: ' + (fd.get('when') || 'Flexible'),
        'Needs: ' + (picks.join(', ') || '—'),
        'Notes: ' + (fd.get('notes') || '—'),
        (photoCount ? 'Photos: ' + photoCount + ' selected (will text separately)' : 'Photos: none')
      ].join('\n');
      function done() {
        form.classList.add('hidden');
        var ok = $('#rfqSuccess'); if (ok) { ok.classList.remove('hidden'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      }
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
  }
})();
