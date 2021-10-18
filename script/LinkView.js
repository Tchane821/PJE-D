import G from './global.js'
import * as THREE from '../lib/three/build/three.module.js';
import {Tool} from './Tool.js';

export class LinkView {

    t0;
    t1;
    node;

    constructor(t0, t1) { // t0,t1 : les 2 tools à relier par une barre
        let geometry = new THREE.BoxGeometry(1, 1, 1);
        let material = new THREE.MeshPhongMaterial({color: 0xf01050, side: THREE.DoubleSide});

        this.node = new THREE.Mesh(geometry, material);

        this.t0 = t0;
        this.t1 = t1;
        G.scene3D.add(this.node);
    }

    update() {
        let p0 = this.t0.marker.getPose().position;
        let p1 = this.t1.marker.getPose().position;
        let pc = new THREE.Vector3((p0.x + p1.x) / 2, (p0.y + p1.y) / 2, (p0.z + p1.z) / 2);
        this.node.position.copy(pc);
        this.node.lookAt(p1);
        this.node.scale.set(0.5,0.5,Tool.distance(this.t0,this.t1));
    }
}