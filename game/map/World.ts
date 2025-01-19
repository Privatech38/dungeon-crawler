import { Room } from "./Room.js";
import { MapGenerator } from "./MapGenerator.js";
import { Structure } from "./Structures/Structure.js";
import {Wall} from "./Structures/Wall.js";
import {Pillar} from "./Structures/Pillar.js";
import {Floor} from "./Structures/Floor.js";
import {BottomWall} from "./Structures/BottomWall.js";

/**
 * Represents a World composed of Rooms, with a maximum allowable surface area.
 * Handles room generation, structure retrieval, and map visualization.
 */
class World {
    /**
     * @private {Room[]} rooms - The collection of rooms in the world.
     * @private {number} maxSurfaceArea - The maximum allowable surface area for the world.
     * @private {number} currentSurfaceArea - The current total surface area of all rooms.
     * @private {MapGenerator} mapGenerator - Instance of MapGenerator used for generating and placing rooms.
     */
    private readonly rooms: Room[];
    private readonly maxSurfaceArea: number;
    private currentSurfaceArea: number;
    private mapGenerator: MapGenerator;

    /**
     * Creates a new World instance.
     * @param {number} [maxSurfaceArea=100] - The maximum allowable surface area for the world (default: 10x10).
     */
    constructor(maxSurfaceArea: number = 100) {
        this.rooms = [];
        this.maxSurfaceArea = maxSurfaceArea;
        this.currentSurfaceArea = 0;
        this.mapGenerator = new MapGenerator((maxSurfaceArea/10) * 3);
    }

    /**
     * Adds the surface area of a given room to the current total.
     * @private
     * @param {Room} room - The room whose surface area will be added.
     */
    private surfaceArea(room: Room) {
        this.currentSurfaceArea += room.getSurfaceArea;
    }

    /**
     * Generates the world by adding rooms until the maximum surface area is reached.
     */
    public generateWorld() {
        while (this.currentSurfaceArea < this.maxSurfaceArea) {
            const room = new Room();
            const placed = this.mapGenerator.addRoom(room);

            if (placed) {
                this.rooms.push(this.mapGenerator.getLastRoom);
                this.surfaceArea(room);
            }
        }
    }

    /**
     * Prints the map of the world using the MapGenerator instance.
     */
    public printWorld() {
        this.mapGenerator.printMap();
    }

    /**
     * Gets the list of rooms in the world.
     * @returns {Room[]} The array of Room instances in the world.
     */
    get getRooms(): Room[] {
        return this.rooms;
    }

    /**
     * Retrieves structures of a specific type (e.g., walls, pillars, floors) from all rooms.
     * Ensures no duplicate structures are included.
     * @param {string} type - The type of structure to retrieve ("wall", "pillar", "floor", "bottomWall").
     * @returns {Structure[]} An array of unique Structure instances of the specified type.
     */
    public getStructure(type: "wall" | "bottomWall" | "floor" | "pillar"): Wall[] | Pillar[] | Floor[] | BottomWall[] {
        switch (type) {
            case "wall": return this.collectUniqueStructures<Wall>("getWalls");
            case "pillar": return this.collectUniqueStructures<Pillar>("getPillars");
            case "floor": return this.collectUniqueStructures<Floor>("getFloors");
            case "bottomWall": return this.collectUniqueStructures<BottomWall>("getBottomWalls");
        }
    }

    /**
     * Collects unique structures of a specific type from all rooms.
     * @template T The type of structure to collect (must extend Structure).
     * @param {string} roomMethod - The method name to call on each room (e.g., "getWalls").
     * @returns {T[]} An array of unique structures.
     */
    private collectUniqueStructures<T extends Structure>(roomMethod: keyof Room): T[] {
        const uniqueStructures: T[] = [];
        this.rooms.forEach((room: Room) => {
            const structures = room[roomMethod];
            if (Array.isArray(structures)) {
                structures.forEach((structure) => {
                    if (this.isStructureDuplicate(uniqueStructures, structure as T)) {
                        uniqueStructures.push(structure as T);
                    }
                });
            }
        });
        return uniqueStructures;
    }

    /**
     * Checks if a structure is already included in the list based on its center (x, z).
     * @template T The type of structure to check.
     * @param {T[]} collection - The list of structures.
     * @param {T} structure - The structure to check for duplication.
     * @returns {boolean} True if the structure is already in the list, false otherwise.
     */
    private isStructureDuplicate<T extends Structure>(collection: T[], structure: T): boolean {
        collection.forEach((existingStructure) => {
            const existingCenter = existingStructure.getCenter;
            const structureCenter = structure.getCenter;
            if (existingCenter.x === structureCenter.x && existingCenter.z === structureCenter.z) {
                return false;
            }
        })
        return true;
    }
}

export { World };
