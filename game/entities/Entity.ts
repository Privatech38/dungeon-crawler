import {Vector3} from "../../math/Vector";
import {Hitbox} from "./hitboxes/Hitbox";
import {Effect} from "./damage/Effect";
import {Defence} from "./damage/Defence";
import {Fire} from "./damage/effects/damage/Fire";

class Entity {
    protected health: number;
    protected hitbox: Hitbox;
    protected position: Vector3;
    protected _effects: Set<Effect>;
    protected _defense: Defence;

    constructor(health: number, hitbox: Hitbox, defence: Defence) {
        this.health = health;
        this.hitbox = hitbox;
        this.position = this.hitbox.center;
        this._effects = new Set();
        this._defense = defence;
    }

    updatePosition(vector: Vector3): void {
        this.position = vector;
        this.hitbox.updatePosition(vector);
    }

    addEffect(effect: Effect): void {
        this._effects.add(effect);
    }

    takeDamage(damage: number): void {
        this._effects.forEach(effect => this.effects(effect));
    }

    private effects(effect: Effect){
        if (effect.isActive()){
            if (effect instanceof Fire) {
                this.loseHealth(effect.dealDamage())
            }

        }
    }

    private loseHealth(damage: number) {
        this.health -= this._defense.reduction * damage;
        if (this.health <= 0) this.die()
    }

    die(): void {
        //todo: dead
    }
}

export { Entity };