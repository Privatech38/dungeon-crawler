import {Player} from "./entities/Player.js";
import {OBB} from "./entities/hitboxes/OBB.js";
import {Vector3} from "../math/Vector.js";

const defaultAxis: [Vector3, Vector3, Vector3] = [
    new Vector3(1, 0, 0),
    new Vector3(0, 1, 0),
    new Vector3(0, 0, 1),
]

const playerHitbox = new OBB(
    defaultAxis,
    new Vector3(0.324, 0.7, 0.286),
)

export const player = new Player(
    100,
    5,
    playerHitbox,
    9,
    new Vector3(0, 1, 0),
)
