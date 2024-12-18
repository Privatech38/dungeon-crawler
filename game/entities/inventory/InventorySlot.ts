class InventorySlot {
    private item: Item;
    private amount: number;

    constructor(item: Item, amount: number) {
        this.item = item;
        this.amount = amount;
    }

    get getItem(): Item {
        return this.item;
    }

    set setItem(item: Item) {
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