import {Quad} from './Quad.js';
import {Pose} from './Pose.js';
import * as THREE from '../lib/three/build/three.module.js';

export class Marker {

    constructor(id) {
        this.id = id;
        this.quad = new Quad(); // this is the owner
        this.color = "green"; // quad color
        this.pose = new Pose();
        this.TTL = 10; // création d'un time to live pour l'affichage
    }

    update(quad) {
        this.quad.copy(quad);
        this.updatePose(quad);
        this.TTL = 10;
    }

    updatePose(quad){
        let quadSrc = cv.matFromArray(4, 1, cv.CV_32FC2, new Quad().t);
        let quadDst = cv.matFromArray(4, 1, cv.CV_32FC2, quad.t);
        let transform = cv.getPerspectiveTransform(quadSrc, quadDst);
        let matrices = this.convertThree_44(transform);
        this.pose.setFromHomography(matrices);
    }

    drawMarker(ctx) {
        if (this.TTL !== 0) {
            this.quad.draw2D(ctx, this.color);
            this.TTL -= 1;
        }
    }

    getPose(){
        return this.pose;
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