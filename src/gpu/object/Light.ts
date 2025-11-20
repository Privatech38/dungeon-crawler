/**
 * Class representing JSON structure for a Light as specified by Khronos Group in glTF 2.0.
 * https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_lights_punctual/README.md
 */
interface Light {
    name?: string;
    readonly type: 'point' | 'directional' | 'spot';
    color?: [number, number, number];
    intensity?: number;
    range?: number;
    spot?: Spot;
}

/**
 * Interface representing the spotlight properties.
 */
interface Spot {
    innerConeAngle?: number;
    outerConeAngle?: number;
}