import {Vector} from "../Vector";

export abstract class Hitbox {
    abstract checkHitboxCollision(otherHitbox: Hitbox): boolean;
    abstract checkPointCollision(point: Vector): boolean;
}

export class BoxHitbox extends Hitbox {
    constructor(public position: Vector, public width: number, public height: number) {
        super();
    }

    // Box vs Box collision check (non-overlapping and overlapping)
    checkHitboxCollision(otherHitbox: Hitbox): boolean {
        if (otherHitbox instanceof BoxHitbox) {
            const box1 = this;
            const box2 = otherHitbox;

            // Check if boxes are overlapping
            return !(box1.position.x + box1.width < box2.position.x ||
                box1.position.x > box2.position.x + box2.width ||
                box1.position.y + box1.height < box2.position.y ||
                box1.position.y > box2.position.y + box2.height);
        } else if (otherHitbox instanceof SphereHitbox) {
            // Box vs Sphere collision
            return this.checkSphereCollision(otherHitbox);
        } else if (otherHitbox instanceof SemiCircleHitbox) {
            // Box vs SemiCircle collision
            return this.checkSemiCircleCollision(otherHitbox);
        }
        return false;
    }

    // Check if a point is inside the box
    checkPointCollision(point: Vector): boolean {
        return point.x >= this.position.x && point.x <= this.position.x + this.width &&
            point.y >= this.position.y && point.y <= this.position.y + this.height;
    }

    // Box vs Sphere collision logic
    private checkSphereCollision(sphere: SphereHitbox): boolean {
        const closestPoint = sphere.position.closestPointOnBox(this);
        return closestPoint.distanceTo(sphere.position) <= sphere.radius;
    }

    // Box vs SemiCircle collision (simplified for this example)
    private checkSemiCircleCollision(semiCircle: SemiCircleHitbox): boolean {
        const closestPoint = semiCircle.position.closestPointOnBox(this);
        return closestPoint.distanceTo(semiCircle.position) <= semiCircle.radius;
    }
}

export class SemiCircleHitbox extends Hitbox {
    constructor(public position: Vector, public direction: Vector, public radius: number, public angle: number) {
        super();
    }

    checkHitboxCollision(otherHitbox: Hitbox): boolean {
        if (otherHitbox instanceof BoxHitbox) {
            return otherHitbox.checkHitboxCollision(this);
        } else if (otherHitbox instanceof SemiCircleHitbox) {
            return this.checkSemiCircleCollision(otherHitbox);
        } else if (otherHitbox instanceof SphereHitbox) {
            return this.checkSphereCollision(otherHitbox);
        }
        return false;
    }

    checkPointCollision(point: Vector): boolean {
        const distance = this.position.distanceTo(point);
        return distance <= this.radius && point.y <= this.position.y;
    }

    private checkSemiCircleCollision(other: SemiCircleHitbox): boolean {
        const distance = this.position.distanceTo(other.position);
        return distance <= this.radius + other.radius;
    }

    private checkSphereCollision(sphere: SphereHitbox): boolean {
        const closestPoint = sphere.position.closestPointOnBox(this);
        return closestPoint.distanceTo(sphere.position) <= sphere.radius;
    }
}

export class SphereHitbox extends Hitbox {
    constructor(public position: Vector, public radius: number) {
        super();
    }

    checkHitboxCollision(otherHitbox: Hitbox): boolean {
        if (otherHitbox instanceof BoxHitbox) {
            return otherHitbox.checkHitboxCollision(this);
        } else if (otherHitbox instanceof SemiCircleHitbox) {
            return this.checkSemiCircleCollision(otherHitbox);
        } else if (otherHitbox instanceof SphereHitbox) {
            return this.checkSphereCollision(otherHitbox);
        }
        return false;
    }

    checkPointCollision(point: Vector): boolean {
        return this.position.distanceTo(point) <= this.radius;
    }

    private checkSphereCollision(other: SphereHitbox): boolean {
        const distance = this.position.distanceTo(other.position);
        return distance <= this.radius + other.radius;
    }

    private checkSemiCircleCollision(semiCircle: SemiCircleHitbox): boolean {
        const distance = this.position.distanceTo(semiCircle.position);
        return distance <= semiCircle.radius;
    }
}