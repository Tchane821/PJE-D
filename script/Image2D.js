import * as THREE from '../lib/three/build/three.module.js';
import G from './global.js';

export class Image2D {

    node;

    constructor(idImg) { // idImg : HTML id

        let planGeometry = new THREE.PlaneGeometry(1, 1);
        let material = new THREE.MeshBasicMaterial({
            map: new THREE.CanvasTexture(document.getElementById(idImg)),
            side: THREE.DoubleSide
        });
        this.node = new THREE.Mesh(planGeometry, material); // THREE Object3D (Group or Mesh)
        G.scene2D.add(this.node);
    }


    // update transformation/geometry
    update(quad) {
        this.node.geometry.vertices[0].x = quad.t[0];
        this.node.geometry.vertices[0].y = quad.t[1];
        this.node.geometry.vertices[1].x = quad.t[2];
        this.node.geometry.vertices[1].y = quad.t[3];
        this.node.geometry.vertices[3].x = quad.t[4];
        this.node.geometry.vertices[3].y = quad.t[5];
        this.node.geometry.vertices[2].x = quad.t[6];
        this.node.geometry.vertices[2].y = quad.t[7];
        this.node.geometry.verticesNeedUpdate = true;
    }

}