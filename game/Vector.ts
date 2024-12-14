class Vector {
    x: number;
    y: number;
    z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(other: Vector): Vector {
        return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    subtract(other: Vector): Vector {
        return new Vector(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    multiply(scalar: number): Vector {
        return new Vector(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    distanceTo(other: Vector): number {
        return Math.sqrt(
            Math.pow(this.x - other.x, 2) +
            Math.pow(this.y - other.y, 2) +
            Math.pow(this.z - other.z, 2)
        );
    }

    dot(other: Vector): number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    cross(other: Vector): Vector {
        return new Vector(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        );
    }

    normalize(): Vector {
        const length = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
        return length === 0 ? new Vector(0, 0, 0) : this.multiply(1 / length);
    }

    isZero(): boolean {
        return this.x === 0 && this.y === 0 && this.z === 0;
    }

    projectOnto(other: Vector): number {
        const dotProduct = this.dot(other);
        const otherLengthSquared = other.dot(other);
        return dotProduct / otherLengthSquared;
    }

    getDirectionVector(end: Vector): Vector {
        return end.subtract(new Vector(this.x, this.y, this.z)).normalize();
    }

    magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    computeEndPoint(direction: Vector, magnitude: number, scale: number): Vector {
        return direction.multiply(scale / magnitude);
    }

    static getAngleBetweenVectors(v1: Vector, v2: Vector): number {
        const dotProduct = v1.dot(v2);
        const magnitudeV1 = v1.magnitude();
        const magnitudeV2 = v2.magnitude();

        if (magnitudeV1 === 0 || magnitudeV2 === 0) {
            return 0; // Avoid division by zero
        }

        const cosTheta = dotProduct / (magnitudeV1 * magnitudeV2);
        return Math.acos(Math.min(Math.max(cosTheta, -1), 1));
    }

    equals(other: Vector): boolean {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }
}

export { Vector }