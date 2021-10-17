import {Quad} from './Quad.js';
import {Pose} from './Pose.js';
import * as THREE from '../lib/three/build/three.module.js';

export class Marker {

    constructor(id) {
        this.id = id;
        this.quad = new Quad(); // this is the owner
        this.color = "green"; // quad color
        this.pose = new Pose();
        this.poses = [];
        this.nbPoseMoyenne = 15;
        this.TTL = 0;
    }

    updateQ(quad) {
        this.quad.copy(quad);
        this.updatePose(quad);
        this.TTL = 15;
    }

    updatePose(quad) {
        let quadSrc = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, 1, 0, 1, 1, 0, 1]);
        let quadDst = cv.matFromArray(4, 1, cv.CV_32FC2, quad.t);
        let transform = cv.getPerspectiveTransform(quadSrc, quadDst);
        let matrices = this.convertThree_44(transform);
        let pose = new Pose();
        pose.setFromHomography(matrices);
        if (this.poses.length > this.nbPoseMoyenne - 1) {
            this.poses.shift();
        }
        this.poses.push(pose);
    }

    drawMarker(ctx) {
        if (this.TTL > 0) {
            this.quad.draw2D(ctx, this.color);
        }
    }

    getPoseMoyenne() {
        let pMoyenne = new Pose();
        let tP = this.poses.length;
        for (let k = 0; k < tP; k++) {
            pMoyenne.xAxis = this.addVectors(this.poses[k].xAxis, pMoyenne.xAxis);
            pMoyenne.yAxis = this.addVectors(this.poses[k].yAxis, pMoyenne.yAxis);
            pMoyenne.zAxis = this.addVectors(this.poses[k].zAxis, pMoyenne.zAxis);
            pMoyenne.position = this.addVectors(this.poses[k].position, pMoyenne.position);
        }
        pMoyenne.xAxis = this.divVector(pMoyenne.xAxis, tP);
        pMoyenne.yAxis = this.divVector(pMoyenne.yAxis, tP);
        pMoyenne.zAxis = this.divVector(pMoyenne.zAxis, tP);
        pMoyenne.position = this.divVector(pMoyenne.position, tP);
        return pMoyenne;
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

    divVector(vector, d) {
        let r = new THREE.Vector3(0, 0, 0);
        r.x = vector.x / d;
        r.y = vector.y / d;
        r.z = vector.z / d;
        return r;
    }

    addVectors(v1, v2) {
        let r = new THREE.Vector3(0, 0, 0);
        r.x = v1.x + v2.x;
        r.y = v1.y + v2.y;
        r.z = v1.z + v2.z;
        return r;
    }

}