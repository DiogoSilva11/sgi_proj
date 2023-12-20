import * as THREE from "three";
import { MyGame } from "./MyGame.js";

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
    this.game = new MyGame(app);
    this.game.init();
  }

  /**
   * initializes the contents
   */
  init() {
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
  }

  /**
   * updates the contents
   * this method is called from the render method of the app
   */
  update() {
    this.game.update();
  }
}

export { MyContents };
