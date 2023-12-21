import { MyTrack } from "./elements/MyTrack.js";
import { MyRoute } from "./elements/MyRoute.js";
import { MyVehicle } from "./elements/MyVehicle.js";

class MyReader {
    constructor(app) {
        this.app = app;
        this.track = null;
        this.route = null;
        this.playerCar = null;
        this.autoCar = null;
    }

    init() {
        if (this.track === null) {
            this.track = new MyTrack();
            this.app.scene.add(this.track);
        }
        
        if (this.playerCar === null) {
            this.playerCar = new MyVehicle(-2, 0.7, 0);
            this.track.add(this.playerCar);
        }

        if (this.autoCar === null) {
            this.autoCar = new MyVehicle(0, 0.7, 0);
            this.track.add(this.autoCar);
        }

        if (this.route === null) {
            this.route = new MyRoute(this.app);
        }
    }

    followCar() {
        this.app.controls.target.x = this.playerCar.position.x;
        this.app.controls.target.z = this.playerCar.position.z;

        this.app.activeCamera.position.x = this.playerCar.position.x + Math.sin(this.playerCar.angle) * 10;
        this.app.activeCamera.position.z = this.playerCar.position.z + Math.cos(this.playerCar.angle) * 10;
    }

    update() {
        this.route.update();
        this.playerCar.update();
        if (this.app.controls !== null) {
            this.followCar();
        }
    }
}

export { MyReader };