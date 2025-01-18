import { Room } from "./Room.js";
import { MapGenerator } from "./MapGenerator.js";
import { Structure } from "./Structures/Structure.js";
import {Wall} from "./Structures/Wall.js";
import {Pillar} from "./Structures/Pillar.js";
import {Floor} from "./Structures/Floor.js";

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
    constructor(maxSurfaceArea: number = 10 * 10) {
        this.rooms = [];
        this.maxSurfaceArea = maxSurfaceArea;
        this.currentSurfaceArea = 0;
        this.mapGenerator = new MapGenerator(30);
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
     * @param {string} type - The type of structure to retrieve ("wall", "pillar", or other for floors).
     * @returns {Structure[]} An array of unique Structure instances of the specified type.
     */
    public getStructure(type: string): Wall[] | Pillar[] | Floor[] {
        const structures: Structure[] = [];

        this.rooms.forEach(room => {
            let currentStructures: Structure[];

            switch (type) {
                case "wall":
                    currentStructures = room.getWalls;
                    break;
                case "pillar":
                    currentStructures = room.getPillars;
                    break;
                default:
                    currentStructures = room.getFloors;
            }

            currentStructures.forEach(cur => {
                if (!this.isStructureDuplicate(structures, cur)) {
                    structures.push(cur);
                }
            });
        });
        return structures;
    }

    /**
     * Checks if a structure is a duplicate in the given array of structures.
     * @private
     * @param {Structure[]} structures - The array of structures to check against.
     * @param {Structure} structure - The structure to check for duplication.
     * @returns {boolean} True if the structure is a duplicate, otherwise false.
     */
    private isStructureDuplicate(structures: Structure[], structure: Structure): boolean {
        if (structures.length === 0) {
            return false;
        }

        for (const w of structures) {
            if (
                w.getCenter.toArray[0] === structure.getCenter.toArray[0] &&
                w.getCenter.toArray[2] === structure.getCenter.toArray[2]
            ) {
                return true;
            }
        }

        return false;
    }
}

export { World };
