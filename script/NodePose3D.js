import G from './global.js';
import * as THREE from '../lib/three/build/three.module.js';

export class NodePose3D {

    node;
    tool;

    constructor() {
        this.node = new THREE.Group();
        G.scene3D.add(this.node);
    }

    update() {
        if (this.tool !== undefined) {
            let m = this.tool.marker.getPoseMoyenne().getMatrix4();
            this.node.matrix.copy(m);
            this.node.matrixAutoUpdate = false;
        }
    }
}