import {Vector3} from "../../math/Vector.js";

class MapGenerator {
    private readonly mapGrid: number[][]; // The map grid
    private readonly roomCenters: [number, number][]; // To store the center of each room
    private roomId: number; // Unique identifier for each room
    private readonly mapWidth: number; // Width of the map
    private readonly mapHeight: number; // Height of the map
    private readonly roomsCoordinates: Array<Vector3>;
    private roomCount: number;

    /**
     * Creates an instance of MapGenerator.
     *
     * @param mapWidth - The width of the map grid.
     * @param mapHeight - The height of the map grid.
     */
    constructor(mapWidth: number, mapHeight: number) {
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.mapGrid = Array.from({ length: mapHeight }, () => Array(mapWidth).fill(0));
        this.roomCenters = [];
        this.roomId = 1;
        this.roomsCoordinates = new Array<Vector3>();
        this.roomCount = 0;
    }

    /**
     * Attempts to add a room to the map at a random position.
     * If the room cannot be placed after multiple attempts, it will not be added.
     *
     * @param roomWidth - The width of the room.
     * @param roomHeight - The height of the room.
     * @returns `true` if the room was successfully placed, `false` otherwise.
     */
    addRoom(roomWidth: number, roomHeight: number): boolean {
        let placed = false;

        for (let attempt = 0; attempt < 100; attempt++) {
            // Generate a random position for the top-left corner of the room
            const x = Math.floor(Math.random() * (this.mapWidth - roomWidth));
            const y = Math.floor(Math.random() * (this.mapHeight - roomHeight));

            // Check if the room can fit in this position
            let canPlace = true;
            for (let i = 0; i < roomHeight; i++) {
                for (let j = 0; j < roomWidth; j++) {
                    if (this.mapGrid[y + i][x + j] !== 0) {
                        canPlace = false;
                        break;
                    }
                }
                if (!canPlace) break;
            }

            if (canPlace) {
                this.roomsCoordinates.push(new Vector3(x, 0, y - roomHeight));
                this.roomCount++;

                // Place the room
                for (let i = 0; i < roomHeight; i++) {
                    for (let j = 0; j < roomWidth; j++) {
                        this.mapGrid[y + i][x + j] = this.roomId;
                    }
                }

                // Store the center of the room
                const centerX = x + Math.floor(roomWidth / 2);
                const centerY = y + Math.floor(roomHeight / 2);
                this.roomCenters.push([centerX, centerY]);

                this.roomId++;
                placed = true;

                // Connect the new room to the previous room with corridors if needed
                if (this.roomCenters.length > 1) {
                    const [prevCenterX, prevCenterY] = this.roomCenters[this.roomCenters.length - 2];

                    // Create horizontal corridor
                    if (prevCenterX < centerX) {
                        for (let corridorX = prevCenterX; corridorX <= centerX; corridorX++) {
                            if (this.mapGrid[prevCenterY][corridorX] === 0) {
                                this.mapGrid[prevCenterY][corridorX] = -1;
                            }
                        }
                    } else {
                        for (let corridorX = centerX; corridorX <= prevCenterX; corridorX++) {
                            if (this.mapGrid[prevCenterY][corridorX] === 0) {
                                this.mapGrid[prevCenterY][corridorX] = -1;
                            }
                        }
                    }

                    // Create vertical corridor
                    if (prevCenterY < centerY) {
                        for (let corridorY = prevCenterY; corridorY <= centerY; corridorY++) {
                            if (this.mapGrid[corridorY][centerX] === 0) {
                                this.mapGrid[corridorY][centerX] = -1;
                            }
                        }
                    } else {
                        for (let corridorY = centerY; corridorY <= prevCenterY; corridorY++) {
                            if (this.mapGrid[corridorY][centerX] === 0) {
                                this.mapGrid[corridorY][centerX] = -1;
                            }
                        }
                    }
                }

                break;
            }
        }

        if (!placed) {
            console.log(`Room ${this.roomId} (size ${roomWidth}x${roomHeight}) could not be placed.`);
        }

        return placed;
    }

    /**
     * Prints the current state of the map to the console.
     * Rooms are represented by positive integers, corridors by `.`,
     * and empty spaces by ` ` (spaces).
     */
    printMap(): void {
        for (const row of this.mapGrid) {
            console.log(
                row
                    .map((cell) => (cell > 0 ? cell.toString() : cell === -1 ? "." : " "))
                    .join(" ")
            );
        }
    }

    /**
     * Retrieves the current map grid as a 2D array.
     *
     * @returns A 2D array representing the map grid.
     */
    get getMap(): number[][] {
        return this.mapGrid;
    }

    get getRoomsCoordinates(): Array<Vector3> {
        return this.roomsCoordinates;
    }

    get getRoomCount(): number {
        return this.roomCount;
    }
}

export {MapGenerator}