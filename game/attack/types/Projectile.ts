import { Attack } from "../Attack";
import { Vector3 } from "../../../math/Vector";
import { Hitbox } from "../../entities/hitboxes/Hitbox";
import { Sphere } from "../../entities/hitboxes/Sphere";
import {Entity} from "../../entities/Entity";

/**
 * Represents a projectile attack.
 * Extends the base Attack class and incorporates gravity and splash damage mechanics.
 */
class Projectile extends Attack {
    private readonly gravity: number;
    private readonly velocity: number;
    private readonly directionToMouse: Vector3;
    private readonly initialVelocityVector: Vector3;
    private readonly projectile: Sphere;
    private splashRadius: number;
    private readonly entityPosition: Vector3;

    /**
     * Constructs a Projectile attack instance.
     *
     * @param {number} damage - The damage dealt by the attack.
     * @param {number} velocity - The initial velocity of the projectile.\n
     * @param {Vector3} entity - Entity that is performing the attack.\n
     * @param {Vector3} mousePosition - The target position indicated by the mouse.\n
     * @param {Hitbox} hurtBox - The hitbox associated with the projectile.\n
     * @param {number} [splashRadius=0.01] - The radius for splash damage.\n
     * @param {boolean} [isActive=true] - Whether the attack is active.\n
     * @param {number} [gravity=9.81] - The gravitational acceleration affecting the projectile.\n
     */
    constructor(
        damage: number,
        velocity: number,
        entity: Entity,
        mousePosition: Vector3,
        hurtBox: Hitbox,
        splashRadius: number = 0.01,
        isActive: boolean = true,
        gravity: number = 9.81,
    ) {
        super(damage, entity, mousePosition, hurtBox, isActive);

        this.gravity = gravity;
        this.velocity = velocity;
        this.splashRadius = splashRadius;
        this.entityPosition = entity.getPosition;

        this.directionToMouse = this.mousePosition.subtract(this.entityPosition);
        this.initialVelocityVector = this.initialVelocity();
        this.projectile = new Sphere(this.entityPosition, this.splashRadius);
    }

    /**
     * Calculates the initial velocity vector based on direction and magnitude.
     *
     * @returns {Vector3} - The calculated initial velocity vector.
     */
    private initialVelocity(): Vector3 {
        const directionVector = this.directionToMouse.normalize(); // Ensure normalized direction
        return directionVector.scale(this.velocity);
    }

    /**
     * Updates the position of the projectile based on its velocity, gravity, and time.
     */
    public updatePosition(): void {
        const timeDiff = ( Date.now() - this.timeStart ) / 1000;

        this.projectile.updatePosition(
            this.entityPosition.add(this.initialVelocityVector.scale(timeDiff))
        );
        this.projectile.center.z -= (this.gravity * Math.pow(timeDiff, 2)) / 2;
        this.hurtBox.updatePosition(this.projectile.center);
    }

    /**
     * Updates the splash radius of the projectile.
     *
     * @param {number} newRadius - The new radius for splash damage.
     */
    public updateHurtBox(newRadius: number): void {
        this.splashRadius = newRadius;
    }

    get getEntityPosition(): Vector3 {
        return this.entityPosition;
    }

    get getProjectile(): Sphere {
        return this.projectile;
    }
}

export { Projectile };
