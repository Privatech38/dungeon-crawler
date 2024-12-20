import { Vector3 } from "../../math/Vector";
import { Movement } from "./Movement";

class PlayerMovement {
    private movement: Movement;

    constructor(initialPosition: Vector3, speed: number) {
        this.movement = new Movement(initialPosition, speed);
    }

    public move(keys: { up: boolean; down: boolean; left: boolean; right: boolean }, deltaTime: number) {
        let velocityX = 0;
        let velocityZ = 0;

        // Update velocity based on input
        if (keys.up) velocityZ -= this.movement.getSpeed;
        if (keys.down) velocityZ += this.movement.getSpeed;
        if (keys.left) velocityX -= this.movement.getSpeed;
        if (keys.right) velocityX += this.movement.getSpeed;

        // Normalize diagonal movement
        if (velocityX !== 0 && velocityZ !== 0) {
            const normalizationFactor = Math.sqrt(2) / 2;
            velocityX *= normalizationFactor;
            velocityZ *= normalizationFactor;
        }

        // Set the new velocity and update position
        this.movement.setVelocity(velocityX, velocityZ);
        this.movement.update(deltaTime);
    }

    getPosition(): Vector3 {
        return this.movement.getPosition;
    }
}

export { PlayerMovement };