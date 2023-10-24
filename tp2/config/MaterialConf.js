import * as THREE from 'three';
import { MySceneData } from '../parser/MySceneData.js';

/**
 * Creates materias as described by the data.
 * @param {MySceneData} data 
 * @param {Array<THREE.Texture>} texs
 */
function configMaterials(data, texs) {
    let ret = []
    const loader = new THREE.TextureLoader()

    for(const k in data.materials) {
        const matData = data.materials[k]
        let material = null
        
        switch(matData.shading) {
            case "none":
                material = new THREE.MeshBasicMaterial({
                    color : matData.color,
                })
                break;
                
            case "flat":
                material = new THREE.MeshPhongMaterial({
                    color : matData.color,
                    specular : matData.specular,
                    shininess : matData.shininess,
                    emmissive : matData.emissive,
                    flatShading : true
                })
                break;

            case "smooth":
            case undefined:
                material = new THREE.MeshPhongMaterial({
                    color : matData.color,
                    specular : matData.specular,
                    shininess : matData.shininess,
                    emmissive : matData.emissive,
                    flatShading : false
                })
                break;

            default:
                throw new Error(
                    "Undefined material shading type: " + matData.shading
                )
        }
        if(matData.wireframe !== undefined) {
            material.wireframe = matData.wireframe
        }
        if(matData.twoSided == true) {
            material.side = THREE.DoubleSide
        }

        if(matData.textureref !== null || matData.textureref !== undefined) {
            if(texs[matData.textureref] === undefined) {
                throw new Error("Invalid texture ID: " + matData.textureref)
            }

            material.map = loader.load(texs[matData.textureref])
            material.map.wrapS = THREE.RepeatWrapping
            material.map.wrapT = THREE.RepeatWrapping

            // texlength depends on mesh size, so can't handle it here
        }
    }
    return
}