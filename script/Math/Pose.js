import * as THREE from '../../lib/three/build/three.module.js';

export class Pose {

    xAxis;
    yAxis;
    zAxis;
    position;

    constructor() {
        this.xAxis = new THREE.Vector3();
        this.yAxis = new THREE.Vector3();
        this.zAxis = new THREE.Vector3();
        this.position = new THREE.Vector3();
    }

    // in m : THREE.Matrix4
    setFromHomography(m) {
        this.xAxis.x = m.elements[0];
        this.xAxis.y = -m.elements[1];
        this.xAxis.z = -m.elements[3];

        this.yAxis.x = m.elements[4];
        this.yAxis.y = -m.elements[5];
        this.yAxis.z = -m.elements[7];

        this.zAxis.crossVectors(this.xAxis, this.yAxis);

        this.position.x = m.elements[12];
        this.position.y = -m.elements[13];
        this.position.z = -m.elements[15];


        let lx = this.xAxis.length();
        let ly = this.yAxis.length();
        this.position.multiplyScalar(2.0 / (lx + ly));

        this.xAxis.normalize();
        this.yAxis.normalize();
        this.zAxis.normalize();
    }

    getMatrix4() {
        let m = new THREE.Matrix4();
        m.makeBasis(this.xAxis, this.yAxis, this.zAxis);
        m.setPosition(this.position);
        return m;
    }

}
