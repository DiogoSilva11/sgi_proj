import * as THREE from 'three';
import { MySprite } from '../elements/MySprite.js';

class MyMenu extends THREE.Group {
    constructor(app) {
        super();
        this.type = 'Group';
        this.app = app;
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

        sprite = new MySprite('Start', 0x089611, 0, 0.45, 0.8, 3.5, 1.2);
        this.start = sprite.build();
        this.start.position.set(-87, 1, 44);
        this.start.rotation.y = - Math.PI / 2.6;
        this.add(this.start);
        
        this.carLabels();

        this.app.scene.add(this);
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
}

export { MyMenu };