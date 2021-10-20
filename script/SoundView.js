import {NodePose3D} from './NodePose3D.js';
import * as THREE from '../lib/three/build/three.module.js';


export class SoundView extends NodePose3D { // intègre this.node placé par la pose du marqueur

    node;
    tool;

    constructor() {
        super();
        let material = new THREE.MeshPhongMaterial({color: 0x00ffff, side: THREE.DoubleSide});
        let nBar = 8;
        // créer 8 cubes espacés qui sont ajoutés à this.node
        let geometry = new THREE.BoxGeometry(1, 1, 1);
        this.node = new THREE.Group();
        for (let k = 0; k < nBar; k++) {
            let cube = new THREE.Mesh(geometry, material);
            this.node.add(cube);
            cube.position.copy(new THREE.Vector3(k, 0, -2));
        }
    }

    update() {
        super.update(); // assure la position de la vue selon la pose du marqueur associé
        // copie les données de l'analyse
        // aller chercher le tabl
        // exploiter this.tool.dataArray pour la mise à jour de la vue (redimensionner chaque barre)
        // (dataArray provient de la décomposition en fréquence du son : chaque valeur du tableau est comprise entre 0 et 255 représentant l'amplitude : voir ci-après).
        let dataArray = this.tool.dataArray;
        for (let k = 0; k < 8; k++) {
            let values = dataArray[k * 2] + dataArray[k * 2 + 1]; // [0 -510]
            let transformedValue = (values / 100) + 0.5
            this.node.children[k].scale.set(transformedValue, 1, 1);
        }

    }
}