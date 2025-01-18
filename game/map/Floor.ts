import {Structure} from "./Structure.js";
import {Vector3} from "../../math/Vector.js";

class Floor extends Structure{
    constructor(center: Vector3) {
        super(center);
    }
}

export {Floor};