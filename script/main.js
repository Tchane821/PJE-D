import Wait from './wait.js';
import Recognizer from './Math/recognizer.js';
import G from './global.js';
import {Image2D} from './View/Image2D.js';
import {Image2Dt} from './View/Image2Dt.js';
import {ViewGeometrique, ViewSphere} from './View/ViewGeometrique.js';
import {GLTF} from './View/Gltf.js'
import {SoundView} from './View/SoundView.js';
import {SoundManager} from './Manager/SoundManager.js';

// Main 
const main = function () {
    // waiting for openCV loading and webcam setup. Call initialize when ok.
    Wait.waitAll().then(initialize).catch(mess => console.log(mess, mess.stack));
}


// mainloop
const mainLoop = function () {

    if (G.waitLoading !== 0) {//>> waiting Three.js models loading
        console.log("wait loader");
        window.requestAnimationFrame(mainLoop);
        return; // do nothing
    } //<< waiting Three.js models loading

    // init and start drawing
    let ratio = G.captureHeight / G.captureWidth;
    let w = G.src.canvas.width, h = G.src.canvas.height;
    G.src.fillStyle = "lightblue"; // to set a background color to the source
    G.src.fillRect(0, 0, w, h);
    G.src.drawImage(G.capture, 0, 0, G.captureWidth, G.captureHeight, 0, (h - h * ratio) / 2, w, h * ratio);
    G.ctx2D.drawImage(G.capture, 0, 0, G.captureWidth, G.captureHeight, 0, (h - h * ratio) / 2, w, h * ratio);

    // recognise and identifying marker
    let idsQuads = Recognizer.recognizeMarker(G.src.canvas); // renvoie une map {K:id,V:quad}
    G.markersManager.updateFromRecognizer(idsQuads);
    G.draw2D.clearRect(0, 0, 500, 500);
    G.markersManager.drawAllQuad(G.draw2D);

    //le sound
    if (G.sound !== undefined) {
        G.sound.updateSound();
    }

    //three and renderer
    G.scene2D.background.needsUpdate = true;
    G.toolManager.updateView();
    G.renderer.autoClear = true;
    G.renderer.render(G.scene2D, G.camera2D);
    G.renderer.autoClear = false;
    G.renderer.render(G.scene3D, G.camera3D);

    window.requestAnimationFrame(mainLoop);
};

// init
const initialize = function () {
    console.log('start');
    G.initGlobal();
    //103-314-1017-982
    // parametre a changer pour changer d'exemple true / false
    if (true) {
        G.makeTool(G.makeMarker(1017), new ViewGeometrique());
        G.makeTool(G.makeMarker(103), new Image2Dt('astro'));
        G.makeTool(G.makeMarker(314), new Image2D('jdr'));
        G.makeTool(G.makeMarker(982), new GLTF("../data/3d/truck_02.gltf"));
    } else {
        // le tp5
        G.sound = new SoundManager();
        let t1 = G.makeTool(G.makeMarker(982), new ViewSphere());
        let t2 = G.makeTool(G.makeMarker(103), new ViewSphere());
        G.sound.volume(t1, t2);
        G.sound.setEgaliseur(G.makeTool(G.makeMarker(1017), new SoundView()));
    }
    mainLoop();
}

window.addEventListener("load", main);
