import {Attack} from "../../attack/Attack";
import {Effect} from "../effects/Effect";

class Weapon{
    public attack: Attack;
    public effects: Set<Effect>;

    constructor(
        attack: Attack,
        effects: Set<Effect> = new Set(),
    ) {
        this.attack = attack;
        this.effects = effects;
    }
}

export { Weapon }