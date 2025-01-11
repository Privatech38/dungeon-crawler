import { Vector3 } from "../../math/Vector";

class Movement {
    private position: Vector3;
    private velocity: Vector3;
    private speed: number;
    private temp: Vector3;

    constructor(initialPosition: Vector3, speed: number) {
        this.position = initialPosition;
        this.velocity = new Vector3(0, 0, 0);
        this.speed = speed;
        this.temp = this.position.clone();
    }

    checkMovement(deltaTime: number): Vector3 {
        this.temp.x = this.position.x + this.velocity.x * deltaTime;
        this.temp.z = this.position.y + this.velocity.y * deltaTime;
        return this.temp.clone();
    }

    update() {
        // Update position based on velocity and deltaTime
        this.position = this.temp.clone();
    }

    setVelocity(x: number, z: number) {
        this.velocity.x = x;
        this.velocity.z = z;
    }

    set setSpeed(speed: number) {
        this.speed = speed;
    }

    get getSpeed(): number {
        return this.speed;
    }

    set setPosition(position: Vector3) {
        this.position = position.clone();
    }

    get getPosition(): Vector3 {
        return this.position;
    }
}

export {Movement}