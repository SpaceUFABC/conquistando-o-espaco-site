import * as THREE from 'three';
import {ARButton} from 'three/examples/jsm/Addons.js';
import '../style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

function loadGLB(path) {
    const loader = new GLTFLoader();

    var root;
    loader.load(path, function(glb) {
        root = glb.scene;
    }, function(xhr){}, function(error) {});

    return root;
}

function sceneInit() {
    const scene = new THREE.Scene();

    // Light setup
    const light1 = new THREE.DirectionalLight(0xffffff, 50);
    light1.position.set(0, 10, 0);
    scene.add(light1);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.5, 100);
    camera.position.z = 5; // mover para poder enxergar o objeto
    scene.add(camera);

    return scene;
}

function createRenderer(){
    const canvas = document.querySelector(".webgl");
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize(sizes.width, sizes.height);
    renderer.xr.enabled = true;

    return renderer;
}

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const scene = new THREE.Scene()
