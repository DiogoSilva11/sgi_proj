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
        this.playerName = null;
        this.difficulty = 'normal';
        this.playerCar = null;
        this.autoCar = null;
        this.state = 'menu';
        this.follow = false;
        this.paused = false;
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

        this.inputListener = (event) => {this.playerName = event.target.value;}
        this.menu.input.addEventListener('input', this.inputListener);

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        this.difficultyListener = (event) => {
            event.preventDefault();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.app.getActiveCamera());
            const intersectNormal = raycaster.intersectObjects(this.menu.normal.children, true);
            const intersectHard = raycaster.intersectObjects(this.menu.hard.children, true);
            if (intersectNormal.length > 0) {
                this.menu.setDifficulty('normal');
                this.difficulty = 'normal';
            }
            else if (intersectHard.length > 0) {
                this.menu.setDifficulty('hard');
                this.difficulty = 'hard';
            }
        }
        document.addEventListener('click', this.difficultyListener);

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
                    if (i < 3) {
                        this.playerCar = this.reader.cars[i];
                        console.log('Player car: ', i);
                    }
                    else if (i >= 3) {
                        this.autoCar = this.reader.cars[i];
                        console.log('Auto car: ', i);
                    }
                }
            }
        }
        document.addEventListener('click', this.carSelector);

        this.startListener = (event) => {
            event.preventDefault();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.app.getActiveCamera());
            const intersectStart = raycaster.intersectObjects(this.menu.start.children, true);
            if (intersectStart.length > 0) {
                document.removeEventListener('click', this.difficultyListener);
                document.removeEventListener('click', this.carSelector);
                document.removeEventListener('click', this.startListener);
                this.menu.removeInput();
                this.app.scene.remove(this.menu);
                this.menu = null;

                this.playerCar.position.set(-2, 0.4, 8);
                this.playerCar.rotation.y = 0;
                this.playerCar.angle = 0;
        
                this.autoCar.position.set(2, 0.4, 5);
                this.autoCar.rotation.y = 0;
                this.autoCar.angle = 0;

                this.gameplay();
            }
        };
    }

    gameplay() {
        this.state = 'gameplay';
        this.app.activateControls();

        this.reader.route.playAnimation(this.autoCar);

        this.follow = true;        
        this.gameListener = (event) => {
            if (event.key === 'w')  this.playerCar.accelerate();
            else if (event.key === 's')  this.playerCar.brake();
            else if (event.key === 'a')  this.playerCar.turnLeft();
            else if (event.key === 'd')  this.playerCar.turnRight();
            else if (event.key === 'e')  this.follow = !this.follow;
            else if (event.key === 'q')  {
                if (this.paused) this.reader.route.clock.start();
                else this.reader.route.clock.stop();
                this.paused = !this.paused;
            }
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
        const points = this.reader.track.path.getPoints(this.reader.track.segments);
        let onTrack = false;
        for (const point of points)
            if (Math.abs(-point.x - x) < 5 && Math.abs(point.z - z) < 5)
                onTrack = true;

        if (onTrack) {
            if (this.playerCar.offTrack) {
                this.playerCar.offTrack = false;
                this.playerCar.maxSpeed = 0.4;
                this.playerCar.minSpeed = -0.2;
            }
            return;
        }

        if (!this.playerCar.offTrack) {
            this.playerCar.offTrack = true;
            this.playerCar.speed *= 0.2;
            this.playerCar.maxSpeed *= 0.2;
            this.playerCar.minSpeed *= 0.2;
        }
    }

    speedBoost() {
        if (this.playerCar.speedBoostTimer > 0) {
            console.log('Speed boost!');
        }
        else if (this.playerCar.checkCollision(this.reader.speedBoost.position.x, this.reader.speedBoost.position.z)) {
            this.playerCar.speedBoostTimer = 150;
        }
    }

    update() {
        if (this.state === 'menu') {
            if (this.playerName != null && this.playerName != '' && this.playerCar !== null
                && this.autoCar !== null && this.menu.start === null) {
                this.menu.startLabel();
                document.addEventListener('click', this.startListener);
            }
            if (this.menu.start !== null && this.playerName === '') {
                document.removeEventListener('click', this.startListener);
                this.menu.remove(this.menu.start);
                this.menu.start = null;
            }
        }
        else if (this.state === 'gameplay') {
            if (this.paused) return;
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
            this.speedBoost();
        }
        else if (this.state === 'over') {
            this.over.update();
        }
    }
}

export { MyGame };