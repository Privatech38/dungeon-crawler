import {Vector3} from "../../math/Vector";
import {Hitbox} from "./hitboxes/Hitbox";
import {Effect} from "./damage/Effect";
import {Defence} from "./damage/Defence";
import {Damage} from "./damage/effects/damage/Damage";
import {DebuffFreeze} from "./damage/effects/debuff/DebuffFreeze";
import {DebuffDamage} from "./damage/effects/debuff/DebuffDamage";

abstract class Entity {
    protected health: number;
    protected hitbox: Hitbox;
    protected position: Vector3;
    protected effects: Set<Effect>;
    protected _defense: Set<Defence>;
    protected damageReduction: number;
    protected speed: number
    protected damageMultiplier: number;
    protected _alive: boolean;

    protected constructor(health: number, speed: number, hitbox: Hitbox) {
        this.health = health;
        this.speed = speed;
        this.hitbox = hitbox;
        this.position = this.hitbox.center;
        this.effects = new Set();
        this.damageMultiplier = 1;
        this._defense = new Set<Defence>;
        this._alive = true;
        this.damageReduction = 0;
    }

    public updatePosition(vector: Vector3): void {
        this.position = vector;
        this.hitbox.updatePosition(vector);
    }

    public addEffect(effect: Effect): void {
        this.effects.add(effect);
    }

    public takeEffect(damage: number = 0): void {
        if (!this._alive) return;
        if (this.effects.size != 0) {
            this.effects.forEach(effect => this.calcEffects(effect));
        }
        this.loseHealth(damage)
    }

    public addDefence(defence: Defence): void {
        this._defense .add(defence);
        this.damageReduction = 1;
        this._defense.forEach(defence => {
            this.damageReduction *= (defence.reduction);
        })
        this.damageReduction = 1 - this.damageReduction;
    }

    public removeDefence(defence: Defence): void {
        this._defense.delete(defence);
    }

    private calcEffects(effect: Effect): void{
        if (effect.isActive()){
            if (effect instanceof Damage) {
                this.loseHealth(effect.dealDamage())
            }
            else if (effect instanceof DebuffFreeze){
                this.speed *= effect.reduction;
            }
            else if (effect instanceof DebuffDamage){
                this.damageReduction *= effect.reduction;
            }
        }
        else {
            if (effect instanceof DebuffFreeze){
                this.speed /= effect.reduction;
            }
            else if (effect instanceof DebuffDamage){
                this.damageReduction /= effect.reduction;
            }
            this.effects.delete(effect)
        }
    }

    private loseHealth(damage: number) {
        this.health -= (1 - this.damageReduction) * damage;
        if (this.health <= 0) this._alive = false;
    }

    get alive(): boolean{
        return this._alive;
    }

    set alive(value: boolean){
        this._alive = value;
    }
}

export { Entity };