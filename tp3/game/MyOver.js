import * as THREE from 'three';
import { MySprite } from '../elements/MySprite.js';
import { MyFirework } from '../elements/MyFirework.js';

class MyOver extends THREE.Group {
    constructor(app) {
        super();
        this.type = 'Group';
        this.app = app;

        this.fireworks = [];
    }

    init() {
        // create a plane
        const geometry = new THREE.PlaneGeometry(10, 10);
        const material = new THREE.MeshPhongMaterial({
            color: "#00ffff", 
            specular: "#777777",
            emissive: "#000000",
            shininess: 30,
            side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = - Math.PI / 2;
        this.add(plane);

        this.app.scene.add(this);
    }

    update() {
        // add new fireworks every 20% of the calls
        if (Math.random() < 0.20) {
            this.fireworks.push(new MyFirework(this.app, this))
            console.log("firework added")
        }

        // for each fireworks 
        for (let i = 0; i < this.fireworks.length; i++) {
            // is firework finished?
            if (this.fireworks[i].done) {
                // remove firework 
                this.fireworks.splice(i, 1) 
                console.log("firework removed")
                continue 
            }
            // otherwise upsdate  firework
            this.fireworks[i].update()
        }
    }
}

export { MyOver };