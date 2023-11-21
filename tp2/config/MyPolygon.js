import * as THREE from 'three';
import { MyTriangle } from './MyTriangle.js';

class MyPolygon extends THREE.BufferGeometry {
    constructor(radius, stacks, slices, centerColor, peripheryColor) {
        super()
        this.radius = radius
        this.stacks = stacks
        this.slices = slices
        this.centerColor = new THREE.Color(centerColor)
        this.peripheryColor = new THREE.Color(peripheryColor)
        this.initBuffers()
    }

    initBuffers() {
        const positions = []
        const normals = []
        const colors = []

        for (let i = 0; i < this.slices; i++) {
            const ax = Math.cos(i * (Math.PI * 2) / this.slices) * this.radius
            const ay = Math.sin(i * (Math.PI * 2) / this.slices) * this.radius
            const bx = Math.cos((i + 1) * (Math.PI * 2) / this.slices) * this.radius
            const by = Math.sin((i + 1) * (Math.PI * 2) / this.slices) * this.radius

            for (let j = 0; j < this.stacks; j++) {
                const x1 = ax * (j / this.stacks) * this.radius
                const y1 = ay * (j / this.stacks) * this.radius
                const z1 = 0
                const x2 = ax * ((j + 1) / this.stacks) * this.radius
                const y2 = ay * ((j + 1) / this.stacks) * this.radius
                const z2 = 0
                const x3 = bx * (j / this.stacks) * this.radius
                const y3 = by * (j / this.stacks) * this.radius
                const z3 = 0
                const x4 = bx * ((j + 1) / this.stacks) * this.radius
                const y4 = by * ((j + 1) / this.stacks) * this.radius
                const z4 = 0

                const colorA = this.centerColor.clone().lerp(this.peripheryColor, Math.sqrt(x1 * x1 + y1 * y1) / this.radius)
                const colorB = this.centerColor.clone().lerp(this.peripheryColor, Math.sqrt(x2 * x2 + y2 * y2) / this.radius)
                const colorC = this.centerColor.clone().lerp(this.peripheryColor, Math.sqrt(x3 * x3 + y3 * y3) / this.radius)
                const colorD = this.centerColor.clone().lerp(this.peripheryColor, Math.sqrt(x4 * x4 + y4 * y4) / this.radius)

                if (j == 0) {
                    let triangle = new MyTriangle(x1, y1, z1, x2, y2, z2, x4, y4, z4)
                    positions.push(...triangle.getAttribute('position').array)
                    normals.push(...triangle.getAttribute('normal').array)
                    colors.push(
                        ...colorA.toArray(),
                        ...colorB.toArray(),
                        ...colorD.toArray()
                    )
                }
                else {
                    let triangle = new MyTriangle(x1, y1, z1, x4, y4, z4, x3, y3, z3)
                    positions.push(...triangle.getAttribute('position').array)
                    normals.push(...triangle.getAttribute('normal').array)
                    colors.push(
                        ...colorA.toArray(),
                        ...colorD.toArray(),
                        ...colorC.toArray()
                    )
                }
            }
        }

        this.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        this.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
        this.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
        this.computeBoundingSphere();
    }
}

export { MyPolygon };
