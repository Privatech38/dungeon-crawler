import {OBB} from "../entities/hitboxes/OBB.js";
import {Vector3} from "../../math/Vector.js";

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
    private readonly center: Vector3;
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

    randomise() {
        let y = Math.round(Math.random());
        let z = Math.round(Math.random());
        if (y === 1) {
            this.quaternions = this.multiplyQuaternions(this.getQuaternions, [1, 0, 0, 0]);
        }
        if (z === 1) {
            this.quaternions = this.multiplyQuaternions(this.getQuaternions, [0, 0, 1, 0]);
        }
    }

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


    get getQuaternions(): number[] {
        return this.quaternions;
    }
}

export { Wall };
