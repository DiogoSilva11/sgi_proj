import * as THREE from 'three';
import { MySprite } from '../elements/MySprite.js';

class MyMenu extends THREE.Group {
    constructor(app) {
        super();
        this.type = 'Group';
        this.app = app;
    }

    init() {
        let sprite = new MySprite('TURBO RACERS', 0xbd8b02, -0.2, 0.7, 1, 10, 2, 7);
        this.add(sprite.build());

        sprite = new MySprite('Diogo Silva', 0x999999, 0, 0.35, 0.6, 5, 1.2, 4.5);
        this.add(sprite.build());

        sprite = new MySprite('Tomás Pires', 0x999999, -0.1, 0.35, 0.6, 5, 1.2, 3);
        this.add(sprite.build());

        sprite = new MySprite('SGI FEUP', 0x999999, 0, 0.4, 0.6, 5, 1.2, 1.5);
        this.add(sprite.build());

        sprite = new MySprite('Start', 0x089611, 0, 0.45, 0.8, 3.5, 1.2, -3);
        this.start = sprite.build();
        this.add(this.start);
        
        this.app.scene.add(this);
    }
}

export { MyMenu };