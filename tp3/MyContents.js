import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyTrack } from "./elements/MyTrack.js";
import { MyVehicle } from "./elements/MyVehicle.js";

/**
 *  This class contains the contents of out application
 */
class MyContents {
  /**
       constructs the object
       @param {MyApp} app The application object
    */
  constructor(app) {
    this.app = app;
    this.axis = null;

    this.track = null;
    this.playerCar = null;
    this.autoCar = null;
  }
  /**
   * initializes the contents
   */
  init() {
    // create once
    if (this.axis === null) {
      // create and attach the axis to the scene
      this.axis = new MyAxis(this);
      this.app.scene.add(this.axis);
    }

    // add a point light on top of the model
    const pointLight = new THREE.PointLight(0xffffff, 500, 0);
    pointLight.position.set(0, 20, 0);
    this.app.scene.add(pointLight);

    // add a point light helper for the previous point light
    const sphereSize = 0.5;
    const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    this.app.scene.add(pointLightHelper);

    // add an ambient light
    const ambientLight = new THREE.AmbientLight(0x555555);
    this.app.scene.add(ambientLight);

    if (this.track === null) {
      this.track = new MyTrack();
      this.app.scene.add(this.track);
    }
    
    if (this.playerCar === null) {
      this.playerCar = new MyVehicle();
      this.track.add(this.playerCar);
    }

    if (this.autoCar === null) {
      this.autoCar = new MyVehicle(11);
      this.track.add(this.autoCar);
    }
  }

  /**
   * updates the contents
   * this method is called from the render method of the app
   */
  update() {}
}

export { MyContents };
