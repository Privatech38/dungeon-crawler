class Entity {
    x: number;
    y: number;
    health: number;

    constructor(x: number, y: number, health: number) {
        this.x = x;
        this.y = y;
        this.health = health;
    }

    public move(dx: number, dy: number): void{
        this.x += dx;
        this.y += dy;
        //todo: movement
    }

    public takeDamage(amount: number): void{
        this.health -= amount;
        if (this.health <= 0){
            this.die()
        }
    }

    public die(): void {
        //todo: on death
    }
}