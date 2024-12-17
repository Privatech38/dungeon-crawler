import { Attack } from "./Attack";
import { Pattern } from "../Pattern";
import { Vector3 } from "../../../math/Vector";
import { Hitbox } from "../../entities/hitboxes/Hitbox";
import { OBB } from "../../entities/hitboxes/OBB";
import { Sphere } from "../../entities/hitboxes/Sphere";
import { Entity } from "../../entities/Entity";
import {FindClosest} from "../../searchAlgorithms/FindClosest";

/**
 * Represents a melee attack.
 * Extends the base Attack class and incorporates movement patterns and hitbox manipulation.
 */
class Melee extends Attack {
    private readonly pattern: Pattern;
    private readonly directionToMouse: Vector3;
    private readonly distanceFromEntity: Vector3;
    private readonly entityPosition: Vector3;

    /**
     * Constructs a Melee attack instance.
     *
     * @param {number} damage - The damage dealt by the attack.
     * @param {Vector3} entity - Entity that is attacking.
     * @param {Vector3} mousePosition - The position of the mouse (target direction).
     * @param {Hitbox} hurtBox - The hitbox associated with the attack.
     * @param {Pattern} pattern - The movement pattern of the attack.
     * @param {Vector3} [distanceFromEntity=new Vector3(0, 0, 0)] - Offset of the hitbox from the entity's position.
     * @param {boolean} [isActive=true] - Whether the attack is active.
     */
    constructor(
        damage: number,
        entity: Entity,
        mousePosition: Vector3,
        hurtBox: Hitbox,
        pattern: Pattern,
        distanceFromEntity: Vector3 = new Vector3(0, 0, 0),
        isActive: boolean = true,
    ) {
        super(
            damage,
            entity,
            mousePosition,
            hurtBox,
            isActive,
        );
        this.pattern = pattern;
        this.distanceFromEntity = distanceFromEntity;
        this.entityPosition = entity.position;
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

        const timeDiff = Date.now() - this.timeStart;
        // find the closest dot for time pattern of current time
        const closestDot = new FindClosest(this.pattern.timePattern.list, timeDiff/1000).distanceIndex;

        const direction: Vector3 = this.pattern.directionVector[closestDot].add(this.directionToMouse);

        if (this.hurtBox instanceof OBB) {
            this.hurtBox.updateUpAxis(direction.normalize());
            this.hurtBox.updatePosition(direction.add(this.distanceFromEntity));
        }

        if (timeDiff >= this.pattern.directionVector.length) {
            this.isActive = false;
        }
    }

    /**
     * Updates the size of the hurtbox associated with the attack.
     *
     * @param {Vector3 | number} newSize - The new size or radius for the hurtbox.
     */
    updateHurtBox(newSize: Vector3 | number): void {
        if (this.hurtBox instanceof OBB && newSize instanceof Vector3) {
            this.hurtBox.updateHalfExtents(newSize);
        } else if (this.hurtBox instanceof Sphere && typeof newSize === 'number') {
            this.hurtBox.updateRadius(newSize);
        }
    }
}

export { Melee };