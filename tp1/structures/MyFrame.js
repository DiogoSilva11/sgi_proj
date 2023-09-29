import * as THREE from 'three';

class MyFrame extends THREE.Object3D {
    constructor(pos, h, w, d) {
        super();
        this.type = 'Group';
        this.frameEnabled = true
        this.lastframeEnabled = null
        this.frameHeight = h
        this.frameWidth = w
        this.frameDepth = d
        this.buildFrame(pos);
    }

    /**
     * builds a rectangular frame
     */
    buildFrame(pos) {
        const textureLoader = new THREE.TextureLoader();
        const woodTexture = textureLoader.load('textures/wood.jpg');
        woodTexture.wrapS = THREE.RepeatWrapping;
        woodTexture.wrapT = THREE.RepeatWrapping;

        let frameEnd = new THREE.BoxGeometry( 
            this.frameWidth - this.frameDepth, 
            this.frameDepth,
            this.frameDepth 
        )
        let frameSide = new THREE.BoxGeometry( 
            this.frameDepth, 
            this.frameHeight - this.frameDepth,
            this.frameDepth 
        )
        const frameMaterial = new THREE.MeshPhongMaterial({
            color: "#8f563b",
            map: woodTexture,
            shininess: 50,
            emissive: "#000000"
        });

        let frameParts = [
            new THREE.Mesh(frameEnd,  frameMaterial),
            new THREE.Mesh(frameEnd,  frameMaterial),
            new THREE.Mesh(frameSide, frameMaterial),
            new THREE.Mesh(frameSide, frameMaterial)
        ]

        const frOffsX = this.frameWidth/2 - this.frameDepth/2
        const frOffsY = this.frameHeight/2 - this.frameDepth/2
        const frDisplace = this.frameDepth/2
        const framePartPos = [
            [ frDisplace, frOffsY, 0],
            [-frDisplace,-frOffsY, 0],
            [ frOffsX,-frDisplace, 0],
            [-frOffsX, frDisplace, 0],
        ]

        frameParts.forEach((part, i) => {
            part.position.x = framePartPos[i][0]
            part.position.y = framePartPos[i][1]
            part.position.z = framePartPos[i][2]
            this.add(part)
        })

        this.position.x = pos.x
        this.position.y = pos.y
        this.position.z = pos.z
    }
}

export { MyFrame };