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
    private hitbox: OBB;

    /**
     * Orientation of the wall (0 or 90 degrees).
     * @private
     * @type {number}
     */
    private orientation: number;

    /**
     * Creates a new Wall instance.
     * @param {number} orientation - The orientation of the wall (0 or 90 degrees).
     * @param {Vector3} center - The center of the wall's hitbox.
     * @param quaternions - orientation in quaternions
     */
    constructor(orientation: number, center: Vector3, quaternions = [0, 0, 0, 1]) {
        super(center, quaternions);
        this.door = false;
        this.orientation = orientation;
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
     * Retrieves the wall's orientation.
     * @returns {number} The wall's orientation (0 or 90 degrees).
     */
    get getOrientation(): number {
        return this.orientation;
    }

    /**
     * Rotates the wall's hitbox by 90 degrees around the Y-axis.
     */
    rotateHitbox(): void {
        this.hitbox.rotateY90("right");
        this.quaternions[1] = Math.sin(Math.PI / 4);
        this.quaternions[3] = Math.cos(Math.PI / 4);
    }

    /**
     * Randomizes the wall's rotation along the Y and Z axes.
     */
    randomise(): void {
        const y = Math.round(Math.random());
        const z = Math.round(Math.random());

        if (y === 1) {
            this.quaternions = this.multiplyQuaternions(this.getQuaternions, [1, 0, 0, 0]);
        }
        if (z === 1) {
            this.quaternions = this.multiplyQuaternions(this.getQuaternions, [0, 0, 1, 0]);
        }
    }

    /**
     * Multiplies two quaternions.
     * @private
     * @param {number[]} q1 - The first quaternion.
     * @param {number[]} q2 - The second quaternion.
     * @returns {number[]} The resulting quaternion.
     */
    private multiplyQuaternions(q1: number[], q2: number[]): number[] {
        const [x1, y1, z1, w1] = q1;
        const [x2, y2, z2, w2] = q2;

        return [
            w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2, // x
            w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2, // y
            w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2, // z
            w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2  // w
        ];
    }
}

export { Wall };
