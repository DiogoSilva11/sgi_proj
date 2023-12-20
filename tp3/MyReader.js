import { MyTrack } from "./elements/MyTrack.js";
import { MyVehicle } from "./elements/MyVehicle.js";

class MyReader {
    constructor(app) {
        this.app = app;
        this.track = null;
        this.playerCar = null;
        this.autoCar = null;
    }

    init() {
        if (this.track === null) {
            this.track = new MyTrack();
            this.app.scene.add(this.track);
        }
        
        if (this.playerCar === null) {
            this.playerCar = new MyVehicle(9, 0.6, 0);
            this.track.add(this.playerCar);
        }

        if (this.autoCar === null) {
            this.autoCar = new MyVehicle(11, 0.6, 0);
            this.track.add(this.autoCar);
        }
    }

    update() {
    }
}

export { MyReader };