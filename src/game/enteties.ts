import {Player} from "./entities/Player";
import {OBB} from "./entities/hitboxes/OBB";
import {Vector3} from "../math/Vector";

const defaultAxis: [Vector3, Vector3, Vector3] = [
    new Vector3(1, 0, 0),
    new Vector3(0, 1, 0),
    new Vector3(0, 0, 1),
]

const playerHitbox = new OBB(
    defaultAxis,
    new Vector3(0.25, 1, 0.25),
)

const player = new Player(
    100,
    5,
    playerHitbox,
    9,
    new Vector3(0, 1, 0),
)



export {player}