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

    private moveTowardsPlayer(player: Player, dt: number) {

        const playerPosition = player.getPosition;

        // const moveVector: Vector3 = this.position.subtract(playerPosition).normalize();
        const moveVector: Vector3 = playerPosition.subtract(this.position).normalize();

        this.movement.setVelocity(moveVector.x, moveVector.z);
        this.movement.checkMovement(dt);
        this.movement.update();

        const transforms = this.node.getComponentsOfType(Transform);
        if (transforms[2]) {
            vec3.copy(transforms[2].translation, this.movement.getPosition.toArray);
        }

        const x = transforms[2].translation[0];
        const y = transforms[2].translation[1];
        const z = transforms[2].translation[2];

        this.updatePosition(new Vector3(x, y, z));

        if (this.node.getId() === "opozicija_1") {
            console.log("enemy hitbox:", this.hitbox.center);
        }

        // TODO: roation
    }

    public update(player: Player, dt: number): void {
        console.log("enemy.update");
        this.moveTowardsPlayer(player, dt);

    }

    public attack(player: Player) {
        const playerPosition = player.getPosition;
    }

}

export {Enemy}