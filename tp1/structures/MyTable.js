import * as THREE from 'three';
import { MyStructure } from '../MyStructure.js';

class MyTable extends MyStructure {
    constructor(parent) {
        super(parent);
        this.type = 'Group';
        this.tableEnabled = true
        this.lastTableEnabled = null
        this.tableHeight = 4
        this.tableWidth = 7
        this.tableDepth = 5
        this.tabletopThickness = 0.5
        this.tableLegTopRadius = 0.5
        this.tableLegBottomRadius = 0.3
        this.buildTable();

        parent.add(this);
    }

    /**
     * builds a table with round legs
     */
    buildTable() {
        const textureLoader = new THREE.TextureLoader();
        const woodTexture = textureLoader.load('textures/wood.jpg');
        woodTexture.wrapS = THREE.RepeatWrapping;
        woodTexture.wrapT = THREE.RepeatWrapping;

        let tabletop = new THREE.BoxGeometry( 
            this.tableWidth, 
            this.tabletopThickness,
            this.tableDepth 
        )
        const tableTopMaterial = new THREE.MeshPhongMaterial({
            color: "#8f563b",
            map: woodTexture,
            shininess: 50,
            emissive: "#000000"
        });

        let leg = new THREE.CylinderGeometry( 
            this.tableLegTopRadius, 
            this.tableLegBottomRadius, 
            this.tableHeight - this.tabletopThickness,
            6 
        )
        const tableLegMaterial = new THREE.MeshPhongMaterial({
            color: "#8f563b",
            specular: "#bf866b",
            shininess: 50,
            emissive: "#000000"
        });

        let tabletopMesh = new THREE.Mesh(tabletop, tableTopMaterial)
        tabletopMesh.position.y = this.tableHeight - (this.tabletopThickness / 2)
        tabletopMesh.receiveShadow = true;
        tabletopMesh.castShadow = true;

        const legOffsX = this.tableWidth/2 - this.tableLegTopRadius
        const legOffsZ = this.tableDepth/2 - this.tableLegTopRadius
        const legHeight = this.tableHeight / 2 - this.tabletopThickness / 2
        const legPos = [
            [ legOffsX, legHeight, legOffsZ],
            [-legOffsX, legHeight, legOffsZ],
            [-legOffsX, legHeight,-legOffsZ],
            [ legOffsX, legHeight,-legOffsZ],
        ]

        for( let i=0; i < 4; i++ ) {
            let tableLeg = new THREE.Mesh(leg, tableLegMaterial)
            tableLeg.position.x = legPos[i][0]
            tableLeg.position.y = legPos[i][1]
            tableLeg.position.z = legPos[i][2]
            tableLeg.receiveShadow = true;
            tableLeg.castShadow = true;
            this.add(tableLeg)
        }

        this.add(tabletopMesh);

        this.receiveShadow = true;
        this.castShadow = true;
    }
}

export { MyTable };