import { Vector3 } from "../../math/Vector";

class Movement {
    private position: Vector3;
    private velocity: Vector3;
    private speed: number;

    constructor(initialPosition: Vector3, speed: number) {
        this.position = initialPosition;
        this.velocity = new Vector3(0, 0, 0);
        this.speed = speed;
    }

    update(deltaTime: number) {
        // Update position based on velocity and deltaTime
        this.position.x += this.velocity.x * deltaTime;
        this.position.z += this.velocity.z * deltaTime;
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
        this.position = position;
    }

    get getPosition(): Vector3 {
        return this.position;
    }
}

export {Movement}