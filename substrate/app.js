/* ============================================================
   Substrate — Knowledge Graph Explorer
   Main Application Logic (app.js)

   Expects data.js to export:
     FACTS         — Array of FACT objects
     TYPE_COLORS   — Map of FACT :TYPE to hex color
     CATEGORY_COLORS — Map of node category to hex color
   ============================================================ */

(function () {
  'use strict';

  // -----------------------------------------------------------
  // 0. References & Constants
  // -----------------------------------------------------------
  const canvas  = document.getElementById('graphCanvas');
  const ctx     = canvas.getContext('2d');
  const tooltip = document.getElementById('tooltip');

  const TYPE_COLOR_MAP = {
    NODE:     '#22d3ee',
    EDGE:     '#94a3b8',
    METRIC:   '#6366f1',
    SIGNAL:   '#f59e0b',
    PROTOCOL: '#ec4899',
  };

  const RELATIONSHIP_EDGES = new Set([
    'OWNS', 'MEMBER_OF', 'PARENT_OF', 'MANAGES', 'CREATED_BY',
    'BELONGS_TO', 'HAS', 'CONTAINS',
  ]);

  // Merge in any TYPE_COLORS or CATEGORY_COLORS from data.js
  const typeColors     = Object.assign({}, TYPE_COLOR_MAP, typeof TYPE_COLORS !== 'undefined' ? TYPE_COLORS : {});
  const categoryColors = typeof CATEGORY_COLORS !== 'undefined' ? Object.assign({}, CATEGORY_COLORS) : {};
  if (!categoryColors.DEFAULT) categoryColors.DEFAULT = '#64748b';

  // -----------------------------------------------------------
  // 1. State
  // -----------------------------------------------------------
  const nodes     = new Map();   // id -> node object
  const edges     = [];          // { id, source, target, label, fact }
  const allFacts  = typeof FACTS !== 'undefined' ? FACTS : [];

  let selectedNode  = null;
  let hoveredNode   = null;
  let physicsOn     = true;
  let currentView   = 'graph';
  let animFrameId   = null;
  let frameCount    = 0;

  // Filter state
  const activeTypes      = new Set(['NODE', 'EDGE', 'METRIC', 'SIGNAL', 'PROTOCOL']);
  const activeCategories = new Set();
  const allCategories    = new Set();

  // Camera
  const camera = { x: 0, y: 0, zoom: 1, targetZoom: 1 };

  // Drag / pan state
  let isPanning   = false;
  let isDragging  = false;
  let dragNode    = null;
  let panStart    = { x: 0, y: 0 };
  let camStart    = { x: 0, y: 0 };
  let mouseScreen = { x: 0, y: 0 };
  let lastClickTime = 0;

  // Table sort state
  let tableSortCol = ':ID';
  let tableSortAsc = true;

  // -----------------------------------------------------------
  // 2. Graph Builder
  // -----------------------------------------------------------
  function buildGraph() {
    nodes.clear();
    edges.length = 0;

    // Pass 1: Create nodes from NODE-type facts
    for (const fact of allFacts) {
      if (fact[':TYPE'] !== 'NODE') continue;
      const id       = fact[':ID'];
      const category = fact.P0 || 'UNKNOWN';
      allCategories.add(category);

      const isDate    = category === 'DATE' || category === 'TIME';
      const isSpatial = category === 'LOCATION' || category === 'PLACE' || category === 'GEO' || category === 'SPACE';

      nodes.set(id, {
        id,
        type:      fact[':TYPE'],
        category,
        fact,
        x:         0,
        y:         0,
        vx:        0,
        vy:        0,
        radius:    isDate ? 4 : 8,
        color:     categoryColors[category] || categoryColors.DEFAULT,
        pinned:    false,
        isDate,
        isSpatial,
        degree:    0,
        metrics:   [],
        signals:   [],
        protocols: [],
      });
    }

    // Pass 2: Create edges from EDGE-type facts
    for (const fact of allFacts) {
      if (fact[':TYPE'] !== 'EDGE') continue;
      const sourceId = fact.P0;
      const targetId = fact.P1;
      if (!sourceId || !targetId) continue;
      const label = fact.P2 || '';

      edges.push({
        id:     fact[':ID'],
        source: sourceId,
        target: targetId,
        label,
        fact,
      });

      // Increase degree on both endpoints
      const sn = nodes.get(sourceId);
      const tn = nodes.get(targetId);
      if (sn) sn.degree++;
      if (tn) tn.degree++;
    }

    // Pass 3: Attach metrics, signals, protocols to their P0 node
    for (const fact of allFacts) {
      const t = fact[':TYPE'];
      if (t === 'NODE' || t === 'EDGE') continue;
      const nodeId = fact.P0;
      const node   = nodes.get(nodeId);
      if (!node) continue;

      if (t === 'METRIC')   node.metrics.push(fact);
      if (t === 'SIGNAL')   node.signals.push(fact);
      if (t === 'PROTOCOL') node.protocols.push(fact);
    }

    // Pass 4: Size nodes by degree (non-date/spatial)
    for (const node of nodes.values()) {
      if (node.isDate) {
        node.radius = 4;
      } else if (node.isSpatial) {
        node.radius = 6;
      } else {
        node.radius = Math.min(12, Math.max(8, 6 + node.degree * 0.6));
      }
    }

    // Initialize category set
    activeCategories.clear();
    for (const c of allCategories) activeCategories.add(c);
  }

  // -----------------------------------------------------------
  // 3. Initial Positions
  // -----------------------------------------------------------
  function setInitialPositions() {
    const w = canvas.width / devicePixelRatio;
    const h = canvas.height / devicePixelRatio;
    const cx = w / 2;
    const cy = h / 2;

    let dateIndex = 0;
    const dateNodes = [];

    for (const node of nodes.values()) {
      if (node.isDate) {
        dateNodes.push(node);
      }
    }

    // Sort date nodes by ID for consistent ordering
    dateNodes.sort((a, b) => a.id.localeCompare(b.id));
    const dateSpacing = Math.min(60, (w - 200) / Math.max(1, dateNodes.length));

    for (const node of dateNodes) {
      node.x = cx - (dateNodes.length * dateSpacing) / 2 + dateIndex * dateSpacing;
      node.y = cy - 200;
      dateIndex++;
    }

    // Place others in a loose cluster around center
    for (const node of nodes.values()) {
      if (node.isDate) continue;
      if (node.isSpatial) {
        node.x = cx + (Math.random() - 0.5) * 400;
        node.y = cy + 150 + Math.random() * 100;
      } else {
        const angle  = Math.random() * Math.PI * 2;
        const radius = 80 + Math.random() * 200;
        node.x = cx + Math.cos(angle) * radius;
        node.y = cy + Math.sin(angle) * radius;
      }
    }
  }

  // -----------------------------------------------------------
  // 4. Force-Directed Layout
  // -----------------------------------------------------------
  const REPULSION_K    = 5000;
  const SPRING_K       = 0.003;
  const REST_LENGTH    = 80;
  const CENTER_K       = 0.0003;
  const DAMPING        = 0.92;
  const DATE_Y_K       = 0.05;
  const SPATIAL_Y_K    = 0.01;
  let   coolingFactor  = 1.0;
  let   maxVelocity    = Infinity;

  function stepPhysics() {
    if (!physicsOn) return;
    if (maxVelocity < 0.01 && coolingFactor < 0.1) return;

    const w  = canvas.width / devicePixelRatio;
    const h  = canvas.height / devicePixelRatio;
    const cx = w / 2;
    const cy = h / 2;

    const nodeArr = Array.from(nodes.values());
    const N = nodeArr.length;

    // Repulsion (all pairs)
    for (let i = 0; i < N; i++) {
      const a = nodeArr[i];
      if (a.pinned) continue;
      if (!isNodeVisible(a)) continue;

      for (let j = i + 1; j < N; j++) {
        const b = nodeArr[j];
        if (!isNodeVisible(b)) continue;

        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let distSq = dx * dx + dy * dy;
        if (distSq < 1) distSq = 1;
        const dist = Math.sqrt(distSq);
        const force = REPULSION_K / distSq;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (!a.pinned) { a.vx += fx; a.vy += fy; }
        if (!b.pinned) { b.vx -= fx; b.vy -= fy; }
      }
    }

    // Spring attraction along edges
    for (const edge of edges) {
      if (!activeTypes.has('EDGE')) continue;
      const a = nodes.get(edge.source);
      const b = nodes.get(edge.target);
      if (!a || !b) continue;
      if (!isNodeVisible(a) || !isNodeVisible(b)) continue;

      const dx   = b.x - a.x;
      const dy   = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const displacement = dist - REST_LENGTH;
      const force = SPRING_K * displacement;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      if (!a.pinned) { a.vx += fx; a.vy += fy; }
      if (!b.pinned) { b.vx -= fx; b.vy -= fy; }
    }

    // Center gravity + special constraints
    maxVelocity = 0;
    for (const node of nodeArr) {
      if (node.pinned) continue;
      if (!isNodeVisible(node)) continue;

      // Center gravity
      node.vx += (cx - node.x) * CENTER_K;
      node.vy += (cy - node.y) * CENTER_K;

      // DATE nodes: strong pull to horizontal band
      if (node.isDate) {
        const dateY = cy - 200;
        node.vy += (dateY - node.y) * DATE_Y_K;
      }

      // Spatial nodes: pull to bottom region
      if (node.isSpatial) {
        const spatialY = cy + 180;
        node.vy += (spatialY - node.y) * SPATIAL_Y_K;
      }

      // Apply damping and cooling
      node.vx *= DAMPING * coolingFactor;
      node.vy *= DAMPING * coolingFactor;

      // Integrate
      node.x += node.vx;
      node.y += node.vy;

      const v = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
      if (v > maxVelocity) maxVelocity = v;
    }

    // Cool down gradually
    if (coolingFactor > 0.05) {
      coolingFactor *= 0.9997;
    }
  }

  function togglePhysics() {
    physicsOn = !physicsOn;
    const btn = document.getElementById('physicsBtn');
    btn.textContent = 'Physics: ' + (physicsOn ? 'ON' : 'OFF');
    if (physicsOn) {
      coolingFactor = 1.0;
      maxVelocity = Infinity;
    }
  }
  window.togglePhysics = togglePhysics;

  // -----------------------------------------------------------
  // 5. Visibility helpers
  // -----------------------------------------------------------
  function isNodeVisible(node) {
    if (!activeTypes.has('NODE')) return false;
    if (!activeCategories.has(node.category)) return false;
    return true;
  }

  function isEdgeVisible(edge) {
    if (!activeTypes.has('EDGE')) return false;
    const s = nodes.get(edge.source);
    const t = nodes.get(edge.target);
    if (!s || !t) return false;
    return isNodeVisible(s) && isNodeVisible(t);
  }

  // -----------------------------------------------------------
  // 6. Canvas Renderer
  // -----------------------------------------------------------
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function screenToWorld(sx, sy) {
    return {
      x: (sx - camera.x) / camera.zoom,
      y: (sy - camera.y) / camera.zoom,
    };
  }

  function worldToScreen(wx, wy) {
    return {
      x: wx * camera.zoom + camera.x,
      y: wy * camera.zoom + camera.y,
    };
  }

  function drawFrame() {
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    // Clear
    ctx.fillStyle = '#0a0e17';
    ctx.fillRect(0, 0, w, h);

    // Camera transform
    ctx.save();
    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.zoom, camera.zoom);

    // Draw edges first
    drawEdges();

    // Draw nodes
    drawNodes();

    // Draw labels
    drawLabels();

    ctx.restore();
  }

  function drawEdges() {
    for (const edge of edges) {
      if (!isEdgeVisible(edge)) continue;
      const s = nodes.get(edge.source);
      const t = nodes.get(edge.target);
      if (!s || !t) continue;

      const label = edge.label;
      let color;

      if (label === 'NEXT' && (s.isDate || t.isDate)) {
        color = '#1e293b';
      } else if (label === 'LOCATED_IN' || label === 'LOCATION') {
        color = '#334155';
      } else if (RELATIONSHIP_EDGES.has(label)) {
        color = '#475569';
      } else {
        color = '#334155';
      }

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(t.x, t.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = RELATIONSHIP_EDGES.has(label) ? 1.2 : 0.8;
      ctx.stroke();

      // Arrowhead for directed edges
      drawArrowhead(s.x, s.y, t.x, t.y, t.radius, color);
    }
  }

  function drawArrowhead(x1, y1, x2, y2, nodeRadius, color) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const size  = 5;
    const tipX  = x2 - Math.cos(angle) * (nodeRadius + 2);
    const tipY  = y2 - Math.sin(angle) * (nodeRadius + 2);

    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(
      tipX - size * Math.cos(angle - Math.PI / 7),
      tipY - size * Math.sin(angle - Math.PI / 7)
    );
    ctx.lineTo(
      tipX - size * Math.cos(angle + Math.PI / 7),
      tipY - size * Math.sin(angle + Math.PI / 7)
    );
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function drawNodes() {
    for (const node of nodes.values()) {
      if (!isNodeVisible(node)) continue;

      const isSelected = selectedNode && selectedNode.id === node.id;
      const isHovered  = hoveredNode && hoveredNode.id === node.id;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

      if (node.isDate) {
        // Date nodes: tiny gray dots
        ctx.fillStyle = 'rgba(71, 85, 105, 0.5)';
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      } else {
        // Normal nodes
        const baseColor = node.color;
        ctx.fillStyle = hexToRGBA(baseColor, isHovered ? 0.55 : 0.35);
        ctx.fill();

        if (isSelected) {
          // Glow effect
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 16;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else {
          ctx.strokeStyle = isHovered ? lightenHex(baseColor, 40) : lightenHex(baseColor, 15);
          ctx.lineWidth = isHovered ? 1.8 : 1.2;
          ctx.stroke();
        }
      }
    }
  }

  function drawLabels() {
    if (camera.zoom < 0.6) return;

    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '10px Inter, -apple-system, sans-serif';

    for (const node of nodes.values()) {
      if (!isNodeVisible(node)) continue;
      if (node.isDate || node.category === 'TIME') continue;

      const label = formatNodeLabel(node.id);
      const isSelected = selectedNode && selectedNode.id === node.id;

      ctx.fillStyle = isSelected ? '#e2e8f0' : '#94a3b8';
      ctx.fillText(label, node.x, node.y + node.radius + 4);
    }
  }

  // -----------------------------------------------------------
  // 7. Camera (Pan / Zoom)
  // -----------------------------------------------------------
  function centerGraph() {
    const visibleNodes = Array.from(nodes.values()).filter(isNodeVisible);
    if (visibleNodes.length === 0) return;

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    for (const n of visibleNodes) {
      if (n.x - n.radius < minX) minX = n.x - n.radius;
      if (n.x + n.radius > maxX) maxX = n.x + n.radius;
      if (n.y - n.radius < minY) minY = n.y - n.radius;
      if (n.y + n.radius > maxY) maxY = n.y + n.radius;
    }

    const graphW = maxX - minX + 100;
    const graphH = maxY - minY + 100;
    const screenW = canvas.width / (window.devicePixelRatio || 1);
    const screenH = canvas.height / (window.devicePixelRatio || 1);

    const zoom = Math.min(1.5, Math.min(screenW / graphW, screenH / graphH) * 0.85);
    const graphCX = (minX + maxX) / 2;
    const graphCY = (minY + maxY) / 2;

    camera.zoom = zoom;
    camera.x = screenW / 2 - graphCX * zoom;
    camera.y = screenH / 2 - graphCY * zoom;
  }
  window.centerGraph = centerGraph;

  // -----------------------------------------------------------
  // 8. Interaction (mouse/touch)
  // -----------------------------------------------------------
  function hitTest(sx, sy) {
    const world = screenToWorld(sx, sy);
    let closest = null;
    let closestDist = Infinity;

    for (const node of nodes.values()) {
      if (!isNodeVisible(node)) continue;
      const dx = world.x - node.x;
      const dy = world.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const hitRadius = node.radius + 4;
      if (dist < hitRadius && dist < closestDist) {
        closest = node;
        closestDist = dist;
      }
    }
    return closest;
  }

  canvas.addEventListener('mousedown', (e) => {
    const now = Date.now();
    const doubleClick = (now - lastClickTime) < 300;
    lastClickTime = now;

    const hit = hitTest(e.clientX, e.clientY);

    if (hit) {
      if (doubleClick) {
        // Double-click: center and zoom on node
        const screenW = canvas.width / (window.devicePixelRatio || 1);
        const screenH = canvas.height / (window.devicePixelRatio || 1);
        camera.zoom = Math.min(2.5, camera.zoom * 1.8);
        camera.x = screenW / 2 - hit.x * camera.zoom;
        camera.y = screenH / 2 - hit.y * camera.zoom;
        selectNode(hit.id);
        return;
      }

      // Start dragging node
      isDragging = true;
      dragNode   = hit;
      dragNode.pinned = true;
      selectNode(hit.id);
    } else {
      // Start panning
      isPanning = true;
      panStart  = { x: e.clientX, y: e.clientY };
      camStart  = { x: camera.x, y: camera.y };
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    mouseScreen.x = e.clientX;
    mouseScreen.y = e.clientY;

    if (isDragging && dragNode) {
      const world = screenToWorld(e.clientX, e.clientY);
      dragNode.x = world.x;
      dragNode.y = world.y;
      dragNode.vx = 0;
      dragNode.vy = 0;
      return;
    }

    if (isPanning) {
      camera.x = camStart.x + (e.clientX - panStart.x);
      camera.y = camStart.y + (e.clientY - panStart.y);
      return;
    }

    // Hover hit test
    const hit = hitTest(e.clientX, e.clientY);
    hoveredNode = hit;
    canvas.style.cursor = hit ? 'pointer' : 'grab';

    if (hit) {
      showTooltip(e.clientX, e.clientY, hit);
    } else {
      hideTooltip();
    }
  });

  canvas.addEventListener('mouseup', () => {
    if (isDragging && dragNode) {
      dragNode.pinned = false;
      isDragging = false;
      dragNode = null;
    }
    isPanning = false;
  });

  canvas.addEventListener('mouseleave', () => {
    isPanning  = false;
    isDragging = false;
    if (dragNode) { dragNode.pinned = false; dragNode = null; }
    hoveredNode = null;
    hideTooltip();
  });

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 1 / 1.08;
    const newZoom = Math.max(0.1, Math.min(5, camera.zoom * zoomFactor));

    // Zoom centered on cursor
    const wx = (e.clientX - camera.x) / camera.zoom;
    const wy = (e.clientY - camera.y) / camera.zoom;
    camera.zoom = newZoom;
    camera.x = e.clientX - wx * newZoom;
    camera.y = e.clientY - wy * newZoom;
  }, { passive: false });

  // Touch support
  let touchStartDist = 0;
  let touchStartZoom = 1;
  let touchStartMid  = { x: 0, y: 0 };
  let touchCamStart  = { x: 0, y: 0 };

  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      const t = e.touches[0];
      const hit = hitTest(t.clientX, t.clientY);
      if (hit) {
        isDragging = true;
        dragNode   = hit;
        dragNode.pinned = true;
        selectNode(hit.id);
      } else {
        isPanning = true;
        panStart  = { x: t.clientX, y: t.clientY };
        camStart  = { x: camera.x, y: camera.y };
      }
    } else if (e.touches.length === 2) {
      isPanning  = false;
      isDragging = false;
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      touchStartDist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      touchStartZoom = camera.zoom;
      touchStartMid  = { x: (t0.clientX + t1.clientX) / 2, y: (t0.clientY + t1.clientY) / 2 };
      touchCamStart  = { x: camera.x, y: camera.y };
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      const t = e.touches[0];
      if (isDragging && dragNode) {
        const world = screenToWorld(t.clientX, t.clientY);
        dragNode.x = world.x;
        dragNode.y = world.y;
      } else if (isPanning) {
        camera.x = camStart.x + (t.clientX - panStart.x);
        camera.y = camStart.y + (t.clientY - panStart.y);
      }
    } else if (e.touches.length === 2) {
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      const scale = dist / touchStartDist;
      const newZoom = Math.max(0.1, Math.min(5, touchStartZoom * scale));

      const mid = { x: (t0.clientX + t1.clientX) / 2, y: (t0.clientY + t1.clientY) / 2 };
      const wx = (touchStartMid.x - touchCamStart.x) / touchStartZoom;
      const wy = (touchStartMid.y - touchCamStart.y) / touchStartZoom;

      camera.zoom = newZoom;
      camera.x = mid.x - wx * newZoom;
      camera.y = mid.y - wy * newZoom;
    }
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    if (isDragging && dragNode) {
      dragNode.pinned = false;
      isDragging = false;
      dragNode   = null;
    }
    isPanning = false;
  });

  // -----------------------------------------------------------
  // 9. Tooltip
  // -----------------------------------------------------------
  function showTooltip(sx, sy, node) {
    tooltip.innerHTML = '<strong>' + escHTML(formatNodeLabel(node.id)) + '</strong><br>' +
      '<span style="color:#94a3b8;font-size:10px">' + escHTML(node.category) + '</span>';
    tooltip.classList.add('visible');
    const rect = tooltip.getBoundingClientRect();
    let tx = sx + 14;
    let ty = sy - 10;
    if (tx + rect.width > window.innerWidth - 10) tx = sx - rect.width - 14;
    if (ty + rect.height > window.innerHeight - 10) ty = sy - rect.height - 10;
    if (ty < 5) ty = 5;
    tooltip.style.left = tx + 'px';
    tooltip.style.top  = ty + 'px';
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
  }

  // -----------------------------------------------------------
  // 10. Node Selection & Info Panel
  // -----------------------------------------------------------
  function selectNode(id) {
    const node = nodes.get(id);
    if (!node) return;
    selectedNode = node;
    updateInfoPanel(node);
  }
  window.selectNode = selectNode;

  function updateInfoPanel(node) {
    const badge = document.getElementById('infoBadge');
    const title = document.getElementById('infoTitle');
    const type  = document.getElementById('infoType');
    const body  = document.getElementById('infoBody');

    const fact     = node.fact;
    const typeKey  = fact[':TYPE'];
    const typeCol  = typeColors[typeKey] || '#94a3b8';

    // Badge
    badge.textContent = typeKey;
    badge.style.background   = hexToRGBA(typeCol, 0.12);
    badge.style.color        = typeCol;
    badge.style.borderColor  = hexToRGBA(typeCol, 0.25);

    // Title
    title.textContent = formatNodeLabel(node.id);

    // Type line
    type.textContent = node.category;

    // Body
    let html = '';

    // Register table
    html += '<div class="info-section">';
    html += '<div class="info-section-title">Registers</div>';
    html += '<table class="register-table"><thead><tr><th>Register</th><th>Value</th></tr></thead><tbody>';
    const regKeys = [':ID', ':TYPE', ':CREATED', 'P0', 'P1', 'P2', 'P3'];
    for (const k of regKeys) {
      const v = fact[k];
      if (v === undefined || v === null || v === '') continue;
      html += '<tr><td class="reg-key">' + escHTML(k) + '</td>' +
              '<td class="reg-val">' + escHTML(String(v)) + '</td></tr>';
    }
    html += '</tbody></table></div>';

    // Metrics section
    if (node.metrics.length > 0) {
      html += '<div class="info-section">';
      html += '<div class="info-section-title">Metrics</div>';
      for (const m of node.metrics) {
        html += '<div class="signal-row">';
        html += '<span class="signal-metric">' + escHTML(m.P1 || m[':ID']) + '</span>';
        html += '<span class="signal-value">' + escHTML(m.P2 || '') + '</span>';
        html += '</div>';
      }
      html += '</div>';
    }

    // Signals section
    if (node.signals.length > 0) {
      html += '<div class="info-section">';
      html += '<div class="info-section-title">Signals</div>';
      const sorted = [...node.signals].sort((a, b) => {
        const da = a[':CREATED'] || '';
        const db = b[':CREATED'] || '';
        return db.localeCompare(da);
      });
      for (const s of sorted) {
        html += '<div class="signal-row">';
        html += '<span class="signal-metric">' + escHTML(s.P1 || s[':ID']) + '</span>';
        html += '<span class="signal-date">' + escHTML(s[':CREATED'] || '') + '</span>';
        html += '<span class="signal-value">' + escHTML(s.P2 || '') + '</span>';
        html += '</div>';
      }
      html += '</div>';
    }

    // Protocols section
    if (node.protocols.length > 0) {
      html += '<div class="info-section">';
      html += '<div class="info-section-title">Protocols</div>';
      for (const p of node.protocols) {
        html += '<div class="signal-row">';
        html += '<span class="signal-metric">' + escHTML(p.P1 || p[':ID']) + '</span>';
        if (p.P2) html += '<span class="signal-value">' + escHTML(p.P2) + '</span>';
        if (p.P3) html += '<span class="signal-date">' + escHTML(p.P3) + '</span>';
        html += '</div>';
      }
      html += '</div>';
    }

    // Neighbors section
    const neighbors = getNeighbors(node.id);
    if (neighbors.length > 0) {
      html += '<div class="info-section">';
      html += '<div class="info-section-title">Neighbors (' + neighbors.length + ')</div>';
      html += '<ul class="neighbor-list">';
      for (const nb of neighbors) {
        const nbNode = nodes.get(nb.id);
        const nbColor = nbNode ? nbNode.color : '#64748b';
        html += '<li class="neighbor-item" onclick="selectNode(\'' + escAttr(nb.id) + '\')">';
        html += '<span class="neighbor-dot" style="background:' + nbColor + '"></span>';
        html += '<span class="neighbor-id">' + escHTML(formatNodeLabel(nb.id)) + '</span>';
        html += '<span class="neighbor-type">' + escHTML(nb.edgeLabel) + '</span>';
        html += '</li>';
      }
      html += '</ul>';
      html += '</div>';
    }

    body.innerHTML = html;
  }

  function getNeighbors(nodeId) {
    const result = [];
    const seen   = new Set();

    for (const edge of edges) {
      let neighborId = null;
      let label = edge.label;

      if (edge.source === nodeId) {
        neighborId = edge.target;
      } else if (edge.target === nodeId) {
        neighborId = edge.source;
      }

      if (neighborId && !seen.has(neighborId) && nodes.has(neighborId)) {
        seen.add(neighborId);
        result.push({ id: neighborId, edgeLabel: label });
      }
    }

    return result;
  }

  function resetInfoPanel() {
    selectedNode = null;
    const badge = document.getElementById('infoBadge');
    const title = document.getElementById('infoTitle');
    const type  = document.getElementById('infoType');
    const body  = document.getElementById('infoBody');

    badge.textContent     = 'FACT';
    badge.style.background   = 'rgba(34,211,238,0.1)';
    badge.style.color        = '#22d3ee';
    badge.style.borderColor  = 'rgba(34,211,238,0.2)';
    title.textContent     = 'Substrate';
    type.textContent      = 'Knowledge Graph Explorer';
    body.innerHTML = '<p class="info-hint">Everything is a FACT. Five types, register-based structure, append-only truth.</p>' +
      '<div class="info-section">' +
        '<div class="info-section-title">Architecture</div>' +
        '<div class="arch-row"><span class="arch-dot" style="background:#22d3ee"></span><span>NODE</span><span class="arch-desc">Identity with lifecycle</span></div>' +
        '<div class="arch-row"><span class="arch-dot" style="background:#94a3b8"></span><span>EDGE</span><span class="arch-desc">Connects nodes</span></div>' +
        '<div class="arch-row"><span class="arch-dot" style="background:#6366f1"></span><span>METRIC</span><span class="arch-desc">Measurable dimension</span></div>' +
        '<div class="arch-row"><span class="arch-dot" style="background:#f59e0b"></span><span>SIGNAL</span><span class="arch-desc">Time-indexed observation</span></div>' +
        '<div class="arch-row"><span class="arch-dot" style="background:#ec4899"></span><span>PROTOCOL</span><span class="arch-desc">Signal forecast</span></div>' +
      '</div>' +
      '<p class="info-hint" style="margin-top:12px">Click any node on the graph to inspect its registers.</p>';
  }

  // -----------------------------------------------------------
  // 11. Filter System
  // -----------------------------------------------------------
  function toggleFilter(factType) {
    if (activeTypes.has(factType)) {
      activeTypes.delete(factType);
    } else {
      activeTypes.add(factType);
    }

    // Update chip UI
    const chip = document.querySelector('.filter-chip[data-type="' + factType + '"]');
    if (chip) chip.classList.toggle('active', activeTypes.has(factType));

    // If the selected node is now hidden, clear selection
    if (selectedNode && !isNodeVisible(selectedNode)) {
      resetInfoPanel();
    }

    // Re-warm physics when toggling
    if (physicsOn) {
      coolingFactor = Math.max(coolingFactor, 0.5);
      maxVelocity = Infinity;
    }

    // Rebuild timeline/table if active
    if (currentView === 'timeline') renderTimeline();
    if (currentView === 'table')    renderTable();
  }
  window.toggleFilter = toggleFilter;

  function toggleCategory(cat) {
    if (activeCategories.has(cat)) {
      activeCategories.delete(cat);
    } else {
      activeCategories.add(cat);
    }

    // Update chip UI
    const chips = document.querySelectorAll('.cat-chip');
    chips.forEach(chip => {
      const c = chip.getAttribute('data-category');
      chip.classList.toggle('active', activeCategories.has(c));
    });

    if (selectedNode && !isNodeVisible(selectedNode)) {
      resetInfoPanel();
    }

    if (physicsOn) {
      coolingFactor = Math.max(coolingFactor, 0.5);
      maxVelocity = Infinity;
    }

    if (currentView === 'timeline') renderTimeline();
    if (currentView === 'table')    renderTable();
  }
  window.toggleCategory = toggleCategory;

  function generateCategoryChips() {
    const container = document.getElementById('categoryChips');
    const sorted = Array.from(allCategories).sort();
    let html = '';

    for (const cat of sorted) {
      const color = categoryColors[cat] || categoryColors.DEFAULT;
      html += '<button class="filter-chip cat-chip active" data-category="' + escAttr(cat) +
              '" onclick="toggleCategory(\'' + escAttr(cat) + '\')">' +
              '<span class="chip-dot" style="background:' + color + '"></span>' +
              escHTML(cat) + '</button>';
    }

    container.innerHTML = html;
  }

  // -----------------------------------------------------------
  // 12. Fact Counter
  // -----------------------------------------------------------
  function updateFactCounts() {
    const counts = { NODE: 0, EDGE: 0, METRIC: 0, SIGNAL: 0, PROTOCOL: 0 };
    for (const f of allFacts) {
      const t = f[':TYPE'];
      if (counts[t] !== undefined) counts[t]++;
    }

    const el = document.getElementById('factCounts');
    const labels = [
      { key: 'NODE',     short: 'N', color: typeColors.NODE },
      { key: 'EDGE',     short: 'E', color: typeColors.EDGE },
      { key: 'METRIC',   short: 'M', color: typeColors.METRIC },
      { key: 'SIGNAL',   short: 'S', color: typeColors.SIGNAL },
      { key: 'PROTOCOL', short: 'P', color: typeColors.PROTOCOL },
    ];

    let html = '';
    for (const l of labels) {
      html += '<span class="fact-count">' +
              '<span class="fact-count-dot" style="background:' + l.color + '"></span>' +
              l.short + ': ' + counts[l.key] +
              '</span>';
    }
    el.innerHTML = html;
  }

  // -----------------------------------------------------------
  // 13. View System
  // -----------------------------------------------------------
  function setView(name) {
    currentView = name;

    // Update tab UI
    document.querySelectorAll('.view-tab').forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-view') === name);
    });

    // Show/hide containers
    canvas.style.display = (name === 'graph') ? 'block' : 'none';

    let tlContainer = document.querySelector('.timeline-container');
    let tbContainer = document.querySelector('.table-container');

    // Create containers if they don't exist
    if (!tlContainer) {
      tlContainer = document.createElement('div');
      tlContainer.className = 'timeline-container';
      document.body.appendChild(tlContainer);
    }
    if (!tbContainer) {
      tbContainer = document.createElement('div');
      tbContainer.className = 'table-container';
      document.body.appendChild(tbContainer);
    }

    tlContainer.classList.toggle('active', name === 'timeline');
    tbContainer.classList.toggle('active', name === 'table');

    if (name === 'timeline') renderTimeline();
    if (name === 'table')    renderTable();
  }
  window.setView = setView;

  // -----------------------------------------------------------
  // 14. Timeline View
  // -----------------------------------------------------------
  function renderTimeline() {
    const container = document.querySelector('.timeline-container');
    if (!container) return;

    // Group signals and other dated facts by :CREATED
    const groups = new Map();

    for (const fact of allFacts) {
      const t = fact[':TYPE'];
      if (!activeTypes.has(t)) continue;
      const date = fact[':CREATED'];
      if (!date) continue;

      if (!groups.has(date)) groups.set(date, []);
      groups.get(date).push(fact);
    }

    // Sort dates descending
    const sortedDates = Array.from(groups.keys()).sort((a, b) => b.localeCompare(a));

    if (sortedDates.length === 0) {
      container.innerHTML = '<p class="info-hint" style="padding:24px">No dated facts match the current filters.</p>';
      return;
    }

    let html = '';
    for (const date of sortedDates) {
      const facts = groups.get(date);
      const dayLabel = formatDateLabel(date);
      const weekday  = formatDateWeekday(date);

      html += '<div class="tl-day">';
      html += '<div class="tl-date"><div class="tl-date-label">' + escHTML(dayLabel) + '</div>' +
              '<div class="tl-date-sub">' + escHTML(weekday) + '</div></div>';
      html += '<div class="tl-line"></div>';
      html += '<div class="tl-events">';

      for (const fact of facts) {
        const typeCol = typeColors[fact[':TYPE']] || '#94a3b8';
        html += '<div class="tl-event" onclick="selectNodeFromFact(\'' + escAttr(fact[':ID']) + '\')">';
        html += '<div class="tl-event-type" style="color:' + typeCol + '">' + escHTML(fact[':TYPE']) + '</div>';
        html += '<div class="tl-event-id">' + escHTML(fact[':ID']) + '</div>';
        if (fact.P0) {
          let detail = fact.P0;
          if (fact.P1) detail += ' \u2192 ' + fact.P1;
          if (fact.P2) detail += ' : ' + fact.P2;
          html += '<div class="tl-event-detail">' + escHTML(detail) + '</div>';
        }
        html += '</div>';
      }

      html += '</div></div>';
    }

    container.innerHTML = html;
  }

  function selectNodeFromFact(factId) {
    // Try to find a node for this fact; for edges, select source node
    const fact = allFacts.find(f => f[':ID'] === factId);
    if (!fact) return;

    if (fact[':TYPE'] === 'NODE' && nodes.has(fact[':ID'])) {
      selectNode(fact[':ID']);
    } else if (fact.P0 && nodes.has(fact.P0)) {
      selectNode(fact.P0);
    }
  }
  window.selectNodeFromFact = selectNodeFromFact;

  // -----------------------------------------------------------
  // 15. Table View
  // -----------------------------------------------------------
  function renderTable() {
    const container = document.querySelector('.table-container');
    if (!container) return;

    // Filter facts by active types
    let filtered = allFacts.filter(f => activeTypes.has(f[':TYPE']));

    // Sort
    filtered.sort((a, b) => {
      const av = String(a[tableSortCol] || '');
      const bv = String(b[tableSortCol] || '');
      const cmp = av.localeCompare(bv);
      return tableSortAsc ? cmp : -cmp;
    });

    const cols = [':ID', ':TYPE', ':CREATED', 'P0', 'P1', 'P2', 'P3'];
    const sortIcon = tableSortAsc ? ' \u25B2' : ' \u25BC';

    let html = '<table class="facts-table"><thead><tr>';
    for (const col of cols) {
      const isSorted = col === tableSortCol;
      html += '<th style="cursor:pointer" onclick="sortTable(\'' + escAttr(col) + '\')">' +
              escHTML(col) + (isSorted ? sortIcon : '') + '</th>';
    }
    html += '</tr></thead><tbody>';

    for (const fact of filtered) {
      const typeCol = typeColors[fact[':TYPE']] || '#94a3b8';
      html += '<tr onclick="selectNodeFromFact(\'' + escAttr(fact[':ID']) + '\')">';
      for (const col of cols) {
        const val = fact[col];
        if (col === ':TYPE') {
          html += '<td><span class="type-badge" style="background:' +
                  hexToRGBA(typeCol, 0.15) + ';color:' + typeCol + '">' +
                  escHTML(val || '') + '</span></td>';
        } else {
          html += '<td>' + escHTML(val !== undefined && val !== null ? String(val) : '') + '</td>';
        }
      }
      html += '</tr>';
    }

    html += '</tbody></table>';
    container.innerHTML = html;
  }

  function sortTable(col) {
    if (tableSortCol === col) {
      tableSortAsc = !tableSortAsc;
    } else {
      tableSortCol = col;
      tableSortAsc = true;
    }
    renderTable();
  }
  window.sortTable = sortTable;

  // -----------------------------------------------------------
  // 16. Utility Functions
  // -----------------------------------------------------------
  function formatNodeLabel(id) {
    if (!id) return '';
    // "SOW:bella" -> "bella", "DATE:2025-01-15" -> "2025-01-15"
    const parts = id.split(':');
    return parts.length > 1 ? parts[parts.length - 1] : id;
  }

  function formatDateLabel(dateStr) {
    if (!dateStr) return '';
    // Try to parse as date
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      if (m >= 1 && m <= 12) return months[m - 1] + ' ' + d;
    }
    return dateStr;
  }

  function formatDateWeekday(dateStr) {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      if (isNaN(d.getTime())) return '';
      const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      return days[d.getDay()];
    } catch { return ''; }
  }

  function hexToRGBA(hex, alpha) {
    if (!hex) return 'rgba(100,116,139,' + alpha + ')';
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  function lightenHex(hex, amount) {
    if (!hex) return '#94a3b8';
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    r = Math.min(255, r + amount);
    g = Math.min(255, g + amount);
    b = Math.min(255, b + amount);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function escHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function escAttr(str) {
    if (!str) return '';
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
  }

  // -----------------------------------------------------------
  // 17. Animation Loop
  // -----------------------------------------------------------
  function animate() {
    frameCount++;
    stepPhysics();
    if (currentView === 'graph') {
      drawFrame();
    }
    animFrameId = requestAnimationFrame(animate);
  }

  // -----------------------------------------------------------
  // 18. Window resize
  // -----------------------------------------------------------
  window.addEventListener('resize', () => {
    resizeCanvas();
  });

  // -----------------------------------------------------------
  // 19. Initialization
  // -----------------------------------------------------------
  function init() {
    // Size canvas for HiDPI
    resizeCanvas();

    // Build the graph from FACTS
    buildGraph();

    // Generate category filter chips
    generateCategoryChips();

    // Update fact counter
    updateFactCounts();

    // Set initial node positions
    setInitialPositions();

    // Create timeline/table containers if missing
    if (!document.querySelector('.timeline-container')) {
      const tlC = document.createElement('div');
      tlC.className = 'timeline-container';
      document.body.appendChild(tlC);
    }
    if (!document.querySelector('.table-container')) {
      const tbC = document.createElement('div');
      tbC.className = 'table-container';
      document.body.appendChild(tbC);
    }

    // Start animation loop
    animate();

    // Center graph after physics settles slightly
    setTimeout(() => {
      centerGraph();
    }, 1000);
  }

  // Boot
  init();

})();
