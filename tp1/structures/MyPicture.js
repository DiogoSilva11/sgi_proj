import * as THREE from 'three';
import { MyStructure } from '../MyStructure.js';

/**
 * This class contains a picture representation
 */
class MyPicture extends MyStructure {
    /**
     * 
     * @param {THREE.Object3D} parent the parent object
     * @param {boolean} isPicture true if it is a picture, false if it is a window
     * @param {string} picture the path to the picture
     */
    constructor(parent, isPicture, picture) {
        super(parent);
        this.type = "Group";
        const pictureTexture = new THREE.TextureLoader().load(picture);
        pictureTexture.wrapS = THREE.RepeatWrapping;
        pictureTexture.wrapT = THREE.RepeatWrapping;

        /*
        let pictureTextureRepeatU = 1;
        let pictureSizeU = 10;
        let pictureSizeV = 7;
        let pictureUVRate = pictureSizeV / pictureSizeU;
        let pictureTextureUVRate = 3354 / 2385; // image dimensions 
        let pictureTextureRepeatV = pictureTextureRepeatU * pictureUVRate * pictureTextureUVRate;
        pictureTexture.repeat.set(pictureTextureRepeatU, pictureTextureRepeatV);
        */

        let width = 3;
        let height = 3;
        if (!isPicture) {
            width = 6;
            height = 3;
        }
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshLambertMaterial({ map: pictureTexture });
        const mesh = new THREE.Mesh(geometry, material)
        if (isPicture) mesh.rotation.y = Math.PI;

        this.add(mesh)
        parent.add(this);
    }
}

export { MyPicture };