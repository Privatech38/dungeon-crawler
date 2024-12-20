import {OBB} from "./entities/hitboxes/OBB";
import {Vector3} from "../math/Vector";
import {CollisionManager} from "./entities/hitboxes/Collision";
import {Matrix4x4} from "../math/Matrix4x4";

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

const OBB3 = OBB.fromMatrix(
    new Matrix4x4([
        [2,0,0,0],
        [0,2,0,0],
        [0,0,2,2],
        [0,0,0,1]
    ])
)

console.log(OBB3)
console.log(OBB3.toMatrix())