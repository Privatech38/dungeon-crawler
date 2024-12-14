import { Hitbox } from "./Hitbox";
import { Vector3 } from "../Vector";

class CollisionResult {
    collides: boolean;
    hitboxA: Hitbox;
    hitboxB: Hitbox;
    collisionPoint: Vector3 | null;

    constructor(collides: boolean, hitboxA: Hitbox, hitboxB: Hitbox, collisionPoint: Vector3 | null = null) {
        this.collides = collides;
        this.hitboxA = hitboxA;
        this.hitboxB = hitboxB;
        this.collisionPoint = collisionPoint;
    }
}

class CollisionManager {
    static checkCollision(hitboxA: Hitbox, hitboxB: Hitbox): CollisionResult {
        if (!hitboxA.isActive || !hitboxB.isActive) return new CollisionResult(false, hitboxA, hitboxB);

        if (hitboxA.collides(hitboxB)) {
            const collisionPoint = hitboxA.center.add(hitboxB.center).scale(0.5);
            return new CollisionResult(true, hitboxA, hitboxB, collisionPoint);
        }
        return new CollisionResult(false, hitboxA, hitboxB);
    }
}

export { CollisionResult, CollisionManager };
