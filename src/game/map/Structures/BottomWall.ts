import {Structure} from "./Structure.js";
import {Vector3} from "../../../math/Vector.js";

class BottomWall extends Structure{
    /**
     * Indicates whether the wall has a door.
     * @private
     * @type {boolean}
     */
    private door: boolean;

    constructor(orientation: number, center: Vector3, quaternions = [0, 0, 0, 1]) {
        super(center, quaternions);
        this.door = false;
    }

    get getCenter(): Vector3 {
        return this.center;
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

export {BottomWall}