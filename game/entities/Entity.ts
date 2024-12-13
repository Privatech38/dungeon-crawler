import HitBox from './HitBox';

class Entity {
    position: { x: number, y: number, z: number };
    hitBox: HitBox;  // HitBox instance for collision detection
    health: number;

    constructor(x: number, y: number, z: number, health: number, hitBox: HitBox) {
        this.position = { x, y, z };
        this.hitBox = hitBox;
        this.health = health;
    }

    // Update the position of the entity
    public updatePosition(x: number, y: number, z: number): void {
        this.position = { x, y, z };
        this.hitBox.position = this.position; // Update the position of the hitbox as well
    }

    // Check if the entity collides with a point (e.g., projectile hit)
    public checkCollisionWithPoint(point: { x: number, y: number, z: number }): boolean {
        return this.hitBox.intersects(point);
    }

    // Check if this entity collides with another entity's hitbox
    public checkCollisionWithEntity(other: Entity): boolean {
        return this.hitBox.intersects_hitbox(other.hitBox);
    }

    // Check if the entity is affected by a splash area
    public checkCollisionWithSplash(splashPosition: { x: number, y: number, z: number }, splashRadius: number): boolean {
        return this.hitBox.intersects_splash(splashPosition, splashRadius);
    }

    // Apply damage to the entity
    public takeDamage(amount: number): void {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    // Handle the entity's death
    public die(): void {
        console.log("Entity has died");
        // Additional death logic here (e.g., remove entity from the game, play death animation, etc.)
    }
}

export default Entity;
