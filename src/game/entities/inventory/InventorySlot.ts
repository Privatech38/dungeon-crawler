class InventorySlot {
    private item: any;
    private amount: number;

    constructor(item: any, amount: number) {
        this.item = item;
        this.amount = amount;
    }

    get getItem(): any {
        return this.item;
    }

    set setItem(item: any) {
        this.item = item;
    }

    get getAmount(): number {
        return this.amount;
    }

    set setAmount(amount: number) {
        this.amount = amount;
    }
}

export { InventorySlot };