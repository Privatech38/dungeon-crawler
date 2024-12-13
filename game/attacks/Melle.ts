import Attack from "./Attack";
import Splash from "./Splash";
import Vector from "../Vector";
import GameManager from "../GameManager";

class Melee extends Attack {
    private readonly attackRange: number;
    private readonly duration: number;
    private endPosition: Vector;
    private frameCount: number;
    private readonly timeStep: number;

    constructor(
        startPosition: { x: number, y: number, z: number },
        targetPosition: { x: number, y: number, z: number },
        damage: number,
        attackRange: number,
        duration: number,
        FPS: number
    ) {
        super(startPosition, targetPosition, damage, FPS);
        this.attackRange = attackRange;
        this.duration = duration;
        this.frameCount = 0;
        this.timeStep = 1 / (this.duration * this.FPS);
        this.endPosition = new Vector(this.startPosition, this.targetPosition, 0);
    }

    public update_position(): void {
        this.frameCount++;
        if (this.frameCount > this.FPS * this.duration) return;
        this.endPosition.length = this.timeStep * this.frameCount * this.attackRange;
        this.endPosition.recalculate();
    }

    public get_position(): { x: number, y: number, z: number } {
        return this.endPosition.endPoint;
    }

    /**
     * Notify GameManager about splash damage.
     * @param splash The splash effect to check for.
     * @param gameManager The GameManager instance to handle splash damage application.
     */
    public apply_splash(splash: Splash, gameManager: GameManager): void {
        gameManager.apply_splash_damage(splash, this.damage);
    }
}


/*
let m = new Melee(
    {x: 0, y: 0, z: 0},
    {x: 0, y: 1, z: 0},
    1,
    5,
    0.5,
    60
)

for (let i = 0; i < 30; i++) {
    m.update_position();
    console.log(m.get_position());
}

 */
