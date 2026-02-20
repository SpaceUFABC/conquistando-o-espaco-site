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

        // Get elements
        this.arPopup = document.getElementById("popup");
        this.arButton = document.getElementById("startAR");
        this.arPopup.style.display = "none";

        this.objectIndex = 0;

        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.id = 'ar-overlay';
        this.overlay.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; height: 100vh;">
                <button> < </button>
                <button> > </button>
            </div>`;
    }

    sceneInit() {
        // Light setup
        const light1 = new THREE.DirectionalLight(0xffffff, 50);
        light1.position.set(0, 10, 0);
        this.scene.add(light1);

        // Add ambient light for better AR visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(75, this.sizes.width/this.sizes.height, 0.1, 100);
        // Don't set fixed position - AR will control the camera
        this.scene.add(this.camera);
    }

    loadGLB(path) {
        const loader = new GLTFLoader();

        loader.load(path, (glb) => {
            const root = glb.scene;
            this.scene.add(root);
            console.log("Done loading GLB")
            this.arPopup.style.display = "flex";
        }, undefined, (error) => {console.log("Error loading the model: " + error);});
    }

    createRenderer() {
        const canvas = document.querySelector(".webgl");
        this.renderer = new THREE.WebGLRenderer({canvas});
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.xr.enabled = true;

        console.log(this.renderer);
    }

    startAR() {
        const arPopup = document.getElementById("popup");
        arPopup.style.display = "none";

        if (navigator.xr) {
            navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['dom-overlay', 'local-floor', 'hit-test'],
                domOverlay: { root: this.overlay}
            })
                .then((session) => {
                    this.renderer.xr.setSession(session);
                })
                .catch((error) => {
                    console.error('Failed to start AR session:', error);
                });
        } else {
            console.error('WebXR not supported');
        };

    }

    createARButton() {
        this.renderer.xr.enabled = true;
        this.renderer.xr.setSession(null);

        this.arButton.addEventListener('click', () => this.startAR());
    }

    animate(){
        this.renderer.setAnimationLoop((time, frame) => this.render(time, frame));
    }

    render(time, frame){
        this.renderer.render(this.scene, this.camera);
    }
}


const objectList = [
    ["../modelos/juno.glb", ["Anim1", "Anim2", "Anim3"]],
    ["../modelos/14bis.glb", ["Anim1", "Anim2", "Anim3"]]
];

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




