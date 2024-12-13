import {Hitbox} from "./Hitbox";
import {Vector} from "../Vector";

class CollisionResult {
    collides: boolean;
    hitboxA: Hitbox;
    hitboxB: Hitbox;
    collisionPoint: Vector | null;

    constructor(collides: boolean, hitboxA: Hitbox, hitboxB: Hitbox, collisionPoint: Vector | null = null) {
        this.collides = collides;
        this.hitboxA = hitboxA;
        this.hitboxB = hitboxB;
        this.collisionPoint = collisionPoint;
    }
}

class CollisionManager {
    static checkCollision(hitboxA: Hitbox, hitboxB: Hitbox): CollisionResult {
        if (hitboxA.checkCollision(hitboxB)) {
            const collisionPoint = hitboxA.position.add(hitboxB.position).multiply(0.5);
            return new CollisionResult(true, hitboxA, hitboxB, collisionPoint);
        }
        return new CollisionResult(false, hitboxA, hitboxB);
    }

    static checkMultipleCollisions(hitboxes: Hitbox[], target: Hitbox): CollisionResult[] {
        const results: CollisionResult[] = [];
        hitboxes.forEach(hitbox => {
            if (hitbox.checkCollision(target)) {
                const collisionPoint = hitbox.position.add(target.position).multiply(0.5);
                results.push(new CollisionResult(true, hitbox, target, collisionPoint));
            }
        });
        return results;
    }

    static checkPointCollision(hitbox: Hitbox, point: Vector): boolean {
        return hitbox.checkPointCollision(point);
    }
}

export { CollisionResult, CollisionManager };