import * as THREE from 'three';
import { MyStructure } from '../MyStructure.js';

class MyFrame extends MyStructure {
    constructor(parent, texture, pos, h, w, d) {
        super(parent);
        this.type = 'Group';
        this.texture = texture
        this.frameEnabled = true
        this.lastframeEnabled = null
        this.frameHeight = h
        this.frameWidth = w
        this.frameDepth = d
        this.buildFrame(pos);

        parent.add(this);
    }

    /**
     * builds a rectangular frame
     */
    buildFrame(pos) {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(this.texture);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

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
            
        const frameMaterial = new THREE.MeshLambertMaterial({ map: texture });

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