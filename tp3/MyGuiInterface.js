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
        
        const folderGeometry = this.datgui.addFolder("Curve");
        folderGeometry
            .add(this.contents.track, "segments", 10, 200)
            .step(50)
            .onChange((value)=>this.contents.track.updateCurve(value));
        folderGeometry
            .add(this.contents.track, "closedCurve")
            .onChange((value)=>this.contents.track.updateCurveClosing(value));
        folderGeometry
            .add(this.contents.track, "textureRepeat", 1, 100)
            .step(1)
            .onChange((value)=>{this.contents.track.updateTextureRepeat(value)});
        folderGeometry
            .add(this.contents.track, "showLine")
            .name("Show line")
            .onChange(()=>this.contents.track.updateLineVisibility());
        folderGeometry
            .add(this.contents.track, "showWireframe")
            .name("Show wireframe")
            .onChange(()=>this.contents.track.updateWireframeVisibility());
        folderGeometry
            .add(this.contents.track, "showMesh")
            .name("Show mesh")
            .onChange(()=>this.contents.track.updateMeshVisibility());
    }
}

export { MyGuiInterface };