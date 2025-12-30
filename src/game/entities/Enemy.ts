import {Entity} from "./Entity.js";
import {Hitbox} from "./hitboxes/Hitbox.js";
import {Vector3} from "../../math/Vector.js";
import {Movement} from "./Movement.js";
import {Player} from "./Player.js";
import {Weapon} from "./items/Weapon.js";

class Enemy extends Entity {
    movement: Movement;
    // weapon: Weapon


    constructor(
        health: number,
        speed: number,
        hitbox: Hitbox,
        initialPosition: Vector3,
        // weapon: Weapon,
    ) {
        super(health, speed, hitbox, initialPosition);
        this.movement = new Movement(initialPosition, speed);
        // this.weapon = weapon
    }

    private moveTowardsPlayer(player: Player) {
        const playerPosition = player.getPosition;

        const moveVector: Vector3 = this.position.subtract(playerPosition).normalize();

        this.movement.setVelocity(moveVector.x, moveVector.z);
        this.movement.update();
    }

    public update(player: Player): void {
        this.moveTowardsPlayer(player);

    }

    public attack(player: Player) {
        const playerPosition = player.getPosition;
    }

}

export {Enemy}