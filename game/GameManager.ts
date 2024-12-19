import {Entity} from "./entities/Entity";
import {Player} from "./entities/Player";
import {PlayerMovement} from "./entities/PlayerMovement";


class GameManager {
    private entities: Set<Entity>;
    private deltaTime: number;
    private lastFrameTime: number;
    private player: Player;
    private playerMovement: PlayerMovement;

    constructor(player: Player) {
        this.entities = new Set<Entity>;
        this.player = player;
        this.deltaTime = 0;
        this.lastFrameTime = Date.now();
        this.playerMovement = new PlayerMovement(this.player.getInitialPosition, this.player.getSpeed);
    }

    public addEntity(entity: Entity){
        this.entities.add(entity);
    }

    public removeEntity(entity: Entity){
        this.entities.delete(entity);
    }

    public getEntities(): Set<Entity> {
        return this.entities;
    }

    private updateDeltaTime(){
        this.deltaTime = Date.now() - this.lastFrameTime;
        this.lastFrameTime = Date.now();
    }

    public playerMove(keys: { up: boolean; down: boolean; left: boolean; right: boolean }){
        this.updateDeltaTime();
        this.playerMovement.move(keys, this.deltaTime)
        this.player.setPosition(this.playerMovement)
    }

}

export {GameManager}