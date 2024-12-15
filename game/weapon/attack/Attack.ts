import { Entity } from "../../entities/Entity";
import {Vector3} from "../../../math/Vector";
import {Hitbox} from "../../entities/hitboxes/Hitbox";

abstract class Attack {
    protected readonly damage: number;
    protected readonly entityPosition: Vector3;
    protected readonly mousePosition: Vector3;
    protected hurtBox: Hitbox;

    protected isActive: boolean;
    protected readonly FPS: number;

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

    abstract updatePosition(): void;
    abstract updateHurtBox(newRadius: number | Vector3): void;

    getHurtBox(): Vector3{
        return this.hurtBox.center;
    }

}

export { Attack };
