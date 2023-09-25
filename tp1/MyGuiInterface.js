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
        this.datgui.add(this.contents, 'tableEnabled', true).name("Table");
        this.datgui.add(this.contents, 'chairEnabled', true).name("Chair");

        /*
        // add a folder to the gui interface for the box
        const boxFolder = this.datgui.addFolder( 'Box' );
        // note that we are using a property from the contents object 
        boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange( () => { this.contents.rebuildBox() } );
        boxFolder.add(this.contents.boxDisplacement, 'x', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'y', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'z', -5, 5)
        boxFolder.close();
        */
        
        /*
        const data = {  
            'Diffuse color': this.contents.diffusePlaneColor,
            'Specular color': this.contents.specularPlaneColor,
        };

        // adds a folder to the gui interface for the plane
        const planeFolder = this.datgui.addFolder( 'Plane' );
        planeFolder.addColor( data, 'Diffuse color' ).onChange( (value) => { this.contents.updateDiffusePlaneColor(value) } );
        planeFolder.addColor( data, 'Specular color' ).onChange( (value) => { this.contents.updateSpecularPlaneColor(value) } );
        planeFolder.add(this.contents, 'planeShininess', 0, 1000).name("Shininess").onChange( (value) => { this.contents.updatePlaneShininess(value) } );
        planeFolder.close();
        */

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Perspective 2', 'Left', 'Right', 'Top', 'Front', 'Back' ] ).name("Active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("X coord")
        cameraFolder.add(this.app.activeCamera.position, 'y', 0, 10).name("Y coord")
        cameraFolder.add(this.app.activeCamera.position, 'z', 0, 10).name("Z coord")
        cameraFolder.open();
    }
}

export { MyGuiInterface };