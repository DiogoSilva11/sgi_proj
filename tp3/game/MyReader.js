import * as THREE from 'three';
import { MyTrack } from "../elements/MyTrack.js";
import { MyRoute } from "../elements/MyRoute.js";
import { MyVehicle } from "../elements/MyVehicle.js";

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
            this.route.playAnimation(this.autoCar);
        }
    }

    remove() {
        this.app.scene.remove(this.track);
        this.track = null;
        this.app.scene.remove(this.playerCar);
        this.playerCar = null;
        this.app.scene.remove(this.autoCar);
        this.autoCar = null;
        this.route = null;
    }

    followCar() {
        this.app.controls.target.x = this.playerCar.position.x;
        this.app.controls.target.z = this.playerCar.position.z;

        this.app.cameras['Perspective'].position.x = this.playerCar.position.x + 5;
        this.app.cameras['Perspective'].position.y = 10;
        this.app.cameras['Perspective'].position.z = this.playerCar.position.z + 5;
    }

    update() {
        this.route.update();
        let x = this.autoCar.position.x;
        let z = this.autoCar.position.z;
        if (this.playerCar.checkCollision(x, z)) this.playerCar.collide(x, z);
        else this.playerCar.update();
        if (this.app.controls !== null) {
            this.followCar();
        }
    }
}

export { MyReader };