import G from './global.js';
import {NodePose3D} from './NodePose3D.js';
import * as THREE from '../lib/three/build/three.module.js';
import {GLTFLoader} from '../lib/three/examples/jsm/loaders/GLTFLoader.js';

export class GLTF extends NodePose3D {

    constructor(filename) {
        super();
        let gltfNode = new THREE.Group();

        G.waitLoading += 1;
        new GLTFLoader()
            .load(filename,
                // called when loaded
                function (gltf) {
                    let obj = gltf.scene;
                    gltfNode.add(obj);

                    /* truck2   */
                    obj.scale.x = .006;
                    obj.scale.y = .006;
                    obj.scale.z = .006;

                    obj.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2.0);

                    gltfNode.translateOnAxis(new THREE.Vector3(0, 0, 1), 0);

                    G.waitLoading -= 1;

                },
                // called when progress
                function (xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                // called when loading has errors
                function (error) {
                    console.log('An error happened' + error);

                }
            );
        this.node.add(gltfNode);
    }

    update() {
        super.update();
    }


}