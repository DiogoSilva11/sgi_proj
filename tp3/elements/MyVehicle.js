import * as THREE from 'three';

class MyVehicle extends THREE.Group {
    constructor(x = 9, y = 0.6, z = 0) {
        super();
        this.type = 'Group';

        this.x = x;
        this.y = y;
        this.z = z;

        this.buildVehicle();
    }

    buildVehicle() {
        this.createBody();
        this.createWheels();
    }

    createBody() {
        const texture = new THREE.TextureLoader().load("./images/car.jpg");
        const material = new THREE.MeshBasicMaterial({ map: texture });

        let geometry = new THREE.BoxGeometry(1, 0.5, 2);
        this.body = new THREE.Mesh(geometry, material);
        this.body.position.set(this.x, this.y, this.z);
        this.add(this.body);

        geometry = new THREE.BoxGeometry(1, 0.3, 1.2);
        this.roof = new THREE.Mesh(geometry, material);
        this.roof.position.set(this.x, this.y + 0.4, this.z + 0.1);
        this.add(this.roof);
    }

    createWheels() {
        this.wheels = []
        const texture = new THREE.TextureLoader().load("./images/tire.png");
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const geometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1);

        const wheel1 = new THREE.Mesh(geometry, material);
        wheel1.rotation.z = Math.PI / 2;
        wheel1.position.set(-0.5, -0.2, -0.5);
        this.wheels.push(wheel1);

        const wheel2 = new THREE.Mesh(geometry, material);
        wheel2.rotation.z = Math.PI / 2;
        wheel2.position.set(0.5, -0.2, -0.5);
        this.wheels.push(wheel2);

        const wheel3 = new THREE.Mesh(geometry, material);
        wheel3.rotation.z = Math.PI / 2;
        wheel3.position.set(-0.5, -0.2, 0.5);
        this.wheels.push(wheel3);

        const wheel4 = new THREE.Mesh(geometry, material);
        wheel4.rotation.z = Math.PI / 2;
        wheel4.position.set(0.5, -0.2, 0.5);
        this.wheels.push(wheel4);

        for (const wheel of this.wheels)
            this.body.add(wheel);
    }
}

export { MyVehicle };