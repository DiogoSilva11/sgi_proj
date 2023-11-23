import * as THREE from 'three';
import { MySceneData } from "../parser/MySceneData.js"
import { MyApp } from '../MyApp.js';

/**
 * Creates the cameras defined in the data.
 * @param {MySceneData} data 
 * @param {MyApp} app 
 */
function configCameras(data, app) {
    for(const k in data.cameras) {
        const camData = data.cameras[k]
        let camera = null

        switch(camData.type) {
            case "orthogonal":
                camera = new THREE.OrthographicCamera(
                    camData.left,
                    camData.right,
                    camData.top,
                    camData.bottom,
                    camData.near,
                    camData.far
                )
                break;
            case "perspective":
                camera = new THREE.PerspectiveCamera(
                    camData.angle,
                    window.innerWidth / window.innerHeight,
                    camData.near,
                    camData.far
                )
                break;
            default:
                throw new Error("Unidentified camera type found.")
        }

        camera.position.set(
            camData.location[0], 
            camData.location[1], 
            camData.location[2]
        )

        camera.customOptions = {target : {x: camData.target[0], y: camData.target[1], z: camData.target[2]}}

        app.cameras[camData.id] = camera
    }

    app.setActiveCamera(data.activeCameraId)
}

export {configCameras}