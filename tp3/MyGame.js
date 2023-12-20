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
        this.menu();
    }

    menu() {
        this.app.setActiveCamera('Front');

        this.menu = new THREE.Group();
        this.gameLabel();
        this.authorLabels();
        this.startLabel();
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
                }
            }
        });
    }

    gameLabel() {
        const text = 'TURBO RACERS';
        const sprites = new THREE.Group();
        let x = -0.2;
        for (let i = 0; i < text.length; i++) {
            const character = text.charAt(i);
            const column = character.charCodeAt(0) % 16; 
            const row = 15 - Math.floor(character.charCodeAt(0) / 16); 

            const texture = new THREE.TextureLoader().load('images/spritesheet.png');
            const material = new THREE.SpriteMaterial({
                map: texture,
                color: 0xbd8b02
            });
            material.map.repeat.set(this.spriteSize, this.spriteSize);
            material.map.offset.set(column * this.spriteSize, row * this.spriteSize);

            const sprite = new THREE.Sprite(material);
            x = x + 0.7;
            let center = 0.7 * text.length / 2;
            sprite.position.x = x - center;
            sprites.add(sprite);
        }

        let geometry = new THREE.PlaneGeometry(10, 2);
        let material = new THREE.MeshBasicMaterial({ color: 0x000000 });
        this.game = new THREE.Mesh(geometry, material);
        this.game.add(sprites);
        this.game.position.y = 7;
        this.menu.add(this.game);
    }

    authorLabels() {
        let text = 'Diogo Silva';
        let sprites = new THREE.Group();
        let x = 0;
        for (let i = 0; i < text.length; i++) {
            const character = text.charAt(i);
            const column = character.charCodeAt(0) % 16; 
            const row = 15 - Math.floor(character.charCodeAt(0) / 16); 

            const texture = new THREE.TextureLoader().load('images/spritesheet.png');
            const material = new THREE.SpriteMaterial({
                map: texture,
                color: 0x999999
            });
            material.map.repeat.set(this.spriteSize, this.spriteSize);
            material.map.offset.set(column * this.spriteSize, row * this.spriteSize);

            const sprite = new THREE.Sprite(material);
            x = x + 0.35;
            let center = 0.35 * text.length / 2;
            sprite.position.x = x - center;
            sprite.scale.set(0.6, 0.6, 0.6);
            sprites.add(sprite);
            if (character === 'D' || character === 'S') x += 0.1;
            else if (character === 'i' || character === 'l') x -= 0.1;
        }

        let geometry = new THREE.PlaneGeometry(5, 1.2);
        let material = new THREE.MeshBasicMaterial({ color: 0x000000 });
        this.author1 = new THREE.Mesh(geometry, material);
        this.author1.add(sprites);
        this.author1.position.y = 4.5;
        this.menu.add(this.author1);

        text = "Tomás Pires";
        sprites = new THREE.Group();
        x = -0.1;
        for (let i = 0; i < text.length; i++) {
            const character = text.charAt(i);
            const column = character.charCodeAt(0) % 16; 
            const row = 15 - Math.floor(character.charCodeAt(0) / 16); 

            const texture = new THREE.TextureLoader().load('images/spritesheet.png');
            const material = new THREE.SpriteMaterial({
                map: texture,
                color: 0x999999
            });
            material.map.repeat.set(this.spriteSize, this.spriteSize);
            material.map.offset.set(column * this.spriteSize, row * this.spriteSize);

            const sprite = new THREE.Sprite(material);
            x = x + 0.35;
            let center = 0.35 * text.length / 2;
            sprite.position.x = x - center;
            sprite.scale.set(0.6, 0.6, 0.6);
            sprites.add(sprite);
            if (character === 'i') x -= 0.1;
            else if (character === 'r') x -= 0.1;
            else if (character === 'm') x += 0.15;
            else if (character === 'P') x += 0.1;
        }

        this.author2 = new THREE.Mesh(geometry, material);
        this.author2.add(sprites);
        this.author2.position.y = 3;
        this.menu.add(this.author2);

        text = "SGI FEUP";
        sprites = new THREE.Group();
        x = 0;
        for (let i = 0; i < text.length; i++) {
            const character = text.charAt(i);
            const column = character.charCodeAt(0) % 16; 
            const row = 15 - Math.floor(character.charCodeAt(0) / 16); 

            const texture = new THREE.TextureLoader().load('images/spritesheet.png');
            const material = new THREE.SpriteMaterial({
                map: texture,
                color: 0x999999
            });
            material.map.repeat.set(this.spriteSize, this.spriteSize);
            material.map.offset.set(column * this.spriteSize, row * this.spriteSize);

            const sprite = new THREE.Sprite(material);
            x = x + 0.4;
            let center = 0.4 * text.length / 2;
            sprite.position.x = x - center;
            sprite.scale.set(0.6, 0.6, 0.6);
            sprites.add(sprite);
            if (character === 'G') x += 0.1;
            else if (character === 'I') x -= 0.2;
        }

        geometry = new THREE.PlaneGeometry(5, 1.2);
        this.org = new THREE.Mesh(geometry, material);
        this.org.add(sprites);
        this.org.position.y = 1.5;
        this.menu.add(this.org);
    }

    startLabel() {
        const text = 'Start';
        const sprites = new THREE.Group();
        let x = 0;
        for (let i = 0; i < text.length; i++) {
            const character = text.charAt(i);
            const column = character.charCodeAt(0) % 16; 
            const row = 15 - Math.floor(character.charCodeAt(0) / 16); 

            const texture = new THREE.TextureLoader().load('images/spritesheet.png');
            const material = new THREE.SpriteMaterial({
                map: texture,
                color: 0x089611
            });
            material.map.repeat.set(this.spriteSize, this.spriteSize);
            material.map.offset.set(column * this.spriteSize, row * this.spriteSize);

            const sprite = new THREE.Sprite(material);
            x = x + 0.45;
            let center = 0.45 * text.length / 2;
            sprite.position.x = x - center;
            sprite.scale.set(0.8, 0.8, 0.8);
            sprites.add(sprite);
            if (character === 'S') x += 0.1;
            else if (character === 't') x -= 0.1;
            else if (character === 'r') x -= 0.05;
        }

        let geometry = new THREE.PlaneGeometry(3.5, 1.2);
        let material = new THREE.MeshBasicMaterial({ color: 0x000000 });
        this.start = new THREE.Mesh(geometry, material);
        this.start.add(sprites);
        this.start.position.y = -3;
        this.menu.add(this.start);
    }

    createSprite(text, color = 0x999999) {
        const sprites = new THREE.Group();

        let x = -0.2;
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
            x = (color === 0x999999) ? (x + 0.6) : (x + 1);
            let center = (color === 0x999999) ? (0.6 * text.length / 2) : (text.length / 2);
            sprite.position.x = x - center;
            if (color === 0x999999) sprite.scale.set(0.7, 0.7, 0.7);
            sprites.add(sprite);
            if (character === 'i' || character === 'l' || character === 't' || character === 'I') x -= 0.2;
        }

        return sprites;
    }

    gameplay() {
        this.app.scene.remove(this.menu);

        this.app.activateControls();

        this.reader = new MyReader(this.app);
        this.reader.init();

        // calling like this for now
        this.reader.route.playAnimation(this.reader.autoCar);

        // control playerCar using WASD keys
        document.addEventListener('keydown', (event) => {
            if (event.key === 'w') {
                this.reader.playerCar.accelerate();
            } else if (event.key === 's') {
                this.reader.playerCar.brake();
            } else if (event.key === 'a') {
                this.reader.playerCar.turnLeft();
            } else if (event.key === 'd') {
                this.reader.playerCar.turnRight();
            }
        });
    }

    update() {
        if (this.reader !== null) {
            this.reader.update();
        }
    } 
}

export { MyGame };