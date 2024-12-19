import { Vector3 } from "../../math/Vector";
import { Movement } from "./Movement"; // Assuming Movement is in the same directory

class PlayerMovement {
    private movement: Movement;

    constructor(initialPosition: Vector3, speed: number) {
        this.movement = new Movement(initialPosition, speed);
    }

    public move(keys: { up: boolean; down: boolean; left: boolean; right: boolean }, deltaTime: number) {
        let velocityX = 0;
        let velocityY = 0;

        // Update velocity based on input
        if (keys.up) velocityY -= this.movement.getSpeed;
        if (keys.down) velocityY += this.movement.getSpeed;
        if (keys.left) velocityX -= this.movement.getSpeed;
        if (keys.right) velocityX += this.movement.getSpeed;

        // Normalize diagonal movement
        if (velocityX !== 0 && velocityY !== 0) {
            const normalizationFactor = Math.sqrt(2) / 2;
            velocityX *= normalizationFactor;
            velocityY *= normalizationFactor;
        }

        // Set the new velocity and update position
        this.movement.setVelocity(velocityX, velocityY);
        this.movement.update(deltaTime);
    }

    getPosition(): Vector3 {
        return this.movement.getPosition;
    }
}

export { PlayerMovement };