import {Marker} from './Marker.js';

export class MarkerManager {
    constructor() {
        this.mesMarker = new Map(); // all marker : Map <K,V> = {id,M}
    }

    // create a new marker.
    // return the created marker 
    // q : quad
    makeMarker(id, q) {
        let m = new Marker(id);
        m.update(q);
        this.mesMarker.set(id,m);
        return m;
    }

    // update the marker identified by id with the quad. ent = [K,V] = [id,V]
    update(k, v) {
        let m;
        if (this.mesMarker.has(k)) {  // si existe déjà on met à jour le quad du marker existant
            m=this.mesMarker.get(k);
        }
        else {  // si pas encore le MarkerManager on en crée un ("normalement" il n'est d'ailleurs pas associé à un tool dans ce cas)
            m = this.makeMarker(k, v);
        }
        m.update(v);
    }

    // in : allReco is map {K:id,V:Value} Value == quad (from Recognize.recognizeMarker)
    updateFromRecognizer(allReco) {
        for (const [key, value] of allReco.entries()) {
            this.update(key, value);
        }
    }

    // draw all markers
    drawAllQuad(ctx) {
        for (const mark of this.mesMarker.values()) {
            mark.drawMarker(ctx);
        }
    }

}