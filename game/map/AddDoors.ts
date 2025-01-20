import {Room} from "./Room.js";
import {World} from "./World.js";

class AddDoors {
    private world: World;
    private readonly rooms: Room[] = [];

    constructor(world: World) {
        this.world = world;
        this.rooms = world.getRooms;
    }

    public addDoorsAll() {
        this.world.printWorld()
        this.rooms.forEach(room1 => {
            this.rooms.forEach(room2 => {
                if (room1 !== room2) {
                    let neighbours = this.alreadyNeighbors(room1, room2);
                    if (!neighbours) {
                        let added = false;
                        room1.getWalls.forEach((wall1) => {
                            room2.getWalls.forEach((wall2) => {
                                if (wall1.getCenter.equals(wall2.getCenter) && !added) {
                                    wall1.isDoor = true;
                                    wall2.isDoor = true;
                                    room1.newNeighbor(room2);
                                    room2.newNeighbor(room1);
                                    added = true;
                                }
                            })
                        })
                    }
                }
            })
        })
    }

    // check if they are neighbors
    private alreadyNeighbors(room: Room, neighbor: Room): boolean {
        for (const cur of room.getNeighbors) {
            console.log(cur.getID, neighbor.getID);
            if (cur.getID === neighbor.getID) {return true;}
        }
        return false;
    }
}

export {AddDoors}