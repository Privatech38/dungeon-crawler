import {
    Camera,
    Model,
    Node,
    Transform,
    // @ts-ignore
} from '../../engine/core.js';
// @ts-ignore
// noinspection ES6PreferShortImport
import { GLTFLoader } from '../../engine/loaders/GLTFLoader.js';
import {World} from "../map/World.js";
// @ts-ignore
import { vec3 } from 'glm';

const cache = new Map<string, Node>();


export async function initialize(scene: Node, playerNode: Node, world: World): Promise<void> {
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

    for (const enemy of world.getEnemies()) {
        await createEnemy(new Transform({
            translation: enemy.getPosition.toArray,
            rotation: [0, 0, 0, 1]
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
    const path: string = 'assets/models/rooms/walls/Wall/Wall.gltf';
    if (!cache.has(path)) {
        const wallLoader = new GLTFLoader();
        await wallLoader.load(path);
        const wall: Node = wallLoader.loadNode('Wall');
        cache.set(path, wall);
    }

    const wallClone: Node = cache.get(path).clone();

    wallClone.isStatic = true;
    wallClone.addComponent(location);
    scene.addChild(wallClone);
}


/**
 * Creates a lower wall at the specified location.
 * @param location the location of the lower wall
 * @param scene the scene to which the lower wall will be added
 */
export async function createLowerWall(location: Transform, scene: Node): Promise<void> {
    const path: string = 'assets/models/rooms/walls/LowerWall/LowerWall.gltf';
    if (!cache.has(path)) {
        const lowerWallLoader = new GLTFLoader();
        await lowerWallLoader.load(path);
        const lowerWall: Node = lowerWallLoader.loadNode('LowerWall');
        cache.set(path, lowerWall);
    }

    const lowerWallClone = cache.get(path).clone();

    lowerWallClone.isStatic = true;
    lowerWallClone.addComponent(location);
    scene.addChild(lowerWallClone);
}


/**
 * Creates a wall pillar at the specified location.
 * @param {Transform} location the location of the wall pillar
 * @param {Node} scene the scene to which the wall pillar will be added
 * @param {Transform} torchTransform the rotation of the torch on the wall pillar, pass null if you don't want a torch
 */
export async function createWallPillar(location: Transform, scene: Node, torchTransform: Transform = null): Promise<void> {
    const path: string = 'assets/models/rooms/walls/WallPillar/WallPillar.gltf'
    if (!cache.has(path)) {
        const wallPillarLoader = new GLTFLoader();
        await wallPillarLoader.load(path);
        const wallPillar: Node = wallPillarLoader.loadNode('WallPole');
        cache.set(path, wallPillar);
    }

    const wallPillarClone: Node = cache.get(path).clone();

    wallPillarClone.isStatic = true;
    wallPillarClone.addComponent(location);
    scene.addChild(wallPillarClone);

    if (torchTransform) {
        await createTorch(torchTransform, scene);
    }
}

/**
 * Creates a torch on a specified parent node.
 * @param location The location
 * @param scene The scene to add to
 */
export async function createTorch(location: Transform, scene: Node): Promise<void> {
    const path: string = 'assets/models/rooms/walls/Torch/Torch.gltf';
    if (!cache.has(path)) {
        const torchLoader = new GLTFLoader();
        await torchLoader.load(path);
        const torch: Node = torchLoader.loadNode('Torch');
        cache.set(path, torch);
    }

    const torchClone: Node = cache.get(path).clone();

    torchClone.isStatic = true;
    torchClone.addComponent(location);
    scene.addChild(torchClone);
}

/**
 * Creates a floor at the specified location.
 * @param {Transform} location the location of the floor
 * @param {Node} scene the scene to which the floor will be added
 */
export async function createFloor(location: Transform, scene: Node): Promise<void> {
    const path: string = 'assets/models/rooms/floor/Floor.gltf';
    if (!cache.has(path)) {
        const floorLoader = new GLTFLoader();
        await floorLoader.load(path);
        const floor: Node = floorLoader.loadNode('Floor');
        cache.set(path, floor);
    }

    const floorClone: Node = cache.get(path).clone();

    floorClone.isStatic = true;
    floorClone.addComponent(location);
    scene.addChild(floorClone);
}


/**
 * Creates a door at the specified location.
 * @param {Transform} location the location of the door
 * @param {Node} scene the scene to which the door will be added
 */
export async function createDoor(location: Transform, scene: Node): Promise<void> {
    const path: string = 'assets/models/rooms/walls/WallDoor/WallDoor.gltf';
    if (!cache.has(path)) {
        const doorLoader = new GLTFLoader();
        await doorLoader.load(path);
        const door = doorLoader.loadNode('DoorWallUpper');
        cache.set(path, door);
    }

    const doorClone = cache.get(path).clone();

    doorClone.isStatic = true;
    doorClone.addComponent(location);
    scene.addChild(doorClone);
}

/**
 * Creates an enemy at the specified location.
 * @param {Transform} location the location of the enemy
 * @param {Node} scene the scene to which the enemy will be added
 */
export async function createEnemy( location: Transform, scene: Node ): Promise<void> {
    const path: string = 'assets/models/characters/skeleton/skeleton.gltf';
    let enemy: Node;
    if (!cache.has(path)) {
        console.log("load enemy");
        const enemyLoader = new GLTFLoader();
        await enemyLoader.load(path);
        enemy = enemyLoader.loadNode("PlayerArmature.001");

        cache.set(path, enemy);
    }
    else {
        enemy = cache.get(path).clone();
    }

    enemy.isStatic = false;
    enemy.addComponent(location);
    scene.addChild(enemy);

    console.log("made enemy:", enemy, "at", location.translation);
}