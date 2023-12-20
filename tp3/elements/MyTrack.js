import * as THREE from 'three';

class MyTrack extends THREE.Group {
    constructor(segments = 200, width = 2) {
        super();
        this.type = 'Group';

        //Curve related attributes
        this.segments = segments;
        this.width = width;
        this.textureRepeat = 100;
        this.showWireframe = false;
        this.showMesh = true;
        this.showLine = false;
        this.closedCurve = false;

        this.path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(1, 0, -15),
            new THREE.Vector3(-9, 0, -20),
            new THREE.Vector3(-9, 0, -30),
            new THREE.Vector3(16, 0, -30),
            new THREE.Vector3(21, 0, -20),
            new THREE.Vector3(21, 0, 0),
            new THREE.Vector3(41, 0, 10),
            new THREE.Vector3(41, 0, 20),
            new THREE.Vector3(1, 0, 20),
            new THREE.Vector3(1, 0, 0)
        ]);

        this.buildCurve();
    }

    /**
     * Creates the necessary elements for the curve
     */
    buildCurve() {
        this.createCurveMaterialsTextures();
        this.createCurveObjects();
    }

    /**
     * Create materials for the curve elements: the mesh, the line and the wireframe
     */
    createCurveMaterialsTextures() {
        const texture = new THREE.TextureLoader().load("./images/track.jpg");
        texture.wrapS = THREE.RepeatWrapping;

        this.material = new THREE.MeshBasicMaterial({ map: texture });
        this.material.map.repeat.set(this.textureRepeat, 3);
        this.material.map.wrapS = THREE.RepeatWrapping;
        this.material.map.wrapT = THREE.RepeatWrapping;

        this.wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            opacity: 0.3,
            wireframe: true,
            transparent: true,
        });

        this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    }

    /**
     * Creates the mesh, the line and the wireframe used to visualize the curve
     */
    createCurveObjects() {
        let geometry = new THREE.TubeGeometry(
            this.path,
            this.segments,
            this.width,
            3,
            this.closedCurve
        );
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.wireframe = new THREE.Mesh(geometry, this.wireframeMaterial);

        let points = this.path.getPoints(this.segments);
        let bGeometry = new THREE.BufferGeometry().setFromPoints(points);

        // Create the final object to add to the scene
        this.line = new THREE.Line(bGeometry, this.lineMaterial);

        this.curve = new THREE.Group();

        this.mesh.visible = this.showMesh;
        this.wireframe.visible = this.showWireframe;
        this.line.visible = this.showLine;

        this.curve.add(this.mesh);
        this.curve.add(this.wireframe);
        this.curve.add(this.line);

        this.curve.rotateZ(Math.PI);
        this.curve.scale.set(1,0.2,1);
        this.add(this.curve);
    }

    /**
     * Called when user changes number of segments in UI. Recreates the curve's objects accordingly.
     */
    updateCurve() {
        if (this.curve !== undefined && this.curve !== null) {
            this.remove(this.curve);
        }
        this.buildCurve();
    }

    /**
     * Called when user curve's closed parameter in the UI. Recreates the curve's objects accordingly.
     */
    updateCurveClosing() {
        if (this.curve !== undefined && this.curve !== null) {
            this.remove(this.curve);
        }
        this.buildCurve();
    }

    /**
     * Called when user changes number of texture repeats in UI. Updates the repeat vector for the curve's texture.
     * @param {number} value - repeat value in S (or U) provided by user
     */
    updateTextureRepeat(value) {
        this.material.map.repeat.set(value, 3);
    }

    /**
     * Called when user changes line visibility. Shows/hides line object.
     */
    updateLineVisibility() {
        this.line.visible = this.showLine;
    }
    
    /**
     * Called when user changes wireframe visibility. Shows/hides wireframe object.
     */
    updateWireframeVisibility() {
        this.wireframe.visible = this.showWireframe;
    }

    /**
     * Called when user changes mesh visibility. Shows/hides mesh object.
     */
    updateMeshVisibility() {
        this.mesh.visible = this.showMesh;
    }
}

export { MyTrack };