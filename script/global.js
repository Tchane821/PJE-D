import {MarkerManager} from './MarkerManager.js';
import * as THREE from '../lib/three/build/three.module.js';
import {ToolManager} from './ToolManager.js';
import {Quad} from './Quad.js';

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
    static toolManager = new ToolManager(); // le manager de tool
    static luminositerMoyenne;
    static scene3D;
    static camera3D;
    static renderer3D;



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

        G.luminositerMoyenne = 127;

        // three js 2D
        G.scene2D = new THREE.Scene();
        G.scene2D.background = new THREE.CanvasTexture(G.src.canvas);
        G.camera2D = new THREE.OrthographicCamera(-1, 1, -1, 1, -1, 1);
        G.camera2D.position.set(0, 0, 0);
        G.renderer = new THREE.WebGLRenderer({canvas: document.getElementById("three2D")});
        G.renderer.setSize(500, 500);
        G.renderer.autoClear = true;

        // three js 3D
        G.scene3D = new THREE.Scene();
        G.camera3D = new THREE.PerspectiveCamera(90,1,1,1000);
        G.camera3D.position.set(0,0,0);
        G.renderer3D = new THREE.WebGLRenderer({canvas: document.getElementById("three3D")});
        let light=new THREE.DirectionalLight(0xffffff,1.0); // lumière blanche maximale
        light.position.set(0,0,1); // direction d'où provient l'éclairage (depuis l'axe $z$ ici).
        G.scene3D.add(light);

    }

    static makeTool(marker, view) {
        return G.toolManager.makeTool(marker, view);
    }

    static makeMarker(id) {
        return G.markersManager.makeMarker(id, new Quad());
    }

}
