import { ResizeSystem } from 'src/engine/systems/ResizeSystem.js';
import { UpdateSystem } from 'src/engine/systems/UpdateSystem.js';

import { GLTFLoader } from 'src/engine/loaders/GLTFLoader.js';

import {
    Camera,
    Model,
    Node,
    Transform,
} from 'src/engine/core.js';

import { Renderer } from './Renderer.js';
import { Light } from './Light.js';
import {initalize} from "./game/init/WorldBuilder.js";
import { PlayerController } from "./game/PlayerController.js";
import {GameManager} from "./game/GameManager.js";
import { player } from "./game/enteties.js";
import {OBBToMesh} from "./engine/loaders/OBBToMesh.js";
import {ShadowMapRenderer} from "./engine/renderers/ShadowMapRenderer.js";
import {LightManager} from "./LightManager.js";
import {KHRLightExtension} from "./gpu/object/KhronosLight.js";

let manager = new GameManager(player, 20);
manager.generateWorld();
let world = manager.getWorld;

const canvas = document.querySelector('canvas');
const renderer = new Renderer(canvas);
await renderer.initialize();

const shadowRenderer = new ShadowMapRenderer(canvas);
await shadowRenderer.initialize();
// const renderer = new UnlitRenderer(canvas);
// await renderer.initialize();

const gltfLoader = new GLTFLoader();
await gltfLoader.load('./assets/default/DefaultScene.gltf');

const scene = gltfLoader.loadScene(gltfLoader.defaultScene);
const playerNode = gltfLoader.loadNode("Player");
const playerArmatureNode = gltfLoader.loadNode("PlayerArmature");
playerNode.addComponent(new PlayerController(playerNode, playerArmatureNode, canvas, manager));

const camera = scene.find(node => node.getComponentOfType(Camera));
// camera.addComponent(new FirstPersonController(camera, canvas));

const light = new Node();
light.addComponent(new Light({
    // Should be 10, 10, 10 in final version as ambient color, since main lighting should be from torches
    color: [220, 200, 150],
    direction: [0.2, 1, 0.2],
}));
light.addComponent(new Transform({
    translation: [0, 10, 0],
}));
scene.addChild(light);

await initalize(scene, playerNode, world);

function update(time, dt) {
    manager.update();
    scene.traverse(node => {
        for (const component of node.components) {
            component.update?.(time, dt);
        }
    });
}

function render() {
    renderer.render(scene, camera);
    shadowRenderer.renderSceneLights(scene);
}

function resize({ displaySize: { width, height }}) {
    camera.getComponentOfType(Camera).aspect = width / height;
}

new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();
