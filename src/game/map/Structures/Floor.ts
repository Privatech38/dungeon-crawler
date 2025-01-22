import {Structure} from "./Structure.js";
import {Vector3} from "../../../math/Vector.js";

class Floor extends Structure{
    constructor(center: Vector3, quaternions= [0, 0, 0, 1]) {
        super(center, quaternions);
    }
    get getCenter(): Vector3 {
        return this.center;
    }
}

export {Floor};