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
        if (node.getComponentOfType(KHRLightExtension)) {
            this.addLight(node);
        }
        for (let child of node.children) {
            this.addLightsFromNode(child);
        }
    }
}