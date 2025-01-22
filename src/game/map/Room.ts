import {Random} from "../../math/Random";
import {Wall} from "./Structures/Wall";
import {Vector3} from "../../math/Vector";
import {Entity} from "../entities/Entity";
import {Pillar} from "./Structures/Pillar";
import {Floor} from "./Structures/Floor";
import {BottomWall} from "./Structures/BottomWall";

/**
 * Represents a room in a 3D space with walls, pillars, floors, and other elements.
 */
class Room {
    private readonly walls: Wall[];
    private readonly pillars: Pillar[];
    private readonly floors: Floor[];
    private readonly bottomWalls: Floor[];
    private width: number;
    private depth: number;
    private startPoint: Vector3;
    private active: boolean;
    private readonly corners: Array<Vector3>;
    private ID: number;
    private neighbors: Set<Room>;

    /**
     * Initializes the room with a specified or random size.
     * @param size - Optional size for the room. If null, a random size is generated.
     */
    constructor(size: number | null = null) {
        this.walls = [];
        this.pillars = [];
        this.floors = [];
        this.bottomWalls = [];
        this.width = 0;
        this.depth = 0;
        this.startPoint = new Vector3(0, 0, 0);
        this.active = false;
        this.corners = new Array<Vector3>();
        this.neighbors = new Set<Room>();
        this.ID = 0;
        if (size === null) {
            this.generateSize(this.distribution());
        } else {
            this.generateSize(size);
        }
    }

    /**
     * Generates the corners of the room based on the starting point and dimensions.
     */
    private generateCorners() {
        this.corners.push(this.startPoint);
        this.corners.push(this.startPoint.add(new Vector3(0, 0, 3 * this.width)));
        this.corners.push(this.startPoint.add(new Vector3(3 * this.depth, 0, 3 * this.width)));
        this.corners.push(this.startPoint.add(new Vector3(3 * this.depth, 0, 0)));
    }

    /**
     * Determines a random distribution value for room size generation.
     * @returns A random distribution value between 1 and 4.
     */
    private distribution(): number {
        const rand: number = Random.randInt(1, 15); // Random int from 1 to 15
        return ((Math.floor(Math.log2(rand)) + 2) % 4) + 1; // Rotated distribution
    }

    /**
     * Generates random size for the room.
     * @param setSize - The base size of the room.
     */
    private generateSize(setSize: number) {
        const size = setSize;
        const minSize = size;
        const maxSize = size + Math.ceil(size / 2);
        this.width = Random.randInt(minSize, maxSize);
        this.depth = Random.randInt(minSize, maxSize);
    }

    /**
     * Generates the room by creating walls, pillars, and floors.
     */
    private generateRoom(): void {
        // Generate bottom pillars and walls
        this.generatePillar(
            new Vector3(0, 0, 0).add(this.startPoint), this.width, "horizontal", new Vector3(0, 0, 1)
        );
        this.generateWalls(
            new Vector3(1.5, 0, 0).add(this.startPoint), this.width, "horizontal"
        );

        // Generate top pillars
        this.generatePillar(
            new Vector3(0, 0, this.depth * 3).add(this.startPoint), this.width, "horizontal", new Vector3(0, 0, -1)
        );
        this.generateWalls(
            new Vector3(1.5, 0, this.depth * 3).add(this.startPoint), this.width, "horizontal"
        );

        // Generate left pillars
        this.generatePillar(
            new Vector3(0, 0, 0).add(this.startPoint), this.depth, "vertical", new Vector3(1, 0, 0)
        );
        this.generateWalls(
            new Vector3(0, 0, 1.5).add(this.startPoint), this.depth, "vertical"
        );

        // Generate right pillars
        this.generatePillar(
            new Vector3(this.width * 3, 0, 0).add(this.startPoint), this.depth, "vertical", new Vector3(-1, 0, 0)
        );
        this.generateWalls(
            new Vector3(this.width * 3, 0, 1.5).add(this.startPoint), this.depth, "vertical"
        );

        // Generate floor
        let center = new Vector3(1.5, 0, 1.5).add(this.startPoint);
        for (let i = 0; i < this.depth; i++) {
            for (let j = 0; j < this.width; j++) {
                let floor = new Floor(center.clone());
                floor.rotate(["Y"], 90);
                floor.rotate(["Y"], 90);
                floor.rotate(["Y"], 90);
                this.floors.push(floor);
                center.x += 3;
            }
            center.x -= 3 * this.width;
            center.z += 3;
        }
    }

    /**
     * Generates a series of pillars along a given direction.
     * @param center - The starting position for the pillars.
     * @param amount - The number of pillars to generate.
     * @param direction - The direction of the pillars ('horizontal' or 'vertical').
     * @param orientation - The orientation vector for pillar placement.
     */
    private generatePillar(center: Vector3, amount: number, direction: string, orientation: Vector3): void {
        for (let i = 0; i <= amount; i++) {
            let pillar;
            if (i === 0 || i === amount - 1) {
                pillar = new Pillar(center.clone(), false, orientation);
            } else {
                pillar = new Pillar(center.clone(), true, orientation);
            }
            if (direction === 'horizontal') {
                center.x += 3;
            } else {
                center.z += 3;
            }
            pillar.rotate(["Y"], 90);
            pillar.rotate(["Y"], 90);
            pillar.rotate(["Y"], 90);
            this.pillars.push(pillar);
        }
    }

    /**
     * Generates a series of walls along a given direction.
     * @param center - The starting position for the walls.
     * @param amount - The number of walls to generate.
     * @param direction - The direction of the walls ('horizontal' or 'vertical').
     */
    private generateWalls(center: Vector3, amount: number, direction: string): void {
        for (let i = 0; i < amount; i++) {
            let wall;
            let bottomWall;
            if (direction === 'horizontal') {
                wall = new Wall(0, center.clone());
                bottomWall = new BottomWall(0, center.clone());
                center.x += 3;
            } else { // direction === 'vertical'
                wall = new Wall(90, center.clone());
                bottomWall = new BottomWall(90, center.clone());
                wall.rotateHitbox();
                wall.rotate(["Y"], 90, 0, false);
                center.z += 3;
            }
            bottomWall.rotate(["Y"], 180);
            this.bottomWalls.push(bottomWall);
            wall.rotate(["Y", "X", "Z"], 180)
            this.walls.push(wall);
        }
    }

    /**
     * Generates a new room, including walls, pillars, and floors.
     */
    public generateNewRoom(): void {
        this.generateRoom();
        this.generateCorners();
    }

    /**
     * Checks if an entity is within the boundaries of the room.
     * @param entity - The entity to check.
     * @returns True if the entity is within the room; otherwise, false.
     */
    public isWithinRoom(entity: Entity): boolean {
        // Get the entity's position and set y to 0 (not needed)
        const position = entity.getPosition.clone();
        position.y = 0; // Set y to 0, as it's not needed in this case

        if (this.corners.length !== 4) {
            throw new Error("Corners array must contain exactly 4 points.");
        }

        const crossProducts: number[] = [];

        // Loop through the corners of the room
        for (let i = 0; i < 4; i++) {
            const A = this.corners[i];
            const B = this.corners[(i + 1) % 4];

            // Use only the x and z components for the edge and point vector
            const edge = new Vector3(B.x - A.x, 0, B.z - A.z); // Edge from A to B in the X-Z plane
            const toPoint = new Vector3(position.x - A.x, 0, position.z - A.z); // Vector from A to the point

            // Calculate the cross product's z component
            const cross = edge.cross(toPoint);

            crossProducts.push(cross.z); // Use the z-component to determine direction
        }

        // Check if all cross products are either positive or negative
        const allPositive = crossProducts.every(c => c > 0);
        const allNegative = crossProducts.every(c => c < 0);

        return allPositive || allNegative;
    }

    /**
     * Gets the width of the room.
     * @returns The width of the room.
     */
    get getWidth(): number {
        return this.width;
    }

    /**
     * Gets the depth of the room.
     * @returns The depth of the room.
     */
    get getDepth(): number {
        return this.depth;
    }

    /**
     * Gets the surface area of the room.
     * @returns The surface area of the room (width * depth).
     */
    get getSurfaceArea(): number {
        return this.width * this.depth;
    }

    /**
     * Gets the walls of the room.
     * @returns An array of walls in the room.
     */
    get getWalls(): Wall[] {
        return this.walls;
    }

    /**
     * Gets the floors of the room.
     * @returns An array of floors in the room.
     */
    get getFloors(): Floor[] {
        return this.floors;
    }

    /**
     * Gets the bottomWalls of the room.
     * @returns An array of bottomWalls in the room.
     */
    get getBottomWalls(): Floor[] {
        return this.bottomWalls;
    }

    /**
     * Gets the pillars of the room.
     * @returns An array of pillars in the room.
     */
    get getPillars(): Pillar[] {
        return this.pillars;
    }

    /**
     * Checks if the room is active.
     * @returns True if the room is active; otherwise, false.
     */
    get isActive(): boolean {
        return this.active;
    }

    /**
     * Sets the active status of the room.
     * @param value - The value to set the active status to.
     */
    set isActive(value: boolean) {
        this.active = value;
    }

    /**
     * Gets the corners of the room.
     * @returns An array of corners for the room.
     */
    get getCorners(): Array<Vector3> {
        return this.corners;
    }

    /**
     * Adds a neighboring room.
     * @param room - The neighboring room to add.
     */
    public newNeighbor(room: Room) {
        this.neighbors.add(room);
    }

    /**
     * Gets the neighboring rooms.
     * @returns A set of neighboring rooms.
     */
    get getNeighbors(): Set<Room> {
        return this.neighbors;
    }

    /**
     * Sets the starting point of the room.
     * @param startPoint - The new starting point for the room.
     */
    set setStartPoint(startPoint: Vector3) {
        this.startPoint = startPoint.clone();
    }

    /**
     * Sets the ID for the room.
     * @param id - The ID to assign to the room.
     */
    set setID(id: number) {
        this.ID = id;
    }

    /**
     * Gets the ID of the room.
     * @returns The ID of the room.
     */
    get getID(): number {
        return this.ID;
    }
}

export { Room };
