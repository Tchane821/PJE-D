import G from './global.js';
import * as THREE from '../lib/three/build/three.module.js';

export class NodePose3D {

    node;

    constructor() {
        this.node = new THREE.Group();
        G.scene3D.add(this.node);
    }

    update() {

    }
}