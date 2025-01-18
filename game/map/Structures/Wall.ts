import { OBB } from "../../entities/hitboxes/OBB.js";
import { Vector3 } from "../../../math/Vector.js";
import { Structure } from "./Structure.js";

/**
 * Represents a wall structure made up of bricks, with optional configurations for a door.
 */
class Wall extends Structure {
    /**
     * Indicates whether the wall has a door.
     * @private
     * @type {boolean}
     */
    private door: boolean;

    /**
     * Hitbox of the wall.
     * @private
     * @type {OBB}
     */
    private readonly hitbox: OBB;

    /**
     * Creates a new Wall instance.
     * @param {number} orientation - The orientation of the wall (0 or 90 degrees).
     * @param {Vector3} center - The center of the wall's hitbox.
     * @param quaternions - orientation in quaternions
     */
    constructor(orientation: number, center: Vector3, quaternions = [0, 0, 0, 1]) {
        super(center, quaternions);
        this.door = false;
        this.hitbox = new OBB(
            [
                new Vector3(1, 0, 0),
                new Vector3(0, 1, 0),
                new Vector3(0, 0, 1),
            ],
            new Vector3(1.5, 1.1, 0.3),
            center
        );
    }

    /**
     * Regenerates the wall structure.
     * If the wall has a door, this adjusts the wall layout to include it.
     * Otherwise, creates a solid wall structure with alternating rows of full and half bricks.
     * @private
     */
    private generateWall(): void {
        if (this.door) {
            // TODO: Implement logic for a wall with a door.
            return;
        }
    }

    /**
     * Checks whether the wall has a door.
     * @returns {boolean} `true` if the wall has a door, `false` otherwise.
     */
    get isDoor(): boolean {
        return this.door;
    }

    /**
     * Sets whether the wall should have a door.
     * @param {boolean} value - `true` to include a door, `false` otherwise.
     */
    set isDoor(value: boolean) {
        this.door = value;
    }

    /**
     * Updates the center of the wall's hitbox.
     * @param {Vector3} vector - The new center position.
     */
    set setHitboxCenter(vector: Vector3) {
        this.hitbox.updatePosition(vector);
    }

    /**
     * Retrieves the wall's hitbox.
     * @returns {OBB} The wall's hitbox.
     */
    get getHitbox(): OBB {
        return this.hitbox;
    }

    /**
     * Rotates the wall's hitbox by 90 degrees around the Y-axis.
     */
    rotateHitbox(): void {
        this.hitbox.rotateY90("right");
    }

    get getCenter(): Vector3 {
        return this.center;
    }
}

export { Wall };
