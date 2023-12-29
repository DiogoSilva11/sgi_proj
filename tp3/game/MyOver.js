import * as THREE from 'three';
import { MySprite } from '../elements/MySprite.js';
import { MyFirework } from '../elements/MyFirework.js';

class MyOver extends THREE.Group {
    constructor(app, difficulty, playerTime, autoTime) {
        super();
        this.type = 'Group';
        this.app = app;
        this.difficulty = difficulty;
        this.playerTime = playerTime;
        this.autoTime = autoTime;

        this.fireworks = [];
        this.origin = this.playerTime < this.autoTime ? new THREE.Vector3(-88, 0.4, 17) : new THREE.Vector3(-69, 0.4, 65);

        this.restart = null;
        this.returnMenu = null;
    }

    init() {
        this.difficultyLabels();
        this.timeLabels();
        this.resultLabels();
        this.buttons();

        this.app.scene.add(this);
    }

    difficultyLabels() {
        let sprite = new MySprite('DIFFICULTY', 0xa35426, 0, 0.5, 0.7, 6, 1.2);
        let label = sprite.build();
        label.position.set(-87, 6, 44);
        label.rotation.y = - Math.PI / 2.6;
        this.add(label);

        if (this.difficulty === 'normal')
            sprite = new MySprite('Normal', 0x999999, -0.1, 0.35, 0.6, 3, 1.2);
        else if (this.difficulty === 'hard')
            sprite = new MySprite('Hard', 0x999999, -0.15, 0.35, 0.6, 3, 1.2);
        label = sprite.build();
        label.position.set(-87, 4.5, 44);
        label.rotation.y = - Math.PI / 2.6;
        this.add(label);
    }

    timeLabels() {
        let sprite = new MySprite('Time: ' + this.playerTime + ' s', 0x999999, 0.2, 0.3, 0.5, 5, 1.2);
        let label = sprite.build();
        label.position.set(-93.35, 1, 32.5);
        label.rotation.y = - Math.PI / 2.6;
        this.add(label);

        sprite = new MySprite('Time: ' + this.autoTime + ' s', 0x999999, 0, 0.3, 0.5, 5, 1.2);
        label = sprite.build();
        label.position.set(-83.7, 1, 57.7);
        label.rotation.y = - Math.PI / 2.6;
        this.add(label);
    }

    resultLabels() {
        let sprite = null;
        let x = 0;
        let y = 1;
        let z = 0;

        if (this.playerTime < this.autoTime) {
            sprite = new MySprite('Winner', 0x089611, 0, 0.4, 0.6, 4, 1.2);
            x = -92;
            z = 29; 
        }
        else {
            sprite = new MySprite('Winner', 0x089611, -0.2, 0.4, 0.6, 4, 1.2);
            x = -80.7;
            z = 59;
        }
        let label = sprite.build();
        label.position.set(x, y, z);
        label.rotation.y = - Math.PI / 2.6;
        this.add(label);

        if (this.playerTime < this.autoTime) {
            sprite = new MySprite('Loser', 0x960808, -0.15, 0.35, 0.6, 3, 1.2);
            x = -80.7;
            z = 59;
        }
        else {
            sprite = new MySprite('Loser', 0x960808, 0.05, 0.35, 0.6, 3, 1.2);
            x = -92;
            z = 29;
        }
        label = sprite.build();
        label.position.set(x, y, z);
        label.rotation.y = - Math.PI / 2.6;
        this.add(label);
    }

    buttons() {
        let sprite = new MySprite('Restart', 0x999999, 0, 0.35, 0.6, 4, 1.2);
        this.restart = sprite.build();
        this.restart.position.set(-87, 13.5, 44);
        this.restart.rotation.y = - Math.PI / 2.6;
        this.add(this.restart);

        sprite = new MySprite('Return To Menu', 0x999999, -0.1, 0.35, 0.6, 6.5, 1.2);
        this.returnMenu = sprite.build();
        this.returnMenu.position.set(-87, 15, 44);
        this.returnMenu.rotation.y = - Math.PI / 2.6;
        this.add(this.returnMenu);
    }

    update() {
        // add new fireworks every 20% of the calls
        if (Math.random() < 0.20) {
            this.fireworks.push(new MyFirework(this.app, this.origin))
        }

        // for each fireworks 
        for (let i = 0; i < this.fireworks.length; i++) {
            // is firework finished?
            if (this.fireworks[i].done) {
                // remove firework 
                this.fireworks.splice(i, 1) 
                continue 
            }
            // otherwise upsdate  firework
            this.fireworks[i].update()
        }
    }
}

export { MyOver };