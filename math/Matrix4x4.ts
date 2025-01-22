import { Vector3 } from "./Vector.js";

class Matrix4x4 {
    private readonly data: number[][];

    /**
     * Constructs a 4x4 matrix.
     * @param data - A 2D array representing the matrix (4x4).
     * @throws Error if the provided data is not a 4x4 matrix.
     */
    constructor(data: number[][]) {
        if (data.length !== 4 || data.some(row => row.length !== 4)) {
            throw new Error("Matrix must be 4x4.");
        }
        this.data = data;
    }

    /**
     * Helper function to access the matrix element at a specific row and column.
     * @param row - The row index of the matrix.
     * @param col - The column index of the matrix.
     * @returns The value at the specified row and column.
     */
    get(row: number, col: number): number {
        return this.data[row][col];
    }

    /**
     * Extracts the translation vector from the matrix (last column).
     * @returns A `Vector3` representing the translation (X, Y, Z).
     */
    translation(): Vector3 {
        return new Vector3(this.get(0, 3), this.get(1, 3), this.get(2, 3));
    }

    /**
     * Extracts the rotation matrix from the top-left 3x3 portion.
     * @returns An array of `Vector3` representing the three rotation axes (Right, Up, Forward).
     */
    rotation(): Vector3[] {
        return [
            new Vector3(this.get(0, 0), this.get(1, 0), this.get(2, 0)), // Right axis
            new Vector3(this.get(0, 1), this.get(1, 1), this.get(2, 1)), // Up axis
            new Vector3(this.get(0, 2), this.get(1, 2), this.get(2, 2)),  // Forward axis
        ];
    }

    /**
     * Extracts the scale factors from the matrix (magnitude of each column in the top-left 3x3 part).
     * @returns A `Vector3` representing the scale along X, Y, and Z axes.
     */
    scale(): Vector3 {
        return new Vector3(
            new Vector3(this.get(0, 0), this.get(1, 0), this.get(2, 0)).magnitude(),
            new Vector3(this.get(0, 1), this.get(1, 1), this.get(2, 1)).magnitude(),
            new Vector3(this.get(0, 2), this.get(1, 2), this.get(2, 2)).magnitude()
        );
    }
}

export { Matrix4x4 };
