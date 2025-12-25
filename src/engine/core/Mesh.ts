export class Mesh {
    vertices: number[];
    indices: number[];
    
    constructor({
        vertices = [],
        indices = [],
    } = {}) {
        this.vertices = vertices;
        this.indices = indices;
    }

}
