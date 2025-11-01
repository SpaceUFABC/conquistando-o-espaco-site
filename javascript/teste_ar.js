import * as THREE from 'three';
import '../style.css'
import { ARButton } from 'https://github.com/mrdoob/three.js/blob/dev/examples/jsm/webxr/ARButton.js';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// cena
const scene = new THREE.Scene()

// objeto (geometria e material)
const cubeGeometry = new THREE.BoxGeometry(1,1,1)
const cubeMaterial = new THREE.MeshBasicMaterial({color: "red"})
// Malha final
const cubeMesh = new THREE.Mesh(
    cubeGeometry,
    cubeMaterial
)
scene.add(cubeMesh)

// luz
const light = new THREE.PointLight(0xffffff, 1, 100)
scene.add(light)

// camera

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 1, 30)
camera.position.z = 5 // mover para poder enxergar o objeto
scene.add(camera)

// renderizador
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// AR
const button = ARButton.createButton(renderer);
document.body.appendChild(button);
console.log(button)

// resize
window.addEventListener("resize", () => {
    // Update size
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.render(scene, camera)
})
