import {Vector3} from "../../../math/Vector.js";

/**
 * Abstract class representing a structure in a 3D space.
 * The structure has a center point defined by a Vector3.
 */
abstract class Structure {
    // The center of the structure represented as a Vector3 object.
    protected readonly center: Vector3;

    /**
     * Quaternions representing the wall's rotation.
     * @private
     * @type {number[]}
     */
    protected quaternions: number[];

    /**
     * Constructor to initialize the center of the structure.
     * @param center - The center point of the structure in 3D space.
     * @param quaternions - orientation in quaternions
     */
    protected constructor(center: Vector3, quaternions: number[] = [0, 0, 0, 1]) {
        this.center = center;
        this.quaternions = quaternions;
    }

    /**
     * Gets the center of the structure.
     * @returns The center point as a Vector3 object.
     */
    get getCenter(): Vector3 {
        return this.center;
    }

    /**
     * Retrieves the wall's current quaternion values.
     * @returns {number[]} The wall's quaternions.
     */
    get getQuaternions(): number[] {
        return this.quaternions;
    }
}

export {Structure};
