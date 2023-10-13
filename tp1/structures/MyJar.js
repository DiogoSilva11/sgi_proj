import * as THREE from 'three';
import { MyStructure } from '../MyStructure.js';
import { MyNurbsBuilder } from './../MyNurbsBuilder.js';

class MyJar extends MyStructure {
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

        this.buildJar();
        parent.add(this);
    }

    buildJar() {
        const map = new THREE.TextureLoader().load('textures/jar.jpg');
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
        
        this.buildJarNurb(material);

        this.position.x = this.x;
        this.position.y = this.y;
        this.position.z = this.z;
    }

    buildJarNurb(material) {
        // declare local variables
        let controlPoints;
        let surfaceData;
        let mesh;
        let orderU = 4
        let orderV = 4

        // build nurb #1
        controlPoints =
            [   // U = 0
                [ // V = 0..4;
                    [1.5, 0, 0, 1],
                    [1, 1, 0, 1],
                    [1, 2, 0, 1],
                    [1.8, 3, 0, 1],
                    [1.5, 4, 0, 1]
                ],
                // U = 1
                [ // V = 0..4
                    [1.5, 0, 0.7, 1],
                    [1, 1, 2, 1],
                    [1, 2, 2, 1],
                    [1.8, 3, 0, 1],
                    [1.5, 4, 0.7, 1]
                ],
                // U = 2
                [ // V = 0..4
                    [2, 0, 0.7, 1],
                    [2, 1, 2, 1],
                    [2, 2, 2, 1],
                    [2, 3, 0, 1],
                    [2, 4, 0.7, 1]
                ],
                // U = 3
                [ // V = 0..4
                    [2.5, 0, 0.7, 1],
                    [3, 1, 2, 1],
                    [3, 2, 2, 1],
                    [2.2, 3, 0, 1],
                    [2.5, 4, 0.7, 1]
                ],
                // U = 4
                [ // V = 0..4
                    [2.5, 0, 0, 1],
                    [3, 1, 0, 1],
                    [3, 2, 0, 1],
                    [2.2, 3, 0, 1],
                    [2.5, 4, 0, 1]
                ] 
            ]

        surfaceData = this.builder.build(controlPoints, orderU, orderV, this.samplesU, this.samplesV, material)  

        mesh = new THREE.Mesh(surfaceData, material);
        mesh.rotation.x = 0
        mesh.rotation.y = 0
        mesh.rotation.z = 0
        mesh.scale.set(1, 1, 1)
        mesh.position.set(0, 0, 0)
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        this.add(mesh)
        this.meshes.push(mesh)

        // build nurb #2
        controlPoints =
            [   // U = 0
                [ // V = 0..4;
                    [1.5, 0, 0, 1],
                    [1, 1, 0, 1],
                    [1, 2, 0, 1],
                    [1.8, 3, 0, 1],
                    [1.5, 4, 0, 1]
                ],
                // U = 1
                [ // V = 0..4
                    [1.5, 0, -0.7, 1],
                    [1, 1, -2, 1],
                    [1, 2, -2, 1],
                    [1.8, 3, 0, 1],
                    [1.5, 4, -0.7, 1]
                ],
                // U = 2
                [ // V = 0..4
                    [2, 0, -0.7, 1],
                    [2, 1, -2, 1],
                    [2, 2, -2, 1],
                    [2, 3, 0, 1],
                    [2, 4, -0.7, 1]
                ],
                // U = 3
                [ // V = 0..4
                    [2.5, 0, -0.7, 1],
                    [3, 1, -2, 1],
                    [3, 2, -2, 1],
                    [2.2, 3, 0, 1],
                    [2.5, 4, -0.7, 1]
                ],
                // U = 4
                [ // V = 0..4
                    [2.5, 0, 0, 1],
                    [3, 1, 0, 1],
                    [3, 2, 0, 1],
                    [2.2, 3, 0, 1],
                    [2.5, 4, 0, 1]
                ] 
            ]

        surfaceData = this.builder.build(controlPoints, orderU, orderV, this.samplesU, this.samplesV, material)  

        mesh = new THREE.Mesh(surfaceData, material);
        mesh.rotation.x = 0
        mesh.rotation.y = 0
        mesh.rotation.z = 0
        mesh.scale.set(1, 1, 1)
        mesh.position.set(0, 0, 0)
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        this.add(mesh)
        this.meshes.push(mesh)
    }
}

export { MyJar };