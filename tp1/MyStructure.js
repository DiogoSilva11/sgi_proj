import * as THREE from 'three';

class MyStructure extends THREE.Mesh {
    constructor(parent) {
        super();
        this.parent = parent
        this.enabled = true;
        this.lastEnabled = true;
    }

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