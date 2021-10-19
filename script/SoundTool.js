import {Tool} from './Tool.js';
import * as View from './LinkView.js';
import G from './global.js';
import {SoundView} from './SoundView.js';

export class SoundTool {

    v1;
    v2;
    audioContext;
    source;
    gain;
    viewGain;
    equalizer;
    analyser;

    constructor(marker) {
        this.audioContext = new AudioContext(); // création d'un contexte audio
        this.source = this.audioContext.createMediaElementSource(document.getElementById('sound')); // source du son
        this.gain = this.audioContext.createGain(); // outil pour contrôler le volume
        this.source.connect(this.gain).connect(this.audioContext.destination); // chaine : source -> gain -> restitution (audioContext.destination fournit une restitution par défaut)
        document.getElementById('sound').play();                               // joue le son de l'élément audio html
        this.gain.gain.value = 0.8; // tester en changeant la valeur

        this.equalizer = G.makeTool(marker, new SoundView());
        this.equalizer.dataArray = new Uint8Array(16); // création d'un tableau dans le \verb#Tool# pour recevoir les données issues de l'analyse par WebAudio
        this.analyser = this.audioContext.createAnalyser(); // outil WebAudio pour analyser un son
        this.source.connect(this.analyser);                 // chaine : source -> analyseur fréquentiel du son
        this.analyser.fftSize = 32;                       // décomposition en 16 plages de fréquences (on ne peut pas en récupérer moins de 16)
    }

    update() {
        if (this.v1.marker.TTL > 0 && this.v2.marker.TTL > 0) {
            this.viewGain.node.traverse(child => {
                child.visible = true;
            });
            let dst = Tool.distance(this.v1, this.v2);
            if (!isNaN(dst)) {
                this.gain.gain.value = dst;
            }
        } else {
            this.viewGain.node.traverse(child => {
                child.visible = false;
            });
            this.gain.gain.value = 0;
        }
        this.writeGain('vgain', this.gain.gain.value)
        this.viewGain.update();
        this.analyser.getByteFrequencyData(this.equalizer.dataArray);
    }

    volume(tool1, tool2) {
        this.v1 = tool1;
        this.v2 = tool2;
        this.viewGain = new View.LinkView(tool1, tool2);
    }

    writeGain(fb, gain) {
        let id = document.getElementById(fb);
        id.textContent = " Gain: " + gain;
    }
}