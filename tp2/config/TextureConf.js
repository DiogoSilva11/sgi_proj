import * as THREE from 'three';
import { MySceneData } from "../parser/MySceneData.js";

/**
 * Extracts texture filepaths from data.
 * @param {MySceneData} data 
 */
function configTextures(data) {
    let ret = []

    for(const k in data.textures) {
        const texData = data.textures[k]

        ret[texData.id] = texData.filepath
    }
    return ret
}

export {configTextures}