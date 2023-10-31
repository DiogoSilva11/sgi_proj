import * as THREE from 'three';

class MySceneGraph {
    constructor(data, scene) {
        this.data = data
        this.scene = scene
        this.configNode(this.data.rootId)
    }

    configNode(key, parent = this.scene) {
        let node = this.data.nodes[key]
        let group = new THREE.Group()

        if (node.transformations != undefined) {
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

        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i]
            switch (child.type) {
                case "node":
                    this.configNode(child.id, group)
                    break;
                case "primitive":
                    switch (child.subtype) {
                        case "cylinder":
                            this.configCylinder(child, group)
                            break;
                        case "rectangle":
                            this.configRectangle(child, group)
                            break;
                        case "triangle":
                            //this.configTriangle(child, group)
                            break;
                        case "sphere":
                            this.configSphere(child, group)
                            break;
                        case "box":
                            this.configBox(child, group)
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

    configCylinder(child, parent = this.scene) {
        let base = child.representations[0].base
        let top = child.representations[0].top
        let height = child.representations[0].height
        let slices = child.representations[0].slices
        let stacks = child.representations[0].stacks    
        // to do: optional parameters
        let geometry = new THREE.CylinderGeometry(base, top, height, slices, stacks)
        let material = new THREE.MeshBasicMaterial({color: 0xffffff})
        let cylinder = new THREE.Mesh(geometry, material)
        parent.add(cylinder)
    }
    
    configRectangle(child, parent = this.scene) {
        let x1 = child.representations[0].xy1[0]
        let y1 = child.representations[0].xy1[1]
        let x2 = child.representations[0].xy2[0]
        let y2 = child.representations[0].xy2[1]
        // to do: optional parameters
        let geometry = new THREE.PlaneGeometry(x2 - x1, y2 - y1)
        let material = new THREE.MeshBasicMaterial({color: 0xffffff})
        let rectangle = new THREE.Mesh(geometry, material)
        parent.add(rectangle)
    }
    
    configSphere(child, parent = this.scene) {
        let radius = child.representations[0].radius
        let slices = child.representations[0].slices
        let stacks = child.representations[0].stacks
        // to do: optional parameters
        let geometry = new THREE.SphereGeometry(radius, slices, stacks)
        let material = new THREE.MeshBasicMaterial({color: 0xffffff})
        let sphere = new THREE.Mesh(geometry, material)
        parent.add(sphere)
    }
    
    configBox(child, parent = this.scene) {
        let x1 = child.representations[0].xyz1[0]
        let y1 = child.representations[0].xyz1[1]
        let z1 = child.representations[0].xyz1[2]
        let x2 = child.representations[0].xyz2[0]
        let y2 = child.representations[0].xyz2[1]
        let z2 = child.representations[0].xyz2[2]
        // to do: optional parameters
        let geometry = new THREE.BoxGeometry(x2 - x1, y2 - y1, z2 - z1)
        let material = new THREE.MeshBasicMaterial({color: 0xffffff})
        let box = new THREE.Mesh(geometry, material)
        parent.add(box)
    }
}

export { MySceneGraph }