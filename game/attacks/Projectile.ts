import Attack from './Attack'
import Vector from "../Vector";

// Class for Projectile attack (inherits from Attack)
class Projectile extends Attack {
    private readonly velocity: number; // Initial velocity of the projectile
    private readonly gravity: number = 9.81; // Gravity constant
    private currentPosition: { x: number, y: number, z: number };
    private velocityVector: { x: number, y: number, z: number }; // Split velocity into components
    private time: number = 0; // Time since launch

    constructor(
        startPosition: { x: number, y: number, z: number },
        targetPosition: { x: number, y: number, z: number },
        damage: number,
        velocity: number,
        FPS: number
    ) {
        super(startPosition, targetPosition, damage, FPS);
        this.velocity = velocity;
        this.currentPosition = { x: startPosition.x, y: startPosition.y, z: startPosition.z };

        // Calculate the initial direction and velocity vector
        this.velocityVector = new Vector(startPosition, targetPosition, velocity).endPoint;
    }

    /**
     * Update the projectile's position based on velocity and gravity.
     * This is done by calculating the movement for each frame.
     */
    public update_position(): void {
        this.time += 1 / this.FPS; // Increment time

        // Calculate the new position based on velocity and time
        this.currentPosition.x = this.startPosition.x + this.velocityVector.x * this.time;
        this.currentPosition.y = this.startPosition.y + this.velocityVector.y * this.time;

        // Gravity only affects the vertical (z) direction
        this.currentPosition.z = this.startPosition.z + this.velocityVector.z * this.time - (this.gravity * Math.pow(this.time, 2)) / 2;
    }

    /**
     * Get the current position of the projectile
     * @returns The current position of the projectile
     */
    public get_position(): { x: number, y: number, z: number } {
        return this.currentPosition;
    }

    /**
     * This is an implementation of the abstract method from Attack.
     * It retrieves the position of the projectile.
     */
    public current_position(): { x: number, y: number, z: number } {
        return this.get_position();
    }
}

