import {Random} from "../../math/Random";

/**
 * Represents a brick with specific orientation and offset.
 */
class Brick {
    /**
     * Indicates the type of brick.
     * @private
     * @readonly
     * @type {boolean} - `false` for halfBrick, `true` for fullBrick.
     */
    private readonly brickType: boolean;

    /**
     * The maximum offset (in degrees) that can be applied to the brick's rotation.
     * Default is 5 degrees.
     * @private
     * @type {number}
     */
    private offset: number;

    /**
     * Creates a new brick with the specified type.
     * @param {boolean} fullBrick - `true` for a full brick, `false` for a half brick.
     */
    constructor(fullBrick: boolean) {
        this.brickType = fullBrick;
        this.offset = 5;
    }

    /**
     * Generates a random integer within the specified range.
     * @static
     * @param {number} min - The minimum value (inclusive).
     * @param {number} max - The maximum value (inclusive).
     * @returns {number} A random integer between `min` and `max`.
     */
    static brickIndex(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Generates a random offset within the allowable range.
     * @private
     * @returns {number} A random offset between `-offset` and `+offset`.
     */
    private randomOffset(): number {
        return Random.randInt(-this.offset, this.offset);
    }

    /**
     * Indicates whether the brick is a full brick.
     * @returns {boolean} `true` if the brick is a full brick, `false` otherwise.
     */
    get getIsFullBrick(): boolean {
        return this.brickType;
    }

    /**
     * Returns the brick's orientation (up - down).
     * The orientation is either `0` or `180` degrees, chosen at random.
     * @returns {number} The orientation in degrees.
     */
    get orientation(): number {
        return Math.round(Math.random()) * 180;
    }

    /**
     * Returns the brick's rotation, including a random offset (left - right).
     * The rotation is either `0` or `180` degrees, plus a random offset.
     * @returns {number} The rotation in degrees.
     */
    get rotation(): number {
        return Math.round(Math.random()) * 180 + this.randomOffset() - this.offset;
    }

    /**
     * Gets the current offset value.
     * @returns {number} The maximum offset in degrees.
     */
    get getOffset(): number {
        return this.offset;
    }

    /**
     * Sets a new offset value.
     * @param {number} value - The new offset value in degrees.
     */
    set setOffset(value: number) {
        this.offset = value;
    }
}

export { Brick };
