import {Hitbox, OBB, Sphere, Vector3} from "./Hitbox";

/**
 * Class representing a point hitbox.
 * A point is a single location in 3D space.
 */
class Point extends Hitbox {
    /**
     * Creates a new Point hitbox.
     * @param center - The center of the point
     */
    constructor(center: Vector3) {
        super(center);
    }

    /**
     * Updates the position of the point.
     * @param vector - New position of the point
     */
    updatePosition(vector: Vector3): void {
        this.center = vector;
    }

    /**
     * Checks if the point collides with another hitbox.
     * @param other - The other hitbox to check collision with
     * @returns true if the point collides with the other hitbox, false otherwise
     */
    collides(other: Hitbox): boolean {
        if (other instanceof OBB) {
            return this.intersectsOBB(other);
        } else if (other instanceof Sphere) {
            return this.intersectsSphere(other);
        } else if (other instanceof Point) {
            return this.containsPoint(other);
        }
        return false;
    }

    /**
     * Checks if the point intersects with an OBB.
     * @param other - The OBB to check for intersection
     * @returns true if the point is inside the OBB, false otherwise
     */
    intersectsOBB(other: OBB): boolean {
        return other.containsPoint(this);
    }

    /**
     * Checks if the point intersects with a sphere.
     * @param other - The sphere to check for intersection
     * @returns true if the point is inside the sphere, false otherwise
     */
    intersectsSphere(other: Sphere): boolean {
        return other.containsPoint(this);
    }

    /**
     * Checks if the point is the same as another point.
     * @param other - The point to compare
     * @returns true if the points are the same, false otherwise
     */
    containsPoint(other: Point): boolean {
        return this.center.equals(other.center);
    }
}

export {Point};