import {Effect} from "../effects/Effect.js";
import {Hitbox} from "../hitboxes/Hitbox.js";


abstract class Weapon{
    protected effects: Set<Effect>;
    protected readonly attackDamage: number;
    protected hurtbox: Hitbox;

    protected constructor(
        attackDamage: number,
        effects: Set<Effect> = new Set(),
        hurtbox: Hitbox,
    ) {
        this.attackDamage = attackDamage;
        this.effects = effects;
        this.hurtbox = hurtbox;
    }
}

export { Weapon }