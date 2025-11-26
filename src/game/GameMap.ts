import { Room } from "./Room.js";

export class GameMap {
  rooms: Room[] = [];

  addRoom<T extends Room>(room: T): T {
    this.rooms.push(room);
    return room;
  }

  removeRoom(room: Room) {
    this.rooms = this.rooms.filter(r => r !== room);
  }
}
