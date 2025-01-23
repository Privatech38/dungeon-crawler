class Vector3 {
    /**
     * Creates a new Vector3 instance.
     * @param {number} x - The x-coordinate of the vector.
     * @param {number} y - The y-coordinate of the vector.
     * @param {number} z - The z-coordinate of the vector.
     */
    constructor(public x: number, public y: number, public z: number) {}

    /**
     * Checks if this vector is equal to another vector.
     * @param {Vector3} v - The vector to compare with.
     * @returns {boolean} - True if the vectors are equal, false otherwise.
     */
    equals(v: Vector3): boolean {
        return this.x === v.x && this.y === v.y && this.z === v.z;
    }

    /**
     * Adds another vector to this vector.
     * @param {Vector3} v - The vector to add.
     * @returns {Vector3} - A new vector representing the sum of the two vectors.
     */
    add(v: Vector3): Vector3 {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    /**
     * Subtracts another vector from this vector.
     * @param {Vector3} v - The vector to subtract.
     * @returns {Vector3} - A new vector representing the difference of the two vectors.
     */
    subtract(v: Vector3): Vector3 {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    /**
     * Scales this vector by a scalar value.
     * @param {number} s - The scalar to scale the vector by.
     * @returns {Vector3} - A new vector scaled by the scalar.
     */
    scale(s: number): Vector3 {
        return new Vector3(this.x * s, this.y * s, this.z * s);
    }

    /**
     * Computes the dot product of this vector and another vector.
     * @param {Vector3} v - The other vector.
     * @returns {number} - The dot product of the two vectors.
     */
    dot(v: Vector3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    /**
     * Computes the cross product of this vector and another vector.
     * @param {Vector3} v - The other vector.
     * @returns {Vector3} - A new vector representing the cross product of the two vectors.
     */
    cross(v: Vector3): Vector3 {
        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    /**
     * Normalizes this vector to have a magnitude of 1.
     * @returns {Vector3} - A new normalized vector.
     */
    normalize(): Vector3 {
        const length = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
        return new Vector3(this.x / length, this.y / length, this.z / length);
    }

    /**
     * Computes the magnitude (length) of this vector.
     * @returns {number} - The magnitude of the vector.
     */
    magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    /**
     * Projects this vector onto another vector.
     * @param {Vector3} v - The vector to project onto.
     * @returns {Vector3} - A new vector representing the projection of this vector onto the other vector.
     */
    project(v: Vector3): Vector3 {
        return v.scale(this.dot(v) / Math.pow(v.magnitude(), 2));
    }

    multiply(v: Vector3): Vector3 {
        return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z);
    }

    get toArray(): number[] {
        return [this.x, this.y, this.z];
    }

    toString(): string {
        return "x: " + this.x + ", y: " + this.y + ", z: " + this.z + ""
    }

    clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    /**
     * Rotates the vector 90 degrees around the Y-axis (counterclockwise).
     * @returns A new Vector3 representing the rotated vector.
     */
    rotateY90(): Vector3 {
        // Rotation matrix for 90 degrees around the Y-axis
        return new Vector3(this.z, this.y, -this.x);
    }
}

export { Vector3 };
