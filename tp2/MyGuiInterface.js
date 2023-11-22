import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui = new GUI()
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {
        let cameras = Object.keys(this.app.cameras)
        let camera = this.app.activeCamera
        this.cameraFolder = this.datgui.addFolder('Camera')
        this.cameraFolder.add(this.app, 'activeCameraName', cameras).name("Active Camera").onChange(() => {this.app.updateCameraIfRequired()})
        this.cameraFolder.add(camera, 'fov').name("Fov").onChange(() => {camera.updateProjectionMatrix()})
        this.cameraFolder.add(camera, 'zoom').name("Zoom").onChange(() => {camera.updateProjectionMatrix()})
        this.cameraFolder.add(camera, 'near').name("Near").onChange(() => {camera.updateProjectionMatrix()})
        this.cameraFolder.add(camera, 'far').name("Far").onChange(() => {camera.updateProjectionMatrix()})
        this.cameraFolder.open()
    }
}

export { MyGuiInterface };