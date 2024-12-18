import {Effect} from "../../Effect";

abstract class Debuff extends Effect{
    private readonly _reduction: number;

    protected constructor(duration: number, reduction: number) {
        super(duration);
        this._reduction = reduction;
    }

    get reduction(): number {
        return this._reduction;
    }
}

export {Debuff};