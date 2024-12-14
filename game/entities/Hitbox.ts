import { Vector3 } from "../Vector";

/**
 * Abstract class representing a 3D hitbox.
 * A hitbox is a shape that can be used for collision detection.
 */
abstract class Hitbox {
    center: Vector3; // The center of the hitbox in 3D space
    isActive: boolean; // Whether the hitbox is active or not

    /**
     * Creates a new hitbox.
     * @param center - The center of the hitbox
     * @param isActive - Whether the hitbox is active (default is true)
     */
    protected constructor(center: Vector3, isActive: boolean = true) {
        this.center = center;
        this.isActive = isActive;
    }

    /**
     * Checks if the current hitbox collides with another hitbox.
     * @param other - The other hitbox to check collision with
     * @returns true if the hitboxes collide, false otherwise
     */
    abstract collides(other: Hitbox): boolean;

    /**
     * Updates the position of the hitbox.
     * @param vector - The new position of the hitbox center
     */
    abstract updatePosition(vector: Vector3): void;
}

/**
 * Class representing an Oriented Bounding Box (OBB).
 * A 3D box that can be rotated, defined by a center, orientation axes, and half-extents.
 */
class OBB extends Hitbox {
    center: Vector3; // Center of the box
    axes: [Vector3, Vector3, Vector3]; // Local axes (right, up, forward)
    halfExtents: Vector3; // Half-dimensions along each axis

    /**
     * Creates a new Oriented Bounding Box.
     * @param center - The center of the OBB
     * @param axes - The local axes defining the orientation of the OBB
     * @param halfExtents - The half-extents (size) of the OBB along each axis
     * @param isActive - Whether the OBB is active (default is true)
     */
    constructor(center: Vector3, axes: [Vector3, Vector3, Vector3], halfExtents: Vector3, isActive: boolean = true) {
        super(center, isActive);
        this.center = center;
        this.axes = axes.map(axis => axis.normalize()) as [Vector3, Vector3, Vector3];
        this.halfExtents = halfExtents;
    }

    /**
     * Checks if the current OBB collides with another hitbox.
     * @param other - The other hitbox to check collision with
     * @returns true if the OBB collides with the other hitbox, false otherwise
     */
    collides(other: Hitbox): boolean {
        if (other instanceof OBB) {
            return this.intersects(other);
        } else if (other instanceof Sphere) {
            return this.intersectsSphere(other);
        } else if (other instanceof Point) {
            return this.containsPoint(other);
        }
        return false;
    }

    /**
     * Updates the position of the OBB.
     * @param newCenter - The new center position for the OBB
     */
    updatePosition(newCenter: Vector3): void {
        this.center = newCenter;
    }

    /**
     * Updates the orientation of the OBB.
     * @param newAxes - The new orientation axes for the OBB
     */
    updateOrientation(newAxes: [Vector3, Vector3, Vector3]): void {
        this.axes = newAxes.map(axis => axis.normalize()) as [Vector3, Vector3, Vector3];
    }

    /**
     * Returns all 8 vertices of the OBB.
     * @returns An array of Vector3 objects representing the vertices
     */
    getVertices(): Vector3[] {
        const { center, axes, halfExtents } = this;
        const vertices: Vector3[] = [];

        // Generate all 8 vertices of the box
        for (let x = -1; x <= 1; x += 2) {
            for (let y = -1; y <= 1; y += 2) {
                for (let z = -1; z <= 1; z += 2) {
                    const offset = axes[0].scale(x * halfExtents.x)
                        .add(axes[1].scale(y * halfExtents.y))
                        .add(axes[2].scale(z * halfExtents.z));
                    vertices.push(center.add(offset));
                }
            }
        }
        return vertices;
    }

    /**
     * Checks if a point is inside the OBB.
     * @param other - The point to check
     * @returns true if the point is inside the OBB, false otherwise
     */
    containsPoint(other: Point): boolean {
        const localPoint = other.center.subtract(this.center);

        // Project the point onto each axis and compare to half-extent
        for (let i = 0; i < 3; i++) {
            const distance = Math.abs(localPoint.dot(this.axes[i]));
            if (distance > this.halfExtents[i]) {
                return false;
            }
        }

        return true;
    }

    /**
     * Checks if the current OBB intersects with another OBB.
     * @param other - The other OBB to check for intersection
     * @returns true if the OBBs intersect, false otherwise
     */
    intersects(other: OBB): boolean {
        const axesToTest: Vector3[] = [
            ...this.axes,
            ...other.axes,
            ...[].concat(...this.axes.map(a => other.axes.map(b => a.cross(b))))
        ];

        for (const axis of axesToTest) {
            if (axis.x === 0 && axis.y === 0 && axis.z === 0) {
                continue; // Skip degenerate axes (zero vector)
            }

            const axisNormalized = axis.normalize();

            const projection1 = this.getProjectionRadius(axisNormalized);
            const projection2 = other.getProjectionRadius(axisNormalized);
            const centerDistance = Math.abs(
                this.center.subtract(other.center).dot(axisNormalized)
            );

            if (centerDistance > projection1 + projection2) {
                return false; // Separation found
            }
        }

        return true; // No separation found
    }

    /**
     * Checks if the OBB intersects with a sphere.
     * @param other - The sphere to check for intersection
     * @returns true if the OBB intersects the sphere, false otherwise
     */
    intersectsSphere(other: Sphere): boolean {
        let closestPoint = this.center;

        // Find the closest point on the OBB to the sphere center
        for (let i = 0; i < 3; i++) {
            const axis = this.axes[i];
            const distance = other.center.subtract(this.center).dot(axis);
            const clampedDistance = Math.max(-this.halfExtents[i], Math.min(this.halfExtents[i], distance));
            closestPoint = closestPoint.add(axis.scale(clampedDistance));
        }

        // Check the distance from the closest point to the sphere center
        const distanceToSphere = closestPoint.subtract(other.center);
        return distanceToSphere.dot(distanceToSphere) <= other.radius * other.radius;
    }

    /**
     * Helper: Get the projection radius of the OBB onto a given axis.
     * @param axis - The axis to project the OBB onto
     * @returns The projection radius of the OBB along the axis
     */
    private getProjectionRadius(axis: Vector3): number {
        return Math.abs(this.axes[0].dot(axis)) * this.halfExtents.x +
            Math.abs(this.axes[1].dot(axis)) * this.halfExtents.y +
            Math.abs(this.axes[2].dot(axis)) * this.halfExtents.z;
    }
}

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

    /**
     * Updates the position of the sphere.
     * @param vector - The new position of the sphere center
     */
    updatePosition(vector: Vector3): void {
        this.center = vector;
    }
}

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
     * @param vector - The new position of the point
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

export { Hitbox, OBB, Sphere, Point, Vector3 };
