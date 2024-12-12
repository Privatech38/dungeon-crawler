class Projectile {
    private startPosition: { x: number, y: number, z: number }; // Starting position (position of bow)
    private targetPosition: { x: number, y: number, z: number }; // Position of target (mouse pointer / AI pointer position)
    private readonly velocity: number; // Initial velocity of the arrow
    private readonly damage: number;

    private currentPosition: { x: number, y: number, z: number };
    private initialVelocity: { x: number, y: number, z: number }; // Initial velocity vector components

    private readonly gravity: number;

    constructor(
        startPosition: { x: number, y: number, z: number },
        targetPosition: { x: number, y: number, z: number },
        velocity: number,
        damage: number,
    ) {
        // Initialize positions as dictionaries (objects)
        this.startPosition = startPosition;
        this.targetPosition = targetPosition;
        this.velocity = velocity;
        this.damage = damage;

        this.initialVelocity = this.initial_velocity_vector();
        this.currentPosition = { x: this.startPosition.x, y: this.startPosition.y, z: this.startPosition.z };

        this.gravity = 9.81;
    }

    public update_position(time: number): void {
        // Update position using velocity and gravity (gravity affects Z)
        this.currentPosition.x += this.initialVelocity.x * time;
        this.currentPosition.y += this.initialVelocity.y * time;
        this.currentPosition.z += this.initialVelocity.z * time - (this.gravity * Math.pow(time, 2)) / 2; // Gravity applied to Z (vertical movement)
    }

    private initial_velocity_vector(): { x: number, y: number, z: number } {
        // Calculate direction from start position to target position
        let direction = {
            x: this.targetPosition.x - this.startPosition.x,
            y: this.targetPosition.y - this.startPosition.y,
            z: this.targetPosition.z - this.startPosition.z
        };

        // Find the magnitude of the direction vector
        let magnitude = Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.y, 2) + Math.pow(direction.z, 2));

        // Normalize the direction vector and scale it by the initial velocity
        return {
            x: this.velocity * (direction.x / magnitude),
            y: this.velocity * (direction.y / magnitude),
            z: this.velocity * (direction.z / magnitude)
        };
    }

    public current_position(): { x: number, y: number, z: number } {
        return this.currentPosition;
    }

    public get_damage(): number {
        return this.damage;
    }
}

export default Projectile;