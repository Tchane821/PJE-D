import Wait from './wait.js';
import Recognizer from './recognizer.js';
import G from './global.js';
import {Image2D} from './Image2D.js';


// Main 
const main = function () {

    // waiting for openCV loading and webcam setup. Call initialize when ok.
    Wait.waitAll().then(initialize).catch(mess => console.log(mess, mess.stack));
}


// mainloop
const mainLoop = function () {

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

    //three and renderer
    G.scene2D.background.needsUpdate = true;
    G.toolManager.updateView();

    G.renderer.render(G.scene2D, G.camera2D);


    window.requestAnimationFrame(mainLoop);
};
// init
const initialize = function () {
    console.log('start');
    G.initGlobal();
    //103-314-1017-982
    let tool1 = G.makeTool(G.makeMarker(1017), new Image2D('poluSSJ2'));
    let tool2 = G.makeTool(G.makeMarker(103), new Image2D('astro'));
    let tool3 = G.makeTool(G.makeMarker(314), new Image2D('jdr'));
    let tool4 = G.makeTool(G.makeMarker(982), new Image2D('ihad'));
    mainLoop();
}

window.addEventListener("load", main);
