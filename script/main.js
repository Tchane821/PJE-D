import Wait from './wait.js';

import Recognizer from './recognizer.js';

import G from './global.js';

import * as THREE from '../lib/three/build/three.module.js';

import * as Q from  './Quad.js';

import { MarkerMatrix } from './Markermatrix.js';

/**
 * main (loading, launch)
 *
 */

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
  /**
  * Tp 1 EX2
  */
  let ratio = G.captureHeight/G.captureWidth;
  let w = G.src.canvas.width, h = G.src.canvas.height;
  G.src.fillStyle="lightblue"; // to set a background color to the source
  G.src.fillRect(0,0,w,h);
  G.src.drawImage(G.capture,0,0,G.captureWidth,G.captureHeight,0,(h-h*ratio)/2,w,h*ratio);
  G.ctx2D.drawImage(G.capture,0,0,G.captureWidth,G.captureHeight,0,(h-h*ratio)/2,w,h*ratio);
  
  let markerQuad = Recognizer.recognizeMarker(G.src.canvas); // returns array of {id : quad, ...}
  G.draw2D.clearRect(0,0,500,500);
  let matrix = new MarkerMatrix();
  for(let i =0; i < markerQuad.length; i++){
    markerQuad[i].draw2D(G.draw2D,'green');
    let extractedMarker = Recognizer.extractionQuad(G.src.canvas,markerQuad[i],[500,500],"feedback"+[i]);
    if (matrix.fromImg(extractedMarker)){
      matrix.drawMatrix([150,150],"feedbackM"+[i]);
    }
    extractedMarker.delete();
  }

  window.requestAnimationFrame(mainLoop);
}


window.addEventListener("load",main);
