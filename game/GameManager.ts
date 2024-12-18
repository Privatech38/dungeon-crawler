import {Entity} from "./entities/Entity";


class GameManager {
    private entities: Set<Entity>;

    constructor() {
        this.entities = new Set<Entity>;
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

}

export {GameManager}