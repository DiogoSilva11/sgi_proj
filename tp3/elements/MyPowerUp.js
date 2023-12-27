import * as THREE from 'three';

class MyPowerUp {
    constructor(type, x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

        if (type === 'speed') {
            return this.speedBoost();
        }
    }

    speedBoost() {
        const geometry = new THREE.PlaneGeometry(2, 4.5);
        const texture = new THREE.TextureLoader().load('./images/speed.jpg');
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            shininess: 0
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(this.x, this.y, this.z);
        return mesh;
    }
}

export { MyPowerUp };