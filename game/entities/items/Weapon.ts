import {Effect} from "../effects/Effect";
import {Hitbox} from "../hitboxes/Hitbox";


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