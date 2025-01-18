import {Vector3} from "../../../math/Vector.js";

/**
 * Abstract class representing a structure in a 3D space.
 * The structure has a center point defined by a Vector3.
 */
abstract class Structure {
    // The center of the structure represented as a Vector3 object.
    protected readonly center: Vector3;

    /**
     * Constructor to initialize the center of the structure.
     * @param center - The center point of the structure in 3D space.
     */
    protected constructor(center: Vector3) {
        this.center = center;
    }

    /**
     * Gets the center of the structure.
     * @returns The center point as a Vector3 object.
     */
    get getCenter(): Vector3 {
        return this.center;
    }
}

export {Structure};
