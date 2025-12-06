import {KHRLightExtension} from "./gpu/object/KhronosLight.js";

export class LightManager {
    lights;

    constructor() {
        this.lights = new Set();
    }

    addLight(light) {
        this.lights.add(light);
    }

    addLightsFromNode(node) {
        for (const child of node.children) {
            this.addLightsFromNode(child);
        }
    }
}