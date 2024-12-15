import {Hitbox} from "./Hitbox";
import {Vector3} from "../../../math/Vector";
import {OBB} from "./OBB";
import {Point} from "./Point";

/**
 * Class representing a sphere hitbox.
 * A sphere is a circular shape defined by its center and radius.
 */
class Sphere extends Hitbox {
    radius: number; // The radius of the sphere

    /**
     * Creates a new Sphere.
     * @param center - The center of the sphere
     * @param radius - The radius of the sphere
     */
    constructor(center: Vector3, radius: number) {
        super(center);
        this.radius = radius;
    }

    /**
     * Checks if the sphere collides with another hitbox.
     * @param other - The other hitbox to check collision with
     * @returns true if the sphere collides with the other hitbox, false otherwise
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
     * Checks if the sphere contains a point.
     * @param other - The point to check
     * @returns true if the point is inside the sphere, false otherwise
     */
    containsPoint(other: Point): boolean {
        return other.center.subtract(this.center).dot(other.center.subtract(this.center))
            <= this.radius * this.radius;
    }

    /**
     * Checks if the sphere intersects with another sphere.
     * @param other - The other sphere to check for intersection
     * @returns true if the spheres intersect, false otherwise
     */
    intersectsSphere(other: Sphere): boolean {
        return this.center.subtract(other.center).dot(this.center.subtract(other.center))
            <= this.radius * this.radius + other.radius * other.radius;
    }

    /**
     * Checks if the sphere intersects with an OBB.
     * @param other - The OBB to check for intersection
     * @returns true if the sphere intersects the OBB, false otherwise
     */
    intersectsOBB(other: OBB): boolean {
        return other.intersectsSphere(this);
    }
}

export {Sphere};