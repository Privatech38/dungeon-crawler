import { ComponentHost } from "./ComponentHost.js";

export abstract class Component {
  owner!: ComponentHost;
  
  getComponent<T extends Component>(type: new (...args: any[]) => T): T | undefined {
    return this.owner.components.find(c => c instanceof type) as T | undefined;
  }
}
