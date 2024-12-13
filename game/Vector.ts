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
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2) + Math.pow(this.z - other.z, 2));
    }

    normalize(): Vector {
        const length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        if (length === 0) return new Vector(0, 0, 0);
        return new Vector(this.x / length, this.y / length, this.z / length);
    }

    // Project onto another vector (used for semi-circle collision)
    projectOnto(other: Vector): number {
        const dotProduct = this.x * other.x + this.y * other.y + this.z * other.z;
        const otherLengthSquared = other.x * other.x + other.y * other.y + other.z * other.z;
        return dotProduct / otherLengthSquared;
    }

    // Method to get the direction vector from a start point to an end point
    static getDirectionVector(start: Vector, end: Vector): Vector {
        return end.subtract(start);
    }

    // Method to calculate the magnitude of the vector
    static getMagnitude(vector: Vector): number {
        return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2) + Math.pow(vector.z, 2));
    }

    // Method to compute the endpoint of the vector based on a desired length
    computeEndPoint(direction: Vector, magnitude: number, scale: number): Vector {
        return direction.multiply(scale/magnitude);
    }
}

export { Vector };
