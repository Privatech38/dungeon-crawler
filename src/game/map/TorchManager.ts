import {Room} from "./Room";
import {Torch} from "./Structures/Torch";

/**
 * This class's purpose is to hold all the active torches in the map so during render they can be used
 */
class TorchManager {
    lights: Array<Torch> = new Array<Torch>()

    loadToBuffer() {

    }

    addTorchesToRoom(room: Room) {

        room.getWalls.filter(wall => !wall.isDoor).forEach(wall => {

        })
    }

}