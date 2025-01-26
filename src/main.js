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
camera.position.z = 5;

const loader = new GLTFLoader();

function loadModel(modelPath) {
	loader.load(
		modelPath,
		(gltf) => {
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

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

loadModel('./assets/gltf/buildings/blue/building_home_A_blue.gltf');
animate();