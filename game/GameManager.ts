import {Entity} from "./entities/Entity";
import {Player} from "./entities/Player";
import {PlayerMovement} from "./entities/PlayerMovement";
import { World } from "./map/World";
import {Room} from "./map/Room";
import {CollisionManager} from "./entities/hitboxes/Collision";
import {Enemy} from "./entities/Enemy";
import {Point} from "./entities/hitboxes/Point";
import {Wall} from "./map/Wall";


class GameManager {
    private entities: Set<Entity>;
    private player: Player;
    private playerMovement: PlayerMovement;
    private activeEntities: Set<Entity>;
    private activeRooms: Set<Room>;

    private deltaTime: number;
    private lastFrameTime: number;
    private readonly world: World;

    private currentRoom: Room;

    constructor(player: Player) {
        this.player = player;
        this.deltaTime = 0;
        this.entities = new Set<Entity>;
        this.lastFrameTime = performance.now();
        this.playerMovement = new PlayerMovement(this.player.getInitialPosition, this.player.getSpeed);
        this.world = new World();
        this.activeEntities = new Set<Entity>();
        this.currentRoom = this.world.getRooms[0]; //starting room
        this.activeRooms = this.currentRoom.getNeighbors;
        this.activeRooms.add(this.currentRoom);
    }

    public removeEntity(entity: Entity){
        this.entities.delete(entity);
    }

    public addEntity(entity: Entity){
        this.entities.add(entity);
    }

    public generateWorld() {
        this.world.generateWorld();
    }

    public playerMove(keys: { up: boolean; down: boolean; left: boolean; right: boolean }){
        this.updateDeltaTime();
        this.collisionWithWall(this.player)
        this.playerMovement.move(keys, this.deltaTime)
        this.playerInRoom();
    }

    public entetyMove() {
        this.activeEntities.forEach((entity: Entity) => {
            if (this.checkCollision(entity).length !== 0) {return}
            if (entity instanceof Enemy) {
                if (this.collisionWithWall(entity)) {
                    return;
                }
                this.playerInRoom();
                this.updateDeltaTime();
                entity.moveTowordsPlayer(this.player);
            }
        })
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

export {GameManager}