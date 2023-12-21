import * as THREE from "three";
import { MyGame } from "./game/MyGame.js";

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

    const geometry = new THREE.BoxGeometry(100, 100, 100);
    let texture = new THREE.CubeTextureLoader().load([
        "./images/skybox.png",
        "./images/skybox.png",
        "./images/skybox.png",
        "./images/skybox.png",
        "./images/skybox.png",
        "./images/skybox.png"
    ]);
    let material = new THREE.MeshPhongMaterial({
        envMap: texture,
        emissive: 0xffffff,
        emissiveIntensity: 1,
        side: THREE.BackSide
    });
    this.skybox = new THREE.Mesh(geometry, material);
    this.app.scene.add(this.skybox);
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
