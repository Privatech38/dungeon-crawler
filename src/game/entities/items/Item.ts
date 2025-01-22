export class Item {
    private readonly name: string;
    private readonly description: string;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }

    get getName(): string {
        return this.name;
    }

    get getDescription(): string {
        return this.description;
    }
}
