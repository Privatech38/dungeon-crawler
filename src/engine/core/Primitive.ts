import { Material } from './Material';
import { Mesh } from "./Mesh";

export class Primitive {
    mesh?: Mesh;
    material?: Material;
    
    constructor({
        mesh,
        material,
    }: {mesh?: Mesh; material?: Material} = {}) {
        this.mesh = mesh;
        this.material = material;
    }

}
