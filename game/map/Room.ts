import {Random} from "../../math/Random";
import {Wall} from "./Wall";
import {Vector3} from "../../math/Vector";

class Room {
    private walls: Wall[];
    private width: number;
    private depth: number;
    private doorCount: number;
    private startPoint: Vector3;

    constructor(startPoint: Vector3) {
        this.walls = [];
        this.width = 0;
        this.depth = 0;
        this.doorCount = 0;
        this.startPoint = startPoint;
        this.generateRoom();
    }

    private distribution(): number {
        const rand: number = Random.randInt(1, 15); // Random int from 1 to 15
        return ((Math.floor(Math.log2(rand)) + 3) % 4) + 1; // Rotated distribution
    }

    private generateRoom(): void {
        const size = this.distribution();
        const minSize = size;
        const maxSize = size + Math.ceil(size / 2);
        this.width = Random.randInt(minSize, maxSize);
        this.depth = Random.randInt(minSize, maxSize);
        this.doorCount = Random.randInt(1, size + 1);

        this.wallsPlace(new Vector3(0.1, 0, 1.6).add(this.startPoint), this.width, true);
        this.wallsPlace(new Vector3(this.depth * 3 + 0.2, 0, 1.6).add(this.startPoint), this.width, true);


        this.wallsPlace(new Vector3(1.6, 0, 0.1).add(this.startPoint), this.depth, false);
        this.wallsPlace(new Vector3(1.6, 0, this.width * 3 + 0.2).add(this.startPoint), this.depth, false);
    }

    private wallsPlace(startPoint: Vector3, direction: number, isWidth:boolean): void {
        for (let i = 0; i < direction; i++) {
            let wall = new Wall(0, startPoint.clone());
            this.walls.push(wall);

            if (isWidth) {
                startPoint.z += 3;
            }
            else {
                startPoint.x += 3;
            }

        }
    }

    private wallsDepth(): void {

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

}


export { Room }