import {Weapon} from "./Weapon.js";
import {Effect} from "../effects/Effect.js";
import {Hitbox} from "../hitboxes/Hitbox.js";
import {Projectile} from "../../attack/types/Projectile.js";
import {Entity} from "../Entity.js";
import {Vector3} from "../../../math/Vector.js";

class ProjectileWeapon extends Weapon {
    projectile: any;
    velocity: number;
    attacker: Entity;

    constructor(
        attackDamage: number,
        hutrbox: Hitbox,
        velocity: number,
        attacker: Entity,
        effects: Set<Effect> = new Set(),
    ) {
        super(attackDamage, effects, hutrbox);
        this.velocity = velocity;
        this.attacker = attacker;
    }

    public attack(attackPosition: Vector3, splashRadius = 0.01) {
        this.projectile = new Projectile(this.attackDamage, this.velocity, this.attacker, attackPosition, this.hurtbox, splashRadius);
    }

    public update(): Hitbox {
        this.projectile.update();
        return this.projectile.getHurtBox();
    }
}

export {ProjectileWeapon}