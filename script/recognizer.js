import * as Q from './Quad.js';
import * as Mm from './Markermatrix.js';
import G from './global.js';

export default class Recognizer {

    // in : srcCanvas (DOM Element canvas) : contains the image to analyze
    // return : {id1 : quad1, id2 : quad2, ...} : all recognized marker id (int) with their (normalized) quad (Quad)
    static recognizeMarker(srcCanvas) {
        let res = new Map();

        let src = cv.imread(srcCanvas); // src set to a cv.Mat image
        let dst = src.clone();  // dst is a copy
        let dstNG = new cv.Mat();
        cv.cvtColor(src, dstNG, cv.COLOR_RGBA2GRAY); // nuace de gris

        // seuillage adaptatif avec une boite de 5 et un -3.0
        // et flou
        let dstSeuill = new cv.Mat();
        cv.blur(dstNG, dstSeuill, {width: 5, height: 5});
        cv.adaptiveThreshold(dstSeuill, dstSeuill, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 9, 5.0);

        // contours
        let lesContours = new cv.MatVector(); // contour stoké
        let hierarchy = new cv.Mat(); // topologie des contour
        let dstCont = src.clone();
        let dstBonCont = src.clone();

        cv.findContours(dstSeuill, lesContours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_TC89_L1);

        // filtrage des contours
        let lesbonsContours = new cv.MatVector() // les contours selectionné
        for (let i = 0; i < lesContours.size(); i++) {
            let cnt = lesContours.get(i);
            cv.approxPolyDP(cnt, cnt, 3, true);
            if (cnt.size().height === 4) {
                lesbonsContours.push_back(cnt);
            }
        }
        //afficher les contours
        cv.drawContours(dstCont, lesContours, -1, new cv.Scalar(255, 0, 0, 255), 2, cv.LINE_4);
        //afficher les contours filtré
        cv.drawContours(dstBonCont, lesbonsContours, -1, new cv.Scalar(255, 0, 0, 255), 2, cv.LINE_4);

        //calcul de res
        for (let i = 0; i < lesbonsContours.size(); i++) {
            let q = new Q.Quad();
            let mat = new Mm.MarkerMatrix();
            q.setFromWindow(src.size().width, src.size().height, lesbonsContours.get(i).data32S)
            let extractedMarker = this.extractionQuad(G.src.canvas, q, [500, 500], "feedback" + [i]);
            if (mat.fromImg(extractedMarker)) {
                let dicoRes = mat.recognize();
                q.rotateQ90i(dicoRes["rot"] / 90);
                if (dicoRes["id"] !== -1) {
                    mat.drawMatrix([150, 150], "feedbackM" + i);
                    mat.writeId("idMatrix" + i);
                    res.set(dicoRes["id"], q);
                }
            }
        }

        //draw canvas
        cv.imshow("dstcv1", dstNG);
        cv.imshow("dstcv2", dstSeuill);
        cv.imshow("dstcv3", dstCont);
        cv.imshow("dstcv4", dstBonCont);

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
    static extractionQuad(srcCanvas, q, s, fb) {
        let src = cv.imread(srcCanvas);
        let res;
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY); // nuace de gris
        cv.blur(src, src, {width: 5, height: 5});
        cv.threshold(src, src, G.luminositerMoyenne, 255, cv.THRESH_BINARY);
        cv.imshow("feedbackM", src);

        //test determinant
        let quadSrc = new Q.Quad;
        quadSrc.copy(q);
        let v1 = [quadSrc.t[0] - quadSrc.t[6], quadSrc.t[1] - quadSrc.t[7]];
        let v2 = [quadSrc.t[2] - quadSrc.t[0], quadSrc.t[3] - quadSrc.t[1]];
        let determ = v1[0] * v2[1] - v1[1] * v2[0]; // x1*y2 - y1*x2
        let quadDst = new Q.Quad;
        if (determ > 0) {
            // sens horaire
            quadDst.setFromWindow(s[0], s[1], [0, 0, 150, 0, 150, 150, 0, 150]);
        } else {
            quadDst.setFromWindow(s[0], s[1], [0, 0, 0, 150, 150, 150, 150, 0]);
            // sense anti horaire
        }
        let tabSrc = cv.matFromArray(4, 1, cv.CV_32FC2, quadSrc.toWindow(s));
        let tabDst = cv.matFromArray(4, 1, cv.CV_32FC2, quadDst.toWindow(s));
        let transform = cv.getPerspectiveTransform(tabSrc, tabDst);

        let transformImage = new cv.Mat();
        cv.warpPerspective(src, transformImage, transform, {
            width: 150,
            height: 150
        }, cv.INTER_LINEAR, cv.BORDER_CONSTANT);

        //imgshow
        res = transformImage.clone();
        cv.imshow(fb, transformImage);

        //delete
        src.delete();
        tabSrc.delete();
        tabDst.delete();
        transform.delete();
        transformImage.delete();
        return res;
    }
}