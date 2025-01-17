import {Weapon} from "./Weapon";
import {Entity} from "../Entity";
import {Effect} from "../effects/Effect";
import {Hitbox} from "../hitboxes/Hitbox";
import {Vector3} from "../../../math/Vector";
import {Melee} from "../../attack/types/Melee";

class MeleeWeapon extends Weapon {
    attacker: Entity;

    constructor(
        attackDamage: number,
        hutrbox: Hitbox,
        attacker: Entity,
        effects: Set<Effect> = new Set(),
    ) {
        super(attackDamage, effects, hutrbox);
        this.attacker = attacker;
    }

    public attack(attackPosition: Vector3) {
        new Melee(this.attackDamage, this.attacker, attackPosition, this.hurtbox);
    }

}