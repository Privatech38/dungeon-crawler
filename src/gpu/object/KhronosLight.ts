// @ts-ignore
import { noise } from "../../math/perlin.js"

export enum LightType {
    point,
    directional,
    spot
}

/**
 * Interface representing JSON structure for a Light as specified by Khronos Group in glTF 2.0.<br>
 * https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_lights_punctual/README.md
 */
export interface IKHRLightExtension {
    name?: string;
    readonly type: LightType;
    color?: [number, number, number];
    intensity?: number;
    range?: number;
    spot?: IKHRSpot;
}

const FLICKER_SPEED = 2;
const INTENSITY_OFFSET_PERCEMT = 0.33;

/**
 * Class representing structure for a Light extension as specified by Khronos Group in glTF 2.0.<br>
 * https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_lights_punctual/README.md
 */
export class KHRLightExtension {
    name: string;
    readonly type: LightType;
    color: [number, number, number];
    intensity: number;
    baseIntensity: number;
    range: number;
    spot: KHRSpot;
    // Flicker data
    startOffset: number;

    constructor(json: IKHRLightExtension) {
        this.name = json.name ?? '';
        this.type = json.type;
        this.color = json.color ?? [1.0, 1.0, 1.0];
        this.intensity = json.intensity ?? 1.0;
        this.baseIntensity = this.intensity;
        this.range = json.range ?? 10000; // Has no default, but we set it to 10000 in our impl
        if (json.spot) {
            this.spot = new KHRSpot(json.spot);
        } else {
            this.spot = new KHRSpot();
        }
        this.startOffset = Math.random() * 1000;
    }

    update(time: number, dt: number) {
        const rawNoise: number = noise.perlin2(time * FLICKER_SPEED, this.startOffset);
        this.intensity = this.baseIntensity + rawNoise * this.baseIntensity * INTENSITY_OFFSET_PERCEMT;
    }

    clone() {
        console.log("Clone called")
        return new KHRLightExtension({
            name: this.name,
            type: this.type,
            color: this.color,
            intensity: this.intensity,
            range: this.range,
            spot: this.spot
        });
    }
}

/**
 * Interface representing the spotlight properties.
 */
interface IKHRSpot {
    innerConeAngle?: number;
    outerConeAngle?: number;
}

/**
 * Class representing the spotlight properties.
 */
export class KHRSpot {
    innerConeAngle: number;
    outerConeAngle: number;

    constructor(json?: IKHRSpot) {
        this.innerConeAngle = json?.innerConeAngle ?? 0.0;
        this.outerConeAngle = json?.outerConeAngle ?? Math.PI / 4.0;
    }
}