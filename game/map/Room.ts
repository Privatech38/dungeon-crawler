import {Random} from "../../math/Random";

class Room {
    private startX: number;
    private startY: number;
    private width: number;
    private depth: number;
    private doorCount: number;

    constructor() {
        this.startX = 0;
        this.startY = 0;
        this.width = 0;
        this.depth = 0;
        this.doorCount = 0;
    }

    private distribution(): number {
        const rand: number = Random.randInt(1, 15); // Random int from 1 to 15
        return (Math.floor(Math.log2(rand)) + 4) % 5; // Rotated distribution
    }

    public generateRoom(): void {
        const size = this.distribution();
        const minSize = size;
        const maxSize = size * Math.ceil(size / 2);
        this.width = Random.randInt(minSize, maxSize);
        this.depth = Random.randInt(minSize, maxSize);
        this.doorCount = Random.randInt(1, size + 1);
    }

    public setPosition(x: number, y: number): void {
        this.startX = x;
        this.startY = y;
    }

    get getStartX(): number {
        return this.startX;
    }

    get getStartY(): number {
        return this.startY;
    }

    get getWidth(): number {
        return this.width;
    }

    get getDepth(): number {
        return this.depth;
    }

    get getSurface(): number {
        return this.width * this.depth;
    }

    get getDoorCount(): number {
        return this.doorCount;
    }

}

export { Room }