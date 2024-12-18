import {Effect} from "../../Effect";

class Damage extends Effect {
    private lastAttack: number;
    private readonly damage: number;
    private readonly fireRate: number;

    constructor(duration: number, fireRate: number, damage: number) {
        super(duration);
        this.fireRate = 1000/fireRate;
        this.lastAttack = 0;
        this.damage = damage;
    }

    public dealDamage(): number {
        if (!this.isActive()) return 0;
        if (Date.now() <= this.lastAttack + this.fireRate){
            this.lastAttack = Date.now();
            return this.damage;
        }
        return 0;
    }

}

export { Damage }