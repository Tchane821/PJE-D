import { Quad } from './Quad.js';
export class Marker {
    constructor(id) {
      this.id=id;
      this.quad = new Quad(); // this is the owner
      this.color="green"; // quad color
    }

    update(quad) {
      this.quad.copy(quad);
    }
  
    draw2D(ctx) {
     this.quad.draw2D(ctx,this.color);
    }
  }