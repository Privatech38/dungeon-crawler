/**
 * Represents a distribution of values between control points over a specified length.
 */
class Distribution {
    private readonly controlPoints: number[];
    private readonly length: number;

    private distance: number;
    public list: number[];

    /**
     * Constructs a Distribution instance.
     *
     * @param {number[]} controlPoints - An array of control points to define the distribution.
     * @param {number} length - The total number of points in the generated distribution.
     */
    constructor(controlPoints: number[], length: number) {
        this.controlPoints = controlPoints;
        this.length = length;

        // The distance between successive control points in the generated list
        this.distance = this.length / (controlPoints.length - 1);
        this.list = [];
        this.generate();
    }

    /**
     * Generates the distribution of values based on the control points and length.
     * The values are interpolated linearly between each pair of control points.
     */
    private generate(): void {
        for (let i = 1; i < this.controlPoints.length; i++) {
            const a = this.controlPoints[i - 1];
            const b = this.controlPoints[i];
            const step = (b - a) / this.distance;
            const isLast: boolean = (i === this.controlPoints.length - 1);

            if (isLast) {
                this.distance -= 1; // Adjust the distance to avoid exceeding the desired length
            }

            for (let j = 0; j < this.distance; j++) {
                // Add interpolated values rounded to two decimal places
                this.list.push(Math.round((a + j * step) * 100) / 100);
            }

            if (isLast) {
                this.list.push(b); // Ensure the final control point is included
            }
        }
    }
}

export { Distribution };
