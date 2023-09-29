import * as THREE from 'three';

class MyPicture extends THREE.Mesh {
    constructor(picture) {
        const pictureTexture = new THREE.TextureLoader().load(picture);
        pictureTexture.wrapS = THREE.RepeatWrapping;
        pictureTexture.wrapT = THREE.RepeatWrapping;
        //let pictureTextureRepeatU = 1;
        //let pictureSizeU = 10;
        //let pictureSizeV = 7;
        //let pictureUVRate = pictureSizeV / pictureSizeU;
        //let pictureTextureUVRate = 3354 / 2385; // image dimensions 
        //let pictureTextureRepeatV = pictureTextureRepeatU * pictureUVRate * pictureTextureUVRate;
        //pictureTexture.repeat.set(pictureTextureRepeatU, pictureTextureRepeatV);

        const geometry = new THREE.PlaneGeometry(3, 3);
        const material = new THREE.MeshLambertMaterial({ map: pictureTexture });
        super(geometry, material);
        this.type = 'MyPicture';
        this.rotation.y = Math.PI;
    }
}

export { MyPicture };