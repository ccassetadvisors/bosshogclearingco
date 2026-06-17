/* Boss Hog Clearing Co. — dedicated quote landing page */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* If we came back from a successful FormSubmit POST (_next=…?sent=1), show
     the success screen instead of the form. */
  if (/[?&]sent=1\b/.test(location.search)) {
    var f0 = $('#rfqForm'), ok0 = $('#rfqSuccess');
    if (f0) f0.classList.add('hidden');
    if (ok0) ok0.classList.remove('hidden');
    try { history.replaceState(null, '', location.pathname); } catch (e) {}
  }

  /* service chips → keep the hidden "services" input in sync */
  var labels = ['Land clearing', 'Brush removal', 'Forestry mulching', 'Fence line clearing', 'Trail clearing', 'Property cleanup', 'Lot / site prep', 'Something else'];
  var selected = { 'Land clearing': true };
  function syncServices() {
    var picks = Object.keys(selected).filter(function (k) { return selected[k]; });
    var el = $('#rfqServices'); if (el) el.value = picks.join(', ');
    return picks;
  }
  var chipWrap = $('#rfqChips');
  if (chipWrap) {
    chipWrap.innerHTML = labels.map(function (l) {
      return '<button type="button" class="chip" aria-pressed="' + (!!selected[l]) + '" data-chip="' + esc(l) + '">' + esc(l) + '</button>';
    }).join('');
    [].forEach.call(chipWrap.querySelectorAll('.chip'), function (c) {
      c.addEventListener('click', function () {
        var l = c.getAttribute('data-chip'), on = !selected[l]; selected[l] = on; c.setAttribute('aria-pressed', on); syncServices();
      });
    });
  }
  syncServices();

  /* photo previews */
  var photoInput = $('#f-photos'), thumbs = $('#rfqThumbs');
  if (photoInput && thumbs) {
    photoInput.addEventListener('change', function () {
      thumbs.innerHTML = '';
      [].slice.call(photoInput.files || []).slice(0, 6).forEach(function (file) {
        if (!/^image\//.test(file.type)) return;
        var img = document.createElement('img');
        img.alt = file.name; img.src = URL.createObjectURL(file);
        img.onload = function () { URL.revokeObjectURL(img.src); };
        thumbs.appendChild(img);
      });
    });
  }

  /* Shrink a phone photo (often several MB) to a ~1600px JPEG so the whole
     submission stays under FormSubmit's 10MB attachment cap and uploads fast.
     Always resolves — falls back to the original file if anything fails. */
  function compress(file) {
    return new Promise(function (resolve) {
      if (!/^image\//.test(file.type)) { resolve(file); return; }
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        URL.revokeObjectURL(url);
        try {
          var max = 1600, w = img.naturalWidth, h = img.naturalHeight;
          if (w > max || h > max) { if (w >= h) { h = Math.round(h * max / w); w = max; } else { w = Math.round(w * max / h); h = max; } }
          var c = document.createElement('canvas'); c.width = w; c.height = h;
          c.getContext('2d').drawImage(img, 0, 0, w, h);
          c.toBlob(function (blob) {
            if (!blob) { resolve(file); return; }
            var name = (file.name || 'photo').replace(/\.[^.]+$/, '') + '.jpg';
            try { resolve(new File([blob], name, { type: 'image/jpeg' })); }
            catch (e) { blob.name = name; resolve(blob); }
          }, 'image/jpeg', 0.72);
        } catch (e) { resolve(file); }
      };
      img.onerror = function () { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });
  }

  /* On submit: sync fields, compress the photos and attach each as its own
     file input, then do a native POST to FormSubmit (which emails the lead with
     the photos attached and redirects back to ?sent=1). */
  var form = $('#rfqForm');
  if (form) {
    var submitting = false;
    form.addEventListener('submit', function (e) {
      if (submitting) return;            // let the programmatic submit through
      e.preventDefault();
      submitting = true;
      var btn = form.querySelector('button[type=submit]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      syncServices();
      var nameEl = form.querySelector('[name=name]'), cityEl = form.querySelector('[name=city]');
      var subj = $('#rfqSubject');
      if (subj) subj.value = 'Quote request — ' + ((nameEl && nameEl.value) || 'New') + (cityEl && cityEl.value ? ' (' + cityEl.value + ')' : '');

      var files = (photoInput && photoInput.files) ? [].slice.call(photoInput.files).slice(0, 6) : [];
      // exclude the original (possibly large) input from the POST; we re-attach compressed copies
      if (photoInput) photoInput.removeAttribute('name');

      Promise.all(files.map(compress)).then(function (out) {
        out.forEach(function (file, i) {
          try {
            var dt = new DataTransfer(); dt.items.add(file);
            var inp = document.createElement('input');
            inp.type = 'file'; inp.name = 'photo' + (i + 1); inp.style.display = 'none';
            inp.files = dt.files; form.appendChild(inp);
          } catch (err) { /* DataTransfer unsupported — skip this attachment */ }
        });
      }).catch(function () {}).then(function () {
        HTMLFormElement.prototype.submit.call(form);   // native POST, bypasses this listener
      });
    });
  }
})();
