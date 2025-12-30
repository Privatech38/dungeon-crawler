import {Enemy} from "game/entities/Enemy";
import {Vector3} from "math/Vector";
import {Room} from "./Room";
import {OBB} from "game/entities/hitboxes/OBB";
import { Weapon } from "game/entities/items/Weapon";

class EnemyGenerator {
    private maxEnemies: number;
    private enemyCount: number;
    private enemyList: Enemy[];

    private SPAWN_CHANCE = 1000;

    constructor(maxEnemies: number) {
        this.maxEnemies = maxEnemies;
        this.enemyList = [];
        this.enemyCount = 0;
    }

    public shouldEnemySpawn(): boolean {
        if (this.enemyCount >= this.maxEnemies) return false;

        let chance = Math.floor(Math.random() * (1000 - 0 + 1)) + 1000;
        if (chance > this.SPAWN_CHANCE) return false;

        this.SPAWN_CHANCE /= 1.5; // lower chance every time an enemy spawns
        return true;
    }

    public makeEnemy( room: Room ): Enemy {
        let enemy = new Enemy( 
            this.enemyHP(),
            this.enemySpeed(), 
            this.enemyHitbox(), 
            this.enemyPosition( room ), 
            // this.enemyWeapon()
        );

        this.enemyList.push(enemy);

        this.enemyCount++;
        return enemy;
    }

    private enemyHitbox(): OBB {
        const defaultAxis: [Vector3, Vector3, Vector3] = [
            new Vector3(1, 0, 0),
            new Vector3(0, 1, 0),
            new Vector3(0, 0, 1),
        ]

        const enemyHitbox = new OBB(
            defaultAxis,
            new Vector3(0.324, 0.7, 0.286),
        )

        return enemyHitbox;
    }

    private enemyHP(): number {
        // may differ given the enemy weapon type
        // melee high, ranged low

        return 100;
    }

    private enemySpeed(): number {
        // may differ given the enemy weapon type
        // melee high, ranged low

        return 2;
    }

    private enemyPosition( room: Room ): Vector3 {
        const min = 0, max = room.getFloors.length;
        let index = Math.floor(Math.random() * (max - min + 1)) + max;

        // select random floor
        let position: Vector3 = room.getFloors[index].getCenter; // modify if nececery
        return position;
    }

    private enemyWeapon()/*: Weapon*/ {
        // make weapon
    }
}

export {EnemyGenerator}