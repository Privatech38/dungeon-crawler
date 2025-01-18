import {Vector3} from "../../math/Vector.js";
import {Structure} from "./Structure.js";

/**
 * Represents a pillar within a structure, which can be a corner or regular pillar with a specific orientation.
 */
class Pillar extends Structure {
    private readonly isCorner: boolean;
    private readonly orientation: Vector3;

    /**
     * Initializes a new pillar with the given properties.
     * @param center - The center position of the pillar.
     * @param isCorner - Indicates whether the pillar is a corner pillar.
     * @param orientation - The orientation vector of the pillar.
     */
    constructor(center: Vector3, isCorner: boolean, orientation: Vector3) {
        super(center);
        this.isCorner = isCorner;
        this.orientation = orientation;
    }

    /**
     * Gets whether the pillar is located at a corner of the structure.
     * @returns True if the pillar is a corner pillar; otherwise, false.
     */
    get getIsCorner() {
        return this.isCorner;
    }

    /**
     * Gets the orientation vector of the pillar.
     * @returns The orientation vector of the pillar.
     */
    get getOrientation() {
        return this.orientation;
    }
}

export { Pillar };
