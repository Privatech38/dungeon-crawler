import {DebuffEffect} from "./DebuffEffect";

class FreezeDebuff extends DebuffEffect{

    constructor(duration: number, reduction: number) {
        super(duration, reduction);
    }
}

export { FreezeDebuff };