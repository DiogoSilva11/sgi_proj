import * as THREE from 'three';

function configGraph(data, scene) {
    for (var key in data.nodes) {
        let group = configNode(data.nodes[key])
        scene.add(group)
    }
}

function configNode(node) {
    let group = new THREE.Group()

    for (let i = 0; i < node.children.length; i++) {
        let child = node.children[i]
        switch (child.type) {
            case "primitive":
                switch (child.subtype) {
                    case "cylinder":
                        configCylinder(child, group)
                        break;
                    case "rectangle":
                        configRectangle(child, group)
                        break;
                    case "triangle":
                        configTriangle(child, group)
                        break;
                    case "sphere":
                        configSphere(child, group)
                        break;
                    case "box":
                        configBox(child, group)
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    }

    return group
}

function configCylinder(child, parent) {
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

function configRectangle(child, parent) {
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

function configTriangle(child, parent) {
    // to do
}

function configSphere(child, parent) {
    let radius = child.representations[0].radius
    let slices = child.representations[0].slices
    let stacks = child.representations[0].stacks
    // to do: optional parameters
    let geometry = new THREE.SphereGeometry(radius, slices, stacks)
    let material = new THREE.MeshBasicMaterial({color: 0xffffff})
    let sphere = new THREE.Mesh(geometry, material)
    parent.add(sphere)
}

function configBox(child, parent) {
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

export {configGraph}