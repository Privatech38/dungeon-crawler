import {InventorySlot} from "./InventorySlot.js";

class Inventory {
    private inventorySlots: InventorySlot[];
    private readonly slotAmount: number;

    constructor(slotAmount: number) {
        this.inventorySlots = new Array<InventorySlot>();
        this.slotAmount = slotAmount;
    }

    public addSlot(slot: InventorySlot) {
        if (this.inventorySlots.length >= this.slotAmount) return;
        this.inventorySlots.push(slot);
    }

    public removeSlot(slot: InventorySlot) {
        this.inventorySlots = this.inventorySlots.filter(s => s !== slot);
    }

    get InventorySlots(): InventorySlot[] {
        return this.inventorySlots;
    }
}

export {Inventory};