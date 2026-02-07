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
  return hslToHex(h, Math.max(0, s - amount*0.3), Math.min(100, l + amount));
}

function darken(hex, amount) {
  const [h,s,l] = rgbToHsl(...hexToRgb(hex));
  return hslToHex(h, Math.min(100, s + amount*0.2), Math.max(0, l - amount));
}

function luminance(r,g,b) {
  const [rs,gs,bs] = [r,g,b].map(c => { c/=255; return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4); });
  return 0.2126*rs + 0.7152*gs + 0.0722*bs;
}

function contrastColor(hex) {
  const [r,g,b] = hexToRgb(hex);
  return luminance(r,g,b) > 0.179 ? '#31344b' : '#ffffff';
}

function colorDistance(hex1, hex2) {
  const [r1,g1,b1]=hexToRgb(hex1), [r2,g2,b2]=hexToRgb(hex2);
  return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
}

/* ============================================
   Neumorphic Theme Engine
   ============================================ */
function applyTheme(colors) {
  const [c1, c2, c3, c4] = colors;
  // c1 = primary accent, c2 = secondary/accent, c3 = background base, c4 = text hint
  // For neumorphism, we derive the bg from c3, shadows from darker/lighter c3
  const [h3,s3,l3] = rgbToHsl(...hexToRgb(c3));
  // Neumorphism works best with muted mid-tone backgrounds (L ~80-90)
  const bgL = Math.max(75, Math.min(92, l3 > 50 ? l3 : 85));
  const bg = hslToHex(h3, Math.min(s3, 20), bgL);
  const bgDark = hslToHex(h3, Math.min(s3+5, 25), bgL - 12);
  const bgLight = hslToHex(h3, Math.min(s3, 15), Math.min(100, bgL + 8));
  const shadowDark = hslToHex(h3, Math.min(s3+10, 30), bgL - 22);
  const shadowLight = hslToHex(h3, Math.max(0, s3 - 5), Math.min(100, bgL + 12));

  // Primary from c1
  const [h1,s1,l1] = rgbToHsl(...hexToRgb(c1));
  const primary = hslToHex(h1, Math.max(s1, 50), Math.max(40, Math.min(60, l1)));
  const primaryLight = hslToHex(h1, Math.max(s1-10, 40), Math.min(75, l1+15));
  const primaryDark = hslToHex(h1, Math.min(s1+10, 90), Math.max(25, l1-15));

  // Accent from c2
  const [h2,s2,l2] = rgbToHsl(...hexToRgb(c2));
  const accent = hslToHex(h2, Math.max(s2, 50), Math.max(40, Math.min(60, l2)));
  const accentLight = hslToHex(h2, Math.max(s2-10, 40), Math.min(75, l2+15));

  // Text from c4 or derived
  const textColor = darken(c4, 20);
  const textMuted = lighten(textColor, 20);
  const textLight = lighten(textColor, 35);

  const root = document.documentElement;
  const tokens = {
    '--nm-bg': bg,
    '--nm-bg-dark': bgDark,
    '--nm-bg-light': bgLight,
    '--nm-shadow-dark': shadowDark,
    '--nm-shadow-light': shadowLight,
    '--nm-primary': primary,
    '--nm-primary-light': primaryLight,
    '--nm-primary-dark': primaryDark,
    '--nm-accent': accent,
    '--nm-accent-light': accentLight,
    '--nm-text': textColor,
    '--nm-text-muted': textMuted,
    '--nm-text-light': textLight,
  };
  for (const [prop, val] of Object.entries(tokens)) {
    root.style.setProperty(prop, val);
  }
  // Recompute composite shadow vars
  root.style.setProperty('--nm-shadow-out', `6px 6px 12px ${shadowDark}, -6px -6px 12px ${shadowLight}`);
  root.style.setProperty('--nm-shadow-out-sm', `3px 3px 6px ${shadowDark}, -3px -3px 6px ${shadowLight}`);
  root.style.setProperty('--nm-shadow-out-lg', `10px 10px 20px ${shadowDark}, -10px -10px 20px ${shadowLight}`);
  root.style.setProperty('--nm-shadow-in', `inset 3px 3px 6px ${shadowDark}, inset -3px -3px 6px ${shadowLight}`);
  root.style.setProperty('--nm-shadow-in-sm', `inset 2px 2px 4px ${shadowDark}, inset -2px -2px 4px ${shadowLight}`);
  root.style.setProperty('--nm-shadow-in-lg', `inset 5px 5px 10px ${shadowDark}, inset -5px -5px 10px ${shadowLight}`);

  try { localStorage.setItem('nm-theme-colors', JSON.stringify(colors)); } catch(e) {}
}

function loadSavedTheme() {
  try {
    const saved = localStorage.getItem('nm-theme-colors');
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
   Lisp FOL Generator — Neumorphism Predicates
   ============================================ */
function makeLisp(name, slug, variants, tokens) {
  const clVariants = variants.map(v => `:${v.toLowerCase().replace(/\s+/g,'-')}`).join(' ');
  const schVariants = variants.map(v => `'${v.toLowerCase().replace(/\s+/g,'-')}`).join(' ');
  const cljVariants = variants.map(v => `:${v.toLowerCase().replace(/\s+/g,'-')}`).join(' ');
  const rktVariants = variants.map(v => `'${v.toLowerCase().replace(/\s+/g,'-')}`).join(' ');
  const tok = tokens || {shadow:'out',radius:16,height:44,minWidth:48};

  return {
    commonLisp:
`;; ${name} — Neumorphic Styling Predicates (Common Lisp)

(defun valid-${slug}-variant-p (variant)
  "Predicate: variant is a recognized neumorphic ${name} state."
  (member variant '(${clVariants})))

(defun ${slug}-shadow-mapping (state bg-color)
  "Maps ${name} state to neumorphic shadow pair (dark, light)."
  (let* ((dark (darken bg-color 15))
         (light (lighten bg-color 10)))
    (cond
      ((eq state :raised)
       (list :box-shadow
             (format nil "6px 6px 12px ~a, -6px -6px 12px ~a" dark light)))
      ((eq state :pressed)
       (list :box-shadow
             (format nil "inset 3px 3px 6px ~a, inset -3px -3px 6px ~a" dark light)))
      (t (list :box-shadow "none")))))

(defun ${slug}-neumorphic-valid-p (${slug})
  "Predicate: ${name} adheres to neumorphic design constraints."
  (let* ((bg (getf ${slug} :background))
         (surface (getf ${slug} :surface-color))
         (radius (getf ${slug} :border-radius))
         (contrast (color-distance bg surface)))
    (and (< contrast 30)          ; bg must be similar to surface
         (>= radius ${tok.radius})
         (null (getf ${slug} :border)))))   ; no hard borders

(defun accessible-${slug}-p (${slug})
  "Predicate: ${name} meets neumorphic accessibility requirements."
  (let* ((fg (getf ${slug} :foreground))
         (bg (getf ${slug} :background))
         (contrast (contrast-ratio fg bg))
         (min-h (getf ${slug} :height)))
    (and (>= contrast 4.5)
         (>= min-h ${tok.height}))))`,

    scheme:
`;; ${name} — Neumorphic Styling Predicates (Scheme)

(define (valid-${slug}-variant? variant)
  ;; Predicate: variant is a recognized neumorphic state
  (member variant '(${schVariants})))

(define (${slug}-shadow-mapping state bg-color)
  ;; Derives neumorphic shadow pair from surface color
  (let ((dark (darken bg-color 15))
        (light (lighten bg-color 10)))
    (cond
      ((eq? state 'raised)
       (string-append "6px 6px 12px " dark ", -6px -6px 12px " light))
      ((eq? state 'pressed)
       (string-append "inset 3px 3px 6px " dark ", inset -3px -3px 6px " light))
      (else "none"))))

(define (${slug}-neumorphic-valid? ${slug})
  ;; Surface and element bg must be near-identical
  (and (< (color-distance (assoc-ref ${slug} 'bg)
                           (assoc-ref ${slug} 'surface)) 30)
       (>= (assoc-ref ${slug} 'border-radius) ${tok.radius})
       (not (assoc-ref ${slug} 'border))))

(define (${slug}-accessible? ${slug})
  ;; WCAG contrast + minimum target size
  (let ((contrast (contrast-ratio (assoc-ref ${slug} 'fg)
                                  (assoc-ref ${slug} 'bg))))
    (and (>= contrast 4.5)
         (>= (assoc-ref ${slug} 'height) ${tok.height}))))`,

    clojure:
`;; ${name} — Neumorphic Styling Predicates (Clojure)

(def ${slug}-variants #{${cljVariants}})

(defn valid-${slug}-variant?
  "Predicate: variant is a recognized neumorphic state."
  [variant]
  (contains? ${slug}-variants variant))

(defn ${slug}-shadow-mapping
  "Derives neumorphic box-shadow from state and surface color."
  [state bg-color]
  (let [dark (darken bg-color 15)
        light (lighten bg-color 10)]
    (case state
      :raised (str "6px 6px 12px " dark ", -6px -6px 12px " light)
      :pressed (str "inset 3px 3px 6px " dark ", inset -3px -3px 6px " light)
      "none")))

(defn ${slug}-neumorphic-valid?
  "Element bg must match surface; no hard borders; soft radius."
  [{:keys [bg surface border-radius border]}]
  (every? true?
    [(< (color-distance bg surface) 30)
     (>= border-radius ${tok.radius})
     (nil? border)]))

(defn ${slug}-accessible?
  "WCAG contrast ratio and touch target check."
  [{:keys [fg bg height]}]
  (and (>= (contrast-ratio fg bg) 4.5)
       (>= height ${tok.height})))`,

    racket:
`;; ${name} — Neumorphic Styling Predicates (Racket)

(define/contract (valid-${slug}-variant? variant)
  (-> symbol? boolean?)
  (and (member variant '(${rktVariants})) #t))

(define (${slug}-shadow-mapping state bg-color)
  ;; Pattern-match state to neumorphic shadow expression
  (let ([dark (darken bg-color 15)]
        [light (lighten bg-color 10)])
    (match state
      ['raised (format "6px 6px 12px ~a, -6px -6px 12px ~a" dark light)]
      ['pressed (format "inset 3px 3px 6px ~a, inset -3px -3px 6px ~a" dark light)]
      [_ "none"])))

(define/contract (${slug}-neumorphic-valid? props)
  (-> hash? boolean?)
  (and (< (color-distance (hash-ref props 'bg)
                           (hash-ref props 'surface)) 30)
       (>= (hash-ref props 'border-radius) ${tok.radius})
       (not (hash-ref props 'border #f))))

(define/contract (${slug}-accessible? props)
  (-> hash? boolean?)
  (for/and ([check (list
              (>= (contrast-ratio (hash-ref props 'fg)
                                  (hash-ref props 'bg)) 4.5)
              (>= (hash-ref props 'height) ${tok.height}))])
    check))`
  };
}

/* ============================================
   Component Registry — 20 Neumorphic Components
   ============================================ */
const COMPONENTS = [
  // ─── ACTIONS ───
  {
    id: 'button', name: 'Button', category: 'Actions', atomicLevel: 'atom',
    description: 'Neumorphic buttons use extruded and pressed shadow states instead of color fills. Four variants provide different emphasis levels through shadow depth.',
    specs: [
      {property:'Height',value:'44px'},{property:'Min Width',value:'48px'},
      {property:'Border Radius',value:'9999px (pill)'},{property:'Padding',value:'12px 28px'},
      {property:'Shadow (raised)',value:'6px blur, dual light/dark'},{property:'Shadow (pressed)',value:'inset 3px blur'}
    ],
    guidelines: [
      'Raised buttons are the default — they appear to float above the surface.',
      'Pressed/inset buttons indicate an active or toggled-on state.',
      'Primary colored buttons are reserved for the single most important action.',
      'Flat buttons have no shadow and are used for low-emphasis actions.',
      'All button backgrounds must closely match the surface color for the neumorphic illusion.'
    ],
    variants: ['Raised','Flat','Pressed','Primary','Soft'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Raised</div>
        <button class="nm-button nm-button-raised">Raised</button>
        <div class="demo-variant-label">Flat</div>
        <button class="nm-button nm-button-flat">Flat</button>
        <div class="demo-variant-label">Pressed / Inset</div>
        <button class="nm-button nm-button-pressed">Pressed</button>
        <div class="demo-variant-label">Primary</div>
        <button class="nm-button nm-button-primary">Primary</button>
        <div class="demo-variant-label">Soft</div>
        <button class="nm-button nm-button-soft">Soft</button>`;
    },
    renderDemo() {
      return `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <button class="nm-button nm-button-raised" style="pointer-events:none;font-size:12px;padding:8px 16px;min-height:36px">Raised</button>
        <button class="nm-button nm-button-pressed" style="pointer-events:none;font-size:12px;padding:8px 16px;min-height:36px">Pressed</button></div>`;
    },
    lisp: makeLisp('Button','button',['Raised','Flat','Pressed','Primary','Soft'],{shadow:'out',radius:9999,height:44,minWidth:48})
  },
  {
    id: 'fab', name: 'FAB', category: 'Actions', atomicLevel: 'atom',
    description: 'Floating Action Buttons in neumorphism appear as soft-extruded circles or rounded squares that pop off the surface.',
    specs: [
      {property:'Size (default)',value:'56x56px'},{property:'Size (small)',value:'40x40px'},
      {property:'Size (large)',value:'96x96px'},{property:'Border Radius',value:'24px'},
      {property:'Shadow',value:'Level out (6px)'}
    ],
    guidelines: [
      'FABs should visually float above the surface with strong outer shadow.',
      'Only one FAB per screen.',
      'Extended FABs add a text label next to the icon.',
      'On press, the shadow should transition to inset.'
    ],
    variants: ['Small','Regular','Large','Extended'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Small</div>
        <button class="nm-fab nm-fab-small">+</button>
        <div class="demo-variant-label">Regular</div>
        <button class="nm-fab">&#x270E;</button>
        <div class="demo-variant-label">Large</div>
        <button class="nm-fab nm-fab-large">&#x270E;</button>
        <div class="demo-variant-label">Extended</div>
        <button class="nm-fab nm-fab-extended">&#x270E; Compose</button>`;
    },
    renderDemo() {
      return `<button class="nm-fab" style="pointer-events:none">&#x270E;</button>`;
    },
    lisp: makeLisp('FAB','fab',['Small','Regular','Large','Extended'],{shadow:'out-lg',radius:24,height:56,minWidth:56})
  },
  {
    id: 'icon-button', name: 'Icon Button', category: 'Actions', atomicLevel: 'atom',
    description: 'Circular neumorphic buttons for icon-only actions. They toggle between raised (inactive) and pressed (active) shadow states.',
    specs: [
      {property:'Size',value:'44x44px'},{property:'Border Radius',value:'50%'},
      {property:'Shadow (default)',value:'out-sm'},{property:'Shadow (active)',value:'inset'}
    ],
    guidelines: [
      'Use for toggle actions like favorite, bookmark, or settings.',
      'Active state uses inset shadow to look "pushed in".',
      'Always provide accessible labels via aria-label.',
      'Group related icon buttons together.'
    ],
    variants: ['Default','Active'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Default (Interactive - click to toggle)</div>
        <button class="nm-icon-button" onclick="this.classList.toggle('active')">&#x2606;</button>
        <button class="nm-icon-button" onclick="this.classList.toggle('active')">&#x2665;</button>
        <button class="nm-icon-button" onclick="this.classList.toggle('active')">&#x21A9;</button>
        <div class="demo-variant-label">Active State</div>
        <button class="nm-icon-button active">&#x2605;</button>`;
    },
    renderDemo() {
      return `<div style="display:flex;gap:8px"><button class="nm-icon-button" style="pointer-events:none;width:36px;height:36px">&#x2606;</button><button class="nm-icon-button active" style="pointer-events:none;width:36px;height:36px">&#x2665;</button></div>`;
    },
    lisp: makeLisp('Icon Button','icon-button',['Default','Active'],{shadow:'out-sm',radius:9999,height:44,minWidth:44})
  },

  // ─── COMMUNICATION ───
  {
    id: 'badge', name: 'Badge', category: 'Communication', atomicLevel: 'atom',
    description: 'Badges are small notification indicators. Unlike most neumorphic elements, they use a solid accent color to stand out against the soft surface.',
    specs: [
      {property:'Dot Size',value:'10px'},{property:'Number Min Size',value:'20px'},
      {property:'Font Size',value:'11px'},{property:'Background',value:'accent color'},
      {property:'Shadow',value:'subtle drop shadow'}
    ],
    guidelines: [
      'Badges are an exception to the same-color-as-surface rule — they need to be immediately visible.',
      'Use dot badges for generic notifications.',
      'Number badges show specific counts.',
      'Position at top-right of host element.'
    ],
    variants: ['Dot','Number'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Dot Badge</div>
        <div style="position:relative;display:inline-block;padding:8px">
          <button class="nm-icon-button">&#x1F514;</button>
          <span class="nm-badge nm-badge-dot" style="position:absolute;top:8px;right:8px"></span>
        </div>
        <div class="demo-variant-label">Number Badge</div>
        <div style="position:relative;display:inline-block;padding:8px">
          <button class="nm-icon-button">&#x2709;</button>
          <span class="nm-badge" style="position:absolute;top:4px;right:4px">3</span>
        </div>
        <div style="position:relative;display:inline-block;padding:8px">
          <button class="nm-icon-button">&#x1F4E6;</button>
          <span class="nm-badge" style="position:absolute;top:4px;right:4px">99+</span>
        </div>`;
    },
    renderDemo() {
      return `<div style="display:flex;gap:16px;align-items:center"><span class="nm-badge nm-badge-dot"></span><span class="nm-badge">5</span><span class="nm-badge">99+</span></div>`;
    },
    lisp: makeLisp('Badge','badge',['Dot','Number'],{shadow:'drop',radius:9999,height:20,minWidth:10})
  },
  {
    id: 'progress', name: 'Progress Indicator', category: 'Communication', atomicLevel: 'atom',
    description: 'Progress indicators use an inset track (pressed into the surface) with a gradient-filled bar that appears to sit inside the groove.',
    specs: [
      {property:'Track Height',value:'8px'},{property:'Circular Size',value:'48px'},
      {property:'Track Shadow',value:'inset'},{property:'Bar Fill',value:'primary gradient'}
    ],
    guidelines: [
      'The track should be inset — it looks like a groove in the surface.',
      'The fill bar uses a subtle gradient of the primary color.',
      'Circular indicators use an inset ring with an animated arc.',
      'Keep animations smooth to maintain the soft aesthetic.'
    ],
    variants: ['Linear','Circular'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Linear (65%)</div>
        <div style="width:100%"><div class="nm-progress"><div class="nm-progress-bar" style="width:65%"></div></div></div>
        <div class="demo-variant-label">Linear (30%)</div>
        <div style="width:100%"><div class="nm-progress"><div class="nm-progress-bar" style="width:30%"></div></div></div>
        <div class="demo-variant-label">Circular</div>
        <div class="nm-progress-circular"></div>`;
    },
    renderDemo() {
      return `<div style="width:80%"><div class="nm-progress"><div class="nm-progress-bar" style="width:60%"></div></div></div>`;
    },
    lisp: makeLisp('Progress','progress',['Linear','Circular'],{shadow:'in',radius:9999,height:8,minWidth:100})
  },
  {
    id: 'snackbar', name: 'Snackbar', category: 'Communication', atomicLevel: 'molecule',
    description: 'Snackbars in neumorphism use the dark text color as background, creating contrast against the soft surface. They float with outer shadows.',
    specs: [
      {property:'Padding',value:'14px 20px'},{property:'Border Radius',value:'16px'},
      {property:'Background',value:'text color (dark)'},{property:'Shadow',value:'out-lg'},
      {property:'Duration',value:'4-10 seconds'}
    ],
    guidelines: [
      'Snackbars break the neumorphic same-color rule intentionally for visibility.',
      'They should float above the surface with strong outer shadow.',
      'Action buttons use the primary-light color.',
      'Only one snackbar at a time.'
    ],
    variants: ['Basic','With Action'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Basic</div>
        <div class="nm-snackbar">File has been deleted</div>
        <div class="demo-variant-label">With Action</div>
        <div class="nm-snackbar">Email archived <button class="nm-snackbar-action">Undo</button></div>`;
    },
    renderDemo() {
      return `<div class="nm-snackbar" style="font-size:12px;pointer-events:none;padding:8px 12px">Message <button class="nm-snackbar-action" style="font-size:12px">Undo</button></div>`;
    },
    lisp: makeLisp('Snackbar','snackbar',['Basic','With Action'],{shadow:'out-lg',radius:16,height:48,minWidth:200})
  },
  {
    id: 'tooltip', name: 'Tooltip', category: 'Communication', atomicLevel: 'atom',
    description: 'Tooltips use the dark text color as background (like snackbars) to ensure legibility against the neumorphic surface.',
    specs: [
      {property:'Padding',value:'6px 12px'},{property:'Font Size',value:'12px'},
      {property:'Border Radius',value:'8px'},{property:'Background',value:'text color'}
    ],
    guidelines: [
      'Tooltips appear on hover/focus after a short delay.',
      'Keep text to one or two words.',
      'Dark background provides necessary contrast.',
      'Never put essential info only in tooltips.'
    ],
    variants: ['Plain'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Tooltips</div>
        <div class="nm-tooltip">Save</div>
        <div class="nm-tooltip">Delete</div>
        <div class="nm-tooltip">Share this item</div>
        <div class="demo-variant-label">With Host</div>
        <div style="display:inline-flex;flex-direction:column;align-items:center;gap:4px">
          <div class="nm-tooltip">Favorite</div>
          <button class="nm-icon-button">&#x2665;</button>
        </div>`;
    },
    renderDemo() {
      return `<div class="nm-tooltip" style="pointer-events:none">Tooltip</div>`;
    },
    lisp: makeLisp('Tooltip','tooltip',['Plain'],{shadow:'out-sm',radius:8,height:24,minWidth:32})
  },

  // ─── CONTAINMENT ───
  {
    id: 'card', name: 'Card', category: 'Containment', atomicLevel: 'molecule',
    description: 'Neumorphic cards come in three shadow modes: raised (floating off surface), flat (subtle), and inset (pressed into surface).',
    specs: [
      {property:'Border Radius',value:'24px'},{property:'Padding',value:'16px'},
      {property:'Shadow (raised)',value:'out (6px dual)'},{property:'Shadow (inset)',value:'inset (3px dual)'},
      {property:'Background',value:'matches surface'}
    ],
    guidelines: [
      'Raised cards are the default — they appear to pop off the surface.',
      'Inset cards look like content areas pressed into the surface.',
      'Card background MUST match the page background for the illusion to work.',
      'Avoid borders — use shadows exclusively for separation.'
    ],
    variants: ['Raised','Flat','Inset'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Raised</div>
        <div class="nm-card" style="max-width:280px">
          <div class="nm-card-media"></div>
          <div class="nm-card-content"><h3>Raised Card</h3><p>Floats above the surface with dual light/dark shadows.</p></div>
          <div class="nm-card-actions"><button class="nm-button nm-button-flat" style="font-size:12px;padding:8px 12px;min-height:32px">Cancel</button><button class="nm-button nm-button-primary" style="font-size:12px;padding:8px 12px;min-height:32px">Action</button></div>
        </div>
        <div class="demo-variant-label">Flat</div>
        <div class="nm-card nm-card-flat" style="max-width:280px">
          <div class="nm-card-content"><h3>Flat Card</h3><p>Subtle shadow for less visual weight.</p></div>
        </div>
        <div class="demo-variant-label">Inset</div>
        <div class="nm-card nm-card-inset" style="max-width:280px">
          <div class="nm-card-content"><h3>Inset Card</h3><p>Pressed into the surface, like a content well.</p></div>
        </div>`;
    },
    renderDemo() {
      return `<div class="nm-card" style="width:90%;pointer-events:none"><div class="nm-card-media" style="height:60px"></div><div class="nm-card-content" style="padding:8px"><h3 style="font-size:13px">Card</h3><p style="font-size:11px">Soft shadow</p></div></div>`;
    },
    lisp: makeLisp('Card','card',['Raised','Flat','Inset'],{shadow:'out',radius:24,height:48,minWidth:120})
  },
  {
    id: 'dialog', name: 'Dialog', category: 'Containment', atomicLevel: 'organism',
    description: 'Neumorphic dialogs float above the surface with strong outer shadows. Their background matches the surface color.',
    specs: [
      {property:'Min Width',value:'280px'},{property:'Max Width',value:'400px'},
      {property:'Border Radius',value:'32px'},{property:'Padding',value:'24px'},
      {property:'Shadow',value:'out-lg (10px dual)'}
    ],
    guidelines: [
      'Dialogs use the strongest outer shadow level to indicate elevation.',
      'Background must match the surface for neumorphic consistency.',
      'Action buttons should use raised and primary variants.',
      'Use sparingly — they interrupt flow.'
    ],
    variants: ['Basic','Confirmation'],
    render(el) {
      el.innerHTML = `
        <div class="nm-dialog">
          <div class="nm-dialog-title">Reset settings?</div>
          <div class="nm-dialog-content">This will restore all defaults. This action cannot be undone.</div>
          <div class="nm-dialog-actions">
            <button class="nm-button nm-button-flat" style="font-size:13px;padding:8px 16px;min-height:36px">Cancel</button>
            <button class="nm-button nm-button-primary" style="font-size:13px;padding:8px 16px;min-height:36px">Reset</button>
          </div>
        </div>`;
    },
    renderDemo() {
      return `<div class="nm-dialog" style="max-width:200px;padding:12px;pointer-events:none"><div class="nm-dialog-title" style="font-size:14px">Dialog</div><div class="nm-dialog-content" style="font-size:11px;margin-bottom:8px">Content here</div><div class="nm-dialog-actions"><button class="nm-button nm-button-flat" style="font-size:11px;padding:4px 8px;min-height:28px">OK</button></div></div>`;
    },
    lisp: makeLisp('Dialog','dialog',['Basic','Confirmation'],{shadow:'out-lg',radius:32,height:200,minWidth:280})
  },
  {
    id: 'divider', name: 'Divider', category: 'Containment', atomicLevel: 'atom',
    description: 'Neumorphic dividers are not simple lines — they use a dual shadow groove effect to appear carved into the surface.',
    specs: [
      {property:'Height',value:'2px'},{property:'Shadow',value:'1px dark top, 1px light bottom'},
      {property:'Background',value:'transparent'},{property:'Effect',value:'carved groove'}
    ],
    guidelines: [
      'Dividers use a light and dark 1px shadow to create a groove illusion.',
      'The element itself is transparent — the effect is purely shadow-based.',
      'Use sparingly; spacing alone often suffices in neumorphism.',
      'Inset variants add left margin for grouped content.'
    ],
    variants: ['Full Width','Inset'],
    render(el) {
      el.innerHTML = `
        <div style="width:100%">
          <div class="demo-variant-label">Full Width</div>
          <p style="padding:8px 0;font-size:var(--fs-body);color:var(--nm-text-muted)">Content above</p>
          <div class="nm-divider"></div>
          <p style="padding:8px 0;font-size:var(--fs-body);color:var(--nm-text-muted)">Content below</p>
          <div class="demo-variant-label">Inset</div>
          <p style="padding:8px 0;font-size:var(--fs-body);color:var(--nm-text-muted)">Content above</p>
          <div class="nm-divider" style="margin-left:16px"></div>
          <p style="padding:8px 0;font-size:var(--fs-body);color:var(--nm-text-muted)">Content below</p>
        </div>`;
    },
    renderDemo() {
      return `<div style="width:80%;display:flex;flex-direction:column;gap:8px;align-items:center"><span style="font-size:11px;color:var(--nm-text-muted)">Above</span><div class="nm-divider"></div><span style="font-size:11px;color:var(--nm-text-muted)">Below</span></div>`;
    },
    lisp: makeLisp('Divider','divider',['Full Width','Inset'],{shadow:'groove',radius:1,height:2,minWidth:48})
  },

  // ─── NAVIGATION ───
  {
    id: 'navbar', name: 'Navigation Bar', category: 'Navigation', atomicLevel: 'molecule',
    description: 'A neumorphic bottom nav bar where the active item appears pressed into the surface while inactive items sit flush.',
    specs: [
      {property:'Height',value:'~70px'},{property:'Items',value:'3-5'},
      {property:'Shadow (bar)',value:'out'},{property:'Shadow (active)',value:'inset'},
      {property:'Border Radius',value:'24px'}
    ],
    guidelines: [
      'The bar itself uses outer shadow to float above content.',
      'Active items switch to inset shadow (pressed state).',
      'Use 3-5 destinations.',
      'Labels should be one word.'
    ],
    variants: ['3 Items','4 Items'],
    render(el) {
      el.innerHTML = `
        <div style="width:100%;max-width:400px">
          <div class="nm-navbar">
            <button class="nm-navbar-item active" onclick="navbarSelect(this)"><div class="nm-navbar-indicator">&#x1F3E0;</div><span>Home</span></button>
            <button class="nm-navbar-item" onclick="navbarSelect(this)"><div class="nm-navbar-indicator">&#x1F50D;</div><span>Search</span></button>
            <button class="nm-navbar-item" onclick="navbarSelect(this)"><div class="nm-navbar-indicator">&#x2665;</div><span>Favorites</span></button>
            <button class="nm-navbar-item" onclick="navbarSelect(this)"><div class="nm-navbar-indicator">&#x1F464;</div><span>Profile</span></button>
          </div>
        </div>`;
    },
    renderDemo() {
      return `<div class="nm-navbar" style="width:90%;pointer-events:none;font-size:10px;padding:4px"><div class="nm-navbar-item active" style="padding:6px 0"><div class="nm-navbar-indicator">&#x1F3E0;</div><span>Home</span></div><div class="nm-navbar-item" style="padding:6px 0"><div class="nm-navbar-indicator">&#x1F50D;</div><span>Search</span></div><div class="nm-navbar-item" style="padding:6px 0"><div class="nm-navbar-indicator">&#x1F464;</div><span>Profile</span></div></div>`;
    },
    lisp: makeLisp('Navigation Bar','navbar',['3 Items','4 Items'],{shadow:'out',radius:24,height:70,minWidth:320})
  },
  {
    id: 'navrail', name: 'Navigation Rail', category: 'Navigation', atomicLevel: 'molecule',
    description: 'Vertical neumorphic navigation for larger screens. The rail itself is raised; active items are pressed inward.',
    specs: [
      {property:'Width',value:'80px'},{property:'Border Radius',value:'24px'},
      {property:'Shadow (rail)',value:'out'},{property:'Shadow (active)',value:'inset'}
    ],
    guidelines: [
      'Use on tablet/desktop instead of a bottom nav bar.',
      'Include 3-7 destinations.',
      'Active item uses inset shadow.',
      'An optional FAB can be placed at the top.'
    ],
    variants: ['Standard','With FAB'],
    render(el) {
      el.innerHTML = `
        <div class="nm-navrail">
          <button class="nm-fab nm-fab-small" style="margin-bottom:8px">&#x270E;</button>
          <button class="nm-navrail-item active" onclick="navrailSelect(this)"><div class="nm-navbar-indicator">&#x1F3E0;</div><span>Home</span></button>
          <button class="nm-navrail-item" onclick="navrailSelect(this)"><div class="nm-navbar-indicator">&#x1F50D;</div><span>Search</span></button>
          <button class="nm-navrail-item" onclick="navrailSelect(this)"><div class="nm-navbar-indicator">&#x2665;</div><span>Favs</span></button>
        </div>`;
    },
    renderDemo() {
      return `<div class="nm-navrail" style="width:60px;pointer-events:none;font-size:10px;padding:8px 4px"><div class="nm-navrail-item active" style="padding:6px"><div class="nm-navbar-indicator">&#x1F3E0;</div><span>Home</span></div><div class="nm-navrail-item" style="padding:6px"><div class="nm-navbar-indicator">&#x1F50D;</div><span>Find</span></div></div>`;
    },
    lisp: makeLisp('Navigation Rail','navrail',['Standard','With FAB'],{shadow:'out',radius:24,height:300,minWidth:80})
  },
  {
    id: 'tabs', name: 'Tabs', category: 'Navigation', atomicLevel: 'molecule',
    description: 'Neumorphic tabs sit inside a raised container. The active tab is pressed inward while others remain flush.',
    specs: [
      {property:'Height',value:'48px'},{property:'Border Radius (container)',value:'16px'},
      {property:'Border Radius (tab)',value:'8px'},{property:'Active Shadow',value:'inset'}
    ],
    guidelines: [
      'The tab container uses outer shadow.',
      'Active tab uses inset shadow to look selected.',
      'Keep labels short.',
      'Present in a single row.'
    ],
    variants: ['Primary'],
    render(el) {
      el.innerHTML = `
        <div style="width:100%;max-width:400px">
          <div class="nm-tabs">
            <button class="nm-tab active" onclick="tabSelect(this)">Tab One</button>
            <button class="nm-tab" onclick="tabSelect(this)">Tab Two</button>
            <button class="nm-tab" onclick="tabSelect(this)">Tab Three</button>
          </div>
        </div>`;
    },
    renderDemo() {
      return `<div class="nm-tabs" style="width:90%;pointer-events:none;font-size:11px;padding:2px"><div class="nm-tab active">One</div><div class="nm-tab">Two</div><div class="nm-tab">Three</div></div>`;
    },
    lisp: makeLisp('Tabs','tabs',['Primary','Secondary'],{shadow:'out-sm',radius:16,height:48,minWidth:90})
  },
  {
    id: 'topbar', name: 'Top App Bar', category: 'Navigation', atomicLevel: 'organism',
    description: 'A neumorphic app bar that sits raised at the top of content. Contains navigation, title, and action icon buttons.',
    specs: [
      {property:'Height',value:'64px'},{property:'Border Radius',value:'24px'},
      {property:'Shadow',value:'out'},{property:'Padding',value:'8px 16px'}
    ],
    guidelines: [
      'The bar uses outer shadow to separate from content.',
      'Icon buttons within should use their own neumorphic shadows.',
      'Title area is flush (no shadow).',
      'Can embed a neumorphic search bar.'
    ],
    variants: ['Standard'],
    render(el) {
      el.innerHTML = `
        <div style="width:100%">
          <div class="nm-topbar">
            <button class="nm-icon-button">&#x2190;</button>
            <span class="nm-topbar-title">Page Title</span>
            <button class="nm-icon-button">&#x2699;</button>
            <button class="nm-icon-button">&#x22EE;</button>
          </div>
        </div>`;
    },
    renderDemo() {
      return `<div class="nm-topbar" style="width:90%;pointer-events:none;padding:4px 8px;min-height:48px"><span style="font-size:12px">&#x2190;</span><span class="nm-topbar-title" style="font-size:13px">Title</span><span style="font-size:12px">&#x2699;</span></div>`;
    },
    lisp: makeLisp('Top App Bar','topbar',['Standard','Scrolled'],{shadow:'out',radius:24,height:64,minWidth:320})
  },

  // ─── SELECTION ───
  {
    id: 'checkbox', name: 'Checkbox', category: 'Selection', atomicLevel: 'atom',
    description: 'Neumorphic checkboxes use an inset well. When checked, a colored check mark appears inside the pressed groove.',
    specs: [
      {property:'Size',value:'24x24px'},{property:'Border Radius',value:'8px'},
      {property:'Shadow (unchecked)',value:'inset'},{property:'Shadow (checked)',value:'inset-lg'},
      {property:'Check Color',value:'primary'}
    ],
    guidelines: [
      'The checkbox well is always inset (pressed into surface).',
      'Checked state deepens the inset and shows the primary-colored check.',
      'Always pair with a text label.',
      'Touch target should be at least 48px.'
    ],
    variants: ['Unchecked','Checked'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Interactive Checkboxes</div>
        <div style="display:flex;flex-direction:column;gap:16px">
          <label style="display:flex;align-items:center;gap:12px;cursor:pointer" onclick="this.querySelector('.nm-checkbox').classList.toggle('checked')">
            <div class="nm-checkbox checked">&#x2713;</div><span>Option A (checked)</span>
          </label>
          <label style="display:flex;align-items:center;gap:12px;cursor:pointer" onclick="this.querySelector('.nm-checkbox').classList.toggle('checked')">
            <div class="nm-checkbox">&#x2713;</div><span>Option B</span>
          </label>
          <label style="display:flex;align-items:center;gap:12px;cursor:pointer" onclick="this.querySelector('.nm-checkbox').classList.toggle('checked')">
            <div class="nm-checkbox">&#x2713;</div><span>Option C</span>
          </label>
        </div>`;
    },
    renderDemo() {
      return `<div style="display:flex;gap:8px"><div class="nm-checkbox checked" style="pointer-events:none">&#x2713;</div><div class="nm-checkbox" style="pointer-events:none"></div></div>`;
    },
    lisp: makeLisp('Checkbox','checkbox',['Unchecked','Checked'],{shadow:'in',radius:8,height:24,minWidth:24})
  },
  {
    id: 'chip', name: 'Chip', category: 'Selection', atomicLevel: 'atom',
    description: 'Neumorphic chips toggle between raised (unselected) and pressed (selected) states. They are pill-shaped with soft shadows.',
    specs: [
      {property:'Height',value:'36px'},{property:'Border Radius',value:'9999px'},
      {property:'Padding',value:'8px 18px'},{property:'Shadow (default)',value:'out-sm'},
      {property:'Shadow (selected)',value:'inset'}
    ],
    guidelines: [
      'Unselected chips are raised; selected chips are pressed in.',
      'Selected state also changes text color to primary.',
      'Chips are interactive filter elements — make them feel pushable.',
      'Group related chips together.'
    ],
    variants: ['Filter','Assist','Input'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Filter Chips (Interactive)</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="nm-chip selected" onclick="this.classList.toggle('selected')">&#x2713; Active</button>
          <button class="nm-chip" onclick="this.classList.toggle('selected')">Draft</button>
          <button class="nm-chip" onclick="this.classList.toggle('selected')">Archived</button>
          <button class="nm-chip" onclick="this.classList.toggle('selected')">Shared</button>
        </div>
        <div class="demo-variant-label">Assist Chips</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="nm-chip">&#x1F4CD; Directions</button>
          <button class="nm-chip">&#x260E; Call</button>
        </div>`;
    },
    renderDemo() {
      return `<div style="display:flex;gap:6px"><span class="nm-chip selected" style="pointer-events:none;font-size:11px;padding:4px 12px">Filter</span><span class="nm-chip" style="pointer-events:none;font-size:11px;padding:4px 12px">Chip</span></div>`;
    },
    lisp: makeLisp('Chip','chip',['Filter','Assist','Input'],{shadow:'out-sm',radius:9999,height:36,minWidth:48})
  },
  {
    id: 'radio', name: 'Radio Button', category: 'Selection', atomicLevel: 'atom',
    description: 'Neumorphic radio buttons are circular inset wells. The selected state shows a raised primary-colored dot inside the groove.',
    specs: [
      {property:'Size',value:'24x24px'},{property:'Inner Dot',value:'10px'},
      {property:'Shadow (well)',value:'inset'},{property:'Dot Shadow',value:'subtle primary glow'},
      {property:'Touch Target',value:'48px'}
    ],
    guidelines: [
      'The circular well is always inset.',
      'Selected state adds a raised primary-colored dot inside.',
      'At least two options required.',
      'Group vertically for readability.'
    ],
    variants: ['Unselected','Selected'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Radio Group (Interactive)</div>
        <div style="display:flex;flex-direction:column;gap:16px" id="radioGroup">
          <label style="display:flex;align-items:center;gap:12px;cursor:pointer" onclick="radioSelect(this)">
            <div class="nm-radio selected"></div><span>Option Alpha</span>
          </label>
          <label style="display:flex;align-items:center;gap:12px;cursor:pointer" onclick="radioSelect(this)">
            <div class="nm-radio"></div><span>Option Beta</span>
          </label>
          <label style="display:flex;align-items:center;gap:12px;cursor:pointer" onclick="radioSelect(this)">
            <div class="nm-radio"></div><span>Option Gamma</span>
          </label>
        </div>`;
    },
    renderDemo() {
      return `<div style="display:flex;gap:8px"><div class="nm-radio selected" style="pointer-events:none"></div><div class="nm-radio" style="pointer-events:none"></div></div>`;
    },
    lisp: makeLisp('Radio Button','radio',['Unselected','Selected'],{shadow:'in',radius:9999,height:24,minWidth:24})
  },
  {
    id: 'slider', name: 'Slider', category: 'Selection', atomicLevel: 'atom',
    description: 'Neumorphic sliders use an inset track groove with a raised circular thumb that casts outer shadows.',
    specs: [
      {property:'Track Height',value:'8px'},{property:'Thumb Size',value:'24px'},
      {property:'Track Shadow',value:'inset'},{property:'Thumb Shadow',value:'out'},
      {property:'Fill',value:'primary gradient'}
    ],
    guidelines: [
      'The track is a groove (inset shadow).',
      'The thumb is a raised circle (outer shadow).',
      'Fill uses a gradient of the primary color.',
      'On drag, thumb shadow can intensify.'
    ],
    variants: ['Continuous'],
    render(el) {
      el.innerHTML = `
        <div style="width:100%;max-width:300px">
          <div class="demo-variant-label">Slider (60%)</div>
          <div class="nm-slider">
            <div class="nm-slider-track" style="width:60%"></div>
            <div class="nm-slider-thumb" style="left:60%"></div>
          </div>
          <div class="demo-variant-label" style="margin-top:24px">Slider (30%)</div>
          <div class="nm-slider">
            <div class="nm-slider-track" style="width:30%"></div>
            <div class="nm-slider-thumb" style="left:30%"></div>
          </div>
        </div>`;
    },
    renderDemo() {
      return `<div style="width:80%"><div class="nm-slider" style="pointer-events:none"><div class="nm-slider-track" style="width:50%"></div><div class="nm-slider-thumb" style="left:50%"></div></div></div>`;
    },
    lisp: makeLisp('Slider','slider',['Continuous','Discrete'],{shadow:'in',radius:9999,height:24,minWidth:120})
  },
  {
    id: 'switch', name: 'Switch', category: 'Selection', atomicLevel: 'atom',
    description: 'Neumorphic switches have an inset track and a raised thumb that slides between positions. The on-state thumb glows with the primary color.',
    specs: [
      {property:'Track Size',value:'56x30px'},{property:'Thumb Size',value:'24px'},
      {property:'Track Shadow',value:'inset'},{property:'Thumb Shadow',value:'out-sm'},
      {property:'On Thumb',value:'primary color + glow shadow'}
    ],
    guidelines: [
      'Track is an inset groove matching the surface color.',
      'Off-thumb is surface-colored with outer shadow.',
      'On-thumb changes to primary color with a subtle colored glow.',
      'Effect should immediately indicate toggle state.'
    ],
    variants: ['Off','On'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">Interactive Switches</div>
        <div style="display:flex;flex-direction:column;gap:16px">
          <label style="display:flex;align-items:center;gap:16px;cursor:pointer">
            <div class="nm-switch on" onclick="event.stopPropagation();this.classList.toggle('on')"></div>
            <span>Wi-Fi (on)</span>
          </label>
          <label style="display:flex;align-items:center;gap:16px;cursor:pointer">
            <div class="nm-switch" onclick="event.stopPropagation();this.classList.toggle('on')"></div>
            <span>Bluetooth (off)</span>
          </label>
          <label style="display:flex;align-items:center;gap:16px;cursor:pointer">
            <div class="nm-switch on" onclick="event.stopPropagation();this.classList.toggle('on')"></div>
            <span>Dark mode (on)</span>
          </label>
        </div>`;
    },
    renderDemo() {
      return `<div style="display:flex;gap:8px"><div class="nm-switch on" style="pointer-events:none"></div><div class="nm-switch" style="pointer-events:none"></div></div>`;
    },
    lisp: makeLisp('Switch','switch',['Off','On'],{shadow:'in',radius:9999,height:30,minWidth:56})
  },

  // ─── TEXT INPUT ───
  {
    id: 'textfield', name: 'Text Field', category: 'Text Input', atomicLevel: 'molecule',
    description: 'Neumorphic text fields use inset shadows to create a groove where the user types. On focus, the inset deepens.',
    specs: [
      {property:'Height',value:'~52px'},{property:'Border Radius',value:'16px'},
      {property:'Shadow (default)',value:'inset'},{property:'Shadow (focused)',value:'inset-lg'},
      {property:'Background',value:'matches surface'}
    ],
    guidelines: [
      'Text fields are always inset — they look like grooves in the surface.',
      'On focus, the shadow deepens to indicate the active field.',
      'Labels sit above the field, not inside (to avoid contrast issues).',
      'No borders are used — shadow alone defines the field.',
      'Placeholder text should be lighter than input text.'
    ],
    variants: ['Default','Focused'],
    render(el) {
      el.innerHTML = `
        <div class="demo-variant-label">With Label</div>
        <div class="nm-textfield"><label>Username</label><input type="text" value="john_doe"></div>
        <div class="nm-textfield"><label>Email</label><input type="email" placeholder="Enter email"></div>
        <div class="demo-variant-label">Without Label</div>
        <div class="nm-textfield"><input type="text" placeholder="Type to search..."></div>`;
    },
    renderDemo() {
      return `<div class="nm-textfield" style="pointer-events:none"><label style="font-size:10px">Label</label><input type="text" value="Text field" style="font-size:12px;padding:10px 14px;min-width:150px"></div>`;
    },
    lisp: makeLisp('Text Field','textfield',['Default','Focused'],{shadow:'in',radius:16,height:52,minWidth:200})
  },
];

/* ============================================
   Interactive Demo Helpers
   ============================================ */
function navbarSelect(el) {
  el.closest('.nm-navbar').querySelectorAll('.nm-navbar-item').forEach(i=>i.classList.remove('active'));
  el.classList.add('active');
}

function navrailSelect(el) {
  el.closest('.nm-navrail').querySelectorAll('.nm-navrail-item').forEach(i=>i.classList.remove('active'));
  el.classList.add('active');
}

function tabSelect(el) {
  el.closest('.nm-tabs').querySelectorAll('.nm-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
}

function radioSelect(label) {
  const group = label.parentElement;
  group.querySelectorAll('.nm-radio').forEach(r=>r.classList.remove('selected'));
  label.querySelector('.nm-radio').classList.add('selected');
}

/* ============================================
   Syntax Highlighting
   ============================================ */
function highlightLisp(code) {
  let html = code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  html = html.replace(/(;[^\n]*)/g, '<span class="comment">$1</span>');
  html = html.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="string">$1</span>');
  const keywords = ['defun','defn','define','define/contract','defmacro','let','let\\*','letfn','lambda','fn','cond','case','match','if','when','unless','and','or','not','do','loop','for','for/and','for/list','require','provide','import','ns','in-package','defpackage','declare','->','->>'];
  const kwRegex = new RegExp('(?<=\\(|\\s)(' + keywords.join('|').replace(/[*+?]/g,'\\$&') + ')(?=\\s|\\))', 'g');
  html = html.replace(kwRegex, '<span class="keyword">$1</span>');
  const builtins = ['list','cons','car','cdr','map','filter','reduce','apply','values','hash-map','vector','assoc','get','first','rest','println','display','format','printf','every\\?','some\\?','member','eq','eql','equal','>=','<=','>','<','=','/=','\\+','-','\\*','/','null\\?','nil\\?','empty\\?','zero\\?','number\\?','string\\?','boolean\\?','pair\\?','list\\?','struct','defstruct','class','hash','hash-ref','str','contains\\?','getf','assoc-ref','string-append','contrast-ratio','color-distance','darken','lighten','not'];
  const biRegex = new RegExp('(?<=\\(|\\s)(' + builtins.join('|') + ')(?=\\s|\\))', 'g');
  html = html.replace(biRegex, '<span class="builtin">$1</span>');
  html = html.replace(/(:[a-zA-Z_-][a-zA-Z0-9_-]*)/g, '<span class="symbol">$1</span>');
  html = html.replace(/(?<=\s|[\(\)])(\d+\.?\d*)/g, '<span class="number">$1</span>');
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

function navigate(hash) { location.hash = hash; }

function initRouter() {
  window.addEventListener('hashchange', () => renderRoute());
  renderRoute();
}

function renderRoute() {
  const {path, param} = getRoute();
  const content = document.getElementById('content');
  content.style.animation = 'none';
  content.offsetHeight;
  content.style.animation = 'fadeIn var(--t-med)';
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
  if (param) document.querySelector(`[data-component="${param}"]`)?.classList.add('active');
}

function populateSidebar() {
  const container = document.getElementById('categoryLinks');
  const categories = [...new Set(COMPONENTS.map(c=>c.category))];
  let html = '';
  for (const cat of categories) {
    html += `<div class="nav-category-label">${cat}</div>`;
    for (const comp of COMPONENTS.filter(c=>c.category===cat)) {
      html += `<a href="#/component/${comp.id}" class="nav-component-link" data-component="${comp.id}">${comp.name}</a>`;
    }
  }
  container.innerHTML = html;
}

/* ============================================
   Components Overview
   ============================================ */
function renderComponentsOverview(container) {
  const categories = [...new Set(COMPONENTS.map(c=>c.category))];
  let html = `
    <div class="page-header">
      <h1 class="page-title">Components</h1>
      <p class="page-description">Explore neumorphic (Soft UI) components with live demos, styling logic as first-order predicates in Lisp, and atomic design classification.</p>
    </div>`;
  for (const cat of categories) {
    html += `<div class="category-group"><h2 class="category-title">${cat}</h2><div class="card-grid">`;
    for (const comp of COMPONENTS.filter(c=>c.category===cat)) {
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
   Component Detail
   ============================================ */
function renderComponentDetail(container, id) {
  const comp = COMPONENTS.find(c=>c.id===id);
  if (!comp) { container.innerHTML = '<p>Component not found.</p>'; return; }
  const dialects = [
    {key:'commonLisp',label:'Common Lisp'},{key:'scheme',label:'Scheme'},
    {key:'clojure',label:'Clojure'},{key:'racket',label:'Racket'}
  ];
  let specsHtml = '';
  if (comp.specs?.length) {
    specsHtml = `<h2 class="demo-section-title">Specifications</h2><table class="specs-table"><thead><tr><th>Property</th><th>Value</th></tr></thead><tbody>`;
    for (const s of comp.specs) specsHtml += `<tr><td>${s.property}</td><td>${s.value}</td></tr>`;
    specsHtml += '</tbody></table>';
  }
  let guidelinesHtml = '';
  if (comp.guidelines?.length) {
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
      <p class="page-description" style="margin-bottom:var(--sp-xl)">${comp.description}</p>
      <div class="demo-section">
        <h2 class="demo-section-title">Live Demo</h2>
        <div class="demo-area" id="demoArea"></div>
      </div>
      ${specsHtml}${guidelinesHtml}
      <div class="code-section">
        <h2 class="demo-section-title">Styling Logic (First-Order Predicates)</h2>
        ${tabsHtml}${codeBlocksHtml}
      </div>
    </div>`;
  document.getElementById('demoArea') && comp.render(document.getElementById('demoArea'));
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
  const text = btn.parentElement.querySelector('.code-block').textContent;
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
      <p class="page-description">Customize the neumorphic surface, shadows, and accent colors using a palette or by extracting colors from an image.</p>
    </div>
    <div class="theme-sections">
      <section>
        <h2 class="section-title">Image Color Extraction</h2>
        <div class="upload-zone" id="uploadZone">
          <div class="upload-zone-icon">&#x1F3A8;</div>
          <p class="upload-zone-text">Drag & drop an image or click to upload</p>
          <p class="upload-zone-hint">Colors will be extracted and mapped to neumorphic tokens</p>
          <input type="file" id="imageInput" accept="image/*" style="display:none">
        </div>
        <div id="extractedResult"></div>
      </section>
      <section>
        <h2 class="section-title">ColorHunt Palettes <span style="font-weight:400;font-size:var(--fs-body-sm);color:var(--nm-text-muted)">(${typeof PALETTES!=='undefined'?PALETTES.length:0} palettes)</span></h2>
        <div class="palette-grid" id="paletteGrid"></div>
        <div id="paletteSentinel" style="height:1px"></div>
      </section>
    </div>`;
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
      <div class="palette-colors">${colors.map(c=>`<div class="palette-color-bar" style="background:${c}" title="${c}"></div>`).join('')}</div>
      <div class="palette-info">
        <span>${colors.map(c=>c.toUpperCase()).join(' ')}</span>
        <span class="palette-likes">${p.likes>=1000?(p.likes/1000).toFixed(1)+'k':p.likes} &#x2665;</span>
      </div>`;
    card.addEventListener('click', () => {
      document.querySelectorAll('.palette-card').forEach(c=>c.classList.remove('selected'));
      card.classList.add('selected');
      applyTheme(colors);
    });
    card.addEventListener('keydown', e => { if (e.key==='Enter') card.click(); });
    grid.appendChild(card);
  }
  paletteLoadCount = end;
}

function initPaletteLazyLoad() {
  const sentinel = document.getElementById('paletteSentinel');
  if (!sentinel || typeof PALETTES === 'undefined') return;
  if (paletteObserver) paletteObserver.disconnect();
  paletteObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && paletteLoadCount < PALETTES.length) loadPaletteBatch();
  }, { rootMargin: '200px' });
  paletteObserver.observe(sentinel);
}

function initUploadZone() {
  const zone = document.getElementById('uploadZone');
  const input = document.getElementById('imageInput');
  if (!zone || !input) return;
  zone.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleImageFile(e.dataTransfer.files[0]);
  });
  input.addEventListener('change', () => { if (input.files.length) handleImageFile(input.files[0]); });
}

function handleImageFile(file) {
  const reader = new FileReader();
  reader.onload = e => {
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
      <img src="${imgSrc}" style="width:80px;height:80px;object-fit:cover;border-radius:var(--radius-md);box-shadow:var(--nm-shadow-out-sm)">
      ${colors.map((c,i) => `
        <div class="extracted-swatch">
          <label>${['Primary','Accent','Surface','Text'][i]}</label>
          <div class="color-input-wrapper">
            <input type="color" value="${c}" data-idx="${i}" onchange="updateExtractedColor(this)">
          </div>
        </div>`).join('')}
      <button class="apply-theme-btn" onclick="applyExtractedTheme()">Apply Theme</button>
    </div>`;
  window._extractedColors = [...colors];
}

function updateExtractedColor(input) {
  if (window._extractedColors) window._extractedColors[parseInt(input.dataset.idx)] = input.value;
}

function applyExtractedTheme() {
  if (window._extractedColors) applyTheme(window._extractedColors);
}

/* ============================================
   Atomic Design Page
   ============================================ */
function renderAtomicDesign(container) {
  const levels = [
    { name:'Atoms', cls:'atoms', num:1,
      desc:'Atoms are the smallest building blocks — individual UI elements that cannot be broken down further. In neumorphism, each atom carries its own shadow state (raised, pressed, or flat).',
      renderDemo: renderAtomsDemos },
    { name:'Molecules', cls:'molecules', num:2,
      desc:'Molecules combine atoms into functional groups. A neumorphic search bar is a molecule: an inset text field atom combined with icon button atoms.',
      renderDemo: renderMoleculesDemos },
    { name:'Organisms', cls:'organisms', num:3,
      desc:'Organisms are complex UI sections composed of molecules and atoms. A neumorphic header organism combines a top bar, search molecule, and icon button atoms.',
      renderDemo: renderOrganismsDemos },
    { name:'Templates', cls:'templates', num:4,
      desc:'Templates define page layouts with placeholder content. They show how organisms arrange on a neumorphic surface.',
      renderDemo: renderTemplatesDemos },
    { name:'Pages', cls:'pages', num:5,
      desc:'Pages are templates filled with real content. They validate the neumorphic design system end-to-end with actual data.',
      renderDemo: renderPagesDemos }
  ];

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Atomic Design</h1>
      <p class="page-description">A methodology for creating design systems in five levels, from individual atoms to complete pages — applied to neumorphic (Soft UI) components.</p>
    </div>
    <button class="explode-toggle" id="explodeToggle">&#x1F4A5; Explode View</button>
    <div id="atomicLevels"></div>`;

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
          ${level.num <= 3 ? `<p style="margin-top:var(--sp-sm);font-size:var(--fs-body-sm);color:var(--nm-primary)">Components: ${COMPONENTS.filter(c=>
            (level.num===1 && c.atomicLevel==='atom') ||
            (level.num===2 && c.atomicLevel==='molecule') ||
            (level.num===3 && c.atomicLevel==='organism')
          ).map(c=>`<a href="#/component/${c.id}" style="color:var(--nm-primary)">${c.name}</a>`).join(', ')}</p>` : ''}
        </div>
        <div class="atomic-level-demos explode-view" id="level-${level.cls}"></div>
      </div>`;
    levelsContainer.appendChild(section);
    level.renderDemo(section.querySelector(`#level-${level.cls}`));
  }

  document.getElementById('explodeToggle').addEventListener('click', function() {
    this.classList.toggle('active');
    document.querySelectorAll('.explode-view').forEach(v => v.classList.toggle('exploded'));
  });
}

function renderAtomsDemos(container) {
  container.innerHTML = `
    <div class="explode-part" data-part-label="Button">
      <button class="nm-button nm-button-raised">Button</button>
    </div>
    <div class="explode-part" data-part-label="Pressed Button">
      <button class="nm-button nm-button-pressed">Pressed</button>
    </div>
    <div class="explode-part" data-part-label="Checkbox">
      <div class="nm-checkbox checked" onclick="this.classList.toggle('checked')">&#x2713;</div>
    </div>
    <div class="explode-part" data-part-label="Badge">
      <span class="nm-badge">3</span>
    </div>
    <div class="explode-part" data-part-label="Switch">
      <div class="nm-switch on" onclick="this.classList.toggle('on')"></div>
    </div>
    <div class="explode-part" data-part-label="Text Input">
      <div class="nm-textfield"><label>Label</label><input type="text" placeholder="Type here"></div>
    </div>
    <div class="explode-part" data-part-label="Icon Button">
      <button class="nm-icon-button" onclick="this.classList.toggle('active')">&#x2606;</button>
    </div>
    <div class="explode-part" data-part-label="Divider" style="width:100%">
      <div class="nm-divider"></div>
    </div>`;
}

function renderMoleculesDemos(container) {
  container.innerHTML = `
    <div class="explode-part" data-part-label="Search Bar" style="width:100%">
      <div class="nm-search-bar">
        <span>&#x1F50D;</span>
        <input type="text" placeholder="Search components...">
        <button class="nm-icon-button" style="width:32px;height:32px;font-size:14px">&#x2716;</button>
      </div>
    </div>
    <div class="explode-part" data-part-label="List Item" style="width:100%">
      <div class="nm-list-item">
        <div class="nm-list-item-icon">&#x1F4C4;</div>
        <div class="nm-list-item-text">
          <div class="primary">List Item Title</div>
          <div class="secondary">Supporting text</div>
        </div>
        <span class="nm-badge">5</span>
      </div>
    </div>
    <div class="explode-part" data-part-label="Chip Group">
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="nm-chip selected" onclick="this.classList.toggle('selected')">Filter A</button>
        <button class="nm-chip" onclick="this.classList.toggle('selected')">Filter B</button>
        <button class="nm-chip" onclick="this.classList.toggle('selected')">Filter C</button>
      </div>
    </div>`;
}

function renderOrganismsDemos(container) {
  container.innerHTML = `
    <div class="explode-part" data-part-label="Top App Bar" style="width:100%">
      <div class="nm-topbar">
        <button class="nm-icon-button" style="width:36px;height:36px">&#x2630;</button>
        <span class="nm-topbar-title">App Title</span>
        <div class="nm-search-bar" style="min-width:160px;max-width:220px;padding:6px 12px">
          <span>&#x1F50D;</span><input type="text" placeholder="Search..." style="font-size:13px">
        </div>
        <button class="nm-icon-button" style="width:36px;height:36px">&#x2699;</button>
      </div>
    </div>
    <div class="explode-part" data-part-label="Card">
      <div class="nm-card" style="max-width:240px">
        <div class="nm-card-media"></div>
        <div class="nm-card-content">
          <h3>Card Title</h3>
          <p>Soft UI card with dual shadow.</p>
        </div>
        <div class="nm-card-actions">
          <button class="nm-button nm-button-flat" style="padding:6px 10px;font-size:12px;min-height:28px">Action</button>
          <button class="nm-button nm-button-primary" style="padding:6px 10px;font-size:12px;min-height:28px">Primary</button>
        </div>
      </div>
    </div>
    <div class="explode-part" data-part-label="Dialog">
      <div class="nm-dialog" style="max-width:240px;padding:16px">
        <div class="nm-dialog-title" style="font-size:18px">Confirm</div>
        <div class="nm-dialog-content" style="font-size:13px">Proceed with this action?</div>
        <div class="nm-dialog-actions">
          <button class="nm-button nm-button-flat" style="font-size:12px;padding:6px 10px;min-height:28px">Cancel</button>
          <button class="nm-button nm-button-primary" style="font-size:12px;padding:6px 10px;min-height:28px">OK</button>
        </div>
      </div>
    </div>`;
}

function renderTemplatesDemos(container) {
  container.innerHTML = `
    <div class="nm-template" style="width:100%">
      <div class="nm-template-header explode-part" data-part-label="Header Organism">
        &#x2630; &nbsp; App Title &nbsp;&nbsp; [Search] &nbsp;&nbsp; &#x2699;
      </div>
      <div class="nm-template-nav explode-part" data-part-label="Nav Rail">
        <div>&#x1F3E0;</div><div>&#x1F4E6;</div><div>&#x2699;</div>
      </div>
      <div class="nm-template-content">
        <div class="nm-template-placeholder full-width explode-part" data-part-label="Hero">Hero / Banner</div>
        <div class="nm-template-placeholder explode-part" data-part-label="Card">Card</div>
        <div class="nm-template-placeholder explode-part" data-part-label="Card">Card</div>
        <div class="nm-template-placeholder explode-part" data-part-label="Card">Card</div>
        <div class="nm-template-placeholder explode-part" data-part-label="Card">Card</div>
      </div>
    </div>`;
}

function renderPagesDemos(container) {
  container.innerHTML = `
    <div class="nm-template" style="width:100%">
      <div class="nm-template-header explode-part" data-part-label="Header">
        <div style="display:flex;align-items:center;gap:8px;width:100%">
          <button class="nm-icon-button" style="width:32px;height:32px;font-size:14px;box-shadow:none">&#x2630;</button>
          <strong style="flex:1;color:var(--nm-text)">Neumorphism</strong>
          <div class="nm-search-bar" style="min-width:100px;max-width:160px;padding:4px 8px">
            <span style="font-size:12px">&#x1F50D;</span><input type="text" placeholder="Search..." style="font-size:11px">
          </div>
        </div>
      </div>
      <div class="nm-template-nav explode-part" data-part-label="Navigation">
        <div style="font-size:16px">&#x1F3E0;</div>
        <div style="font-size:16px">&#x1F4E6;</div>
        <div style="font-size:16px">&#x1F3A8;</div>
      </div>
      <div class="nm-template-content explode-part" data-part-label="Content">
        <div style="grid-column:1/-1;margin-bottom:4px">
          <strong style="font-size:var(--fs-title);color:var(--nm-text)">Featured</strong>
        </div>
        <div class="nm-card" style="font-size:12px">
          <div class="nm-card-media" style="height:50px"></div>
          <div class="nm-card-content" style="padding:8px"><h3 style="font-size:12px">Button</h3><p style="font-size:10px">Soft actions</p></div>
        </div>
        <div class="nm-card" style="font-size:12px">
          <div class="nm-card-media" style="height:50px;background:linear-gradient(135deg,var(--nm-accent-light),var(--nm-primary-light))"></div>
          <div class="nm-card-content" style="padding:8px"><h3 style="font-size:12px">Card</h3><p style="font-size:10px">Container</p></div>
        </div>
        <div class="nm-card" style="font-size:12px">
          <div class="nm-card-media" style="height:50px;background:linear-gradient(135deg,var(--nm-primary),var(--nm-accent))"></div>
          <div class="nm-card-content" style="padding:8px"><h3 style="font-size:12px">Switch</h3><p style="font-size:10px">Toggle</p></div>
        </div>
        <div class="nm-card" style="font-size:12px">
          <div class="nm-card-media" style="height:50px;background:linear-gradient(135deg,var(--nm-accent),var(--nm-primary-light))"></div>
          <div class="nm-card-content" style="padding:8px"><h3 style="font-size:12px">Dialog</h3><p style="font-size:10px">Prompts</p></div>
        </div>
      </div>
    </div>`;
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
