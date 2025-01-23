import {Hitbox} from "./Hitbox.js";
import {Vector3} from "../../../math/Vector.js";
import {Sphere} from "./Sphere.js";
import {Point} from "./Point.js";
import {Matrix4x4} from "../../../math/Matrix4x4.js";

/**
 * Class representing an Oriented Bounding Box (OBB).
 * A 3D box that can be rotated, defined by a center, orientation axes, and half-extents.
 */
class OBB extends Hitbox {
    private axes: [Vector3, Vector3, Vector3]; // Local axes (right, up, forward)
    private halfExtents: Vector3; // Half-dimensions along each axis

    /**
     * Creates a new Oriented Bounding Box.
     * @param center - The center of the OBB
     * @param axes - The local axes defining the orientation of the OBB
     * @param halfExtents - The half-extents (size) of the OBB along each axis
     * @param isActive - Whether the OBB is active (default is true)
     */
    constructor(
        axes: [Vector3, Vector3, Vector3],
        halfExtents: Vector3,
        center: Vector3 = new Vector3(0, 0, 0),
        isActive: boolean = true
    ) {
        super(center, isActive);
        this.axes = axes.map(axis => axis.normalize()) as [Vector3, Vector3, Vector3];
        this.halfExtents = halfExtents;
    }

    /**
     * Rotates the OBB 90 degrees around the Y-axis.
     * @param direction - 'left' for counterclockwise, 'right' for clockwise.
     */
    rotateY90(direction: 'left' | 'right'): void {
        if (direction === 'left') {
            // Rotate each axis by 90° counterclockwise around Y-axis
            this.axes[0] = this.axes[0].rotateY90();
            this.axes[2] = this.axes[2].rotateY90();
        } else if (direction === 'right') {
            // Rotate each axis by 90° clockwise around Y-axis
            this.axes[0] = this.axes[0].rotateY90().rotateY90().rotateY90();  // 270° clockwise
            this.axes[2] = this.axes[2].rotateY90().rotateY90().rotateY90();  // 270° clockwise
        }
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
     * Updates the orientation of the OBB.
     * @param newAxes - The new orientation axes for the OBB
     */
    updateOrientation(newAxes: [Vector3, Vector3, Vector3]): void {
        this.axes = newAxes.map(axis => axis.normalize()) as [Vector3, Vector3, Vector3];
    }

    /**
     * Updates the forward (Y) axis of the OBB.
     * @param newY - The new forward (Y) axis
     */
    updateUpAxis(newY: Vector3) {
        this.axes[1] = newY.normalize();
    }

    /**
     * Updates the up (Z) axis of the OBB.
     * @param newZ - The new up (Z) axis
     */
    updateForwardAxis(newZ: Vector3) {
        this.axes[2] = newZ.normalize();
    }

    /**
     * Updates the left/right (X) axis of the OBB.
     * @param newX - The new left/right (X) axis
     */
    updateLeftRightAxis(newX: Vector3) {
        this.axes[0] = newX.normalize();
    }

    updateHalfExtents(newHalfExtents: Vector3) {
        this.halfExtents = newHalfExtents;
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

    get getAxes(): Vector3[] {
        return [
            this.axes[0].clone(),
            this.axes[1].clone(),
            this.axes[2].clone(),
        ]
    }

    get getHalfExtents(): Vector3 {
        return this.halfExtents.clone();
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
            if (distance > this.halfExtents.toArray[i]) {
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
        const crossProducts: Vector3[] = this.axes.reduce(
            (acc, a) => acc.concat(other.axes.map(b => a.cross(b))),
            [] as Vector3[]
        );

        const axesToTest: Vector3[] = [
            ...this.axes,
            ...other.axes,
            ...crossProducts,
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
     * Checks if OBB intersects with a sphere.
     * @param other - The sphere to check for intersection
     * @returns true if the OBB intersects the sphere, false otherwise
     */
    intersectsSphere(other: Sphere): boolean {
        let closestPoint = this.center;

        // Find the closest point on the OBB to the sphere center
        for (let i = 0; i < 3; i++) {
            const axis = this.axes[i];
            const distance = other.center.subtract(this.center).dot(axis);
            const clampedDistance = Math.max(-this.halfExtents.toArray[i], Math.min(this.halfExtents.toArray[i], distance));
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

    /**
     * Converts the OBB to a 4x4 transformation matrix
     */
    public toMatrix(): number[][] {
        // Initialize a 4x4 identity matrix
        const mat: number[][] = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];

        // Set rotation + scale (axes scaled by half-lengths)
        for (let i = 0; i < 3; i++) {
            const scaledAxis = this.axes[i].multiply(this.halfExtents.scale(2));
            mat[0][i] = scaledAxis.x;
            mat[1][i] = scaledAxis.y;
            mat[2][i] = scaledAxis.z;
        }

        // Set translation (center)
        mat[0][3] = this.center.x;
        mat[1][3] = this.center.y;
        mat[2][3] = this.center.z;

        return mat;
    }

    /**
     * Convert a 4x4 matrix to OBB object.
     * @param matrix {number[][]} - matrix you want to convert.
     * @returns OBB object.
     */
    static fromMatrix(matrix: Matrix4x4): OBB {
        const center = matrix.translation();
        const rotation = matrix.rotation();
        const scale = matrix.scale();

        return new OBB(
            [
                rotation[0].normalize(),
                rotation[1].normalize(),
                rotation[2].normalize()
            ],
            scale.scale(0.5),
            center
        )
    }

    public clone(): Hitbox {
        return new OBB(
            [this.axes[0].clone(),
            this.axes[1].clone(),
            this.axes[2].clone()],
            this.halfExtents.clone(),
            this.center,
            this.isActive
        );
    }
}

export { OBB };