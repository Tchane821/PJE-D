export class Tool {

    marker;
    view;

    constructor(marker, view) {
        this.marker = marker; // marker object (reference; markerManager **is the owner**)
        this.view = view;     // the view
        view.tool = this;     // link view to the tool; so the view knows the tool
    }

    updateView() {
        this.view.update(this.marker.quad);
    }

}