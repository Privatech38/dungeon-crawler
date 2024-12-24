import { Room } from "./Room";

class Map {
    private readonly rooms: Room[];
    private readonly maxSurfaceArea: number;
    private readonly mapWidth: number;
    private readonly mapHeight: number;
    private currentSurfaceArea: number;

    constructor(maxSurfaceArea: number = 16 * 16, mapWidth: number = 16, mapHeight: number = 16) {
        this.rooms = [];
        this.maxSurfaceArea = maxSurfaceArea;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;

    }

    private surfaceArea(room: Room) {
        this.currentSurfaceArea += room.getSurfaceArea
    }


}

