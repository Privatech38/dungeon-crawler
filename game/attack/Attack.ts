import { Vector3 } from "../../math/Vector";
import { Hitbox } from "../entities/hitboxes/Hitbox";
import {Entity} from "../entities/Entity";

/**
 * Represents an abstract attack that can be performed by an entity.
 * Defines properties like damage, positions, and hurt boxes, and includes abstract methods for updating the attack.
 */
abstract class Attack {
    /**
     * The amount of damage the attack inflicts.
     */
    protected readonly damage: number;

    /**
     * The position of the entity performing the attack.
     */
    protected readonly entity: Entity;

    /**
     * The position of the mouse cursor, used for attack direction.
     */
    protected readonly mousePosition: Vector3;

    /**
     * The hitbox representing the area affected by the attack.
     */
    protected hurtBox: Hitbox;

    /**
     * Indicates whether the attack is currently active.
     */
    protected isActive: boolean;

    /**
     * Time now used for timing calculations.
     */
    protected readonly timeStart: number;

    /**
     * Constructs an instance of the Attack class.
     * @param {number} damage - The amount of damage the attack inflicts.
     * @param {Vector3} entity - Entity that is performing the attack.
     * @param {Vector3} mousePosition - The position of the mouse cursor.
     * @param {Hitbox} hurtBox - The hitbox representing the area affected by the attack.
     * @param {boolean} [isActive=true] - Whether the attack is currently active.
     */
    protected constructor(
        damage: number,
        entity: Entity,
        mousePosition: Vector3,
        hurtBox: Hitbox,
        isActive: boolean = true,
    ) {
        this.damage = damage;
        this.entity = entity;
        this.mousePosition = mousePosition;
        this.hurtBox = hurtBox;
        this.isActive = isActive;
        this.timeStart = Date.now()
    }

    /**
     * Updates the position of the attack. This method must be implemented by subclasses.
     */
    abstract updatePosition(): void;

    /**
     * Updates the hurt box of the attack based on the new radius or dimensions.
     * @param {number | Vector3} newRadius - The new radius or dimensions of the hurt box.
     */
    abstract updateHurtBox(newRadius: number | Vector3): void;

    /**
     * Retrieves the hurt box.
     * @returns Hurt box.
     */
    getHurtBox(): Hitbox {
        return this.hurtBox;
    }
}

export { Attack };
