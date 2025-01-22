import {Entity} from "./entities/Entity.js";
import {Player} from "./entities/Player.js";
import {PlayerMovement} from "./entities/PlayerMovement.js";
import { World } from "./map/World.js";
import {Room} from "./map/Room.js";
import {CollisionManager} from "./entities/hitboxes/Collision.js";
import {Enemy} from "./entities/Enemy.js";
import {Point} from "./entities/hitboxes/Point.js";
import {Wall} from "./map/Structures/Wall.js";
import {Vector3} from "../math/Vector.js";
import {OBB} from "./entities/hitboxes/OBB.js";
import {Weapon} from "./entities/items/Weapon.js";
import {Projectile} from "./attack/types/Projectile.js";
import {Hitbox} from "./entities/hitboxes/Hitbox";
import {player} from "./enteties";

class GameManager {
    private entities: Set<Entity>;
    private readonly player: Player;

    private deltaTime: number;
    private readonly world: World;


    constructor(player: Player, worldSurfaceArea: number) {
        this.player = player;
        this.deltaTime = 0;
        this.entities = new Set<Entity>;
        this.world = new World(worldSurfaceArea);
    }

    public update(dt: number): void {
        this.deltaTime = dt;
        this.entityMove();
    }

    public removeEntity(entity: Entity){
        this.entities.delete(entity);
    }

    public addEntity(entity: Entity){
        this.entities.add(entity);
    }

    public playerAttack([x, y]: [number, number], equippedSlot: number): void {
        const mousePosition = new Vector3(x, 1, y);
        let currentItem = this.player.inventory.InventorySlots[equippedSlot].getItem
        if (currentItem instanceof Weapon) {

        }
    }

    public entityMove() {
        this.entities.forEach((entity: Entity) => {
            if (this.checkCollision(entity).length !== 0) {return}
            if (entity instanceof Enemy) {
                if (this.collisionWithWall(entity.getHitbox)) {
                    return;
                }
                entity.update(this.player)
            }
        })
    }

    public generateWorld() {
        this.world.generateWorld();
    }

    public collisionWithWall(hitbox: Hitbox): boolean {
        for (const room of this.world.getRooms) {
            for (const wall of room.getWalls) {
                const collision = new CollisionManager().checkCollision(hitbox, wall.getHitbox);
                if (collision.collisionPoint !== null) {
                    return true
                }
            }
        }
        return false;
    }



    private checkCollision(entity: Entity): Entity[] {
        let allActiveEntities = this.entities;
        allActiveEntities.add(this.player);

        let collidedWith: Array<Entity> = new Array<Entity>();

        allActiveEntities.forEach((e: Entity) => {
            let collided = new CollisionManager().checkCollision(entity.getHitbox, e.getHitbox);
            if (e !== entity && collided.collisionPoint !== null) {
                collidedWith.push(e);
            }
        })

        return collidedWith;
    }

    public printWorld() {
        this.world.printWorld()
    }

    get getWorld(): World {
        return this.world;
    }

    get getEntities(): Set<Entity> {
        return this.entities;
    }

    get getPlayer(): Player {
        return this.player;
    }

}

export {GameManager}