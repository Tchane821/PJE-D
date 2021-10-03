export class MarkerMatrix {
    // 5x5 bits matrix of a marker : 0 (black) or 1 (white)
    constructor() {
      this.m=[]; // array of 25 values (5x5 values : first line = first 5 values, ... i.e. row majors representation)
    }


  // return : {id:id,dist:int,rot:int}
  // 0 <= rot <= 270    dist < 25     id >= -1
  recognize(){
    let dico = this.nearestId();
    let distance = dico["distance"];
    let brot = 0;
    let bestId = dico["id"];
    if (distance == 0) return {id:bestId,dist:distance,rot:brot};
    for(let rot = 1; rot <= 3 ; ++rot){
       this.rotaterM90();
       let dicoT = this.nearestId();
       let tempD = dicoT["distance"];
       let tempId = dicoT["id"];
       if (tempD < distance){
         distance = tempD;
         bestId = tempId;
         brot = rot;
       }
       if (distance == 0) return {id:bestId,dist:distance,rot:brot*90};
    }
    if(distance >= 15) return {id:-1,dist:25,rot:-1};
    return {id:bestId,dist:distance,rot:brot*90};
  }

  rotaterM90(){
      let mt = [];
      for (let i = 0; i < 25 ; i++){
        let x = i % 5;
        let y = Math.floor(i / 5);
        let nx = 5 - y -1 ;
        let ny = x;
        let np = ny * 5 + nx;
        mt[np] = this.m[i];
      }
      this.m = mt;
  }

  // return : {id : , dist : } : the nearest marker id at distance dist of this.m matrix
  nearestId() {
    let ids = [[1,0,0,0,0], [1,0,1,1,1], [0,1,0,0,1], [0,1,1,1,0]]; // [ [0], [1], [2], [3] ]
    let lesLignes = this.getLines();
    let potencielMarker = []; // Liste de 5 dictionaires {id:Numligne, dist:nbErreur}
    for(let lm=0; lm < 5;lm++){ // pour chaque ligne du marker
      let minErreurLinesValues = {values:[] , dist:6}; //{id et dist} 6  sera forcement ecraser
      for(let lids=0; lids < 4 ; lids++){ // pour chaque possibiliter de ids
        let tmpCalcVal = this.getDistanceOfValue(ids[lids],lesLignes[lm]);
        if(minErreurLinesValues["dist"] > tmpCalcVal["dist"]){
          minErreurLinesValues = tmpCalcVal;
        }
      }
      potencielMarker[lm] = minErreurLinesValues;
    }

    // Calcule de l'id du potenciel marker 
    let markerId = 0;
    let dTot = 0;
    for(let k=0; k<5; k++){
      dTot += potencielMarker[k]["dist"];
      markerId = markerId + ids.findIndex( id => id === potencielMarker[k]["values"] ) * (4**k );
    }

    return {id:markerId,distance:dTot};
  }

  //return {values:,dist}
  getDistanceOfValue(id,line){
    let res = {values:id , dist:0} ;
    for(let i=0; i < 5;i++){ // id
         if(id[i] != line[i]){
            res["dist"] = res["dist"] + 1 ;
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
    let width = s[0]; let height = s[1];
    fbctx.fillStyle = 'white';
    fbctx.fillRect(0,0,width,height);
    let stepX=width /5.0; 
    let stepY=height/5.0;
    fbctx.fillStyle = 'black';
    for(let y = 0; y < 5; y++){
        for(let x = 0; x < 5; x++){
            if(this.m[y * 5 + x] == 0){
              fbctx.fillRect(x*stepX,y*stepY,stepX,stepY);
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


  // ecrit l'id dans fb
  writeId(fb){
    let id = document.getElementById(fb);
    let dico = this.recognize();   
    id.textContent = " d:" + dico["dist"] + " -- id:" + dico["id"] + " -- r:" + dico["rot"] ;
  }

}