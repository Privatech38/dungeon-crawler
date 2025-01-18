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

class GameManager {
    private entities: Set<Entity>;
    private readonly player: Player;
    private readonly playerMovement: PlayerMovement;
    private readonly activeEntities: Set<Entity>;
    private activeRooms: Set<Room>;
    private activeProjectiles: Set<Projectile>;

    private deltaTime: number;
    private lastFrameTime: number;
    private readonly world: World;

    private currentRoom: Room;

    constructor(player: Player, worldSurfaceArea: number) {
        this.player = player;
        this.deltaTime = 0;
        this.entities = new Set<Entity>;
        this.lastFrameTime = performance.now();
        this.playerMovement = new PlayerMovement(this.player.getInitialPosition, this.player.getSpeed);
        this.world = new World(worldSurfaceArea);
        this.activeEntities = new Set<Entity>();
        this.currentRoom = this.world.getRooms[0]; //starting room
        this.activeRooms = new Set<Room>();
        this.activeRooms.add(this.currentRoom);
        this.activeProjectiles = new Set<Projectile>();
    }

    public removeEntity(entity: Entity){
        this.entities.delete(entity);
    }

    public addEntity(entity: Entity){
        this.entities.add(entity);
    }

    public playerMove(keys: { up: boolean; down: boolean; left: boolean; right: boolean }){
        this.updateDeltaTime();
        this.collisionWithWall(this.player)
        this.playerMovement.move(keys)
        this.playerInRoom();
    }

    public playerAttack([x, y]: [number, number], equippedSlot: number): void {
        const mousePosition = new Vector3(x, 1, y);
        let currentItem = this.player.inventory.InventorySlots[equippedSlot].getItem
        if (currentItem instanceof Weapon) {

        }
    }

    public entityMove() {
        this.activeEntities.forEach((entity: Entity) => {
            if (this.checkCollision(entity).length !== 0) {return}
            if (entity instanceof Enemy) {
                if (this.collisionWithWall(entity)) {
                    return;
                }
                this.playerInRoom();
                this.updateDeltaTime();
                entity.update(this.player)
            }
        })
    }

    public generateWorld() {
        this.world.generateWorld();
    }

    private collisionWithWall(entity: Entity): boolean {
        let movement;
        if (entity instanceof Enemy) {
            movement = entity.movement;
        } else {
            movement = this.playerMovement;
        }

        let newPosition = movement.checkMovement(this.deltaTime);
        let point = new Point(newPosition);
        this.activeRooms.forEach((room: Room) => {
            room.getWalls.forEach((wall: Wall) => {
                const collision = new CollisionManager().checkCollision(point, wall.getHitbox);
                if (collision.collisionPoint !== null) {return false}
            })
        })
        return true;
    }

    private playerInRoom() {
        if (this.currentRoom.isWithinRoom(this.player)) {
            this.activeRooms = this.currentRoom.getNeighbors;
        } else {
            this.activeRooms.forEach((room: Room) => {
                if (room.isWithinRoom(this.player)) {
                    this.currentRoom = room;
                    this.activeRooms = this.currentRoom.getNeighbors;
                    this.activeRooms.add(this.currentRoom);
                }
            })
        }
        this.activateRooms();
        this.deactivateRooms();
        this.updateActiveEntities();
    }

    private activateRooms() {
        this.activeRooms.forEach((room: Room) => {
            room.isActive = true;
        })
    }

    private deactivateRooms() {
        this.world.getRooms.forEach((room: Room) => {
            if (!this.activeRooms.has(room)) {
                room.isActive = false;
            }
        })
    }

    private checkCollision(entity: Entity): Entity[] {
        let allActiveEntities = this.activeEntities;
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


    public updateActiveEntities() {
        this.activeRooms.forEach((room: Room) => {
            this.entities.forEach((entity: Entity) => {
                if (room.isWithinRoom(entity)) {
                    this.activeEntities.add(entity);
                } else {
                    this.activeEntities.delete(entity);
                }
            })
        })
    }

    public printWorld() {
        this.world.printWorld()
    }

    private updateDeltaTime(){
        this.deltaTime = performance.now() - this.lastFrameTime;
        this.lastFrameTime = performance.now();
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
const defaultAxis: [Vector3, Vector3, Vector3] = [
    new Vector3(1, 0, 0),
    new Vector3(0, 1, 0),
    new Vector3(0, 0, 1),
]

const playerHitbox = new OBB(
    defaultAxis,
    new Vector3(0.25, 1, 0.25),
)

const player = new Player(
    100,
    5,
    playerHitbox,
    9,
    new Vector3(0, 1, 0),
)

let gameManager: GameManager = new GameManager(player, 300);
gameManager.generateWorld();

gameManager.getWorld.getStructure('wall').forEach(wall => {
    wall.getCenter.toArray
    wall.getQuaternions
})

gameManager.printWorld();

export {GameManager}