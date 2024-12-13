import Vector from "../Vector";

// Base class for all attacks
abstract class Attack {
    protected startPosition: { x: number, y: number, z: number };
    protected targetPosition: { x: number, y: number, z: number };
    protected damage: number;
    protected FPS: number;

    /**
     * @param startPosition - The initial position of the attack (x, y, z).
     * @param targetPosition - The target position of the attack (x, y, z).
     * @param damage - The damage dealt by the attack.
     * @param FPS - The frames per second to calculate position updates.
     */
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

    /**
     * Abstract method for updating the position of the attack.
     * This needs to be implemented by subclasses.
     */
    abstract update_position(): void;

    /**
     * Returns the current position of the attack.
     * Subclasses should implement their own position tracking logic.
     * @returns {x, y, z} - The current position of the attack.
     */
    abstract get_position(): { x: number, y: number, z: number };
}

export default Attack;