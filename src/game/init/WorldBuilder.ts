import {
    Camera,
    Model,
    Node,
    Transform,
    // @ts-ignore
} from '../../engine/core.js';
// @ts-ignore
import { GLTFLoader } from '../../engine/loaders/GLTFLoader.js';
import {World} from "../map/World.js";
// @ts-ignore
import { vec3 } from 'glm';


export async function initalize(scene: Node, playerNode: Node, world: World): Promise<void> {
    // Create the world
    await buildWorld(scene, world);
    const transform = playerNode.getComponentOfType(Transform);
    vec3.add(transform.translation, transform.translation, [1.5, 0, 1.5]);
}

async function buildWorld(scene: Node, world: World): Promise<void> {
    for (const wall of world.getWalls()) {
        if (wall.isDoor) {
            await createDoor(new Transform({
                translation: wall.getCenter.toArray,
                rotation: wall.getQuaternions,
            }), scene);
        } else {
            await createWall(new Transform({
                translation: wall.getCenter.toArray,
                rotation: wall.getQuaternions,
            }), scene);
        }
    }

    for (const bottomWall of world.getBottomWalls()) {
        if (!bottomWall.isDoor) {
            await createLowerWall(new Transform({
                translation: bottomWall.getCenter.toArray,
                rotation: bottomWall.getQuaternions,
            }), scene);
        }
    }

    for (const pillar of world.getPillars()) {
        let transform = new Transform({
            translation: pillar.getCenter.toArray,
            rotation: pillar.getQuaternions,
        });
        let translation = pillar.getCenter.toArray;
        translation[1] = -0.4;
        let torchTransform = new Transform({
            translation: translation
        })
        await createWallPillar(transform, scene, pillar.getIsCorner ? undefined : torchTransform);
    }

    for (const floor of world.getFloors()) {
        await createFloor(new Transform({
            translation: floor.getCenter.toArray,
            rotation: floor.getQuaternions,
        }), scene);
    }
}

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
    await wallLoader.load('assets/models/rooms/walls/Wall/Wall.gltf');
    const wall: Node = wallLoader.loadNode('Wall');
    wall.isStatic = true;
    wall.addComponent(location);
    scene.addChild(wall);
}


/**
 * Creates a lower wall at the specified location.
 * @param location the location of the lower wall
 * @param scene the scene to which the lower wall will be added
 */
export async function createLowerWall(location: Transform, scene: Node): Promise<void> {
    const lowerWallLoader = new GLTFLoader();
    await lowerWallLoader.load('assets/models/rooms/walls/LowerWall/LowerWall.gltf');
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
    await wallPillarLoader.load('assets/models/rooms/walls/WallPillar/WallPillar.gltf');
    const wallPillar: Node = wallPillarLoader.loadNode('WallPole');
    wallPillar.isStatic = true;
    wallPillar.addComponent(location);
    scene.addChild(wallPillar);
    if (torchTransform) {
        const torchLoader = new GLTFLoader();
        await torchLoader.load('assets/models/rooms/walls/Torch/Torch.gltf');
        const torch: Node = torchLoader.loadNode('Torch');
        torch.isStatic = true;
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
    await floorLoader.load('assets/models/rooms/floor/Floor.gltf');
    const floor: Node = floorLoader.loadNode('Floor');
    floor.isStatic = true;
    floor.addComponent(location);
    scene.addChild(floor);
}


/**
 * Creates a door at the specified location.
 * @param {Transform} location the location of the door
 * @param {Node} scene the scene to which the door will be added
 */
export async function createDoor(location: Transform, scene: Node): Promise<void> {
    const doorLoader = new GLTFLoader();
    await doorLoader.load('assets/models/rooms/walls/WallDoor/WallDoor.gltf');
    const door: Node = doorLoader.loadNode('DoorWallUpper');
    door.isStatic = true;
    door.addComponent(location);
    scene.addChild(door);
}