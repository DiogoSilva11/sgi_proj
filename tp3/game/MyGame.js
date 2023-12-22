import * as THREE from 'three';
import { MyReader } from "./MyReader.js";
import { MyMenu } from './MyMenu.js';
import { MyOver } from "./MyOver.js";

class MyGame {
    constructor(app) {
        this.app = app;
        this.reader = null;
        this.menu = null;
        this.over = null;
        this.playerCar = null;
        this.autoCar = null;
        this.state = 'menu';
        this.follow = false;
    }

    init() {
        this.reader = new MyReader(this.app);
        this.reader.init();

        this.mainMenu();
    }

    mainMenu() {
        this.state = 'menu';
        this.app.cameras['Perspective'].position.set(-100, 10, 50);
        this.app.cameras['Perspective'].lookAt(0, 0, 10);
        this.app.deactivateControls();

        this.menu = new MyMenu(this.app);
        this.menu.init();

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        this.carSelector = (event) => {
            event.preventDefault();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.app.getActiveCamera());
            const intersectCars = [];
            for (let i = 0; i < this.reader.cars.length; i++)
                intersectCars.push(raycaster.intersectObjects(this.reader.cars[i].children, true));
            for (let i = 0; i < intersectCars.length; i++) {
                if (intersectCars[i].length > 0) {
                    if (i < 3 && this.playerCar === null)
                        this.playerCar = this.reader.cars[i];
                    else if (i >= 3 && this.autoCar === null)
                        this.autoCar = this.reader.cars[i];

                    if (this.playerCar !== null && this.autoCar !== null)
                        document.removeEventListener('click', this.carSelector);
                }
            }
        }

        document.addEventListener('click', this.carSelector);

        this.menuListener = (event) => {
            if (this.playerCar !== null && this.autoCar !== null) {
                event.preventDefault();
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
                raycaster.setFromCamera(mouse, this.app.getActiveCamera());
                const intersectStart = raycaster.intersectObjects(this.menu.start.children, true);
                if (intersectStart.length > 0) {
                    document.removeEventListener('click', this.menuListener);
                    this.app.scene.remove(this.menu);
                    this.menu = null;
                    this.gameplay();
                }
            }
        };

        document.addEventListener('click', this.menuListener);
    }

    gameplay() {
        this.state = 'gameplay';
        this.app.activateControls();

        this.playerCar.position.set(-2, 0.4, 5);
        this.playerCar.rotation.y = 0;
        this.playerCar.angle = 0;

        this.autoCar.position.set(2, 0.4, 5);
        this.autoCar.rotation.y = 0;
        this.autoCar.angle = 0;

        this.reader.route.playAnimation(this.autoCar);

        this.follow = true;        
        this.gameListener = (event) => {
            if (event.key === 'w')  this.playerCar.accelerate();
            else if (event.key === 's')  this.playerCar.brake();
            else if (event.key === 'a')  this.playerCar.turnLeft();
            else if (event.key === 'd')  this.playerCar.turnRight();
            else if (event.key === 'q')  this.follow = !this.follow;
            else if (event.key === 'Escape') {
                document.removeEventListener('keydown', this.gameListener);
                this.follow = false;
                this.overMenu();
            }
        };

        document.addEventListener('keydown', this.gameListener);
    }

    overMenu() {
        this.state = 'over';
        this.app.cameras['Perspective'].position.set(-100, 10, 50);
        this.app.cameras['Perspective'].lookAt(0, 0, 10);
        this.app.deactivateControls();

        this.over = new MyOver(this.app);
        this.over.init();
    }

    followCar() {
        this.app.controls.target.x = this.playerCar.position.x;
        this.app.controls.target.z = this.playerCar.position.z;

        this.app.cameras['Perspective'].position.x = this.playerCar.position.x - 10;
        this.app.cameras['Perspective'].position.y = 10;
        this.app.cameras['Perspective'].position.z = this.playerCar.position.z - 10;
    }

    offTrack() {
        let x = this.playerCar.position.x;
        let z = this.playerCar.position.z;
        const points = this.reader.track.sampledPoints;

        let minDistance = 1000;
        let index = 0;
        for (let i = 0; i < 200; i++) {
            const distance = Math.sqrt(Math.pow(points[i].x - x, 2) + Math.pow(points[i].z - z, 2));
            if (distance < minDistance) {
                minDistance = distance;
                index = i;
            }
        }

        if (Math.abs(points[index].x - x) > 10 || Math.abs(points[index].z - z) > 10) {
            console.log('off track');
        }
    }

    update() {
        if (this.state === 'gameplay' && this.playerCar !== null && this.autoCar !== null) {
            let x = this.autoCar.position.x;
            let z = this.autoCar.position.z;
            if (this.playerCar.checkCollision(x, z)) this.playerCar.collide(x, z);
            else this.playerCar.update();

            x = this.playerCar.position.x;
            z = this.playerCar.position.z;
            if (this.autoCar.checkCollision(x, z)) this.autoCar.collide(x, z);
            else this.autoCar.update();

            if (this.app.controls !== null && this.follow) this.followCar();
            this.reader.route.update();

            this.offTrack();
        }
        else if (this.state === 'over') {
            this.over.update();
        }
    }
}

export { MyGame };