class Vector {
    public x: number;
    public y: number;
    public z: number;
    public direction: Vector;
    public magnitude: number;
    public scaled: Vector;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public get_direction(v1: Vector): void {
        let v: Vector = new Vector(
            v1.x - this.x,
            v1.y - this.y,
            v1.z - this.z,
        )
        this.direction = new Vector(v.x, v.y, v.z);
    }

    public get_magnitude(): void {
        this.magnitude = Math.sqrt(
            this.x * this.x +
            this.y * this.y +
            this.z * this.z
        );
    }

    public get_scaled(scale: number): void {
        this.scaled = new Vector(
            this.x + this.direction.x * scale,
            this.y + this.direction.y * scale,
            this.z + this.direction.z * scale
        )
    }
}