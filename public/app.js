// data-driven live preview and list management
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// Bind any input with [data-preview] to its target
$$('[data-preview]').forEach(input => {
  const target = input.dataset.preview;
  if (!target) return;
  const update = (val) => {
    // support multiple targets separated by commas
    const targets = Array.from(document.querySelectorAll(target));
    if (!targets.length) return;
    targets.forEach(el => { el.innerText = val || ''; });
    // update avatar initials when name changes (if any target includes .name1 or .resume-name)
    if (target.includes('.name1') || target.includes('.resume-name')){
      const avatar = document.querySelector('#avatar');
      if (avatar){
        const initials = (val || '').split(' ').filter(Boolean).slice(0,2).map(s=>s[0]?.toUpperCase()).join('') || 'JD';
        avatar.innerText = initials;
      }
    }
  };
  input.addEventListener('input', e => update(e.target.value.replace(/\"/g, '')));
  // initialize from initial value
  update(input.value || '');
});

// Buttons that add items to lists use data-list-target and data-list-input
$$('[data-list-target]').forEach(btn => {
  btn.addEventListener('click', () => {
    const listSel = btn.dataset.listTarget;
    const inputSel = btn.dataset.listInput;
    const list = document.querySelector(listSel);
    const input = document.querySelector(inputSel);
    if (!list || !input) return;
    const val = input.value.trim();
    if (!val) return;

    // If list is a timeline (div), create timeline item markup; otherwise append li
    if (list.classList.contains('timeline')){
      const item = document.createElement('div');
      item.className = 'timeline-item';
      // try to split period and role by parenthesis or dash for nicer display
      const m = val.match(/^\s*(\([^\)]*\)|[0-9]{4}(?:-[0-9]{4})?)\s*(.*)$/);
      let period = '';
      let role = val;
      if (m){ period = m[1]; role = m[2] || '' }
      const periodEl = document.createElement('div'); periodEl.className='period'; periodEl.innerText = period || '';
      const roleEl = document.createElement('div'); roleEl.className='role'; roleEl.innerText = role;
      item.appendChild(periodEl); item.appendChild(roleEl);
      list.appendChild(item);
    } else {
      const li = document.createElement('li');
      li.innerText = val;
      list.appendChild(li);
    }

    input.value = '';
    // optional: keep focus on input
    input.focus();
  });
});

// final submit preserves behavior (fallback)
const finalSubmit = $('#finalsubmit');
if (finalSubmit) finalSubmit.addEventListener('click', () => {
  // Trigger input event on all data-preview inputs to ensure the preview is synced
  $$('[data-preview]').forEach(i => i.dispatchEvent(new Event('input')));
});

// image upload preview + validation
(function(){
  const input = document.querySelector('#imgfile');
  const avatar = document.querySelector('#avatar');
  const err = document.querySelector('#img-error');
  const MAX = 2 * 1024 * 1024; // 2MB
  if (!input || !avatar) return;
  const removeBtn = document.querySelector('#remove-img');
  const setRemoveVisible = (v) => { if (removeBtn) removeBtn.style.display = v ? 'inline-flex' : 'none'; };
  // initialize remove button visibility depending on whether an image is present
  setRemoveVisible(!!avatar.querySelector('img'));

  if (removeBtn){
    removeBtn.addEventListener('click', () => {
      input.value = '';
      // remove img if exists
      const img = avatar.querySelector('img');
      if (img) img.remove();
      // restore initials
      const nameField = document.querySelector('.data1');
      const initials = (nameField && nameField.value ? nameField.value.split(' ').filter(Boolean).slice(0,2).map(s=>s[0].toUpperCase()).join('') : 'JD');
      avatar.innerHTML = initials;
      if (err){ err.style.display = 'none'; err.innerText = ''; }
      setRemoveVisible(false);
    });
  }

  input.addEventListener('change', e => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      // if removed via UI, revert to initials
      const nameField = document.querySelector('.data1');
      const initials = (nameField && nameField.value ? nameField.value.split(' ').filter(Boolean).slice(0,2).map(s=>s[0].toUpperCase()).join('') : 'JD');
      avatar.innerHTML = initials;
      if (err) { err.style.display = 'none'; err.innerText = ''; }
      setRemoveVisible(false);
      return;
    }
    if (!file.type.startsWith('image/')){
      if (err){ err.style.display = 'block'; err.innerText = 'Please select a valid image file.'; }
      input.value = '';
      setRemoveVisible(false);
      return;
    }

    // If the file is large, downscale it in the client to reduce PDF size and memory use
    const NEED_DOWNSCALE = file.size > (300 * 1024); // downscale files > 300KB
    const MAX_DIM = 1200; // maximum width/height when downscaling
    const TARGET_QUALITY = 0.82; // JPEG compression quality when exporting

    const performPreview = (dataUrl) => {
      if (err){ err.style.display = 'none'; err.innerText = ''; }
      avatar.innerHTML = '';
      const img = document.createElement('img');
      img.src = dataUrl;
      avatar.appendChild(img);
      setRemoveVisible(true);
    };

    if (!NEED_DOWNSCALE){
      // small file: just preview as-is
      const fr = new FileReader();
      fr.onload = () => performPreview(fr.result);
      fr.readAsDataURL(file);
      return;
    }

    // Downscale large images using canvas
    const img = new Image();
    const fr2 = new FileReader();
    fr2.onload = () => {
      img.onload = () => {
        // compute target size keeping aspect ratio
        let {width, height} = img;
        const ratio = Math.min(1, MAX_DIM / Math.max(width, height));
        const tw = Math.round(width * ratio);
        const th = Math.round(height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = tw; canvas.height = th;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, tw, th);
        // export as jpeg to get consistent compression
        const compressed = canvas.toDataURL('image/jpeg', TARGET_QUALITY);
        // show preview using compressed data
        performPreview(compressed);
        // Optional: replace the original file-like data for any future operations by storing compressed data on the input.dataset
        input.dataset.compressed = compressed;
      };
      img.onerror = () => {
        if (err){ err.style.display = 'block'; err.innerText = 'Unable to process the image.'; }
        input.value = '';
        setRemoveVisible(false);
      };
      img.src = fr2.result;
    };
    fr2.readAsDataURL(file);
  });
})();

// form width control: make the sidebar adjustable
(function(){
  const range = document.querySelector('#form-width');
  const val = document.querySelector('#form-width-val');
  if (!range) return;
  // set initial from css variable
  const current = getComputedStyle(document.documentElement).getPropertyValue('--form-width').trim().replace('px','') || 320;
  range.value = current;
  if (val) val.innerText = current + 'px';
  const update = (v) => {
    document.documentElement.style.setProperty('--form-width', v + 'px');
    if (val) val.innerText = v + 'px';
  };
  range.addEventListener('input', e => update(e.target.value));
})();

// Download PDF: print only the resume frame
(function(){
  const btn = document.querySelector('#download-pdf');
  if (!btn) return;
  btn.addEventListener('click', () => {
    // Make a dedicated print-friendly window that contains only the resume
    const resume = document.querySelector('.resume-frame');
    if (!resume) { window.print(); return; }
    const w = window.open('', '_blank');
    const cssLinks = Array.from(document.querySelectorAll('link[rel=stylesheet]')).map(l=>l.href);
    // Build a minimal HTML document
    w.document.write('<!doctype html><html><head><title>Resume</title>');
    cssLinks.forEach(h=> w.document.write('<link rel="stylesheet" href="'+h+'">'));
    // Add print-specific styles to ensure only resume prints nicely
    w.document.write('<style>@media print{body{margin:0} .resume-frame{margin:8mm;border:none;box-shadow:none} }</style>');
    w.document.write('</head><body>');
    w.document.write(resume.outerHTML);
    w.document.write('</body></html>');
    w.document.close();
    // give browser a moment to load styles then print
    setTimeout(()=>{ w.focus(); w.print(); setTimeout(()=>w.close(), 500); }, 350);
  });
})();

// set initial focus
window.addEventListener('load', () => { const f = document.querySelector('[data-preview]'); if (f) f.focus(); });



