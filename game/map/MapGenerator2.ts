import {Room} from "./Room.js";
import {Vector3} from "../../math/Vector.js";

class MapGenerator2 {
    private readonly maxSize: number;
    private readonly mapGrid: number[][];
    private roomId: number;
    private readonly rooms: Array<Room>;
    private roomCount: number;

    constructor(mapSize: number) {
        this.maxSize = mapSize;
        this.mapGrid = Array.from({ length: mapSize }, () => Array(mapSize).fill(0));
        this.roomId = 1;
        this.rooms = new Array<Room>();
        this.roomCount = 0;
    }

    /**
     * Performs Breadth-First Search (BFS) on a 2D grid.
     *
     * @param start - The starting position as [row, col].
     * @param room - Room that you  want to add.
     */
    private bfs2D(start: [number, number], room: Room): boolean {
        const rows = this.mapGrid.length;
        const cols = this.mapGrid[0].length;
        const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

        // Direction vectors for moving up, down, left, and right
        const directions = [
            [-1, 0], // Up
            [1, 0],  // Down
            [0, -1], // Left
            [0, 1],  // Right
        ];

        const queue: [number, number][] = [start]; // Initialize the queue with the start position
        visited[start[0]][start[1]] = true; // Mark the start as visited

        while (queue.length > 0) {
            const [row, col] = queue.shift()!; // Dequeue the front element
            if (this.canPlace(row, col, room)) {return true}

            // Check all neighboring cells
            for (const [dRow, dCol] of directions) {
                const newRow = row + dRow;
                const newCol = col + dCol;

                // Ensure the new cell is within bounds and hasn't been visited yet
                if (
                    newRow >= 0 &&
                    newRow < rows &&
                    newCol >= 0 &&
                    newCol < cols &&
                    !visited[newRow][newCol]
                ) {
                    visited[newRow][newCol] = true; // Mark the cell as visited
                    queue.push([newRow, newCol]); // Add the cell to the queue
                }
            }
        }
        return false;
    }

    private canPlace(row: number, col: number, room: Room): boolean {
        if ((room.getDepth + col >= this.mapGrid.length) || (room.getWidth + row >= this.mapGrid[0].length)) {
            return false;
        }
        for (let i = 0; i < room.getDepth; i++) {
            for (let j = 0; j < room.getWidth; j++) {
                if (this.mapGrid[col + i][row + j] !== 0) {
                    return false;
                }
            }
        }
        this.placeRoom(row, col, room);
        return true;
    }

    private placeRoom(row: number, col: number, room: Room) {
        for (let i = 0; i < room.getDepth; i++) {
            for (let j = 0; j < room.getWidth; j++) {
                this.mapGrid[col + i][row + j] = this.roomId;
            }
        }
        room.setID = this.roomId;
        room.setStartPoint = new Vector3(row, 0, this.maxSize - col);
        room.generateNewRoom();
        this.rooms.push(room);
        this.roomId++;
        this.roomCount++;
    }

    public addRoom(room: Room): boolean {
        return this.bfs2D([Math.floor(this.maxSize/2), Math.floor(this.maxSize/2)], room);
    }

    /**
     * Prints the current state of the map to the console.
     * Rooms are represented by positive integers, corridors by `.`,
     * and empty spaces by ` ` (spaces).
     */
    public printMap(): void {
        for (const row of this.mapGrid) {
            console.log(
                row
                    .map((cell) => (cell > 0 ? cell.toString() : " ")) // Positive numbers for rooms, spaces for empty cells
                    .join(" ") // Add spaces between cells for better readability
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

    get getRooms(): Array<Room> {
        return this.rooms;
    }

    get getRoomCount(): number {
        return this.roomCount;
    }

    get getLastRoom(): Room {
        return this.rooms[this.getRoomCount - 1];
    }

}

export { MapGenerator2 };