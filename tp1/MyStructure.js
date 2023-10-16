import * as THREE from 'three';

/**
 * This class is a base class for all the objects in the scene
 */
class MyStructure extends THREE.Mesh {
    /**
     * 
     * @param {THREE.Object3D} parent the parent object 
     */
    constructor(parent) {
        super();
        this.parent = parent
        this.enabled = true;
        this.lastEnabled = true;
    }

    /**
     * Update the object if required
     */
    updateIfRequired() {
        if (this.enabled !== this.lastEnabled) {
            this.lastEnabled = this.enabled
            if (this.enabled) {
                this.parent.add(this)
            }
            else {
                let tmp = this.parent
                this.removeFromParent()
                this.parent = tmp
            }
        }
    }
}

export { MyStructure };