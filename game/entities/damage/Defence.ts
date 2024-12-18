class Defence{
    private _reduction: number;
    private _name: string;

    constructor(reduction: number, name: string){
        this._reduction = reduction;
        this._name = name;
    }

    set reduction(reduction: number){
        this._reduction = reduction;
    }

    get reduction(){
        return this._reduction;
    }

    set name(name: string){
        this._name = name;
    }

    get name(): string {
        return this._name;
    }
}

export {Defence};