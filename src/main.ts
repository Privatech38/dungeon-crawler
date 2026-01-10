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
import {initialize} from "./game/init/WorldBuilder";
import {PlayerController} from "./game/PlayerController";
import {GameManager} from "./game/GameManager";
import {player} from "./game/enteties";
import {ShadowMapRenderer} from "./engine/renderers/ShadowMapRenderer";

import {EnemyManager} from "./game/EnemyManager.js";
import {KHRLightExtension, LightType} from "./gpu/object/KhronosLight";
// @ts-ignore
import {getGlobalModelMatrix} from "./engine/core/SceneUtils.js";
// @ts-ignore
import { vec3, mat4 } from 'glm';

let gamePaused = false;
let gameOver = false;

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

const scene = gltfLoader.loadScene(gltfLoader.defaultScene);

let manager = new GameManager(player, 20);
await manager.generateWorld();
let world = manager.getWorld;

const enemyManager = new EnemyManager(world.getMaxSurfaceArea/5, player.getPosition, scene);
await enemyManager.init();
// generate enemies
await enemyManager.generateEnemies(world.getRooms, manager);

const playerNode = gltfLoader.loadNode("Player");
playerNode.setId("playerNode");
const playerArmatureNode = gltfLoader.loadNode("PlayerArmature");
playerArmatureNode.setId("playerArmatureNode");
playerNode.addComponent(new PlayerController(playerNode, playerArmatureNode, canvas, manager));

// @ts-ignore
const camera: Node = scene.find((node: Node) => node.getComponentOfType(Camera));

await initialize(scene, playerNode, world);

function update(time: number, dt: number) {
    if (gamePaused || gameOver) {

        return;
    }

    manager.update(dt);
    scene.traverse((node: Node) => {
        for (const component of node.components) {
            component.update?.(time, dt);
        }
    });

    if (player.isDead()) {
        showDeathMessage();
        gameOver = true;
    }
}

// Set cached light nodes
const lights = scene.filter((node: Node) => node.getComponentOfType(KHRLightExtension));
if (lights.length < 4) {
    let emptyLightNode: Node = new Node();
    emptyLightNode.addComponent(new KHRLightExtension({type: LightType.directional}));
    lights.fill(emptyLightNode, lights.length, 5);
}

const shadowData: { shadowMap: GPUTextureView; shadowMapView: GPUTextureView; lights: Node[] } = shadowRenderer.renderSceneLights(scene);

// Send the data to renderer
renderer.shadowData = shadowData;

function render() {
    renderer.render(scene, camera);
}

function resize({ displaySize: { width, height }}: { displaySize: { width: number; height: number } }) {
    camera.getComponentOfType(Camera).aspect = width / height;
}

function showDeathMessage(message = "YOU DIED") {
    const el = document.getElementById("death-screen");
    if (!el) return;

    el.textContent = message;
    el.style.display = "flex";
}

new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();
