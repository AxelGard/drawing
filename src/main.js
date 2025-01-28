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


const randomNum = (min, max) => {
	return Math.random() * (max - min) + min
  }


function perlinNoise(x, y, z) {
	const p = new THREE.Vector3(x, y, z);
	const noise = new THREE.Vector3();
	noise.x = Math.sin(p.x * 0.01) * 43758.5453123;
	noise.y = Math.sin(p.y * 0.01) * 43758.5453123;
	noise.z = Math.sin(p.z * 0.01) * 43758.5453123;
	return Math.abs(Math.sin(noise.dot(p) * 0.01));	
}

let heightTo3model = new Map();
heightTo3model.set("water", './assets/gltf/tiles/base/hex_water.gltf');
heightTo3model.set("grass", './assets/gltf/tiles/base/hex_grass.gltf');
heightTo3model.set("mountain", './assets/gltf/decoration/nature/mountain_A_grass.gltf');

let world2DArray; // 2D array of hex points

class HexPoint {
	constructor(x, y, z, world2DArray_i, world2DArray_j) {
		this.x = x;
		this.y = y;	
		this.z = z;
        this.world2DArray_i = world2DArray_i;
        this.world2DArray_j = world2DArray_j;
		this.modelPath = heightTo3model.get("water");
	}

	loadModel() {
		if (this.y < 0.5) {
			this.modelPath = heightTo3model.get("water");
		} else if (this.y < 0.95) {
			this.modelPath = heightTo3model.get("grass");
		} else {
			this.modelPath = heightTo3model.get("mountain");	
            loadModel(heightTo3model.get("grass"), {x: this.x, y: 1, z: this.z});
		}	
		this.y = 1;
		loader.load(
			this.modelPath,
			(gltf) => {
				gltf.scene.position.set(this.x, this.y, this.z);
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
}

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
    const moveDistance = 0.1; // Adjust the movement speed as needed

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
        case 'Shift':
            camera.position.y -= moveDistance;
            break;
        case ' ':
            camera.position.y += moveDistance;
            break;
    }
});

function createGround(rows, cols, spacing) {
    const hexWidth = spacing;
    const hexHeight = Math.sqrt(3) / 2 * spacing;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const xOffset = j * hexWidth + (i % 2) * (hexWidth / 2);
            const zOffset = i * hexHeight;
            let p = new HexPoint(xOffset, 1, zOffset, i, j);
            p.y = perlinNoise(xOffset, 1, zOffset);
            p.loadModel();
        }
    }
}

createGround(20, 20, 2);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();