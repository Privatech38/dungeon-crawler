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
import { MeleeWeapon } from "./items/MeleeWeapon.js";

class Enemy extends Entity {
    movement: Movement;
    node: Node;
    weapon!: Weapon

    constructor(
        health: number,
        speed: number,
        hitbox: Hitbox,
        initialPosition: Vector3,
        node: Node,
    ) {
        super(health, speed, hitbox, initialPosition);
        this.movement = new Movement(initialPosition, speed);
        this.node = node;
    }

    public addWeapon(weapon: Weapon) {
        this.weapon = weapon;
        // this.node.addChild(weapon.getNode);
    }

    private moveTowardsPlayer(player: Player, dt: number) {

        const playerPosition = player.getPosition;

        const moveVector: Vector3 = playerPosition.subtract(this.position).normalize();

        this.movement.setVelocity(moveVector.x, moveVector.z);
        this.movement.checkMovement(dt);
        this.movement.update();

        // move
        const transform = this.node.getComponentsOfType(Transform)[2];
        if (transform) {
            vec3.copy(transform.translation, this.movement.getPosition.toArray);
        }

        const x = transform.translation[0];
        const y = transform.translation[1];
        const z = transform.translation[2];

        this.updatePosition(new Vector3(x, y, z));

        // rotate
        let rotation = quat.create();
        let angleRadians = Math.atan2(moveVector.x, moveVector.z);
        quat.rotateY(rotation, rotation, angleRadians);
        transform.rotation = rotation;

        // if (this.node.getId() === "opozicija_1") {
        //     console.log("enemy hitbox:", this.hitbox.center);
        // }

    }

    public update(player: Player, dt: number): void {
        console.log("enemy.update");
        this.moveTowardsPlayer(player, dt);

    }

    public attack(dt: number): number {
        return this.weapon.attack(dt)
    }

    get getNode(): Node {
        return this.node;
    }

}

export {Enemy}