import Vector from "../Vector";

// Base class for all attacks
abstract class Attack {
    protected startPosition: { x: number, y: number, z: number };
    protected targetPosition: { x: number, y: number, z: number };
    protected damage: number;
    protected FPS: number;

    constructor(
        startPosition: { x: number; y: number; z: number },
        targetPosition: { x: number; y: number; z: number },
        damage: number,
        FPS: number
    ) {
        this.startPosition = startPosition;
        this.targetPosition = targetPosition;
        this.damage = damage;
        this.FPS = FPS;
    }

    // Abstract method that subclasses must implement
    abstract update_position(): void;
}

// Class for Melee attack (inherits from Attack)
class Melee extends Attack {
    private readonly attackRange: number;
    private readonly duration: number;
    private endPosition: Vector;
    private frameCount: number;
    private readonly timeSegment: number;

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
        this.timeSegment = 1 / (this.duration * this.FPS);
        this.endPosition = new Vector(this.startPosition, this.targetPosition, 0);
    }

    public update_position(): void {
        this.frameCount++;

        // Check if attack is finished
        if (this.frameCount > this.FPS * this.duration) {
            return;
        }

        // Calculate new position based on time segment and range
        this.endPosition.length = this.timeSegment * this.frameCount * this.attackRange;
        this.endPosition.recalculate();
    }

    public current_position(): { lineStart: { x: number; y: number; z: number }, lineEnd: { x: number; y: number; z: number } } {
        return {lineStart: this.startPosition, lineEnd: this.endPosition.endPoint};
    }
}

let m = new Melee(
    {x: 1, y: 1, z: 1},
    {x: 0, y: 0, z: 0},
    10,
    5,
    0.5,
    60
)

for (let i = 0; i < 30; i++) {
    m.update_position();
    console.log(m.current_position());
}