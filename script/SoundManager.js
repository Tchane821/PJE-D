import {Tool} from './Tool.js';
import {LinkView} from './LinkView.js';

export class SoundManager {

    // tool Gain
    v1;
    v2;
    // tool egaliseur
    egaliseur;
    // vue du lien du Gain
    linkView

    audioContext;
    source;
    gain;
    analyser;

    constructor() {
        // init
        // le contexte
        this.audioContext = new AudioContext();
        // la source
        this.source = this.audioContext.createMediaElementSource(document.getElementById('sound'));
        // outil pour contrôler le volume (init)
        this.gain = this.audioContext.createGain();
        this.source.connect(this.gain).connect(this.audioContext.destination);
        this.gain.gain.value = 0.8; // set le gain de départ
        // auto play
        document.getElementById('sound').play();

        // analyse
        this.analyser = this.audioContext.createAnalyser();
        this.source.connect(this.analyser);
        this.analyser.fftSize = 32;
    }

    updateSound() {
        if (this.v1.marker.TTL > 0 && this.v2.marker.TTL > 0) {
            this.linkView.node.traverse(child => {
                child.visible = true;
            });
            let dst = Tool.distance(this.v1, this.v2);
            if (!isNaN(dst)) {
                this.gain.gain.value = dst;
            }
        } else {
            this.linkView.node.traverse(child => {
                child.visible = false;
            });
            this.gain.gain.value = 0;
        }
        this.writeGain('vgain', this.gain.gain.value);
        this.linkView.update();
        this.analyser.getByteFrequencyData(this.egaliseur.dataArray);
    }

    volume(tool1, tool2) {
        this.v1 = tool1;
        this.v2 = tool2;
        this.linkView = new LinkView(tool1, tool2);
    }

    setEgaliseur(toolEg){
        this.egaliseur = toolEg;
        this.egaliseur.dataArray = new Uint8Array(16);
    }

    writeGain(fb, gain) {
        let id = document.getElementById(fb);
        id.textContent = " Gain: " + gain;
    }
}