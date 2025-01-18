import { ResizeSystem } from 'engine/systems/ResizeSystem.js';
import { UpdateSystem } from 'engine/systems/UpdateSystem.js';

import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';

import { OrbitController } from 'engine/controllers/OrbitController.js';
import { createWall } from "./game/init/WorldBuilder.js";
import { createWallPillar } from "./game/init/WorldBuilder.js";

import {
    Camera,
    Model,
    Node,
    Transform,
} from 'engine/core.js';

import { Renderer } from './Renderer.js';
import { UnlitRenderer } from "./engine/renderers/UnlitRenderer.js";
import { Light } from './Light.js';
import { Room } from "./game/map/Room.js";
const canvas = document.querySelector('canvas');
const renderer = new Renderer(canvas);
await renderer.initialize();
// const renderer = new UnlitRenderer(canvas);
// await renderer.initialize();

const gltfLoader = new GLTFLoader();
await gltfLoader.load('./assets/default/DefaultScene.gltf');

const scene = gltfLoader.loadScene(gltfLoader.defaultScene);

const camera = scene.find(node => node.getComponentOfType(Camera));
camera.addComponent(new OrbitController(camera, canvas));

const light = new Node();
light.addComponent(new Light({
    color: [255, 184, 92],
    direction: [0, 0, 1],
}));
light.addComponent(new Transform({
    translation: [1, 2, 1],
}));
scene.addChild(light);

let room = new Room();
room.generateNewRoom()

room.getWalls.forEach(wall => {
    createWall(new Transform({
        translation: wall.getCenter.toArray,
        rotation: wall.getQuaternions,
    }), scene);
});

room.getPillars.forEach(pillar => {
    createWallPillar(new Transform({
        translation: pillar.getCenter.toArray,
    }), scene);
})


function update(time, dt) {
    scene.traverse(node => {
        for (const component of node.components) {
            component.update?.(time, dt);
        }
    });
}

function render() {
    renderer.render(scene, camera);
}

function resize({ displaySize: { width, height }}) {
    camera.getComponentOfType(Camera).aspect = width / height;
}

new ResizeSystem({ canvas, resize }).start();
new UpdateSystem({ update, render }).start();
