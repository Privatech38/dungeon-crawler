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
function createCamera(): Node {
    const camera = new Node();
    camera.addComponent(new Camera());
    return camera;
}

/**
 * Creates a wall at the specified location.
 * @param location the location of the wall
 * @param scene the scene to which the wall will be added
 */
async function createWall(location: Transform, scene: Node): Promise<void> {
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