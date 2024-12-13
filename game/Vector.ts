/**
 * A class representing a 3D vector with a start and end point.
 * Provides methods for calculating direction, magnitude, and endpoint based on the vector's length.
 */
class Vector {
    start: { x: number; y: number; z: number };
    end: { x: number; y: number; z: number };
    length: number;
    direction: { x: number; y: number; z: number };
    magnitude: number;
    endPoint: { x: number; y: number; z: number };

    /**
     * Creates an instance of the Vector class.
     *
     * @param start - The starting point of the vector.
     * @param end - The ending point of the vector.
     * @param length - The length of the vector.
     */
    constructor(start: { x: number; y: number; z: number }, end: { x: number; y: number; z: number }, length: number) {
        this.start = start;
        this.end = end;
        this.length = length;

        // Compute initial values
        this.direction = this.get_direction_vector();
        this.magnitude = this.get_magnitude();
        this.endPoint = this.compute_end_point();
    }

    /**
     * Computes the direction vector from the start point to the end point.
     *
     * @returns The direction vector as an object with x, y, and z components.
     */
    private get_direction_vector(): { x: number; y: number; z: number } {
        return {
            x: this.end.x - this.start.x,
            y: this.end.y - this.start.y,
            z: this.end.z - this.start.z,
        };
    }

    /**
     * Calculates the magnitude (length) of the vector.
     *
     * @returns The magnitude of the vector.
     */
    private get_magnitude(): number {
        return Math.sqrt(
            Math.pow(this.direction.x, 2) +
            Math.pow(this.direction.y, 2) +
            Math.pow(this.direction.z, 2)
        );
    }

    /**
     * Computes the endpoint of the vector based on the direction and magnitude.
     *
     * @returns The calculated endpoint as an object with x, y, and z components.
     */
    private compute_end_point(): { x: number; y: number; z: number } {
        const scale = this.length / this.magnitude; // Normalize and scale
        return {
            x: this.start.x + this.direction.x * scale,
            y: this.start.y + this.direction.y * scale,
            z: this.start.z + this.direction.z * scale,
        };
    }

    /**
     * Recalculates the direction, magnitude, and endpoint of the vector.
     * This is useful if the vector properties change and need to be updated.
     */
    public recalculate(): void {
        this.direction = this.get_direction_vector();
        this.magnitude = this.get_magnitude();
        this.endPoint = this.compute_end_point();
    }
}

export default Vector;
