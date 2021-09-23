import * as Q from  './Quad.js';
export default class Recognizer {

  // in : srcCanvas (DOM Element canvas) : contains the image to analyze
  // return : {id1 : quad1, id2 : quad2, ...} : all recognized marker id (int) with their (normalized) quad (Quad)
  static recognizeMarker(srcCanvas) {
    let res=[]

    let src = cv.imread(srcCanvas); // src set to a cv.Mat image
    let dst = src.clone();  // dst is a copy
    let dstNG = new cv.Mat();
    cv.cvtColor(src,dstNG, cv.COLOR_RGBA2GRAY); // nuace de gris

    // seuillage adaptatif avec une boite de 5 et un -3.0
    // et flou
    let dstSeuill = new cv.Mat();
    cv.blur(dstNG,dstSeuill,{width : 5, height: 5});
    cv.adaptiveThreshold(dstSeuill, dstSeuill, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 9, 5.0 );

    // contours
    let lesContours = new cv.MatVector(); // contour stoké
    let hierarchy = new cv.Mat(); // topologie des contour
    let dstCont = src.clone();
    let dstBonCont = src.clone();

    cv.findContours(dstSeuill,lesContours,hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_TC89_L1);
    
    // filtrage des contours
    let lesbonsContours =  new cv.MatVector() // les contours selectionné
    for (let i =0; i <lesContours.size();i++){
        let cnt = lesContours.get(i);
        cv.approxPolyDP(cnt, cnt, 3, true);
        if(cnt.size().height == 4 ){
            lesbonsContours.push_back(cnt);
        }
    }
    //afficher les contours
    cv.drawContours(dstCont, lesContours,-1, new cv.Scalar(255,0,0,255),2, cv.LINE_4 );
    //afficher les contours filtré
    cv.drawContours(dstBonCont, lesbonsContours,-1, new cv.Scalar(255,0,0,255),2, cv.LINE_4 );
    
    //calcul de res
    for(let i = 0 ;i < lesbonsContours.size() ;i++){
      let q = new Q.Quad();
      q.setFromWindow(src.size().width,src.size().height,lesbonsContours.get(i).data32S)
      res.push(q);
    }

    //draw canvas
    cv.imshow("dstcv1",dstNG);
    cv.imshow("dstcv2",dstSeuill);
    cv.imshow("dstcv3",dstCont);
    cv.imshow("dstcv4",dstBonCont);

    // delete **all** cv data
    src.delete();
    dst.delete();
    dstNG.delete();
    dstSeuill.delete();
    dstCont.delete();
    lesContours.delete();
    dstBonCont.delete();
    lesbonsContours.delete();
    hierarchy.delete();

    return res;
  }

  // in q notre quad a traiter
  // in s les dimension {width:... ,height:...} : image width and height
  // in fb la ou on l'affiche 
  // return cv.Mat le quad
  static extractionQuad(srcCanvas,q,s,fb){
    let src = cv.imread(srcCanvas);
    let res = new cv.Mat();
    cv.cvtColor(src,src, cv.COLOR_RGBA2GRAY); // nuace de gris
    cv.blur(src,src,{width : 5, height: 5});
    let luminositerMoyenne = 127;
    cv.threshold (src, src, luminositerMoyenne, 255, cv.THRESH_BINARY);
    cv.imshow("feedbackM",src);

    let quadSrc = cv.matFromArray(4, 1, cv.CV_32FC2, q.toWindow(s) ); // q = notre Quad à traiter
    let quadDst = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, 0, 150, 150,150, 150,0]); // par exemple pour obtenir une image extraite 100x100 pixels à la fin
    let transform = cv.getPerspectiveTransform(quadSrc, quadDst);
  
    let transformImage = new cv.Mat();
    cv.warpPerspective(src, transformImage, transform, {width:150,height:150}, cv.INTER_LINEAR, cv.BORDER_CONSTANT);
    
    //imgshow
    res = transformImage.clone();
    cv.imshow(fb,transformImage);
    
    //delete
    src.delete();
    quadSrc.delete();
    quadDst.delete();
    transform.delete();
    transformImage.delete();
    return res;
  }


}
