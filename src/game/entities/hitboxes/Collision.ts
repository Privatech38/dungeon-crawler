import {Hitbox} from "./Hitbox.js";
import {Vector3} from "../../../math/Vector.js";

/**
 * Represents the result of a collision between two hitboxes.
 */
class CollisionResult {
    /**
     * The first hitbox involved in the collision.
     * @type {Hitbox}
     */
    private readonly _hitboxA: Hitbox;

    /**
     * The second hitbox involved in the collision.
     * @type {Hitbox}
     */
    private readonly _hitboxB: Hitbox;

    /**
     * The point of collision, or null if there was no collision.
     * @type {Vector3 | null}
     */
    private readonly _collisionPoint: Vector3 | null;

    /**
     * Creates an instance of CollisionResult.
     * @param {Hitbox} hitboxA - The first hitbox involved in the collision.
     * @param {Hitbox} hitboxB - The second hitbox involved in the collision.
     * @param {Vector3 | null} [collisionPoint=null] - The point of collision, if any.
     */
    constructor(hitboxA: Hitbox, hitboxB: Hitbox, collisionPoint: Vector3 | null) {
        this._hitboxA = hitboxA;
        this._hitboxB = hitboxB;
        this._collisionPoint = collisionPoint;
    }

    get hitboxA(): Hitbox {
        return this._hitboxA;
    }

    get hitboxB(): Hitbox {
        return this._hitboxB;
    }

    get collisionPoint(): Vector3 | null {
        return this._collisionPoint;
    }
}

/**
 * Manages collision detection between hitboxes.
 */
class CollisionManager{
    /**
     * Checks for a collision between two hitboxes.
     * @returns {CollisionResult} - The result of the collision check.
     */

    public checkCollision(hitboxA: Hitbox, hitboxB: Hitbox): CollisionResult {
        let collisionResult = new CollisionResult(hitboxA, hitboxB, null);
        if (!hitboxA.isActive || !hitboxB.isActive) return collisionResult;

        if (hitboxA.collides(hitboxB)) {
            collisionResult = new CollisionResult(hitboxA, hitboxB, hitboxA.center.add(hitboxB.center).scale(0.5));
            return collisionResult;
        }
        return collisionResult;
    }
}

export { CollisionResult, CollisionManager };
