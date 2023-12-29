import * as THREE from 'three';
import { MyReader } from "./MyReader.js";
import { MyMenu } from './MyMenu.js';
import { MyOver } from "./MyOver.js";
import { MyRoute } from "../elements/MyRoute.js";

class MyGame {
    constructor(app) {
        this.app = app;
        this.reader = null;
        this.menu = null;
        this.over = null;
        this.playerName = null;
        this.difficulty = 'normal';
        this.playerCar = null;
        this.playerIndex = 0;
        this.autoCar = null;
        this.autoIndex = 3;
        this.state = 'menu';
        this.follow = false;
        this.paused = false;
        this.elapsedTime = 0;
        this.playerTime = 0;
        this.lapCooldown = 0;
        this.maxLaps = 1;
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
                        this.playerIndex = i;
                    }
                    else if (i >= 3) {
                        this.autoCar = this.reader.cars[i];
                        this.autoIndex = i;
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

                this.gameplay();
            }
        };
    }

    gameplay() {
        this.playerCar.position.set(-2, 0.4, 8);
        this.playerCar.rotation.y = 0;
        this.playerCar.angle = 0;

        this.autoCar.position.set(2, 0.4, 5);
        this.autoCar.rotation.y = 0;
        this.autoCar.angle = 0;

        this.state = 'gameplay';
        this.app.activateControls();
        this.createHUD();

        this.reader.route.playAnimation(this.autoCar);
        this.follow = true;        

        this.accelerateListener = (event) => {if (event.key === 'w') this.playerCar.accelerate();};
        this.brakeListener = (event) => {if (event.key === 's') this.playerCar.brake();};
        this.turnLeftListener = (event) => {if (event.key === 'a') this.playerCar.turnLeft();};
        this.turnRightListener = (event) => {if (event.key === 'd') this.playerCar.turnRight();};
        this.gameListener = (event) => {
            if (event.key === 'e') this.follow = !this.follow;
            else if (event.key === 'q') {
                if (this.paused) this.reader.route.clock.start();
                else this.reader.route.clock.stop();
                this.paused = !this.paused;
            }
            else if (event.key === 'Escape') this.endGameplay();
        };

        document.addEventListener('keydown', this.accelerateListener);
        document.addEventListener('keydown', this.brakeListener);
        document.addEventListener('keydown', this.turnLeftListener);
        document.addEventListener('keydown', this.turnRightListener);
        document.addEventListener('keydown', this.gameListener);
    }

    endGameplay() {
        document.removeEventListener('keydown', this.accelerateListener);
        document.removeEventListener('keydown', this.brakeListener);
        document.removeEventListener('keydown', this.turnLeftListener);
        document.removeEventListener('keydown', this.turnRightListener);
        document.removeEventListener('keydown', this.gameListener);

        this.follow = false;
        document.body.removeChild(this.hud);

        for (const car of this.reader.cars) car.position.y = -5;

        this.playerCar.position.set(-85, 0.4, 21);
        this.playerCar.rotation.y = Math.PI / 1.7;
        this.playerCar.angle = Math.PI / 1.7;
        this.playerCar.updateLights();

        this.autoCar.position.set(-70, 0.4, 60);
        this.autoCar.rotation.y = Math.PI / 1.6;
        this.autoCar.angle = Math.PI / 1.6;
        this.autoCar.updateLights();

        this.gameOver();
    }

    gameOver() {
        this.state = 'over';
        this.app.cameras['Perspective'].position.set(-100, 10, 50);
        this.app.cameras['Perspective'].lookAt(0, 0, 10);
        this.app.deactivateControls();

        let autoTime = 0;
        if (Math.floor(this.elapsedTime / 1000) < this.maxLaps * 31) {
            autoTime = Math.floor(this.elapsedTime / 1000);
            this.playerTime = 999;
        }
        this.over = new MyOver(this.app, this.difficulty, this.playerTime, autoTime);
        this.over.init();

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        this.returnListener = (event) => {
            event.preventDefault();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.app.getActiveCamera());
            const intersectReturn = raycaster.intersectObjects(this.over.returnMenu.children, true);
            if (intersectReturn.length > 0) {
                document.removeEventListener('click', this.returnListener);
                document.removeEventListener('click', this.restartListener);
                this.app.scene.remove(this.over);
                this.over = null;

                this.reader.route = new MyRoute(this.app);
                for (const car of this.reader.cars) this.app.scene.remove(car);
                this.reader.cars = [];
                this.reader.createCars();
                this.playerName = null;
                this.difficulty = 'normal';
                this.playerCar = null;
                this.autoCar = null;
                this.follow = false;
                this.paused = false;
                this.elapsedTime = 0;
                this.playerTime = 0;
                this.lapCooldown = 0;

                this.mainMenu();
            }
        }
        document.addEventListener('click', this.returnListener);

        this.restartListener = (event) => {
            event.preventDefault();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.app.getActiveCamera());
            const intersectRestart = raycaster.intersectObjects(this.over.restart.children, true);
            if (intersectRestart.length > 0) {
                document.removeEventListener('click', this.returnListener);
                document.removeEventListener('click', this.restartListener);
                this.app.scene.remove(this.over);
                this.over = null;

                this.reader.route = new MyRoute(this.app);
                for (const car of this.reader.cars) this.app.scene.remove(car);
                this.reader.cars = [];
                this.reader.createCars();
                this.playerCar = this.reader.cars[this.playerIndex];
                this.autoCar = this.reader.cars[this.autoIndex];
                this.follow = false;
                this.paused = false;
                this.elapsedTime = 0;
                this.playerTime = 0;
                this.lapCooldown = 0;

                this.gameplay();
            }
        }
        document.addEventListener('click', this.restartListener);
    }

    createHUD() {
        this.hud = document.createElement('div');
        this.hud.style.position = 'absolute';
        this.hud.style.top = '1vw';
        this.hud.style.left = '45vw';
        this.hud.style.width = '200px';
        this.hud.style.height = 'auto';
        this.hud.style.backgroundColor = '#000';
        this.hud.style.color = '#fff';
        document.body.appendChild(this.hud);

        const title = document.createElement('div');
        title.innerText = 'GAME STATS';
        title.style.margin = '5px';
        title.style.textAlign = 'center';
        this.hud.appendChild(title);

        this.elapsedTimeElement = document.createElement('div');
        this.elapsedTimeElement.style.margin = '5px';
        this.hud.appendChild(this.elapsedTimeElement);

        this.lapsCompletedElement = document.createElement('div');
        this.lapsCompletedElement.style.margin = '5px';
        this.hud.appendChild(this.lapsCompletedElement);

        this.currentSpeedElement = document.createElement('div');
        this.currentSpeedElement.style.margin = '5px';
        this.hud.appendChild(this.currentSpeedElement);

        this.maxSpeedElement = document.createElement('div');
        this.maxSpeedElement.innerText = 'Max Speed: 100 km/h';
        this.maxSpeedElement.style.margin = '5px';
        this.hud.appendChild(this.maxSpeedElement);

        this.remainingTimeElement = document.createElement('div');
        this.remainingTimeElement.innerText = 'Remaining Time: 0 ms';
        this.remainingTimeElement.style.margin = '5px';
        this.hud.appendChild(this.remainingTimeElement);

        this.gameStatusElement = document.createElement('div');
        this.gameStatusElement.style.margin = '5px';
        this.hud.appendChild(this.gameStatusElement);
    }

    updateHUD() {
        this.elapsedTimeElement.innerText = 'Elapsed Time: ' + Math.floor(this.elapsedTime / 1000) + ' s';
        this.lapsCompletedElement.innerText = 'Laps Completed: ' + this.playerCar.laps + ' / 1';
        this.currentSpeedElement.innerText = 'Current Speed: ' + Math.floor(this.playerCar.speed * 250) + ' km/h';
        this.gameStatusElement.innerText = this.paused ? 'Game Status: Paused' : 'Game Status: Running';
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

    lapCompleted() {
        const finishLine = Math.abs(this.playerCar.position.x) < 5 && Math.abs(this.playerCar.position.z) < 1;
        if (finishLine && Math.floor(this.lapCooldown / 1000) > 10) {
            this.lapCooldown = 0;
            this.playerCar.laps++;
        }
    }

    speedBoost() {
        if (this.playerCar.speedBoostTimer == 0 && 
            this.playerCar.checkCollision(this.reader.speedBoost.position.x, this.reader.speedBoost.position.z)) {
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
            this.updateHUD();
            if (this.app.controls !== null && this.follow) this.followCar();
            if (this.paused) return;
            this.elapsedTime += 17;

            if (this.playerCar.laps < this.maxLaps) {
                this.lapCooldown += 17;
                this.playerTime = Math.floor(this.elapsedTime / 1000);
                this.lapCompleted();
            }

            let x = this.autoCar.position.x;
            let z = this.autoCar.position.z;
            if (this.playerCar.checkCollision(x, z)) this.playerCar.collide(x, z);
            else this.playerCar.update();
            this.offTrack();
            this.speedBoost();

            if (Math.floor(this.elapsedTime / 1000) < this.maxLaps * 31) {
                x = this.playerCar.position.x;
                z = this.playerCar.position.z;
                if (this.autoCar.checkCollision(x, z)) this.autoCar.collide(x, z);
                else this.autoCar.update();
                this.reader.route.update();
            }

            if (this.playerCar.laps === this.maxLaps && Math.floor(this.elapsedTime / 1000) >= this.maxLaps * 31)
                this.endGameplay();
        }
        else if (this.state === 'over') {
            this.over.update();
        }
    }
}

export { MyGame };