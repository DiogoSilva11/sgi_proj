import * as THREE from 'three';

class MyTable extends THREE.Object3D {
    constructor() {
        super();
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
    }

    /**
     * builds a table with round legs
     */
    buildTable() {
        const tableMaterial = new THREE.MeshPhongMaterial({
            color: "#8f563b",
            specular: "#bf866b",
            shininess: 50,
            emissive: "#000000"
        });
        const legOffsX = this.tableWidth/2 - this.tableLegTopRadius
        const legOffsZ = this.tableDepth/2 - this.tableLegTopRadius
        const legHeight = this.tableHeight / 2 - this.tabletopThickness / 2
        const legPos = [
            [ legOffsX, legHeight, legOffsZ],
            [-legOffsX, legHeight, legOffsZ],
            [-legOffsX, legHeight,-legOffsZ],
            [ legOffsX, legHeight,-legOffsZ],
        ]

        let tabletop = new THREE.BoxGeometry( 
            this.tableWidth, 
            this.tabletopThickness,
            this.tableDepth 
        )
        let leg = new THREE.CylinderGeometry( 
            this.tableLegTopRadius, 
            this.tableLegBottomRadius, 
            this.tableHeight - this.tabletopThickness,
            6 
        )

        let tabletopMesh = new THREE.Mesh(tabletop, tableMaterial)
        tabletopMesh.position.y = this.tableHeight - (this.tabletopThickness / 2)

        for( let i=0; i < 4; i++ ) {
            let tableLeg = new THREE.Mesh(leg, tableMaterial)
            tableLeg.position.x = legPos[i][0]
            tableLeg.position.y = legPos[i][1]
            tableLeg.position.z = legPos[i][2]
            this.add(tableLeg)
        }

        this.add(tabletopMesh);
    }
}

export { MyTable };