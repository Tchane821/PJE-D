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
        this.TTL = 10; // création d'un time to live pour l'affichage
        this.nbPoseMoyenne = 20;
    }

    update(quad) {
        this.quad.copy(quad);
        this.updatePose(quad);
        this.TTL = 10;
    }

    updatePose(quad) {
        let quadSrc = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, 1, 0, 1, 1, 0, 1]);
        let quadDst = cv.matFromArray(4, 1, cv.CV_32FC2, quad.t);
        let transform = cv.getPerspectiveTransform(quadSrc, quadDst);
        let matrices = this.convertThree_44(transform);
        this.pose.setFromHomography(matrices);
        if (this.poses.length > this.nbPoseMoyenne - 1) {
            this.poses.shift();
        }
        this.poses.push(this.pose);
    }

    drawMarker(ctx) {
        if (this.TTL !== 0) {
            this.quad.draw2D(ctx, this.color);
            this.TTL -= 1;
        }
    }

    getPose() {
        return this.pose;
    }

    getPoseMoyenne() {
        let pMoyenne = new Pose();
        let tP = this.poses.length;
        for (let k = 0; k < tP; k++) {
            pMoyenne.yAxis.addVectors(this.poses[k].yAxis, pMoyenne.yAxis);
            pMoyenne.xAxis.addVectors(this.poses[k].xAxis, pMoyenne.xAxis);
            pMoyenne.position.addVectors(this.poses[k].position, pMoyenne.position);
        }
        pMoyenne.xAxis = this.divVector(pMoyenne.xAxis, tP);
        pMoyenne.yAxis = this.divVector(pMoyenne.yAxis, tP);
        pMoyenne.position = this.divVector(pMoyenne.position, tP);
        pMoyenne.zAxis.crossVectors(pMoyenne.xAxis, pMoyenne.yAxis);
        let lx = pMoyenne.xAxis.length();
        let ly = pMoyenne.yAxis.length();
        pMoyenne.position.multiplyScalar(2.0 / (lx + ly));
        pMoyenne.xAxis.normalize();
        pMoyenne.yAxis.normalize();
        pMoyenne.zAxis.normalize();
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

}