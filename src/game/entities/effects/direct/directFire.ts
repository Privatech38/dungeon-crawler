import {Direct} from "./Direct";

class FireEffect extends Direct {

    constructor(lastAttack: number, damage: number, fireRate: number) {
        super(lastAttack, damage, fireRate);
    }
}

export {FireEffect};