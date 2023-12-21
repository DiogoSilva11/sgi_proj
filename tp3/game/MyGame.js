import * as THREE from 'three';
import { MyMenu } from './MyMenu.js';
import { MyReader } from "./MyReader.js";
import { MyOver } from "./MyOver.js";

class MyGame {
    constructor(app) {
        this.app = app;
        this.menu = null;
        this.reader = null;
        this.over = null;
    }

    init() {
        this.mainMenu();
    }

    mainMenu() {
        this.app.cameras['Perspective'].position.set(0, 0, 15);
        this.app.cameras['Perspective'].lookAt(0, 0, 0);
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
        this.app.activateControls();

        this.reader = new MyReader(this.app);
        this.reader.init();

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
                }
                this.mainMenu();
            }
        };

        document.addEventListener('keydown', this.gameListener);
    }

    overMenu() {
        this.over = new MyOver(this.app);
        this.over.init();
    }

    update() {
        if (this.reader !== null) this.reader.update();
        else if (this.over !== null) this.over.update();
    } 
}

export { MyGame };