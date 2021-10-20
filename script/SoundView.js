import {NodePose3D} from './NodePose3D.js';
import * as THREE from '../lib/three/build/three.module.js';


export class SoundView extends NodePose3D {

    node;
    tool;

    constructor() {
        super();
        let material = new THREE.MeshPhongMaterial({color: 0x00ffff, side: THREE.DoubleSide});
        let nBar = 8;
        // créer 8 cubes espacés qui sont ajoutés à this.node
        let geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        this.node = new THREE.Group();
        for (let k = 0; k < nBar; k++) {
            let cube = new THREE.Mesh(geometry, material);
            cube.position.copy(new THREE.Vector3(k, 0, -2));
            this.node.add(cube);
        }
    }

    update() {
        super.update();
        let dataArray = this.tool.dataArray;
        for (let k = 0; k < 8; k++) {
            let values = dataArray[k * 2] + dataArray[k * 2 + 1]; // [0 -510]
            let transformedValue = (values / 100) + 0.5
            this.node.children[k].scale.set(transformedValue, 1, 1);
        }
    }
}