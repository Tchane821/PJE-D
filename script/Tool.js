import {Quad} from './Quad.js';

export class Tool {

    marker;
    view;

    constructor(marker, view) {
        this.marker = marker; // marker object (reference; markerManager **is the owner**)
        this.view = view;     // the view
        view.tool = this;     // link view to the tool; so the view knows the tool
    }

    updateView() {
        if (this.marker.TTL !== 0) {
            this.view.update(this.marker.quad);
        }else{
            let fq = new Quad();
            fq.t = [0,0,0,0,0,0,0,0];
            this.view.update(fq);
        }
    }

}