import {Quad} from './Quad.js';

export class Marker {
    constructor(id) {
        this.id = id;
        this.quad = new Quad(); // this is the owner
        this.color = "green"; // quad color
        this.TTL = 10; // création d'un time to live pour l'affichage
    }

    update(quad) {
        this.quad.copy(quad);
        this.TTL = 10;
    }

    drawMarker(ctx) {
        if (this.TTL !== 0) {
            this.quad.draw2D(ctx, this.color);
            this.TTL -= 1;
        }
    }
}