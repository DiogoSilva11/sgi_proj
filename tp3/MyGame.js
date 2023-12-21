import * as THREE from 'three';
import { MyReader } from "./MyReader.js";

class MyGame {
    constructor(app) {
        this.app = app;
        this.reader = null;
        this.playerName = null;
        this.selectedCar = null;
        this.selectedOpponentCar = null;
        this.difficultyLevel = 1;

        this.spriteSize = 32 / 512;
    }

    init() {
        this.mainMenu();
    }

    mainMenu() {
        this.app.setActiveCamera('Front');

        this.menu = new THREE.Group();
        this.menu.add(this.createSprite('TURBO RACERS', 0xbd8b02, -0.2, 0.7, 1, 10, 2, 7));
        this.menu.add(this.createSprite('Diogo Silva', 0x999999, 0, 0.35, 0.6, 5, 1.2, 4.5));
        this.menu.add(this.createSprite('Tomás Pires', 0x999999, -0.1, 0.35, 0.6, 5, 1.2, 3));
        this.menu.add(this.createSprite('SGI FEUP', 0x999999, 0, 0.4, 0.6, 5, 1.2, 1.5));
        this.menu.add(this.createSprite('Start', 0x089611, 0, 0.45, 0.8, 3.5, 1.2, -3));
        this.app.scene.add(this.menu);

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        document.addEventListener('click', (event) => {
            event.preventDefault();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, this.app.getActiveCamera());
            const intersects = raycaster.intersectObjects(this.menu.children);
            if (intersects.length > 0) {
                const selectedObject = intersects[0].object;
                if (selectedObject === this.start) {
                    this.gameplay();
                    this.app.scene.remove(this.menu);
                }
            }
        });
    }

    createSprite(text, color, pos, offset, scale, width, height, y) {
        const sprites = new THREE.Group();
        let x = pos;
        for (let i = 0; i < text.length; i++) {
            const character = text.charAt(i);
            const column = character.charCodeAt(0) % 16; 
            const row = 15 - Math.floor(character.charCodeAt(0) / 16); 

            const texture = new THREE.TextureLoader().load('images/spritesheet.png');
            const material = new THREE.SpriteMaterial({
                map: texture,
                color: color
            });
            material.map.repeat.set(this.spriteSize, this.spriteSize);
            material.map.offset.set(column * this.spriteSize, row * this.spriteSize);

            const sprite = new THREE.Sprite(material);
            x = x + offset;
            let center = offset * text.length / 2;
            sprite.position.x = x - center;
            sprite.scale.set(scale, scale, scale);
            sprites.add(sprite);

            switch (text) {
                case 'Diogo Silva':
                    if (character === 'D' || character === 'S') x += 0.1;
                    else if (character === 'i' || character === 'l') x -= 0.1;
                    break;
                case 'Tomás Pires':
                    if (character === 'i') x -= 0.1;
                    else if (character === 'r') x -= 0.1;
                    else if (character === 'm') x += 0.15;
                    else if (character === 'P') x += 0.1;
                    break;
                case 'SGI FEUP':
                    if (character === 'G') x += 0.1;
                    else if (character === 'I') x -= 0.2;
                    break;
                case 'Start':
                    if (character === 'S') x += 0.1;
                    else if (character === 't') x -= 0.1;
                    else if (character === 'r') x -= 0.05;
                    break;
                default:
                    break;
            }
        }

        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
        if (text === 'Start') {
            this.start = new THREE.Mesh(geometry, material);
            this.start.add(sprites);
            this.start.position.y = y;
            return this.start;
        }
        const mesh = new THREE.Mesh(geometry, material);
        mesh.add(sprites);
        mesh.position.y = y;
        return mesh;
    }

    gameplay() {
        this.app.activateControls();

        this.reader = new MyReader(this.app);
        this.reader.init();

        this.keyListener = (event) => {
            if (event.key === 'w')  this.reader.playerCar.accelerate();
            else if (event.key === 's')  this.reader.playerCar.brake();
            else if (event.key === 'a')  this.reader.playerCar.turnLeft();
            else if (event.key === 'd')  this.reader.playerCar.turnRight();
            else if (event.key === 'Escape') {
                this.app.deactivateControls();
                document.removeEventListener('keydown', this.keyListener);
                if (this.reader) {
                    this.reader.remove();
                    this.reader = null;
                }
                this.overMenu();
            }
        };

        document.addEventListener('keydown', this.keyListener);
    }

    overMenu() {
        this.app.setActiveCamera('Front');

        this.over = new THREE.Group();
        this.over.add(this.createSprite('GAME OVER', 0xbd8b02, -0.2, 0.7, 1, 10, 2, 7));
        this.app.scene.add(this.over);
    }

    update() {
        if (this.reader !== null) {
            this.reader.update();
        }
    } 
}

export { MyGame };