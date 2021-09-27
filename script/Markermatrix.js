export class MarkerMatrix {
    // 5x5 bits matrix of a marker : 0 (black) or 1 (white)
    constructor() {
      this.m=[]; // array of 25 values (5x5 values : first line = first 5 values, ... i.e. row majors representation)
    }


  // return : {id : , dist : } : the nearest marker id at distance dist of this.m matrix
  nearestId() {
    let ids = [ [1,0,0,0,0], [1,0,1,1,1], [0,1,0,0,1], [0,1,1,1,0] ] // or [16, 23, 9, 14] or ... // possible values of a row
    let markerId=0; // computed id
    let dTot=0;     // total distance for the 5 rows
    let lOfLines= this.getLines();
    
    for(let i = 0; i < 5; i++){ // pour chaque ligne du tableau
       let dOfV = 6;
       let possibleValue;
       let idOfPossibleValue = -1; //absurd init
       for(let k = 0; k <4 ; k++){ // pour chaque ids possible
          let oneDot = getDistanceOfBestvalue(ids[k],lOfLines[i]); // {id,distance}
          if (oneDot[1] <=  dOfV){
            possibleValue = oneDot;
            dOfV = oneDot[1];
            idOfPossibleValue = k;
          }
       }
       dTot += dOfV;
       markerId += k * (4**i);
    }
    return {id:markerId,distance:dTot};
  }

  getDistanceOfBestvalue(id,line){
    let res = [id , 0] ;
    for(let i=0; i < 5;i++){ // id
      for(let j=0; j < 5;j++){ // line
         if(id[i] != line[j]){
            res[1]++;
         }
      }
    }
    return res;
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
    fbctx.fillStyle = 'white';
    fbctx.fillRect(0,0,width,height);
    let stepX=width /5.0; 
    let stepY=height/5.0;
    fbctx.fillStyle = 'black';
    for(let i = 0; i < 5; i++){
        for(let j = 0; j < 5; j++){
            if(this.m[i * 5 + j] == 0){
              fbctx.fillRect(i*stepX,j*stepY,stepX,stepY);
            }
        }
    }
  }


  //return line i of m [x0,x1,x2,x3,x4]
  getLine(i){
    return this.m.slice(i*5,i*5+5);
  }
  //return list of line
  getLines(){
    let res = [];
    for(let i = 0 ; i < 5; i++){
        res.push(this.getLine(i));
    }
    return res;
  }

}