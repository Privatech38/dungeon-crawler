import { Component } from "./Component.js";

import { vec3, quat } from "gl-matrix";

export class Transform extends Component {
    position: vec3;
    rotation: quat;
    scale: vec3;

    constructor(
        position?: vec3,
        rotation?: quat,
        scale?: vec3
    ) {
        super();
        this.position = position ?? vec3.create();          // default [0,0,0]
        this.rotation = rotation ?? quat.create();          // identity quaternion
        this.scale = scale ?? vec3.fromValues(1,1,1);       // default [1,1,1]
    }
}