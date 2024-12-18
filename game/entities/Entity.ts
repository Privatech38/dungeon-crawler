import {Vector3} from "../../math/Vector";
import {Hitbox} from "./hitboxes/Hitbox";
import {Effect} from "./damage/Effect";
import {Defence} from "./damage/Defence";

class Entity {
    health: number;
    hitbox: Hitbox;
    position: Vector3;
    effects: Effect[];
    defense: Defence;

    constructor(health: number, hitbox: Hitbox) {
        this.health = health;
        this.hitbox = hitbox;
        this.position = this.hitbox.center;
    }

    updatePosition(vector: Vector3): void {
        this.position = vector;
        this.hitbox.updatePosition(vector);
    }

    addEffect(effect: Effect): void {
        this.effects.push(effect);
    }

    takeDamage(damage: number): void {
        this.effects.forEach(this.effectDamage)

        this.health -= this.defense.reduction * damage;
        if (this.health <= 0) {
            this.die()
        }
    }

    private effectDamage(effect, index){
        if (effect.active()){

        }
    }

    die(): void {
        //todo: dead
    }
}

export { Entity };