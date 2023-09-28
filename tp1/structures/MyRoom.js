import * as THREE from 'three';

class MyRoom extends THREE.Object3D {
    constructor() {
        super();
        this.type = 'Group';
        this.floorMesh = null;
        this.wallMeshes = null;
        this.roomWidth = 20;
        this.roomDepth = 15;
        this.roomHeight = 10;
        this.buildRoom();
    }

    /**
     * builds the planes representing the walls and floor
     */
    buildRoom() {
        const floorMaterial = new THREE.MeshLambertMaterial({
            color: "#d9a066",
        });

        const wallMaterial = new THREE.MeshLambertMaterial({
            color: "#cbdbfc",
        });

        const floor = new THREE.PlaneGeometry(this.roomWidth, this.roomDepth)
        const xwall = new THREE.PlaneGeometry(this.roomDepth, this.roomHeight)
        const zwall = new THREE.PlaneGeometry(this.roomWidth, this.roomHeight)

        this.floorMesh = new THREE.Mesh(floor, floorMaterial);
        this.wallMeshes = [
            new THREE.Mesh(xwall, wallMaterial),
            new THREE.Mesh(zwall, wallMaterial),
            new THREE.Mesh(xwall, wallMaterial),
            new THREE.Mesh(zwall, wallMaterial)
        ]

        this.floorMesh.rotation.x = -Math.PI / 2;

        for(let wall of this.wallMeshes) {
            wall.position.y = this.roomHeight / 2;
        }

        this.wallMeshes[0].rotation.y = -Math.PI / 2;        // front wall
        this.wallMeshes[0].position.x = this.roomWidth / 2;
        this.wallMeshes[1].rotation.y = Math.PI;        // left wall
        this.wallMeshes[1].position.z = this.roomDepth / 2;
        this.wallMeshes[2].rotation.y = Math.PI / 2          // back wall
        this.wallMeshes[2].position.x = -this.roomWidth / 2;
        this.wallMeshes[3].rotation.y = 0;         // right wall
        this.wallMeshes[3].position.z = -this.roomDepth / 2;

        this.add(this.floorMesh)
        for (const wall of this.wallMeshes) this.add(wall)
    }
}

export { MyRoom };