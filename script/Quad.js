export class Quad { // 2D quad
    constructor() {
        this.t = [-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5]; // [x0,y0,x1,y1,x2,y2,x3,y3] //resolution de sortie dans openCV
    }

    copy(q) {
        for (let i = 0; i < 8; ++i) {
            this.t[i] = q.t[i];
        }
    }

    clone() {
        let qr = new Quad();
        for (let i = 0; i < 8; ++i) {
            qr.t[i] = this.t[i];
        }
        return qr;
    }

    // in : width, height of the image
    // in : t a 8-values array [x0,y0, ...] of the quad in window coordinates
    // carré finale : (-1,-1) , (-1, 0) , (-1, -1) , (0, -1)
    setFromWindow(width, height, t) {
        this.t[0] = (t[0] * 2 / width) - 1;
        this.t[1] = (t[1] * 2 / height) - 1;
        this.t[2] = (t[2] * 2 / width) - 1;
        this.t[3] = (t[3] * 2 / height) - 1;
        this.t[4] = (t[4] * 2 / width) - 1;
        this.t[5] = (t[5] * 2 / height) - 1;
        this.t[6] = (t[6] * 2 / width) - 1;
        this.t[7] = (t[7] * 2 / height) - 1;
    }

    // in : s {width:... ,height:...} : image width and height
    // return array of 8 values : coordinates of the square in window coordinates (from normalized coordinates)
    toWindow(s) {
        let res = [];
        let width = s[0];
        let height = s[1];
        res[0] = (this.t[0] + 1) * width / 2;
        res[1] = (this.t[1] + 1) * height / 2;
        res[2] = (this.t[2] + 1) * width / 2;
        res[3] = (this.t[3] + 1) * height / 2;
        res[4] = (this.t[4] + 1) * width / 2;
        res[5] = (this.t[5] + 1) * height / 2;
        res[6] = (this.t[6] + 1) * width / 2;
        res[7] = (this.t[7] + 1) * height / 2;
        return res;
    }

    // in : ctx : 2d context of a canvas
    // in : 2d context color of the quad ('red' for example)
    draw2D(ctx, color) {
            ctx.beginPath();
            let pts = this.toWindow([ctx.canvas.width, ctx.canvas.height]);
            ctx.strokeStyle = color;
            ctx.fillRect(pts[0], pts[1], 4, 4);
            ctx.moveTo(pts[0], pts[1]);
            ctx.lineTo(pts[2], pts[3]);
            ctx.lineTo(pts[4], pts[5]);
            ctx.lineTo(pts[6], pts[7]);
            ctx.closePath(0);
            ctx.stroke();
    }

    rotateQ90i(angleQuad) {
        for (angleQuad; angleQuad > 0; angleQuad--) {
            let qt = [];
            for (let i = 0; i < 8; i++){
            qt[i] = this.t[(i + 2) % 8];
            }
            this.t = qt
        }
    }
}