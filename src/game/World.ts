import { Entity } from "./Entity.js";
import { GameMap } from "./GameMap.js";

export class World {
  map?: GameMap;
  entities: Entity[] = [];
  systems: any[] = [];

  setMap(map: GameMap) {
    this.map = map;
  }

  addEntity(e: Entity) { this.entities.push(e); }
  addSystem(system: any) { this.systems.push(system); }

  update(dt: number) {
    for (const system of this.systems) {
      if (system.update) system.update(this.entities, dt);
    }
  }
}