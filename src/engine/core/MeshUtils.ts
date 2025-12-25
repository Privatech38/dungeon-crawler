// @ts-ignore
import { quat, vec3, vec4, mat3, mat4 } from 'glm';

export function transformVertex(vertex: mat4, matrix: mat4,
    normalMatrix = mat3.normalFromMat4(mat3.create(), matrix),
    tangentMatrix = mat3.fromMat4(mat3.create(), matrix),
) {
    vec3.transformMat4(vertex.position, vertex.position, matrix);
    vec3.transformMat3(vertex.normal, vertex.normal, normalMatrix);
    vec3.transformMat3(vertex.tangent, vertex.tangent, tangentMatrix);
}

export function transformMesh(mesh: mat4, matrix: mat4,
    normalMatrix = mat3.normalFromMat4(mat3.create(), matrix),
    tangentMatrix = mat3.fromMat4(mat3.create(), matrix),
) {
    for (const vertex of mesh.vertices) {
        transformVertex(vertex, matrix, normalMatrix, tangentMatrix);
    }
}

export function calculateAxisAlignedBoundingBox(mesh: mat4) {
    const initial = {
        min: vec3.clone(mesh.vertices[0].position),
        max: vec3.clone(mesh.vertices[0].position),
    };

    return {
        min: mesh.vertices.reduce((a: vec3, b: vec3) => vec3.min(a, a, b.position), initial.min),
        max: mesh.vertices.reduce((a: vec3, b: vec3) => vec3.max(a, a, b.position), initial.max),
    };
}

export function mergeAxisAlignedBoundingBoxes(boxes: { min: vec3, max: vec3 }[]) {
    const initial = {
        min: vec3.clone(boxes[0].min),
        max: vec3.clone(boxes[0].max),
    };
    
    return {
        min: boxes.reduce(({ min: amin }: { min: vec3 }, { min: bmin }: { min: vec3 }) => vec3.min(amin, amin, bmin), initial),
        max: boxes.reduce(({ max: amax }: { max: vec3 }, { max: bmax }: { max: vec3 }) => vec3.max(amax, amax, bmax), initial),
    };
}
