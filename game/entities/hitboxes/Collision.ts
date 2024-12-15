import { Hitbox } from "./Hitbox";
import {Vector3} from "../../../math/Vector";

/**
 * Represents the result of a collision between two hitboxes.
 */
class CollisionResult {
    /**
     * Indicates if a collision occurred.
     * @type {boolean}
     */
    collides: boolean;

    /**
     * The first hitbox involved in the collision.
     * @type {Hitbox}
     */
    hitboxA: Hitbox;

    /**
     * The second hitbox involved in the collision.
     * @type {Hitbox}
     */
    hitboxB: Hitbox;

    /**
     * The point of collision, or null if there was no collision.
     * @type {Vector3 | null}
     */
    collisionPoint: Vector3 | null;

    /**
     * Creates an instance of CollisionResult.
     * @param {boolean} collides - Whether the collision occurred.
     * @param {Hitbox} hitboxA - The first hitbox involved in the collision.
     * @param {Hitbox} hitboxB - The second hitbox involved in the collision.
     * @param {Vector3 | null} [collisionPoint=null] - The point of collision, if any.
     */
    constructor(collides: boolean, hitboxA: Hitbox, hitboxB: Hitbox, collisionPoint: Vector3 | null = null) {
        this.collides = collides;
        this.hitboxA = hitboxA;
        this.hitboxB = hitboxB;
        this.collisionPoint = collisionPoint;
    }
}

/**
 * Manages collision detection between hitboxes.
 */
class CollisionManager {
    /**
     * Checks for a collision between two hitboxes.
     * @param {Hitbox} hitboxA - The first hitbox.
     * @param {Hitbox} hitboxB - The second hitbox.
     * @returns {CollisionResult} - The result of the collision check.
     */
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
