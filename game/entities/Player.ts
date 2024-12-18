import {Entity} from "./Entity";
import {Hitbox} from "./hitboxes/Hitbox";
import {Inventory} from "./inventory/Inventory";
import {InventorySlot} from "./inventory/InventorySlot";

class Player extends Entity {
    private inventory: Inventory;

    constructor(health: number, speed: number, hitbox: Hitbox, inventoryAmount: number)
    {
        super(health, speed, hitbox);
        this.inventory = new Inventory(inventoryAmount);
    }

    public addItem(item: Item, amount: number): void {
        this.inventory.InventorySlots.forEach(slot => {
            if (item.getName == slot.getItem.getName) {
                slot.setAmount += amount;
            }
        })
        this.inventory.addSlot(new InventorySlot(item, amount));
    }

    public removeItem(item: Item, amount: number): void {
        this.inventory.InventorySlots.forEach(slot => {
            if (slot.getItem.getName == item.getName) {
                slot.setAmount -= amount;
            }
        })
    }


}

export { Player };