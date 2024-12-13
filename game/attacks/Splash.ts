import HitBox from "../entities/HitBox";

class Splash {
    startPosition: { x: number, y: number, z: number };
    targetPosition: { x: number, y: number, z: number };
    range: number; // distance to start + range
    radius: number; // splash radius, will affect entities within this range

    constructor(
        startPosition: { x: number, y: number, z: number },
        targetPosition: { x: number, y: number, z: number },
        range: number,
        radius: number
    ) {
        this.startPosition = startPosition;
        this.targetPosition = targetPosition;
        this.range = range;
        this.radius = radius;
    }

    /**
     * Checks if an entity (hitbox) is within the splash area.
     * @param hitbox The hitbox to check for splash damage.
     * @returns `true` if the entity is within the splash radius, `false` otherwise.
     */
    public is_within_splash(hitbox: HitBox): boolean {
        return hitbox.intersects_splash(this.startPosition, this.radius);
    }
}

export default Splash;
