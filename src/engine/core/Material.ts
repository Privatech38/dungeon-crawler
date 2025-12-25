// @ts-ignore
import {vec3, vec4} from 'glm';

export class Material {
    baseTexture: any;
    emissionTexture: any;
    normalTexture: any;
    occlusionTexture: any;
    roughnessTexture: any;
    metalnessTexture: any;    
    
    baseFactor: vec4;
    emissionFactor: vec3;
    normalFactor: number;
    occlusionFactor: number;
    roughnessFactor: number;
    metalnessFactor: number;

    ambientFactor: number;
    ambientColor: vec3;

    constructor({
        baseTexture = null,
        emissionTexture = null,
        normalTexture = null,
        occlusionTexture = null,
        roughnessTexture = null,
        metalnessTexture = null,

        baseFactor = [1, 1, 1, 1],
        emissionFactor = [0, 0, 0],
        normalFactor = 1,
        occlusionFactor = 1,
        roughnessFactor = 1,
        metalnessFactor = 1,

        ambientFactor = 0.2,
        ambientColor = [255, 0, 0],
    } = {}) {
        this.baseTexture = baseTexture;
        this.emissionTexture = emissionTexture;
        this.normalTexture = normalTexture;
        this.occlusionTexture = occlusionTexture;
        this.roughnessTexture = roughnessTexture;
        this.metalnessTexture = metalnessTexture;

        this.baseFactor = baseFactor;
        this.emissionFactor = emissionFactor;
        this.normalFactor = normalFactor;
        this.occlusionFactor = occlusionFactor;
        this.roughnessFactor = roughnessFactor;
        this.metalnessFactor = metalnessFactor;

        this.ambientFactor = ambientFactor;
        this.ambientColor = ambientColor;
    }

}
