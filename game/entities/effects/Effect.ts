import {Defence} from "../Defence";

abstract class Effect {
    private readonly duration: number;
    private readonly startTime: number;
    private readonly endTime: number;

    protected constructor(duration: number) {
        this.duration = duration;
        this.startTime = Date.now();
        this.endTime = this.startTime + this.duration * 1000;
    }

    public isActive(): boolean{
        return this.endTime <= Date.now();
    }
}

export {Effect};