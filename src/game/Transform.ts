import { Component } from "./Component.js";

import { vec3, quat } from "gl-matrix";

export class Transform extends Component {
  position: vec3 = [0,0,0];
  rotation: quat = quat.create();
  scale: vec3 = [1,1,1];
}
