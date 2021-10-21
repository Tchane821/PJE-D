import {Tool} from '../Math/Tool.js'

export class ToolManager {

    constructor() {
        this.tools = []; // all tools
    }

    // factory
    makeTool(marker, view) {
        let t = new Tool(marker, view);
        this.tools.push(t);
        return t;
    }


    updateView() {
        this.tools.forEach(t => {
            t.updateView();
        });
    }

}