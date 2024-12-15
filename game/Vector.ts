class Vector3 {
    constructor(public x: number, public y: number, public z: number) {}

    // Check if vectors are the same
    equals(v: Vector3): boolean {
        return this.x === v.x && this.y === v.y && this.z === v.z;
    }

    // Add two vectors
    add(v: Vector3): Vector3 {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    // Subtract two vectors
    subtract(v: Vector3): Vector3 {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    // Scale the vector
    scale(s: number): Vector3 {
        return new Vector3(this.x * s, this.y * s, this.z * s);
    }

    // Compute dot product
    dot(v: Vector3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    // Compute cross product
    cross(v: Vector3): Vector3 {
        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    // Normalize the vector
    normalize(): Vector3 {
        const length = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
        return new Vector3(this.x / length, this.y / length, this.z / length);
    }

    magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    /**
     * projects this vector onto vector v
     * @param v - vector to be projected onto
     * @returns this vector projected onto v
     */
    project(v: Vector3): Vector3 {
        return v.scale(this.dot(v) / Math.pow(v.magnitude(), 2))
    }
}

export { Vector3 };