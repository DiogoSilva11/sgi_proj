import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';

/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app

        this.axis = null
        this.axisEnabled = false
        this.lastAxisEnabled = null

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = false
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)

        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess })

        // room related attributes

        this.floorMesh = null;
        this.wallMeshes = null;
        this.roomWidth = 20;
        this.roomDepth = 15;
        this.roomHeight = 10;
        
        // table related attributes
        this.table = new THREE.Group();
        this.tableEnabled = true
        this.lastTableEnabled = null
        this.tableHeight = 4
        this.tableWidth = 7
        this.tableDepth = 5
        this.tabletopThickness = 0.5
        this.tableLegTopRadius = 0.5
        this.tableLegBottomRadius = 0.3

        // plate related attributes
        this.plate = null
        this.plateRadiusTop = 1.2
        this.plateRadiusBottom = 1.0
        this.plateThickness = 0.1

        // cake related attributes
        this.cake = new THREE.Group()
        //this.cakesideMeshes = [];
        this.cakeRadius = 1.0
        this.cakeHeight = 0.7
        this.cakeLeft = 7/8

        // candle related attributes
        this.candle = null
        this.flame = null
        this.candleRadius = 0.05
        this.candleHeight = 0.3

        // flame related attributes
        this.flameRadius = 0.06
        this.flameHeight = 0.12

        // chair related attributes
        this.chair = new THREE.Group()
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
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
    }

    /**
     * builds the planes representing the walls and floor
     */

    buildRoom() {
        const floorMaterial = new THREE.MeshPhongMaterial({
            color: "#d9a066",
            specular: "#7f7f7f",
            emissive: "#000000",
            shininess: 70
        })
        const wallMaterial = new THREE.MeshPhongMaterial({
            color: "#cbdbfc",
            specular: "#7f7f7f",
            emissive: "#000000",
            shininess: 35
        })

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
    }

    /**
     * builds a table with round legs
     */
    buildTable() {
        const tableMaterial = new THREE.MeshPhongMaterial({
            color: "#8f563b",
            specular: "#bf866b",
            emissive: "#000000",
            shininess: 10
        })
        const legOffsX = this.tableWidth/2 - this.tableLegTopRadius
        const legOffsZ = this.tableDepth/2 - this.tableLegTopRadius
        const legHeight = -this.tableHeight / 2
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
            tabletopMesh.add(tableLeg)
        }

        this.table.add(tabletopMesh);
    }

    /**
     * builds a plate.
     */
    buildPlate() {
        const plateMaterial = new THREE.MeshPhongMaterial({
            color: "#efefef",
            specular: "#ffffff",
            emissive: "#000000",
            shininess: 50
        })

        const plate = new THREE.CylinderGeometry(
            this.plateRadiusTop,
            this.plateRadiusBottom,
            this.plateThickness
        )

        this.plate = new THREE.Mesh( plate, plateMaterial )
        this.plate.position.y = this.tableHeight + this.plateThickness / 2

        this.table.add( this.plate )
    }

    /**
     * builds a cake.
     */

    buildCake() {
        const cakeMaterial = new THREE.MeshPhongMaterial({
            color: "#663931",
            specular: "#3f3f3f",
            emissive: "#000000",
            shininess: 60
        })

        const cake = new THREE.CylinderGeometry(
            this.cakeRadius,
            this.cakeRadius,
            this.cakeHeight,
            32,
            1,
            false,
            0,
            2 * Math.PI * this.cakeLeft
        )
        const cakeside = new THREE.PlaneGeometry(
            this.cakeRadius,
            this.cakeHeight
        )

        let cakeMesh = new THREE.Mesh( cake, cakeMaterial )
        cakeMesh.position.y = this.cakeHeight / 2

        let cakesideMeshes = [
            new THREE.Mesh( cakeside, cakeMaterial ),
            new THREE.Mesh( cakeside, cakeMaterial )
        ]
        for(let mesh of cakesideMeshes) {
            mesh.position.y = cakeMesh.position.y
        }
        cakesideMeshes[0].rotation.y = -Math.PI / 2
        cakesideMeshes[0].position.z = this.cakeRadius / 2

        let sideAngle = (Math.PI / 2) + (2 * Math.PI) * this.cakeLeft
        cakesideMeshes[1].rotation.y = sideAngle
        cakesideMeshes[1].position.x = -Math.sin(sideAngle) * this.cakeRadius / 2
        cakesideMeshes[1].position.z = Math.cos(sideAngle) * this.cakeRadius / 2

        // cake slice
        const sliceGeometry = new THREE.CylinderGeometry(
            this.cakeRadius * 0.8, 
            this.cakeRadius * 0.8,
            this.cakeHeight,
            32,
            1,
            false,
            0,
            Math.PI / 4 
        )

        let sliceMesh = new THREE.Mesh(sliceGeometry, cakeMaterial)
        sliceMesh.position.y = this.cakeHeight / 2
        sliceMesh.rotation.y = - Math.PI / 4
        const sliceOffset = 0.25
        sliceMesh.position.z = sliceOffset 
        sliceMesh.position.x = - sliceOffset / (sliceOffset * 10)

        const sliceRadius = this.cakeRadius * 0.8
        const sliceSide = new THREE.PlaneGeometry(
            sliceRadius,
            this.cakeHeight
        )

        let sliceSideMeshes = [
            new THREE.Mesh( sliceSide, cakeMaterial ),
            new THREE.Mesh( sliceSide, cakeMaterial )
        ]
        for (let mesh of sliceSideMeshes) {
            mesh.position.y = cakeMesh.position.y
        }
        sliceSideMeshes[0].rotation.y = Math.PI / 2
        sliceSideMeshes[0].position.z = sliceRadius / 2 + sliceOffset
        sliceSideMeshes[0].position.x = - sliceOffset / (sliceOffset * 10)

        let sliceSideAngle = - (Math.PI / 2) - (Math.PI / 4)
        sliceSideMeshes[1].rotation.y = sliceSideAngle
        sliceSideMeshes[1].position.z = - Math.cos(sliceSideAngle) * sliceRadius / 2 + sliceOffset
        sliceSideMeshes[1].position.x = Math.sin(sliceSideAngle) * sliceRadius / 2 - sliceOffset / (sliceOffset * 10)

        this.cake.add( cakeMesh )
        this.cake.add( cakesideMeshes[0] )
        this.cake.add( cakesideMeshes[1] )

        this.cake.add( sliceMesh )
        this.cake.add( sliceSideMeshes[0] )
        this.cake.add( sliceSideMeshes[1] )

        this.plate.add( this.cake )
    }

    /**
     * builds a candle and flame
     */
    buildCandle() {
        const candleMaterial = new THREE.MeshPhongMaterial({
            color: "#ffffff",
            specular: "#9f9f9f",
            emissive: "#000000",
            shininess: 60
        })

        const candle = new THREE.CylinderGeometry( 
            this.candleRadius, 
            this.candleRadius,
            this.candleHeight,
            6
        )

        this.candle = new THREE.Mesh(candle, candleMaterial)
        this.candle.position.y = this.cakeHeight + this.candleHeight/2
        
        this.cake.add( this.candle )
    }

    /**
     * builds the candle's flame
     */
    buildFlame() {
        const flameMaterial = new THREE.MeshPhongMaterial({
            color: "#ffaf00",
            specular: "#000000",
            emissive: "#ff0000",
            shininess: 60
        })
        const flame = new THREE.ConeGeometry(
            this.flameRadius,
            this.flameHeight,
            3
        )

        this.flame = new THREE.Mesh(flame, flameMaterial)
        this.flame.position.y = this.candleHeight/2 + this.flameHeight/2

        this.candle.add( this.flame )
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

        this.chair.add(seatMesh);
        this.chair.position.z = this.tableDepth / 2
    }

    /**
     * initializes the contents
     */
    init() {
       
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        //this.buildBox()

        // create the overall scene
        this.buildRoom();
        this.app.scene.add( this.floorMesh )
        for( const mesh of this.wallMeshes ) {
            this.app.scene.add( mesh )
        }

        this.buildTable()
        this.buildPlate()
        this.buildCake()
        this.buildCandle()
        this.buildFlame()
        this.app.scene.add( this.table )

        this.buildChair()
        this.app.scene.add( this.chair )
        
        /*
        // Create a Plane Mesh with basic material
        let plane = new THREE.PlaneGeometry( 10, 10 );
        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );
        this.planeMesh.rotation.x = -Math.PI / 2;
        this.planeMesh.position.y = -0;
        this.app.scene.add( this.planeMesh );
        */
    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }

    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }

    updateAxisIfRequired() {
        if (this.axisEnabled !== this.lastAxisEnabled) {
            this.lastAxisEnabled = this.axisEnabled
            if (this.axisEnabled) {
                this.app.scene.add(this.axis)
            }
            else {
                this.app.scene.remove(this.axis)
            }
        }
    }

    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    updateTableIfRequired() {
        if (this.tableEnabled !== this.lastTableEnabled) {
            this.lastTableEnabled = this.tableEnabled
            if (this.tableEnabled) {
                this.app.scene.add(this.table)
            }
            else {
                this.app.scene.remove(this.table)
            }
        }
    }

    updateChairIfRequired() {
        if (this.chairEnabled !== this.lastChairEnabled) {
            this.lastChairEnabled = this.chairEnabled
            if (this.chairEnabled) {
                this.app.scene.add(this.chair)
            }
            else {
                this.app.scene.remove(this.chair)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if elements need to be updated
        this.updateAxisIfRequired()
        //this.updateBoxIfRequired()
        this.updateTableIfRequired()
        this.updateChairIfRequired()

        // sets the box mesh position based on the displacement vector
        //this.boxMesh.position.x = this.boxDisplacement.x
        //this.boxMesh.position.y = this.boxDisplacement.y
        //this.boxMesh.position.z = this.boxDisplacement.z
        
    }

}

export { MyContents };