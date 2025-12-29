import { vec3 } from 'glm';

export class AABB {
    public min: vec3;
    public max: vec3;

    constructor(
        min: vec3 = vec3.fromValues(Infinity, Infinity, Infinity),
        max: vec3 = vec3.fromValues(-Infinity, -Infinity, -Infinity)
    ) {
        this.min = vec3.clone(min);
        this.max = vec3.clone(max);
    }

    /**
     * Checks if a point is inside the box.
     */
    public containsPoint(point: vec3): boolean {
        return (
            point[0] >= this.min[0] && point[0] <= this.max[0] &&
            point[1] >= this.min[1] && point[1] <= this.max[1] &&
            point[2] >= this.min[2] && point[2] <= this.max[2]
        );
    }

    /**
     * Checks for intersection with another AABB.
     */
    public intersects(other: AABB): boolean {
        return (
            this.min[0] <= other.max[0] && this.max[0] >= other.min[0] &&
            this.min[1] <= other.max[1] && this.max[1] >= other.min[1] &&
            this.min[2] <= other.max[2] && this.max[2] >= other.min[2]
        );
    }

    /**
     * Returns the center of the box.
     */
    public getCenter(out: vec3 = vec3.create()): vec3 {
        return vec3.scale(out, vec3.add(out, this.min, this.max), 0.5);
    }
}