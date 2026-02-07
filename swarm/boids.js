// ── Vec: 3D vector math ──

class Vec {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x; this.y = y; this.z = z;
    }
    copy() { return new Vec(this.x, this.y, this.z); }
    add(v) { return new Vec(this.x + v.x, this.y + v.y, this.z + v.z); }
    sub(v) { return new Vec(this.x - v.x, this.y - v.y, this.z - v.z); }
    mul(s) { return new Vec(this.x * s, this.y * s, this.z * s); }
    div(s) { return s !== 0 ? new Vec(this.x / s, this.y / s, this.z / s) : new Vec(); }
    dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }
    cross(v) {
        return new Vec(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }
    mag() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); }
    magSq() { return this.x * this.x + this.y * this.y + this.z * this.z; }
    norm() { const m = this.mag(); return m > 0 ? this.div(m) : new Vec(); }
    limit(max) {
        const msq = this.magSq();
        if (msq > max * max) {
            return this.norm().mul(max);
        }
        return this.copy();
    }
    distTo(v) { return this.sub(v).mag(); }
    static random2D() {
        const a = Math.random() * Math.PI * 2;
        return new Vec(Math.cos(a), Math.sin(a), 0);
    }
    static random3D() {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        return new Vec(
            Math.sin(phi) * Math.cos(theta),
            Math.sin(phi) * Math.sin(theta),
            Math.cos(phi)
        );
    }
}

// ── Spatial Hash Grid ──

class SpatialHash {
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.cells = new Map();
    }

    clear() {
        this.cells.clear();
    }

    _key(x, y, z) {
        const cx = Math.floor(x / this.cellSize);
        const cy = Math.floor(y / this.cellSize);
        const cz = Math.floor(z / this.cellSize);
        return `${cx},${cy},${cz}`;
    }

    insert(entity) {
        const key = this._key(entity.pos.x, entity.pos.y, entity.pos.z);
        if (!this.cells.has(key)) this.cells.set(key, []);
        this.cells.get(key).push(entity);
    }

    query(pos, radius) {
        const results = [];
        const r = Math.ceil(radius / this.cellSize);
        const cx = Math.floor(pos.x / this.cellSize);
        const cy = Math.floor(pos.y / this.cellSize);
        const cz = Math.floor(pos.z / this.cellSize);
        for (let dx = -r; dx <= r; dx++) {
            for (let dy = -r; dy <= r; dy++) {
                for (let dz = -r; dz <= r; dz++) {
                    const key = `${cx + dx},${cy + dy},${cz + dz}`;
                    const cell = this.cells.get(key);
                    if (cell) {
                        for (let i = 0; i < cell.length; i++) {
                            results.push(cell[i]);
                        }
                    }
                }
            }
        }
        return results;
    }
}

// ── Boid ──

class Boid {
    constructor(x, y, z, is3D) {
        this.pos = new Vec(x, y, z);
        this.vel = (is3D ? Vec.random3D() : Vec.random2D()).mul(2 + Math.random() * 2);
        this.acc = new Vec();
        this.trail = [];
        this.maxTrail = 12;
    }

    applyForce(force) {
        this.acc = this.acc.add(force);
    }

    flock(neighbors, params) {
        let separation = new Vec();
        let alignment = new Vec();
        let cohesion = new Vec();
        let sepCount = 0;
        let aliCount = 0;

        for (let i = 0; i < neighbors.length; i++) {
            const other = neighbors[i];
            if (other === this) continue;
            const d = this.pos.distTo(other.pos);
            if (d <= 0) continue;

            if (d < params.separationRadius) {
                const diff = this.pos.sub(other.pos).norm().div(d);
                separation = separation.add(diff);
                sepCount++;
            }
            if (d < params.perceptionRadius) {
                alignment = alignment.add(other.vel);
                cohesion = cohesion.add(other.pos);
                aliCount++;
            }
        }

        if (sepCount > 0) {
            separation = separation.div(sepCount).norm().mul(params.maxSpeed).sub(this.vel).limit(params.maxForce);
        }
        if (aliCount > 0) {
            alignment = alignment.div(aliCount).norm().mul(params.maxSpeed).sub(this.vel).limit(params.maxForce);
            cohesion = cohesion.div(aliCount).sub(this.pos).norm().mul(params.maxSpeed).sub(this.vel).limit(params.maxForce);
        }

        this.applyForce(separation.mul(params.separationWeight));
        this.applyForce(alignment.mul(params.alignmentWeight));
        this.applyForce(cohesion.mul(params.cohesionWeight));
    }

    avoidObstacles(obstacles, params) {
        const detectRange = params.perceptionRadius * 1.5;
        for (let i = 0; i < obstacles.length; i++) {
            const obs = obstacles[i];
            const diff = this.pos.sub(obs.pos);
            const d = diff.mag();
            const buffer = obs.radius + 15;
            if (d < detectRange && d > 0) {
                const strength = Math.max(0, 1 - (d - buffer) / (detectRange - buffer));
                const force = diff.norm().mul(params.maxSpeed * strength * 2.5).sub(this.vel).limit(params.maxForce * 3);
                this.applyForce(force);
            }
        }
    }

    fleePredator(predator, params) {
        if (!predator) return;
        const diff = this.pos.sub(predator.pos);
        const d = diff.mag();
        if (d < params.fleeRadius && d > 0) {
            const panic = 1 - d / params.fleeRadius;
            const strength = params.fleeWeight * (1 + panic * 3);
            const force = diff.norm().mul(params.maxSpeed * strength).sub(this.vel).limit(params.maxForce * 5);
            this.applyForce(force);
        }
    }

    contain(bounds, is3D) {
        const margin = 60;
        const strength = 0.4;
        let steer = new Vec();

        if (this.pos.x < margin) steer.x = strength * (1 - this.pos.x / margin);
        if (this.pos.x > bounds.x - margin) steer.x = -strength * (1 - (bounds.x - this.pos.x) / margin);
        if (this.pos.y < margin) steer.y = strength * (1 - this.pos.y / margin);
        if (this.pos.y > bounds.y - margin) steer.y = -strength * (1 - (bounds.y - this.pos.y) / margin);
        if (is3D) {
            if (this.pos.z < margin) steer.z = strength * (1 - this.pos.z / margin);
            if (this.pos.z > bounds.z - margin) steer.z = -strength * (1 - (bounds.z - this.pos.z) / margin);
        }
        this.applyForce(steer);
    }

    update(params) {
        this.vel = this.vel.add(this.acc).limit(params.maxSpeed);
        this.trail.push(this.pos.copy());
        if (this.trail.length > this.maxTrail) this.trail.shift();
        this.pos = this.pos.add(this.vel);
        this.acc = new Vec();
    }
}

// ── Predator ──

class Predator {
    constructor(x, y, z) {
        this.pos = new Vec(x, y, z);
        this.vel = new Vec();
        this.acc = new Vec();
        this.trail = [];
        this.maxTrail = 20;
        this.glowPhase = 0;
    }

    pursue(boids, params) {
        if (boids.length === 0) return;

        // Find center of mass of nearby boids
        let com = new Vec();
        let count = 0;
        const huntRange = params.fleeRadius * 2;

        for (let i = 0; i < boids.length; i++) {
            const d = this.pos.distTo(boids[i].pos);
            if (d < huntRange) {
                com = com.add(boids[i].pos);
                count++;
            }
        }

        if (count === 0) {
            // No nearby boids, head toward global center of mass
            for (let i = 0; i < boids.length; i++) {
                com = com.add(boids[i].pos);
            }
            count = boids.length;
        }

        com = com.div(count);
        const desired = com.sub(this.pos).norm().mul(params.predatorSpeed);
        const steer = desired.sub(this.vel).limit(0.15);
        this.acc = this.acc.add(steer);
    }

    contain(bounds, is3D) {
        const margin = 40;
        const strength = 0.3;
        let steer = new Vec();
        if (this.pos.x < margin) steer.x = strength;
        if (this.pos.x > bounds.x - margin) steer.x = -strength;
        if (this.pos.y < margin) steer.y = strength;
        if (this.pos.y > bounds.y - margin) steer.y = -strength;
        if (is3D) {
            if (this.pos.z < margin) steer.z = strength;
            if (this.pos.z > bounds.z - margin) steer.z = -strength;
        }
        this.acc = this.acc.add(steer);
    }

    update(params) {
        this.vel = this.vel.add(this.acc).limit(params.predatorSpeed);
        this.trail.push(this.pos.copy());
        if (this.trail.length > this.maxTrail) this.trail.shift();
        this.pos = this.pos.add(this.vel);
        this.acc = new Vec();
        this.glowPhase += 0.05;
    }
}

// ── Obstacle ──

class Obstacle {
    constructor(x, y, z, radius) {
        this.pos = new Vec(x, y, z);
        this.radius = radius;
    }
}
