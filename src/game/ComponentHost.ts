import { Component } from "./Component.js";

export abstract class ComponentHost {
  components: Component[] = [];

  addComponent<C extends Component>(comp: C): C {
    comp.owner = this;
    this.components.push(comp);
    return comp;
  }

  getComponent<T extends Component>(type: new (...args: any[]) => T): T | undefined {
    return this.components.find(c => c instanceof type) as T | undefined;
  }
}
