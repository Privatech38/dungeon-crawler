import {Attack} from "./attack/Attack";
import {Pattern} from "./Pattern";
import {Effect} from "../entities/damage/Effect";
import {Melee} from "./attack/Melee";

class Weapon{
    public attack: Attack;
    public effects: Effect[];
    private pattern: Pattern;

    constructor(
        attack: Attack,
        effects: Effect[] = [],
        pattern: Pattern | null = null,
    ) {
        this.attack = attack;
        this.pattern = pattern;
        this.effects = effects;
    }
}

export {Weapon}