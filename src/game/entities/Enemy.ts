import {Entity} from "./Entity.js";
import {Hitbox} from "./hitboxes/Hitbox.js";
import {Vector3} from "../../math/Vector.js";
import {Movement} from "./Movement.js";
import {Player} from "./Player.js";
import {Weapon} from "./items/Weapon.js";
// @ts-ignore
import {Node} from "../../engine/core.js"
// @ts-ignore
import {Transform} from '../../engine/core/Transform.js';
// @ts-ignore
import {mat4, quat, vec3} from 'glm';

class Enemy extends Entity {
    movement: Movement;
    node: Node;
    // weapon: Weapon


    constructor(
        health: number,
        speed: number,
        hitbox: Hitbox,
        initialPosition: Vector3,
        node: Node,
        // weapon: Weapon,
    ) {
        super(health, speed, hitbox, initialPosition);
        this.movement = new Movement(initialPosition, speed);
        this.node = node;
        // this.weapon = weapon
    }

    private moveTowardsPlayer(player: Player) {
        const playerPosition = player.getPosition;

        const moveVector: Vector3 = this.position.subtract(playerPosition).normalize();

        this.movement.setVelocity(moveVector.x, moveVector.z);
        this.movement.update();

        const transforms = this.node.getComponentsOfType(Transform);
        if (transforms[2]) {
            vec3.copy(transforms[2].translation, this.movement.getPosition.toArray);
            console.log(transforms[2]);
        }
    }

    public update(player: Player): void {
        this.moveTowardsPlayer(player);

    }

    public attack(player: Player) {
        const playerPosition = player.getPosition;
    }

}

export {Enemy}