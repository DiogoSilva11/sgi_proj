import * as THREE from 'three';
import { MyStructure } from '../MyStructure.js';

class MyFlower extends MyStructure {
    constructor(parent, x, y, z) {
        super(parent);
        this.type = 'Group';

        this.x = x;
        this.y = y;
        this.z = z;
        this.numberOfSamples = 16;

        this.buildFlower();
        parent.add(this);
    }

    buildFlower() {
        this.buildStem();
        this.buildSeeds();
        this.buildPetals();
    }

    buildStem() {
        let points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0.5, 0),
            new THREE.Vector3(0, 1, 0.2),
            new THREE.Vector3(0.1, 1.5, 0),
            new THREE.Vector3(-0.1, 2, 0)
        ]
    
        let curve = new THREE.CatmullRomCurve3(points)    
        let curveGeometry = new THREE.TubeGeometry(curve, this.numberOfSamples, 0.05, 7, false);
        let curveMaterial = new THREE.MeshBasicMaterial({ color: 0x005d32 })
        const curveMesh = new THREE.Mesh(curveGeometry, curveMaterial);
        curveMesh.position.set(this.x, this.y, this.z)
        this.add(curveMesh);
    }

    buildSeeds() {
        const seedsGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.02, 16);
        const seedsMaterial = new THREE.MeshBasicMaterial({ color: 0xb1b522 }); 
        const seedsMesh = new THREE.Mesh(seedsGeometry, seedsMaterial);
        seedsMesh.position.set(this.x - 0.11, this.y + 2.02, this.z);
        seedsMesh.rotation.set(0, 0, Math.PI / 4);
        this.add(seedsMesh);
    }

    buildPetals() {
        const petals = new THREE.Group();
        const petalGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.02, 16);
        const petalMaterial = new THREE.MeshBasicMaterial({ color: 0xc4093d });

        const numPetals = 8;
        for (let i = 0; i < numPetals; i++) {
            const petalMesh = new THREE.Mesh(petalGeometry, petalMaterial);
            petalMesh.scale.set(2, 1, 1);

            const angle = (Math.PI * 2 * i) / numPetals;
            const xOffset = Math.cos(angle) * 0.2;
            const yOffset = 2.15;
            const zOffset = Math.sin(angle) * 0.2;
            petalMesh.position.set(this.x + xOffset, this.y + yOffset, this.z + zOffset);
            petalMesh.rotation.set(0, - angle, Math.PI / 6);
    
            petals.add(petalMesh);
        }

        petals.position.set(4.45, 0.15, 0);
        petals.rotateZ(Math.PI / 4);
        this.add(petals);
    }
}

export { MyFlower };