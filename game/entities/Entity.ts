import {Vector3} from "../../math/Vector";
import {Hitbox} from "./hitboxes/Hitbox";

class Entity {
    health: number;
    hitbox: Hitbox;
    position: Vector3;

    constructor(health: number, hitbox: Hitbox) {
        this.health = health;
        this.hitbox = hitbox;
        this.position = this.hitbox.center;
    }

    updatePosition(vector: Vector3): void {
        this.position = vector;
        this.hitbox.updatePosition(vector);
    }

    takeDamage(damage: number): void {
        this.health -= damage;
        if (this.health <= 0) {
            this.die()
        }
    }

    die(): void {
        //todo: dead
    }
}

export { Entity };