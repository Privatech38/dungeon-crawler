import { Vector } from "../../Vector";
import { Attack } from "./Attack";
import { CollisionManager } from "../../entities/Collision";
import {Entity} from "../../entities/Entity";

class Projectile extends Attack {
    private readonly timeStep: number;
    private readonly attackRange: number;
    private readonly target: Vector;
    private readonly velocity: number;
    private readonly initialVelocity: Vector;
    private readonly gravity: number;
    private readonly direction: Vector;
    private readonly magnitude: number;

    constructor(
        damage: number,
        start: Vector,
        mousePosition: Vector,
        FPS: number,
        velocity: number,
        entities: Entity[],
        splashRadius: number = 0,
        splashDamage: number = 0,
        splashAngle: number = 360,
        gravity: number = 9.81,
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
        this.gravity = gravity;
        this.timeStep = 1 / this.FPS;
        this.velocity = velocity;
        this.direction = Vector.getDirectionVector(this.start, this.mousePosition);
        this.magnitude = Vector.getMagnitude(this.direction);
        this.initialVelocity = this.start.computeEndPoint(this.direction, this.magnitude, this.velocity);
        this.target = new Vector(this.start.x, this.start.y, this.start.z);
    }

    public update_position(): void {
        // Apply gravity correctly with frame count
        this.target.x += this.initialVelocity.x * this.timeStep;
        this.target.y += this.initialVelocity.y * this.timeStep;
        this.target.z += this.initialVelocity.z * this.timeStep - (this.gravity * Math.pow(this.timeStep, 2)) / 2;

        // Check if it's a splash or point attack
        if (this.isSplashAttack) {
            this.handleSplash(this.target);
        } else {
            this.collisionWithEntity(this.entities);
        }
    }

    public current_position(): { x: number, y: number, z: number } {
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

export { Projectile };
