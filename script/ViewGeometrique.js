import {NodePose3D} from './NodePose3D.js';
import * as THREE from '../lib/three/build/three.module.js';

export class ViewGeometrique extends NodePose3D {

    constructor() {
        super();
        let geometry = new THREE.BoxGeometry(1, 1, 1);
        let material = new THREE.MeshPhongMaterial({color: 0x00ffff, side: THREE.DoubleSide}); // color : red (8 bits),green(8 bits),blue(8 bits)

        let cube = new THREE.Mesh(geometry, material);
        this.node.add(cube);

        cube.position.copy(new THREE.Vector3(0, 0, -2));
    }

    update() {
        super.update();
        let n = this.node.children[0];
        n.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 24.0);
    }

}

export class ViewSphere extends NodePose3D {

    constructor() {
        super();
        let geometry = new THREE.SphereGeometry(0.8, 20, 9,0,6.4,0,3.5);
        let material = new THREE.MeshPhongMaterial({color: 0x00ffff, side: THREE.DoubleSide}); // color : red (8 bits),green(8 bits),blue(8 bits)

        let boule = new THREE.Mesh(geometry, material);
        this.node.add(boule);

        boule.position.copy(new THREE.Vector3(0, 0, -2));
    }

    update() {
        super.update();
    }

}