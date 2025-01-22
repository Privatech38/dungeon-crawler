// @ts-ignore
import { quat, vec3, mat4 } from 'glm';

// @ts-ignore
import { Transform } from '../engine/core/Transform.js';
// @ts-ignore
import {Node} from "../engine/core/Node.js";
import {Player} from "./entities/Player.js";
import {Vector3} from "../math/Vector.js";
import {World} from "./map/World.js";
import {GameManager} from "./GameManager.js";

export class PlayerController {
    private node: Node;
    private armatureNode: Node;
    private domElement: Element;
    private keys: Set<string>;
    private velocity: number[];
    private acceleration: number;
    private maxSpeed: number;
    private decay: number;
    private pointerSensitivity: number;
    private gameManager: GameManager;

    private player: Player;
    private world: World;

    constructor(node: Node, armatureNode: Node, domElement: Element, gameManager: GameManager, {
        velocity = [0, 0, 0],
        acceleration = 50,
        maxSpeed = gameManager.getPlayer.getSpeed,
        decay = 0.99999,
        pointerSensitivity = 0.002,
    } = {}) {
        this.gameManager = gameManager;
        this.world = gameManager.getWorld;
        this.player = gameManager.getPlayer;

        this.node = node;
        this.armatureNode = armatureNode;
        this.domElement = domElement;

        this.keys = new Set<string>();

        this.velocity = velocity;
        this.acceleration = acceleration;
        this.maxSpeed = maxSpeed;
        this.decay = decay;
        this.pointerSensitivity = pointerSensitivity;

        this.initHandlers();
    }

    initHandlers() {
        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);

        const element: Element = this.domElement;
        const doc: Document = element.ownerDocument;

        doc.addEventListener('keydown', this.keydownHandler);
        doc.addEventListener('keyup', this.keyupHandler);
    }

    checkCollision(newPosition: Vector3) {
        let newHitbox = this.player.getHitbox.clone();
        newHitbox.updatePosition(newPosition);

        return this.gameManager.collisionWithWall(newHitbox);
    }

    update(t: any, dt: number) {
        // Calculate forward and right vectors.
        const forward = [0, 0, -1];
        const right = [1, 0, 0];

        // Map user input to the acceleration vector.
        const acc = vec3.create();
        if (this.keys.has('KeyW')) {
            vec3.add(acc, acc, forward);
        }
        if (this.keys.has('KeyS')) {
            vec3.sub(acc, acc, forward);
        }
        if (this.keys.has('KeyD')) {
            vec3.add(acc, acc, right);
        }
        if (this.keys.has('KeyA')) {
            vec3.sub(acc, acc, right);
        }

        // Update velocity based on acceleration.
        vec3.scaleAndAdd(this.velocity, this.velocity, acc, dt * this.acceleration);

        // If there is no user input, apply decay.
        if (!this.keys.has('KeyW') &&
            !this.keys.has('KeyW') &&
            !this.keys.has('KeyW') &&
            !this.keys.has('KeyW'))
        {
            const decay = Math.exp(dt * Math.log(1 - this.decay));
            vec3.scale(this.velocity, this.velocity, decay);
        }

        // Limit speed to prevent accelerating to infinity and beyond.
        const speed = vec3.length(this.velocity);
        if (speed > this.maxSpeed) {
            vec3.scale(this.velocity, this.velocity, this.maxSpeed / speed);
        }

        const transform = this.node.getComponentOfType(Transform);
        if (transform) {
            // Calculate the potential new position.
            const newPosition = vec3.create();
            vec3.scaleAndAdd(newPosition, transform.translation, this.velocity, dt);

            let myPosition = new Vector3(
                newPosition[0],
                newPosition[1],
                newPosition[2],
            )

            console.log(myPosition);
            // Collision detection
            if (!this.checkCollision(myPosition)) {
                // If no collision, apply the new position.
                vec3.copy(transform.translation, newPosition);
                this.gameManager.getPlayer.updatePosition(myPosition);
                console.log("player position:" + myPosition);
            } else {
                // Handle collision response (e.g., stop, slide, or bounce).
                vec3.scale(this.velocity, this.velocity, 0); // Example: Stop on collision
            }
        }

        const armatureTransform = this.armatureNode.getComponentOfType(Transform);
        if (armatureTransform) {
            // Update rotation
            let rotation = quat.create();
            if (this.keys.has('KeyS') && this.keys.has('KeyA')) {
                quat.rotateY(rotation, rotation, -Math.PI / 4);
            } else if (this.keys.has('KeyS') && this.keys.has('KeyD')) {
                quat.rotateY(rotation, rotation, Math.PI / 4);
            } else if (this.keys.has('KeyW') && this.keys.has('KeyA')) {
                quat.rotateY(rotation, rotation, -3 * Math.PI / 4);
            } else if (this.keys.has('KeyW') && this.keys.has('KeyD')) {
                quat.rotateY(rotation, rotation, 3 * Math.PI / 4);
            } else if (this.keys.has('KeyS')) {
                quat.rotateY(rotation, rotation, 0);
            } else if (this.keys.has('KeyW')) {
                quat.rotateY(rotation, rotation, Math.PI);
            } else if (this.keys.has('KeyA')) {
                quat.rotateY(rotation, rotation, -Math.PI / 2);
            } else if (this.keys.has('KeyD')) {
                quat.rotateY(rotation, rotation, Math.PI / 2);
            } else {
                rotation = armatureTransform.rotation;
            }
            armatureTransform.rotation = rotation;
        }
    }

    keydownHandler(e: KeyboardEvent) {
        this.keys.add(e.code);
    }

    keyupHandler(e: KeyboardEvent) {
        this.keys.delete(e.code);
    }

}
