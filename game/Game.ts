import Entity from "./entities/Entity";
import Projectile from "./attacks/Projectile";
class Game{
    entities: Entity[];
    entity_count: number;

    constructor(){
        this.entities = [];
    }

    public add_entity(entity: Entity){
        this.entities.push(entity);
        this.entity_count ++;
    }

    // Update all projectiles
    public updateProjectiles(projectiles: Projectile[]): void {
        for (const projectile of projectiles) {
            projectile.update_position(0.016); // Example for delta time

            // Check if the projectile hits any entities
            this.checkProjectileHits(projectile);
        }
    }

    // Check if a projectile hits any entity
    private checkProjectileHits(projectile: Projectile): void {
        for (const entity of this.entities) {
            if (entity.checkCollisionWithPoint(projectile.current_position())) {
                console.log("Projectile hit entity!");
                entity.takeDamage(projectile.get_damage());
            }
        }
    }
}

export default Game;