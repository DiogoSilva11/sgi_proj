import * as THREE from 'three';
import { MyStructure } from '../MyStructure.js';

/**
 * This class contains a 3D plate representation
 */
class MyPlate extends MyStructure {
    /**
     * 
     * @param {THREE.Object3D} parent the parent object
     * @param {number} tableHeight the height of the table
     */
    constructor(parent, tableHeight) {
        super(parent)
        let plateRadiusTop = 1.2
        let plateRadiusBottom = 1.0
        let plateThickness = 0.1

        const plateMaterial = new THREE.MeshPhongMaterial({
            color: "#efefef",
            specular: "#ffffff",
            emissive: "#000000",
            shininess: 50
        })
        const plateGeometry = new THREE.CylinderGeometry(
            plateRadiusTop,
            plateRadiusBottom,
            plateThickness
        )
        
        this.geometry = plateGeometry
        this.material = plateMaterial
        this.type = 'MyPlate'

        this.position.y = tableHeight + plateThickness / 2

        parent.add(this);

        this.receiveShadow = true;
        this.castShadow = true;
    }
}

export { MyPlate };