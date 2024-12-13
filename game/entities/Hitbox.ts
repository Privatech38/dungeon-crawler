import {Vector} from "../Vector";

abstract class Hitbox {
    position: Vector;
    isActive: boolean;

    constructor(position: Vector, isActive: boolean = true) {
        this.position = position;
        this.isActive = isActive;
    }

    abstract checkCollision(other: Hitbox): boolean;
    abstract checkPointCollision(point: Vector): boolean;

    deactivate() {
        this.isActive = false;
    }

    activate() {
        this.isActive = true;
    }

    move(newPosition: Vector) {
        this.position = newPosition;
    }
}

// Box Hitbox (3D Rectangular Prism)
class BoxHitbox extends Hitbox {
    width: number;
    height: number;
    depth: number;

    constructor(position: Vector, width: number, height: number, depth: number, isActive: boolean = true) {
        super(position, isActive);
        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    checkCollision(other: Hitbox): boolean {
        if (other instanceof BoxHitbox) {
            return this.isCollidingWithBox(other);
        } else if (other instanceof SphereHitbox) {
            return this.isCollidingWithSphere(other);
        } else if (other instanceof SemiCircleHitbox) {
            return this.isCollidingWithSemiCircle(other);
        }
        return false;
    }

    checkPointCollision(point: Vector): boolean {
        return (
            point.x >= this.position.x && point.x <= this.position.x + this.width &&
            point.y >= this.position.y && point.y <= this.position.y + this.height &&
            point.z >= this.position.z && point.z <= this.position.z + this.depth
        );
    }

    private isCollidingWithBox(other: BoxHitbox): boolean {
        const a = this.position;
        const b = other.position;
        const overlapX = a.x < b.x + other.width && a.x + this.width > b.x;
        const overlapY = a.y < b.y + other.height && a.y + this.height > b.y;
        const overlapZ = a.z < b.z + other.depth && a.z + this.depth > b.z;
        return overlapX && overlapY && overlapZ;
    }

    private isCollidingWithSphere(sphere: SphereHitbox): boolean {
        const closestX = Math.max(this.position.x, Math.min(sphere.position.x, this.position.x + this.width));
        const closestY = Math.max(this.position.y, Math.min(sphere.position.y, this.position.y + this.height));
        const closestZ = Math.max(this.position.z, Math.min(sphere.position.z, this.position.z + this.depth));
        const distance = Math.sqrt(Math.pow(closestX - sphere.position.x, 2) +
            Math.pow(closestY - sphere.position.y, 2) +
            Math.pow(closestZ - sphere.position.z, 2));
        return distance <= sphere.radius;
    }

    private isCollidingWithSemiCircle(semicircle: SemiCircleHitbox): boolean {
        const direction = semicircle.direction.normalize();
        const distance = this.position.distanceTo(semicircle.center);
        const projection = this.position.subtract(semicircle.center).projectOnto(direction);
        const radius = semicircle.radius;

        return distance <= radius && projection >= 0 && projection <= radius;
    }
}

// Sphere Hitbox (3D Sphere)
class SphereHitbox extends Hitbox {
    radius: number;

    constructor(position: Vector, radius: number, isActive: boolean = true) {
        super(position, isActive);
        this.radius = radius;
    }

    checkCollision(other: Hitbox): boolean {
        if (other instanceof SphereHitbox) {
            return this.isCollidingWithSphere(other);
        } else if (other instanceof BoxHitbox) {
            return this.isCollidingWithBox(other);
        } else if (other instanceof SemiCircleHitbox) {
            return this.isCollidingWithSemiCircle(other);
        }
        return false;
    }

    checkPointCollision(point: Vector): boolean {
        const distance = this.position.distanceTo(point);
        return distance <= this.radius;
    }

    private isCollidingWithSphere(other: SphereHitbox): boolean {
        const distance = this.position.distanceTo(other.position);
        return distance <= this.radius + other.radius;
    }

    private isCollidingWithBox(box: BoxHitbox): boolean {
        const closestX = Math.max(box.position.x, Math.min(this.position.x, box.position.x + box.width));
        const closestY = Math.max(box.position.y, Math.min(this.position.y, box.position.y + box.height));
        const closestZ = Math.max(box.position.z, Math.min(this.position.z, box.position.z + box.depth));
        const distance = Math.sqrt(Math.pow(closestX - this.position.x, 2) +
            Math.pow(closestY - this.position.y, 2) +
            Math.pow(closestZ - this.position.z, 2));
        return distance <= this.radius;
    }

    private isCollidingWithSemiCircle(semicircle: SemiCircleHitbox): boolean {
        const distance = this.position.distanceTo(semicircle.center);
        const projection = this.position.subtract(semicircle.center).projectOnto(semicircle.direction);
        return distance <= semicircle.radius && projection >= 0 && projection <= semicircle.radius;
    }
}

// 2D Semi-Circle Hitbox
class SemiCircleHitbox extends Hitbox {
    radius: number;
    direction: Vector; // Direction vector for the open side of the semi-circle
    center: Vector;

    constructor(center: Vector, radius: number, direction: Vector, isActive: boolean = true) {
        super(center, isActive);
        this.radius = radius;
        this.direction = direction;
        this.center = center;
    }

    checkCollision(other: Hitbox): boolean {
        if (other instanceof SphereHitbox) {
            return this.isCollidingWithSphere(other);
        } else if (other instanceof BoxHitbox) {
            return this.isCollidingWithBox(other);
        } else if (other instanceof SemiCircleHitbox) {
            return this.isCollidingWithSemiCircle(other);
        }
        return false;
    }

    checkPointCollision(point: Vector): boolean {
        const distance = this.center.distanceTo(point);
        const directionProjection = point.subtract(this.center).projectOnto(this.direction);
        return distance <= this.radius && directionProjection >= 0 && directionProjection <= this.radius;
    }

    private isCollidingWithSphere(sphere: SphereHitbox): boolean {
        const distance = this.center.distanceTo(sphere.position);
        const projection = sphere.position.subtract(this.center).projectOnto(this.direction);
        return distance <= this.radius && projection >= 0 && projection <= this.radius;
    }

    private isCollidingWithBox(box: BoxHitbox): boolean {
        const closestPoint = new Vector(
            Math.max(this.center.x, Math.min(box.position.x, this.center.x + this.radius)),
            Math.max(this.center.y, Math.min(box.position.y, this.center.y + this.radius)),
            this.center.z
        );
        const distance = this.center.distanceTo(closestPoint);
        return distance <= this.radius;
    }

    private isCollidingWithSemiCircle(other: SemiCircleHitbox): boolean {
        const distance = this.center.distanceTo(other.center);
        return distance <= this.radius + other.radius;
    }
}

export { Hitbox, BoxHitbox, SphereHitbox, SemiCircleHitbox };