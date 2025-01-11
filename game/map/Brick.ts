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
     * set orientation of brick, witch direction it is facing.
     * @private
     * @type {number} - 0 or 90
     */
    private readonly orientation: number;

    private rotationX: number;
    private rotationY: number;

    /**
     * Creates a new brick with the specified type.
     * @param {boolean} fullBrick - `true` for a full brick, `false` for a half brick.
     * @param orientation - orientation of brick, witch direction it is facing 0 / 90deg
     */
    constructor(fullBrick: boolean, orientation: number) {
        this.brickType = fullBrick;
        this.offset = 5;
        this.orientation = orientation;
        this.rotationX = 0;
        this.rotationY = 0;
        this.generateBrick();
    }

    private generateBrick() {
        this.rotationY = Math.round(Math.random()) * 180;
        this.rotationX = Math.round(Math.random()) * 180 + (this.randomOffset() - this.offset) + this.orientation;
    }

    /**
     * Generates a random offset within the allowable range.
     * @private
     * @returns {number} A random offset between `-offset` and `+offset`.
     */
    private randomOffset(): number {
        return Random.randInt(0, this.offset * 2);
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
    get getRotationY(): number {
        return this.rotationY;
    }

    /**
     * Returns the brick's rotation, including a random offset (left - right).
     * The rotation is either `0` or `180` degrees, plus a random offset.
     * @returns {number} The rotation in degrees.
     */
    get getRotationX(): number {
        return this.rotationX;
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
