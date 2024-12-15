import { Attack } from "./Attack";
import {Pattern} from "../Pattern";
import {Vector3} from "../../../math/Vector";
import {Hitbox} from "../../entities/hitboxes/Hitbox";
import {OBB} from "../../entities/hitboxes/OBB";

class Melee extends Attack {
    private readonly pattern: Pattern;
    private frameCount: number;
    private readonly directionToMouse: Vector3;
    private readonly distanceFromEntity: Vector3;

    constructor(
        damage: number,
        entityPosition: Vector3,
        mousePosition: Vector3,
        hutBox: Hitbox,
        pattern: Pattern,
        distanceFromEntity: Vector3 = new Vector3(0, 0, 0),

        isActive: boolean = true,
        FPS: number = 60,
    ) {
        super(
            damage,
            entityPosition,
            mousePosition,
            hutBox,
            isActive,
            FPS,
        );
        this.pattern = pattern;
        this.frameCount = 0;
        this.distanceFromEntity = distanceFromEntity;
        this.directionToMouse = this.mousePosition.subtract(this.entityPosition).normalize().add(this.entityPosition)
    }

    public update_position(): void {
        if (!this.isActive) return;

        const direction: Vector3 = this.pattern.directionVector[this.frameCount].add(this.directionToMouse)

        if (this.hurtBox instanceof OBB){
            this.hurtBox.updateUpAxis(direction.normalize())
            this.hurtBox.updatePosition(direction.add(this.distanceFromEntity))
        }

        this.frameCount++;

        if (this.frameCount >= this.pattern.directionVector.length) {
            this.isActive = false;
        }
    }
}

export { Melee };
