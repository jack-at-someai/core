/* ============================================
   Show Animal Skill Tree — Canvas Renderer
   ============================================ */

// ── State ──
let currentSpecies = 'pig';
let nodes = [];
let edges = [];
let ageRings = [];
let allocated = new Set();
let selectedNodeId = null;
let hoveredNodeId = null;

// ── Camera ──
let cam = { x: 0, y: 0, zoom: 0.55 };
let dragStart = null;
let isDragging = false;

// ── Canvas ──
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');
let dpr = window.devicePixelRatio || 1;
let W, H;

// ── Constants ──
const NODE_RADIUS = { minor: 8, notable: 13, keystone: 18 };
const CATEGORY_COLORS = {
  health: '#22c55e',
  conformation: '#3b82f6',
  training: '#f59e0b',
  genetics: '#ec4899',
  management: '#8b5cf6',
  nutrition: '#14b8a6'
};

/* ============================================
   Init
   ============================================ */
function init() {
  resize();
  window.addEventListener('resize', resize);
  loadSpecies(currentSpecies);
  setupInput();
  draw();
}

function resize() {
  dpr = window.devicePixelRatio || 1;
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw();
}

/* ============================================
   Species Loading
   ============================================ */
function selectSpecies(species) {
  currentSpecies = species;
  document.querySelectorAll('.species-btn').forEach(b => b.classList.toggle('active', b.dataset.species === species));
  loadSpecies(species);
  centerTree();
}

function loadSpecies(species) {
  if (!SPECIES_TREES || !SPECIES_TREES[species]) return;
  const tree = SPECIES_TREES[species];
  nodes = tree.nodes.map(n => ({...n, allocated: false}));
  edges = [...tree.edges];
  ageRings = AGE_RINGS[species] || [];
  allocated = new Set();
  // Auto-allocate birth node
  const birth = nodes.find(n => n.id.includes('birth'));
  if (birth) {
    birth.allocated = true;
    allocated.add(birth.id);
  }
  selectedNodeId = null;
  updateInfoPanel(null);
  updatePointCounter();
  draw();
}

function resetTree() {
  allocated = new Set();
  nodes.forEach(n => n.allocated = false);
  const birth = nodes.find(n => n.id.includes('birth'));
  if (birth) {
    birth.allocated = true;
    allocated.add(birth.id);
  }
  selectedNodeId = null;
  updateInfoPanel(null);
  updatePointCounter();
  draw();
}

function centerTree() {
  cam.x = 0;
  cam.y = 0;
  cam.zoom = 0.55;
  draw();
}

/* ============================================
   Input Handling (Pan, Zoom, Click, Hover)
   ============================================ */
function setupInput() {
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('wheel', onWheel, { passive: false });
  canvas.addEventListener('dblclick', onDblClick);
  // Touch
  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  canvas.addEventListener('touchmove', onTouchMove, { passive: false });
  canvas.addEventListener('touchend', onTouchEnd);
}

function screenToWorld(sx, sy) {
  return {
    x: (sx - W/2) / cam.zoom + cam.x,
    y: (sy - H/2) / cam.zoom + cam.y
  };
}

function worldToScreen(wx, wy) {
  return {
    x: (wx - cam.x) * cam.zoom + W/2,
    y: (wy - cam.y) * cam.zoom + H/2
  };
}

function nodeAt(sx, sy) {
  const world = screenToWorld(sx, sy);
  let best = null, bestDist = Infinity;
  for (const n of nodes) {
    const r = NODE_RADIUS[n.type] || 8;
    const hitR = Math.max(r, 14) / cam.zoom;
    const d = Math.hypot(n.x - world.x, n.y - world.y);
    if (d < hitR && d < bestDist) { best = n; bestDist = d; }
  }
  return best;
}

function onMouseDown(e) {
  dragStart = { x: e.clientX, y: e.clientY, camX: cam.x, camY: cam.y };
  isDragging = false;
}

function onMouseMove(e) {
  if (dragStart) {
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isDragging = true;
    if (isDragging) {
      cam.x = dragStart.camX - dx / cam.zoom;
      cam.y = dragStart.camY - dy / cam.zoom;
      draw();
    }
  }
  // Hover
  const node = nodeAt(e.clientX, e.clientY);
  if (node !== hoveredNodeId) {
    hoveredNodeId = node ? node.id : null;
    updateTooltip(node, e.clientX, e.clientY);
    canvas.style.cursor = node ? 'pointer' : 'grab';
    draw();
  } else if (node) {
    updateTooltipPos(e.clientX, e.clientY);
  }
}

function onMouseUp(e) {
  if (!isDragging) {
    const node = nodeAt(e.clientX, e.clientY);
    if (node) {
      selectedNodeId = node.id;
      updateInfoPanel(node);
      draw();
    }
  }
  dragStart = null;
  isDragging = false;
}

function onDblClick(e) {
  const node = nodeAt(e.clientX, e.clientY);
  if (node) toggleAllocate(node);
}

function onWheel(e) {
  e.preventDefault();
  const factor = e.deltaY > 0 ? 0.9 : 1.1;
  const newZoom = Math.max(0.15, Math.min(3, cam.zoom * factor));
  // Zoom toward cursor
  const world = screenToWorld(e.clientX, e.clientY);
  cam.zoom = newZoom;
  const newWorld = screenToWorld(e.clientX, e.clientY);
  cam.x -= (newWorld.x - world.x);
  cam.y -= (newWorld.y - world.y);
  draw();
}

// Touch support
let lastTouchDist = 0;
function onTouchStart(e) {
  if (e.touches.length === 1) {
    dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, camX: cam.x, camY: cam.y };
    isDragging = false;
  } else if (e.touches.length === 2) {
    lastTouchDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
  }
  e.preventDefault();
}

function onTouchMove(e) {
  if (e.touches.length === 1 && dragStart) {
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isDragging = true;
    if (isDragging) {
      cam.x = dragStart.camX - dx / cam.zoom;
      cam.y = dragStart.camY - dy / cam.zoom;
      draw();
    }
  } else if (e.touches.length === 2) {
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    if (lastTouchDist > 0) {
      cam.zoom = Math.max(0.15, Math.min(3, cam.zoom * (dist / lastTouchDist)));
      draw();
    }
    lastTouchDist = dist;
  }
  e.preventDefault();
}

function onTouchEnd(e) {
  if (e.changedTouches.length && !isDragging) {
    const t = e.changedTouches[0];
    const node = nodeAt(t.clientX, t.clientY);
    if (node) {
      selectedNodeId = node.id;
      updateInfoPanel(node);
      draw();
    }
  }
  dragStart = null;
  isDragging = false;
  lastTouchDist = 0;
}

/* ============================================
   Allocation Logic
   ============================================ */
function isAvailable(node) {
  if (node.allocated) return false;
  // Must be adjacent to an allocated node
  for (const e of edges) {
    if ((e.from === node.id && allocated.has(e.to)) ||
        (e.to === node.id && allocated.has(e.from))) {
      return true;
    }
  }
  return false;
}

function canDeallocate(node) {
  if (!node.allocated) return false;
  if (node.id.includes('birth')) return false;
  // Check that removing this node doesn't disconnect any other allocated node
  const testSet = new Set(allocated);
  testSet.delete(node.id);
  // BFS from birth
  const birth = nodes.find(n => n.id.includes('birth'));
  if (!birth) return true;
  const visited = new Set([birth.id]);
  const queue = [birth.id];
  while (queue.length) {
    const cur = queue.shift();
    for (const e of edges) {
      const neighbor = e.from === cur ? e.to : (e.to === cur ? e.from : null);
      if (neighbor && testSet.has(neighbor) && !visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  // All allocated nodes (minus removed) must be visited
  for (const id of testSet) {
    if (!visited.has(id)) return false;
  }
  return true;
}

function toggleAllocate(node) {
  if (node.allocated) {
    if (canDeallocate(node)) {
      node.allocated = false;
      allocated.delete(node.id);
    }
  } else if (isAvailable(node)) {
    node.allocated = true;
    allocated.add(node.id);
  }
  updateInfoPanel(node);
  updatePointCounter();
  draw();
}

function getMaxAllocatedAge() {
  let maxAge = 'Birth';
  for (const n of nodes) {
    if (n.allocated && n.age) maxAge = n.age;
  }
  return maxAge;
}

function updatePointCounter() {
  const counter = document.getElementById('pointCounter');
  const count = allocated.size;
  const maxAge = getMaxAllocatedAge();
  counter.textContent = `Nodes: ${count} | Age: ${maxAge}`;
}

/* ============================================
   Tooltip
   ============================================ */
function updateTooltip(node, mx, my) {
  const tip = document.getElementById('tooltip');
  if (!node) { tip.classList.remove('visible'); return; }
  tip.innerHTML = `<div>${node.name}</div><div class="tooltip-type">${node.type} — ${node.category}</div>`;
  tip.classList.add('visible');
  updateTooltipPos(mx, my);
}

function updateTooltipPos(mx, my) {
  const tip = document.getElementById('tooltip');
  tip.style.left = (mx + 16) + 'px';
  tip.style.top = (my - 10) + 'px';
}

/* ============================================
   Info Panel
   ============================================ */
function updateInfoPanel(node) {
  const icon = document.getElementById('infoPanelIcon');
  const title = document.getElementById('infoPanelTitle');
  const type = document.getElementById('infoPanelType');
  const body = document.getElementById('infoPanelBody');

  if (!node) {
    icon.textContent = '';
    title.textContent = 'Select a Node';
    type.textContent = '';
    body.innerHTML = '<p class="info-hint">Click any node on the tree to see details. Double-click or use the button to allocate/deallocate nodes to plan your animal\'s trajectory.</p>';
    return;
  }

  const catColor = CATEGORY_COLORS[node.category] || '#94a3b8';
  icon.textContent = categoryIcon(node.category);
  icon.style.border = `2px solid ${catColor}`;
  title.textContent = node.name;
  type.textContent = `${node.type} • ${node.category}`;
  type.style.color = catColor;

  let html = '';
  if (node.description) {
    html += `<p class="info-description">${node.description}</p>`;
  }

  html += `<ul class="info-stats">
    <li class="info-stat"><span class="info-stat-label">Age</span><span class="info-stat-value">${node.age || '—'}</span></li>
    <li class="info-stat"><span class="info-stat-label">Type</span><span class="info-stat-value">${node.type}</span></li>
    <li class="info-stat"><span class="info-stat-label">Category</span><span class="info-stat-value" style="color:${catColor}">${node.category}</span></li>
    <li class="info-stat"><span class="info-stat-label">Status</span><span class="info-stat-value">${node.allocated ? '&#x2713; Allocated' : isAvailable(node) ? 'Available' : 'Locked'}</span></li>
  </ul>`;

  if (node.bonuses && node.bonuses.length) {
    html += '<ul class="info-bonuses">';
    for (const b of node.bonuses) html += `<li class="info-bonus">${b}</li>`;
    html += '</ul>';
  }

  if (node.note) {
    html += `<p class="info-note">${node.note}</p>`;
  }

  // Allocate button
  if (node.allocated && canDeallocate(node)) {
    html += `<button class="info-allocate-btn deallocate" onclick="toggleAllocateById('${node.id}')">Remove from Plan</button>`;
  } else if (!node.allocated && isAvailable(node)) {
    html += `<button class="info-allocate-btn allocate" onclick="toggleAllocateById('${node.id}')">Add to Plan</button>`;
  } else if (!node.allocated) {
    html += `<button class="info-allocate-btn" disabled>Locked — Allocate adjacent nodes first</button>`;
  }

  body.innerHTML = html;
}

function toggleAllocateById(id) {
  const node = nodes.find(n => n.id === id);
  if (node) toggleAllocate(node);
}

function categoryIcon(cat) {
  switch(cat) {
    case 'health': return '&#x2764;';
    case 'conformation': return '&#x1F4CF;';
    case 'training': return '&#x1F3C6;';
    case 'genetics': return '&#x1F9EC;';
    case 'management': return '&#x1F4CB;';
    case 'nutrition': return '&#x1F33E;';
    default: return '&#x2B50;';
  }
}

/* ============================================
   Canvas Drawing
   ============================================ */
function draw() {
  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = '#0a0e17';
  ctx.fillRect(0, 0, W, H);

  // Subtle radial gradient from center
  const center = worldToScreen(0, 0);
  const grad = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, 600 * cam.zoom);
  grad.addColorStop(0, 'rgba(59, 130, 246, 0.04)');
  grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.02)');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Age rings
  drawAgeRings();

  // Edges
  drawEdges();

  // Nodes
  drawNodes();
}

function drawAgeRings() {
  const c = worldToScreen(0, 0);
  ctx.setLineDash([4, 8]);
  for (const ring of ageRings) {
    const r = ring.radius * cam.zoom;
    if (r < 5) continue;
    ctx.beginPath();
    ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.07)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Label
    if (r > 30) {
      ctx.font = `${Math.max(9, Math.min(12, 11 * cam.zoom))}px Inter, sans-serif`;
      ctx.fillStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.textAlign = 'center';
      ctx.fillText(ring.label, c.x, c.y - r - 4);
    }
  }
  ctx.setLineDash([]);
}

function drawEdges() {
  for (const e of edges) {
    const from = nodes.find(n => n.id === e.from);
    const to = nodes.find(n => n.id === e.to);
    if (!from || !to) continue;

    const p1 = worldToScreen(from.x, from.y);
    const p2 = worldToScreen(to.x, to.y);

    // Determine edge state
    const bothAllocated = from.allocated && to.allocated;
    const oneAllocated = from.allocated || to.allocated;
    const eitherAvail = isAvailable(from) || isAvailable(to);

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);

    if (bothAllocated) {
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.7)';
      ctx.lineWidth = 2.5 * cam.zoom;
      // Glow
      ctx.shadowColor = 'rgba(226, 232, 240, 0.3)';
      ctx.shadowBlur = 6;
    } else if (oneAllocated || eitherAvail) {
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.5)';
      ctx.lineWidth = 1.5 * cam.zoom;
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    } else {
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.8)';
      ctx.lineWidth = 1 * cam.zoom;
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }

    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }
}

function drawNodes() {
  // Draw in order: minor, notable, keystone (so keystones are on top)
  const sorted = [...nodes].sort((a, b) => {
    const order = { minor: 0, notable: 1, keystone: 2 };
    return (order[a.type] || 0) - (order[b.type] || 0);
  });

  for (const node of sorted) {
    const pos = worldToScreen(node.x, node.y);
    const r = (NODE_RADIUS[node.type] || 8) * cam.zoom;
    const catColor = CATEGORY_COLORS[node.category] || '#94a3b8';
    const isHovered = hoveredNodeId === node.id;
    const isSelected = selectedNodeId === node.id;
    const avail = isAvailable(node);

    // Skip tiny nodes when zoomed out
    if (r < 1.5) continue;

    ctx.save();

    if (node.type === 'keystone') {
      // Keystone: diamond/octagon shape with glow
      drawKeystoneNode(pos.x, pos.y, r, node, catColor, isHovered, isSelected, avail);
    } else if (node.type === 'notable') {
      // Notable: larger circle with colored border
      drawNotableNode(pos.x, pos.y, r, node, catColor, isHovered, isSelected, avail);
    } else {
      // Minor: simple circle
      drawMinorNode(pos.x, pos.y, r, node, catColor, isHovered, isSelected, avail);
    }

    ctx.restore();

    // Node label (only when zoomed in enough)
    if (r > 8 && cam.zoom > 0.35) {
      ctx.font = `${Math.max(8, Math.min(12, 10 * cam.zoom))}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = node.allocated ? 'rgba(226,232,240,0.9)' : 'rgba(148,163,184,0.5)';
      const labelY = pos.y + r + 12 * cam.zoom;
      ctx.fillText(node.name, pos.x, labelY, 120 * cam.zoom);
    }
  }
}

function drawMinorNode(x, y, r, node, catColor, hovered, selected, avail) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);

  if (node.allocated) {
    ctx.fillStyle = catColor;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Glow
    ctx.shadowColor = catColor;
    ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
  } else if (avail) {
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = 'rgba(100,116,139,0.8)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else {
    ctx.fillStyle = '#1a1f2e';
    ctx.fill();
    ctx.strokeStyle = 'rgba(30,41,59,0.8)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  if (hovered || selected) {
    ctx.beginPath();
    ctx.arc(x, y, r + 3, 0, Math.PI * 2);
    ctx.strokeStyle = selected ? '#f1f5f9' : 'rgba(241,245,249,0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

function drawNotableNode(x, y, r, node, catColor, hovered, selected, avail) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);

  if (node.allocated) {
    ctx.fillStyle = catColor;
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.shadowColor = catColor;
    ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
  } else if (avail) {
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else {
    ctx.fillStyle = '#1a1f2e';
    ctx.fill();
    ctx.strokeStyle = 'rgba(251,191,36,0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  if (hovered || selected) {
    ctx.beginPath();
    ctx.arc(x, y, r + 4, 0, Math.PI * 2);
    ctx.strokeStyle = selected ? '#fbbf24' : 'rgba(251,191,36,0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawKeystoneNode(x, y, r, node, catColor, hovered, selected, avail) {
  // Draw as octagon
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i / 8) - Math.PI / 8;
    const px = x + r * Math.cos(angle);
    const py = y + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();

  if (node.allocated) {
    ctx.fillStyle = catColor;
    ctx.fill();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 3;
    ctx.stroke();
    // Strong glow
    ctx.shadowColor = catColor;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i / 8) - Math.PI / 8;
      const px = x + r * Math.cos(angle);
      const py = y + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (avail) {
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    // Subtle glow
    ctx.shadowColor = 'rgba(244,63,94,0.4)';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
  } else {
    ctx.fillStyle = '#1a1f2e';
    ctx.fill();
    ctx.strokeStyle = 'rgba(244,63,94,0.25)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  if (hovered || selected) {
    ctx.beginPath();
    const outerR = r + 5;
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i / 8) - Math.PI / 8;
      const px = x + outerR * Math.cos(angle);
      const py = y + outerR * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = selected ? '#f43f5e' : 'rgba(244,63,94,0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();
    if (selected) {
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }
}

/* ============================================
   Start
   ============================================ */
document.addEventListener('DOMContentLoaded', init);
