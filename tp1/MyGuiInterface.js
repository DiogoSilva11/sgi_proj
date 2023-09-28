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
        this.datgui =  new GUI();
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
        this.datgui.add(this.contents, 'axisEnabled', false).name("Axis");
        this.datgui.add(this.contents, 'roomEnabled', true).name("Room");
        this.datgui.add(this.contents, 'tableEnabled', true).name("Table");
        this.datgui.add(this.contents, 'plateEnabled', true).name("Plate");
        this.datgui.add(this.contents, 'cakeEnabled', true).name("Cake");
        this.datgui.add(this.contents, 'candleEnabled', true).name("Candle");
        this.datgui.add(this.contents, 'chairEnabled', true).name("Chair");

        const pointLight = {
            'position x': this.contents.pointLightPositionX,
            'position y': this.contents.pointLightPositionY,
            'position z': this.contents.pointLightPositionZ
        }

        // light folder
        const lightFolder = this.datgui.addFolder('Point Light');
        lightFolder.add( pointLight, 'position x', -20, 20 ).name("Position X").onChange( (value) => { this.contents.updatePointLightPositionX(value) } );
        lightFolder.add( pointLight, 'position y', -20, 20 ).name("Position Y").onChange( (value) => { this.contents.updatePointLightPositionY(value) } );
        lightFolder.add( pointLight, 'position z', -20, 20 ).name("Position Z").onChange( (value) => { this.contents.updatePointLightPositionZ(value) } );
        lightFolder.open();


        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Perspective 2', 'Left', 'Right', 'Top', 'Front', 'Back' ] ).name("Active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("X Coord")
        cameraFolder.add(this.app.activeCamera.position, 'y', 0, 10).name("Y Coord")
        cameraFolder.add(this.app.activeCamera.position, 'z', 0, 10).name("Z Coord")
        cameraFolder.open();
    }
}

export { MyGuiInterface };