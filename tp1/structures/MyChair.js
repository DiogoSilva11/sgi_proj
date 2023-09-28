import * as THREE from 'three';

class MyChair extends THREE.Object3D {
    constructor(tableDepth) {
        super();
        this.type = 'Group';
        this.tableDepth = tableDepth
        this.chairEnabled = true
        this.lastChairEnabled = null
        this.chairWidth = 2.5
        this.chairLength = 2.5
        this.chairLegHeight = 2.2
        this.chairLegTopRad = 0.3
        this.chairLegBottomRad = 0.2
        this.chairSeatThick = 0.25
        this.chairBackHeight = 3
        this.chairBackThick = 0.2
        this.buildChair();
    }

    /**
     * builds a basic chair
     */
    buildChair() {
        const chairMaterial = new THREE.MeshPhongMaterial({
            color: "#8f563b",
            specular: "#bf866b",
            emissive: "#000000",
            shininess: 10
        })
        const legOffsX = this.chairWidth/2 - this.chairLegTopRad
        const legOffsZ = this.chairLength/2 - this.chairLegTopRad
        const legHeight = - this.chairLegHeight / 2
        const legPos = [
            [ legOffsX, legHeight, legOffsZ],
            [-legOffsX, legHeight, legOffsZ],
            [-legOffsX, legHeight,-legOffsZ],
            [ legOffsX, legHeight,-legOffsZ],
        ]

        let seat = new THREE.BoxGeometry( 
            this.chairWidth, 
            this.chairSeatThick,
            this.chairLength 
        )
        let leg = new THREE.CylinderGeometry( 
            this.chairLegTopRad, 
            this.chairLegBottomRad, 
            this.chairLegHeight,
            6 
        )

        let back = new THREE.BoxGeometry(
            this.chairWidth,
            this.chairBackHeight,
            this.chairBackThick
        )

        let seatMesh = new THREE.Mesh(seat, chairMaterial)
        seatMesh.position.y = this.chairLegHeight

        for( let i=0; i < 4; i++ ) {
            let legMesh = new THREE.Mesh(leg, chairMaterial)
            legMesh.position.x = legPos[i][0]
            legMesh.position.y = legPos[i][1]
            legMesh.position.z = legPos[i][2]
            seatMesh.add(legMesh)
        }

        let backMesh = new THREE.Mesh(back, chairMaterial)
        backMesh.position.y = (this.chairBackHeight + this.chairSeatThick)/2
        backMesh.position.z = (this.chairLength - this.chairBackThick) / 2
        seatMesh.add(backMesh)

        this.add(seatMesh);
        this.position.z = this.tableDepth / 2
    }
}

export { MyChair };