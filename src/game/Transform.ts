import { mat4, vec3, quat } from "gl-matrix";
import { Component } from "./Component.js";

export class Transform extends Component {
  rotation: quat;
  translation: vec3;
  scale: vec3;

  constructor({
    rotation = quat.create(),
    translation = vec3.create(),
    scale = vec3.fromValues(1,1,1),
    matrix,
  }: {
    rotation?: quat;
    translation?: vec3;
    scale?: vec3;
    matrix?: mat4;
  } = {}) {
    super();
    this.rotation = rotation;
    this.translation = translation;
    this.scale = scale;
    if (matrix) this.matrix = matrix;
  }

  // Compose TRS into a matrix
  get matrix(): mat4 {
    return mat4.fromRotationTranslationScale(
      mat4.create(),
      this.rotation,
      this.translation,
      this.scale
    );
  }

  // Decompose a matrix back into TRS
  set matrix(m: mat4) {
    mat4.getRotation(this.rotation, m);
    mat4.getTranslation(this.translation, m);
    mat4.getScaling(this.scale, m);
    quat.normalize(this.rotation, this.rotation);
  }
}