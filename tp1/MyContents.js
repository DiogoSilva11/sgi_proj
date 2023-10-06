import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyRoom } from './structures/MyRoom.js';
import { MyTable } from './structures/MyTable.js';
import { MyPlate } from './structures/MyPlate.js';
import { MyCake } from './structures/MyCake.js';
import { MyCandle } from './structures/MyCandle.js';
import { MyChair } from './structures/MyChair.js';
import { MyFrame } from './structures/MyFrame.js';
import { MyPicture } from './structures/MyPicture.js';
import { MyBeetle } from './structures/MyBeetle.js';

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

        this.room = null

        this.table = null
        
        this.plate = null

        this.cake = null

        this.candle = null

        this.chair = null

        this.frame1 = null
        this.picture1 = null

        this.frame2 = null
        this.picture2 = null

        this.window = null
        this.landscape = null

        this.drawing = null

        // point light related attributes
        this.pointHelperEnabled = false
        this.lastPointHelperEnabled = null
        this.pointLightIntensity = 300
        this.pointLightPositionX = 0
        this.pointLightPositionY = 20
        this.pointLightPositionZ = 0
        this.pointLight = new THREE.PointLight( 0xffffff, this.pointLightIntensity, 0 );
        this.pointLight.position.set(this.pointLightPositionX, this.pointLightPositionY, this.pointLightPositionZ);
        this.pointLightHelper = new THREE.PointLightHelper(this.pointLight);

        // spot light related attributes
        this.spotHelperEnabled = false
        this.lastSpotHelperEnabled = null
        this.spotLightColor = "#ffffff"
        this.spotLightIntensity = 15
        this.spotLightDistance = 8
        this.spotLightAngle = Math.PI / 180 * 15
        this.spotLightPenumbra = 0
        this.spotLightDecay = 0
        this.spotLightPositionX = 0
        this.spotLightPositionY = 10
        this.spotLightPositionZ = 0
        this.spotLightTargetX = 0
        this.spotLightTargetY = 0
        this.spotLightTargetZ = 0
        this.spotLight = new THREE.SpotLight(this.spotLightColor, 
            this.spotLightIntensity, 
            this.spotLightDistance, 
            this.spotLightAngle, 
            this.spotLightPenumbra, 
            this.spotLightDecay);
        this.spotLight.position.set(this.spotLightPositionX, this.spotLightPositionY, this.spotLightPositionZ);
        this.spotLightTarget = new THREE.Object3D();
        this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
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

        // point light
        this.app.scene.add(this.pointLight);
        this.app.scene.add(this.pointLightHelper);

        // spot light
        this.app.scene.add(this.spotLightTarget); 
        this.spotLight.target = this.spotLightTarget; 
        this.app.scene.add(this.spotLight);
        this.app.scene.add(this.spotLightHelper);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        // create the overall scene
        if (this.room === null) {
            this.room = new MyRoom(this.app.scene)
        }
        if (this.table === null) {
            this.table = new MyTable(this.room)
        }
        if (this.plate === null) {
            this.plate = new MyPlate(this.table, this.table.tableHeight)
        }
        if (this.cake === null) {
            this.cake = new MyCake(this.plate)
            this.spotLightTarget = this.cake
            this.spotLight.target = this.cake
        }
        if (this.candle === null) {
            this.candle = new MyCandle(this.cake, this.cake.cakeHeight)
        }
        if (this.chair === null) {
            this.chair = new MyChair(this.room, this.table.tableDepth)
        }
        if (this.frame1 === null) {
            this.frame1 = new MyFrame(this.room, 'textures/wood.jpg', 
                new THREE.Vector3(
                    this.room.roomWidth * 0.2, 
                    this.room.roomHeight * 0.7, 
                    this.room.roomWidth * 0.3625), 
                4, 4, 0.5)
        }
        if (this.picture1 === null) {
            this.picture1 = new MyPicture(this.frame1, true, 'textures/diogo_silva.jpg')
        }
        if (this.frame2 === null) {
            this.frame2 = new MyFrame(this.room, 'textures/wood.jpg', 
                new THREE.Vector3(
                    - this.room.roomWidth * 0.2, 
                    this.room.roomHeight * 0.7, 
                    this.room.roomWidth * 0.3625), 
                4, 4, 0.5)
        }
        if (this.picture2 === null) {
            this.picture2 = new MyPicture(this.frame2, true, 'textures/tomas_pires.jpg')
        }
        if (this.window === null) {
            this.window = new MyFrame(this.room, 'textures/metal.jpg', 
                new THREE.Vector3(
                    0, 
                    this.room.roomHeight * 0.7, 
                    - this.room.roomWidth * 0.3625), 
                    4, 7, 0.5)
        }
        if (this.landscape === null) {
            this.landscape = new MyPicture(this.window, false, 'textures/landscape.png')
        }
        if (this.drawing === null) {
            this.drawing = new MyFrame(this.room, 'textures/wood.jpg',
                new THREE.Vector3(
                    0, 
                    this.room.roomHeight * 0.7, 
                    this.room.roomWidth * 0.3630), 
                2.5, 2.5, 0.3)
            let beetle = new MyBeetle(this.drawing, 0.3, 2.5, 2.5)
        }
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

    updatePointHelperIfRequired() {
        if (this.pointHelperEnabled !== this.lastPointHelperEnabled) {
            this.lastPointHelperEnabled = this.pointHelperEnabled
            if (this.pointHelperEnabled) {
                this.app.scene.add(this.pointLightHelper)
            }
            else {
                this.app.scene.remove(this.pointLightHelper)
            }
        }
    }

    updateSpotHelperIfRequired() {
        if (this.spotHelperEnabled !== this.lastSpotHelperEnabled) {
            this.lastSpotHelperEnabled = this.spotHelperEnabled
            if (this.spotHelperEnabled) {
                this.app.scene.add(this.spotLightHelper)
            }
            else {
                this.app.scene.remove(this.spotLightHelper)
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
        this.room.updateIfRequired()
        this.table.updateIfRequired()
        this.plate.updateIfRequired()
        this.cake.updateIfRequired()
        this.candle.updateIfRequired()
        this.chair.updateIfRequired()
        //this.frame.updateIfRequired()
        this.updatePointHelperIfRequired()
        this.updateSpotHelperIfRequired()
        this.frame1.updateIfRequired()
        this.frame2.updateIfRequired()
        this.window.updateIfRequired()
        this.drawing.updateIfRequired()
    }

    updatePointLightIntensity(value) {
        this.pointLightIntensity = value
        this.pointLight.intensity = this.pointLightIntensity
    }

    updatePointLightPositionX(value) {
        this.pointLightPositionX = value
        this.pointLight.position.setX(this.pointLightPositionX)
    }

    updatePointLightPositionY(value) {
        this.pointLightPositionY = value
        this.pointLight.position.setY(this.pointLightPositionY)
    }

    updatePointLightPositionZ(value) {
        this.pointLightPositionZ = value
        this.pointLight.position.setZ(this.pointLightPositionZ)
    }

    updateSpotLightColor(value) {
        this.spotLightColor = value
        this.spotLight.color.set(this.spotLightColor)
    }

    updateSpotLightIntensity(value) {
        this.spotLightIntensity = value
        this.spotLight.intensity = this.spotLightIntensity
    }

    updateSpotLightDistance(value) {
        this.spotLightDistance = value
        this.spotLight.distance = this.spotLightDistance
    }

    updateSpotLightAngle(value) {
        this.spotLightAngle = Math.PI / 180 * value
        this.spotLight.angle = this.spotLightAngle
    }

    updateSpotLightPenumbra(value) {
        this.spotLightPenumbra = value
        this.spotLight.penumbra = this.spotLightPenumbra
    }

    updateSpotLightDecay(value) {
        this.spotLightDecay = value
        this.spotLight.decay = this.spotLightDecay
    }

    updateSpotLightPositionX(value) {
        this.spotLightPositionX = value
        this.spotLight.position.setX(this.spotLightPositionX)
    }

    updateSpotLightPositionY(value) {
        this.spotLightPositionY = value
        this.spotLight.position.setY(this.spotLightPositionY)
    }

    updateSpotLightPositionZ(value) {
        this.spotLightPositionZ = value
        this.spotLight.position.setZ(this.spotLightPositionZ)
    }

    updateSpotLightTargetX(value) {
        this.spotLightTargetX = value
        this.spotLightTarget.position.setX(this.spotLightTargetX)
    }

    updateSpotLightTargetY(value) {
        this.spotLightTargetY = value
        this.spotLightTarget.position.setY(this.spotLightTargetY)
    }

    updateSpotLightTargetZ(value) {
        this.spotLightTargetZ = value
        this.spotLightTarget.position.setZ(this.spotLightTargetZ)
    }
}

export { MyContents };