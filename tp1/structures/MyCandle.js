import * as THREE from 'three';
import { MyStructure } from '../MyStructure.js';

/**
 * This class contains a 3D candle representation
 */
class MyCandle extends MyStructure {
    /**
     * 
     * @param {THREE.Object3D} parent the parent object
     * @param {number} cakeHeight the height of the cake
     */
    constructor(parent, cakeHeight) {
        super(parent);
        this.type = 'Group';
        this.cakeHeight = cakeHeight
        
        // candle related attributes
        this.candle = null
        this.candleRadius = 0.05
        this.candleHeight = 0.3

        // flame related attributes
        this.flame = null
        this.flameRadius = 0.06
        this.flameHeight = 0.12

        this.buildCandle()
        this.buildFlame()

        parent.add(this);
    }

    /**
     * builds a candle
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
        this.candle.receiveShadow = true;
        this.candle.castShadow = true;

        this.add( this.candle )
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
        this.flame.position.y = this.cakeHeight + this.candleHeight + this.flameHeight/2

        this.add( this.flame )
    }
}

export { MyCandle };