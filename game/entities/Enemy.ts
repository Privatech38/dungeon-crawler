import {Entity} from "./Entity";
import {Hitbox} from "./hitboxes/Hitbox";
import {Vector3} from "../../math/Vector";
import {Movement} from "./Movement";
import {Player} from "./Player";

class Enemy extends Entity {
    movement: Movement;

    constructor(
        health: number,
        speed: number,
        hitbox: Hitbox,
        initialPosition: Vector3,

    ) {
        super(health, speed, hitbox, initialPosition);
        this.movement = new Movement(initialPosition, speed);
    }

    public moveTowordsPlayer(player: Player) {
        const playerPosition = player.getPosition;

        const moveVector: Vector3 = this.position.subtract(playerPosition).normalize();

        this.movement.setVelocity(moveVector.x, moveVector.z);
        this.movement.update();
    }
}

export {Enemy}