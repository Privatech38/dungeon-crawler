import { Attack } from "./Attack";
import { Pattern } from "../Pattern";
import { Vector3 } from "../../../math/Vector";
import { Hitbox } from "../../entities/hitboxes/Hitbox";
import { OBB } from "../../entities/hitboxes/OBB";
import { Sphere } from "../../entities/hitboxes/Sphere";

/**
 * Represents a melee attack.
 * Extends the base Attack class and incorporates movement patterns and hitbox manipulation.
 */
class Melee extends Attack {
    private readonly pattern: Pattern;
    private frameCount: number;
    private readonly directionToMouse: Vector3;
    private readonly distanceFromEntity: Vector3;

    /**
     * Constructs a Melee attack instance.
     *
     * @param {number} damage - The damage dealt by the attack.
     * @param {Vector3} entityPosition - The position of the attacking entity.
     * @param {Vector3} mousePosition - The position of the mouse (target direction).
     * @param {Hitbox} hutBox - The hitbox associated with the attack.
     * @param {Pattern} pattern - The movement pattern of the attack.
     * @param {Vector3} [distanceFromEntity=new Vector3(0, 0, 0)] - Offset of the hitbox from the entity's position.
     * @param {boolean} [isActive=true] - Whether the attack is active.
     * @param {number} [FPS=60] - The update frequency in frames per second.
     */
    constructor(
        damage: number,
        entityPosition: Vector3,
        mousePosition: Vector3,
        hutBox: Hitbox,
        pattern: Pattern,
        distanceFromEntity: Vector3 = new Vector3(0, 0, 0),
        isActive: boolean = true,
        FPS: number = 60
    ) {
        super(
            damage,
            entityPosition,
            mousePosition,
            hutBox,
            isActive,
            FPS
        );
        this.pattern = pattern;
        this.frameCount = 0;
        this.distanceFromEntity = distanceFromEntity;
        this.directionToMouse = this.mousePosition
            .subtract(this.entityPosition)
            .normalize()
            .add(this.entityPosition);
    }

    /**
     * Updates the position of the attack's hitbox based on the pattern and direction.
     * Deactivates the attack when the pattern is completed.
     */
    public updatePosition(): void {
        if (!this.isActive) return;

        const direction: Vector3 = this.pattern.directionVector[this.frameCount].add(this.directionToMouse);

        if (this.hurtBox instanceof OBB) {
            this.hurtBox.updateUpAxis(direction.normalize());
            this.hurtBox.updatePosition(direction.add(this.distanceFromEntity));
        }

        this.frameCount++;

        if (this.frameCount >= this.pattern.directionVector.length) {
            this.isActive = false;
        }
    }

    /**
     * Updates the size of the hurtbox associated with the attack.
     *
     * @param {Vector3 | number} newSize - The new size or radius for the hurtbox.
     */
    public updateHurtBox(newSize: Vector3 | number): void {
        if (this.hurtBox instanceof OBB && newSize instanceof Vector3) {
            this.hurtBox.updateHalfExtents(newSize);
        } else if (this.hurtBox instanceof Sphere && typeof newSize === 'number') {
            this.hurtBox.updateRadius(newSize);
        }
    }
}

export { Melee };
