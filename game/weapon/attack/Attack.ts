import {Vector} from "../../Vector"
import {Entity} from "../../entities/Entity";

class Attack {
    private readonly damage: number;
    protected readonly start: Vector;
    protected readonly mousePosition: Vector;
    protected readonly FPS: number;
    private readonly splashRadius: number;
    private readonly splashDamage: number;
    private readonly splashAngle: number; // Angle in degrees (0 to 360)
    private readonly isSplashAttack: boolean;

    constructor(
        damage: number,
        start: Vector,
        mousePosition: Vector,
        FPS: number,
        splashRadius: number = 0,
        splashDamage: number = 0,
        splashAngle: number = 0,
    ) {
        this.damage = damage;
        this.start = start;
        this.mousePosition = mousePosition;
        this.FPS = FPS;
        this.splashRadius = splashRadius;
        this.splashDamage = splashDamage;
        this.splashAngle = splashAngle;
        this.isSplashAttack = splashRadius > 0 && splashAngle > 0; // Check if splash attack is enabled
    }

    private applyDamage(entity: Entity): void {
        entity.takeDamage(this.damage);
    }

    private applySplashDamage(entities: Entity[]){
        entities.forEach(entity => {
            entity.takeDamage(this.splashDamage);
        })
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
    }

    public update_position(): void {
        this.frameCount++;
        if (this.frameCount > this.FPS * this.duration) return;
        let length = this.timeStep * this.frameCount * this.attackRange;
        this.target = this.target.computeEndPoint(this.direction, this.magnitude, length);
    }

    public get_position(): { x: number, y: number, z: number } {
        return this.target;
    }
}

export { Attack, Melee }