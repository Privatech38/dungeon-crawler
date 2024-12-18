class Effect {
    private duration: number;
    private startTime: number;
    private endTime: number;
    private lastDamage: number;
    private damage: number;
    private tickRate: number;

    constructor(duration: number, damage: number, tickRate: number) {
        this.duration = duration;
        this.startTime = Date.now();
        this.endTime = this.startTime + this.duration * 1000;
        this.damage = damage;
        this.tickRate = 1000/tickRate;
        this.lastDamage = Date.now()

    }

    public active(): boolean{
        return this.endTime <= Date.now();
    }

    public dealDamage(): number {
        if (Date.now() <= this.lastDamage + this.tickRate) {
            return this.damage;
        }
        this.lastDamage = Date.now();
        return 0;
    }


}

export {Effect};