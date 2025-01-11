import {Defence} from "../Defence";

abstract class Effect {
    private readonly duration: number;
    private readonly startTime: number;
    private readonly endTime: number;

    protected constructor(duration: number) {
        this.duration = duration;
        this.startTime = performance.now();
        this.endTime = this.startTime + this.duration;
    }

    public isActive(): boolean{
        return this.endTime <= performance.now();
    }
}

export {Effect};