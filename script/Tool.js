export class Tool {

    marker;
    view;

    constructor(marker, view) {
        this.marker = marker; // marker object (reference; markerManager **is the owner**)
        this.view = view;     // the view
        view.tool = this;     // link view to the tool; so the view knows the tool
    }

    updateView() {
        if (this.marker.TTL > 0) {
            this.view.node.traverse(child => {
                child.visible = true;
            });
            this.view.update(this.marker.quad);
        } else {
            this.view.node.traverse(child => {
                child.visible = false;
            });
        }
    }

    static distance(tool1, tool2) {
        let p1 = tool1.marker.getPose().position;
        let p2 = tool2.marker.getPose().position;
        let res = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
        return res;
    }

}