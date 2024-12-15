import { Vector3 } from "../../../math/Vector";
import { Hitbox } from "../../entities/hitboxes/Hitbox";

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
    protected readonly entityPosition: Vector3;

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
     * The frames per second, used for timing calculations.
     */
    protected readonly FPS: number;

    /**
     * Constructs an instance of the Attack class.
     * @param {number} damage - The amount of damage the attack inflicts.
     * @param {Vector3} entityPosition - The position of the entity performing the attack.
     * @param {Vector3} mousePosition - The position of the mouse cursor.
     * @param {Hitbox} hutBox - The hitbox representing the area affected by the attack.
     * @param {boolean} [isActive=true] - Whether the attack is currently active.
     * @param {number} [FPS=60] - Frames per second for timing calculations.
     */
    protected constructor(
        damage: number,
        entityPosition: Vector3,
        mousePosition: Vector3,
        hutBox: Hitbox,
        isActive: boolean = true,
        FPS: number = 60,
    ) {
        this.damage = damage;
        this.entityPosition = entityPosition;
        this.mousePosition = mousePosition;
        this.hurtBox = hutBox;
        this.isActive = isActive;
        this.FPS = FPS;
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
     * Retrieves the center position of the hurt box.
     * @returns {Vector3} The center position of the hurt box.
     */
    getHurtBox(): Vector3 {
        return this.hurtBox.center;
    }
}

export { Attack };
