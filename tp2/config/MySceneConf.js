import * as THREE from 'three';

class MySceneConf {
    constructor(data, scene) {
        this.data = data
        this.scene = scene
        this.materials = {}

        this.configGlobals()
        this.configMaterials()

        let baseNode = this.configNode(this.data.rootId)
        this.scene.add(baseNode)
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

    configNode(key, material = null) {
        let node = this.data.nodes[key]
        let group = new THREE.Group()

        if (node.transformations !== undefined) this.transformNode(node, group)
        if (node.materialIds.length != 0) material = this.materials[node.materialIds[0]]

        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i]
            switch (child.type) {
                case "node":
                    let newNode = this.configNode(child.id, material)
                    group.add(newNode)
                    break;
                case "pointlight":
                    let pointLight = this.configPointLight(child)
                    group.add(pointLight)
                    break;
                case "spotlight":
                    let spotLight = this.configSpotLight(child)
                    group.add(spotLight)
                    break;
                case "directionallight":
                    let directionalLight = this.configDirectionalLight(child)
                    group.add(directionalLight)
                    break;
                case "primitive":
                    switch (child.subtype) {
                        case "cylinder":
                            let cylinder = this.configCylinder(child, material)
                            group.add(cylinder)
                            break;
                        case "rectangle":
                            let rectangle = this.configRectangle(child, material)
                            group.add(rectangle)
                            break;
                        case "sphere":
                            let sphere = this.configSphere(child, material)
                            group.add(sphere)
                            break;
                        case "box":
                            let box = this.configBox(child, material)
                            group.add(box)
                            break;
                        default:
                            break;
                    }
                default:
                    break;
            }
        }

        return group
    }

    transformNode(node, group) {
        for (var t in node.transformations) {
            t = node.transformations[t]
            switch (t.type) {
                case "T":
                    const tx = group.position.x + t.translate[0]
                    const ty = group.position.y + t.translate[1]
                    const tz = group.position.z + t.translate[2]
                    group.position.set(tx, ty, tz)
                    break;
                case "R":
                    const rx = group.rotation.x + t.rotation[0] * (Math.PI / 180)
                    const ry = group.rotation.y + t.rotation[1] * (Math.PI / 180)
                    const rz = group.rotation.z + t.rotation[2] * (Math.PI / 180)
                    group.rotation.set(rx, ry, rz)
                    break;
                case "S":
                    const sx = group.scale.x * t.scale[0]
                    const sy = group.scale.y * t.scale[1]
                    const sz = group.scale.z * t.scale[2]
                    group.scale.set(sx, sy, sz)
                    break;
                default:
                    break;
            }
        }
    }

    configPointLight(child) {
        let light = new THREE.PointLight(
            new THREE.Color(child.color.r, child.color.g, child.color.b)
        )
        light.position.set(child.position[0], child.position[0], child.position[0])

        // to do: optional parameters

        return light
    }

    configSpotLight(child) {
        let light = new THREE.SpotLight(
            new THREE.Color(child.color.r, child.color.g, child.color.b),
        )
        light.position.set(child.position[0], child.position[0], child.position[0])
        light.target.position.set(child.target[0], child.target[1], child.target[2])
        light.angle = child.angle * (Math.PI / 180)

        // to do: optional parameters

        return light
    }

    configDirectionalLight(child) {
        let light = new THREE.DirectionalLight(
            new THREE.Color(child.color.r, child.color.g, child.color.b)
        )
        light.position.set(child.position[0], child.position[0], child.position[0])

        // to do: optional parameters

        return light
    }

    configCylinder(child, material = null) {
        let geometry = new THREE.CylinderGeometry(
            child.representations[0].top,
            child.representations[0].base,
            child.representations[0].height,
            child.representations[0].slices,
            child.representations[0].stacks
        )

        // to do: optional parameters
    
        if (material == null) material = new THREE.MeshBasicMaterial({color: 0xffffff})
        let cylinder = new THREE.Mesh(geometry, material)

        return cylinder
    }
    
    configRectangle(child, material = null) {
        const x1 = child.representations[0].xy1[0]
        const y1 = child.representations[0].xy1[1]
        const x2 = child.representations[0].xy2[0]
        const y2 = child.representations[0].xy2[1]
        let geometry = new THREE.PlaneGeometry(x2 - x1, y2 - y1)

        // to do: optional parameters

        if (material == null) material = new THREE.MeshBasicMaterial({color: 0xffffff})
        let rectangle = new THREE.Mesh(geometry, material)
        rectangle.position.set((x2 + x1) / 2, (y2 + y1) / 2)

        return rectangle
    }
    
    configSphere(child, material = null) {
        let geometry = new THREE.SphereGeometry(
            child.representations[0].radius,
            child.representations[0].slices,
            child.representations[0].stacks
        )

        // to do: optional parameters

        if (material == null) material = new THREE.MeshBasicMaterial({color: 0xffffff})
        let sphere = new THREE.Mesh(geometry, material)

        return sphere
    }
    
    configBox(child, material = null) {
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
        box.position.set((x2 + x1) / 2, (y2 + y1) / 2, (z2 + z1) / 2)

        return box
    }
}

export { MySceneConf }