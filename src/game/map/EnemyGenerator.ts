import {Enemy} from "/src/game/entities/Enemy.js";
import {Vector3} from "/src/math/Vector.js";
import {Room} from "./Room.js";
import {OBB} from "/src/game/entities/hitboxes/OBB.js";
import { Weapon } from "game/entities/items/Weapon.js";

class EnemyGenerator {
    private maxEnemies: number;
    private enemyCount: number;
    private enemyList: Enemy[];
    private minSafeDist: number;
    private playerPosition: Vector3;

    private SPAWN_CHANCE = 1000;

    constructor(maxEnemies: number, playerPosition: Vector3) {
        this.maxEnemies = maxEnemies;
        this.enemyList = [];
        this.minSafeDist = 3;
        this.enemyCount = 0;
        this.playerPosition = playerPosition;
    }

    public shouldEnemySpawn(): boolean {
        if (this.enemyCount >= this.maxEnemies) return false;

        let chance = Math.floor(Math.random() * 1000);
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
        const floors = room.getFloors;
        const max = floors.length;

        let fallback = floors[0].getCenter;

        for (let attempts = 0; attempts < 50; attempts++) {
            const index = Math.floor(Math.random() * max);
            const pos = floors[index].getCenter;

            if (this.calculateDistToPlayer(pos) >= this.minSafeDist) {
                return pos;
            }
        }

        return fallback;
    }

    private enemyWeapon()/*: Weapon*/ {
        // make weapon
    }

    private calculateDistToPlayer(position: Vector3) {
        const dx = position.x - this.playerPosition.x;
        const dy = position.y - this.playerPosition.y;
        const dz = position.z - this.playerPosition.z;

        return Math.sqrt(dx*dx + dy*dy + dz*dz);
    }
}

export {EnemyGenerator}