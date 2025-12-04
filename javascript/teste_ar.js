import * as THREE from 'three';
import {ARButton} from 'three/examples/jsm/Addons.js';
import '../style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// cena
const scene = new THREE.Scene()


// importar geometria GLB
const loader = new GLTFLoader();
loader.load("../modelos/juno.glb", function(glb){
    console.log(glb);
    const root = glb.scene;
    root.position.set(3, -2, -10)
    scene.add(root);
}, function(xhr){}, function(error){console.log("Error loading the model")})

// luz
// const light = new THREE.PointLight(0xffffff, 1000, 100000)
// light.position.set(0, 10, 0)
// scene.add(light)
const light1 = new THREE.DirectionalLight(0xffffff, 50)
light1.position.set(0, 10, 0)
scene.add(light1)
const light2 = new THREE.DirectionalLight(0xffffff, 1)
light2.position.set(3, -10, 0)
scene.add(light2)
const light3 = new THREE.AmbientLight(0xffffff, 50)
scene.add(light3)

// camera

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.5, 100)
camera.position.z = 5 // mover para poder enxergar o objeto
scene.add(camera)

// renderizador
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.xr.enabled = true;
document.body.appendChild(ARButton.createButton(renderer))

function animate(){
    // requestAnimationFrame(animate);
    // renderer.render(scene, camera);
    renderer.setAnimationLoop(render);
}
animate()

function render(){
    renderer.render(scene, camera);
}

// Controle
const controls = new OrbitControls(camera, canvas);

// resize
window.addEventListener("resize", () => {
    // Update size
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);
})
