import * as THREE from 'three';
import { MySceneData } from "../parser/MySceneData.js"

/**
 * Defines the scene globals based on the data.
 * @param {MySceneData} data 
 * @param {THREE.Scene} scene 
 */
function configGlobals(data, scene) {
    let background  = data.descriptors["globals"]["background"]
    if(background !== undefined) {
        scene.background = background
    }

    let ambient = data.descriptors["globals"]["ambient"]
    if(ambient !== undefined) {
        scene.add(new AmbientLight(ambient))
    }
}

export {configGlobals}