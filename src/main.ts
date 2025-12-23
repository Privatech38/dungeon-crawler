// @ts-ignore
import {ResizeSystem} from './engine/systems/ResizeSystem.js';
// @ts-ignore
import {UpdateSystem} from './engine/systems/UpdateSystem.js';
// @ts-ignore
import {GLTFLoader} from './engine/loaders/GLTFLoader.js';

// @ts-ignore
import {Camera, Transform,} from "./engine/core.js";
import {Node} from "./engine/core/Node";
// @ts-ignore
import {Renderer} from './Renderer';
// @ts-ignore
import {Light} from './Light.js';
import {initalize} from "./game/init/WorldBuilder";
import {PlayerController} from "./game/PlayerController";
import {GameManager} from "./game/GameManager";
import {player} from "./game/enteties";
import {ShadowMapRenderer} from "./engine/renderers/ShadowMapRenderer";
import {KHRLightExtension, LightType} from "./gpu/object/KhronosLight";
// @ts-ignore
import {getGlobalModelMatrix} from "./engine/core/SceneUtils.js";
// @ts-ignore
import { vec3, mat4 } from 'glm';


let manager = new GameManager(player, 20);
manager.generateWorld();
let world = manager.getWorld;

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector('canvas');
const renderer = new Renderer(canvas);
await renderer.initialize();

export const shadowRenderer = new ShadowMapRenderer(canvas);
shadowRenderer.adapter = renderer.adapter;
shadowRenderer.device = renderer.device;
await shadowRenderer.initialize();
// const renderer = new UnlitRenderer(canvas);
// await renderer.initialize();

const gltfLoader = new GLTFLoader();
await gltfLoader.load('./assets/default/DefaultScene.gltf');

const scene: Node = gltfLoader.loadScene(gltfLoader.defaultScene);
const playerNode: Node = gltfLoader.loadNode("Player");
const playerArmatureNode: Node = gltfLoader.loadNode("PlayerArmature");
playerNode.addComponent(new PlayerController(playerNode, playerArmatureNode, canvas, manager));

// @ts-ignore
const camera: Node = scene.find((node: Node) => node.getComponentOfType(Camera));

await initalize(scene, playerNode, world);

function update(time: number, dt: number) {
    manager.update(dt);
    scene.traverse((node: Node) => {
        for (const component of node.components) {
            component.update?.(time, dt);
        }
    });
}

// Set cached light nodes
const lights = scene.filter((node: Node) => node.getComponentOfType(KHRLightExtension));
if (lights.length < 4) {
    let emptyLightNode: Node = new Node();
    emptyLightNode.addComponent(new KHRLightExtension({type: LightType.directional}));
    lights.fill(emptyLightNode, lights.length, 5);
}

const shadowData: { shadowMap: GPUTextureView; shadowMapView: GPUTextureView; lights: Node[] } = shadowRenderer.renderSceneLights(scene);

shadowData.lights.forEach((light: Node) => console.log(`Light at ${mat4.getTranslation(new vec3(), getGlobalModelMatrix(light))}`));
// Send the data to renderer
renderer.shadowData = shadowData;

function render() {
    renderer.render(scene, camera);
}

function resize({ displaySize: { width, height }}: { displaySize: { width: number; height: number } }) {
    camera.getComponentOfType(Camera).aspect = width / height;
}

new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();
