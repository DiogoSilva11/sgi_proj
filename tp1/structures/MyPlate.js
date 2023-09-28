import * as THREE from 'three';

class MyPlate extends THREE.Mesh {
    constructor(tableHeight) {
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
        super(plateGeometry, plateMaterial);
        this.type = 'MyPlate'
        this.position.y = tableHeight + plateThickness / 2
    }
}

export { MyPlate };