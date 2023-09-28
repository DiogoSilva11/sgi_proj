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
        this.table = null
        this.plate = null
        this.cake = null
        this.candle = null
        this.chair = null
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
    }

}

export { MyContents };