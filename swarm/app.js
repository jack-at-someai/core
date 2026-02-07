// ── Simulation State ──

const state = {
    boids: [],
    predator: null,
    obstacles: [],
    is3D: false,
    paused: false,
    tool: 'obstacle', // 'obstacle' | 'predator'
    params: {
        count: 150,
        maxSpeed: 4,
        maxForce: 0.2,
        perceptionRadius: 80,
        separationRadius: 30,
        separationWeight: 1.8,
        alignmentWeight: 1.0,
        cohesionWeight: 1.0,
        predatorEnabled: true,
        fleeWeight: 4.0,
        fleeRadius: 150,
        predatorSpeed: 3.0,
        obstacleRadius: 40,
        cubeSize: 500,
    },
    visuals: {
        trails: false,
        vectors: false,
        perception: false,
        grid: true,
        perceptionRadius: 80,
    },
    bounds: { x: 800, y: 600, z: 400 },
};

const spatialHash = new SpatialHash(80);
const canvas = document.getElementById('canvas');
const renderer = new Renderer(canvas);

// ── FPS Tracking ──

let frameCount = 0;
let lastFpsTime = performance.now();
let currentFps = 60;

// ── Initialization ──

function initBoids() {
    state.boids = [];
    const cx = state.bounds.x / 2;
    const cy = state.bounds.y / 2;
    const cz = state.bounds.z / 2;
    for (let i = 0; i < state.params.count; i++) {
        const x = cx + (Math.random() - 0.5) * state.bounds.x * 0.6;
        const y = cy + (Math.random() - 0.5) * state.bounds.y * 0.6;
        const z = state.is3D ? cz + (Math.random() - 0.5) * state.bounds.z * 0.6 : 0;
        state.boids.push(new Boid(x, y, z, state.is3D));
    }
}

function initPredator() {
    if (state.params.predatorEnabled) {
        const cx = state.bounds.x / 2;
        const cy = state.bounds.y / 2;
        const cz = state.bounds.z / 2;
        state.predator = new Predator(cx + 100, cy + 100, state.is3D ? cz : 0);
    } else {
        state.predator = null;
    }
}

function reset() {
    if (state.is3D) {
        state.bounds.x = state.params.cubeSize;
        state.bounds.y = state.params.cubeSize;
        state.bounds.z = state.params.cubeSize;
    } else {
        state.bounds.x = renderer.width;
        state.bounds.y = renderer.height;
        state.bounds.z = 400;
    }
    initBoids();
    initPredator();
    state.obstacles = [];
}

// ── Simulation Step ──

function step() {
    if (state.paused) return;

    const params = state.params;

    // Rebuild spatial hash
    spatialHash.cellSize = params.perceptionRadius;
    spatialHash.clear();
    for (let i = 0; i < state.boids.length; i++) {
        spatialHash.insert(state.boids[i]);
    }

    // Update boids
    for (let i = 0; i < state.boids.length; i++) {
        const boid = state.boids[i];
        const neighbors = spatialHash.query(boid.pos, params.perceptionRadius);
        boid.flock(neighbors, params);
        boid.avoidObstacles(state.obstacles, params);
        if (state.predator) boid.fleePredator(state.predator, params);
        boid.contain(state.bounds, state.is3D);
        boid.update(params);
    }

    // Update predator
    if (state.predator) {
        state.predator.pursue(state.boids, params);
        state.predator.contain(state.bounds, state.is3D);
        state.predator.update(params);
    }
}

// ── Adjust Boid Count ──

function adjustBoidCount(target) {
    while (state.boids.length > target) {
        state.boids.pop();
    }
    while (state.boids.length < target) {
        const cx = state.bounds.x / 2;
        const cy = state.bounds.y / 2;
        const cz = state.bounds.z / 2;
        const x = cx + (Math.random() - 0.5) * state.bounds.x * 0.6;
        const y = cy + (Math.random() - 0.5) * state.bounds.y * 0.6;
        const z = state.is3D ? cz + (Math.random() - 0.5) * state.bounds.z * 0.6 : 0;
        state.boids.push(new Boid(x, y, z, state.is3D));
    }
}

// ── Render Loop ──

function render() {
    if (state.is3D) {
        renderer.render3D(state.boids, state.predator, state.obstacles, state.visuals, state.bounds);
    } else {
        renderer.render2D(state.boids, state.predator, state.obstacles, state.visuals);
    }
}

function loop() {
    step();
    render();

    // FPS
    frameCount++;
    const now = performance.now();
    if (now - lastFpsTime >= 500) {
        currentFps = Math.round(frameCount / ((now - lastFpsTime) / 1000));
        frameCount = 0;
        lastFpsTime = now;
        document.getElementById('fps-counter').textContent = currentFps + ' FPS';
        document.getElementById('boid-counter').textContent = state.boids.length + ' boids';
    }

    requestAnimationFrame(loop);
}

// ── UI Bindings ──

function bindSlider(id, paramKey, transform) {
    const slider = document.getElementById('sl-' + id);
    const display = document.getElementById('val-' + id);
    if (!slider || !display) return;
    slider.addEventListener('input', () => {
        const val = transform ? transform(slider.value) : parseFloat(slider.value);
        state.params[paramKey] = val;
        display.textContent = slider.value;
    });
}

function bindUI() {
    bindSlider('count', 'count', v => parseInt(v));
    bindSlider('speed', 'maxSpeed');
    bindSlider('perception', 'perceptionRadius');
    bindSlider('separation', 'separationWeight');
    bindSlider('alignment', 'alignmentWeight');
    bindSlider('cohesion', 'cohesionWeight');
    bindSlider('sepRadius', 'separationRadius');
    bindSlider('fleeWeight', 'fleeWeight');
    bindSlider('fleeRadius', 'fleeRadius');
    bindSlider('predSpeed', 'predatorSpeed');
    bindSlider('obsRadius', 'obstacleRadius');
    bindSlider('cubeSize', 'cubeSize', v => parseInt(v));

    // Cube size slider updates 3D bounds live
    document.getElementById('sl-cubeSize').addEventListener('input', () => {
        if (state.is3D) {
            state.bounds.x = state.params.cubeSize;
            state.bounds.y = state.params.cubeSize;
            state.bounds.z = state.params.cubeSize;
        }
    });

    // Count slider triggers live boid adjustment
    document.getElementById('sl-count').addEventListener('input', () => {
        adjustBoidCount(state.params.count);
    });

    // Perception sync to visual
    document.getElementById('sl-perception').addEventListener('input', () => {
        state.visuals.perceptionRadius = state.params.perceptionRadius;
    });

    // Predator toggle
    document.getElementById('cb-predator').addEventListener('change', (e) => {
        state.params.predatorEnabled = e.target.checked;
        if (e.target.checked && !state.predator) initPredator();
        else if (!e.target.checked) state.predator = null;
    });

    // Visual toggles
    document.getElementById('cb-trails').addEventListener('change', e => state.visuals.trails = e.target.checked);
    document.getElementById('cb-vectors').addEventListener('change', e => state.visuals.vectors = e.target.checked);
    document.getElementById('cb-perception').addEventListener('change', e => state.visuals.perception = e.target.checked);
    document.getElementById('cb-grid').addEventListener('change', e => state.visuals.grid = e.target.checked);

    // Tool selector
    document.getElementById('tool-obstacle').addEventListener('click', () => {
        state.tool = 'obstacle';
        document.getElementById('tool-obstacle').classList.add('active');
        document.getElementById('tool-predator').classList.remove('active');
    });
    document.getElementById('tool-predator').addEventListener('click', () => {
        state.tool = 'predator';
        document.getElementById('tool-predator').classList.add('active');
        document.getElementById('tool-obstacle').classList.remove('active');
    });

    // 2D/3D toggle
    document.getElementById('btn-2d').addEventListener('click', () => {
        if (!state.is3D) return;
        state.is3D = false;
        document.getElementById('btn-2d').classList.add('active');
        document.getElementById('btn-3d').classList.remove('active');
        // Restore screen bounds and flatten z
        state.bounds.x = renderer.width;
        state.bounds.y = renderer.height;
        state.bounds.z = 400;
        // Remap boids from cube coords to screen coords
        for (const b of state.boids) {
            b.pos.x = Math.random() * state.bounds.x;
            b.pos.y = Math.random() * state.bounds.y;
            b.pos.z = 0; b.vel.z = 0;
        }
        if (state.predator) {
            state.predator.pos.x = state.bounds.x / 2;
            state.predator.pos.y = state.bounds.y / 2;
            state.predator.pos.z = 0; state.predator.vel.z = 0;
        }
        state.obstacles = [];
    });
    document.getElementById('btn-3d').addEventListener('click', () => {
        if (state.is3D) return;
        state.is3D = true;
        document.getElementById('btn-3d').classList.add('active');
        document.getElementById('btn-2d').classList.remove('active');
        // Set cube bounds
        state.bounds.x = state.params.cubeSize;
        state.bounds.y = state.params.cubeSize;
        state.bounds.z = state.params.cubeSize;
        const half = state.params.cubeSize / 2;
        // Spread boids into cube
        for (const b of state.boids) {
            b.pos.x = half + (Math.random() - 0.5) * cubeSize * 0.6;
            b.pos.y = half + (Math.random() - 0.5) * cubeSize * 0.6;
            b.pos.z = half + (Math.random() - 0.5) * cubeSize * 0.6;
            b.vel = Vec.random3D().mul(b.vel.mag() || 3);
        }
        if (state.predator) {
            state.predator.pos.x = half + 100;
            state.predator.pos.y = half + 100;
            state.predator.pos.z = half;
        }
        state.obstacles = [];
    });

    // Pause/Reset
    document.getElementById('btn-pause').addEventListener('click', () => {
        state.paused = !state.paused;
        document.getElementById('btn-pause').textContent = state.paused ? 'Play' : 'Pause';
    });
    document.getElementById('btn-reset').addEventListener('click', reset);

    // Clear obstacles
    document.getElementById('btn-clear-obs').addEventListener('click', () => {
        state.obstacles = [];
    });
}

// ── Mouse Interaction ──

let isDragging = false;
let lastMouse = { x: 0, y: 0 };

canvas.addEventListener('mousedown', (e) => {
    if (e.button === 2 && state.is3D) {
        // Right-click: orbit
        isDragging = true;
        lastMouse = { x: e.clientX, y: e.clientY };
        e.preventDefault();
        return;
    }

    if (e.button === 0) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        if (state.tool === 'obstacle') {
            if (state.is3D) {
                const ray = renderer.camera.rayFromScreen(mx, my, renderer.width, renderer.height);
                const hit = renderer.camera.intersectGroundPlane(ray, state.bounds.y / 2);
                if (hit) {
                    // Clamp to cube bounds
                    hit.x = Math.max(0, Math.min(state.bounds.x, hit.x));
                    hit.z = Math.max(0, Math.min(state.bounds.z, hit.z));
                    state.obstacles.push(new Obstacle(hit.x, state.bounds.y / 2, hit.z, state.params.obstacleRadius));
                }
            } else {
                state.obstacles.push(new Obstacle(mx, my, 0, state.params.obstacleRadius));
            }
        } else if (state.tool === 'predator') {
            if (!state.predator) {
                state.params.predatorEnabled = true;
                document.getElementById('cb-predator').checked = true;
            }
            if (state.is3D) {
                const ray = renderer.camera.rayFromScreen(mx, my, renderer.width, renderer.height);
                const hit = renderer.camera.intersectGroundPlane(ray, state.bounds.y / 2);
                if (hit) {
                    hit.x = Math.max(0, Math.min(state.bounds.x, hit.x));
                    hit.z = Math.max(0, Math.min(state.bounds.z, hit.z));
                    state.predator = new Predator(hit.x, state.bounds.y / 2, hit.z);
                }
            } else {
                state.predator = new Predator(mx, my, 0);
            }
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging && state.is3D) {
        const dx = e.clientX - lastMouse.x;
        const dy = e.clientY - lastMouse.y;
        renderer.camera.theta += dx * 0.005;
        renderer.camera.phi = Math.max(0.1, Math.min(Math.PI - 0.1, renderer.camera.phi - dy * 0.005));
        lastMouse = { x: e.clientX, y: e.clientY };
    }
});

canvas.addEventListener('mouseup', () => { isDragging = false; });
canvas.addEventListener('mouseleave', () => { isDragging = false; });

canvas.addEventListener('wheel', (e) => {
    if (state.is3D) {
        renderer.camera.distance = Math.max(200, Math.min(2000, renderer.camera.distance + e.deltaY * 0.5));
        e.preventDefault();
    }
}, { passive: false });

canvas.addEventListener('contextmenu', (e) => e.preventDefault());

// ── Resize ──

function handleResize() {
    renderer.resize();
    if (!state.is3D) {
        state.bounds.x = renderer.width;
        state.bounds.y = renderer.height;
    }
    // In 3D mode, bounds are fixed cube — no change needed
}

window.addEventListener('resize', handleResize);

// ── Start ──

renderer.resize();
state.bounds.x = renderer.width;
state.bounds.y = renderer.height;
bindUI();
initBoids();
initPredator();
loop();
