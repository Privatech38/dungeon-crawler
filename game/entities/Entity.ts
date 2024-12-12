import { HitBoxBase, HitBox, SphereHitBox } from './HitBox';

class Entity {
    position: { x: number, y: number, z: number };
    hitBox: HitBoxBase;  // This can be either a HitBox or a SphereHitBox
    health: number;

    constructor(x: number, y: number, z: number, health: number, hitBox: HitBoxBase) {
        this.position = { x, y, z };
        this.hitBox = hitBox;
        this.health = health;
    }

    // Update the position of the entity
    public updatePosition(x: number, y: number, z: number): void {
        this.position = { x, y, z };
    }

    // Check if the entity collides with a point (projectile hit)
    public checkCollisionWithPoint(point: { x: number, y: number, z: number }): boolean {
        return this.hitBox.intersects(point);
    }

    // Check if this entity collides with another entity
    public checkCollisionWithEntity(other: Entity): boolean {
        return this.hitBox.intersectsHitBox(other.hitBox);
    }

    public takeDamage(amount: number): void {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    public die(): void {
        //todo: on death
        console.log("Entity has died");
    }
}

export default Entity;
