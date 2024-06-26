import * as THREE from 'three';
import { MyStructure } from '../MyStructure.js';

/**
 * This class contains a 3D room representation
 */
class MyRoom extends MyStructure {
    /**
     * 
     * @param {THREE.Object3D} parent the parent object
     */
    constructor(parent) {
        super(parent);
        this.type = 'Group';
        this.floorMesh = null;
        this.wallMeshes = null;
        this.roomWidth = 20;
        this.roomDepth = 15;
        this.roomHeight = 10;
        this.buildRoom();
        parent.add(this);
    }

    /**
     * builds the planes representing the walls and floor
     */
    buildRoom() {
        const textureLoader = new THREE.TextureLoader();
        const woodTexture = textureLoader.load('textures/floor.jpg');
        woodTexture.wrapS = THREE.RepeatWrapping;
        woodTexture.wrapT = THREE.RepeatWrapping;

        const floorMaterial = new THREE.MeshLambertMaterial({
            map: woodTexture,
            color: "#d9a066"
        });

        const wallTexture = textureLoader.load('textures/wall.jpg');
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;

        const wallMaterial = new THREE.MeshLambertMaterial({
            map: wallTexture,
            color: "#cbdbfc"
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
        this.floorMesh.receiveShadow = true;

        for(let wall of this.wallMeshes) {
            wall.position.y = this.roomHeight / 2;
            wall.receiveShadow = true;
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