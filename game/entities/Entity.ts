import {Vector} from "../Vector";
import {Hitbox} from "./Hitbox";

class Entity {
    health: number;
    hitbox: Hitbox;
    position: Vector;

    constructor(health: number, hitbox: Hitbox, position: Vector) {
        this.health = health;
        this.hitbox = hitbox;
        this.position = position;
    }

    updatePosition(vector: Vector): void {
        this.position = vector;
        this.hitbox.position = vector;
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