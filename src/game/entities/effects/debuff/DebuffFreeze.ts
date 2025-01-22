import {Debuff} from "./Debuff.js";

class DebuffFreeze extends Debuff{

    constructor(duration: number, reduction: number) {
        super(duration, reduction);
    }
}

export { DebuffFreeze };