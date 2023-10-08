import * as THREE from 'three';
import { MyStructure } from '../MyStructure.js';

class MyPlate extends MyStructure {
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
    }
}

export { MyPlate };