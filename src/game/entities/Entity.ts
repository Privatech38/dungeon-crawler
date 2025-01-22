import {Vector3} from "../../math/Vector";
import {Hitbox} from "./hitboxes/Hitbox";
import {Effect} from "./effects/Effect";
import {Defence} from "./Defence";
import {Direct} from "./effects/direct/Direct";
import {DebuffFreeze} from "./effects/debuff/DebuffFreeze";
import {DebuffDamage} from "./effects/debuff/DebuffDamage";

abstract class Entity {
    protected healthPoints: number;
    protected MAX_HEALTH_POINTS: number = 100;
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
        this.healthPoints = health;
        this.MAX_HEALTH_POINTS = health;
        this.speed = speed;
        this.initialPosition = initialPosition;
        this.hitbox = hitbox;
        this.position = initialPosition;
        this.effects = new Set();
        this.damageMultiplier = 1;
        this.defense = new Set<Defence>;
        this.alive = true;
        this.damageReduction = 0;

        this.hitbox.updatePosition(this.initialPosition)
    }

    public addEffect(effect: Effect): void {
        this.effects.add(effect);
    }

    public takeEffect(damage: number = 0): void {
        if (!this.alive) return;
        if (this.effects.size != 0) {
            this.effects.forEach(effect => this.calcEffects(effect));
        }
        this.subtractHealthPoints(damage)
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
                this.subtractHealthPoints(effect.dealDamage())
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

    /**
     * Applies damage reduction to the supplied number and then subtracts it from health points
     * @param amount - the amount of health points to be subtracted
     * @private
     */
    private subtractHealthPoints(amount: number) {
        this.healthPoints -= (1 - this.damageReduction) * amount;
        if (this.healthPoints <= 0) this.kill();
    }

    /**
     * Adds health points to the entity, but does not exceed the maximum health points
     * @param amount - the amount of health points to be added
     * @private
     */
    private addHealthPoints(amount: number) {
        this.healthPoints += amount;
        if (this.healthPoints > this.MAX_HEALTH_POINTS) this.healthPoints = this.MAX_HEALTH_POINTS;
    }

    /**
     * Returns the current health points of the entity
     */
    public get getHealthPoints(): number {
        return this.healthPoints;
    }

    protected updatePosition(position: Vector3){
        this.position = position.clone();
        this.hitbox.center = position.clone();
    }

    get isAlive(): boolean{
        return this.alive;
    }

    get getPosition(): Vector3 {
        return this.position;
    }

    get getHitbox(): Hitbox{
        return this.hitbox;
    }
}

export { Entity };