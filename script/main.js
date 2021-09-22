import Wait from './wait.js';

import Recognizer from './recognizer.js';

import G from './global.js';

import * as THREE from '../lib/three/build/three.module.js';

import * as Q from  './Quad.js';

/**
 * main (loading, launch)
 *
 */

const main=function() {

  // waiting for openCV loading and webcam setup. Call initialize when ok.
  Wait.waitAll().then(initialize).catch(mess => console.log(mess,mess.stack));
}


/**
 * initialize
 *
 *
 *
 */

const initialize=function() {
  console.log('start');

  G.initGlobal();

  mainLoop();
}



/**
 * mainLoop
 *
 *
 *
 */

var mainLoop=function() {
  /**
  * Tp 1 EX2
  */
  let ratio=G.captureHeight/G.captureWidth;
  let w=G.src.canvas.width, h=G.src.canvas.height;
  G.src.fillStyle="lightyellow"; // to set a background color to the source
  G.src.fillRect(0,0,w,h);
  G.src.drawImage(G.capture,0,0,G.captureWidth,G.captureHeight,0,(h-h*ratio)/2,w,h*ratio);
  G.ctx2D.drawImage(G.capture,0,0,G.captureWidth,G.captureHeight,0,(h-h*ratio)/2,w,h*ratio);
  

  // tp2Q6
  let markerQuad = Recognizer.recognizeMarker(G.src.canvas); // returns array of {id : quad, ...}
  G.draw2D.clearRect(0,0,500,500);
  for(let i =0; i < markerQuad.length; i++){
    markerQuad[i].draw2D(G.draw2D,'green');
    Recognizer.extractionQuad(G.src.canvas,markerQuad[i],[500,500],"feedback"+[i]);
  }

  // tp2 dessine moi un quad
  //let qad = new Q.Quad();
  //qad.toWindow(500,500,[100,100,300,100,300,300,100,300]);
  //qad.draw2D(G.draw2D,'green');
  
  


  window.requestAnimationFrame(mainLoop);
}


window.addEventListener("load",main);
