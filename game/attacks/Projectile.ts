import Attack from "./Attack";
import Vector from "../Vector";
import Splash from "./Splash";
import GameManager from "../GameManager";

class Projectile extends Attack {
    private readonly velocity: number;
    private currentPosition: { x: number, y: number, z: number };
    private velocityVector: { x: number, y: number, z: number };
    private time: number = 0;

    constructor(
        startPosition: { x: number, y: number, z: number },
        targetPosition: { x: number, y: number, z: number },
        damage: number,
        velocity: number,
        FPS: number
    ) {
        super(startPosition, targetPosition, damage, FPS);
        this.velocity = velocity;
        this.currentPosition = { x: startPosition.x, y: startPosition.y, z: startPosition.z };
        this.velocityVector = new Vector(startPosition, targetPosition, velocity).endPoint;
    }

    public update_position(): void {
        this.time += 1 / this.FPS;
        this.currentPosition.x = this.startPosition.x + this.velocityVector.x * this.time;
        this.currentPosition.y = this.startPosition.y + this.velocityVector.y * this.time;
        this.currentPosition.z = this.startPosition.z + this.velocityVector.z * this.time - (9.81 * Math.pow(this.time, 2)) / 2;
    }

    public get_position(): { x: number, y: number, z: number } {
        return this.currentPosition;
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
