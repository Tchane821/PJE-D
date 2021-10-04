import {Marker} from './Marker.js';
export class MarkerManager {
    constructor() {
      this.mesMarker= new Map(); // all marker : Map <K,V> = {id,quad}
    }

    // create a new marker.
    // return the created marker 
    makeMarker(id) {
      let m=new Marker(id);
      this.mesMarker[id]=m;
      return m;
    }

    // update the marker identified by id with the quad. ent = [K,V] = [id,quad]
    update(k,v) {
      this.mesMarker.set(k,v);
    }

    // in : allReco is map {K:id,V:Value} (from Recognize.recognizeMarker)
    updateFromRecognizer(allReco) {
      for (const [key, value] of allReco.entries()) {
        this.update(key,value.clone());
      }
    }

    // draw all markers
    drawAllQuad(ctx) {
      for (const val of this.mesMarker.values()) {
        //console.log(val);
        val.draw2D(ctx,'green');
      }
    }

  }