import { Vector3 } from "../../math/Vector";
import { Movement } from "./Movement";

class PlayerMovement extends Movement {

    constructor(initialPosition: Vector3, speed: number) {
        super(initialPosition, speed);
    }

    public move(keys: Set<string>) {
        let velocityX = 0;
        let velocityZ = 0;

        // Update velocity based on input
        if (keys.has('keyW')) velocityZ -= this.getSpeed;
        if (keys.has('keyS')) velocityZ += this.getSpeed;
        if (keys.has('keyA')) velocityX -= this.getSpeed;
        if (keys.has('keyD')) velocityX += this.getSpeed;

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