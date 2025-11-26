import { ComponentHost } from "./ComponentHost.js";
import { Structure } from "./Structure.js";

import { vec2 } from "gl-matrix";
export class Room extends ComponentHost {
  name: string;
  _structures: Structure[] = [];
  _size: vec2;

  constructor(name: string) {
    super();
    this.name = name;
    this._size = [0, 0];
  }

  addStructure<T extends Structure>(structure: T): T {
    this._structures.push(structure);
    return structure;
  }

  removeStructure(structure: Structure) {
    this._structures = this._structures.filter(s => s !== structure);
  }

  get structures(): Structure[]{
    return this._structures;
  }

  set size(size: vec2) {
    this._size = size;
  }

  get size(): vec2 {
    return this._size;
  }
}