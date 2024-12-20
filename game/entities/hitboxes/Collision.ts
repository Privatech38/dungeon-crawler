import {Hitbox} from "./Hitbox";
import {Vector3} from "../../../math/Vector";

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
     * @param {Hitbox} hitboxA - The first hitbox.
     * @param {Hitbox} hitboxB - The second hitbox.
     * @returns {CollisionResult} - The result of the collision check.
     */
    private hitboxA: Hitbox;
    private hitboxB: Hitbox;
    private collisionResult: CollisionResult;

    constructor(hitboxA: Hitbox, hitboxB: Hitbox) {
        this.hitboxA = hitboxA;
        this.hitboxB = hitboxB;
        this.collisionResult = new CollisionResult(hitboxA, hitboxB, null);
    }

    private checkCollision(): CollisionResult {
        if (!this.hitboxA.isActive || !this.hitboxB.isActive) return this.collisionResult;

        if (this.hitboxA.collides(this.hitboxB)) {
            this.collisionResult = new CollisionResult(this.hitboxA, this.hitboxB, this.hitboxA.center.add(this.hitboxB.center).scale(0.5));
            return this.collisionResult;
        }
        return this.collisionResult;
    }

    get getHitboxA(): Hitbox {
        return this.hitboxA;
    }

    set setHitboxA(hitboxA: Hitbox) {
        this.hitboxA = hitboxA;
    }

    get getHitboxB(): Hitbox {
        return this.hitboxB;
    }

    set setHitboxB(hitboxB: Hitbox) {
        this.hitboxB = hitboxB;
    }

    get result(): CollisionResult {
        this.checkCollision()
        return this.collisionResult;
    }

}

export { CollisionResult, CollisionManager };
