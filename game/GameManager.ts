import Splash from "./attacks/Splash";
import Entity from "./entities/Entity";

class GameManager {
    private entities: Entity[]; // List of all entities in the game

    constructor() {
        this.entities = [];
    }

    // Add an entity to the game
    public add_entity(entity: Entity): void {
        this.entities.push(entity);
    }

    // Apply splash damage to entities within the splash radius
    public apply_splash_damage(splash: Splash, damage: number): void {
        for (const entity of this.entities) {
            // Check if the entity's hitbox intersects with the splash radius
            if (entity.checkCollisionWithSplash(splash.targetPosition, splash.radius)) {
                entity.takeDamage(damage);
            }
        }
    }

    // Update positions of all entities (if needed for the game logic)
    public update_entities(): void {
        for (const entity of this.entities) {
            // Example: Update entity position based on movement (not implemented here)
            // entity.updatePosition(newX, newY, newZ);
        }
    }

    // Remove dead entities
    public cleanup_entities(): void {
        this.entities = this.entities.filter(entity => entity.health > 0);
    }
}

export default GameManager;
