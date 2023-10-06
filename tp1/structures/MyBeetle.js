import * as THREE from 'three';
import { MyStructure } from '../MyStructure.js';

class MyBeetle extends MyStructure {
    constructor(parent, rad, cnvX, cnvY) {
        super(parent);
        this.type = 'Group';
        this.samples = 32
        this.tireRadius = rad;
        this.canvasX = cnvX;
        this.canvasY = cnvY;
        this.buildBeetle();
        parent.add(this);
    }

    /**
     * builds a drawing of a Beetle car.
     */
    buildBeetle() {
        const canvasMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
        const canvas = new THREE.PlaneGeometry(this.canvasX, this.canvasY);
        let canvasMesh = new THREE.Mesh(canvas, canvasMaterial);
        canvasMesh.rotation.y = Math.PI;
        canvasMesh.position.z = -0.05

        this.add(canvasMesh);

        const beetleMaterial = new THREE.LineBasicMaterial(
            { color: 0x000000 }
        );
        const halfCurve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(-this.tireRadius, 0, 0),
            new THREE.Vector3(-this.tireRadius, this.tireRadius*(4/3), 0),
            new THREE.Vector3(this.tireRadius, this.tireRadius*(4/3), 0),
            new THREE.Vector3(this.tireRadius, 0, 0)
        );
        const quarterCurve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(-this.tireRadius, 0, 0),
            new THREE.Vector3(-this.tireRadius, this.tireRadius, 0),
            new THREE.Vector3(0, this.tireRadius, 0)
        );

        const half = new THREE.BufferGeometry().setFromPoints(
            halfCurve.getPoints(this.samples)
        );
        const quarter = new THREE.BufferGeometry().setFromPoints(
            quarterCurve.getPoints(this.samples/2)
        );
        
        let tire1 = new THREE.Line(half, beetleMaterial);
        tire1.position.x = -this.tireRadius * (5/3);
        tire1.position.y = -this.tireRadius * (4/3);
        let tire2 = new THREE.Line(half, beetleMaterial);
        tire2.position.x = this.tireRadius * (5/3);
        tire2.position.y = -this.tireRadius * (4/3);

        let back = new THREE.Line(quarter, beetleMaterial);
        back.scale.set(8/3, 8/3, 1);
        back.position.y = -this.tireRadius * (4/3);

        let window = new THREE.Line(quarter, beetleMaterial);
        window.scale.set(4/3, 4/3, 1);
        window.rotation.z = -Math.PI/2;

        let nose = new THREE.Line(quarter, beetleMaterial);
        nose.scale.set(4/3, 4/3, 1);
        nose.rotation.z = -Math.PI/2;
        nose.position.x = this.tireRadius * (4/3);
        nose.position.y = -this.tireRadius * (4/3);

        canvasMesh.add(tire1, tire2, back, window, nose);
    }
}

export { MyBeetle };