import Vector from "../Vector";

/**
 * A class representing a 3D Axis-Aligned Bounding Box (AABB) for collision detection.
 */
class HitBox {
    position: { x: number, y: number, z: number };
    size: { width: number, height: number, depth: number };

    /**
     * Creates an instance of the HitBox class.
     *
     * @param position - The position of the center of the bounding box.
     * @param width - The width of the bounding box.
     * @param height - The height of the bounding box.
     * @param depth - The depth of the bounding box.
     */
    constructor(position: { x: number, y: number, z: number } = { x: 0, y: 0, z: 0 }, width: number, height: number, depth: number) {
        this.position = position;
        this.size = { width, height, depth };
    }

    /**
     * Checks if a point is inside the bounding box.
     *
     * @param point - The point to check for intersection with the bounding box.
     * @returns `true` if the point is inside the bounding box, `false` otherwise.
     */
    public intersects(point: { x: number, y: number, z: number }): boolean {
        return (
            point.x >= this.position.x - this.size.width / 2 &&
            point.x <= this.position.x + this.size.width / 2 &&
            point.y >= this.position.y - this.size.height / 2 &&
            point.y <= this.position.y + this.size.height / 2 &&
            point.z >= this.position.z - this.size.depth / 2 &&
            point.z <= this.position.z + this.size.depth / 2
        );
    }

    /**
     * Checks if a line intersects the bounding box.
     *
     * @param lineStart - The start point of the line.
     * @param target - The direction (or target point) towards which the line is extended.
     * @param range - The maximum length of the line.
     * @returns `true` if the line intersects the bounding box, `false` otherwise.
     */
    public intersects_line(
        lineStart: { x: number, y: number, z: number },
        target: { x: number, y: number, z: number },
        range: number
    ): boolean {
        // Create a vector to calculate the endpoint of the line
        const vector = new Vector(lineStart, target, range);
        const lineEnd = vector.endPoint;

        // Define the min and max bounds of the AABB
        const min = {
            x: this.position.x - this.size.width / 2,
            y: this.position.y - this.size.height / 2,
            z: this.position.z - this.size.depth / 2,
        };
        const max = {
            x: this.position.x + this.size.width / 2,
            y: this.position.y + this.size.height / 2,
            z: this.position.z + this.size.depth / 2,
        };

        // Check for intersection using the AABB-line intersection algorithm
        let tMin = (min.x - lineStart.x) / (lineEnd.x - lineStart.x);
        let tMax = (max.x - lineStart.x) / (lineEnd.x - lineStart.x);

        if (tMin > tMax) [tMin, tMax] = [tMax, tMin];

        let tyMin = (min.y - lineStart.y) / (lineEnd.y - lineStart.y);
        let tyMax = (max.y - lineStart.y) / (lineEnd.y - lineStart.y);

        if (tyMin > tyMax) [tyMin, tMax] = [tMax, tyMin];

        if ((tMin > tyMax) || (tyMin > tMax)) return false;

        if (tyMin > tMin) tMin = tyMin;
        if (tyMax < tMax) tMax = tyMax;

        let tzMin = (min.z - lineStart.z) / (lineEnd.z - lineStart.z);
        let tzMax = (max.z - lineStart.z) / (lineEnd.z - lineStart.z);

        if (tzMin > tzMax) [tzMin, tzMax] = [tzMax, tzMin];

        return !((tMin > tzMax) || (tzMin > tMax));
    }

    /**
     * Checks if the current bounding box intersects with another bounding box.
     *
     * @param other - The other bounding box to check for intersection with.
     * @returns `true` if the two bounding boxes intersect, `false` otherwise.
     */
    public intersects_hitbox(other: HitBox): boolean {
        return (
            this.position.x - this.size.width / 2 < other.position.x + other.size.width / 2 &&
            this.position.x + this.size.width / 2 > other.position.x - other.size.width / 2 &&
            this.position.y - this.size.height / 2 < other.position.y + other.size.height / 2 &&
            this.position.y + this.size.height / 2 > other.position.y - other.size.height / 2 &&
            this.position.z - this.size.depth / 2 < other.position.z + other.size.depth / 2 &&
            this.position.z + this.size.depth / 2 > other.position.z - other.size.depth / 2
        );
    }

    /**
     * Checks if the hitbox intersects with a splash (spherical area).
     * @param splashPosition - The position of the splash center.
     * @param radius - The radius of the splash.
     * @returns `true` if the hitbox intersects with the splash, `false` otherwise.
     */
    public intersects_splash(splashPosition: { x: number, y: number, z: number }, radius: number): boolean {
        // Calculate the distance from the hitbox center to the splash center
        const distance = Math.sqrt(
            Math.pow(this.position.x - splashPosition.x, 2) +
            Math.pow(this.position.y - splashPosition.y, 2) +
            Math.pow(this.position.z - splashPosition.z, 2)
        );

        // Check if the hitbox is within the splash radius
        return distance <= radius;
    }
}

export default HitBox;
