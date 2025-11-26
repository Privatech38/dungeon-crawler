import { ComponentHost } from "./ComponentHost.js";
import { Transform } from "./Transform.js";

export class Structure extends ComponentHost {
  type: string;

  constructor(type: string) {
    super();
    this.type = type;
  }
}
