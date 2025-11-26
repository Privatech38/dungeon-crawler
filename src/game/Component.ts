import { ComponentHost } from "./ComponentHost.js";

export abstract class Component {
  owner!: ComponentHost;
}
