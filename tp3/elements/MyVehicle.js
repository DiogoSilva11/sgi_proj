import * as THREE from 'three';
import { MyPolygon } from './MyPolygon.js';

class MyVehicle extends THREE.Group {
    constructor(x = 9, y = 0.6, z = 0) {
        super();
        this.type = 'Group';

        this.x = x;
        this.y = y;
        this.z = z;
        this.speed = 0;
        this.angle = 0;
        this.angleOffset = 0;
        this.left = false;
        this.right = false;

        this.buildVehicle();
    }

    buildVehicle() {
        this.createStructure();
        this.createWindows();
        this.createWheels();
    }

    createStructure() {
        const texture = new THREE.TextureLoader().load("./images/car.jpg");
        const material = new THREE.MeshBasicMaterial({ map: texture });

        let geometry = new THREE.BoxGeometry(1, 0.5, 2);
        this.body = new THREE.Mesh(geometry, material);
        this.add(this.body);

        geometry = new THREE.BoxGeometry(1, 0.05, 0.7);
        this.roof = new THREE.Mesh(geometry, material);
        this.roof.position.set(0, 0.5, 0.1);
        this.add(this.roof);

        this.position.set(this.x, this.y, this.z);
    }

    createWindows() {
        this.windows = []
        const material = new THREE.MeshBasicMaterial({ color: 0xd4d6d6 });

        let geometry = new THREE.BoxGeometry(1, 0.32, 0.05);
        const window1 = new THREE.Mesh(geometry, material);
        window1.position.set(0, -0.12, -0.48);
        window1.rotation.x = Math.PI / 4;
        this.windows.push(window1);

        geometry = new THREE.BoxGeometry(1, 0.22, 0.05);
        const window2 = new THREE.Mesh(geometry, material);
        window2.position.set(0, -0.135, 0.375);
        this.windows.push(window2);

        geometry = new THREE.BoxGeometry(0.7, 0.22, 0.05);
        const window3 = new THREE.Mesh(geometry, material);
        window3.position.set(-0.48, -0.135, 0);
        window3.rotation.y = Math.PI / 2;
        this.windows.push(window3);

        const window4 = new THREE.Mesh(geometry, material);
        window4.position.set(0.48, -0.135, 0);
        window4.rotation.y = Math.PI / 2;
        this.windows.push(window4);

        geometry = new MyPolygon(0.7, 3, 3, 0xd4d6d6, 0xd4d6d6);
        const window5 = new THREE.Mesh(geometry, material);
        window5.position.set(-0.495, -0.19, -0.37);
        window5.rotation.x = Math.PI / 4;
        window5.rotation.y = - Math.PI / 2;
        window5.scale.set(0.3, 0.3, 0.3);
        this.windows.push(window5);

        const window6 = new THREE.Mesh(geometry, material);
        window6.position.set(0.495, -0.19, -0.37);
        window6.rotation.x = - Math.PI / 12;
        window6.rotation.y = Math.PI / 2;
        window6.scale.set(0.3, 0.3, 0.3);
        this.windows.push(window6);

        for (const window of this.windows)
            this.roof.add(window);
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

    accelerate() {
        if (this.speed < 0.3) this.speed += 0.1;
    }

    brake() {
        if (this.speed > -0.15) this.speed -= 0.05;
    }

    turnLeft() {
        this.left = true;
        this.right = false;
        this.angleOffset = 6;
    }

    turnRight() {
        this.right = true;
        this.left = false;
        this.angleOffset = 6;
    }

    turnWheels() {
        if (!this.left && !this.right) {
            this.wheels[0].rotation.y = 0;
            this.wheels[1].rotation.y = 0;
            return;
        }

        let value = 0;
        if (this.left) value = 6 * (10 - this.angleOffset);
        else if (this.right) value = -6 * (10 - this.angleOffset);
        this.wheels[0].rotation.y = THREE.MathUtils.degToRad(value);
        this.wheels[1].rotation.y = THREE.MathUtils.degToRad(value);
    }

    checkCollision(x, z) {
        return (Math.abs(this.position.x - x) < 1 && Math.abs(this.position.z - z) < 1);
    }
    
    collide(x, z) {
        const avoidanceDistance = 1.5;
        const moveX = this.position.x < x ? -avoidanceDistance : avoidanceDistance;
        const moveZ = this.position.z < z ? -avoidanceDistance : avoidanceDistance;
        this.position.x += moveX;
        this.position.z += moveZ;
        this.angle += THREE.MathUtils.degToRad(30);
        this.rotation.y = this.angle;
        this.turnWheels();
    }

    update() {
        this.position.x -= this.speed * Math.sin(this.angle);
        this.position.z -= this.speed * Math.cos(this.angle);

        this.angle = this.angle % (2 * Math.PI);
        let value = 10 * this.speed;

        if (this.right) {
            this.angle -= THREE.MathUtils.degToRad(value);
            this.angleOffset--;
            if (this.angleOffset == 0) {
                this.right = false;
                this.angleOffset = 0;
            }
            this.rotation.y = this.angle;
            this.turnWheels();
        }
        else if (this.left) {
            this.angle += THREE.MathUtils.degToRad(value);
            this.angleOffset--;
            if (this.angleOffset == 0) {
                this.left = false;
                this.angleOffset = 0;
            }
            this.rotation.y = this.angle;
            this.turnWheels();
        }
    }
}

export { MyVehicle };