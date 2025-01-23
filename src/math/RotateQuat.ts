type Axis= "X" | "Y" | "Z";

export class RotateQuat{
    public rotate(quaternions: number[], axis: Axis[], angleDeg: number, times = 1): number[] {
        const xyz = {
            "X": times,
            "Y": times,
            "Z": times,
        }
        axis.forEach((key) => {
            quaternions = this.rotateQuaternion(quaternions, key, xyz[key] * angleDeg)
        })
        return quaternions;
    }

    protected rotateQuaternion(quaternions: number[], axis: Axis, angleDeg: number): number[] {
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
        return this.multiplyQuaternions(quaternions, rotationQuat);
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
}