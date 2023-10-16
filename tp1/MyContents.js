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
import { MySpring } from './structures/MySpring.js';
import { MyJar } from './structures/MyJar.js';
import { MyNewspaper } from './structures/MyNewspaper.js';
import { MyFlower } from './structures/MyFlower.js';

/**
 *  This class contains the contents of out application
 */
class MyContents {
    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null
        this.axisEnabled = false
        this.lastAxisEnabled = null

        // structures
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
        this.beetle = null
        this.spring = null
        this.jar = null
        this.newspaper = null
        this.flower = null

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
        this.spotLightDistance = 16
        this.spotLightAngle = Math.PI / 180 * 45
        this.spotLightPenumbra = 0.2
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

        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 4096
        this.spotLight.shadow.mapSize.length = 4096
        this.spotLight.shadow.camera.near = 0.5;
        this.spotLight.shadow.camera.far = 100;
        this.spotLight.shadow.camera.left = -15;
        this.spotLight.shadow.camera.right = 15;
        this.spotLight.shadow.camera.bottom = -15;
        this.spotLight.shadow.camera.top = 15;

        this.spotLightTarget = new THREE.Object3D();
        this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);

        // directional light related attributes
        this.directionalHelperEnabled = false
        this.lastDirectionalHelperEnabled = null
        this.directionalLightIntensity = 0
        this.directionalLightPositionX = 0
        this.directionalLightPositionY = 10
        this.directionalLightPositionZ = -10
        this.directionalLight = new THREE.DirectionalLight(0xffffff, this.directionalLightIntensity, 1);
        this.directionalLight.position.set(this.directionalLightPositionX, this.directionalLightPositionY, this.directionalLightPositionZ);
        this.directionalLightTarget = new THREE.Object3D();
        this.directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight, 0.5);
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

        // directional light
        this.app.scene.add(this.directionalLight);
        this.directionalLight.target = this.directionalLightTarget;
        this.app.scene.add(this.directionalLightHelper);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add(ambientLight);

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
            this.spotLightTarget = this.cake;
            this.spotLight.target = this.cake;
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
            this.directionalLightTarget = this.landscape;
            this.directionalLight.target = this.landscape;
        }
        if (this.drawing === null) {
            this.drawing = new MyFrame(this.room, 'textures/wood.jpg',
                new THREE.Vector3(
                    0, 
                    this.room.roomHeight * 0.7, 
                    this.room.roomWidth * 0.3630), 
                2.5, 2.5, 0.3)
            this.beetle = new MyBeetle(this.drawing, 0.3, 2.5, 2.5)
        }
        if (this.spring === null) {
            this.spring = new MySpring(this.table, 0.1, 7, 3, this.table.tableHeight, -2)
        }
        if (this.jar === null) {
            this.jar = new MyJar(this.room, this.room.roomWidth * 0.35, 0, - this.room.roomDepth * 0.35)
        }
        if (this.newspaper === null) {
            this.newspaper = new MyNewspaper(this.table, - this.table.tableWidth * 0.45, this.table.tableHeight * 1.03, this.table.tableDepth * 0.45)
        }
        if (this.flower === null) {
            this.flower = new MyFlower(this.jar, 2, 3.5, 0)
        }
    }

    /**
     * updates the axis if required
     * this method is called from the render method of the app
     */
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
     * updates the point light helper if required
     */
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

    /**
     * updates the spot light helper if required
     */
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
     * updates the directional light helper if required
     */
    updateDirectionalHelperIfRequired() {
        if (this.directionalHelperEnabled !== this.lastDirectionalHelperEnabled) {
            this.lastDirectionalHelperEnabled = this.directionalHelperEnabled
            if (this.directionalHelperEnabled) {
                this.app.scene.add(this.directionalLightHelper)
            }
            else {
                this.app.scene.remove(this.directionalLightHelper)
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
        this.updatePointHelperIfRequired()
        this.updateSpotHelperIfRequired()
        this.updateDirectionalHelperIfRequired()
        this.room.updateIfRequired()
        this.table.updateIfRequired()
        this.plate.updateIfRequired()
        this.cake.updateIfRequired()
        this.candle.updateIfRequired()
        this.chair.updateIfRequired()
        this.frame1.updateIfRequired()
        this.frame2.updateIfRequired()
        this.window.updateIfRequired()
        this.drawing.updateIfRequired()
        this.spring.updateIfRequired()
        this.jar.updateIfRequired()
        this.newspaper.updateIfRequired()
        this.flower.updateIfRequired()
    }

    /**
     * Updates the point light's intensity.
     * @param {number} value The new intensity value.
     */
    updatePointLightIntensity(value) {
        this.pointLightIntensity = value
        this.pointLight.intensity = this.pointLightIntensity
    }

    /**
     * Updates the point light's X position.
     * @param {number} value The new X position value.
     */
    updatePointLightPositionX(value) {
        this.pointLightPositionX = value
        this.pointLight.position.setX(this.pointLightPositionX)
    }

    /**
     * Updates the point light's Y position.
     * @param {number} value The new Y position value.
     */
    updatePointLightPositionY(value) {
        this.pointLightPositionY = value
        this.pointLight.position.setY(this.pointLightPositionY)
    }

    /**
     * Updates the point light's Z position.
     * @param {number} value The new Z position value.
     */
    updatePointLightPositionZ(value) {
        this.pointLightPositionZ = value
        this.pointLight.position.setZ(this.pointLightPositionZ)
    }

    /**
     * Updates the spot light's color.
     * @param {string} value The new color value.
     */
    updateSpotLightColor(value) {
        this.spotLightColor = value
        this.spotLight.color.set(this.spotLightColor)
    }

    /**
     * Updates the spot light's intensity.
     * @param {number} value The new intensity value.
     */
    updateSpotLightIntensity(value) {
        this.spotLightIntensity = value
        this.spotLight.intensity = this.spotLightIntensity
    }

    /**
     * Updates the spot light's distance.
     * @param {number} value The new distance value.
     */
    updateSpotLightDistance(value) {
        this.spotLightDistance = value
        this.spotLight.distance = this.spotLightDistance
    }

    /**
     * Updates the spot light's angle.
     * @param {number} value The new angle value.
     */
    updateSpotLightAngle(value) {
        this.spotLightAngle = Math.PI / 180 * value
        this.spotLight.angle = this.spotLightAngle
    }

    /**
     * Updates the spot light's penumbra.
     * @param {number} value The new penumbra value.
     */
    updateSpotLightPenumbra(value) {
        this.spotLightPenumbra = value
        this.spotLight.penumbra = this.spotLightPenumbra
    }

    /**
     * Updates the spot light's decay.
     * @param {number} value The new decay value.
     */
    updateSpotLightDecay(value) {
        this.spotLightDecay = value
        this.spotLight.decay = this.spotLightDecay
    }

    /**
     * Updates the spot light's X position.
     * @param {number} value The new X position value.
     */
    updateSpotLightPositionX(value) {
        this.spotLightPositionX = value
        this.spotLight.position.setX(this.spotLightPositionX)
    }

    /**
     * Updates the spot light's Y position.
     * @param {number} value The new Y position value.
     */
    updateSpotLightPositionY(value) {
        this.spotLightPositionY = value
        this.spotLight.position.setY(this.spotLightPositionY)
    }

    /**
     * Updates the spot light's Z position.
     * @param {number} value The new Z position value.
     */
    updateSpotLightPositionZ(value) {
        this.spotLightPositionZ = value
        this.spotLight.position.setZ(this.spotLightPositionZ)
    }

    /**
     * Updates the spot light target's X position.
     * @param {number} value The new X position value.
     */
    updateSpotLightTargetX(value) {
        this.spotLightTargetX = value
        this.spotLightTarget.position.setX(this.spotLightTargetX)
    }

    /**
     * Updates the spot light target's Y position.
     * @param {number} value The new Y position value.
     */
    updateSpotLightTargetY(value) {
        this.spotLightTargetY = value
        this.spotLightTarget.position.setY(this.spotLightTargetY)
    }

    /**
     * Updates the spot light target's Z position.
     * @param {number} value The new Z position value.
     */
    updateSpotLightTargetZ(value) {
        this.spotLightTargetZ = value
        this.spotLightTarget.position.setZ(this.spotLightTargetZ)
    }

    /**
     * Updates the directional light's intensity.
     * @param {number} value The new intensity value.
     */
    updateDirectionalLightIntensity(value) {
        this.directionalLightIntensity = value
        this.directionalLight.intensity = this.directionalLightIntensity
    }

    /**
     * Updates the directional light's X position.
     * @param {number} value The new X position value.
     */
    updateDirectionalLightPositionX(value) {
        this.directionalLightPositionX = value
        this.directionalLight.position.setX(this.directionalLightPositionX)
    }

    /**
     * Updates the directional light's Y position.
     * @param {number} value The new Y position value.
     */
    updateDirectionalLightPositionY(value) {
        this.directionalLightPositionY = value
        this.directionalLight.position.setY(this.directionalLightPositionY)
    }

    /**
     * Updates the directional light's Z position.
     * @param {number} value The new Z position value.
     */
    updateDirectionalLightPositionZ(value) {
        this.directionalLightPositionZ = value
        this.directionalLight.position.setZ(this.directionalLightPositionZ)
    }
}

export { MyContents };