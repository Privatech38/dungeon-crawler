import {Entity} from "../entities/Entity";
import {Attack} from "./attack/Attack";
import {Effect} from "../entities/damage/Effect";
import {Weapon} from "./Weapon";
import {Defence} from "../entities/damage/Defence";

class Damage{
    private entity: Entity[];
    private weapon: Weapon;

    constructor(entity: Entity[], weapon: Weapon) {
        this.entity = entity;
        this.weapon = Weapon;
    }


}