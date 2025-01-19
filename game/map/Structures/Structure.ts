import {Vector3} from "../../../math/Vector.js";
type Axis = "X" | "Y" | "Z";

/**
 * Abstract class representing a structure in a 3D space.
 * The structure has a center point defined by a Vector3.
 */
abstract class Structure {
    // The center of the structure represented as a Vector3 object.
    protected readonly center: Vector3;

    /**
     * Quaternions representing the wall's rotation.
     * @private
     * @type {number[]}
     */
    protected quaternions: number[];

    /**
     * Constructor to initialize the center of the structure.
     * @param center - The center point of the structure in 3D space.
     * @param quaternions - orientation in quaternions
     */
    protected constructor(center: Vector3, quaternions: number[] = [0, 0, 0, 1]) {
        this.center = center;
        this.quaternions = quaternions;
    }

    public rotate(axis: Axis[], angleDeg: number, times = 1, random = true): void {
        const xyz = {
            "X": random? Math.round(Math.random() * times) : 1,
            "Y": random? Math.round(Math.random() * times) : 1,
            "Z": random? Math.round(Math.random() * times) : 1,
        }
        axis.forEach((key) => {
            this.quaternions = this.rotateQuaternion(key, xyz[key] * angleDeg)
        })
    }

    protected rotateQuaternion(axis: Axis, angleDeg: number): number[] {
        const angleRad = (angleDeg * Math.PI) / 180; // Convert degrees to radians
        const halfAngle = angleRad / 2;

        // Create the rotation quaternion for the given axis
        let rotationQuat: number[];
        switch (axis) {
            case "X":
                rotationQuat = [Math.sin(halfAngle), 0, 0, Math.cos(halfAngle)];
                break;
            case "Y":
                rotationQuat = [0, Math.sin(halfAngle), 0, Math.cos(halfAngle)];
                break;
            case "Z":
                rotationQuat = [0, 0, Math.sin(halfAngle), Math.cos(halfAngle)];
                break;
            default:
                throw new Error("Invalid axis. Use 'X', 'Y', or 'Z'.");
        }
        // Multiply the existing quaternion by the rotation quaternion
        return this.multiplyQuaternions(this.quaternions, rotationQuat);
    }

    /**
     * Multiplies two quaternions.
     * @private
     * @param {number[]} q1 - The first quaternion.
     * @param {number[]} q2 - The second quaternion.
     * @returns {number[]} The resulting quaternion.
     */
    private multiplyQuaternions(q1: number[], q2: number[]): number[] {
        const [x1, y1, z1, w1] = q1;
        const [x2, y2, z2, w2] = q2;

        let q = [
            w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
            w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2,
            w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2,
            w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2,
        ];

        return q;
    }

    /**
     * Gets the center of the structure.
     * @returns The center point as a Vector3 object.
     */
    get getCenter(): Vector3 {
        return this.center;
    }

    /**
     * Retrieves the wall's current quaternion values.
     * @returns {number[]} The wall's quaternions.
     */
    get getQuaternions(): number[] {
        return this.quaternions;
    }
}

export {Structure};
