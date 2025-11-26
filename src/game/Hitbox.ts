import { Component } from "./Component.js";
import { Transform } from "./Transform.js";
import { vec3 } from "gl-matrix";

export class Hitbox extends Component {
  size: vec3;

  constructor(size: vec3 = vec3.fromValues(1, 1, 1)) {
    super();
    this.size = size;
  }

  getWorldPosition(): vec3 {
    const transform = this.getComponent(Transform);
    if (!transform) throw new Error("Hitbox requires a Transform component");
    return transform.position;
  }

  getWorldSize(): vec3 {
    const transform = this.getComponent(Transform);
    if (!transform) throw new Error("Hitbox requires a Transform component");

    const scaled = vec3.create();
    vec3.multiply(scaled, this.size, transform.scale);
    return scaled;
  }
}
