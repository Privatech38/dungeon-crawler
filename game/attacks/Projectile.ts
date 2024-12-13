import Vector from '../Vector'

class Projectile {
    private readonly startPosition: { x: number, y: number, z: number }; // Starting position (position of bow)
    private readonly targetPosition: { x: number, y: number, z: number }; // Position of target (mouse pointer / AI pointer position)
    private readonly velocity: number; // Initial velocity of the arrow
    private readonly damage: number;
    private readonly FPS: number;

    private currentPosition: { x: number, y: number, z: number };
    private initialVelocity: { x: number, y: number, z: number }; // Initial velocity vector components

    private readonly gravity: number;

    constructor(
        startPosition: { x: number, y: number, z: number },
        targetPosition: { x: number, y: number, z: number },
        velocity: number,
        damage: number,
        FPS: number,
    ) {
        // Initialize positions as dictionaries (objects)
        this.startPosition = startPosition;
        this.targetPosition = targetPosition;
        this.velocity = velocity;
        this.damage = damage;
        this.FPS = FPS;

        this.initialVelocity = this.initial_velocity_vector();
        this.currentPosition = { x: this.startPosition.x, y: this.startPosition.y, z: this.startPosition.z };

        this.gravity = 9.81;
    }

    public update_position(): void {
        // Update position using velocity and gravity (gravity affects Z)

        let time = 1/this.FPS;
        this.currentPosition.x += this.initialVelocity.x * time;
        this.currentPosition.y += this.initialVelocity.y * time;
        this.currentPosition.z += this.initialVelocity.z * time - (this.gravity * Math.pow(time, 2)) / 2; // Gravity applied to Z (vertical movement)
    }

    private initial_velocity_vector(): { x: number, y: number, z: number } {
        let vector: Vector = new Vector(this.startPosition, this.targetPosition, this.velocity)
        return vector.endPoint;
    }

    public current_position(): { x: number, y: number, z: number } {
        return this.currentPosition;
    }

    public get_damage(): number {
        return this.damage;
    }
}

export default Projectile;