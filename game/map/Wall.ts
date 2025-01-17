import {OBB} from "../entities/hitboxes/OBB";
import {Vector3} from "../../math/Vector";

/**
 * Represents a bricks made up of bricks, with optional configurations for a door.
 */
class Wall {
    /**
     * Indicates whether the bricks has a door.
     * @private
     * @type {boolean}
     */
    private door: boolean;

    /**
     * Hitbox of bricks
     * @private
     * @type {OBB}
     */
    private hitbox: OBB;

    /**
     * @param orientation Set orientation od bricks 0 / 90 deg
     */
    private orientation: number;

    /**
     * @param orientation Set orientation od bricks 0 / 90 deg
     * @param center center of hitbox / bricks
     */

    /**
     * Center of the hitbox of the bricks
     * @private center
     */
    private center: Vector3;
    private quaternions: number[];

    constructor(orientation: number, center: Vector3) {
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
        )
        this.center = this.hitbox.center;
        this.quaternions = [0, 0, 0, 1];
    }

    /**
     * Regenerates the bricks structure.
     * If the bricks has a door, this will adjust the bricks layout to include it.
     * Otherwise, creates a solid bricks structure with alternating rows of full and half bricks.
     */
    private generateWall(): void {
        if (this.door) {
            // TODO: Implement logic for a bricks with a door.
            return;
        }
    }

    /**
     * Checks whether the bricks has a door.
     * @returns {boolean} `true` if the bricks has a door, `false` otherwise.
     */
    get isDoor(): boolean {
        return this.door;
    }

    /**
     * Sets whether the bricks should have a door.
     * @param {boolean} value - `true` to include a door, `false` otherwise.
     */
    set isDoor(value: boolean) {
        this.door = value;
    }

    set setHitboxCenter(vector: Vector3) {
        this.hitbox.updatePosition(vector);
    }

    get getHitbox(): OBB {
        return this.hitbox;
    }

    get getCenter(): Vector3 {
        return this.center;
    }

    get getOrientation(): number {
        return this.orientation;
    }

    rotateHitbox() {
        this.hitbox.rotateY90("right")
        this.quaternions[1] = Math.sin(Math.PI / 4);
        this.quaternions[3] = Math.cos(Math.PI / 4);
    }

    get getQuaternions(): number[] {
        return this.quaternions;
    }
}

export { Wall };
