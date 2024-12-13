import {Vector} from "../../Vector"
import {Entity} from "../../entities/Entity";
import {CollisionManager} from "../../entities/Collision";
import {GameManager} from "../../GameManager";
import {BoxHitbox, Hitbox, SemiCircleHitbox, SphereHitbox} from "../../entities/Hitbox";


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
    protected splashHitbox: SemiCircleHitbox;
    public isActive;

    constructor(
        damage: number,
        start: Vector,
        mousePosition: Vector,
        FPS: number,
        entities: Entity[],
        splashRadius: number = 0,
        splashDamage: number = 0,
        splashAngle: number = 0,
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

    protected applySplashDamage(entity: Entity){
        entity.takeDamage(this.splashDamage);
    }
}

class Melee extends Attack{
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
        splashAngle: number = 0,
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
        this.magnitude = Vector.getMagnitude(this.direction)
        this.target = new Vector();
        if (this.isSplashAttack) {this.createSplashAttackHitbox()}
    }

    public update_position(): void {
        if (!this.isActive){
            return;
        }
        this.frameCount++;
        if (this.frameCount > this.FPS * this.duration) return;

        let length = this.timeStep * this.frameCount * this.attackRange;
        this.target = this.target.computeEndPoint(this.direction, this.magnitude, length);

        // check if its splash or point attack
        if (this.isSplashAttack){
            this.SplashCollisionWithEntity(this.entities)
        }
        else {
            this.collisionWithEntity(this.entities)
        }
    }

    public get_position(): { x: number, y: number, z: number } {
        return this.target;
    }

    private createSplashAttackHitbox(): SemiCircleHitbox {
        return new SemiCircleHitbox(
            this.start,
            this.splashRadius,
            this.direction,
        )
    }

    private collisionWithEntity(entities: Entity[]): void {
        entities.forEach(entity => {
            if (CollisionManager.checkPointCollision(entity.hitbox, this.target)) {
                this.applyDamage(entity);
                this.isActive = false;
            }
        })
    }

    private SplashCollisionWithEntity(entities: Entity[]): void {
        let gotHit: boolean = false;
        entities.forEach(entity => {
            if (CollisionManager.checkCollision(entity.hitbox, this.splashHitbox)){
                this.applySplashDamage(entity)
                gotHit = true;
            }
        })
        if (gotHit) {
            this.isActive = false;
        }
    }
}

class Projectile extends Attack {
    private readonly timeStep: number;
    private readonly attackRange: number;
    private readonly target: Vector;
    private readonly velocity: number;
    private readonly initialVelocity: Vector;
    private readonly gravity: number;

    private readonly direction: Vector;
    private readonly magnitude: number;
    private frameCount: number;

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
        this.magnitude = Vector.getMagnitude(this.direction)
        this.initialVelocity = this.start.computeEndPoint(this.direction, this.magnitude, this.velocity);
        this.target = new Vector(this.start.x, this.start.y, this.start.z);
        this.frameCount = 0;
    }

    public update_position(): void {
        this.frameCount++;
        // Update position using velocity and gravity (gravity affects Z)
        this.target.x += this.initialVelocity.x * this.timeStep;
        this.target.y += this.initialVelocity.y * this.timeStep;
        this.target.z += this.initialVelocity.z * this.timeStep - 0.5 * this.gravity * Math.pow(this.timeStep * this.frameCount, 2);
        // check if its splash or point attack
        if (this.isSplashAttack){
            this.SplashCollisionWithEntity(this.entities)
        }
        else {
            this.collisionWithEntity(this.entities)
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
        })
    }

    private SplashCollisionWithEntity(entities: Entity[]): void {
        entities.forEach(entity => {
            //todo: also check if it hits a wall or ground
            if (CollisionManager.checkPointCollision(entity.hitbox, this.target)) {
                this.applyDamage(entity);
                entities.forEach(entity => {
                    if (CollisionManager.checkCollision(entity.hitbox, this.splashHitbox)){
                        this.applySplashDamage(entity)
                    }
                })
                this.isActive = false;
            }
        })
    }

    private createSplashAttackHitbox(): SphereHitbox {
        return new SphereHitbox(
            this.start,
            this.splashRadius,
        )
    }
}

export { Attack, Melee, Projectile };