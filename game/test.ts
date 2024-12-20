import {OBB} from "./entities/hitboxes/OBB";
import {Vector3} from "../math/Vector";
import {CollisionManager} from "./entities/hitboxes/Collision";

const OBB1 = new OBB(
    new Vector3(0, 0, 0),
    [
        new Vector3(1, 0, 0),
        new Vector3(0, 1, 0),
        new Vector3(0, 0, 1),
    ],
    new Vector3(1, 1, 1),
)

const OBB2 = new OBB(
    new Vector3(0, 0, 2),
    [
        new Vector3(1, 0, 0),
        new Vector3(0, 1, 0),
        new Vector3(0, 0, 1),
    ],
    new Vector3(1, 1, 1),
)


toString(OBB1);
toString(OBB2);

function toString(matrix: OBB) {
    let s = "((\n"
    const m = matrix.toMatrix()
    m.forEach((vector) => {
        s += ("(" + vector + "),\n");
    })

    console.log(s + "))");
}

console.log(new CollisionManager(OBB1, OBB2).result.collisionPoint)


/*

let player = new Player(
    100,
    5,
    playerHitbox,
    10,
    new Vector3(1, 1, 1),
);

const keys = {
    up: false,
    down: false,
    left: false,
    right: false,
};


document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
        case "w":
            keys.up = true;
            break;
        case "ArrowDown":
        case "s":
            keys.down = true;
            break;
        case "ArrowLeft":
        case "a":
            keys.left = true;
            break;
        case "ArrowRight":
        case "d":
            keys.right = true;
            break;
    }
});

document.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "ArrowUp":
        case "w":
            keys.up = false;
            break;
        case "ArrowDown":
        case "s":
            keys.down = false;
            break;
        case "ArrowLeft":
        case "a":
            keys.left = false;
            break;
        case "ArrowRight":
        case "d":
            keys.right = false;
            break;
    }
});


let gameManager = new GameManager(player);

function gameLoop() {
    console.log(keys)
    gameManager.playerMove(keys);

    console.log(gameManager.getPlayer.getPosition)

    let t = document.getElementById("test");
    // @ts-ignore
    t.innerText = gameManager.getPlayer.getPosition.toString();
    setTimeout(() => gameLoop(), 1);
}

gameLoop();

 */