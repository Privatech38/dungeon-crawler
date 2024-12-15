import { Attack } from "./Attack";
import {Vector3} from "../../../math/Vector";
import {Hitbox} from "../../entities/hitboxes/Hitbox";
import {Sphere} from "../../entities/hitboxes/Sphere";

class Projectile extends Attack {
    private readonly gravity: number;
    private readonly timeStep: number;
    private readonly velocity: number;
    private readonly directionToMouse: Vector3;
    private readonly initialVelocityVector: Vector3;
    public currentPosition: Sphere;
    public splashRadius: number;
    private time: number;

    constructor(
        damage: number,
        velocity: number,
        entityPosition: Vector3,
        mousePosition: Vector3,
        hutBox: Hitbox,

        splashRadius: number = 0.01,
        isActive: boolean = true,
        gravity: number = 9.81,
        FPS: number = 60,
    ){
        super(damage, entityPosition, mousePosition, hutBox, isActive, FPS);

        this.gravity = gravity;
        this.timeStep = 1 / this.FPS;
        this.velocity = velocity;
        this.splashRadius = splashRadius;
        this.time = 0;

        this.directionToMouse = this.mousePosition.subtract(this.entityPosition);

        this.initialVelocityVector = this.initialVelocity();// new Vector(startPosition, targetPosition, velocity).endPoint;

        this.currentPosition = new Sphere(this.entityPosition, this.splashRadius);
    }

    private initialVelocity(): Vector3{
        const directionVector = this.directionToMouse.subtract(this.entityPosition)
        const magnitude = directionVector.magnitude();
        const scale = this.velocity / magnitude;
        return this.entityPosition.add(directionVector.scale(scale))
    }

    public update_position(): void {
        this.currentPosition.updatePosition(
            this.entityPosition.add(this.initialVelocityVector.scale(this.time))
        )
        this.currentPosition.center.z -= (this.gravity * Math.pow(this.time, 2)) / 2;
        this.time += this.timeStep;
    }

}

export { Projectile };
