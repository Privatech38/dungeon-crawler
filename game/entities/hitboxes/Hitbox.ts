import { Vector3 } from "../../../math/Vector";


/**
 * Abstract class representing a 3D hitbox
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
    updatePosition(vector: Vector3): void {
        this.center = vector;
    }

}


export { Hitbox };
