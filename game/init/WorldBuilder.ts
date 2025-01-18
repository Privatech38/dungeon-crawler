import {
    Camera,
    Model,
    Node,
    Transform,
    // @ts-ignore
} from '../../engine/core.js';
// @ts-ignore
import { GLTFLoader } from '../../engine/loaders/GLTFLoader.js';

/**
 * Creates a camera located at (0,0,0).
 * @returns {Node} The camera node.
 */
export function createCamera(): Node {
    const camera = new Node();
    camera.addComponent(new Camera());
    return camera;
}

/**
 * Creates a wall at the specified location.
 * @param location the location of the wall
 * @param scene the scene to which the wall will be added
 */
export async function createWall(location: Transform, scene: Node): Promise<void> {
    const wallLoader = new GLTFLoader();
    await wallLoader.load('../../assets/models/rooms/walls/Wall/Wall.gltf');
    const wall: Node = wallLoader.loadNode('Wall');
    wall.isStatic = true;
    wall.addComponent(location);
    scene.addChild(wall);
    const lowerWallLoader = new GLTFLoader();
    await lowerWallLoader.load('../../assets/models/rooms/walls/LowerWall/LowerWall.gltf');
    const lowerWall: Node = lowerWallLoader.loadNode('LowerWall');
    lowerWall.isStatic = true;
    lowerWall.addComponent(location);
    scene.addChild(lowerWall);
}

/**
 * Creates a wall pillar at the specified location.
 * @param {Transform} location the location of the wall pillar
 * @param {Node} scene the scene to which the wall pillar will be added
 * @param {Transform} torchTransform the rotation of the torch on the wall pillar, pass null if you don't want a torch
 */
export async function createWallPillar(location: Transform, scene: Node, torchTransform: Transform = null): Promise<void> {
    const wallPillarLoader = new GLTFLoader();
    await wallPillarLoader.load('../../assets/models/rooms/walls/WallPillar/WallPillar.gltf');
    const wallPillar: Node = wallPillarLoader.loadNode('WallPole');
    wallPillar.isStatic = true;
    wallPillar.addComponent(location);
    scene.addChild(wallPillar);
    if (torchTransform) {
        const torchLoader = new GLTFLoader();
        await torchLoader.load('../../assets/models/rooms/walls/Torch/Torch.gltf');
        const torch: Node = torchLoader.loadNode('Torch');
        torch.isStatic = true;
        torch.addComponent(torchTransform);
        wallPillar.addChild(torch);
    }
}

/**
 * Creates a floor at the specified location.
 * @param {Transform} location the location of the floor
 * @param {Node} scene the scene to which the floor will be added
 */
export async function createFloor(location: Transform, scene: Node): Promise<void> {
    const floorLoader = new GLTFLoader();
    await floorLoader.load('../../assets/models/rooms/floor/Floor.gltf');
    const floor: Node = floorLoader.loadNode('Floor');
    floor.isStatic = true;
    floor.addComponent(location);
    scene.addChild(floor);
}