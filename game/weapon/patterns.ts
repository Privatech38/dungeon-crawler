import {Pattern} from "./Pattern";
import {Vector3} from "../../math/Vector";

const controlPointsSlash: Vector3[] = [
    new Vector3(0, -0.5, 0),
    new Vector3(0.5, -0.5, 0),
    new Vector3(0.5, 0.5, 0),
    new Vector3(0, 0.5, 0),
];


const slash: Pattern = new Pattern(
    controlPointsSlash,
    [0.5, -0.5],
    [0, 0.5],
)

export {
    slash,
}