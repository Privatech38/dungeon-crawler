import {Entity} from "./Entity";
import {Inventory} from "./inventory/Inventory";
import {Hitbox} from "./hitboxes/Hitbox";
import {InventorySlot} from "./inventory/InventorySlot";
import {Vector3} from "../../math/Vector";
import {PlayerMovement} from "./PlayerMovement";

class Player extends Entity {
    private inventory: Inventory;

    constructor(
        health: number,
        speed: number,
        hitbox: Hitbox,
        inventoryAmount: number,
        initialPosition: Vector3,
    ) {
        super(health, speed, hitbox, initialPosition);
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

    public setPosition(playerMovement: PlayerMovement) {
        this.updatePosition(playerMovement.getPosition())
    }

    get getInitialPosition(): Vector3{
        return this.initialPosition;
    }

    get getSpeed(): number{
        return this.speed;
    }
}

export { Player };