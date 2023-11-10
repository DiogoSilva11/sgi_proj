import * as THREE from 'three';
import { MySceneData } from "../parser/MySceneData"

/**
 * Starting point for creation of the scene graph.
 * @param {MySceneData} data 
 */
function configNodes(data) {
    processNode(data, data.rootId)
}

/**
 * 
 * @param {MySceneData} data 
 * @param {String} id 
 * @param {boolean} cast
 * @param {boolean} receive
 */
function processNode(data, id, cast=false, receive=false) {
    nodeData = data.nodes[id]

    if(nodeData === undefined) {
        throw new Error("Node does not exist: "+id)
    }

    ret = new THREE.Group({
        castShadow: cast | nodeData["castshadows"],
        receiveShadow: receive | nodeData["receiveshadows"]
    })

    if(nodeData["transforms"] !== undefined) {
        if(nodeData["transforms"]["scale"] !== undefined) {
            ret.scale = nodeData["transforms"]["scale"]
        }
        if(nodeData["transforms"]["rotate"] !== undefined) {
            ret.rotation = nodeData["transforms"]["rotate"]
        }
        if(nodeData["transforms"]["translate"] !== undefined) {
            ret.position = nodeData["transforms"]["translate"]
        }
    }

    for(const c of nodeData.children) {
        switch(c.type) {
            case "primitive":
                break;
            case "pointlight":
                ret.add(new THREE.PointLight(c["color"]))
                
                break;
            case "spotlight":
                break;
            case "directionallight":
                break;
            case "noderef":
                processNode(data, c.id, ret.castShadow, ret.receiveShadow)
                break;
            default:
                throw new Error("Invalid child type: "+c.type)
        }
    }
}

export {configNodes}