// @ts-ignore
import { mat4 } from 'glm';

import { Camera } from './Camera.js';
import { Model } from './Model.js';
import { Transform } from './Transform.js';
import { Node } from './Node.js';

export function getLocalModelMatrix(node: Node) {
    const matrix = mat4.create();
    for (const transform of node.getComponentsOfType(Transform)) {
        mat4.mul(matrix, matrix, transform.matrix);
    }
    return matrix;
}

export function getGlobalModelMatrix(node: Node): mat4 {
    if (node.parent) {
        const parentMatrix = getGlobalModelMatrix(node.parent);
        const modelMatrix = getLocalModelMatrix(node);
        return mat4.multiply(parentMatrix, parentMatrix, modelMatrix);
    } else {
        return getLocalModelMatrix(node);
    }
}

export function getLocalViewMatrix(node: Node): mat4 {
    const matrix = getLocalModelMatrix(node);
    return mat4.invert(matrix, matrix);
}

export function getGlobalViewMatrix(node: Node): mat4 {
    const matrix = getGlobalModelMatrix(node);
    return mat4.invert(matrix, matrix);
}

export function getProjectionMatrix(node: Node): mat4 {
    const camera = node.getComponentOfType(Camera);
    return camera ? camera.projectionMatrix : mat4.create();
}

export function getModels(node: Node): Model[] {
    return node.getComponentsOfType(Model);
}
