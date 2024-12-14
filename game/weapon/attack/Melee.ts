import { Vector } from "../../Vector";
import { Attack } from "./Attack";
import { CollisionManager } from "../../entities/Collision";
import {Entity} from "../../entities/Entity";

class Melee extends Attack {
    private frameCount: number;
    private readonly duration: number;
    private readonly timeStep: number;
    private readonly attackRange: number;
    private target: Vector;
    private readonly direction: Vector;
    private readonly magnitude: number;

    constructor(
        damage: number,
        start: Vector,
        mousePosition: Vector,
        FPS: number,
        entities: Entity[],
        duration: number,
        attackRange: number,
        splashRadius: number = 0,
        splashDamage: number = 0,
        splashAngle: number = 360,
    ) {
        super(
            damage,
            start,
            mousePosition,
            FPS,
            entities,
            splashRadius,
            splashDamage,
            splashAngle,
        );
        this.attackRange = attackRange;
        this.frameCount = 0;
        this.duration = duration;
        this.timeStep = 1 / (this.duration * this.FPS);
        this.direction = Vector.getDirectionVector(this.start, this.mousePosition);
        this.magnitude = Vector.getMagnitude(this.direction);
        this.target = new Vector();
    }

    public update_position(): void {
        if (!this.isActive) {
            return;
        }
        this.frameCount++;
        if (this.frameCount > this.FPS * this.duration) return;

        let length = this.timeStep * this.frameCount * this.attackRange;
        this.target = this.target.computeEndPoint(this.direction, this.magnitude, length);

        // Check if it's a splash or point attack
        if (this.isSplashAttack) {
            this.handleSplash(this.target); // Call handleSplash instead of directly checking collision
        } else {
            this.collisionWithEntity(this.entities);
        }
    }

    public get_position(): { x: number, y: number, z: number } {
        return this.target;
    }

    private collisionWithEntity(entities: Entity[]): void {
        entities.forEach(entity => {
            if (CollisionManager.checkPointCollision(entity.hitbox, this.target)) {
                this.applyDamage(entity);
                this.isActive = false;
            }
        });
    }
}

export { Melee };
