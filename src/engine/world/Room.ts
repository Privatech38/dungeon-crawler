import { Node } from "../core/Node.js";
import { AABB } from "../core/AABB.js";
// @ts-ignore
import { vec3 } from 'glm';
import { Wall } from "./Wall.js";
import { Structure } from "./Structure.js";


const wallThickness = 0.1;
const wallHeight = 2;
const wallWidth = 2;

const pillarWidth = 0.2;
const pillarHeight = 2;

export class Room extends Node {
    id: number;
    boundingBox: AABB;
    center: vec3;
    
    constructor(id: number, boundingBox: AABB) {
        super();
        this.id = id;
        this.boundingBox = boundingBox;
        this.center = this.boundingBox.getCenter();
    }

    isEntityInRoom(entity: AABB): boolean {
        return this.boundingBox.intersects(entity);
    }

    buildRoom(sizeX: number, sizeY: number, position: vec3): void {
        

        for (let x = 0; x < sizeX; x++) {
            for (let y = 0; y < sizeY; y++) {
                this.createWall(x, y, sizeX, sizeY);
            }
        }
    }

    private createPillar(x: number, y: number, sizeX: number, sizeY: number) {
        if (!this.isBorder(x, y, sizeX, sizeY)) {
            return null;
        }


    }

    private createWall(x: number, y: number, sizeX: number, sizeY: number) {
        if (!this.isBorder(x, y, sizeX, sizeY)) {
            return null;
        }
        

        const wall = new Wall(new AABB(
                    vec3.fromValues(
                        pillarWidth + x * wallWidth,
                        0,
                        pillarWidth + y * wallWidth
                    ),
                    vec3.fromValues(
                        pillarWidth + (x + 1) * wallWidth,
                        wallHeight,
                        wallThickness + pillarWidth + (y + 1) * wallWidth
                    )
                ), (x === 0 || x === sizeX - 1) ? vec3.fromValues(1, 0, 0) : vec3.fromValues(0, 1, 0));

        this.addComponent(wall);
    }

    private isBorder(x: number, y: number, sizeX: number, sizeY: number): boolean {
        return x === 0 || x === sizeX - 1 || y === 0 || y === sizeY - 1;
    }
}
