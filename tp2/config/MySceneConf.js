import * as THREE from 'three';

class MySceneConf {
    constructor(data, scene) {
        this.data = data
        this.scene = scene
        this.materials = {}

        this.configGlobals()
        this.configMaterials()
        this.configNode(this.data.rootId)
    }

    configGlobals() {
        if (this.data.options.type == "globals") {
            let background = this.data.options.background
            if (background !== undefined) {
                this.scene.background = new THREE.Color(background.r, background.g, background.b)
            }

            let ambient = this.data.options.ambient
            if (ambient !== undefined) {
                const ambientColor = new THREE.Color(ambient.r, ambient.g, ambient.b)
                this.scene.add(new THREE.AmbientLight(ambientColor))
            }
        }
    }

    configMaterials() {
        for (var mat in this.data.materials) {
            mat = this.data.materials[mat]

            this.materials[mat.id] = new THREE.MeshPhongMaterial({
                color: new THREE.Color(mat.color.r, mat.color.g, mat.color.b),
                specular: new THREE.Color(mat.specular.r, mat.specular.g, mat.specular.b),
                emissive: new THREE.Color(mat.emissive.r, mat.emissive.g, mat.emissive.b),
                shininess: mat.shininess
            })

            if (mat.textureref !== undefined) {
                const file = "../" + this.data.textures[mat.textureref].filepath
                const texture = new THREE.TextureLoader().load(file)
                this.materials[mat.id].map = texture
            }

            // to do
        }
    }

    configNode(key, parent = this.scene, material = null) {
        let node = this.data.nodes[key]
        let group = new THREE.Group()

        if (node.transformations !== undefined) {
            for (var t in node.transformations) {
                t = node.transformations[t]
                switch (t.type) {
                    case "T":
                        group.position.set(t.translate[0], t.translate[1], t.translate[2])
                        break;
                    case "R":
                        group.rotation.set(
                            t.rotation[0] * (Math.PI / 180),
                            t.rotation[1] * (Math.PI / 180),
                            t.rotation[2] * (Math.PI / 180)
                        )
                        break;
                    case "S":
                        group.scale.set(t.scale[0], t.scale[1], t.scale[2])
                        break;
                    default:
                        break;
                }
            }
        }

        if (node.materialIds !== undefined) {
            material = this.materials[node.materialIds[0]]
        }

        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i]
            switch (child.type) {
                case "node":
                    this.configNode(child.id, group, material)
                    break;
                case "pointlight":
                    this.configPointLight(child, group)
                    break;
                case "spotlight":
                    this.configSpotLight(child, group)
                    break;
                case "directionallight":
                    this.configDirectionalLight(child, group)
                    break;
                case "primitive":
                    switch (child.subtype) {
                        case "cylinder":
                            this.configCylinder(child, group, material)
                            break;
                        case "rectangle":
                            this.configRectangle(child, group, material)
                            break;
                        case "triangle":
                            //this.configTriangle(child, group, material)
                            break;
                        case "sphere":
                            this.configSphere(child, group, material)
                            break;
                        case "box":
                            this.configBox(child, group, material)
                            break;
                        default:
                            break;
                    }
                default:
                    break;
            }
        }

        parent.add(group)
    }

    configPointLight(child, parent = this.scene) {
        let light = new THREE.PointLight(
            new THREE.Color(child.color.r, child.color.g, child.color.b)
        )
        light.position.set(child.position[0], child.position[0], child.position[0])

        // to do: optional parameters

        parent.add(light)
    }

    configSpotLight(child, parent = this.scene) {
        let light = new THREE.SpotLight(
            new THREE.Color(child.color.r, child.color.g, child.color.b),
        )
        light.position.set(child.position[0], child.position[0], child.position[0])
        light.target.position.set(child.target[0], child.target[1], child.target[2])
        light.angle = child.angle * (Math.PI / 180)

        // to do: optional parameters

        parent.add(light)
        parent.add(light.target)
    }

    configDirectionalLight(child, parent = this.scene) {
        console.log(child)

        let light = new THREE.DirectionalLight(
            new THREE.Color(child.color.r, child.color.g, child.color.b)
        )
        light.position.set(child.position[0], child.position[0], child.position[0])

        // to do: optional parameters

        parent.add(light)
    }

    configCylinder(child, parent = this.scene, material = null) {
        let geometry = new THREE.CylinderGeometry(
            child.representations[0].base,
            child.representations[0].top,
            child.representations[0].height,
            child.representations[0].slices,
            child.representations[0].stacks
        )

        // to do: optional parameters
    
        if (material == null) material = new THREE.MeshBasicMaterial({color: 0xffffff})
        let cylinder = new THREE.Mesh(geometry, material)

        parent.add(cylinder)
    }
    
    configRectangle(child, parent = this.scene, material = null) {
        const x1 = child.representations[0].xy1[0]
        const y1 = child.representations[0].xy1[1]
        const x2 = child.representations[0].xy2[0]
        const y2 = child.representations[0].xy2[1]
        let geometry = new THREE.PlaneGeometry(x2 - x1, y2 - y1)

        // to do: optional parameters

        if (material == null) material = new THREE.MeshBasicMaterial({color: 0xffffff})
        let rectangle = new THREE.Mesh(geometry, material)

        parent.add(rectangle)
    }
    
    configSphere(child, parent = this.scene, material = null) {
        let geometry = new THREE.SphereGeometry(
            child.representations[0].radius,
            child.representations[0].slices,
            child.representations[0].stacks
        )

        // to do: optional parameters

        if (material == null) material = new THREE.MeshBasicMaterial({color: 0xffffff})
        let sphere = new THREE.Mesh(geometry, material)

        parent.add(sphere)
    }
    
    configBox(child, parent = this.scene, material = null) {
        const x1 = child.representations[0].xyz1[0]
        const y1 = child.representations[0].xyz1[1]
        const z1 = child.representations[0].xyz1[2]
        const x2 = child.representations[0].xyz2[0]
        const y2 = child.representations[0].xyz2[1]
        const z2 = child.representations[0].xyz2[2]
        let geometry = new THREE.BoxGeometry(x2 - x1, y2 - y1, z2 - z1)

        // to do: optional parameters

        if (material == null) material = new THREE.MeshBasicMaterial({color: 0xffffff})
        let box = new THREE.Mesh(geometry, material)

        parent.add(box)
    }
}

export { MySceneConf }