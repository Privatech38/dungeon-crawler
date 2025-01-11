import { Room } from "./Room";

class Map {
    private readonly rooms: Room[];
    private readonly maxSurfaceArea: number;
    private currentSurfaceArea: number;

    constructor(maxSurfaceArea: number = 16 * 16) {
        this.rooms = [];
        this.maxSurfaceArea = maxSurfaceArea;
        this.currentSurfaceArea = 0;
    }

    private surfaceArea(room: Room) {
        this.currentSurfaceArea += room.getSurfaceArea
    }


}

