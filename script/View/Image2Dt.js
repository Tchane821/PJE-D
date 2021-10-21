import * as THREE from '../../lib/three/build/three.module.js';
import G from '../global.js';
import {Quad} from '../Math/Quad.js';

export class Image2Dt {

    node;
    tool;

    constructor(idImg) { // idImg : HTML id
        let planGeometry = new THREE.PlaneGeometry(1, 1);
        let material = new THREE.MeshBasicMaterial({
            map: new THREE.CanvasTexture(document.getElementById(idImg)),
            side: THREE.DoubleSide
        });
        let nodeT = new THREE.Mesh(planGeometry, material); // THREE Object3D (Group or Mesh)
        let nodeParent = new THREE.Group();
        nodeParent.add(nodeT);
        this.node = nodeParent;
        G.scene2D.add(this.node);
    }


    // update transformation/geometry
    update(quad) {
        let quadSrc = cv.matFromArray(4, 1, cv.CV_32FC2, new Quad().t);
        let quadDst = cv.matFromArray(4, 1, cv.CV_32FC2, quad.t);
        let transform = cv.getPerspectiveTransform(quadSrc, quadDst);
        let matrices = this.convertThree_44(transform);
        this.node.matrix.copy(matrices);
        this.node.matrixAutoUpdate = false;
        transform.delete();
        let n = this.node.children[0];
        n.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 16.0);
    }

    convertThree_44(transform) {
        let transform44 = new THREE.Matrix4();
        let m = transform.data64F; // synonym for the coefficients of transform (type cv.Mat)
        transform44.fromArray(
            [
                m[0], m[3], 0, m[6], // first column (caution : THREE is column-major, openCV is row-major)
                m[1], m[4], 0, m[7],
                0, 0, 1, 0, // z is ignored
                m[2], m[5], 0, m[8]
            ]);
        return transform44;
    }

}