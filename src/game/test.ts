import { World } from "./World.js";
import { GameMap } from "./GameMap.js";
import { Room } from "./Room.js";
import { Structure } from "./Structure.js";
import { VelocityComponent } from "./VelocityComponent.js";
import { Entity } from "./Entity.js";
import { Transform } from "./Transform.js";
import { MovementSystem } from "./MovmentSystem.js";
import { Hitbox } from "./Hitbox.js";

import { quat, vec3 } from "gl-matrix";

const world = new World();
const map = new GameMap();
world.setMap(map);

// Create rooms
const room1 = map.addRoom(new Room("Room1"));

// create rotation quat
const rotation90 = quat.create();

// roatate around Y exis for 90deg
quat.setAxisAngle(rotation90, [0, 1, 0], Math.PI/2);

// create structure wall
const wall = room1.addStructure(new Structure("wall1"));
const wall2 = room1.addStructure(new Structure("wall2"));

// add hitbox to wall
wall.addComponent(new Hitbox([5, 0.2, 2.2]));
wall2.addComponent(new Hitbox([5, 0.2, 2.2]));

// set wall position and rotation
wall.addComponent(new Transform({translation: [3, 3, 3], rotation: rotation90}));

console.log(room1.structures)

// Add an entity
const player = new Entity("Player");
player.addComponent(new Transform());

// add hitbox
player.addComponent(new Hitbox(vec3.fromValues(0.5, 0.5, 2)))

// set his movment
player.addComponent(new VelocityComponent(1, 0, 0));
world.addEntity(player);

// Add movement system
world.addSystem(new MovementSystem());

// Simulate
console.log("Before:", player.getComponent(Transform)?.translation, player.getComponent(Hitbox)?.getWorldPosition());
world.update(1.0);

console.log("After 1s:", player.getComponent(Transform)?.translation, player.getComponent(Hitbox)?.getWorldPosition());

// change players movment
player.getComponent(VelocityComponent)?.set(1, 3, 0);

world.update(1.0);
console.log("After 2s:", player.getComponent(Transform)?.translation, player.getComponent(Hitbox)?.getWorldPosition());