import { Vector3 } from "../../math/Vector";
import { Distribution } from "../../math/Distribution";

/**
 * Represents a Bezier curve and calculates points and tangents on the curve.
 */
class BezierCurve {
    protected controlPoints: Vector3[];
    protected t: number;
    tangent: Vector3;
    point: Vector3;

    /**
     * Constructs a BezierCurve instance.
     *
     * @param {Vector3[]} controlPoints - The control points defining the curve.
     * @param {number} t - The parameter (0 <= t <= 1) to calculate the point and tangent on the curve.
     */
    constructor(controlPoints: Vector3[], t: number) {
        this.controlPoints = controlPoints;
        this.t = t;
        this.deCasteljau(); // Calculate the point on the curve
        this.tangent = this.calculateTangent(); // Calculate the tangent vector
    }

    /**
     * Calculates the tangent vector at the given t using De Casteljau's algorithm.
     *
     * @returns {Vector3} - The tangent vector at the point on the curve.
     */
    protected calculateTangent(): Vector3 {
        const derivativeControlPoints = this.calculateDerivative();
        return this.deCasteljauDerivative(derivativeControlPoints);
    }

    /**
     * Computes the derivative control points for the curve.
     *
     * @returns {Vector3[]} - The control points of the derivative curve.
     */
    private calculateDerivative(): Vector3[] {
        let derivativeControlPoints: Vector3[] = [];
        for (let i = 0; i < this.controlPoints.length - 1; i++) {
            derivativeControlPoints.push(this.controlPoints[i + 1].subtract(this.controlPoints[i]));
        }
        return derivativeControlPoints;
    }

    /**
     * Applies De Casteljau's algorithm to the derivative control points.
     *
     * @param {Vector3[]} points - The derivative control points.
     * @returns {Vector3} - The tangent vector.
     */
    private deCasteljauDerivative(points: Vector3[]): Vector3 {
        let localPoints = [...points];
        while (localPoints.length > 1) {
            let nextPoints: Vector3[] = [];
            for (let i = 0; i < localPoints.length - 1; i++) {
                nextPoints.push(localPoints[i].scale(1 - this.t).add(localPoints[i + 1].scale(this.t)));
            }
            localPoints = nextPoints;
        }
        return localPoints[0];
    }

    /**
     * Applies De Casteljau's algorithm to calculate a point on the curve.
     */
    protected deCasteljau(): void {
        let points = [...this.controlPoints];
        while (points.length > 1) {
            let nextPoints: Vector3[] = [];
            for (let i = 0; i < points.length - 1; i++) {
                nextPoints.push(points[i].scale(1 - this.t).add(points[i + 1].scale(this.t)));
            }
            points = nextPoints;
        }
        this.point = points[0];
    }
}

/**
 * Represents a specific point on a Bezier curve, including tangent and direction.
 * Extends BezierCurve.
 */
class BezierPoint extends BezierCurve {
    private readonly z: number;
    private readonly centerPoint: Vector3;
    public point: Vector3;
    public tangent: Vector3;
    public pointing: Vector3;

    /**
     * Constructs a BezierPoint instance.
     *
     * @param {Vector3[]} controlPoints - The control points defining the curve.
     * @param {number} t - The parameter (0 <= t <= 1) to calculate the point and tangent on the curve.
     * @param {number} z - The Z-coordinate offset.
     * @param {Vector3} centerPoint - The center point to calculate direction from.
     */
    constructor(controlPoints: Vector3[], t: number, z: number, centerPoint: Vector3) {
        super(controlPoints, t);
        this.z = z;
        this.centerPoint = centerPoint;

        const bezier = new BezierCurve(controlPoints, t);
        this.point = bezier.point;
        this.tangent = bezier.tangent;
        this.getPointing();
    }

    /**
     * Calculates the direction vector (pointing) from the center point.
     */
    private getPointing(): void {
        this.pointing = new Vector3(this.tangent.y, -this.tangent.x, this.z);
        this.pointing = this.pointing.subtract(this.centerPoint).normalize();
        this.pointing.x = Math.round(this.pointing.x * 1000) / 1000;
        this.pointing.y = Math.round(this.pointing.y * 1000) / 1000;
        this.pointing.z = Math.round(this.pointing.z * 1000) / 1000;
    }
}

/**
 * Represents a movement pattern using Bezier curves and distributions.
 */
class Pattern {
    private readonly controlPoints: Vector3[];
    private readonly zPattern: Distribution;
    private readonly time: number;
    private readonly centerPoint: Vector3;
    private readonly steps: number;
    public timePattern: Distribution;
    public directionVector: Vector3[] = [];

    /**
     * Constructs a Pattern instance.
     *
     * @param {Vector3[]} controlPoints - The control points defining the Bezier curve.
     * @param {number[]} zPattern - The Z-coordinate distribution for the pattern.
     * @param {number[]} timePattern - The time distribution for the pattern last value it duration of pattern.
     */
    constructor(
        controlPoints: Vector3[],
        zPattern: number[],
        timePattern: number[],
    ) {
        this.controlPoints = controlPoints;
        this.centerPoint = new Vector3(0, 0, 0);
        this.time = timePattern[timePattern.length - 1];

        this.steps = 1000 * this.time;
        this.zPattern = new Distribution(zPattern, this.steps);
        this.timePattern = new Distribution(timePattern, this.steps);
        this.createPattern();
    }

    /**
     * Creates the movement pattern by generating direction vectors.
     */
    private createPattern(): void {
        for (let i = 0; i < this.steps; i++) {
            const bezierPoint = new BezierPoint(
                this.controlPoints,
                this.timePattern.list[i]/this.time,
                this.zPattern.list[i],
                this.centerPoint
            );
            this.directionVector.push(
                new Vector3(bezierPoint.pointing.x, bezierPoint.pointing.y, bezierPoint.pointing.z)
            );
        }
    }
}

export { Pattern };
