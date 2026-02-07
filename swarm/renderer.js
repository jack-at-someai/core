// ── Camera (3D orbit) ──

class Camera {
    constructor() {
        this.theta = 0.3;
        this.phi = 0.8;
        this.distance = 800;
        this.target = new Vec(0, 0, 0);
        this.fov = 600;
    }

    getPosition() {
        const x = this.distance * Math.sin(this.phi) * Math.cos(this.theta);
        const y = this.distance * Math.cos(this.phi);
        const z = this.distance * Math.sin(this.phi) * Math.sin(this.theta);
        return this.target.add(new Vec(x, y, z));
    }

    getBasis() {
        const pos = this.getPosition();
        const forward = this.target.sub(pos).norm();
        const worldUp = new Vec(0, -1, 0);
        const right = forward.cross(worldUp).norm();
        const up = right.cross(forward).norm();
        return { pos, forward, right, up };
    }

    project(worldPos, screenW, screenH) {
        const basis = this.getBasis();
        const rel = worldPos.sub(basis.pos);
        const x = rel.dot(basis.right);
        const y = rel.dot(basis.up);
        const z = rel.dot(basis.forward);

        if (z < 10) return null;

        const scale = this.fov / z;
        return {
            x: screenW / 2 + x * scale,
            y: screenH / 2 + y * scale,
            z: z,
            scale: scale
        };
    }

    rayFromScreen(sx, sy, screenW, screenH) {
        const basis = this.getBasis();
        const ndcX = (sx - screenW / 2) / this.fov;
        const ndcY = (sy - screenH / 2) / this.fov;
        const dir = basis.forward.add(basis.right.mul(ndcX)).add(basis.up.mul(ndcY)).norm();
        return { origin: basis.pos, dir };
    }

    intersectGroundPlane(ray, planeY) {
        if (Math.abs(ray.dir.y) < 0.001) return null;
        const t = (planeY - ray.origin.y) / ray.dir.y;
        if (t < 0) return null;
        return ray.origin.add(ray.dir.mul(t));
    }
}

// ── Renderer ──

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.camera = new Camera();
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.width = rect.width;
        this.height = rect.height;
    }

    clear(trailMode) {
        if (trailMode) {
            this.ctx.fillStyle = 'rgba(10, 10, 15, 0.15)';
            this.ctx.fillRect(0, 0, this.width, this.height);
        } else {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = '#0a0a0f';
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
    }

    // ── 2D Rendering ──

    render2D(boids, predator, obstacles, visuals) {
        this.clear(visuals.trails);

        // Obstacles
        for (let i = 0; i < obstacles.length; i++) {
            this._drawObstacle2D(obstacles[i]);
        }

        // Boids
        for (let i = 0; i < boids.length; i++) {
            this._drawBoid2D(boids[i], visuals);
        }

        // Predator
        if (predator) {
            this._drawPredator2D(predator, visuals);
        }
    }

    _drawBoid2D(boid, visuals) {
        const ctx = this.ctx;
        const angle = Math.atan2(boid.vel.y, boid.vel.x);
        const speed = boid.vel.mag();
        const size = 6;

        // Trail
        if (visuals.trails && boid.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(boid.trail[0].x, boid.trail[0].y);
            for (let i = 1; i < boid.trail.length; i++) {
                ctx.lineTo(boid.trail[i].x, boid.trail[i].y);
            }
            ctx.strokeStyle = 'rgba(110, 86, 207, 0.15)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Perception radius
        if (visuals.perception) {
            ctx.beginPath();
            ctx.arc(boid.pos.x, boid.pos.y, visuals.perceptionRadius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(110, 86, 207, 0.06)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        // Body (triangle pointing in velocity direction)
        ctx.save();
        ctx.translate(boid.pos.x, boid.pos.y);
        ctx.rotate(angle);

        const hue = 220 + speed * 15;
        ctx.fillStyle = `hsla(${hue}, 70%, 65%, 0.85)`;

        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.lineTo(-size * 0.6, -size * 0.45);
        ctx.lineTo(-size * 0.6, size * 0.45);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // Velocity vector
        if (visuals.vectors) {
            const vn = boid.vel.norm().mul(15);
            ctx.beginPath();
            ctx.moveTo(boid.pos.x, boid.pos.y);
            ctx.lineTo(boid.pos.x + vn.x, boid.pos.y + vn.y);
            ctx.strokeStyle = 'rgba(0, 212, 170, 0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    _drawPredator2D(pred, visuals) {
        const ctx = this.ctx;
        const angle = Math.atan2(pred.vel.y, pred.vel.x);
        const size = 14;
        const glow = 0.5 + 0.3 * Math.sin(pred.glowPhase);

        // Glow
        const gradient = ctx.createRadialGradient(pred.pos.x, pred.pos.y, 0, pred.pos.x, pred.pos.y, 40);
        gradient.addColorStop(0, `rgba(229, 72, 77, ${glow * 0.3})`);
        gradient.addColorStop(1, 'rgba(229, 72, 77, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(pred.pos.x - 40, pred.pos.y - 40, 80, 80);

        // Trail
        if (visuals.trails && pred.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(pred.trail[0].x, pred.trail[0].y);
            for (let i = 1; i < pred.trail.length; i++) {
                ctx.lineTo(pred.trail[i].x, pred.trail[i].y);
            }
            ctx.strokeStyle = 'rgba(229, 72, 77, 0.2)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Shark body
        ctx.save();
        ctx.translate(pred.pos.x, pred.pos.y);
        ctx.rotate(angle);

        ctx.fillStyle = `rgba(229, 72, 77, ${0.7 + glow * 0.3})`;
        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.lineTo(-size * 0.7, -size * 0.55);
        ctx.lineTo(-size * 0.3, 0);
        ctx.lineTo(-size * 0.7, size * 0.55);
        ctx.closePath();
        ctx.fill();

        // Dorsal fin
        ctx.fillStyle = `rgba(200, 50, 55, ${0.6 + glow * 0.2})`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-size * 0.3, -size * 0.8);
        ctx.lineTo(-size * 0.5, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    _drawObstacle2D(obs) {
        const ctx = this.ctx;
        const gradient = ctx.createRadialGradient(obs.pos.x, obs.pos.y, 0, obs.pos.x, obs.pos.y, obs.radius);
        gradient.addColorStop(0, 'rgba(60, 60, 80, 0.5)');
        gradient.addColorStop(0.7, 'rgba(40, 40, 60, 0.3)');
        gradient.addColorStop(1, 'rgba(40, 40, 60, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(obs.pos.x, obs.pos.y, obs.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(100, 100, 140, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // ── 3D Rendering ──

    render3D(boids, predator, obstacles, visuals, bounds) {
        this.clear(visuals.trails);

        this.camera.target = new Vec(bounds.x / 2, bounds.y / 2, bounds.z / 2);

        // Collect all renderables with z-depth for sorting
        const renderables = [];

        // Wireframe cube + grid
        if (visuals.grid) {
            this._drawCube3D(bounds);
        }

        // Obstacles
        for (let i = 0; i < obstacles.length; i++) {
            const p = this.camera.project(obstacles[i].pos, this.width, this.height);
            if (p) renderables.push({ type: 'obstacle', data: obstacles[i], proj: p });
        }

        // Boids
        for (let i = 0; i < boids.length; i++) {
            const p = this.camera.project(boids[i].pos, this.width, this.height);
            if (p) renderables.push({ type: 'boid', data: boids[i], proj: p });
        }

        // Predator
        if (predator) {
            const p = this.camera.project(predator.pos, this.width, this.height);
            if (p) renderables.push({ type: 'predator', data: predator, proj: p });
        }

        // Z-sort (far to near)
        renderables.sort((a, b) => b.proj.z - a.proj.z);

        for (let i = 0; i < renderables.length; i++) {
            const r = renderables[i];
            if (r.type === 'boid') this._drawBoid3D(r.data, r.proj, visuals);
            else if (r.type === 'predator') this._drawPredator3D(r.data, r.proj, visuals);
            else if (r.type === 'obstacle') this._drawObstacle3D(r.data, r.proj);
        }
    }

    _drawCube3D(bounds) {
        const ctx = this.ctx;
        const bx = bounds.x, by = bounds.y, bz = bounds.z;

        // 8 corners of the cube
        const corners = [
            new Vec(0,  0,  0),   // 0: front-top-left
            new Vec(bx, 0,  0),   // 1: front-top-right
            new Vec(bx, by, 0),   // 2: front-bottom-right
            new Vec(0,  by, 0),   // 3: front-bottom-left
            new Vec(0,  0,  bz),  // 4: back-top-left
            new Vec(bx, 0,  bz),  // 5: back-top-right
            new Vec(bx, by, bz),  // 6: back-bottom-right
            new Vec(0,  by, bz),  // 7: back-bottom-left
        ];

        // 12 edges
        const edges = [
            [0,1],[1,2],[2,3],[3,0], // front face
            [4,5],[5,6],[6,7],[7,4], // back face
            [0,4],[1,5],[2,6],[3,7], // connecting edges
        ];

        const projected = corners.map(c => this.camera.project(c, this.width, this.height));

        // Draw edges with glow
        for (const [a, b] of edges) {
            const pa = projected[a], pb = projected[b];
            if (!pa || !pb) continue;

            // Glow pass
            ctx.strokeStyle = 'rgba(110, 86, 207, 0.08)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();

            // Main edge
            ctx.strokeStyle = 'rgba(110, 86, 207, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();
        }

        // Corner dots
        for (const p of projected) {
            if (!p) continue;
            ctx.fillStyle = 'rgba(110, 86, 207, 0.5)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Grid on bottom face (y = by)
        const step = bx / 6;
        ctx.strokeStyle = 'rgba(50, 50, 70, 0.15)';
        ctx.lineWidth = 0.5;

        for (let x = step; x < bx; x += step) {
            const p1 = this.camera.project(new Vec(x, by, 0), this.width, this.height);
            const p2 = this.camera.project(new Vec(x, by, bz), this.width, this.height);
            if (p1 && p2) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
        for (let z = step; z < bz; z += step) {
            const p1 = this.camera.project(new Vec(0, by, z), this.width, this.height);
            const p2 = this.camera.project(new Vec(bx, by, z), this.width, this.height);
            if (p1 && p2) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }

    _drawBoid3D(boid, proj, visuals) {
        const ctx = this.ctx;
        const s = Math.max(3, 8 * proj.scale);
        const alpha = Math.max(0.25, Math.min(0.95, 1.2 - proj.z / 1500));
        const speed = boid.vel.mag();
        const hue = 220 + speed * 15;

        // Trail
        if (visuals.trails && boid.trail.length > 1) {
            ctx.beginPath();
            let started = false;
            for (let i = 0; i < boid.trail.length; i++) {
                const tp = this.camera.project(boid.trail[i], this.width, this.height);
                if (tp) {
                    if (!started) { ctx.moveTo(tp.x, tp.y); started = true; }
                    else ctx.lineTo(tp.x, tp.y);
                }
            }
            ctx.strokeStyle = `rgba(110, 86, 207, ${alpha * 0.15})`;
            ctx.lineWidth = Math.max(0.5, proj.scale);
            ctx.stroke();
        }

        // Dot
        ctx.fillStyle = `hsla(${hue}, 70%, 65%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, s, 0, Math.PI * 2);
        ctx.fill();

        // Velocity vector
        if (visuals.vectors) {
            const tip = boid.pos.add(boid.vel.norm().mul(15));
            const tp = this.camera.project(tip, this.width, this.height);
            if (tp) {
                ctx.beginPath();
                ctx.moveTo(proj.x, proj.y);
                ctx.lineTo(tp.x, tp.y);
                ctx.strokeStyle = `rgba(0, 212, 170, ${alpha * 0.3})`;
                ctx.lineWidth = Math.max(0.5, proj.scale * 0.8);
                ctx.stroke();
            }
        }
    }

    _drawPredator3D(pred, proj, visuals) {
        const ctx = this.ctx;
        const s = Math.max(6, 16 * proj.scale);
        const alpha = Math.max(0.4, Math.min(1, 1.2 - proj.z / 1500));
        const glow = 0.5 + 0.3 * Math.sin(pred.glowPhase);

        // Glow
        const glowR = s * 4;
        const gradient = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, glowR);
        gradient.addColorStop(0, `rgba(229, 72, 77, ${glow * 0.3 * alpha})`);
        gradient.addColorStop(1, 'rgba(229, 72, 77, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(proj.x - glowR, proj.y - glowR, glowR * 2, glowR * 2);

        // Trail
        if (visuals.trails && pred.trail.length > 1) {
            ctx.beginPath();
            let started = false;
            for (let i = 0; i < pred.trail.length; i++) {
                const tp = this.camera.project(pred.trail[i], this.width, this.height);
                if (tp) {
                    if (!started) { ctx.moveTo(tp.x, tp.y); started = true; }
                    else ctx.lineTo(tp.x, tp.y);
                }
            }
            ctx.strokeStyle = `rgba(229, 72, 77, ${alpha * 0.2})`;
            ctx.lineWidth = Math.max(1, proj.scale * 2);
            ctx.stroke();
        }

        // Body
        ctx.fillStyle = `rgba(229, 72, 77, ${(0.7 + glow * 0.3) * alpha})`;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, s, 0, Math.PI * 2);
        ctx.fill();

        // Inner
        ctx.fillStyle = `rgba(255, 120, 120, ${0.5 * alpha})`;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, s * 0.4, 0, Math.PI * 2);
        ctx.fill();
    }

    _drawObstacle3D(obs, proj) {
        const ctx = this.ctx;
        const r = Math.max(8, obs.radius * proj.scale);
        const alpha = Math.max(0.2, Math.min(0.6, 1.2 - proj.z / 1500));

        const gradient = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, r);
        gradient.addColorStop(0, `rgba(60, 60, 80, ${alpha})`);
        gradient.addColorStop(0.7, `rgba(40, 40, 60, ${alpha * 0.6})`);
        gradient.addColorStop(1, 'rgba(40, 40, 60, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(100, 100, 140, ${alpha * 0.6})`;
        ctx.lineWidth = Math.max(0.5, proj.scale);
        ctx.stroke();
    }
}
