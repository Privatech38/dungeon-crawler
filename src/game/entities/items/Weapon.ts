import {Effect} from "../effects/Effect.js";
import {Hitbox} from "../hitboxes/Hitbox.js";
import {Node} from "../../../engine/core/Node.js"


abstract class Weapon{
    protected effects: Set<Effect>;
    protected readonly attackDamage: number;
    protected hurtbox: Hitbox;
    protected node: Node;

    protected lastAttack: number = 0;
    protected attackCooldown: number;

    protected constructor(
        attackDamage: number,
        hurtbox: Hitbox,
        cooldown: number,
        node: Node,
        effects: Set<Effect> = new Set(),
    ) {
        this.attackDamage = attackDamage;
        this.effects = effects;
        this.hurtbox = hurtbox;
        this.attackCooldown = cooldown;
        this.node = node;
    }

    // returns dmg that sould be delt (takes atk cooldown into account)
    public attack(dt: number) {
        if (dt - this.lastAttack > this.attackCooldown) {
            return this.attackDamage;
        }
        return 0;
    }

    get getNode(): Node {
        return this.node;
    }

    get getDamage(): number {
        return this.attackDamage;
    }

}

export { Weapon }