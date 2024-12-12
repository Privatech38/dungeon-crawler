class Splash{
    startPosition: { x: number, y: number, z: number };
    targetPosition: { x: number, y: number, z: number };
    range: number; // distance to start + range
    radius: number; // from 0 to 360
    distance: number; // distance between you and where it renders (from start + distance to range)

    constructor(
        startPosition: { x: number, y: number, z: number },
        targetPosition: { x: number, y: number, z: number },
        range: number,
        radius: number,
        distance: number
    ) {
        this.startPosition = startPosition;
        this.targetPosition = targetPosition;
        this.range = range;
        this.radius = radius;
        this.distance = distance;
    }

}