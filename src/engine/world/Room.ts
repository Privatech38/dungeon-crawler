import { Node } from "../core/Node.js";
import { AABB } from "../core/AABB.js";
import { vec3 } from 'glm';
import { Wall } from "./Wall.js";

export class Room extends Node {
    id: number;
    boundingBox: AABB;
    center: vec3;
    constructor(id: number, boundingBox: AABB) {
        super();
        this.id = id;
        this.boundingBox = boundingBox;
        this.center = this.boundingBox.getCenter();
    }

    isEntityInRoom(entity: AABB): boolean {
        return this.boundingBox.intersects(entity);
    }

    addStructure(structure: Structure): void {
        this.addChild(structure);
    }

}
