import { Attack } from "./Attack";
import { Vector3 } from "../../../math/Vector";
import { Hitbox } from "../../entities/hitboxes/Hitbox";
import { Sphere } from "../../entities/hitboxes/Sphere";

/**
 * Represents a projectile attack.
 * Extends the base Attack class and incorporates gravity and splash damage mechanics.
 */
class Projectile extends Attack {
    private readonly gravity: number;
    private readonly timeStep: number;
    private readonly velocity: number;
    private readonly directionToMouse: Vector3;
    private readonly initialVelocityVector: Vector3;
    private currentPosition: Sphere;
    private splashRadius: number;
    private time: number;

    /**
     * Constructs a Projectile attack instance.
     *
     * @param {number} damage - The damage dealt by the attack.
     * @param {number} velocity - The initial velocity of the projectile.\n
     * @param {Vector3} entityPosition - The position of the attacking entity.\n
     * @param {Vector3} mousePosition - The target position indicated by the mouse.\n
     * @param {Hitbox} hutBox - The hitbox associated with the projectile.\n
     * @param {number} [splashRadius=0.01] - The radius for splash damage.\n
     * @param {boolean} [isActive=true] - Whether the attack is active.\n
     * @param {number} [gravity=9.81] - The gravitational acceleration affecting the projectile.\n
     * @param {number} [FPS=60] - The update frequency in frames per second.
     */
    constructor(
        damage: number,
        velocity: number,
        entityPosition: Vector3,
        mousePosition: Vector3,
        hutBox: Hitbox,
        splashRadius: number = 0.01,
        isActive: boolean = true,
        gravity: number = 9.81,
        FPS: number = 60
    ) {
        super(damage, entityPosition, mousePosition, hutBox, isActive, FPS);

        this.gravity = gravity;
        this.timeStep = 1 / this.FPS;
        this.velocity = velocity;
        this.splashRadius = splashRadius;
        this.time = 0;

        this.directionToMouse = this.mousePosition.subtract(this.entityPosition);
        this.initialVelocityVector = this.initialVelocity();
        this.currentPosition = new Sphere(this.entityPosition, this.splashRadius);
    }

    /**
     * Calculates the initial velocity vector based on direction and magnitude.
     *
     * @returns {Vector3} - The calculated initial velocity vector.
     */
    private initialVelocity(): Vector3 {
        const directionVector = this.directionToMouse.subtract(this.entityPosition);
        const magnitude = directionVector.magnitude();
        const scale = this.velocity / magnitude;
        return this.entityPosition.add(directionVector.scale(scale));
    }

    /**
     * Updates the position of the projectile based on its velocity, gravity, and time.
     */
    public updatePosition(): void {
        this.currentPosition.updatePosition(
            this.entityPosition.add(this.initialVelocityVector.scale(this.time))
        );
        this.currentPosition.center.z -= (this.gravity * Math.pow(this.time, 2)) / 2;
        this.time += this.timeStep;
    }

    /**
     * Updates the splash radius of the projectile.
     *
     * @param {number} newRadius - The new radius for splash damage.
     */
    public updateHurtBox(newRadius: number): void {
        this.splashRadius = newRadius;
    }
}

export { Projectile };
