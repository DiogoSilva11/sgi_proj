import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyRoom } from './structures/MyRoom.js';
import { MyTable } from './structures/MyTable.js';
import { MyPlate } from './structures/MyPlate.js';
import { MyCake } from './structures/MyCake.js';
import { MyCandle } from './structures/MyCandle.js';
import { MyChair } from './structures/MyChair.js';

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
        this.roomEnabled = true
        this.lastRoomEnabled = null

        this.table = null
        this.tableEnabled = true
        this.lastTableEnabled = null

        this.plate = null
        this.plateEnabled = true
        this.lastPlateEnabled = null

        this.cake = null
        this.cakeEnabled = true
        this.lastCakeEnabled = null

        this.candle = null
        this.candleEnabled = true
        this.lastCandleEnabled = null

        this.chair = null
        this.chairEnabled = true
        this.lastChairEnabled = null

        this.pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        this.pointLightPositionX = 0
        this.pointLightPositionY = 20
        this.pointLightPositionZ = 0
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

        // point light on top of the model
        this.pointLight.position.set( this.pointLightPositionX, this.pointLightPositionY, this.pointLightPositionZ );
        this.app.scene.add( this.pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( this.pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        // create the overall scene
        if (this.room === null) {
            this.room = new MyRoom()
            this.app.scene.add(this.room)
        }
        if (this.table === null) {
            this.table = new MyTable()
            this.room.add(this.table)
        }
        if (this.plate === null) {
            this.plate = new MyPlate(this.table.tableHeight)
            this.table.add(this.plate)
        }
        if (this.cake === null) {
            this.cake = new MyCake()
            this.plate.add(this.cake)
        }
        if (this.candle === null) {
            this.candle = new MyCandle(this.cake.cakeHeight)
            this.cake.add(this.candle)
        }
        if (this.chair === null) {
            this.chair = new MyChair(this.table.tableDepth)
            this.room.add(this.chair)
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

    updateRoomIfRequired() {
        if (this.roomEnabled !== this.lastRoomEnabled) {
            this.lastRoomEnabled = this.roomEnabled
            if (this.roomEnabled) {
                this.app.scene.add(this.room)
            }
            else {
                this.app.scene.remove(this.room)
            }
        }
    }

    updateTableIfRequired() {
        if (this.tableEnabled !== this.lastTableEnabled) {
            this.lastTableEnabled = this.tableEnabled
            if (this.tableEnabled) {
                this.room.add(this.table)
            }
            else {
                this.room.remove(this.table)
            }
        }
    }

    updatePlateIfRequired() {
        if (this.plateEnabled !== this.lastPlateEnabled) {
            this.lastPlateEnabled = this.plateEnabled
            if (this.plateEnabled) {
                this.table.add(this.plate)
            }
            else {
                this.table.remove(this.plate)
            }
        }
    }

    updateCakeIfRequired() {
        if (this.cakeEnabled !== this.lastCakeEnabled) {
            this.lastCakeEnabled = this.cakeEnabled
            if (this.cakeEnabled) {
                this.plate.add(this.cake)
            }
            else {
                this.plate.remove(this.cake)
            }
        }
    }

    updateCandleIfRequired() {
        if (this.candleEnabled !== this.lastCandleEnabled) {
            this.lastCandleEnabled = this.candleEnabled
            if (this.candleEnabled) {
                this.cake.add(this.candle)
            }
            else {
                this.cake.remove(this.candle)
            }
        }
    }

    updateChairIfRequired() {
        if (this.chairEnabled !== this.lastChairEnabled) {
            this.lastChairEnabled = this.chairEnabled
            if (this.chairEnabled) {
                this.room.add(this.chair)
            }
            else {
                this.room.remove(this.chair)
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
        this.updateRoomIfRequired()
        this.updateTableIfRequired()
        this.updatePlateIfRequired()
        this.updateCakeIfRequired()
        this.updateCandleIfRequired()
        this.updateChairIfRequired()
    }

    updatePointLightPositionX(value) {
        this.pointLightPositionX = value
        this.pointLight.position.setX(value)
    }

    updatePointLightPositionY(value) {
        this.pointLightPositionY = value
        this.pointLight.position.setY(value)
    }

    updatePointLightPositionZ(value) {
        this.pointLightPositionZ = value
        this.pointLight.position.setZ(value)
    }
}

export { MyContents };