import {GameManager} from "./GameManager.js";
import {Player} from "./entities/Player.js";

class Game {
    gameManager: GameManager;
    constructor(player: Player, surfaceArea: number) {
        this.gameManager = new GameManager(player, surfaceArea);
    }

    create() {
        this.gameManager.generateWorld();
    }

    update(
        keys: Set<string>,

    ) {
        this.gameManager.playerMove(keys);
        this.gameManager.entityMove();
    }
}