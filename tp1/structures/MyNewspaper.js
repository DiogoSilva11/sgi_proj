import * as THREE from 'three';
import { MyStructure } from '../MyStructure.js';
import { MyNurbsBuilder } from './../MyNurbsBuilder.js';

/**
 * This class contains a 3D newspaper representation
 */
class MyNewspaper extends MyStructure {
    /**
     * 
     * @param {THREE.Object3D} parent the parent object
     * @param {number} x the x position of the newspaper
     * @param {number} y the y position of the newspaper
     * @param {number} z the z position of the newspaper
     */
    constructor(parent, x, y, z) {
        super(parent);
        this.type = 'Group';
 
        this.samplesU = 24
        this.samplesV = 24

        this.builder = new MyNurbsBuilder()
        this.meshes = []

        this.x = x;
        this.y = y;
        this.z = z;

        this.buildNewspaper();
        parent.add(this);
    }

    /**
     * builds a newspaper.
     */
    buildNewspaper() {
        const map = new THREE.TextureLoader().load('textures/newspaper.jpg');
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        map.colorSpace = THREE.SRGBColorSpace;

        const material = new THREE.MeshLambertMaterial({
            map: map,
            side: THREE.DoubleSide
        });

        // are there any meshes to remove?
        if (this.meshes !== null) {
            // traverse mesh array
            for (let i = 0; i < this.meshes.length; i++) {
                // remove all meshes from the scene
                this.remove(this.meshes[i])
            }
            this.meshes = [] // empty the array  
        }
        
        this.buildNewspaperNurb(material);

        this.position.x = this.x;
        this.position.y = this.y;
        this.position.z = this.z;
    }

    /**
     * builds a newspaper nurb.
     */
    buildNewspaperNurb(material) {
        // declare local variables
        let controlPoints;
        let surfaceData;
        let mesh;
        let orderU = 4
        let orderV = 3

        // build nurb #1
        controlPoints =
            [   // U = 0
                [ // V = 0..3
                    [0, 0, -0.1, 1],
                    [0, 1, 0, 1],
                    [0, 2, 0, 1],
                    [0, 3, 0.15, 1]
                ],
                // U = 1
                [ // V = 0..3
                    [2.5, 0, 0, 1],
                    [2.5, 1, 0, 1],
                    [2.5, 2, 0, 1],
                    [2.5, 3, 0, 1]
                ],
                // U = 2
                [ // V = 0..3
                    [2, 0, -0.3, 1],
                    [2, 1, -0.3, 1],
                    [2, 2, -0.3, 1],
                    [2, 3, -0.3, 1]
                ],
                // U = 3
                [ // V = 0..3
                    [1.5, 0, 0, 1],
                    [1.5, 1, 0, 1],
                    [1.5, 2, 0, 1],
                    [1.5, 3, 0, 1]
                ],
                // U = 4
                [ // V = 0..3
                    [4, 0, 0.05, 1],
                    [4, 1, 0, 1],
                    [4, 2, 0, 1],
                    [4, 3, -0.1, 1]
                ],
            ]

        surfaceData = this.builder.build(controlPoints, orderU, orderV, this.samplesU, this.samplesV, material)  

        mesh = new THREE.Mesh(surfaceData, material);
        mesh.rotation.x = - Math.PI / 2
        mesh.rotation.y = 0
        mesh.rotation.z = 0
        mesh.scale.set(0.4, 0.4, 1)
        mesh.position.set(0, 0, 0)
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        this.add(mesh)
        this.meshes.push(mesh)
    }
}

export { MyNewspaper };