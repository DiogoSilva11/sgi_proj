import * as THREE from 'three';
import { MySprite } from '../elements/MySprite.js';

class MyOver extends THREE.Group {
    constructor(app) {
        super();
        this.type = 'Group';
        this.app = app;
    }

    init() {
        // to do
    }
}

export { MyOver };