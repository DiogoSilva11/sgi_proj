import * as THREE from 'three';

class MyPowerUp {
    constructor(type, x, y, z) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.z = z;

        this.duration = 0;
        this.mesh = null;
        if (this.type === 'Speed Boost') {
            this.duration = 150;
            this.speedBoost();
        }
    }

    speedBoost() {
        const geometry = new THREE.PlaneGeometry(2, 4.5);
        const texture = new THREE.TextureLoader().load('./images/speed.jpg');
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            shininess: 0
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(this.x, this.y, this.z);
    }
}

export { MyPowerUp };