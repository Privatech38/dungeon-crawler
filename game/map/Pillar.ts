import {Vector3} from "../../math/Vector";

class Pillar {
    private readonly center: Vector3;
    private readonly isCorner: boolean;

    constructor(center: Vector3, isCorner: boolean) {
        this.center = center;
        this.isCorner = isCorner;
    }

    get getCenter() {
        return this.center;
    }

    get getIsCorner() {
        return this.isCorner;
    }
}

export { Pillar };