import { Room } from "./Room.js";
import { MapGenerator } from "./MapGenerator.js";
import {EnemyGenerator} from "./EnemyGenerator.js";
import { Structure } from "./Structures/Structure.js";
import {Wall} from "./Structures/Wall.js";
import {Pillar} from "./Structures/Pillar.js";
import {Floor} from "./Structures/Floor.js";
import {BottomWall} from "./Structures/BottomWall.js";
import {AddDoors} from "./AddDoors.js";
import { Enemy } from "game/entities/Enemy.js";
import { Vector3 } from "math/Vector.js";

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
    private readonly enemies: Enemy[];
    private readonly maxSurfaceArea: number;
    private currentSurfaceArea: number;
    private mapGenerator: MapGenerator;
    private enemyGenerator: EnemyGenerator;

    /**
     * Creates a new World instance.
     * @param {number} [maxSurfaceArea=100] - The maximum allowable surface area for the world (default: 10x10).
     */
    constructor(maxSurfaceArea: number = 100, playerPosition: Vector3) {
        this.rooms = [];
        this.enemies = [];
        this.maxSurfaceArea = maxSurfaceArea;
        this.currentSurfaceArea = 0;
        this.mapGenerator = new MapGenerator((maxSurfaceArea/10) * 3);
        this.enemyGenerator = new EnemyGenerator((maxSurfaceArea/5), playerPosition);
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

                // n % chance to make enemy in current room
                if (this.enemyGenerator.shouldEnemySpawn(room)) {
                    const enemy = this.enemyGenerator.makeEnemy(room);
                    this.enemies.push(enemy);
                }
            }
        }

        new AddDoors(this).addDoorsAll();
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

    public getWalls(): Wall[] {
        function isTheSame(walls: Wall[], wall: Wall): boolean {
            for (const w of walls) {
                if (w.getCenter.equals(wall.getCenter)) {return true}
            }
            return false;
        }

        let uniqueWall: Wall[] = [];

        this.rooms.forEach((room: Room) => {
            room.getWalls.forEach((wall: Wall) => {
                if (!isTheSame(uniqueWall, wall)) {
                    uniqueWall.push(wall);
                }
            })
        })
        return uniqueWall;
    }

    public getBottomWalls(): BottomWall[] {
        function isTheSame(bottomWalls: BottomWall[], bottomWall: BottomWall): boolean {
            for (const w of bottomWalls) {
                if (w.getCenter.equals(bottomWall.getCenter)) {return true}
            }
            return false;
        }

        let uniqueBottomWall: BottomWall[] = [];

        this.rooms.forEach((room: Room) => {
            room.getBottomWalls.forEach((bottomWall: BottomWall) => {
                if (!isTheSame(uniqueBottomWall, bottomWall)) {
                    uniqueBottomWall.push(bottomWall);
                }
            })
        })
        return uniqueBottomWall;
    }

    public getFloors(): Floor[] {
        function isTheSame(Floors: Floor[], Floor: Floor): boolean {
            for (const w of Floors) {
                if (w.getCenter.equals(Floor.getCenter)) {return true}
            }
            return false;
        }

        let uniqueFloor: Floor[] = [];

        this.rooms.forEach((room: Room) => {
            room.getFloors.forEach((floor: Floor) => {
                if (!isTheSame(uniqueFloor, floor)) {
                    uniqueFloor.push(floor);
                }
            })
        })
        return uniqueFloor;
    }

    public getPillars(): Pillar[] {
        function isTheSame(Pillars: Pillar[], Pillar: Pillar): boolean {
            for (const w of Pillars) {
                if (w.getCenter.equals(Pillar.getCenter)) {return true}
            }
            return false;
        }

        let uniquePillar: Pillar[] = [];

        this.rooms.forEach((room: Room) => {
            room.getPillars.forEach((pillar: Pillar) => {
                if (!isTheSame(uniquePillar, pillar)) {
                    uniquePillar.push(pillar);
                }
            })
        })
        return uniquePillar;
    }

    public getEnemies(): Enemy[] {
        return this.enemies;
    }

    get getGrid(): number[][] {
        return this.mapGenerator.getMap;
    }
}
export { World };
