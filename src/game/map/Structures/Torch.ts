import {Structure} from "./Structure";
import {Vector3} from "../../../math/Vector";

class Torch extends Structure{
    constructor(center: Vector3, quaternions = [0, 0, 0, 1]) {
        super(center, quaternions);
    }
}

export { Torch };