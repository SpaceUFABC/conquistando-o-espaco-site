import * as THREE from 'three';
import {ARButton} from 'three/examples/jsm/Addons.js';
import '../style.css'
import { GLTFLoader } from 'three/examples/jsm/Addons.js';


class sceneAR {
    constructor() {
        this.scene = new THREE.Scene();

        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }

    sceneInit() {
        // Light setup
        const light1 = new THREE.DirectionalLight(0xffffff, 50);
        light1.position.set(0, 10, 0);
        this.scene.add(light1);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(75, this.sizes.width/this.sizes.height, 0.5, 100);
        this.camera.position.z = 5; // mover para poder enxergar o objeto
        this.scene.add(this.camera);
    }

    loadGLB(path) {
        const loader = new GLTFLoader();

        loader.load(path, (glb) => {
            const root = glb.scene;
            this.scene.add(root);
            console.log("Done loading GLB")
        }, undefined, (error) => {console.log("Error loading the model: " + error);});
    }

    createRenderer() {
        const canvas = document.querySelector(".webgl");
        this.renderer = new THREE.WebGLRenderer({canvas});
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.xr.enabled = true;

        console.log(this.renderer);
    }

    createARButton() {
        this.renderer.xr.enabled = true;
        this.renderer.xr.setSession(null);

        if (navigator.xr) {
            navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['local-floor'] })
                .then((session) => {
                    this.renderer.xr.setSession(session);
                })
                .catch((error) => {
                    console.error('Failed to start AR session:', error);
                });
        } else {
            console.error('WebXR not supported');
        }

        // const button = document.createElement('button');
        // button.style.position = 'absolute';
        // button.style.bottom = '20px';
        // button.style.left = '50%';
        // button.style.transform = 'translateX(-50%)';
        // button.style.padding = '10px 20px';
        // button.style.fontSize = '16px';
        // button.style.backgroundColor = '#007bff';
        // button.style.color = '#fff';
        // button.style.border = 'none';
        // button.style.borderRadius = '5px';
        // button.style.cursor = 'pointer';
        // button.textContent = 'Enter AR';

        // button.addEventListener('click', () => {
        //     this.renderer.xr.enabled = true;
        //     this.renderer.xr.setSession(null);

        //     if (navigator.xr) {
        //         navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['local-floor'] })
        //             .then((session) => {
        //                 this.renderer.xr.setSession(session);
        //             })
        //             .catch((error) => {
        //                 console.error('Failed to start AR session:', error);
        //             });
        //     } else {
        //         console.error('WebXR not supported');
        //     }
        // });

        // document.body.appendChild(button);
    }

    animate(){
        this.renderer.setAnimationLoop(this.render.bind(this));
    }

    render(){
        this.renderer.render(this.scene, this.camera);
    }
}


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

var scene = new sceneAR();
scene.sceneInit();
scene.loadGLB("../modelos/juno.glb");
scene.createRenderer();
scene.createARButton();

scene.animate();




