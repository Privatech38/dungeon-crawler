import {Weapon} from "./Weapon.js";
import {Entity} from "../Entity.js";
import {Effect} from "../effects/Effect.js";
import {Hitbox} from "../hitboxes/Hitbox.js";
import {Vector3} from "../../../math/Vector.js";
import {Melee} from "../../attack/types/Melee.js";
import {Node} from "../../../engine/core/Node.js"

class MeleeWeapon extends Weapon {
    attacker: Entity;

    constructor(
        attackDamage: number,
        hutrbox: Hitbox,
        attacker: Entity,
        cooldown: number,
        node: Node,
        effects: Set<Effect> = new Set(),
    ) {
        super(attackDamage, hutrbox, cooldown, node, effects);
        this.attacker = attacker;
    }

    // public attack(attackPosition: Vector3) {
    //     new Melee(this.attackDamage, this.attacker, attackPosition, this.hurtbox);
    // }

}

export { MeleeWeapon }