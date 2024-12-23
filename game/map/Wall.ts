import { Brick } from "./Brick";

/**
 * Represents a wall made up of bricks, with optional configurations for a door.
 */
class Wall {
    /**
     * Indicates whether the wall has a door.
     * @private
     * @type {boolean}
     */
    private door: boolean;

    /**
     * A 2D array representing the structure of the wall.
     * Each element is a `Brick` object.
     * @private
     * @readonly
     * @type {Array<Array<Brick>>}
     */
    private readonly wall: Array<Array<Brick>>;

    /**
     * A brick representing a half brick.
     * @private
     * @readonly
     * @type {Brick}
     */
    private readonly halfBrick: Brick;

    /**
     * A brick representing a full brick.
     * @private
     * @readonly
     * @type {Brick}
     */
    private readonly fullBrick: Brick;

    constructor() {
        this.door = false;

        this.halfBrick = new Brick(false);
        this.fullBrick = new Brick(true);

        // Initialize the wall as a 5x5 array filled with placeholder values.
        this.wall = Array.from({ length: 5 }, () => Array(5).fill(0));
    }

    /**
     * Sets a specific brick at the given position in the wall.
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
        this.wall[row][col] = value;
    }

    /**
     * Regenerates the wall structure.
     * If the wall has a door, this will adjust the wall layout to include it.
     * Otherwise, creates a solid wall structure with alternating rows of full and half bricks.
     */
    private generateWall(): void {
        if (this.door) {
            // TODO: Implement logic for a wall with a door.
            return;
        }

        this.wall.forEach((line, i) => {
            if (i % 2 === 0) {
                // Full bricks for even rows.
                for (let j = 0; j < line.length; j++) {
                    this.setWallValue(i, j, this.fullBrick);
                }
            } else {
                // Half bricks at the edges and full bricks in the middle for odd rows.
                this.setWallValue(i, 0, this.halfBrick);
                this.setWallValue(i, line.length - 1, this.halfBrick);

                for (let j = 1; j < line.length - 1; j++) {
                    this.setWallValue(i, j, this.fullBrick);
                }
            }
        });
    }

    /**
     * Gets the 2D array representing the wall.
     * @returns {Array<Array<Brick>>} The current wall structure.
     */
    get getWall(): Array<Array<Brick>> {
        this.generateWall();
        return this.wall;
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
}

export { Wall };
