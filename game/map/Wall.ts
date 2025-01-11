import { Brick } from "./Brick";
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
     * A 2D array representing the structure of the bricks.
     * Each element is a `Brick` object.
     * @private
     * @readonly
     * @type {Array<Array<Brick>>}
     */
    private readonly bricks: Array<Array<Brick>>;

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

    constructor(orientation: number, center: Vector3) {
        this.door = false;
        this.orientation = orientation;
        this.orientation = orientation;
        this.hitbox = new OBB(
            [
                new Vector3(1, 0, 0),
                new Vector3(0, 1, 0),
                new Vector3(0, 0, 1),
            ],
            new Vector3(1.5, 1.1, 0.1),
            center
        )
        this.center = this.hitbox.center;

        // Initialize the bricks as a 5x5 array filled with placeholder values.
        this.bricks = Array.from({ length: 5 }, () => Array(5).fill(0));
        this.generateWall();
    }

    /**
     * Sets a specific brick at the given position in the bricks.
     * @private
     * @param {number} row - The row index (0-based).
     * @param {number} col - The column index (0-based).
     * @param {Brick} value - The `Brick` object to place in the specified position.
     * @throws {Error} If the row or column indices are out of bounds.
     */
    private setWallValue(row: number, col: number, value: Brick): void {
        if (row < 0 || row >= 5 || col < 0 || col >= 5) {
            throw new Error("Index out of bounds");
        }
        this.bricks[row][col] = value;
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

        this.bricks.forEach((line, i) => {
            if (i % 2 === 0) {
                // Full bricks for even rows.
                for (let j = 0; j < line.length; j++) {
                    let fullBrick = new Brick(true, this.orientation);
                    this.setWallValue(i, j, fullBrick);
                }
            } else {
                // Half bricks at the edges and full bricks in the middle for odd rows.
                let halfBrick = new Brick(false, this.orientation)
                this.setWallValue(i, 0, halfBrick);
                this.setWallValue(i, line.length - 1, halfBrick);

                for (let j = 1; j < line.length - 1; j++) {
                    let fullBrick = new Brick(true, this.orientation)
                    this.setWallValue(i, j, fullBrick);
                }
            }
        });
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

    get getBricks(): Array<Array<Brick>> {
        return this.bricks
    }
}

export { Wall };
