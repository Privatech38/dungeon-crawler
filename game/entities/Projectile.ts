class Projectile {
    startPosition: { x: number, y: number, z: number }; // Starting position (position of bow)
    targetPosition: { x: number, y: number, z: number }; // Position of target (mouse pointer / AI pointer position)
    velocity: number; // Initial velocity of the arrow
    damage: number;

    currentPosition: { x: number, y: number, z: number };
    initialVelocity: { x: number, y: number, z: number }; // Initial velocity vector components

    projectileState: boolean; // true == projectile is alive

    constructor(
        x: number,
        y: number,
        z: number,
        velocity: number,
        targetX: number,
        targetY: number,
        targetZ: number,
        damage: number
    ) {
        // Initialize positions as dictionaries (objects)
        this.startPosition = { x, y, z };
        this.targetPosition = { x: targetX, y: targetY, z: targetZ };
        this.velocity = velocity;
        this.damage = damage;

        this.initialVelocity = this.initial_velocity_vector();
        this.currentPosition = { x: this.startPosition.x, y: this.startPosition.y, z: this.startPosition.z };

        this.projectileState = true;
    }

    public update_position(time: number): void {

        if (!this.projectileState) {
            return;
        }

        // Update position using velocity and gravity (gravity affects Z)
        this.currentPosition.x = this.startPosition.x + this.initialVelocity.x * time;
        this.currentPosition.y = this.startPosition.y + this.initialVelocity.y * time;
        this.currentPosition.z = this.startPosition.z + this.initialVelocity.z * time - (9.81 * Math.pow(time, 2)) / 2; // Gravity applied to Z (vertical movement)

        if (this.currentPosition.z <= 0){
            this.projectileState = false;
        }
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
}
