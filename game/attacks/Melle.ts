import Attack from "./Attack";
import Vector from "../Vector";

// Class for Melee attack (inherits from Attack)
class Melee extends Attack {
    private readonly attackRange: number;
    private readonly duration: number;
    private endPosition: Vector;
    private frameCount: number;
    private readonly timeStep: number;

    /**
     * @param startPosition - The initial position of the melee attack (x, y, z).
     * @param targetPosition - The target position for the melee attack (x, y, z).
     * @param damage - The damage dealt by the melee attack.
     * @param attackRange - The range of the melee attack.
     * @param duration - The duration (in seconds) of the melee attack.
     * @param FPS - The frames per second for the update cycle.
     */
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

    /**
     * Updates the position of the melee attack over time.
     */
    public update_position(): void {
        this.frameCount++;

        // Check if attack is finished
        if (this.frameCount > this.FPS * this.duration) {
            return;
        }

        // Calculate new position based on time segment and range
        this.endPosition.length = this.timeStep * this.frameCount * this.attackRange;
        this.endPosition.recalculate();
    }

    /**
     * Returns the current position of the melee attack.
     * @returns lineEnd - The start and end points of the melee attack range.
     */
    public get_position():{ x: number; y: number; z: number }  {
        return this.endPosition.endPoint;
    }
}

