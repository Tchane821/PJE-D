export default class G {
  // GLOBALS :

  static captureMode="video"; // "image" or "webcam" or "video"

  static capture;       // capture DOM element : can be a <video> or <img> element
  static captureWidth;  // width of the capture (image or video or webcam)
  static captureHeight; // height of the capture (image or video or webcam)

  static src;           // context2D : image source to analyze (copied from captured video or image)
                        // memo : G.src.canvas to get the associated canvas DOM element

  static ctx2D;         // context2D : 2D drawing feedback
  static draw2D;        // espace de desssin du test du Tp2Q5


  // default globals setup
  static initGlobal() {
    G.src=document.getElementById("src").getContext('2d');             // context of the image source to analyze
    
    G.ctx2D=document.getElementById("canvas2D").getContext('2d');      // context of the 2D feedback

    G.draw2D=document.getElementById("draw2D").getContext('2d');              // contexte du Tp2Q5


    // set G.capture from video/webcam/image
    if (G.captureMode=="video" || G.captureMode=="webcam") {
     G.capture=document.getElementById("video");
     G.captureWidth=G.capture.videoWidth;
     G.captureHeight=G.capture.videoHeight;
    }
    else { // captureMode=="image"
     G.capture=document.getElementById("image");
     G.captureWidth=G.capture.naturalWidth;
     G.captureHeight=G.capture.naturalHeight;
    }


  }
}
