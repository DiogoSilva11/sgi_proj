import * as THREE from 'three';

class MyObstacle {
    constructor(type, x, y, z) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.z = z;

        this.duration = 0;
        this.mesh = null;
        if (this.type === 'Speed Loss') {
            this.duration = 150;
            this.speedLoss();
        }
    }

    speedLoss() {
        const geometry = new THREE.CylinderGeometry(1, 1, 0.5);
        const material = new THREE.MeshPhongMaterial({
            color: 0x803030,
            specular: 0x999999,
            shininess: 30
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(this.x, this.y, this.z);
    }
}

export { MyObstacle };