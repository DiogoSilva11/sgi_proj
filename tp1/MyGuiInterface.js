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
        this.datgui.add(this.contents.room, 'enabled', true).name("Room");
        this.datgui.add(this.contents.table, 'enabled', true).name("Table");
        this.datgui.add(this.contents.plate, 'enabled', true).name("Plate");
        this.datgui.add(this.contents.cake, 'enabled', true).name("Cake");
        this.datgui.add(this.contents.candle, 'enabled', true).name("Candle");
        this.datgui.add(this.contents.chair, 'enabled', true).name("Chair");
        this.datgui.add(this.contents.frame1, 'enabled', true).name("Frame 1");
        this.datgui.add(this.contents.frame2, 'enabled', true).name("Frame 2");
        this.datgui.add(this.contents.window, 'enabled', true).name("Window");
        this.datgui.add(this.contents.drawing, 'enabled', true).name("Beetle Drawing");
        this.datgui.add(this.contents.spring, 'enabled', true).name("Spring");

        const pointLight = {
            'intensity': this.contents.pointLightIntensity,
            'position x': this.contents.pointLightPositionX,
            'position y': this.contents.pointLightPositionY,
            'position z': this.contents.pointLightPositionZ
        }

        const pointLightFolder = this.datgui.addFolder('Point light');
        pointLightFolder.add( this.contents, 'pointHelperEnabled', false ).name("Helper");
        pointLightFolder.add( pointLight, 'intensity', 0, 500 ).name("Intensity").onChange( (value) => { this.contents.updatePointLightIntensity(value) } );
        pointLightFolder.add( pointLight, 'position x', -20, 20 ).name("Position X").onChange( (value) => { this.contents.updatePointLightPositionX(value) } );
        pointLightFolder.add( pointLight, 'position y', -20, 20 ).name("Position Y").onChange( (value) => { this.contents.updatePointLightPositionY(value) } );
        pointLightFolder.add( pointLight, 'position z', -20, 20 ).name("Position Z").onChange( (value) => { this.contents.updatePointLightPositionZ(value) } );
        pointLightFolder.close();

        const spotLight = {
            'color': this.contents.spotLightColor,
            'intensity': this.contents.spotLightIntensity,
            'distance': this.contents.spotLightDistance,
            'angle': this.contents.spotLightAngle,
            'penumbra': this.contents.spotLightPenumbra,
            'decay': this.contents.spotLightDecay,
            'position x': this.contents.spotLightPositionX,
            'position y': this.contents.spotLightPositionY,
            'position z': this.contents.spotLightPositionZ,
            'target x': this.contents.spotLightTargetX,
            'target y': this.contents.spotLightTargetY,
            'target z': this.contents.spotLightTargetZ
        }

        // light folder
        const spotLightFolder = this.datgui.addFolder('Spot light');
        spotLightFolder.add( this.contents, 'spotHelperEnabled', false ).name("Helper");
        spotLightFolder.addColor( spotLight, 'color' ).name("Color").onChange( (value) => { this.contents.updateSpotLightColor(value) } );
        spotLightFolder.add( spotLight, 'intensity', 0, 100 ).name("Intensity").onChange( (value) => { this.contents.updateSpotLightIntensity(value) } );
        spotLightFolder.add( spotLight, 'distance', 0, 100 ).name("Distance").onChange( (value) => { this.contents.updateSpotLightDistance(value) } );
        spotLightFolder.add( spotLight, 'angle', 0, 360 ).name("Angle").onChange( (value) => { this.contents.updateSpotLightAngle(value) } );
        spotLightFolder.add( spotLight, 'penumbra', 0, 1 ).name("Penumbra").onChange( (value) => { this.contents.updateSpotLightPenumbra(value) } );
        spotLightFolder.add( spotLight, 'decay', 0, 2 ).name("Decay").onChange( (value) => { this.contents.updateSpotLightDecay(value) } );
        spotLightFolder.add( spotLight, 'position x', -10, 10 ).name("Position X").onChange( (value) => { this.contents.updateSpotLightPositionX(value) } );
        spotLightFolder.add( spotLight, 'position y', -10, 10 ).name("Position Y").onChange( (value) => { this.contents.updateSpotLightPositionY(value) } );
        spotLightFolder.add( spotLight, 'position z', -10, 10 ).name("Position Z").onChange( (value) => { this.contents.updateSpotLightPositionZ(value) } );
        spotLightFolder.add( spotLight, 'target x', -10, 10 ).name("Target X").onChange( (value) => { this.contents.updateSpotLightTargetX(value) } );
        spotLightFolder.add( spotLight, 'target y', -10, 10 ).name("Target Y").onChange( (value) => { this.contents.updateSpotLightTargetY(value) } );
        spotLightFolder.add( spotLight, 'target z', -10, 10 ).name("Target Z").onChange( (value) => { this.contents.updateSpotLightTargetZ(value) } );
        spotLightFolder.close();

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