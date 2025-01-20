import { ResizeSystem } from 'engine/systems/ResizeSystem.js';
import { UpdateSystem } from 'engine/systems/UpdateSystem.js';

import { GLTFLoader } from 'engine/loaders/GLTFLoader.js';

import { OrbitController } from 'engine/controllers/OrbitController.js';
import { createWall } from "./game/init/WorldBuilder.js";
import { createWallPillar } from "./game/init/WorldBuilder.js";
import { createFloor } from "./game/init/WorldBuilder.js";
import { createDoor } from "./game/init/WorldBuilder.js";

import {
    Camera,
    Model,
    Node,
    Transform,
} from 'engine/core.js';

import { Renderer } from './Renderer.js';
import { Light } from './Light.js';
import {World} from "./game/map/World.js";

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
    direction: [0, 1, 0],
}));
light.addComponent(new Transform({
    translation: [0, 10, 0],
}));
scene.addChild(light);

let world = new World(100);
world.generateWorld();

world.getWalls().forEach(wall => {
    if (wall.isDoor) {
        createDoor(new Transform({
            translation: wall.getCenter.toArray,
            rotation: wall.getQuaternions,
        }), scene);
    } else {
        createWall(new Transform({
            translation: wall.getCenter.toArray,
            rotation: wall.getQuaternions,
        }), scene);
    }
});

world.getPillars().forEach(pillar => {
    createWallPillar(new Transform({
        translation: pillar.getCenter.toArray,
        rotation: pillar.getQuaternions,
    }), scene);
});

world.getFloors().forEach(floor => {
    createFloor(new Transform({
        translation: floor.getCenter.toArray,
        rotation: floor.getQuaternions,
    }), scene);
});


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
