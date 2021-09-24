export class MarkerMatrix {
    // 5x5 bits matrix of a marker : 0 (black) or 1 (white)
    constructor() {
      this.m=[]; // array of 25 values (5x5 values : first line = first 5 values, ... i.e. row majors representation)
    }

  // set this.m from image (should be an extracted quad image)
  // in : src(cv.Mat) : image of a candidate marker
  // return : true/false if success/fail (fails if bad border, or no black/white bits => cant be a candidate marker) 
  fromImg(src) {
    let stepX=src.cols/7.0; // src.cols = width of the image; there are 7 cols in marker (the 2 borders + 5 values)
    let stepY=src.rows/7.0; // similar for rows/height

    let centerX=stepX/2.0; // first col (of the first center square)
    let centerY=stepY/2.0; // first row

    let square=0;
    for(let y=0;y<7;++y) {
      centerX=stepX/2.0; // start row (first col)
      for(let x=0;x<7;++x) {
        let valueSquare=-1; // 0=black, 1=white, -1= rejected 
        let dst=src.roi({x:centerX-1,y:centerY-1,width:3,height:3}); // crop at center of the square (3x3 pixels)
        let nbWhite=cv.countNonZero(dst);                            // count white pixels of the 3x3 pixels
        dst.delete(); // dst is useless now

        if (nbWhite>7) {valueSquare=1;} // white value
        else if (nbWhite<2) {valueSquare=0;} // black value
        if (valueSquare==-1) return false; // neither black nor white => rejected
        if (x==0 || x==6 || y==0 || y==6) { // border : should be black
          if (valueSquare!=0) return false; // not a border => not a marker => rejected
        }
        else {
          this.m[square]=valueSquare;
          square+=1;
        }
        centerX+=stepX; // next col
      }
      centerY+=stepY; // next row
    }
    return true;
  }

  // s [width, height]
  // fb la ou sa va afficher
  drawMatrix(s,fb){
    let fbctx = document.getElementById(fb).getContext('2d');
    if(fb == "feedbackM0"){
      let mat = document.getElementById("mat");   
      mat.textContent = this.m; 
    }
    let width = s[0]; let height = s[1];
    let stepX=width /7.0; 
    let stepY=height/7.0;
    for(let i =0; i < 7; i++){
        for(let j = 0; j < 7 ; j++){
            if(this.m[i * 7 + j] == 0){
              fbctx.fillStyle = 'black';
              fbctx.fillRect(i*stepX,j*stepY,stepX,stepY);
            }else{
              fbctx.fillStyle = 'white';
              fbctx.fillRect(i*stepX,j*stepY,stepX,stepY);
            }
        }
    }
  }


  }