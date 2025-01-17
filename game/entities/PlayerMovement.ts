import { Vector3 } from "../../math/Vector.js";
import { Movement } from "./Movement.js";

class PlayerMovement extends Movement {

    constructor(initialPosition: Vector3, speed: number) {
        super(initialPosition, speed);
    }

    public move(keys: { up: boolean; down: boolean; left: boolean; right: boolean }) {
        let velocityX = 0;
        let velocityZ = 0;

        // Update velocity based on input
        if (keys.up) velocityZ -= this.getSpeed;
        if (keys.down) velocityZ += this.getSpeed;
        if (keys.left) velocityX -= this.getSpeed;
        if (keys.right) velocityX += this.getSpeed;

        // Normalize diagonal movement
        if (velocityX !== 0 && velocityZ !== 0) {
            const normalizationFactor = Math.sqrt(2) / 2;
            velocityX *= normalizationFactor;
            velocityZ *= normalizationFactor;
        }

        // Set the new velocity and update position
        this.setVelocity(velocityX, velocityZ);
        this.update();
    }
}

export { PlayerMovement };