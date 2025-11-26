import { ComponentHost } from "./ComponentHost.js";
import { Transform } from "./Transform.js";

import {v4 as uuidv4} from 'uuid';

export class Entity extends ComponentHost {
  id: string;
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
    this.id = uuidv4();
    this.addComponent(new Transform());
  }
}
