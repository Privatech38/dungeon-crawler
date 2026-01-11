import {Enemy} from "/src/game/entities/Enemy.js";
import {Vector3} from "/src/math/Vector.js";
import {Room} from "./Room.js";
import {Floor} from "./Structures/Floor.js"
import {OBB} from "/src/game/entities/hitboxes/OBB.js";
import {Transform, Node} from '/src/engine/core.js';
import {GLTFLoader} from "/src/engine/loaders/GLTFLoader.js"
import { GameManager } from "./GameManager.js";
import { MeleeWeapon } from "./entities/items/MeleeWeapon.js";

class EnemyManager {
    private maxEnemies: number;
    private enemyCount: number = 0;
    private enemyList: Enemy[] = [];
    private enemyNodeList: Node[] = [];
    private MIN_SAFE_DIST: number = 5;
    private playerPosition: Vector3;

    private scene: Node;

    private MELEE_DMG = 2;
    private MELEE_SPAWN_CHANCE = 750
    private MELEE_NODE: Node;

    private PROJECTILE_DMG = 5;
    private PROJECTILE_SPAWN_CHANCE = 1000 - this.MELEE_SPAWN_CHANCE;

    MAX_COOLDOWN: number = 0.15;
    MIN_COOLDOWN: number = 0.05;

    private SPAWN_CHANCE = 0;
    private SPAWN_GROWTH = 1.2;

    private ENEMY_NODE: Node;


    constructor(maxEnemies: number, playerPosition: Vector3, scene: Node) {
        this.maxEnemies = maxEnemies;
        this.playerPosition = playerPosition;      
        this.scene = scene; 
    }

    public async init(): Promise<void> {
        const loader = new GLTFLoader();


        const enemyPath: string = 'assets/models/characters/skeleton/skeleton.gltf';
        await loader.load(enemyPath);
        this.ENEMY_NODE = loader.loadNode("Skeleton");
        this.ENEMY_NODE.addComponent(new Transform({
                translation: [0, 0, 0],
                rotation: [0, 0, 0, 1],
                scale: [1, 1, 1]
            }));
        this.ENEMY_NODE.setId = "ENEMY";

        const meleePath = 'assets/models/weapons/sword/sword.gltf';
        await loader.load(meleePath);
        this.MELEE_NODE = loader.loadNode("Sword");
        this.MELEE_NODE.addComponent(new Transform({
                translation: [0, 0, 0],
                rotation: [0, 0, 0, 1],
                scale: [1, 1, 1]
            }));
        this.MELEE_NODE.setId = "MELEE";
    }

    public generateEnemies(rooms: Room[], manager: GameManager): void {
        for (let room of rooms) {
            for (let floor of room.getFloors) {
                if (this.shouldEnemySpawn(floor)) {
                    const enemy = this.makeEnemy(floor);
                    manager.addEntity(enemy);
                }
            }
        }
    }

    public shouldEnemySpawn(floor: Floor): boolean {
        console.log("floor:", floor);
    
        if (this.enemyCount >= this.maxEnemies) return false;

        let chance = Math.floor(Math.random() * 1000);
        if (chance > this.SPAWN_CHANCE) {
            this.SPAWN_CHANCE = Math.floor( (this.SPAWN_CHANCE + 10) * this.SPAWN_GROWTH);
            return false;
        }

        if (floor.getCenter.magnitude() >= this.MIN_SAFE_DIST) {
            return true;
        }

        // if (this.calculateDistToPlayer(floor.getCenter) >= this.MIN_SAFE_DIST) {
        //     return true;       
        // }   

        return false;
    }

    public makeEnemy(floor: Floor): Enemy {
        const position = floor.getCenter;

        const enemyNode = this.makeEnemyNode(new Transform({
            translation: position.toArray,
            rotation: [0, 0, 0, 1],
            scale: [1, 1, 1]
        }));

        const enemy = new Enemy(
            this.enemyHP(),
            this.enemySpeed(), 
            this.enemyHitbox(position), 
            position, 
            enemyNode,
            4
        );

        const weapon = this.enemyMeleeWeapon(enemy, enemyNode);
        enemy.addWeapon(weapon);
        enemyNode.addChild(weapon.getNode);

        this.enemyList.push(enemy);
        this.enemyNodeList.push(enemyNode);

        this.enemyCount++;

        return enemy;
    }

    private enemyHitbox(position: Vector3): OBB {
        const defaultAxis: [Vector3, Vector3, Vector3] = [
            new Vector3(1, 0, 0),
            new Vector3(0, 1, 0),
            new Vector3(0, 0, 1),
        ]

        const enemyHitbox = new OBB(
            defaultAxis,
            new Vector3(0.324, 0.7, 0.286),
            position,
            true
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

        const index = Math.floor(Math.random() * max);
        const center = floors[index].getCenter;

        return new Vector3( center.x, center.y, center.z );
    }

    private enemyMeleeWeapon(enemy: Enemy, enemyNode: Node): MeleeWeapon {
        const weaponNode = this.makeWeaponNode(new Transform({
            translation: [0.4, 0.7, 0.1],
            rotation: [ Math.sin(Math.PI / 4), 0, 0, 1],
            scale: [1, 1, 1]
        }));

        enemyNode.addComponent(weaponNode);

        const cooldown = Math.floor(Math.random() * this.MAX_COOLDOWN) + this.MIN_COOLDOWN;

        const weapon = new MeleeWeapon(this.MELEE_DMG, enemy.getHitbox, enemy, cooldown, weaponNode );

        return weapon;
    }

    private makeWeaponNode(location: Transform): Node {
        const weaponClone = this.MELEE_NODE.clone();

        weaponClone.isStatic = false;
        weaponClone.addComponent(location);

        weaponClone.setId(`hladno_orozje${this.enemyCount}`);
        return weaponClone;
    }

    private makeEnemyNode(location: Transform): Node {    
        const enemyClone = this.ENEMY_NODE.clone();

        enemyClone.isStatic = false;
        enemyClone.addComponent(location);
        this.scene.addChild(enemyClone);

        enemyClone.setId(`opozicija_${this.enemyCount+1}`);
        return enemyClone;
    }


    private calculateDistToPlayer(position: Vector3) {

        const dx = position.x - this.playerPosition.x;
        const dy = position.y - this.playerPosition.y;
        const dz = position.z - this.playerPosition.z;

        return Math.sqrt(dx*dx + dy*dy + dz*dz);
    }
}

export {EnemyManager}