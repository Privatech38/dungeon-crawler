import {Effect} from "../../Effect";

class DebuffEffect extends Effect{
    private readonly _reduction: number;

    constructor(duration: number, reduction: number) {
        super(duration);
        this._reduction = reduction;
    }

    get reduction(): number {
        return this._reduction;
    }
}

export {DebuffEffect};