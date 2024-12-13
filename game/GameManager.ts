import {Entity} from "./entities/Entity";


class GameManager {
    entities: Entity[];

    constructor() {
        this.entities = [];
    }

    addEntity(entity: Entity){
        this.entities.push(entity);
    }

    getEntities(): Entity[] {
        return this.entities;
    }

}

export {GameManager}