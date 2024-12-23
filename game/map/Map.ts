import { Room } from "./Room";

class Map {
    private readonly rooms: Room[];
    private readonly maxSurfaceArea: number;
    private readonly mapWidth: number;
    private readonly mapHeight: number;

    constructor(maxSurfaceArea: number = 16 * 16, mapWidth: number = 16, mapHeight: number = 16) {
        this.rooms = [];
        this.maxSurfaceArea = maxSurfaceArea;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
    }

    private doesRoomFit(room: Room, occupiedSpaces: boolean[][]): boolean {
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                if (this.canPlaceRoom(room, x, y, occupiedSpaces)) {
                    return true;
                }
            }
        }
        return false;
    }

    private canPlaceRoom(room: Room, startX: number, startY: number, occupiedSpaces: boolean[][]): boolean {
        const roomWidth = room.getWidth;
        const roomDepth = room.getDepth;

        if (startX + roomWidth > this.mapWidth || startY + roomDepth > this.mapHeight) {
            return false; // Room exceeds map boundaries
        }

        for (let y = startY; y < startY + roomDepth; y++) {
            for (let x = startX; x < startX + roomWidth; x++) {
                if (occupiedSpaces[y][x]) {
                    return false; // Space already occupied
                }
            }
        }

        return true;
    }

    private placeRoom(room: Room, startX: number, startY: number, occupiedSpaces: boolean[][]): void {
        const roomWidth = room.getWidth;
        const roomDepth = room.getDepth;

        // Mark occupied spaces
        for (let y = startY; y < startY + roomDepth; y++) {
            for (let x = startX; x < startX + roomWidth; x++) {
                occupiedSpaces[y][x] = true;
            }
        }

        // Update room's position
        room.setPosition(startX, startY);

        this.rooms.push(room);
    }


    public generateMap(): void {
        const occupiedSpaces: boolean[][] = Array.from({ length: this.mapHeight }, () =>
            Array(this.mapWidth).fill(false)
        );
        let remainingArea = this.maxSurfaceArea;

        while (remainingArea > 0) {
            const room = new Room();
            room.generateRoom();

            if (room.getSurface > remainingArea) {
                continue; // Room is too large for the remaining area
            }

            if (this.doesRoomFit(room, occupiedSpaces)) {
                for (let y = 0; y < this.mapHeight; y++) {
                    for (let x = 0; x < this.mapWidth; x++) {
                        if (this.canPlaceRoom(room, x, y, occupiedSpaces)) {
                            this.placeRoom(room, x, y, occupiedSpaces);
                            remainingArea -= room.getSurface;
                            break;
                        }
                    }
                }
            }
        }
    }

    get getRooms(): Room[] {
        return this.rooms;
    }

    public visualizeMap(): void {
        // Create an empty 2D grid
        const grid: string[][] = Array.from({ length: this.mapHeight }, () =>
            Array(this.mapWidth).fill('.')
        );

        // Populate grid with room labels
        this.rooms.forEach((room, index) => {
            const char = String.fromCharCode(65 + (index % 26)); // A-Z for room labels

            for (let y = room.getStartY; y < room.getStartY + room.getDepth; y++) {
                for (let x = room.getStartX; x < room.getStartX + room.getWidth; x++) {
                    if (grid[y][x] !== '.') {
                        grid[y][x] = '!'; // Highlight overlaps
                    } else {
                        grid[y][x] = char;
                    }
                }
            }
        });

        // Print the grid row by row
        console.log('\nMap Visualization:');
        grid.forEach(row => console.log(row.join(' ')));
    }


}

// Test the implementation
const m = new Map();
m.generateMap();

console.log('Generated Rooms:');
m.getRooms.forEach((room, index) => {
    console.log(`Room ${index}: Start (${room.getStartX}, ${room.getStartY}), Width ${room.getWidth}, Depth ${room.getDepth}, Surface ${room.getSurface}`);
});

console.log('Visualized Map:');
m.visualizeMap();

