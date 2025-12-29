import { Node } from "../core/Node.js";
import { AABB } from "../core/AABB.js";
// @ts-ignore
import { vec3 } from 'glm';
import { Torch } from "./Tourch.js";
import { Structure } from "./Structure.js";


export class Wall extends Structure {
    orientation: vec3;
    constructor(boundingBox: AABB, orientation: vec3) {
        super(boundingBox.getCenter(), boundingBox);
        this.orientation = orientation;
    }
}
