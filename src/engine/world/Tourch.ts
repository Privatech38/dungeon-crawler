import { vec3 } from 'glm';

export class Torch {
    position: vec3;
    orientation: vec3;
    constructor(position: vec3, orientation: vec3) {
        this.position = position;
        this.orientation = orientation;
    }
}
