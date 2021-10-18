const {NodePose3D} = require('./NodePose3D.js');

class SoundView extends NodePose3D { // intègre this.node placé par la pose du marqueur
    constructor() {
        super();
        let material = new THREE.MeshPhongMaterial({color: 0x00ffff, side: THREE.DoubleSide});
        let nBar = 8;
        // créer 8 cubes espacés qui sont ajoutés à this.node


        this.analyser = this.audioContext.createAnalyser(); // outil WebAudio pour analyser un son
        this.source.connect(this.analyser);               // chaine : source -> analyseur fréquentiel du son
        this.analyser.fftSize = 32;                    // décomposition en 16 plages de fréquences (on ne peut pas en récupérer moins de 16)
        this.equalizer = G.makeTool(marker, new View.SoundView());
    }

    update() {
        super.update(); // assure la position de la vue selon la pose du marqueur associé
        this.analyser.getByteFrequencyData(this.equalizer.dataArray); // copie les données de l'analyse
        // exploiter this.tool.dataArray pour la mise à jour de la vue (redimensionner chaque barre)
        // (dataArray provient de la décomposition en fréquence du son : chaque valeur du tableau est comprise entre 0 et 255 représentant l'amplitude : voir ci-après).


    }
}