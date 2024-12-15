import { Vector3 } from "../../math/Vector";
import {Distribution} from "../../math/Distribution";

class BezierCurve {
    protected controlPoints: Vector3[];
    protected t: number;

    tangent: Vector3;
    point: Vector3;

    constructor(controlPoints: Vector3[], t: number) {
        this.controlPoints = controlPoints;
        this.t = t;
        this.deCasteljau();        // Calculate the point using De Casteljau's algorithm
        this.tangent = this.calculateTangent();  // Calculate the tangent
    }

    // Calculate the tangent of the Bezier curve
    protected calculateTangent(): Vector3 {
        // Step 1: Calculate the derivative control points
        let derivativeControlPoints = this.calculateDerivative();

        // Step 2: Apply De Casteljau's algorithm to derivative control points
        return this.deCasteljauDerivative(derivativeControlPoints);  // Calculate the tangent directly
    }

    // Calculate the derivative of the control points
    private calculateDerivative(): Vector3[] {
        let derivativeControlPoints: Vector3[] = [];
        for (let i = 0; i < this.controlPoints.length - 1; i++) {
            derivativeControlPoints.push(this.controlPoints[i + 1].subtract(this.controlPoints[i]));
        }
        return derivativeControlPoints;
    }

    // De Casteljau's algorithm for the tangent (derivative curve)
    private deCasteljauDerivative(points: Vector3[]): Vector3 {
        let localPoints = [...points];

        // Apply De Casteljau's algorithm to get the point on the derivative curve
        while (localPoints.length > 1) {
            let nextPoints: Vector3[] = [];
            for (let i = 0; i < localPoints.length - 1; i++) {
                nextPoints.push(localPoints[i].scale(1 - this.t).add(localPoints[i + 1].scale(this.t)));
            }
            localPoints = nextPoints;
        }

        return localPoints[0]; // The final point is the tangent at t
    }

    // De Casteljau's algorithm for the main Bezier curve
    protected deCasteljau(): void {
        let points = [...this.controlPoints];

        // Recursive step of De Casteljau's algorithm
        while (points.length > 1) {
            let nextPoints: Vector3[] = [];
            for (let i = 0; i < points.length - 1; i++) {
                nextPoints.push(points[i].scale(1 - this.t).add(points[i + 1].scale(this.t)));
            }
            points = nextPoints;
        }

        this.point = points[0]; // The final point is the point on the curve at t
    }
}

class BezierPoint extends BezierCurve {
    private readonly z: number;
    private readonly centerPoint: Vector3;

    public point: Vector3;
    public tangent: Vector3;
    public pointing: Vector3;

    constructor(controlPoints: Vector3[], t: number, z: number, centerPoint: Vector3) {
        super(controlPoints, t);

        this.z = z;
        this.centerPoint = centerPoint;

        const bezier: BezierCurve = new BezierCurve(controlPoints, t);
        this.point = bezier.point;
        this.tangent = bezier.tangent;
        this.getPointing();
    }

    private getPointing(): void {
        this.pointing = new Vector3(this.tangent.y, -this.tangent.x, this.z);
        this.pointing = this.pointing.subtract(this.centerPoint).normalize();
        this.pointing.x = Math.round(this.pointing.x * 1000)/1000
        this.pointing.y = Math.round(this.pointing.y * 1000)/1000
        this.pointing.z = Math.round(this.pointing.z * 1000)/1000
    }
}

class Pattern {
    private readonly controlPoints: Vector3[];
    private readonly zPattern: Distribution;
    private readonly timePattern: Distribution;
    private readonly time: number;
    private readonly FPS: number;

    private readonly centerPoint: Vector3;
    private readonly steps: number;
    public directionVector: Vector3[] = [];

    constructor(
        controlPoints: Vector3[],
        zPattern: number[],
        timePattern: number[],
        time: number,
        FPS: number = 60
    ) {
        this.controlPoints = controlPoints;
        this.centerPoint = new Vector3(0, 0, 0);
        this.time = time;
        this.FPS = FPS;

        this.steps = this.FPS * this.time;

        this.zPattern = new Distribution(zPattern, this.steps);
        this.timePattern = new Distribution(timePattern, this.steps);
        this.createPattern();
    }

    private createPattern() {
        for (let i = 0; i < this.steps; i++) {
            const bezierPoint = new BezierPoint(this.controlPoints, this.timePattern.list[i], this.zPattern.list[i], this.centerPoint);
            this.directionVector.push(new Vector3(bezierPoint.pointing.x, bezierPoint.pointing.y, bezierPoint.pointing.z));
        }
    }
}

export { Pattern };
