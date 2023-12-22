import * as THREE from 'three';
import { MyParkingLot } from '../elements/MyParkingLot.js';
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

        this.createGround();
        this.createLights();
        this.createStadium();
        this.createParkingLots();

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

        document.addEventListener('keydown', this.gameListener);
    }

    createGround() {
        const geometry = new THREE.PlaneGeometry(1000, 1000);
        let texture = new THREE.TextureLoader().load("./images/grass.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(100, 100);
        let material = new THREE.MeshPhongMaterial({ map: texture });
        this.ground = new THREE.Mesh(geometry, material);
        this.ground.rotation.x = - Math.PI / 2;
        this.ground.position.y = - 0.1;
        this.app.scene.add(this.ground);
    }

    createLights() {
        const light = new THREE.PointLight(0xffffff, 1000, 400);
        light.position.set(-30, 70, 10);
        this.app.scene.add(light);

        this.pole1 = this.createPole(15, 0, 20);
        this.app.scene.add(this.pole1);

        this.pole2 = this.createPole(20, 0, 60);
        this.app.scene.add(this.pole2);

        this.pole3 = this.createPole(5, 0, 100);
        this.pole3.rotation.y = - Math.PI / 4;
        this.app.scene.add(this.pole3);

        this.pole4 = this.createPole(-30, 0, 100);
        this.pole4.rotation.y = - Math.PI / 2;
        this.app.scene.add(this.pole4);

        this.pole5 = this.createPole(-65, 0, 75);
        this.pole5.rotation.y = - Math.PI;
        this.app.scene.add(this.pole5);

        this.pole6 = this.createPole(-75, 0, 40);
        this.pole6.rotation.y = - Math.PI;
        this.app.scene.add(this.pole6);

        this.pole7 = this.createPole(-80, 0, 0);
        this.pole7.rotation.y = - Math.PI;
        this.app.scene.add(this.pole7);

        this.pole8 = this.createPole(-55, 0, -30);
        this.pole8.rotation.y = - Math.PI;
        this.app.scene.add(this.pole8);

        this.pole9 = this.createPole(-20, 0, -70);
        this.pole9.rotation.y = Math.PI / 2;
        this.app.scene.add(this.pole9);

        this.pole10 = this.createPole(20, 0, -30);
        this.app.scene.add(this.pole10);
    }

    createPole(x, y, z) {
        let material = new THREE.MeshPhongMaterial({ color: 0x000000 });
        let sourceMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

        let geometry = new THREE.CylinderGeometry(0.3, 0.3, 20);
        let topGeo = new THREE.BoxGeometry(2, 0.6, 1);
        let sourceGeo = new THREE.BoxGeometry(1.4, 0.5, 1);

        const pole = new THREE.Mesh(geometry, material);
        const top = new THREE.Mesh(topGeo, material);
        top.position.set(-0.7, 10.3, 0);
        pole.add(top);
        const source = new THREE.Mesh(sourceGeo, sourceMat);
        source.position.set(-1, 9.75, 0);
        pole.add(source);
        const light = new THREE.PointLight(0xffffff, 200, 100);
        pole.add(light);
        pole.position.set(x, y + 8, z);
        
        return pole;
    }

    createStadium() {
        this.stadium = new THREE.Group();

        let material = new THREE.MeshPhongMaterial({ color: 0x000000 });
        let geometry = new THREE.BoxGeometry(1, 20, 100);
        let box = new THREE.Mesh(geometry, material);
        box.position.set(0, 9, 0);
        this.stadium.add(box);

        const texture = new THREE.TextureLoader().load("./images/seats.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 2);
        material = new THREE.MeshPhongMaterial({ map: texture });
        geometry = new THREE.BoxGeometry(1, 30, 100);
        let seats = new THREE.Mesh(geometry, material);
        seats.position.set(-10.5, 8, 0);
        seats.rotation.z = - Math.PI / 4;
        this.stadium.add(seats);

        this.stadium.position.set(50, 0, 20);
        this.app.scene.add(this.stadium);
    }

    createParkingLots() {
        this.playerPark = new MyParkingLot(-85, 0, 20);
        this.app.scene.add(this.playerPark);

        this.autoPark = new MyParkingLot(-70, 0, 60);
        this.app.scene.add(this.autoPark);

        this.obstaclePark = new MyParkingLot(-50, 0, 90);
        this.obstaclePark.rotation.y = Math.PI / 3.5;
        this.app.scene.add(this.obstaclePark);
    }

    removeElements() {
        this.app.scene.remove(this.pole1);
        this.app.scene.remove(this.pole2);
        this.app.scene.remove(this.pole3);
        this.app.scene.remove(this.pole4);
        this.app.scene.remove(this.pole5);
        this.app.scene.remove(this.pole6);
        this.app.scene.remove(this.pole7);
        this.app.scene.remove(this.pole8);
        this.app.scene.remove(this.pole9);
        this.app.scene.remove(this.pole10);
        this.app.scene.remove(this.stadium);
        this.app.scene.remove(this.ground);
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