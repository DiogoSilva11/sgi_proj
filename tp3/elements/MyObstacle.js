import * as THREE from 'three';

class MyObstacle {
    constructor(type, x, y, z) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.z = z;

        this.duration = 0;
        this.mesh = null;
        this.buildObstacle();
    }

    buildObstacle() {
        let texFile = null;
        switch (this.type) {
            case "Dizzy":
                texFile = 'dizzy.png';
                this.duration = 200;
                break;
            case "Block":
                texFile = 'block.jpg';
                this.duration = 150;
                break;
            case "Slow":
                texFile = 'slow.jpg';
                this.duration = 200;
                break;
            default:
                break;
        }

        const texture = new THREE.TextureLoader().load('./images/' + texFile);
        texture.flipY = false;
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            shininess: 0
        });
        const geometry = new THREE.CylinderGeometry(1, 1, 0.3);

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = Math.PI / 2;
        this.mesh.rotation.z = Math.PI / 4;
        this.mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
        this.mesh.position.set(this.x, this.y + 1, this.z);
    }

    update() {
        this.mesh.rotation.y += 0.01;
    }
}

export { MyObstacle };