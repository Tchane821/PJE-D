import G from './global.js';


export default class Wait {
  
  
static waitOpenCV() {
  console.log("waiting OpenCV ...");

  return new Promise(resolve => {
    // OpenCV is loaded async : waiting for variable cv to be available :
    let waitingReady= () => {if (cv) {console.log("...");window.clearInterval(retry);cv['onRuntimeInitialized']=()=>{console.log("openCV ready");resolve()}}}; // openCV is ready
    let retry = window.setInterval(waitingReady,500);
    waitingReady();
  });
}

static async waitWebcam() {
  console.log("waiting Source (Webcam)...");
  if (G.captureMode!="webcam") {
    return new Promise(resolve => {resolve();});
  }
  else {
    console.log("detect webcam");
    let constraint={audio:false,video : true};
    let promise=navigator.mediaDevices.getUserMedia(constraint); // request media device (async)
    return promise.then(Wait.webcamStarted).catch(Wait.webcamError); // success => call function webcamStarted; error => call webcamError
  }
}

static webcamStarted=function(stream) { // stream = media device stream
  let video=document.getElementById("video");
  video.srcObject=stream; // source of the video element is the media device stream
  console.log("webcam stream set");
  return new Promise(resolve => {
    video.addEventListener("loadedmetadata",function(){console.log("webcam metadata ready");resolve();});
  });
}

static webcamError=function(err) {
  console.log("Webcam :"+err.name +" : "+err.message);
}



static async waitAll() {
  await Wait.waitOpenCV();
  await Wait.waitWebcam();
}
  
}
