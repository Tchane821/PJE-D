import Wait from './wait.js';
import Recognizer from './recognizer.js';
import G from './global.js';
import * as THREE from '../lib/three/build/three.module.js';
import * as Q from  './Quad.js';
import { MarkerMatrix } from './Markermatrix.js';

// Main 
const main=function() {

  // waiting for openCV loading and webcam setup. Call initialize when ok.
  Wait.waitAll().then(initialize).catch(mess => console.log(mess,mess.stack));
}

// init
const initialize=function() {
  console.log('start');
  G.initGlobal();
  mainLoop();
}

// mainloop
var mainLoop=function() {

  let ratio = G.captureHeight/G.captureWidth;
  let w = G.src.canvas.width, h = G.src.canvas.height;
  G.src.fillStyle="lightblue"; // to set a background color to the source
  G.src.fillRect(0,0,w,h);
  G.src.drawImage(G.capture,0,0,G.captureWidth,G.captureHeight,0,(h-h*ratio)/2,w,h*ratio);
  G.ctx2D.drawImage(G.capture,0,0,G.captureWidth,G.captureHeight,0,(h-h*ratio)/2,w,h*ratio);
  
  let markerQuad = Recognizer.recognizeMarker(G.src.canvas); // renvoie une map {K:id,V:quad}
  G.markersManager.updateFromRecognizer(markerQuad);

  G.markersManager.drawAllQuad(G.draw2D);
  
  window.requestAnimationFrame(mainLoop);
}


window.addEventListener("load",main);
