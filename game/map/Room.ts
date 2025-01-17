import {Random} from "../../math/Random";
import {Wall} from "./Wall";
import {Vector3} from "../../math/Vector";
import {Entity} from "../entities/Entity";
import {Pillar} from "./Pillar";

class Room {
    private readonly walls: Wall[];
    private readonly pillars: Pillar[];
    private width: number;
    private depth: number;
    private doorCount: number;
    private startPoint: Vector3;
    private active: boolean;
    private readonly corners: Array<Vector3>;
    private ID: number;
    private neighbors: Set<Room>;

    constructor(size: number | null = null) {
        this.walls = [];
        this.pillars = [];
        this.width = 0;
        this.depth = 0;
        this.doorCount = 0;
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

    private generateCorners() {
        this.corners.push(this.startPoint);
        this.corners.push(this.startPoint.add(new Vector3(0, 0, 3 * this.width)));
        this.corners.push(this.startPoint.add(new Vector3(3 * this.depth, 0, 3 * this.width)));
        this.corners.push(this.startPoint.add(new Vector3(3 * this.depth, 0, 0)));
    }

    private distribution(): number {
        const rand: number = Random.randInt(1, 15); // Random int from 1 to 15
        return ((Math.floor(Math.log2(rand)) + 3) % 4) + 1; // Rotated distribution
    }

    private generateSize(setSize: number) {
        const size = setSize;
        const minSize = size;
        const maxSize = size + Math.ceil(size / 2);
        this.width = Random.randInt(minSize, maxSize);
        this.depth = Random.randInt(minSize, maxSize);
        this.doorCount = Random.randInt(1, size + 1);
    }

    private generateRoom(): void {

        // generate bottom pillars and walls
        this.generatePillar(
            new Vector3(0, 0, 0).add(this.startPoint), this.width, "horizontal", new Vector3(0, 0, 1)
        )
        this.generateWalls(
            new Vector3(1.5, 0, 0).add(this.startPoint), this.width, "horizontal"
        )

        // generate top pillars
        this.generatePillar(
            new Vector3(0, 0, this.depth * 3).add(this.startPoint), this.width, "horizontal", new Vector3(0, 0, -1)
        )
        this.generateWalls(
            new Vector3(1.5, 0, this.depth * 3).add(this.startPoint), this.width, "horizontal"
        )

        // generate left pillars
        this.generatePillar(
            new Vector3(0, 0, 0).add(this.startPoint), this.depth, "vertical", new Vector3(1, 0, 0)
        )
        this.generateWalls(
            new Vector3(0, 0, 1.5).add(this.startPoint), this.depth, "vertical"
        )

        // generate right pillars
        this.generatePillar(
            new Vector3(this.width * 3, 0, 0).add(this.startPoint), this.depth, "vertical", new Vector3(-1, 0, 0)
        )
        this.generateWalls(
            new Vector3(this.width * 3, 0, 1.5).add(this.startPoint), this.depth, "vertical"
        )
    }

    private generatePillar(center: Vector3, amount: number, direction: string, orientation: Vector3): void {
        for (let i = 0; i < amount; i++) {
            let pillar;
            if (i === 0 || i === amount - 1) {
                pillar = new Pillar(center.clone(), false, orientation)
            } else {
                pillar = new Pillar(center.clone(), true, orientation);
            }
            if (direction === 'horizontal') {
                center.x += 3;
            } else {
                center.z += 3;
            }
            this.pillars.push(pillar);
        }
    }

    private generateWalls(center: Vector3, amount: number, direction: string): void {
        for (let i = 0; i < amount; i++) {
            let wall;
            if (direction === 'horizontal') {
                wall = new Wall(0, center.clone());
                center.x += 3;
            } else { // direction === 'vertical'
                wall = new Wall(90, center.clone())
                wall.rotateHitbox();
                center.z += 3;
            }
            this.walls.push(wall);
        }
    }

    public generateNewRoom(): void {
        this.generateRoom();
        this.generateCorners();
    }

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

    get getWidth(): number {
        return this.width;
    }

    get getDepth(): number {
        return this.depth;
    }

    get getSurfaceArea(): number {
        return this.width * this.depth;
    }

    get getDoorCount(): number {
        return this.doorCount;
    }

    get getWalls(): Wall[] {
        return this.walls;
    }

    get getPillars(): Pillar[] {
        return this.pillars;
    }

    get isActive(): boolean {
        return this.active;
    }

    set isActive(value: boolean) {
        this.active = value;
    }

    get getCorners(): Array<Vector3> {
        return this.corners;
    }

    set newNeighbor(room: Room) {
        this.neighbors.add(room);
    }

    get getNeighbors(): Set<Room> {
        return this.neighbors;
    }

    set setStartPoint(startPoint: Vector3) {
        this.startPoint = startPoint.clone();
    }

    set setID(id: number) {
        this.ID = id;
    }

    get getID(): number {
        return this.ID;
    }

}

let room: Room = new Room();
room.generateNewRoom()

room.getWalls.forEach(wall => {
    wall.getCenter.toArray;
    console.log(wall.getQuaternions)
})

room.getPillars.forEach(pillar => {
    pillar.getCenter.toArray;
})

export { Room }