import {Vector3} from "../../math/Vector";
import {Hitbox} from "./hitboxes/Hitbox";
import {Effect} from "./effects/Effect";
import {Defence} from "./Defence";
import {Direct} from "./effects/direct/Direct";
import {DebuffFreeze} from "./effects/debuff/DebuffFreeze";
import {DebuffDamage} from "./effects/debuff/DebuffDamage";

abstract class Entity {
    protected health: number;
    protected hitbox: Hitbox;
    protected position: Vector3;
    protected effects: Set<Effect>;
    protected defense: Set<Defence>;
    protected damageReduction: number;
    protected speed: number
    protected damageMultiplier: number;
    protected alive: boolean;
    protected initialPosition: Vector3;

    protected constructor(health: number, speed: number, hitbox: Hitbox, initialPosition: Vector3) {
        this.health = health;
        this.speed = speed;
        this.hitbox = hitbox;
        this.position = this.hitbox.center;
        this.effects = new Set();
        this.damageMultiplier = 1;
        this.defense = new Set<Defence>;
        this.alive = true;
        this.damageReduction = 0;
        this.initialPosition = initialPosition;
    }

    public addEffect(effect: Effect): void {
        this.effects.add(effect);
    }

    public takeEffect(damage: number = 0): void {
        if (!this.alive) return;
        if (this.effects.size != 0) {
            this.effects.forEach(effect => this.calcEffects(effect));
        }
        this.loseHealth(damage)
    }

    public addDefence(defence: Defence): void {
        this.defense .add(defence);
        this.damageReduction = 1;
        this.defense.forEach(defence => {
            this.damageReduction *= (defence.reduction);
        })
        this.damageReduction = 1 - this.damageReduction;
    }

    public removeDefence(defence: Defence): void {
        this.defense.delete(defence);
    }

    public revive(){
        this.alive = true;
    }

    public kill(){
        this.alive = false;
    }

    private calcEffects(effect: Effect): void{
        if (effect.isActive()){
            if (effect instanceof Direct) {
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
        if (this.health <= 0) this.kill();
    }

    protected updatePosition(position: Vector3){
        this.position = position;
        this.hitbox.center = position;
    }

    get getLifeState(): boolean{
        return this.alive;
    }

    get getPosition(): Vector3 {
        return this.position;
    }
}

export { Entity };