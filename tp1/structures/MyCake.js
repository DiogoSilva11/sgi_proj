import * as THREE from 'three';
import { MyStructure } from '../MyStructure.js';

class MyCake extends MyStructure {
    constructor(parent) {
        super(parent);
        this.type = 'Group';
        this.cakeRadius = 1.0
        this.cakeHeight = 0.7
        this.cakeLeft = 7/8
        this.buildCake();
        parent.add(this);
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
        const cakesideMaterial = new THREE.MeshPhongMaterial({
            color: "#b68931",
            specular: "#4f4f4f",
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
        cakeMesh.receiveShadow = true;
        cakeMesh.castShadow = true;

        let cakesideMeshes = [
            new THREE.Mesh( cakeside, cakesideMaterial ),
            new THREE.Mesh( cakeside, cakesideMaterial )
        ]
        for(let mesh of cakesideMeshes) {
            mesh.position.y = cakeMesh.position.y
            mesh.receiveShadow = true;
            mesh.castShadow = true;
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
        sliceMesh.receiveShadow = true;
        sliceMesh.castShadow = true;
        const sliceOffset = 0.25
        sliceMesh.position.z = sliceOffset 
        sliceMesh.position.x = - sliceOffset / (sliceOffset * 10)

        const sliceRadius = this.cakeRadius * 0.8
        const sliceSide = new THREE.PlaneGeometry(
            sliceRadius,
            this.cakeHeight
        )

        let sliceSideMeshes = [
            new THREE.Mesh( sliceSide, cakesideMaterial ),
            new THREE.Mesh( sliceSide, cakesideMaterial )
        ]
        for (let mesh of sliceSideMeshes) {
            mesh.position.y = cakeMesh.position.y
            mesh.receiveShadow = true;
            mesh.castShadow = true;
        }
        sliceSideMeshes[0].rotation.y = Math.PI / 2
        sliceSideMeshes[0].position.z = sliceRadius / 2 + sliceOffset
        sliceSideMeshes[0].position.x = - sliceOffset / (sliceOffset * 10)

        let sliceSideAngle = - (Math.PI / 2) - (Math.PI / 4)
        sliceSideMeshes[1].rotation.y = sliceSideAngle
        sliceSideMeshes[1].position.z = - Math.cos(sliceSideAngle) * sliceRadius / 2 + sliceOffset
        sliceSideMeshes[1].position.x = Math.sin(sliceSideAngle) * sliceRadius / 2 - sliceOffset / (sliceOffset * 10)

        this.add( cakeMesh )
        this.add( cakesideMeshes[0] )
        this.add( cakesideMeshes[1] )

        this.add( sliceMesh )
        this.add( sliceSideMeshes[0] )
        this.add( sliceSideMeshes[1] )
    }
}

export { MyCake };