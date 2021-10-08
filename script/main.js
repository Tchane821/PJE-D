import Wait from './wait.js';
import Recognizer from './recognizer.js';
import G from './global.js';


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
    let markerQuad = Recognizer.recognizeMarker(G.src.canvas); // renvoie une map {K:id,V:quad}
    G.markersManager.updateFromRecognizer(markerQuad);
    G.draw2D.clearRect(0, 0, 500, 500);
    G.markersManager.drawAllQuad(G.draw2D);

    //three and renderer
    G.scene2D.background.needsUpdate = true;
    if (G.markersManager.mesMarker.has(1017)){
        let mk = G.markersManager.mesMarker.get(1017);
        if (mk.quad !== undefined){
            G.img2d1.update(mk.quad)
        }
    }
    G.renderer.render(G.scene2D,G.camera2D);


    window.requestAnimationFrame(mainLoop);
};
// init
const initialize = function () {
    console.log('start');
    G.initGlobal();
    mainLoop();
}

window.addEventListener("load", main);
