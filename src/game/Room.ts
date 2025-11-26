import { ComponentHost } from "./ComponentHost.js";
import { Structure } from "./Structure.js";

export class Room extends ComponentHost {
  name: string;
  structures: Structure[] = [];

  constructor(name: string) {
    super();
    this.name = name;
  }

  addStructure<T extends Structure>(structure: T): T {
    this.structures.push(structure);
    return structure;
  }

  removeStructure(structure: Structure) {
    this.structures = this.structures.filter(s => s !== structure);
  }
}