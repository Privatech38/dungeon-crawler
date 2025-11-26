import { World } from "./World.js";
import { GameMap } from "./GameMap.js";
import { Room } from "./Room.js";
import { Structure } from "./Structure.js";
import { VelocityComponent } from "./VelocityComponent.js";
import { Entity } from "./Entity.js";
import { Transform } from "./Transform.js";
import { MovementSystem } from "./MovmentSystem.js";
import { Hitbox } from "./Hitbox.js";

import { vec3 } from "gl-matrix";

const world = new World();
const map = new GameMap();
world.setMap(map);

// Create rooms
const room1 = map.addRoom(new Room("Room1"));
const room2 = map.addRoom(new Room("Room2"));

// Add structures to rooms
const wall1 = room1.addStructure(new Structure("Wall"));
wall1.addComponent(new Hitbox(vec3.fromValues(4, 2, 0.5)));

const wall2 = room2.addStructure(new Structure("Wall"));
wall2.addComponent(new Hitbox(vec3.fromValues(4, 2, 0.5)));

// Add an entity
const player = new Entity("Player");
player.addComponent(new Transform());
player.addComponent(new VelocityComponent(1, 0, 0));
world.addEntity(player);

// Add movement system
world.addSystem(new MovementSystem());

// Simulate
console.log("Before:", player.getComponent(Transform)?.position);
world.update(1.0);
console.log("After 1s:", player.getComponent(Transform)?.position);
