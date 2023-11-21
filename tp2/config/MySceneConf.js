import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';
import { MyTriangle } from './MyTriangle.js';
import { MyPolygon } from './MyPolygon.js';

class MySceneConf {
    constructor(data, scene) {
        this.data = data
        this.scene = scene
        this.textures = {}
        this.materials = {}

        this.configGlobals()
        this.configFog()
        this.configTextures()
        this.configMaterials()
        this.configSkyboxes()

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

    configFog() {
        let fog = new THREE.Fog(
            new THREE.Color(this.data.fog.color.r, this.data.fog.color.g, this.data.fog.color.b),
            this.data.fog.near,
            this.data.fog.far
        )
        this.scene.fog = fog
    }

    configTextures() {
        for (let tex in this.data.textures) {
            const texData = this.data.textures[tex]
            let texture = new THREE.TextureLoader().load("../" + texData.filepath)

            if (texData.isVideo) {
                let sourceElement = document.createElement('source')
                sourceElement.src = "../" + texData.filepath
                sourceElement.type = 'video/mp4'
    
                let videoElement = document.createElement('video')
                videoElement.style.display = 'none'
                videoElement.id = 'some-video'
                videoElement.autoplay = true
                videoElement.muted = true
                videoElement.preload = 'auto'
                videoElement.width = 640
                videoElement.height = 264
                videoElement.loop = true
    
                videoElement.appendChild(sourceElement)
                document.body.appendChild(videoElement)
    
                texture = new THREE.VideoTexture(videoElement)
                texture.colorSpace = THREE.SRGBColorSpace
            }
    
            //this.configMipmap(texture, texData)

            this.textures[texData.id] = texture
        }
    }

    configMipmap(texture, texData) {
        texture.generateMipmaps = texData.mipmaps
        texture.anisotropy = texData.anisotropy

        let magFilter = null
        switch (texData.magfilter) {
            case "NearestFilter":
                magFilter = THREE.NearestFilter
                break
            default:
                magFilter = THREE.LinearFilter
                break
        }
        texture.magFilter = magFilter

        let minFilter = null
        switch (texData.minfilter) {
            case "LinearFilter":
                minFilter = THREE.LinearFilter
                break
            case "NearestFilter":
                minFilter = THREE.NearestFilter
                break
            case "NearestMipMapNearestFilter":
                minFilter = THREE.NearestMipmapNearestFilter
                break
            case "NearestMipMapLinearFilter":
                minFilter = THREE.NearestMipmapLinearFilter
                break
            case "LinearMipMapNearestFilter":
                minFilter = THREE.LinearMipmapNearestFilter
                break
            default:
                minFilter = THREE.LinearMipmapLinearFilter
                break
        }
        texture.minFilter = minFilter

        if (texture.generateMipmaps) {
            for (let level = 0; level <= 7; level++) {
                if (texData["mipmap" + level] != null) this.loadMipmap(texture, level, "../" + texData["mipmap" + level])
                else break
            }
        }

        texture.needsUpdate = true
    }

    configMaterials() {
        for (let mat in this.data.materials) {
            const matData = this.data.materials[mat]

            this.materials[matData.id] = new THREE.MeshPhongMaterial({
                name: matData.id,
                color: new THREE.Color(matData.color.r, matData.color.g, matData.color.b),
                specular: new THREE.Color(matData.specular.r, matData.specular.g, matData.specular.b),
                emissive: new THREE.Color(matData.emissive.r, matData.emissive.g, matData.emissive.b),
                shininess: matData.shininess
            })

            if (matData.wireframe !== undefined) 
                this.materials[matData.id].wireframe = matData.wireframe

            if (matData.shading !== undefined) {
                if (matData.shading === "none") {
                    this.materials[matData.id].flatShading = false
                    this.materials[matData.id].lights = false
                }
                else if (matData.shading === "flat") {
                    this.materials[matData.id].flatShading = true
                }
            }

            if (matData.textureref !== null) 
                this.materials[matData.id].map = this.textures[matData.textureref]

            if (matData.twosided !== undefined) 
                this.materials[matData.id].side = matData.twosided ? THREE.DoubleSide : THREE.FrontSide

            if (matData.bumpref != null) {
                this.materials[matData.id].bumpMap = this.textures[matData.bumpref]
                this.materials[matData.id].bumpScale = (matData.bumpscale != null) ? matData.bumpscale : 1.0
            }

            if (matData.specularref != null) 
                this.materials[matData.id].specularMap = this.textures[matData.specularref]
        }
    }

    loadMipmap(parentTexture, level, path) {
        new THREE.TextureLoader().load(path, 
            function(mipmapTexture) {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                ctx.scale(1, 1)
                const img = mipmapTexture.image         
                canvas.width = img.width;
                canvas.height = img.height
                ctx.drawImage(img, 0, 0)
                parentTexture.mipmaps[level] = canvas
            }
        )
    }

    configSkyboxes() {
        for (let skybox in this.data.skyboxes) {
            skybox = this.data.skyboxes[skybox]

            const geometry = new THREE.BoxGeometry(skybox.size[0], skybox.size[1], skybox.size[2])
            let texture = new THREE.CubeTextureLoader().load([
                "../" + skybox.front,
                "../" + skybox.back,
                "../" + skybox.up,
                "../" + skybox.down,
                "../" + skybox.left,
                "../" + skybox.right
            ])
            let material = new THREE.MeshPhongMaterial({
                envMap: texture,
                emissive: new THREE.Color(skybox.emissive.r, skybox.emissive.g, skybox.emissive.b),
                emissiveIntensity: skybox.intensity,
                side: THREE.BackSide
            })

            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.set(skybox.center[0], skybox.center[1], skybox.center[2])
            this.scene.add(mesh)
        }
    }

    configNode(key, material = null, castShadows = false, receiveShadows = false) {
        let node = this.data.nodes[key]
        let group = new THREE.Group()

        if (node.castShadows == true) castShadows = true
        if (node.receiveShadows == true) receiveShadows = true
        if (node.transformations !== undefined) this.transformNode(node, group)
        if (node.materialIds.length != 0) material = this.materials[node.materialIds[0]]

        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i]
            switch (child.type) {
                case "node":
                    let newNode = this.configNode(child.id, material, castShadows, receiveShadows)
                    group.add(newNode)
                    break
                case "lod":
                    let lod = this.configLod(child, material, castShadows, receiveShadows)
                    group.add(lod)
                    break
                case "pointlight":
                    let pointLight = this.configPointLight(child)
                    group.add(pointLight)
                    group.add(new THREE.PointLightHelper(pointLight))
                    break
                case "spotlight":
                    let spotLight = this.configSpotLight(child)
                    group.add(spotLight)
                    group.add(spotLight.target)
                    group.add(new THREE.SpotLightHelper(spotLight))
                    break
                case "directionallight":
                    let directionalLight = this.configDirectionalLight(child)
                    group.add(directionalLight)
                    group.add(new THREE.DirectionalLightHelper(directionalLight))
                    break
                case "primitive":
                    switch (child.subtype) {
                        case "cylinder":
                            let cylinder = this.configCylinder(child, material, castShadows, receiveShadows)
                            group.add(cylinder)
                            break
                        case "rectangle":
                            let rectangle = this.configRectangle(child, material, castShadows, receiveShadows)
                            group.add(rectangle)
                            break
                        case "triangle":
                            let triangle = this.configTriangle(child, material, castShadows, receiveShadows)
                            group.add(triangle)
                            break
                        //case "model3d":
                        //    let model3d = this.configModel3D(child, material, castShadows, receiveShadows)
                        //    group.add(model3d)
                        //    break
                        case "sphere":
                            let sphere = this.configSphere(child, material, castShadows, receiveShadows)
                            group.add(sphere)
                            break
                        case "box":
                            let box = this.configBox(child, material, castShadows, receiveShadows)
                            group.add(box)
                            break
                        case "nurbs":
                            let nurbs = this.configNurbs(child, material, castShadows, receiveShadows)
                            group.add(nurbs)
                            break
                        case "polygon":
                            let polygon = this.configPolygon(child, material, castShadows, receiveShadows)
                            group.add(polygon)
                            break
                        default:
                            break
                    }
                default:
                    break
            }
        }

        return group
    }

    transformNode(node, group) {
        for (let t in node.transformations) {
            t = node.transformations[t]
            switch (t.type) {
                case "T":
                    const tx = group.position.x + t.translate[0]
                    const ty = group.position.y + t.translate[1]
                    const tz = group.position.z + t.translate[2]
                    group.position.set(tx, ty, tz)
                    break
                case "R":
                    const rx = group.rotation.x + t.rotation[0] //* (Math.PI / 180)
                    const ry = group.rotation.y + t.rotation[1] //* (Math.PI / 180)
                    const rz = group.rotation.z + t.rotation[2] //* (Math.PI / 180)
                    group.rotation.set(rx, ry, rz)
                    break
                case "S":
                    const sx = group.scale.x * t.scale[0]
                    const sy = group.scale.y * t.scale[1]
                    const sz = group.scale.z * t.scale[2]
                    group.scale.set(sx, sy, sz)
                    break
                default:
                    break
            }
        }
    }

    configLod(child, material = null, castShadows = false, receiveShadows = false) {
        let lod = new THREE.LOD()

        const noderefs = child.children
        for (const ref in noderefs) {
            const newGroup = this.configNode(noderefs[ref].node.id, material, castShadows, receiveShadows)
            const dist = noderefs[ref].mindist
            lod.addLevel(newGroup, dist)
        }

        return lod
    }

    configPointLight(child) {
        let light = new THREE.PointLight(
            new THREE.Color(child.color.r, child.color.g, child.color.b)
        )
        light.position.set(child.position[0], child.position[1], child.position[2])

        if (child.enabled !== undefined) light.visible = child.enabled
        if (child.intensity !== undefined) light.intensity = child.intensity
        if (child.distance !== undefined) light.distance = child.distance
        if (child.decay !== undefined) light.decay = child.decay
        if (child.castshadow !== undefined) light.castShadow = child.castshadow
        if (child.shadowfar !== undefined) light.shadow.camera.far = child.shadowFar
        if (child.shadowmapsize !== undefined) {
            light.shadow.mapSize.width = child.shadowmapsize
            light.shadow.mapSize.height = child.shadowmapsize
        }

        return light
    }

    configSpotLight(child) {
        let light = new THREE.SpotLight(
            new THREE.Color(child.color.r, child.color.g, child.color.b),
        )
        light.position.set(child.position[0], child.position[1], child.position[2])
        light.target.position.set(child.target[0], child.target[1], child.target[2])
        light.angle = child.angle * (Math.PI / 180)

        if (child.enabled !== undefined) light.visible = child.enabled
        if (child.intensity !== undefined) light.intensity = child.intensity
        if (child.distance !== undefined) light.distance = child.distance
        if (child.decay !== undefined) light.decay = child.decay
        if (child.penumbra !== undefined) light.penumbra = child.penumbra
        if (child.castshadow !== undefined) light.castShadow = child.castshadow
        if (child.shadowfar !== undefined) light.shadow.camera.far = child.shadowFar
        if (child.shadowmapsize !== undefined) {
            light.shadow.mapSize.width = child.shadowmapsize
            light.shadow.mapSize.height = child.shadowmapsize
        }

        return light
    }

    configDirectionalLight(child) {
        let light = new THREE.DirectionalLight(
            new THREE.Color(child.color.r, child.color.g, child.color.b)
        )
        light.position.set(child.position[0], child.position[1], child.position[2])

        if (child.enabled !== undefined) light.visible = child.enabled
        if (child.intensity !== undefined) light.intensity = child.intensity
        if (child.castshadow !== undefined) light.castShadow = child.castshadow
        if (child.shadowleft !== undefined) light.shadow.camera.left = child.shadowleft
        if (child.shadowright !== undefined) light.shadow.camera.right = child.shadowright
        if (child.shadowbottom !== undefined) light.shadow.camera.bottom = child.shadowbottom
        if (child.shadowtop !== undefined) light.shadow.camera.top = child.shadowtop
        if (child.shadowfar !== undefined) light.shadow.camera.far = child.shadowFar
        if (child.shadowmapsize !== undefined) {
            light.shadow.mapSize.width = child.shadowmapsize
            light.shadow.mapSize.height = child.shadowmapsize
        }

        return light
    }

    configCylinder(child, material = null, castShadows = false, receiveShadows = false) {
        let geometry = new THREE.CylinderGeometry(
            child.representations[0].top,
            child.representations[0].base,
            child.representations[0].height,
            child.representations[0].slices,
            child.representations[0].stacks
        )

        if (child.representations[0].capsclose !== undefined) geometry.parameters.openEnded = !child.representations[0].capsclose
        if (child.representations[0].thetastart !== undefined) geometry.parameters.thetaStart = child.representations[0].thetastart * (Math.PI / 180)
        if (child.representations[0].thetalength !== undefined) geometry.parameters.thetaLength = child.representations[0].thetalength * (Math.PI / 180)
    
        if (material != null) {
            const width = Math.abs(child.representations[0].top - child.representations[0].base) * 2
            const height = child.representations[0].height
            this.configRepeatFactor(material, width, height)
        }
        else 
            material = new THREE.MeshPhongMaterial()

        let cylinder = new THREE.Mesh(geometry, material)
        cylinder.castShadow = castShadows
        cylinder.receiveShadow = receiveShadows

        return cylinder
    }
    
    configRectangle(child, material = null, castShadows = false, receiveShadows = false) {
        const x1 = child.representations[0].xy1[0]
        const y1 = child.representations[0].xy1[1]
        const x2 = child.representations[0].xy2[0]
        const y2 = child.representations[0].xy2[1]
        let geometry = new THREE.PlaneGeometry(x2 - x1, y2 - y1)

        if (child.representations[0].parts_x !== undefined) geometry.parameters.widthSegments = child.representations[0].parts_x
        if (child.representations[0].parts_y !== undefined) geometry.parameters.heightSegments = child.representations[0].parts_y

        if (material != null) {
            const width = Math.abs(x2 - x1)
            const height = Math.abs(y2 - y1)
            this.configRepeatFactor(material, width, height)
        }
        else 
            material = new THREE.MeshPhongMaterial()

        let rectangle = new THREE.Mesh(geometry, material)
        rectangle.position.set((x2 + x1) / 2, (y2 + y1) / 2)
        rectangle.castShadow = castShadows
        rectangle.receiveShadow = receiveShadows

        return rectangle
    }

    configTriangle(child, material = null, castShadows = false, receiveShadows = false) {
        const x1 = child.representations[0].xyz1[0]
        const y1 = child.representations[0].xyz1[1]
        const z1 = child.representations[0].xyz1[2]
        const x2 = child.representations[0].xyz2[0]
        const y2 = child.representations[0].xyz2[1]
        const z2 = child.representations[0].xyz2[2]
        const x3 = child.representations[0].xyz3[0]
        const y3 = child.representations[0].xyz3[1]
        const z3 = child.representations[0].xyz3[2]

        let geometry = new MyTriangle(x1, y1, z1, x2, y2, z2, x3, y3, z3)

        if (material != null) {
            const p1 = new THREE.Vector3(x1, y1, z1)
            const p2 = new THREE.Vector3(x2, y2, z2)
            const p3 = new THREE.Vector3(x3, y3, z3)
            const width = p1.distanceTo(p2)
            const cross = new THREE.Vector3().crossVectors(
                new THREE.Vector3().subVectors(p2, p1),
                new THREE.Vector3().subVectors(p3, p1)
            )
            const height = cross.length() / width
            this.configRepeatFactor(material, width, height)
        }
        else 
            material = new THREE.MeshPhongMaterial()

        let triangle = new THREE.Mesh(geometry, material)
        triangle.castShadow = castShadows
        triangle.receiveShadow = receiveShadows

        return triangle
    }

    configModel3D(child, material = null, castShadows = false, receiveShadows = false) {
        // to do
    }
    
    configSphere(child, material = null, castShadows = false, receiveShadows = false) {
        let geometry = new THREE.SphereGeometry(
            child.representations[0].radius,
            child.representations[0].slices,
            child.representations[0].stacks
        )

        if (child.representations[0].thetastart !== undefined) geometry.parameters.thetaStart = child.representations[0].thetastart * (Math.PI / 180)
        if (child.representations[0].thetalength !== undefined) geometry.parameters.thetaLength = child.representations[0].thetalength * (Math.PI / 180)
        if (child.representations[0].phistart !== undefined) geometry.parameters.phiStart = child.representations[0].phistart * (Math.PI / 180)
        if (child.representations[0].philength !== undefined) geometry.parameters.phiLength = child.representations[0].philength * (Math.PI / 180)

        if (material != null) {
            const width = child.representations[0].radius
            const height = child.representations[0].radius
            this.configRepeatFactor(material, width, height)
        }
        else 
            material = new THREE.MeshPhongMaterial()

        let sphere = new THREE.Mesh(geometry, material)
        sphere.castShadow = castShadows
        sphere.receiveShadow = receiveShadows

        return sphere
    }
    
    configBox(child, material = null, castShadows = false, receiveShadows = false) {
        const x1 = child.representations[0].xyz1[0]
        const y1 = child.representations[0].xyz1[1]
        const z1 = child.representations[0].xyz1[2]
        const x2 = child.representations[0].xyz2[0]
        const y2 = child.representations[0].xyz2[1]
        const z2 = child.representations[0].xyz2[2]
        let geometry = new THREE.BoxGeometry(x2 - x1, y2 - y1, z2 - z1)

        if (child.representations[0].parts_x !== undefined) geometry.parameters.widthSegments = child.representations[0].parts_x
        if (child.representations[0].parts_y !== undefined) geometry.parameters.heightSegments = child.representations[0].parts_y
        if (child.representations[0].parts_z !== undefined) geometry.parameters.depthSegments = child.representations[0].parts_z

        if (material != null) {
            const width = Math.abs(x2 - x1)
            const height = Math.abs(y2 - y1)
            this.configRepeatFactor(material, width, height)
        }
        else 
            material = new THREE.MeshPhongMaterial()

        let box = new THREE.Mesh(geometry, material)
        box.position.set((x2 + x1) / 2, (y2 + y1) / 2, (z2 + z1) / 2)

        box.castShadow = castShadows
        box.receiveShadow = receiveShadows

        return box
    }

    configNurbs(child, material = null, castShadows = false, receiveShadows = false) {
        const degreeU = child.representations[0].degree_u
        const degreeV = child.representations[0].degree_v

        let controlPoints = [];
        for (let i = 0; i <= degreeU; i++) {
            let row = []
            for (let j = 0; j <= degreeV; j++) {
                let point = [
                    child.representations[0].controlpoints[i * (degreeV + 1) + j].xx,
                    child.representations[0].controlpoints[i * (degreeV + 1) + j].yy,
                    child.representations[0].controlpoints[i * (degreeV + 1) + j].zz,
                    1
                ]
                row.push(point)
            }
            controlPoints.push(row)
        }

        if (material != null) {
            let minX = child.representations[0].controlpoints[0]["xx"]
            let maxX = child.representations[0].controlpoints[0]["xx"]
            let minY = child.representations[0].controlpoints[0]["yy"]
            let maxY = child.representations[0].controlpoints[0]["yy"]
        
            for (let i = 1; i < child.representations[0].controlpoints.length; i++) {
                const currentX = child.representations[0].controlpoints[i]["xx"]
                const currentY = child.representations[0].controlpoints[i]["yy"]
                minX = Math.min(minX, currentX)
                maxX = Math.max(maxX, currentX)
                minY = Math.min(minY, currentY)
                maxY = Math.max(maxY, currentY)
            }
        
            const width = maxX - minX
            const height = maxY - minY
            this.configRepeatFactor(material, width, height)
        }
        else 
            material = new THREE.MeshPhongMaterial()

        let builder = new MyNurbsBuilder()
        let surface = builder.build(
            controlPoints,
            degreeU,
            degreeV,
            child.representations[0].parts_u,
            child.representations[0].parts_v,
            material
        )

        let nurbs = new THREE.Mesh(surface, material)
        nurbs.castShadow = castShadows
        nurbs.receiveShadow = receiveShadows

        return nurbs
    }

    configPolygon(child, material = null, castShadows = false, receiveShadows = false) {
        const radius = child.representations[0].radius
        const stacks = child.representations[0].stacks
        const slices = child.representations[0].slices
        const color_c = child.representations[0].color_c
        const color_p = child.representations[0].color_p

        let geometry = new MyPolygon(radius, stacks, slices, color_c, color_p)

        material = (material == null) ? new THREE.MeshPhongMaterial() : material
        material.vertexColors = true

        let polygon = new THREE.Mesh(geometry, material)

        return polygon
    }

    configRepeatFactor(material, width, height) {
        if (material.map == null) return
        material.map.wrapS = THREE.RepeatWrapping
        material.map.wrapT = THREE.RepeatWrapping
        const matData = this.data.materials[material.name]
        material.map.repeat.set(width / matData.texlength_s, height / matData.texlength_t)
    }
}

export { MySceneConf }