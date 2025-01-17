import {Vector3} from "../../math/Vector.js";

class Pillar {
    private readonly center: Vector3;
    private readonly isCorner: boolean;
    private readonly orientation: Vector3;

    constructor(center: Vector3, isCorner: boolean, orientation: Vector3) {
        this.center = center;
        this.isCorner = isCorner;
        this.orientation = orientation;
    }

    get getCenter() {
        return this.center;
    }

    get getIsCorner() {
        return this.isCorner;
    }

    get getOrientation() {
        return this.orientation;
    }
}

export { Pillar };