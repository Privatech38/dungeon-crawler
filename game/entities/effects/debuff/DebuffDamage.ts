import {Debuff} from "./Debuff.js";

class DebuffDamage extends Debuff{

    constructor(duration: number, reduction: number) {
        super(duration, reduction);
    }
}

export {DebuffDamage};