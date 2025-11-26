import { Component } from "./Component.js";

import { vec3 } from "gl-matrix";

export class VelocityComponent extends Component {
  vec: vec3;

  constructor(x = 0, y = 0, z = 0) {
    super();
    this.vec = vec3.fromValues(x, y, z);
  }

  set(x: number, y: number, z: number) {
    vec3.set(this.vec, x, y, z);
  }

  add(dx: number, dy: number, dz: number) {
    vec3.add(this.vec, this.vec, vec3.fromValues(dx, dy, dz));
  }

  // Optionally: scale velocity
  scale(factor: number) {
    vec3.scale(this.vec, this.vec, factor);
  }
}
