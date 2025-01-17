import { Room } from "./Room.js";
import {MapGenerator2} from "./MapGenerator2.js";
import {Wall} from "./Wall.js";

class World {
    private readonly rooms: Room[];
    private readonly maxSurfaceArea: number;
    private currentSurfaceArea: number;
    private mapGenerator: MapGenerator2;

    constructor(maxSurfaceArea: number = 10 * 10) {
        this.rooms = [];
        this.maxSurfaceArea = maxSurfaceArea;
        this.currentSurfaceArea = 0;
        this.mapGenerator = new MapGenerator2(30);
    }

    private surfaceArea(room: Room) {
        this.currentSurfaceArea += room.getSurfaceArea
    }

    public generateWorld() {
        while (this.currentSurfaceArea < this.maxSurfaceArea) {
            let room = new Room();
            let placed = this.mapGenerator.addRoom(room);
            if (placed) {
                this.rooms.push(this.mapGenerator.getLastRoom);
                this.surfaceArea(room);
            }
        }
    }

    public printWorld() {
        this.mapGenerator.printMap();
    }

    get getRooms(): Room[] {
        return this.rooms;
    }
}

let world: World = new World(100);
world.generateWorld();
world.getRooms.forEach((room: Room) => {
    room.getWalls.forEach((wall: Wall) => {
        console.log(wall.getQuaternions, wall.getCenter.toArray)
    })
})

export { World };