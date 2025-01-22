import {Debuff} from "./Debuff";

class DebuffFreeze extends Debuff{

    constructor(duration: number, reduction: number) {
        super(duration, reduction);
    }
}

export { DebuffFreeze };