import {MarkerManager} from './MarkerManager.js';
import * as THREE from '../lib/three/build/three.module.js';

export default class G {
    // GLOBALS :

    static captureMode = "video"; // "image" or "webcam" or "video"

    static capture;       // capture DOM element : can be a <video> or <img> element
    static captureWidth;  // width of the capture (image or video or webcam)
    static captureHeight; // height of the capture (image or video or webcam)

    static src;           // context2D : image source to analyze (copied from captured video or image)
                          // memo : G.src.canvas to get the associated canvas DOM element

    static ctx2D;         // context2D : 2D drawing feedback
    static draw2D;        // espace de desssin du test du Tp2Q5
    static markersManager = new MarkerManager(); // mon marker manager

    static camera2D;     // camera 2D (orthographic)
    static renderer;     // THREE.js renderer
    static scene2D;      // 2D scene (THREE.js) : example : texture onto 2D quad (without 3D pose)


    // default globals setup
    static initGlobal() {
        G.src = document.getElementById("src").getContext('2d');             // context of the image source to analyze

        G.ctx2D = document.getElementById("canvas2D").getContext('2d');      // context of the 2D feedback

        G.draw2D = document.getElementById("draw2D").getContext('2d');              // contexte du Tp2Q5

        // set G.capture from video/webcam/image
        if (G.captureMode === "video" || G.captureMode === "webcam") {
            G.capture = document.getElementById("video");
            G.captureWidth = G.capture.videoWidth;
            G.captureHeight = G.capture.videoHeight;
        } else { // captureMode=="image"
            G.capture = document.getElementById("image");
            G.captureWidth = G.capture.naturalWidth;
            G.captureHeight = G.capture.naturalHeight;
        }

        // three js
        G.scene2D = new THREE.Scene();
        G.scene2D.background = new THREE.CanvasTexture(G.src.canvas);

        G.camera2D = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
        G.camera2D.position.set(0, 0, 0);

        G.renderer = new THREE.WebGLRenderer({canvas: document.getElementById("three")});
        G.renderer.setSize(500, 500);

    }
}
