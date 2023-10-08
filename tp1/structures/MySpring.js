import * as THREE from 'three';
import { MyStructure } from '../MyStructure.js';

class MySpring extends MyStructure {
    constructor(parent, rad, loops, x, y, z) {
        super(parent);
        this.type = 'Group';
        this.samples = 8
        this.radius = rad;
        this.loops = loops;
        this.rise = 0.03;
        this.x = x;
        this.y = y;
        this.z = z;
        this.buildSpring();
        parent.add(this);
    }

    /**
     * builds a spring.
     */
    buildSpring() {
        const springMaterial = new THREE.LineBasicMaterial(
            { color: 0x333333 }
        );

        const halfCurve = new THREE.CubicBezierCurve3(
            new THREE.Vector3( this.radius, 0, 0),
            new THREE.Vector3( this.radius, this.rise * (1/3), this.radius * (4/3)),
            new THREE.Vector3(-this.radius, this.rise * (2/3), this.radius * (4/3)),
            new THREE.Vector3(-this.radius, this.rise, 0)
        );
        const half = new THREE.BufferGeometry().setFromPoints(
            halfCurve.getPoints(this.samples)
        );

        for(let i=0; i < this.loops; i++) {
            let m1 = new THREE.Line(half, springMaterial);
            m1.position.y = this.rise * (2*i);
            let m2 = new THREE.Line(half, springMaterial);
            m2.rotation.y = Math.PI;
            m2.position.y = this.rise * (2*i+1);

            this.add(m1, m2);
        }

        this.position.x = this.x;
        this.position.y = this.y;
        this.position.z = this.z;

        this.parent.add(this)
    }
}

export { MySpring };