export abstract class HitBoxBase {
    position: { x: number, y: number, z: number };

    protected constructor(position: { x: number, y: number, z: number } = { x: 0, y: 0, z: 0 }) {
        this.position = position;
    }

    // Abstract method for intersection with a point (for polymorphism)
    abstract intersects(point: { x: number, y: number, z: number }): boolean;

    // Abstract method for intersection with another hitbox (for polymorphism)
    abstract intersectsHitBox(other: HitBoxBase): boolean;
}

export class HitBox extends HitBoxBase {
    size: { width: number, height: number, depth: number };

    constructor(position: { x: number, y: number, z: number } = { x: 0, y: 0, z: 0 }, width: number, height: number, depth: number) {
        super(position);
        this.size = { width, height, depth };
    }

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

    public intersectsHitBox(other: HitBoxBase): boolean {
        if (other instanceof HitBox) {
            return (
                this.position.x - this.size.width / 2 < other.position.x + other.size.width / 2 &&
                this.position.x + this.size.width / 2 > other.position.x - other.size.width / 2 &&
                this.position.y - this.size.height / 2 < other.position.y + other.size.height / 2 &&
                this.position.y + this.size.height / 2 > other.position.y - other.size.height / 2 &&
                this.position.z - this.size.depth / 2 < other.position.z + other.size.depth / 2 &&
                this.position.z + this.size.depth / 2 > other.position.z - other.size.depth / 2
            );
        } else if (other instanceof SphereHitBox) {
            const distX = Math.abs(this.position.x - other.position.x);
            const distY = Math.abs(this.position.y - other.position.y);
            const distZ = Math.abs(this.position.z - other.position.z);

            const closestX = Math.max(0, distX - this.size.width / 2);
            const closestY = Math.max(0, distY - this.size.height / 2);
            const closestZ = Math.max(0, distZ - this.size.depth / 2);

            const distance = Math.sqrt(closestX * closestX + closestY * closestY + closestZ * closestZ);
            return distance <= other.radius;
        }

        return false;
    }
}

export class SphereHitBox extends HitBoxBase {
    radius: number;

    constructor(position: { x: number, y: number, z: number } = { x: 0, y: 0, z: 0 }, radius: number) {
        super(position);
        this.radius = radius;
    }

    public intersects(point: { x: number, y: number, z: number }): boolean {
        const distance = Math.sqrt(
            Math.pow(this.position.x - point.x, 2) +
            Math.pow(this.position.y - point.y, 2) +
            Math.pow(this.position.z - point.z, 2)
        );
        return distance <= this.radius;
    }

    public intersectsHitBox(other: HitBoxBase): boolean {
        if (other instanceof SphereHitBox) {
            const distance = Math.sqrt(
                Math.pow(this.position.x - other.position.x, 2) +
                Math.pow(this.position.y - other.position.y, 2) +
                Math.pow(this.position.z - other.position.z, 2)
            );
            return distance <= (this.radius + other.radius);
        } else if (other instanceof HitBox) {
            const distX = Math.abs(this.position.x - other.position.x);
            const distY = Math.abs(this.position.y - other.position.y);
            const distZ = Math.abs(this.position.z - other.position.z);

            const closestX = Math.max(0, distX - other.size.width / 2);
            const closestY = Math.max(0, distY - other.size.height / 2);
            const closestZ = Math.max(0, distZ - other.size.depth / 2);

            const distance = Math.sqrt(closestX * closestX + closestY * closestY + closestZ * closestZ);
            return distance <= this.radius;
        }

        return false;
    }
}
