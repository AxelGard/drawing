import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 10;

const loader = new GLTFLoader();

function loadModel(modelPath, position) {
    loader.load(
        modelPath,
        (gltf) => {
            gltf.scene.position.set(position.x, position.y, position.z);
            scene.add(gltf.scene);
        },
        (progress) => {
            console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%');
        },
        (error) => {
            console.error('An error occurred loading the model:', error);
        }
    );
}

// Add event listener for keyboard controls
document.addEventListener('keydown', (event) => {
    const moveDistance = 0.5; // Adjust the movement speed as needed

    switch (event.key) {
        case 'w':
            camera.position.z -= moveDistance;
            break;
        case 's':
            camera.position.z += moveDistance;
            break;
        case 'a':
            camera.position.x -= moveDistance;
            break;
        case 'd':
            camera.position.x += moveDistance;
            break;
    }
});

// Function to create a hexagonal grid of hex grass models
function createGround(modelPath, rows, cols, spacing) {
    const hexWidth = spacing;
    const hexHeight = Math.sqrt(3) / 2 * spacing;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const xOffset = j * hexWidth + (i % 2) * (hexWidth / 2);
            const zOffset = i * hexHeight;
            loadModel(modelPath, { x: xOffset, y: Math.random(1,2), z: zOffset });
        }
    }
}

// Load a hexagonal grid of hex grass models
createGround('./assets/gltf/tiles/base/hex_grass.gltf', 10, 10, 2);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();