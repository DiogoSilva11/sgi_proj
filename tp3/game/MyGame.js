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

        this.menuListener = (event) => {
            event.preventDefault();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.app.getActiveCamera());
            const intersects = raycaster.intersectObjects(this.menu.children);
            if (intersects.length > 0) {
                const selectedObject = intersects[0].object;
                if (selectedObject === this.menu.start) {
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

        /*
        this.gameListener = (event) => {
            if (event.key === 'w')  this.reader.playerCar.accelerate();
            else if (event.key === 's')  this.reader.playerCar.brake();
            else if (event.key === 'a')  this.reader.playerCar.turnLeft();
            else if (event.key === 'd')  this.reader.playerCar.turnRight();
            else if (event.key === 'Escape') {
                document.removeEventListener('keydown', this.gameListener);
                if (this.reader) {
                    this.reader.remove();
                    this.reader = null;
                    this.removeElements();
                }
                this.mainMenu();
            }
        };

        document.addEventListener('keydown', this.gameListener);*/
    }

    overMenu() {
        this.state = 'over';

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

    update() {
        if (this.state === 'gameplay') {
            let x = this.autoCar.position.x;
            let z = this.autoCar.position.z;
            if (this.playerCar.checkCollision(x, z)) this.playerCar.collide(x, z);
            else this.playerCar.update();
            //if (this.app.controls !== null) this.followCar();
        }
        else if (this.state === 'over') {
            this.over.update();
        }
    } 
}

export { MyGame };