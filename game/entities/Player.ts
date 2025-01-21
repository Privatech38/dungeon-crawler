import {Entity} from "./Entity.js";
import {Inventory} from "./inventory/Inventory.js";
import {Hitbox} from "./hitboxes/Hitbox.js";
import {InventorySlot} from "./inventory/InventorySlot.js";
import {Vector3} from "../../math/Vector.js";
import {PlayerMovement} from "./PlayerMovement.js";

class Player extends Entity {
    public inventory: Inventory;
    private movement: PlayerMovement;

    constructor(
        health: number,
        speed: number,
        hitbox: Hitbox,
        inventoryAmount: number,
        initialPosition: Vector3,

    ) {
        super(health, speed, hitbox, initialPosition);
        this.inventory = new Inventory(inventoryAmount);
        this.movement = new PlayerMovement(initialPosition, speed);
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

    public move(keys: Set<string>, deltaTime: number) {
        this.movement.move(keys);
        this.position = this.movement.getPosition.clone();
    }

    get getInitialPosition(): Vector3{
        return this.initialPosition.clone();
    }

    get getSpeed(): number{
        return this.speed;
    }


}

export { Player };