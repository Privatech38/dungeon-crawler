import { Component } from "./Component.js";

import { vec3 } from "gl-matrix";

export class Hitbox extends Component {
  size: vec3;
  offset: vec3 = [0,0,0];

  constructor(size: vec3) {
    super();
    this.size = size;
  }
}