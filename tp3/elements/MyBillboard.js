import * as THREE from 'three';

/**
 * This class represents a billboard
 * @extends THREE.Group
 */
class MyBillboard extends THREE.Group {
    /**
     * constructor
     * @param {number} x The x position
     * @param {number} y The y position
     * @param {number} z The z position
     */
    constructor(x, y, z) {
        super();
        this.type = 'Group';

        this.createBillboard();
        this.position.set(x, y + 6, z);
    }

    /**
     * Creates the billboard
     */
    createBillboard() {
        let material = new THREE.MeshPhongMaterial({ color: 0x333333 });
        let geometry = new THREE.BoxGeometry(1, 12, 6);
        let box = new THREE.Mesh(geometry, material);
        this.add(box);

        let texture = new THREE.TextureLoader().load('../images/billboard.png');
        material = new THREE.MeshPhongMaterial({ map: texture });
        geometry = new THREE.PlaneGeometry(5.5, 11);
        let poster = new THREE.Mesh(geometry, material);
        poster.rotation.y = - Math.PI / 2;
        poster.position.set(-0.55, 0, 0);
        this.add(poster);
    }
}

export { MyBillboard };
