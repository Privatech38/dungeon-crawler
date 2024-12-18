import {Effect} from "../../Effect";
import {DebuffEffect} from "./DebuffEffect";

class DamageDebuff extends DebuffEffect{

    constructor(duration: number, reduction: number) {
        super(duration, reduction);
    }
}

export {DamageDebuff};