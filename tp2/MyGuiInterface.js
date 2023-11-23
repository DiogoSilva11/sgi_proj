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

        // light related attributes
        this.activeLight = null
        this.activeLightName = null
        this.lastLightName = null

        // structure related attributes
        this.activeStructure = null
        this.activeStructureName = null
        this.lastStructureName = null
    }

    /**
     * Initialize the gui interface
     */
    init() {
        let cameras = Object.keys(this.app.cameras)
        let camera = this.app.activeCamera
        this.cameraFolder = this.datgui.addFolder('Cameras')
        this.cameraFolder.add(this.app, 'activeCameraName', cameras).name("Active Camera").onChange(() => {this.app.updateCameraIfRequired()})
        this.cameraFolder.add(camera, 'fov').name("Fov").onChange(() => {camera.updateProjectionMatrix()})
        this.cameraFolder.add(camera, 'zoom').name("Zoom").onChange(() => {camera.updateProjectionMatrix()})
        this.cameraFolder.add(camera, 'near').name("Near").onChange(() => {camera.updateProjectionMatrix()})
        this.cameraFolder.add(camera, 'far').name("Far").onChange(() => {camera.updateProjectionMatrix()})
        this.cameraFolder.open()
        this.cameraPositionFolder = this.cameraFolder.addFolder('Position')
        this.cameraPositionFolder.add(camera.position, 'x', -70, 70).name('Position X').onChange(() => {camera.updateProjectionMatrix()})
        this.cameraPositionFolder.add(camera.position, 'y', -70, 70).name('Position Y').onChange(() => {camera.updateProjectionMatrix()})
        this.cameraPositionFolder.add(camera.position, 'z', -70, 70).name('Position Z').onChange(() => {camera.updateProjectionMatrix()})
        this.cameraTargetFolder = this.cameraFolder.addFolder('Target')
        this.cameraTargetFolder.add(camera.customOptions.target, 'x', -70, 70).name('Target X').onChange(() => {
            this.app.controls.target.x = camera.customOptions.target.x
        })
        this.cameraTargetFolder.add(camera.customOptions.target, 'y', -70, 70).name('Target Y').onChange(() => {
            this.app.controls.target.y = camera.customOptions.target.y
        })
        this.cameraTargetFolder.add(camera.customOptions.target, 'z', -70, 70).name('Target Z').onChange(() => {
            this.app.controls.target.z = camera.customOptions.target.z
        })

        let lights = Object.keys(this.contents.lights)
        let light = (this.activeLight == null || this.activeLight == undefined) ? this.contents.lights["light1"] : this.activeLight
        this.lightFolder = this.datgui.addFolder('Lights')
        this.lightFolder.add(this, 'activeLightName', lights).name("Active Light").onChange(() => {
            this.updateLightIfRequired()
            this.update()
        })
        this.lightFolder.add(light, 'intensity', 0, 500).name("Intensity").onChange(() => {light.intensity = light.intensity})
        this.lightFolder.addColor(light, 'color').name("Color").onChange(() => {
            light.color.setRGB(...[light.color.r, light.color.g, light.color.b])
        })
        this.lightFolder.add(light, 'castShadow').name("Cast Shadow").onChange(() => {light.castShadow = light.castShadow})
        switch (light.type) {
            case "PointLight":
                this.lightFolder.add(light, 'decay', 0, 20).name("Decay").onChange(() => {light.decay = light.decay})
                this.lightFolder.add(light, 'distance', 0, 200).name("Distance").onChange(() => {light.distance = light.distance})
                break
            case "SpotLight":
                this.lightFolder.add(light, 'angle', 0, 2).name("Angle").onChange(() => {light.angle = light.angle})
                this.lightFolder.add(light, 'penumbra', 0, 1).name("Penumbra").onChange(() => {light.penumbra = light.penumbra})
                this.lightFolder.add(light, 'decay', 0, 20).name("Decay").onChange(() => {light.decay = light.decay})
                this.lightFolder.add(light, 'distance', 0, 200).name("Distance").onChange(() => {light.distance = light.distance})
                break
            default:
                break
        }
        this.lightFolder.open()
        this.lightPositionFolder = this.lightFolder.addFolder('Position')
        this.lightPositionFolder.add(light.position, 'x', -30, 30).name('Position X').onChange(() => {light.position.x = light.position.x})
        this.lightPositionFolder.add(light.position, 'y', -30, 30).name('Position Y').onChange(() => {light.position.y = light.position.y})
        this.lightPositionFolder.add(light.position, 'z', -30, 30).name('Position Z').onChange(() => {light.position.z = light.position.z})

        let structures = Object.keys(this.contents.structures)
        let structure = (this.activeStructure == null || this.activeStructure == undefined) ? 
            this.contents.structures["scene"] : this.activeStructure
        this.structureFolder = this.datgui.addFolder('Structures')
        this.structureFolder.add(this, 'activeStructureName', structures).name("Active Structure").onChange(() => {
            this.updateStructureIfRequired()
            this.update()
        })
        this.structureFolder.open()
        this.structurePositionFolder = this.structureFolder.addFolder('Position')
        this.structurePositionFolder.add(structure.position, 'x', -30, 30).name('Position X').onChange(() => {
            structure.position.x = structure.position.x
        })
        this.structurePositionFolder.add(structure.position, 'y', -30, 30).name('Position Y').onChange(() => {
            structure.position.y = structure.position.y
        })
        this.structurePositionFolder.add(structure.position, 'z', -30, 30).name('Position Z').onChange(() => {
            structure.position.z = structure.position.z
        })
        this.structureRotationFolder = this.structureFolder.addFolder('Rotation')
        this.structureRotationFolder.add(structure.rotation, 'x', -Math.PI, Math.PI).name('Rotation X').onChange(() => {
            structure.rotation.x = structure.rotation.x
        })
        this.structureRotationFolder.add(structure.rotation, 'y', -Math.PI, Math.PI).name('Rotation Y').onChange(() => {
            structure.rotation.y = structure.rotation.y
        })
        this.structureRotationFolder.add(structure.rotation, 'z', -Math.PI, Math.PI).name('Rotation Z').onChange(() => {
            structure.rotation.z = structure.rotation.z
        })
        this.structureScaleFolder = this.structureFolder.addFolder('Scale')
        this.structureScaleFolder.add(structure.scale, 'x', 0.1, 10).name('Scale X').onChange(() => {
            structure.scale.x = structure.scale.x
        })
        this.structureScaleFolder.add(structure.scale, 'y', 0.1, 10).name('Scale Y').onChange(() => {
            structure.scale.y = structure.scale.y
        })
        this.structureScaleFolder.add(structure.scale, 'z', 0.1, 10).name('Scale Z').onChange(() => {
            structure.scale.z = structure.scale.z
        })
    }

    /**
     * Updates the gui interface
     */
    update() {
        if (this.cameraFolder != undefined) this.cameraFolder.destroy()
        if (this.lightFolder != undefined) this.lightFolder.destroy()
        if (this.structureFolder != undefined) this.structureFolder.destroy()
        this.init()
    }

    /**
     * Updates the active camera if required
     */
    updateLightIfRequired() {
        if (this.lastLightName !== this.activeLightName) {
            this.lastLightName = this.activeLightName
            this.activeLight = this.contents.lights[this.activeLightName]
        }
    }

    /**
     * Updates the active structure if required
     */
    updateStructureIfRequired() {
        if (this.lastStructureName !== this.activeStructureName) {
            this.lastStructureName = this.activeStructureName
            this.activeStructure = this.contents.structures[this.activeStructureName]
        }
    }
}

export { MyGuiInterface };