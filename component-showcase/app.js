/* ============================================
   Color Utilities
   ============================================ */
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  return [parseInt(hex.slice(0,2),16), parseInt(hex.slice(2,4),16), parseInt(hex.slice(4,6),16)];
}

function rgbToHex(r,g,b) {
  return '#' + [r,g,b].map(c => Math.max(0,Math.min(255,Math.round(c))).toString(16).padStart(2,'0')).join('');
}

function rgbToHsl(r,g,b) {
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b), l=(max+min)/2;
  let h=0, s=0;
  if(max!==min) {
    const d=max-min;
    s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max) {
      case r: h=((g-b)/d+(g<b?6:0))/6; break;
      case g: h=((b-r)/d+2)/6; break;
      case b: h=((r-g)/d+4)/6; break;
    }
  }
  return [h*360, s*100, l*100];
}

function hslToRgb(h,s,l) {
  h/=360; s/=100; l/=100;
  let r,g,b;
  if(s===0) { r=g=b=l; }
  else {
    const hue2rgb=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};
    const q=l<0.5?l*(1+s):l+s-l*s, p=2*l-q;
    r=hue2rgb(p,q,h+1/3); g=hue2rgb(p,q,h); b=hue2rgb(p,q,h-1/3);
  }
  return [Math.round(r*255),Math.round(g*255),Math.round(b*255)];
}

function hslToHex(h,s,l) { return rgbToHex(...hslToRgb(h,s,l)); }

function lighten(hex, amount) {
  const [h,s,l] = rgbToHsl(...hexToRgb(hex));
  return hslToHex(h, s, Math.min(100, l + amount));
}

function darken(hex, amount) {
  const [h,s,l] = rgbToHsl(...hexToRgb(hex));
  return hslToHex(h, s, Math.max(0, l - amount));
}

function luminance(r,g,b) {
  const [rs,gs,bs] = [r,g,b].map(c => { c/=255; return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4); });
  return 0.2126*rs + 0.7152*gs + 0.0722*bs;
}

function contrastColor(hex) {
  const [r,g,b] = hexToRgb(hex);
  return luminance(r,g,b) > 0.179 ? '#1D1B20' : '#FFFFFF';
}

function colorDistance(hex1, hex2) {
  const [r1,g1,b1]=hexToRgb(hex1), [r2,g2,b2]=hexToRgb(hex2);
  return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
}

/* ============================================
   Theme Engine
   ============================================ */
function applyTheme(colors) {
  const [c1,c2,c3,c4] = colors;
  const tokens = {
    '--md-primary': c1,
    '--md-on-primary': contrastColor(c1),
    '--md-primary-container': lighten(c1, 30),
    '--md-on-primary-container': darken(c1, 35),
    '--md-secondary': c2,
    '--md-on-secondary': contrastColor(c2),
    '--md-secondary-container': lighten(c2, 30),
    '--md-on-secondary-container': darken(c2, 35),
    '--md-tertiary': c3,
    '--md-on-tertiary': contrastColor(c3),
    '--md-tertiary-container': lighten(c3, 30),
    '--md-on-tertiary-container': darken(c3, 35),
    '--md-surface': lighten(c4, 40),
    '--md-on-surface': darken(c4, 45),
    '--md-surface-variant': lighten(c4, 25),
    '--md-on-surface-variant': darken(c4, 30),
    '--md-surface-container': lighten(c4, 33),
    '--md-surface-container-low': lighten(c4, 36),
    '--md-surface-container-high': lighten(c4, 28),
    '--md-surface-container-highest': lighten(c4, 22),
    '--md-outline': darken(c4, 10),
    '--md-outline-variant': lighten(c4, 15),
    '--md-inverse-surface': darken(c4, 40),
    '--md-inverse-on-surface': lighten(c4, 38),
    '--md-surface-dim': lighten(c4, 18),
  };
  const root = document.documentElement;
  for (const [prop, val] of Object.entries(tokens)) {
    root.style.setProperty(prop, val);
  }
  try { localStorage.setItem('theme-colors', JSON.stringify(colors)); } catch(e) {}
}

function loadSavedTheme() {
  try {
    const saved = localStorage.getItem('theme-colors');
    if (saved) { applyTheme(JSON.parse(saved)); return true; }
  } catch(e) {}
  return false;
}

function parsePaletteCode(code) {
  return [code.slice(0,6), code.slice(6,12), code.slice(12,18), code.slice(18,24)].map(c=>'#'+c);
}

/* ============================================
   Image Color Extraction (Median Cut)
   ============================================ */
function extractColors(imageEl) {
  const canvas = document.getElementById('colorCanvas');
  const ctx = canvas.getContext('2d');
  const maxDim = 200;
  const scale = Math.min(maxDim/imageEl.naturalWidth, maxDim/imageEl.naturalHeight, 1);
  canvas.width = Math.round(imageEl.naturalWidth * scale);
  canvas.height = Math.round(imageEl.naturalHeight * scale);
  ctx.drawImage(imageEl, 0, 0, canvas.width, canvas.height);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const pixels = [];
  for (let i=0; i<data.length; i+=4) pixels.push([data[i],data[i+1],data[i+2]]);
  const quantized = medianCut(pixels, 4);
  return select4Distinct(quantized);
}

function medianCut(pixels, depth) {
  if (depth === 0 || pixels.length === 0) {
    const avg = [0,1,2].map(ch => Math.round(pixels.reduce((s,p)=>s+p[ch],0)/pixels.length));
    return [rgbToHex(...avg)];
  }
  const ranges = [0,1,2].map(ch => {
    const vals = pixels.map(p=>p[ch]);
    return Math.max(...vals) - Math.min(...vals);
  });
  const ch = ranges.indexOf(Math.max(...ranges));
  pixels.sort((a,b) => a[ch]-b[ch]);
  const mid = Math.floor(pixels.length/2);
  return [...medianCut(pixels.slice(0,mid), depth-1), ...medianCut(pixels.slice(mid), depth-1)];
}

function select4Distinct(colors) {
  if (colors.length <= 4) return colors;
  const selected = [colors[0]];
  const remaining = colors.slice(1);
  while (selected.length < 4 && remaining.length > 0) {
    let bestIdx = 0, bestDist = -1;
    for (let i=0; i<remaining.length; i++) {
      const minDist = Math.min(...selected.map(s=>colorDistance(s,remaining[i])));
      if (minDist > bestDist) { bestDist=minDist; bestIdx=i; }
    }
    selected.push(remaining.splice(bestIdx,1)[0]);
  }
  return selected;
}

/* ============================================
   Lisp FOL Generator Helper
   ============================================ */
function makeLisp(name, slug, variants, tokens) {
  const varList = variants.map(v => `"${v}"`).join(', ');
  const clVariants = variants.map(v => `:${v.toLowerCase().replace(/\s+/g,'-')}`).join(' ');
  const schVariants = variants.map(v => `'${v.toLowerCase().replace(/\s+/g,'-')}`).join(' ');
  const cljVariants = variants.map(v => `:${v.toLowerCase().replace(/\s+/g,'-')}`).join(' ');
  const rktVariants = variants.map(v => `'${v.toLowerCase().replace(/\s+/g,'-')}`).join(' ');
  const tok = tokens || {bg:'primary', fg:'on-primary', height:40, minWidth:48};

  return {
    commonLisp:
`;; ${name} — First-Order Styling Predicates (Common Lisp)

(defun valid-${slug}-variant-p (variant)
  "Predicate: variant is a recognized ${name} style."
  (member variant '(${clVariants})))

(defun ${slug}-color-mapping (variant theme)
  "Maps ${name} variant to background/foreground color tokens."
  (cond
    ((eq variant :${(variants[0]||'default').toLowerCase().replace(/\s+/g,'-')})
     (list :bg (getf theme :${tok.bg})
           :fg (getf theme :${tok.fg})))
    ((eq variant :${(variants[1]||'alt').toLowerCase().replace(/\s+/g,'-')})
     (list :bg :transparent
           :fg (getf theme :primary)
           :border (getf theme :outline)))
    (t (list :bg (getf theme :surface)
             :fg (getf theme :on-surface)))))

(defun ${slug}-layout-constraint-p (${slug})
  "Predicate: ${name} meets M3 layout constraints."
  (let* ((h (getf ${slug} :height))
         (w (getf ${slug} :width))
         (r (getf ${slug} :border-radius)))
    (and (>= h ${tok.height})
         (>= w ${tok.minWidth})
         (>= r 0))))

(defun accessible-${slug}-p (${slug})
  "Predicate: ${name} meets WCAG accessibility requirements."
  (let* ((fg (getf ${slug} :foreground))
         (bg (getf ${slug} :background))
         (contrast (contrast-ratio fg bg))
         (target-size (getf ${slug} :touch-target)))
    (and (>= contrast 4.5)
         (>= target-size 48))))`,

    scheme:
`;; ${name} — First-Order Styling Predicates (Scheme)

(define (valid-${slug}-variant? variant)
  ;; Predicate: variant is a recognized ${name} style
  (member variant '(${schVariants})))

(define (${slug}-color-mapping variant theme)
  ;; Maps ${name} variant to color tokens from theme
  (cond
    ((eq? variant '${(variants[0]||'default').toLowerCase().replace(/\s+/g,'-')})
     (list (cons 'bg (theme-ref theme '${tok.bg}))
           (cons 'fg (theme-ref theme '${tok.fg}))))
    ((eq? variant '${(variants[1]||'alt').toLowerCase().replace(/\s+/g,'-')})
     (list (cons 'bg 'transparent)
           (cons 'fg (theme-ref theme 'primary))))
    (else
     (list (cons 'bg (theme-ref theme 'surface))
           (cons 'fg (theme-ref theme 'on-surface))))))

(define (${slug}-layout-valid? ${slug})
  ;; Predicate: ${name} meets M3 spatial constraints
  (and (>= (assoc-ref ${slug} 'height) ${tok.height})
       (>= (assoc-ref ${slug} 'width) ${tok.minWidth})))

(define (${slug}-accessible? ${slug})
  ;; Predicate: meets WCAG contrast and touch-target requirements
  (let ((contrast (contrast-ratio (assoc-ref ${slug} 'fg)
                                  (assoc-ref ${slug} 'bg)))
        (target (assoc-ref ${slug} 'touch-target)))
    (and (>= contrast 4.5)
         (>= target 48))))`,

    clojure:
`;; ${name} — First-Order Styling Predicates (Clojure)

(def ${slug}-variants #{${cljVariants}})

(defn valid-${slug}-variant?
  "Predicate: variant is a recognized ${name} style."
  [variant]
  (contains? ${slug}-variants variant))

(defn ${slug}-color-mapping
  "Maps ${name} variant to color tokens from theme."
  [variant theme]
  (case variant
    :${(variants[0]||'default').toLowerCase().replace(/\s+/g,'-')}
      {:bg (:${tok.bg} theme) :fg (:${tok.fg} theme)}
    :${(variants[1]||'alt').toLowerCase().replace(/\s+/g,'-')}
      {:bg :transparent :fg (:primary theme) :border (:outline theme)}
    {:bg (:surface theme) :fg (:on-surface theme)}))

(defn ${slug}-layout-valid?
  "Predicate: ${name} meets M3 layout constraints."
  [{:keys [height width]}]
  (and (>= height ${tok.height})
       (>= width ${tok.minWidth})))

(defn ${slug}-accessible?
  "Predicate: meets WCAG accessibility requirements."
  [{:keys [fg bg touch-target]}]
  (every? true?
    [(>= (contrast-ratio fg bg) 4.5)
     (>= touch-target 48)]))`,

    racket:
`;; ${name} — First-Order Styling Predicates (Racket)

(define/contract (valid-${slug}-variant? variant)
  (-> symbol? boolean?)
  (member variant '(${rktVariants})))

(define (${slug}-color-mapping variant theme)
  ;; Maps ${name} variant to color tokens
  (match variant
    ['${(variants[0]||'default').toLowerCase().replace(/\s+/g,'-')}
     (hash 'bg (hash-ref theme '${tok.bg})
           'fg (hash-ref theme '${tok.fg}))]
    ['${(variants[1]||'alt').toLowerCase().replace(/\s+/g,'-')}
     (hash 'bg 'transparent
           'fg (hash-ref theme 'primary))]
    [_ (hash 'bg (hash-ref theme 'surface)
             'fg (hash-ref theme 'on-surface))]))

(define/contract (${slug}-layout-valid? props)
  (-> hash? boolean?)
  (and (>= (hash-ref props 'height) ${tok.height})
       (>= (hash-ref props 'width) ${tok.minWidth})))

(define/contract (${slug}-accessible? props)
  (-> hash? boolean?)
  (for/and ([check (list
              (>= (contrast-ratio (hash-ref props 'fg)
                                  (hash-ref props 'bg)) 4.5)
              (>= (hash-ref props 'touch-target) 48))])
    check))`
  };
}

/* ============================================
   Component Registry (~20 M3 Components)
   ============================================ */
const COMPONENTS = [
  // ─── ACTIONS ───
  {
    id: 'button', name: 'Button', category: 'Actions', atomicLevel: 'atom',
    description: 'Buttons communicate actions that users can take. M3 buttons come in five variants for different levels of emphasis.',
    specs: [
      {property:'Height',value:'40px'},{property:'Min Width',value:'48px'},
      {property:'Border Radius',value:'20px (full)'},{property:'Padding',value:'10px 24px'},
      {property:'Font Size',value:'14px / label-large'},{property:'Font Weight',value:'600'}
    ],
    guidelines: [
      'Use filled buttons for the most important action on a screen.',
      'Outlined buttons are for medium-emphasis actions, usually paired with a filled button.',
      'Text buttons are for the least prominent actions, like in dialogs or cards.',
      'Tonal buttons fill the gap between filled and outlined for secondary actions.',
      'Always include meaningful label text. Avoid generic labels like "Click here".'
    ],
    variants: ['Filled','Outlined','Text','Tonal','Elevated'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Filled</div>
        <button class="m3-button m3-button-filled">Filled</button>
        <button class="m3-button m3-button-filled" disabled style="opacity:0.5;pointer-events:none">Disabled</button>
        <div class="demo-variant-label">Outlined</div>
        <button class="m3-button m3-button-outlined">Outlined</button>
        <div class="demo-variant-label">Text</div>
        <button class="m3-button m3-button-text">Text</button>
        <div class="demo-variant-label">Tonal</div>
        <button class="m3-button m3-button-tonal">Tonal</button>
        <div class="demo-variant-label">Elevated</div>
        <button class="m3-button m3-button-elevated">Elevated</button>`;
    },
    renderDemo() {
      return `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <button class="m3-button m3-button-filled" style="pointer-events:none">Button</button>
        <button class="m3-button m3-button-outlined" style="pointer-events:none">Outlined</button></div>`;
    },
    lisp: makeLisp('Button','button',['Filled','Outlined','Text','Tonal','Elevated'],{bg:'primary',fg:'on-primary',height:40,minWidth:48})
  },
  {
    id: 'fab', name: 'FAB', category: 'Actions', atomicLevel: 'atom',
    description: 'Floating Action Buttons represent the primary action on a screen. They come in small, regular, large, and extended sizes.',
    specs: [
      {property:'Size (default)',value:'56x56px'},{property:'Size (small)',value:'40x40px'},
      {property:'Size (large)',value:'96x96px'},{property:'Border Radius',value:'16px'},
      {property:'Elevation',value:'Level 3'},{property:'Icon Size',value:'24px'}
    ],
    guidelines: [
      'Use a FAB for the most common or important action on a screen.',
      'Only one FAB should appear on a screen at a time.',
      'Extended FABs include a text label for improved readability.',
      'Position FABs in the bottom-right corner of the viewport.'
    ],
    variants: ['Small','Regular','Large','Extended'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Small</div>
        <button class="m3-fab m3-fab-small">&#x2795;</button>
        <div class="demo-variant-label">Regular</div>
        <button class="m3-fab">&#x270E;</button>
        <div class="demo-variant-label">Large</div>
        <button class="m3-fab m3-fab-large" style="font-size:36px">&#x270E;</button>
        <div class="demo-variant-label">Extended</div>
        <button class="m3-fab m3-fab-extended">&#x270E; Compose</button>`;
    },
    renderDemo() {
      return `<button class="m3-fab" style="pointer-events:none">&#x270E;</button>`;
    },
    lisp: makeLisp('FAB','fab',['Small','Regular','Large','Extended'],{bg:'primary-container',fg:'on-primary-container',height:56,minWidth:56})
  },
  {
    id: 'icon-button', name: 'Icon Button', category: 'Actions', atomicLevel: 'atom',
    description: 'Icon buttons allow users to take actions with a single tap. They are used for toggle actions or less prominent actions.',
    specs: [
      {property:'Size',value:'40x40px'},{property:'Icon Size',value:'24px'},
      {property:'Border Radius',value:'20px (full)'},{property:'Touch Target',value:'48px'}
    ],
    guidelines: [
      'Use icon buttons for common actions like bookmarking, favoriting, or sharing.',
      'Provide a tooltip or label for accessibility.',
      'Use filled variant to indicate toggled-on state.',
      'Tonal variant provides more emphasis than standard.'
    ],
    variants: ['Standard','Filled','Tonal'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Standard</div>
        <button class="m3-icon-button">&#x2606;</button>
        <button class="m3-icon-button">&#x2665;</button>
        <button class="m3-icon-button">&#x21A9;</button>
        <div class="demo-variant-label">Filled</div>
        <button class="m3-icon-button m3-icon-button-filled">&#x2606;</button>
        <div class="demo-variant-label">Tonal</div>
        <button class="m3-icon-button m3-icon-button-tonal">&#x2606;</button>`;
    },
    renderDemo() {
      return `<div style="display:flex;gap:8px"><button class="m3-icon-button" style="pointer-events:none">&#x2606;</button><button class="m3-icon-button m3-icon-button-filled" style="pointer-events:none">&#x2665;</button></div>`;
    },
    lisp: makeLisp('Icon Button','icon-button',['Standard','Filled','Tonal'],{bg:'transparent',fg:'on-surface-variant',height:40,minWidth:40})
  },

  // ─── COMMUNICATION ───
  {
    id: 'badge', name: 'Badge', category: 'Communication', atomicLevel: 'atom',
    description: 'Badges convey dynamic information such as counts or status. They appear on icons, buttons, or other elements.',
    specs: [
      {property:'Dot Size',value:'8px'},{property:'Number Min Size',value:'16px'},
      {property:'Font Size',value:'11px'},{property:'Background',value:'error token'},
      {property:'Border Radius',value:'full'}
    ],
    guidelines: [
      'Use dot badges to indicate a generic notification without a count.',
      'Number badges show a specific count of pending items.',
      'Position badges at the top-right corner of the host element.',
      'Limit displayed numbers to 999+ for large counts.'
    ],
    variants: ['Dot','Number'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Dot Badge</div>
        <div style="position:relative;display:inline-block;padding:8px">
          <button class="m3-icon-button">&#x1F514;</button>
          <span class="m3-badge m3-badge-dot" style="position:absolute;top:8px;right:8px"></span>
        </div>
        <div class="demo-variant-label">Number Badge</div>
        <div style="position:relative;display:inline-block;padding:8px">
          <button class="m3-icon-button">&#x2709;</button>
          <span class="m3-badge" style="position:absolute;top:4px;right:4px">3</span>
        </div>
        <div style="position:relative;display:inline-block;padding:8px">
          <button class="m3-icon-button">&#x1F4E6;</button>
          <span class="m3-badge" style="position:absolute;top:4px;right:4px">99+</span>
        </div>`;
    },
    renderDemo() {
      return `<div style="display:flex;gap:16px;align-items:center"><span class="m3-badge m3-badge-dot"></span><span class="m3-badge">5</span><span class="m3-badge">99+</span></div>`;
    },
    lisp: makeLisp('Badge','badge',['Dot','Number'],{bg:'error',fg:'on-error',height:16,minWidth:8})
  },
  {
    id: 'progress', name: 'Progress Indicator', category: 'Communication', atomicLevel: 'atom',
    description: 'Progress indicators inform users about the status of ongoing processes such as loading, processing, or submitting.',
    specs: [
      {property:'Linear Height',value:'4px'},{property:'Circular Size',value:'48px'},
      {property:'Track Color',value:'surface-container-highest'},{property:'Active Color',value:'primary'}
    ],
    guidelines: [
      'Use linear indicators for page or section loading.',
      'Use circular indicators for loading states within components.',
      'Determinate indicators show progress percentage; indeterminate show ongoing activity.',
      'Avoid using multiple progress indicators simultaneously.'
    ],
    variants: ['Linear','Circular'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Linear (Determinate)</div>
        <div style="width:100%"><div class="m3-progress"><div class="m3-progress-bar" style="width:65%"></div></div></div>
        <div class="demo-variant-label">Linear (30%)</div>
        <div style="width:100%"><div class="m3-progress"><div class="m3-progress-bar" style="width:30%"></div></div></div>
        <div class="demo-variant-label">Circular (Indeterminate)</div>
        <div class="m3-progress-circular"></div>`;
    },
    renderDemo() {
      return `<div style="width:80%"><div class="m3-progress"><div class="m3-progress-bar" style="width:60%"></div></div></div>`;
    },
    lisp: makeLisp('Progress','progress',['Linear','Circular'],{bg:'surface-container-highest',fg:'primary',height:4,minWidth:100})
  },
  {
    id: 'snackbar', name: 'Snackbar', category: 'Communication', atomicLevel: 'molecule',
    description: 'Snackbars provide brief messages about app processes at the bottom of the screen. They can include an optional action.',
    specs: [
      {property:'Min Width',value:'288px'},{property:'Max Width',value:'568px'},
      {property:'Padding',value:'14px 16px'},{property:'Border Radius',value:'4px'},
      {property:'Elevation',value:'Level 3'},{property:'Duration',value:'4-10 seconds'}
    ],
    guidelines: [
      'Snackbars appear temporarily and should not block user interaction.',
      'Include an action button for undoable operations.',
      'Only one snackbar should be displayed at a time.',
      'Keep messages short and actionable.'
    ],
    variants: ['Basic','With Action'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Basic</div>
        <div class="m3-snackbar">File has been deleted</div>
        <div class="demo-variant-label">With Action</div>
        <div class="m3-snackbar">Email archived <button class="m3-snackbar-action">Undo</button></div>
        <div class="demo-variant-label">With Close</div>
        <div class="m3-snackbar">Settings saved <button class="m3-snackbar-action">Undo</button> <span style="cursor:pointer;opacity:0.7;margin-left:8px">&#x2716;</span></div>`;
    },
    renderDemo() {
      return `<div class="m3-snackbar" style="font-size:12px;pointer-events:none">Message sent <button class="m3-snackbar-action" style="font-size:12px">Undo</button></div>`;
    },
    lisp: makeLisp('Snackbar','snackbar',['Basic','With Action'],{bg:'inverse-surface',fg:'inverse-on-surface',height:48,minWidth:288})
  },
  {
    id: 'tooltip', name: 'Tooltip', category: 'Communication', atomicLevel: 'atom',
    description: 'Tooltips display informative text when users hover over or focus on an element. They help clarify the function of icon buttons.',
    specs: [
      {property:'Padding',value:'4px 8px'},{property:'Font Size',value:'12px'},
      {property:'Border Radius',value:'4px'},{property:'Background',value:'inverse-surface'}
    ],
    guidelines: [
      'Use tooltips to describe icon-only buttons.',
      'Keep tooltip text short (one or two words).',
      'Tooltips should appear after a short delay (400ms).',
      'Never put essential information only in tooltips.'
    ],
    variants: ['Plain'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Plain Tooltip</div>
        <div class="m3-tooltip">Save</div>
        <div class="m3-tooltip">Delete</div>
        <div class="m3-tooltip">Share this item</div>
        <div class="demo-variant-label">With Host Element</div>
        <div style="position:relative;display:inline-flex;flex-direction:column;align-items:center;gap:4px">
          <div class="m3-tooltip">Favorite</div>
          <button class="m3-icon-button">&#x2665;</button>
        </div>`;
    },
    renderDemo() {
      return `<div class="m3-tooltip" style="pointer-events:none">Tooltip</div>`;
    },
    lisp: makeLisp('Tooltip','tooltip',['Plain'],{bg:'inverse-surface',fg:'inverse-on-surface',height:24,minWidth:32})
  },

  // ─── CONTAINMENT ───
  {
    id: 'card', name: 'Card', category: 'Containment', atomicLevel: 'molecule',
    description: 'Cards contain related content and actions about a single subject. They come in elevated, filled, and outlined variants.',
    specs: [
      {property:'Border Radius',value:'12px'},{property:'Padding',value:'16px'},
      {property:'Elevation (elevated)',value:'Level 1'},{property:'Border (outlined)',value:'1px outline-variant'}
    ],
    guidelines: [
      'Use elevated cards as the default for most content.',
      'Outlined cards work well in dense layouts to reduce visual noise.',
      'Filled cards are for grouping content on lighter backgrounds.',
      'Cards should be self-contained — users should understand the content without context.'
    ],
    variants: ['Elevated','Filled','Outlined'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Elevated</div>
        <div class="m3-card m3-card-elevated" style="max-width:280px">
          <div class="m3-card-media"></div>
          <div class="m3-card-content"><h3>Elevated Card</h3><p>Cards contain content and actions about a single subject.</p></div>
          <div class="m3-card-actions"><button class="m3-button m3-button-text">Cancel</button><button class="m3-button m3-button-filled">Action</button></div>
        </div>
        <div class="demo-variant-label">Filled</div>
        <div class="m3-card m3-card-filled" style="max-width:280px">
          <div class="m3-card-content"><h3>Filled Card</h3><p>Uses a filled surface color for the background.</p></div>
        </div>
        <div class="demo-variant-label">Outlined</div>
        <div class="m3-card m3-card-outlined" style="max-width:280px">
          <div class="m3-card-content"><h3>Outlined Card</h3><p>Uses a border instead of elevation for separation.</p></div>
        </div>`;
    },
    renderDemo() {
      return `<div class="m3-card m3-card-elevated" style="width:90%;pointer-events:none"><div class="m3-card-media" style="height:60px"></div><div class="m3-card-content" style="padding:8px"><h3 style="font-size:13px">Card</h3><p style="font-size:11px">Content preview</p></div></div>`;
    },
    lisp: makeLisp('Card','card',['Elevated','Filled','Outlined'],{bg:'surface-container-low',fg:'on-surface',height:48,minWidth:120})
  },
  {
    id: 'dialog', name: 'Dialog', category: 'Containment', atomicLevel: 'organism',
    description: 'Dialogs provide important prompts in a user flow. They require user interaction before they can be dismissed.',
    specs: [
      {property:'Min Width',value:'280px'},{property:'Max Width',value:'560px'},
      {property:'Border Radius',value:'28px'},{property:'Padding',value:'24px'},
      {property:'Elevation',value:'Level 3'},{property:'Surface',value:'surface-container-high'}
    ],
    guidelines: [
      'Use dialogs sparingly — they interrupt the user flow.',
      'Always provide at least one action button to dismiss.',
      'Dialog titles should clearly state the purpose.',
      'Avoid scrolling content within dialogs when possible.'
    ],
    variants: ['Basic','Confirmation'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Basic Dialog</div>
        <div class="m3-dialog">
          <div class="m3-dialog-title">Reset settings?</div>
          <div class="m3-dialog-content">This will restore all settings to their default values. This action cannot be undone.</div>
          <div class="m3-dialog-actions">
            <button class="m3-button m3-button-text">Cancel</button>
            <button class="m3-button m3-button-filled">Reset</button>
          </div>
        </div>`;
    },
    renderDemo() {
      return `<div class="m3-dialog" style="max-width:200px;padding:12px;pointer-events:none"><div class="m3-dialog-title" style="font-size:14px">Dialog</div><div class="m3-dialog-content" style="font-size:11px;margin-bottom:8px">Content</div><div class="m3-dialog-actions"><button class="m3-button m3-button-text" style="font-size:11px;padding:4px 8px">OK</button></div></div>`;
    },
    lisp: makeLisp('Dialog','dialog',['Basic','Confirmation'],{bg:'surface-container-high',fg:'on-surface',height:200,minWidth:280})
  },
  {
    id: 'divider', name: 'Divider', category: 'Containment', atomicLevel: 'atom',
    description: 'Dividers are thin lines that separate content into clear groups. They can be full-width or inset.',
    specs: [
      {property:'Height',value:'1px'},{property:'Color',value:'outline-variant'},
      {property:'Full Bleed',value:'No padding'},{property:'Inset',value:'16px left padding'}
    ],
    guidelines: [
      'Use dividers to create visual grouping of related items.',
      'Avoid overusing dividers — use spacing when possible.',
      'Inset dividers indicate connected content above and below.',
      'Full-width dividers indicate distinct content sections.'
    ],
    variants: ['Full Width','Inset'],
    render(el) {
      el.innerHTML = `
        <div style="width:100%">
          <div class="demo-variant-label">Full Width</div>
          <p style="padding:8px 0;font-size:var(--fs-body-md);color:var(--md-on-surface-variant)">Content above</p>
          <div class="m3-divider"></div>
          <p style="padding:8px 0;font-size:var(--fs-body-md);color:var(--md-on-surface-variant)">Content below</p>
          <div class="demo-variant-label">Inset</div>
          <p style="padding:8px 0;font-size:var(--fs-body-md);color:var(--md-on-surface-variant)">Content above</p>
          <div class="m3-divider" style="margin-left:16px"></div>
          <p style="padding:8px 0;font-size:var(--fs-body-md);color:var(--md-on-surface-variant)">Content below</p>
        </div>`;
    },
    renderDemo() {
      return `<div style="width:80%;display:flex;flex-direction:column;gap:8px;align-items:center"><span style="font-size:11px;color:var(--md-on-surface-variant)">Above</span><div class="m3-divider"></div><span style="font-size:11px;color:var(--md-on-surface-variant)">Below</span></div>`;
    },
    lisp: makeLisp('Divider','divider',['Full Width','Inset'],{bg:'outline-variant',fg:'outline-variant',height:1,minWidth:48})
  },

  // ─── NAVIGATION ───
  {
    id: 'navbar', name: 'Navigation Bar', category: 'Navigation', atomicLevel: 'molecule',
    description: 'Navigation bars let users switch between primary destinations. They appear at the bottom of the screen on mobile.',
    specs: [
      {property:'Height',value:'80px'},{property:'Items',value:'3-5'},
      {property:'Icon Size',value:'24px'},{property:'Label Size',value:'12px'},
      {property:'Indicator',value:'secondary-container'}
    ],
    guidelines: [
      'Use 3 to 5 top-level destinations.',
      'Keep labels short (one word preferred).',
      'Highlight the active destination with an indicator pill.',
      'Navigation bars are for mobile; use navigation rails on larger screens.'
    ],
    variants: ['3 Items','4 Items'],
    render(el) {
      el.innerHTML = `
        <div style="width:100%;max-width:400px">
          <div class="m3-navbar">
            <button class="m3-navbar-item active" onclick="navbarSelect(this)"><div class="m3-navbar-indicator">&#x1F3E0;</div><span>Home</span></button>
            <button class="m3-navbar-item" onclick="navbarSelect(this)"><div class="m3-navbar-indicator">&#x1F50D;</div><span>Search</span></button>
            <button class="m3-navbar-item" onclick="navbarSelect(this)"><div class="m3-navbar-indicator">&#x2665;</div><span>Favorites</span></button>
            <button class="m3-navbar-item" onclick="navbarSelect(this)"><div class="m3-navbar-indicator">&#x1F464;</div><span>Profile</span></button>
          </div>
        </div>`;
    },
    renderDemo() {
      return `<div class="m3-navbar" style="width:90%;pointer-events:none;font-size:10px"><div class="m3-navbar-item active"><div class="m3-navbar-indicator">&#x1F3E0;</div><span>Home</span></div><div class="m3-navbar-item"><div class="m3-navbar-indicator">&#x1F50D;</div><span>Search</span></div><div class="m3-navbar-item"><div class="m3-navbar-indicator">&#x1F464;</div><span>Profile</span></div></div>`;
    },
    lisp: makeLisp('Navigation Bar','navbar',['3 Items','4 Items'],{bg:'surface-container',fg:'on-surface-variant',height:80,minWidth:320})
  },
  {
    id: 'navrail', name: 'Navigation Rail', category: 'Navigation', atomicLevel: 'molecule',
    description: 'Navigation rails provide access to primary destinations on tablet and desktop layouts. They sit on the left side of the screen.',
    specs: [
      {property:'Width',value:'80px'},{property:'Icon Size',value:'24px'},
      {property:'Alignment',value:'Top or Center'},{property:'FAB Support',value:'Optional top FAB'}
    ],
    guidelines: [
      'Use navigation rails on medium-to-large screens.',
      'Include 3 to 7 destinations.',
      'An optional FAB can be placed at the top of the rail.',
      'Match destinations with the navigation bar for responsive consistency.'
    ],
    variants: ['Standard','With FAB'],
    render(el) {
      el.innerHTML = `
        <div class="m3-navrail">
          <button class="m3-fab m3-fab-small" style="margin-bottom:8px">&#x270E;</button>
          <button class="m3-navrail-item active" onclick="navrailSelect(this)"><div class="m3-navbar-indicator">&#x1F3E0;</div><span>Home</span></button>
          <button class="m3-navrail-item" onclick="navrailSelect(this)"><div class="m3-navbar-indicator">&#x1F50D;</div><span>Search</span></button>
          <button class="m3-navrail-item" onclick="navrailSelect(this)"><div class="m3-navbar-indicator">&#x2665;</div><span>Favs</span></button>
        </div>`;
    },
    renderDemo() {
      return `<div class="m3-navrail" style="width:60px;pointer-events:none;font-size:10px"><div class="m3-navrail-item active"><div class="m3-navbar-indicator">&#x1F3E0;</div><span>Home</span></div><div class="m3-navrail-item"><div class="m3-navbar-indicator">&#x1F50D;</div><span>Find</span></div></div>`;
    },
    lisp: makeLisp('Navigation Rail','navrail',['Standard','With FAB'],{bg:'surface-container',fg:'on-surface-variant',height:300,minWidth:80})
  },
  {
    id: 'tabs', name: 'Tabs', category: 'Navigation', atomicLevel: 'molecule',
    description: 'Tabs organize content across different screens or data sets. They allow users to navigate between groups of related content.',
    specs: [
      {property:'Height',value:'48px'},{property:'Indicator Height',value:'3px'},
      {property:'Font Size',value:'14px / title-small'},{property:'Active Color',value:'primary'}
    ],
    guidelines: [
      'Use tabs for peer content that is related but distinct.',
      'Present tabs in a single row — never stack vertically.',
      'Keep tab labels short and descriptive.',
      'The active tab indicator should be clearly visible.'
    ],
    variants: ['Primary','Secondary'],
    render(el) {
      el.innerHTML = `
        <div style="width:100%;max-width:400px">
          <div class="demo-variant-label">Primary Tabs</div>
          <div class="m3-tabs">
            <button class="m3-tab active" onclick="tabSelect(this)">Tab One</button>
            <button class="m3-tab" onclick="tabSelect(this)">Tab Two</button>
            <button class="m3-tab" onclick="tabSelect(this)">Tab Three</button>
          </div>
        </div>`;
    },
    renderDemo() {
      return `<div class="m3-tabs" style="width:90%;pointer-events:none;font-size:11px"><div class="m3-tab active">One</div><div class="m3-tab">Two</div><div class="m3-tab">Three</div></div>`;
    },
    lisp: makeLisp('Tabs','tabs',['Primary','Secondary'],{bg:'surface',fg:'on-surface-variant',height:48,minWidth:90})
  },
  {
    id: 'topbar', name: 'Top App Bar', category: 'Navigation', atomicLevel: 'organism',
    description: 'Top app bars display navigation, title, and actions related to the current screen at the top of the viewport.',
    specs: [
      {property:'Height',value:'64px'},{property:'Padding',value:'8px 16px'},
      {property:'Title Size',value:'22px / title-large'},{property:'Icon Size',value:'24px'}
    ],
    guidelines: [
      'Use a leading navigation icon (menu or back arrow).',
      'Display the current screen title prominently.',
      'Place up to 3 action icons on the trailing side.',
      'On scroll, the top bar can compress to a smaller variant.'
    ],
    variants: ['Small','Medium'],
    render(el) {
      el.innerHTML = `
        <div style="width:100%">
          <div class="demo-variant-label">Small Top App Bar</div>
          <div class="m3-topbar">
            <button class="m3-icon-button">&#x2190;</button>
            <span class="m3-topbar-title">Page Title</span>
            <button class="m3-icon-button">&#x2699;</button>
            <button class="m3-icon-button">&#x22EE;</button>
          </div>
        </div>`;
    },
    renderDemo() {
      return `<div class="m3-topbar" style="width:90%;pointer-events:none;padding:4px 8px"><span style="font-size:12px">&#x2190;</span><span class="m3-topbar-title" style="font-size:13px">Title</span><span style="font-size:12px">&#x2699;</span></div>`;
    },
    lisp: makeLisp('Top App Bar','topbar',['Small','Medium'],{bg:'surface',fg:'on-surface',height:64,minWidth:320})
  },

  // ─── SELECTION ───
  {
    id: 'checkbox', name: 'Checkbox', category: 'Selection', atomicLevel: 'atom',
    description: 'Checkboxes allow users to select one or more items from a list, or toggle a single option on/off.',
    specs: [
      {property:'Size',value:'20x20px'},{property:'Touch Target',value:'48px'},
      {property:'Border Width',value:'2px'},{property:'Active Color',value:'primary'},
      {property:'Check Mark',value:'on-primary'}
    ],
    guidelines: [
      'Use checkboxes for multi-select scenarios.',
      'Each checkbox should work independently.',
      'Always pair with a label for accessibility.',
      'Use indeterminate state for partial selections.'
    ],
    variants: ['Unchecked','Checked'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Interactive Checkboxes</div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <label style="display:flex;align-items:center;gap:12px;cursor:pointer" onclick="this.querySelector('.m3-checkbox').classList.toggle('checked')">
            <div class="m3-checkbox checked">&#x2713;</div><span>Option A (checked)</span>
          </label>
          <label style="display:flex;align-items:center;gap:12px;cursor:pointer" onclick="this.querySelector('.m3-checkbox').classList.toggle('checked')">
            <div class="m3-checkbox">&#x2713;</div><span>Option B</span>
          </label>
          <label style="display:flex;align-items:center;gap:12px;cursor:pointer" onclick="this.querySelector('.m3-checkbox').classList.toggle('checked')">
            <div class="m3-checkbox">&#x2713;</div><span>Option C</span>
          </label>
        </div>`;
    },
    renderDemo() {
      return `<div style="display:flex;gap:8px;align-items:center"><div class="m3-checkbox checked" style="pointer-events:none">&#x2713;</div><div class="m3-checkbox" style="pointer-events:none"></div></div>`;
    },
    lisp: makeLisp('Checkbox','checkbox',['Unchecked','Checked'],{bg:'primary',fg:'on-primary',height:20,minWidth:20})
  },
  {
    id: 'chip', name: 'Chip', category: 'Selection', atomicLevel: 'atom',
    description: 'Chips help users enter information, make selections, filter content, or trigger actions in a compact form.',
    specs: [
      {property:'Height',value:'32px'},{property:'Border Radius',value:'8px'},
      {property:'Padding',value:'6px 16px'},{property:'Font Size',value:'14px / label-large'},
      {property:'Selected Background',value:'secondary-container'}
    ],
    guidelines: [
      'Filter chips allow users to narrow content from a set of options.',
      'Input chips represent user-entered information.',
      'Assist chips offer smart suggestions for user tasks.',
      'Chips can be dismissible with a trailing close icon.'
    ],
    variants: ['Assist','Filter','Input'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Filter Chips (Interactive)</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="m3-chip selected" onclick="this.classList.toggle('selected')">&#x2713; Active</button>
          <button class="m3-chip" onclick="this.classList.toggle('selected')">Draft</button>
          <button class="m3-chip" onclick="this.classList.toggle('selected')">Archived</button>
          <button class="m3-chip" onclick="this.classList.toggle('selected')">Shared</button>
        </div>
        <div class="demo-variant-label">Assist Chips</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="m3-chip">&#x1F4CD; Directions</button>
          <button class="m3-chip">&#x260E; Call</button>
        </div>`;
    },
    renderDemo() {
      return `<div style="display:flex;gap:6px"><span class="m3-chip selected" style="pointer-events:none;font-size:11px;padding:4px 10px">Filter</span><span class="m3-chip" style="pointer-events:none;font-size:11px;padding:4px 10px">Chip</span></div>`;
    },
    lisp: makeLisp('Chip','chip',['Assist','Filter','Input'],{bg:'transparent',fg:'on-surface-variant',height:32,minWidth:48})
  },
  {
    id: 'radio', name: 'Radio Button', category: 'Selection', atomicLevel: 'atom',
    description: 'Radio buttons let users select exactly one option from a set of mutually exclusive choices.',
    specs: [
      {property:'Size',value:'20x20px'},{property:'Touch Target',value:'48px'},
      {property:'Border Width',value:'2px'},{property:'Active Color',value:'primary'},
      {property:'Inner Dot',value:'10px'}
    ],
    guidelines: [
      'Use radio buttons when only one option can be selected.',
      'Always provide at least two options.',
      'One option should be selected by default when possible.',
      'Group related radio buttons vertically for readability.'
    ],
    variants: ['Unselected','Selected'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Radio Group (Interactive)</div>
        <div style="display:flex;flex-direction:column;gap:12px" id="radioGroup">
          <label style="display:flex;align-items:center;gap:12px;cursor:pointer" onclick="radioSelect(this)">
            <div class="m3-radio selected"></div><span>Option Alpha</span>
          </label>
          <label style="display:flex;align-items:center;gap:12px;cursor:pointer" onclick="radioSelect(this)">
            <div class="m3-radio"></div><span>Option Beta</span>
          </label>
          <label style="display:flex;align-items:center;gap:12px;cursor:pointer" onclick="radioSelect(this)">
            <div class="m3-radio"></div><span>Option Gamma</span>
          </label>
        </div>`;
    },
    renderDemo() {
      return `<div style="display:flex;gap:8px;align-items:center"><div class="m3-radio selected" style="pointer-events:none"></div><div class="m3-radio" style="pointer-events:none"></div></div>`;
    },
    lisp: makeLisp('Radio Button','radio',['Unselected','Selected'],{bg:'primary',fg:'primary',height:20,minWidth:20})
  },
  {
    id: 'slider', name: 'Slider', category: 'Selection', atomicLevel: 'atom',
    description: 'Sliders allow users to make selections from a range of values by moving a thumb along a track.',
    specs: [
      {property:'Track Height',value:'4px'},{property:'Thumb Size',value:'20px'},
      {property:'Active Color',value:'primary'},{property:'Track Color',value:'surface-container-highest'},
      {property:'Touch Target',value:'48px'}
    ],
    guidelines: [
      'Use sliders for numeric ranges where exact values are less important.',
      'Show the current value near the thumb for clarity.',
      'Define clear minimum and maximum values.',
      'For precise input, pair with a text field.'
    ],
    variants: ['Continuous','Discrete'],
    render(el) {
      el.innerHTML = `
        <div style="width:100%;max-width:300px">
          <div class="demo-variant-label">Continuous Slider</div>
          <div class="m3-slider">
            <div class="m3-slider-track" style="width:60%"></div>
            <div class="m3-slider-thumb" style="left:60%"></div>
          </div>
          <div class="demo-variant-label" style="margin-top:24px">Another Value</div>
          <div class="m3-slider">
            <div class="m3-slider-track" style="width:30%"></div>
            <div class="m3-slider-thumb" style="left:30%"></div>
          </div>
        </div>`;
    },
    renderDemo() {
      return `<div style="width:80%"><div class="m3-slider" style="pointer-events:none"><div class="m3-slider-track" style="width:50%"></div><div class="m3-slider-thumb" style="left:50%"></div></div></div>`;
    },
    lisp: makeLisp('Slider','slider',['Continuous','Discrete'],{bg:'surface-container-highest',fg:'primary',height:20,minWidth:120})
  },
  {
    id: 'switch', name: 'Switch', category: 'Selection', atomicLevel: 'atom',
    description: 'Switches toggle the state of a single setting on or off. They are the preferred way to adjust binary settings.',
    specs: [
      {property:'Track Size',value:'52x32px'},{property:'Thumb (off)',value:'16px'},
      {property:'Thumb (on)',value:'24px'},{property:'Active Color',value:'primary'},
      {property:'Touch Target',value:'48px'}
    ],
    guidelines: [
      'Use switches for binary settings that take effect immediately.',
      'Always pair with a descriptive label.',
      'The on state should be visually distinct from off.',
      'Avoid using switches for actions that require confirmation.'
    ],
    variants: ['Off','On'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Interactive Switches</div>
        <div style="display:flex;flex-direction:column;gap:16px">
          <label style="display:flex;align-items:center;gap:16px;cursor:pointer">
            <div class="m3-switch on" onclick="event.stopPropagation();this.classList.toggle('on')"></div>
            <span>Wi-Fi (on)</span>
          </label>
          <label style="display:flex;align-items:center;gap:16px;cursor:pointer">
            <div class="m3-switch" onclick="event.stopPropagation();this.classList.toggle('on')"></div>
            <span>Bluetooth (off)</span>
          </label>
          <label style="display:flex;align-items:center;gap:16px;cursor:pointer">
            <div class="m3-switch on" onclick="event.stopPropagation();this.classList.toggle('on')"></div>
            <span>Dark mode (on)</span>
          </label>
        </div>`;
    },
    renderDemo() {
      return `<div style="display:flex;gap:8px"><div class="m3-switch on" style="pointer-events:none"></div><div class="m3-switch" style="pointer-events:none"></div></div>`;
    },
    lisp: makeLisp('Switch','switch',['Off','On'],{bg:'primary',fg:'on-primary',height:32,minWidth:52})
  },

  // ─── TEXT INPUT ───
  {
    id: 'textfield', name: 'Text Field', category: 'Text Input', atomicLevel: 'molecule',
    description: 'Text fields let users enter and edit text. They come in filled and outlined variants with floating labels.',
    specs: [
      {property:'Height',value:'56px'},{property:'Border Radius (filled)',value:'4px 4px 0 0'},
      {property:'Border Radius (outlined)',value:'4px'},{property:'Label Size',value:'12px (focused)'},
      {property:'Input Size',value:'16px / body-large'},{property:'Active Indicator',value:'primary'}
    ],
    guidelines: [
      'Use filled text fields by default in most contexts.',
      'Outlined text fields work well in dense forms.',
      'Always include a floating label for context.',
      'Show helper text below the field for additional guidance.',
      'Use error state with red indicator for validation failures.'
    ],
    variants: ['Filled','Outlined'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Filled</div>
        <div class="m3-textfield"><label>Username</label><input type="text" value="john_doe"></div>
        <div class="m3-textfield"><label>Email</label><input type="email" placeholder="Enter email"></div>
        <div class="demo-variant-label">Outlined</div>
        <div class="m3-textfield m3-textfield-outlined"><label>Search</label><input type="text" placeholder="Type to search..."></div>`;
    },
    renderDemo() {
      return `<div class="m3-textfield" style="pointer-events:none"><label>Label</label><input type="text" value="Text field"></div>`;
    },
    lisp: makeLisp('Text Field','textfield',['Filled','Outlined'],{bg:'surface-container-highest',fg:'on-surface',height:56,minWidth:200})
  },
];

/* ============================================
   Interactive Demo Helpers
   ============================================ */
function navbarSelect(el) {
  el.closest('.m3-navbar').querySelectorAll('.m3-navbar-item').forEach(i=>i.classList.remove('active'));
  el.classList.add('active');
}

function navrailSelect(el) {
  el.closest('.m3-navrail').querySelectorAll('.m3-navrail-item').forEach(i=>i.classList.remove('active'));
  el.classList.add('active');
}

function tabSelect(el) {
  el.closest('.m3-tabs').querySelectorAll('.m3-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
}

function radioSelect(label) {
  const group = label.parentElement;
  group.querySelectorAll('.m3-radio').forEach(r=>r.classList.remove('selected'));
  label.querySelector('.m3-radio').classList.add('selected');
}

/* ============================================
   Syntax Highlighting
   ============================================ */
function highlightLisp(code) {
  // Escape HTML
  let html = code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  // Comments
  html = html.replace(/(;[^\n]*)/g, '<span class="comment">$1</span>');
  // Strings
  html = html.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="string">$1</span>');
  // Keywords/special forms
  const keywords = ['defun','defn','define','define/contract','defmacro','let','let\\*','letfn','lambda','fn','cond','case','match','if','when','unless','and','or','not','do','loop','for','for/and','for/list','require','provide','import','ns','in-package','defpackage','declare','->','->>'];
  const kwRegex = new RegExp('(?<=\\(|\\s)(' + keywords.join('|').replace(/[*+?]/g,'\\$&') + ')(?=\\s|\\))', 'g');
  html = html.replace(kwRegex, '<span class="keyword">$1</span>');
  // Builtins
  const builtins = ['list','cons','car','cdr','map','filter','reduce','apply','values','hash-map','vector','assoc','get','first','rest','println','display','format','printf','every\\?','some\\?','member','eq','eql','equal','>=','<=','>','<','=','/=','\\+','-','\\*','/','null\\?','nil\\?','empty\\?','zero\\?','number\\?','string\\?','boolean\\?','pair\\?','list\\?','struct','defstruct','class'];
  const biRegex = new RegExp('(?<=\\(|\\s)(' + builtins.join('|') + ')(?=\\s|\\))', 'g');
  html = html.replace(biRegex, '<span class="builtin">$1</span>');
  // Symbols/keywords
  html = html.replace(/(:[a-zA-Z_-][a-zA-Z0-9_-]*)/g, '<span class="symbol">$1</span>');
  // Numbers
  html = html.replace(/(?<=\s|[\(\)])(\d+\.?\d*)/g, '<span class="number">$1</span>');
  // Rainbow parens
  let depth = 0;
  html = html.replace(/[()]/g, (ch) => {
    if (ch === '(') { const cls = `paren-${depth % 5}`; depth++; return `<span class="${cls}">(</span>`; }
    else { depth = Math.max(0, depth-1); return `<span class="paren-${depth % 5}">)</span>`; }
  });
  return html;
}

/* ============================================
   Router
   ============================================ */
function getRoute() {
  const hash = location.hash || '#/components';
  const parts = hash.slice(2).split('/');
  return { path: parts[0] || 'components', param: parts[1] || null };
}

function navigate(hash) {
  location.hash = hash;
}

function initRouter() {
  window.addEventListener('hashchange', () => renderRoute());
  renderRoute();
}

function renderRoute() {
  const {path, param} = getRoute();
  const content = document.getElementById('content');
  content.style.animation = 'none';
  content.offsetHeight; // trigger reflow
  content.style.animation = 'fadeIn var(--transition-medium)';

  updateActiveNav(path, param);

  switch(path) {
    case 'components': renderComponentsOverview(content); break;
    case 'component': renderComponentDetail(content, param); break;
    case 'atomic-design': renderAtomicDesign(content); break;
    case 'theme': renderThemePage(content); break;
    default: renderComponentsOverview(content);
  }
}

function updateActiveNav(path, param) {
  document.querySelectorAll('.nav-link, .nav-component-link').forEach(el => el.classList.remove('active'));
  if (path === 'components' || path === 'component') {
    document.querySelector('[data-route="components"]')?.classList.add('active');
  }
  document.querySelector(`[data-route="${path}"]`)?.classList.add('active');
  if (param) {
    document.querySelector(`[data-component="${param}"]`)?.classList.add('active');
  }
}

function populateSidebar() {
  const container = document.getElementById('categoryLinks');
  const categories = [...new Set(COMPONENTS.map(c=>c.category))];
  let html = '';
  for (const cat of categories) {
    html += `<div class="nav-category-label">${cat}</div>`;
    const comps = COMPONENTS.filter(c=>c.category===cat);
    for (const comp of comps) {
      html += `<a href="#/component/${comp.id}" class="nav-component-link" data-component="${comp.id}">${comp.name}</a>`;
    }
  }
  container.innerHTML = html;
}

/* ============================================
   Components Overview Page
   ============================================ */
function renderComponentsOverview(container) {
  const categories = [...new Set(COMPONENTS.map(c=>c.category))];
  let html = `
    <div class="page-header">
      <h1 class="page-title">Components</h1>
      <p class="page-description">Explore Material 3 components with live demos, styling logic expressed as first-order predicates in Lisp, and atomic design classification.</p>
    </div>
    <div class="filter-bar" id="filterBar"></div>
  `;
  for (const cat of categories) {
    const comps = COMPONENTS.filter(c=>c.category===cat);
    html += `<div class="category-group"><h2 class="category-title">${cat}</h2><div class="card-grid">`;
    for (const comp of comps) {
      html += `
        <div class="card" tabindex="0" onclick="navigate('#/component/${comp.id}')" onkeydown="if(event.key==='Enter')navigate('#/component/${comp.id}')">
          <div class="card-demo">${comp.renderDemo()}</div>
          <div class="card-body">
            <div class="card-meta">
              <span class="badge badge-${comp.atomicLevel}">${comp.atomicLevel}</span>
            </div>
            <h3 class="card-title">${comp.name}</h3>
            <p class="card-description">${comp.description}</p>
          </div>
        </div>`;
    }
    html += '</div></div>';
  }
  container.innerHTML = html;
}

/* ============================================
   Component Detail Page
   ============================================ */
function renderComponentDetail(container, id) {
  const comp = COMPONENTS.find(c=>c.id===id);
  if (!comp) { container.innerHTML = '<p>Component not found.</p>'; return; }

  const dialects = [
    {key:'commonLisp', label:'Common Lisp'},
    {key:'scheme', label:'Scheme'},
    {key:'clojure', label:'Clojure'},
    {key:'racket', label:'Racket'}
  ];

  let specsHtml = '';
  if (comp.specs && comp.specs.length) {
    specsHtml = `<h2 class="demo-section-title">Specifications</h2><table class="specs-table"><thead><tr><th>Property</th><th>Value</th></tr></thead><tbody>`;
    for (const s of comp.specs) specsHtml += `<tr><td>${s.property}</td><td>${s.value}</td></tr>`;
    specsHtml += '</tbody></table>';
  }

  let guidelinesHtml = '';
  if (comp.guidelines && comp.guidelines.length) {
    guidelinesHtml = `<h2 class="demo-section-title">Usage Guidelines</h2><ul class="guidelines-list">`;
    for (const g of comp.guidelines) guidelinesHtml += `<li>${g}</li>`;
    guidelinesHtml += '</ul>';
  }

  let tabsHtml = '<div class="code-tabs">';
  for (let i=0; i<dialects.length; i++) {
    tabsHtml += `<button class="code-tab${i===0?' active':''}" data-dialect="${dialects[i].key}" onclick="switchCodeTab(this)">${dialects[i].label}</button>`;
  }
  tabsHtml += '</div>';

  let codeBlocksHtml = '';
  for (let i=0; i<dialects.length; i++) {
    const code = comp.lisp[dialects[i].key] || '; No code available';
    codeBlocksHtml += `<div class="code-block-wrapper" data-dialect="${dialects[i].key}" style="${i>0?'display:none':''}">
      <button class="copy-button" onclick="copyCode(this)">Copy</button>
      <pre class="code-block">${highlightLisp(code)}</pre>
    </div>`;
  }

  container.innerHTML = `
    <div class="detail-page">
      <a href="#/components" class="back-button">&larr; All Components</a>
      <div class="detail-hero">
        <h1>${comp.name}</h1>
        <span class="badge badge-${comp.atomicLevel}">${comp.atomicLevel}</span>
        <span class="badge badge-category">${comp.category}</span>
      </div>
      <p class="page-description" style="margin-bottom:var(--space-xl)">${comp.description}</p>
      <div class="demo-section">
        <h2 class="demo-section-title">Live Demo</h2>
        <div class="demo-area" id="demoArea"></div>
      </div>
      ${specsHtml}
      ${guidelinesHtml}
      <div class="code-section">
        <h2 class="demo-section-title">Styling Logic (First-Order Predicates)</h2>
        ${tabsHtml}
        ${codeBlocksHtml}
      </div>
    </div>
  `;

  const demoArea = document.getElementById('demoArea');
  comp.render(demoArea);
}

function switchCodeTab(tab) {
  const section = tab.closest('.code-section') || tab.closest('.detail-page');
  section.querySelectorAll('.code-tab').forEach(t=>t.classList.remove('active'));
  tab.classList.add('active');
  const dialect = tab.dataset.dialect;
  section.querySelectorAll('.code-block-wrapper').forEach(b=>{
    b.style.display = b.dataset.dialect===dialect ? '' : 'none';
  });
}

function copyCode(btn) {
  const pre = btn.parentElement.querySelector('.code-block');
  const text = pre.textContent;
  navigator.clipboard.writeText(text).then(()=>{
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(()=>{ btn.textContent='Copy'; btn.classList.remove('copied'); }, 2000);
  });
}

/* ============================================
   Theme Page
   ============================================ */
let paletteLoadCount = 0;
const PALETTE_BATCH = 50;
let paletteObserver = null;

function renderThemePage(container) {
  paletteLoadCount = 0;
  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Theme</h1>
      <p class="page-description">Customize the entire site's appearance using a ColorHunt palette or by extracting colors from an image.</p>
    </div>
    <div class="theme-sections">
      <section>
        <h2 class="section-title">Image Color Extraction</h2>
        <div class="upload-zone" id="uploadZone">
          <div class="upload-zone-icon">&#x1F3A8;</div>
          <p class="upload-zone-text">Drag & drop an image or click to upload</p>
          <p class="upload-zone-hint">Colors will be extracted automatically</p>
          <input type="file" id="imageInput" accept="image/*" style="display:none">
        </div>
        <div id="extractedResult"></div>
      </section>
      <section>
        <h2 class="section-title">ColorHunt Palettes <span style="font-weight:400;font-size:var(--fs-body-sm);color:var(--md-on-surface-variant)">(${typeof PALETTES!=='undefined'?PALETTES.length:0} palettes)</span></h2>
        <div class="palette-grid" id="paletteGrid"></div>
        <div id="paletteSentinel" style="height:1px"></div>
      </section>
    </div>
  `;

  initUploadZone();
  loadPaletteBatch();
  initPaletteLazyLoad();
}

function loadPaletteBatch() {
  if (typeof PALETTES === 'undefined') return;
  const grid = document.getElementById('paletteGrid');
  if (!grid) return;
  const start = paletteLoadCount;
  const end = Math.min(start + PALETTE_BATCH, PALETTES.length);

  for (let i=start; i<end; i++) {
    const p = PALETTES[i];
    const colors = parsePaletteCode(p.code);
    const card = document.createElement('div');
    card.className = 'palette-card';
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="palette-colors">
        ${colors.map(c=>`<div class="palette-color-bar" style="background:${c}" title="${c}"></div>`).join('')}
      </div>
      <div class="palette-info">
        <span>${colors.map(c=>c.toUpperCase()).join(' ')}</span>
        <span class="palette-likes">${p.likes >= 1000 ? (p.likes/1000).toFixed(1)+'k' : p.likes} &#x2665;</span>
      </div>
    `;
    card.addEventListener('click', () => {
      document.querySelectorAll('.palette-card').forEach(c=>c.classList.remove('selected'));
      card.classList.add('selected');
      applyTheme(colors);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') card.click();
    });
    grid.appendChild(card);
  }
  paletteLoadCount = end;
}

function initPaletteLazyLoad() {
  const sentinel = document.getElementById('paletteSentinel');
  if (!sentinel || typeof PALETTES === 'undefined') return;
  if (paletteObserver) paletteObserver.disconnect();
  paletteObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && paletteLoadCount < PALETTES.length) {
      loadPaletteBatch();
    }
  }, { rootMargin: '200px' });
  paletteObserver.observe(sentinel);
}

function initUploadZone() {
  const zone = document.getElementById('uploadZone');
  const input = document.getElementById('imageInput');
  if (!zone || !input) return;

  zone.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleImageFile(e.dataTransfer.files[0]);
  });
  input.addEventListener('change', () => { if (input.files.length) handleImageFile(input.files[0]); });
}

function handleImageFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const colors = extractColors(img);
      showExtractedColors(colors, e.target.result);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function showExtractedColors(colors, imgSrc) {
  const result = document.getElementById('extractedResult');
  if (!result) return;
  result.innerHTML = `
    <div class="extracted-palette">
      <img src="${imgSrc}" style="width:80px;height:80px;object-fit:cover;border-radius:var(--radius-md);border:1px solid var(--md-outline-variant)">
      ${colors.map((c,i) => `
        <div class="extracted-swatch">
          <label>${['Primary','Secondary','Tertiary','Surface'][i]}</label>
          <div class="color-input-wrapper">
            <input type="color" value="${c}" data-idx="${i}" onchange="updateExtractedColor(this)">
          </div>
        </div>
      `).join('')}
      <button class="apply-theme-btn" onclick="applyExtractedTheme()">Apply Theme</button>
    </div>
  `;
  window._extractedColors = [...colors];
}

function updateExtractedColor(input) {
  if (window._extractedColors) {
    window._extractedColors[parseInt(input.dataset.idx)] = input.value;
  }
}

function applyExtractedTheme() {
  if (window._extractedColors) {
    applyTheme(window._extractedColors);
  }
}

/* ============================================
   Atomic Design Page
   ============================================ */
function renderAtomicDesign(container) {
  const levels = [
    {
      name: 'Atoms', cls: 'atoms', num: 1,
      desc: 'Atoms are the smallest building blocks — individual UI elements that cannot be broken down further without losing their meaning. They include basic HTML elements like buttons, inputs, labels, and icons.',
      renderDemo: renderAtomsDemos
    },
    {
      name: 'Molecules', cls: 'molecules', num: 2,
      desc: 'Molecules are groups of atoms bonded together to form relatively simple, functional units. A search form molecule combines a label atom, input atom, and button atom into a purposeful group.',
      renderDemo: renderMoleculesDemos
    },
    {
      name: 'Organisms', cls: 'organisms', num: 3,
      desc: 'Organisms are complex UI components composed of groups of molecules and/or atoms. They form distinct sections of an interface, like a header with navigation, search, and branding.',
      renderDemo: renderOrganismsDemos
    },
    {
      name: 'Templates', cls: 'templates', num: 4,
      desc: 'Templates place components within a layout, defining the content structure. They show how organisms work together in a page-level context, using placeholder content.',
      renderDemo: renderTemplatesDemos
    },
    {
      name: 'Pages', cls: 'pages', num: 5,
      desc: 'Pages are specific instances of templates with real representative content. They demonstrate how the template looks with actual data, validating the design system end-to-end.',
      renderDemo: renderPagesDemos
    }
  ];

  let explodeState = false;

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Atomic Design</h1>
      <p class="page-description">A methodology for creating design systems with five distinct levels, from the smallest atoms to complete pages.</p>
    </div>
    <button class="explode-toggle" id="explodeToggle">&#x1F4A5; Explode View</button>
    <div id="atomicLevels"></div>
  `;

  const levelsContainer = document.getElementById('atomicLevels');
  for (const level of levels) {
    const section = document.createElement('div');
    section.className = 'atomic-level';
    section.innerHTML = `
      <div class="atomic-level-header">
        <div class="atomic-level-number ${level.cls}">${level.num}</div>
        <h2>${level.name}</h2>
      </div>
      <div class="atomic-level-content">
        <div class="atomic-level-info">
          <h3>${level.name}</h3>
          <p>${level.desc}</p>
          ${level.num <= 3 ? `<p style="margin-top:var(--space-sm);font-size:var(--fs-body-sm);color:var(--md-primary)">Components in this level: ${COMPONENTS.filter(c=>
            (level.num===1 && c.atomicLevel==='atom') ||
            (level.num===2 && c.atomicLevel==='molecule') ||
            (level.num===3 && c.atomicLevel==='organism')
          ).map(c=>`<a href="#/component/${c.id}" style="color:var(--md-primary)">${c.name}</a>`).join(', ')}</p>` : ''}
        </div>
        <div class="atomic-level-demos explode-view" id="level-${level.cls}"></div>
      </div>
    `;
    levelsContainer.appendChild(section);
    level.renderDemo(section.querySelector(`#level-${level.cls}`));
  }

  document.getElementById('explodeToggle').addEventListener('click', function() {
    explodeState = !explodeState;
    this.classList.toggle('active', explodeState);
    document.querySelectorAll('.explode-view').forEach(v => v.classList.toggle('exploded', explodeState));
  });
}

function renderAtomsDemos(container) {
  container.innerHTML = `
    <div class="explode-part" data-part-label="Button">
      <button class="m3-button m3-button-filled">Button</button>
    </div>
    <div class="explode-part" data-part-label="Outlined Button">
      <button class="m3-button m3-button-outlined">Outlined</button>
    </div>
    <div class="explode-part" data-part-label="Checkbox">
      <div class="m3-checkbox checked" onclick="this.classList.toggle('checked')">&#x2713;</div>
    </div>
    <div class="explode-part" data-part-label="Badge">
      <span class="m3-badge">3</span>
    </div>
    <div class="explode-part" data-part-label="Switch">
      <div class="m3-switch on" onclick="this.classList.toggle('on')"></div>
    </div>
    <div class="explode-part" data-part-label="Text Input">
      <div class="m3-textfield"><label>Label</label><input type="text" placeholder="Type here"></div>
    </div>
    <div class="explode-part" data-part-label="Icon Button">
      <button class="m3-icon-button">&#x2606;</button>
    </div>
    <div class="explode-part" data-part-label="Divider" style="width:100%">
      <div class="m3-divider"></div>
    </div>
  `;
}

function renderMoleculesDemos(container) {
  container.innerHTML = `
    <div class="explode-part" data-part-label="Search Bar" style="width:100%">
      <div class="m3-search-bar">
        <span>&#x1F50D;</span>
        <input type="text" placeholder="Search components...">
        <button class="m3-icon-button" style="width:32px;height:32px">&#x2716;</button>
      </div>
    </div>
    <div class="explode-part" data-part-label="List Item" style="width:100%">
      <div class="m3-list-item">
        <div class="m3-list-item-icon">&#x1F4C4;</div>
        <div class="m3-list-item-text">
          <div class="primary">List Item Title</div>
          <div class="secondary">Supporting text for this item</div>
        </div>
        <span class="m3-badge">5</span>
      </div>
    </div>
    <div class="explode-part" data-part-label="Chip Group">
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="m3-chip selected" onclick="this.classList.toggle('selected')">Filter A</button>
        <button class="m3-chip" onclick="this.classList.toggle('selected')">Filter B</button>
        <button class="m3-chip" onclick="this.classList.toggle('selected')">Filter C</button>
      </div>
    </div>
  `;
}

function renderOrganismsDemos(container) {
  container.innerHTML = `
    <div class="explode-part" data-part-label="Top App Bar" style="width:100%">
      <div class="m3-topbar">
        <button class="m3-icon-button">&#x2630;</button>
        <span class="m3-topbar-title">App Title</span>
        <div class="m3-search-bar" style="min-width:180px;max-width:240px">
          <span>&#x1F50D;</span><input type="text" placeholder="Search...">
        </div>
        <button class="m3-icon-button">&#x2699;</button>
      </div>
    </div>
    <div class="explode-part" data-part-label="Card">
      <div class="m3-card m3-card-elevated" style="max-width:240px">
        <div class="m3-card-media"></div>
        <div class="m3-card-content">
          <h3>Card Title</h3>
          <p>Card description with supporting text content.</p>
        </div>
        <div class="m3-card-actions">
          <button class="m3-button m3-button-text" style="padding:8px 12px;font-size:12px">Action</button>
          <button class="m3-button m3-button-tonal" style="padding:8px 12px;font-size:12px">Primary</button>
        </div>
      </div>
    </div>
    <div class="explode-part" data-part-label="Dialog">
      <div class="m3-dialog">
        <div class="m3-dialog-title">Confirm</div>
        <div class="m3-dialog-content">Are you sure you want to proceed with this action?</div>
        <div class="m3-dialog-actions">
          <button class="m3-button m3-button-text" style="font-size:13px">Cancel</button>
          <button class="m3-button m3-button-filled" style="font-size:13px">Confirm</button>
        </div>
      </div>
    </div>
  `;
}

function renderTemplatesDemos(container) {
  container.innerHTML = `
    <div class="m3-template" style="width:100%">
      <div class="m3-template-header explode-part" data-part-label="Header Organism">
        &#x2630; &nbsp; App Title &nbsp;&nbsp; [Search] &nbsp;&nbsp; &#x2699;
      </div>
      <div class="m3-template-nav explode-part" data-part-label="Nav Rail">
        <div>&#x1F3E0;</div><div>&#x1F4E6;</div><div>&#x2699;</div>
      </div>
      <div class="m3-template-content">
        <div class="m3-template-placeholder full-width explode-part" data-part-label="Hero Section">Hero / Banner</div>
        <div class="m3-template-placeholder explode-part" data-part-label="Card">Card Component</div>
        <div class="m3-template-placeholder explode-part" data-part-label="Card">Card Component</div>
        <div class="m3-template-placeholder explode-part" data-part-label="Card">Card Component</div>
        <div class="m3-template-placeholder explode-part" data-part-label="Card">Card Component</div>
      </div>
    </div>
  `;
}

function renderPagesDemos(container) {
  container.innerHTML = `
    <div class="m3-template" style="width:100%">
      <div class="m3-template-header explode-part" data-part-label="Header">
        <div style="display:flex;align-items:center;gap:8px;width:100%">
          <button class="m3-icon-button" style="width:32px;height:32px">&#x2630;</button>
          <strong style="flex:1;color:var(--md-on-surface)">Component Showcase</strong>
          <div class="m3-search-bar" style="min-width:120px;max-width:180px;padding:4px 8px">
            <span style="font-size:12px">&#x1F50D;</span><input type="text" placeholder="Search..." style="font-size:12px">
          </div>
        </div>
      </div>
      <div class="m3-template-nav explode-part" data-part-label="Navigation">
        <div style="font-size:16px">&#x1F3E0;</div>
        <div style="font-size:16px">&#x1F4E6;</div>
        <div style="font-size:16px">&#x1F3A8;</div>
      </div>
      <div class="m3-template-content explode-part" data-part-label="Content Area">
        <div style="grid-column:1/-1;margin-bottom:4px">
          <strong style="font-size:var(--fs-title-md);color:var(--md-on-surface)">Featured Components</strong>
        </div>
        <div class="m3-card m3-card-elevated" style="font-size:12px">
          <div class="m3-card-media" style="height:60px"></div>
          <div class="m3-card-content" style="padding:8px">
            <h3 style="font-size:13px">Button</h3>
            <p style="font-size:11px">Primary actions</p>
          </div>
        </div>
        <div class="m3-card m3-card-elevated" style="font-size:12px">
          <div class="m3-card-media" style="height:60px;background:linear-gradient(135deg,var(--md-secondary-container),var(--md-primary-container))"></div>
          <div class="m3-card-content" style="padding:8px">
            <h3 style="font-size:13px">Card</h3>
            <p style="font-size:11px">Content container</p>
          </div>
        </div>
        <div class="m3-card m3-card-elevated" style="font-size:12px">
          <div class="m3-card-media" style="height:60px;background:linear-gradient(135deg,var(--md-tertiary-container),var(--md-secondary-container))"></div>
          <div class="m3-card-content" style="padding:8px">
            <h3 style="font-size:13px">Dialog</h3>
            <p style="font-size:11px">Modal prompts</p>
          </div>
        </div>
        <div class="m3-card m3-card-elevated" style="font-size:12px">
          <div class="m3-card-media" style="height:60px;background:linear-gradient(135deg,var(--md-primary-container),var(--md-tertiary-container))"></div>
          <div class="m3-card-content" style="padding:8px">
            <h3 style="font-size:13px">Switch</h3>
            <p style="font-size:11px">Toggle control</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ============================================
   Sidebar Mobile Toggle
   ============================================ */
function initSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    toggle.classList.toggle('open');
    overlay.classList.toggle('active');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    toggle.classList.remove('open');
    overlay.classList.remove('active');
  });
}

/* ============================================
   Init
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  loadSavedTheme();
  populateSidebar();
  initSidebar();
  initRouter();
});
