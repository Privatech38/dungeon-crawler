import { Vector } from "../../Vector";
import { Entity } from "../../entities/Entity";
import { CollisionManager } from "../../entities/Collision";
import { BoxHitbox, Hitbox, SemiCircleHitbox, SphereHitbox } from "../../entities/Hitbox";

class Attack {
    protected readonly damage: number;
    protected readonly start: Vector;
    protected readonly mousePosition: Vector;
    protected readonly FPS: number;
    protected readonly splashRadius: number;
    protected readonly splashDamage: number;
    protected readonly splashAngle: number; // Angle in degrees (0 to 360)
    protected readonly isSplashAttack: boolean;
    protected entities: Entity[];
    public isActive: boolean;

    constructor(
        damage: number,
        start: Vector,
        mousePosition: Vector,
        FPS: number,
        entities: Entity[],
        splashRadius: number = 0,
        splashDamage: number = 0,
        splashAngle: number = 360, // Default splash angle is 360 degrees
    ) {
        this.damage = damage;
        this.start = start;
        this.mousePosition = mousePosition;
        this.FPS = FPS;
        this.entities = entities;
        this.splashRadius = splashRadius;
        this.splashDamage = splashDamage;
        this.splashAngle = splashAngle;
        this.isSplashAttack = splashRadius > 0 && splashAngle > 0; // Check if splash attack is enabled
        this.isActive = true;
    }

    protected applyDamage(entity: Entity): void {
        entity.takeDamage(this.damage);
    }

    protected applySplashDamage(entity: Entity): void {
        entity.takeDamage(this.splashDamage);
    }

    // Method to handle splash damage in a shared way
    protected handleSplash(center: Vector): void {
        const splashHitbox = new SphereHitbox(center, this.splashRadius);
        let hasHit = false;

        this.entities.forEach(entity => {
            if (CollisionManager.checkCollision(splashHitbox, entity.hitbox).collides) {
                this.applySplashDamage(entity);
                hasHit = true;
            }
        });

        if (hasHit) {
            this.isActive = false;
        }
    }
}

export { Attack };
