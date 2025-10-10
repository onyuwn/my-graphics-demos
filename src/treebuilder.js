import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { vertexColor } from 'three/tsl';

const scene = new THREE.Scene();
const shirtDesignerScene = new THREE.Scene();
const clock = new THREE.Clock();
const leafTx1 = new THREE.TextureLoader().load('/ceiling1.png');
const skyTx = new THREE.TextureLoader().load('/sky.png');

var rendererWScale = 1;
var rendererHScale = 1;
let treeBuilderContainer = document.getElementById("treeBuilderRoot");
console.warn(treeBuilderContainer);
var rendererWidth = (treeBuilderContainer.clientWidth - (treeBuilderContainer.style.padding * 4)) / rendererWScale;
var rendererHeight = (treeBuilderContainer.clientHeight - (treeBuilderContainer.style.padding * 2)) / rendererHScale;
var mouseX = 0;
var mouseY = 0;

const camera = new THREE.PerspectiveCamera(
    75, rendererWidth / rendererHeight, 0.1, 1000
);
camera.position.z = 0;
camera.position.y = 2;

var rendererCanvas = document.getElementById("renderer-canvas");
const renderer = new THREE.WebGLRenderer({ antialias: false, canvas: rendererCanvas });
renderer.setSize(rendererWidth, rendererHeight);

function getLeafUniforms(shellIndex, shellCount, shellLength, shellDensity, shellNoiseMin, shellNoiseMax, shellAttenuation, leafColorHex) {
    return {
        shellCount: { value: shellCount },
        shellIndex: { value: shellIndex },
        shellLength: { value: shellLength },
        time: { value: 0.0 },
        leafTx: { value: leafTx1 },
        density: { value: shellDensity },
        noiseMin: { value: shellNoiseMin },
        noiseMax: { value: shellNoiseMax },
        shellAttenuation: { value: shellAttenuation },
        shellColor: { value: new THREE.Color().setHex(leafColorHex) }
    };
}

function getLeafMaterial(shellIndex, shellCount, shellLength, shellDensity, shellNoiseMin, shellNoiseMax, shellAttenuation, leafColorHex) {
    let uniforms = getLeafUniforms(shellIndex, shellCount, shellLength, shellDensity, shellNoiseMin, shellNoiseMax, shellAttenuation, leafColorHex);
    var leafShaderMaterial = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `
            varying vec2 vUv;
            varying float shellHeight;
            varying vec3 world_pos;
            uniform float shellCount;
            uniform float shellLength;
            uniform int shellIndex;
            uniform float shellAttenuation;
            uniform float time;

            void main() {
                vUv = uv;
                shellHeight = float(shellIndex) / float(shellCount);
                float h = pow(shellHeight, shellAttenuation);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                world_pos = (modelViewMatrix * vec4(position, 1.0)).xyz;
                gl_Position.y += (shellLength * h);
                gl_Position.x += .05 * cos(time + float(shellIndex) + world_pos.x);
                gl_Position.z += .05 * sin(time + float(shellIndex) + world_pos.y);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            varying float shellHeight;
            varying vec3 world_pos;
            uniform float shellCount;
            uniform float shellLength;
            uniform int shellIndex;
            uniform float density;
            uniform float noiseMin;
            uniform float noiseMax; 
            uniform sampler2D leafTx;
            uniform vec3 shellColor;

            float hash(vec2 x) {
                // hash by Inigo Quilez, Integer Hash - III, 2017
                uvec2 q = uvec2(x * 8192.0);
                q = 1103515245u * ((q >> 1u) ^ q.yx);
                uint n = 1103515245u * (q.x ^ (q.y >> 3u));
                return float(n) * (1.0 / float(0xffffffffu));
            }

            void main() {
                if(shellIndex == 0) {
                    discard;
                } else {
                    vec2 newUv = vUv * density;
                    vec2 _uv = fract(vUv * density) - 0.5;
                    vec4 leafColor = texture2D(leafTx, vUv);
                    float rand = mix(noiseMin, noiseMax, hash(floor(vUv * density)));
                    if (noiseMin != 0.0 && noiseMax != 0.0 && rand < .75 && shellIndex > 0) discard;
                    //gl_FragColor *= vec4(float(shellIndex)/10.0, .25, 1.0, 1.0);
                    gl_FragColor = vec4(
                        vec3(leafColor * ((1.0 / pow(shellHeight + .125,.5)) - .85)) * shellColor,
                        leafColor.a
                    );
                }
            }
        `,
    });

    return leafShaderMaterial;
}

const modelLoader = new GLTFLoader();
let treeModel = undefined;


function loadTree(shellCount, shellLength, shellDensity, shellNoiseMin, shellNoiseMax, shellAttenuation, leafColorHex) {
    scene.clear();
    modelLoader.load(
        '/tree.glb',
        (gltf) => {
            scene.add(gltf.scene);
            scene.add(light);
            treeModel = gltf.scene;
            treeModel.rotation.y -= 3.14 / 2;
            treeModel.position.z = -5;
            treeModel.scale.x *= .25;
            treeModel.scale.y *= .25;
            treeModel.scale.z *= .25;
            treeModel.traverse((child) => {
                if(child.isMesh && child.name.toLowerCase().includes("icosphere")) {
                    child.material = getLeafMaterial(0, shellCount, shellLength, shellDensity, shellNoiseMin, shellNoiseMax, shellAttenuation, leafColorHex);
                    for(let i = 0; i < shellCount; i++) {
                        let dupe = child.clone();
                        let shellDist = (i / shellCount) * shellLength;
                        //dupe.position.y-= shellDist;
                        // dupe.scale.x *= 1.0 - (i / shellCount);
                        // dupe.scale.y *= 1.0 - (i / shellCount);
                        // dupe.scale.z *= 1.0 - (i / shellCount);
                        dupe.material = getLeafMaterial(i, shellCount, shellLength, shellDensity, shellNoiseMin, shellNoiseMax, shellAttenuation, leafColorHex);
                        treeModel.add(dupe);
                    }
                }
            });
        },
        undefined,
        (error) => {
            console.error(error);
        }
    );
}

scene.background = skyTx;

const light = new THREE.RectAreaLight(0xffffff, 5, 100, 100);
light.position.set(1, 1, 1).normalize();

scene.add(light);

loadTree(10, 1.0);

function mainRender() {
    requestAnimationFrame(mainRender);

    scene.traverse(function(child) {
        if(child.isMesh && child.name.toLowerCase().includes("icosphere")) {
            child.material.uniforms.time.value = clock.getElapsedTime();
        }
    });

    if(treeModel) {
        treeModel.rotation.y += THREE.MathUtils.degToRad(.05);
    }

    renderer.render(scene, camera);
}

let curShellLength = 1.0;
let curShellDensity = 10.0;
let curShellCount = 10.0;
let curNoiseMin = 0.0;
let curNoiseMax = 0.0;
let curAttenuation = 1.0;
let leafColorHex = "";

document.getElementById("leafLengthControl").addEventListener('change', function(event) {
    curShellLength = +(event.target.value);
    loadTree(curShellCount, curShellLength, curShellDensity, curNoiseMin, curNoiseMax, curAttenuation, leafColorHex);
});

document.getElementById("leafCountControl").addEventListener('change', function(event) {
    curShellCount = +(event.target.value);
    loadTree(curShellCount, curShellLength, curShellDensity, curNoiseMin, curNoiseMax, curAttenuation, leafColorHex);
    document.getElementById("leafCountInput").value = curShellCount;
});

document.getElementById("leafDensityControl").addEventListener('change', function(event) {
    curShellDensity = +(event.target.value);
    loadTree(curShellCount, curShellLength, curShellDensity, curNoiseMin, curNoiseMax, curAttenuation, leafColorHex);
});

document.getElementById("leafNoiseMinControl").addEventListener('change', function(event) {
    curNoiseMin = +(event.target.value);
    loadTree(curShellCount, curShellLength, curShellDensity, curNoiseMin, curNoiseMax, curAttenuation, leafColorHex);
});

document.getElementById("leafNoiseMaxControl").addEventListener('change', function(event) {
    curNoiseMax = +(event.target.value);
    loadTree(curShellCount, curShellLength, curShellDensity, curNoiseMin, curNoiseMax, curAttenuation, leafColorHex);
});

document.getElementById("leafLengthAttenuationControl").addEventListener('change', function(event) {
    curAttenuation = +(event.target.value);
    loadTree(curShellCount, curShellLength, curShellDensity, curNoiseMin, curNoiseMax, curAttenuation, leafColorHex);
});

document.getElementById("leafColorControl").addEventListener('change', function(event) {
    leafColorHex = event.target.value.replace("#", "0x");
    loadTree(curShellCount, curShellLength, curShellDensity, curNoiseMin, curNoiseMax, curAttenuation, leafColorHex);
});

mainRender();
