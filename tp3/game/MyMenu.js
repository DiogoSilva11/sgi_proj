import * as THREE from 'three';
import { MySprite } from '../elements/MySprite.js';

class MyMenu extends THREE.Group {
    constructor(app) {
        super();
        this.type = 'Group';
        this.app = app;

        this.input = null;
        this.start = null;
    }

    init() {
        let sprite = new MySprite('TURBO RACERS', 0xbd8b02, -0.2, 0.7, 1, 10, 2);
        let label = sprite.build();
        label.position.set(-87, 17, 44);
        label.rotation.y = - Math.PI / 2.6;
        this.add(label);

        sprite = new MySprite('Diogo Silva', 0x999999, 0, 0.35, 0.6, 5, 1.2);
        label = sprite.build();
        label.position.set(-88.9, 14.5, 39);
        label.rotation.y = - Math.PI / 2.6;
        this.add(label);

        sprite = new MySprite('Tomás Pires', 0x999999, -0.1, 0.35, 0.6, 5, 1.2);
        label = sprite.build();
        label.position.set(-85.1, 14.5, 49);
        label.rotation.y = - Math.PI / 2.6;
        this.add(label);

        sprite = new MySprite('SGI FEUP', 0xa35426, 0, 0.4, 0.6, 5, 1.2);
        label = sprite.build();
        label.position.set(-87, 14.5, 44);
        label.rotation.y = - Math.PI / 2.6;
        this.add(label);
        
        this.difficultyLevels();
        this.createInput();
        this.carLabels();

        this.app.scene.add(this);
    }

    difficultyLevels() {
        let sprite = new MySprite('DIFFICULTY', 0xa35426, 0, 0.5, 0.7, 6, 1.2);
        let label = sprite.build();
        label.position.set(-87, 6, 44);
        label.rotation.y = - Math.PI / 2.6;
        this.add(label);

        sprite = new MySprite('Normal', 0x444444, -0.15, 0.4, 0.6, 3, 1.2);
        label = sprite.build();
        label.position.set(-87, 4.5, 44);
        label.rotation.y = - Math.PI / 2.6;
        this.add(label);

        sprite = new MySprite('Hard', 0x444444, -0.15, 0.38, 0.6, 3, 1.2);
        label = sprite.build();
        label.position.set(-87, 3, 44);
        label.rotation.y = - Math.PI / 2.6;
        this.add(label);
    }

    carLabels() {
        let sprite = new MySprite('Pick Your Car', 0x999999, 0, 0.4, 0.6, 7, 1.2);
        let label = sprite.build();
        label.position.set(-92, 1, 29);
        label.rotation.y = - Math.PI / 2.6;
        this.add(label);

        sprite = new MySprite('Pick Opponent Car', 0x999999, -0.2, 0.4, 0.6, 8.5, 1.2);
        label = sprite.build();
        label.position.set(-80.7, 1, 59);
        label.rotation.y = - Math.PI / 2.6;
        this.add(label);
    }

    createInput() {
        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.style.position = 'absolute';
        this.input.style.top = '50%';
        this.input.style.left = '49%';
        this.input.style.transform = 'translate(-50%, -50%)';
        this.input.style.width = '200px';
        this.input.style.height = '35px';
        this.input.style.border = '5px solid #000';
        this.input.style.backgroundColor = '#000';
        this.input.style.color = '#fff';
        this.input.style.padding = '10px';
        document.body.appendChild(this.input);
    }

    removeInput() {
        document.body.removeChild(this.input);
    }

    startLabel() {
        const sprite = new MySprite('Start', 0x089611, -0.05, 0.4, 0.7, 3.5, 1.2);
        this.start = sprite.build();
        this.start.position.set(-89, 1, 44.9);
        this.start.rotation.y = - Math.PI / 2.6;
        this.add(this.start);
    }
}

export { MyMenu };