import {Effect} from "../../Effect";
import {Debuff} from "./Debuff";

class DebuffDamage extends Debuff{

    constructor(duration: number, reduction: number) {
        super(duration, reduction);
    }
}

export {DebuffDamage};