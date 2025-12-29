import { AABB } from "engine/core/AABB";
import { vec3 } from 'glm';

export class Structure extends Node {
    boundingBox?: AABB;
    center: vec3;
    constructor(center: vec3, boundingBox?: AABB) {
        super();
        this.boundingBox = boundingBox;
        this.center = center;
    }

    addChild(child: Node): void {
        this.addChild(child);
    }

    addComponent(component: any): void {
        this.addChild(component);
    }
}
