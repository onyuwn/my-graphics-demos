import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const shirtDesignerScene = new THREE.Scene();
const clock = new THREE.Clock();
const leafTx1 = new THREE.TextureLoader().load('/ceiling1.png');
const skyTx = new THREE.TextureLoader().load('/sky.png');

var rendererWScale = 1.125;
var rendererHScale = 1;
let treeBuilderContainer = document.getElementById("treeBuilderRoot");
console.warn(treeBuilderContainer);
var rendererWidth = (treeBuilderContainer.clientWidth) / rendererWScale;
var rendererHeight = (treeBuilderContainer.clientHeight) / rendererHScale;
var mouseX = 0;
var mouseY = 0;

const camera = new THREE.PerspectiveCamera(
    75, rendererWidth / rendererHeight, 0.1, 1000
);
camera.position.z = 0;
camera.position.y = 2;

var rendererCanvas = document.getElementById("renderer-canvas");
const renderer = new THREE.WebGLRenderer({ antialias: false, canvas: rendererCanvas });
//const controls = new OrbitControls( camera, renderer.domElement );

renderer.setPixelRatio(window.devicePixelRatio);
renderer.aspect = rendererWidth / rendererHeight;
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
                if(shellLength < 0.0) {
                    gl_Position.x += ((float(shellHeight)) * .25) * cos(time + float(shellIndex));
                } else {
                    gl_Position.x += ((1.0 - float(shellHeight)) * .25) * cos(time + float(shellIndex));
                }
                //gl_Position.z += (shellHeight * .25) * sin(time + float(shellIndex));
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
//let treeModel = undefined;

function loadTree(shellCount, shellLength, shellDensity, shellNoiseMin, shellNoiseMax, shellAttenuation, leafColorHex, treeCount, taperLeaves) {
    scene.clear();
    scene.add(light);
    for(let j = 0; j < treeCount; j++) {
        modelLoader.load(
            '/tree.glb',
            (gltf) => {
                scene.add(gltf.scene);
                let treeModel = gltf.scene;
                treeModel.rotation.y -= 3.14 / 2;
                treeModel.position.z = -5;
                if(treeCount > 1) {
                    let flipFlop = j % 2 == 0 ? 1 : -1;
                    treeModel.position.x += (Math.random() * 10) * Math.cos(flipFlop*j*(Math.PI/4.0));
                    treeModel.position.z += (Math.random() * 10) * Math.sin(flipFlop*j*(Math.PI/4.0));
                }
                treeModel.scale.x *= .25;
                treeModel.scale.y *= .25;
                treeModel.scale.z *= .25;
                treeModel.traverse((child, index) => {
                    if(child.isMesh && child.name.toLowerCase().includes("icosphere")) {
                        child.material = getLeafMaterial(0, shellCount, shellLength, shellDensity, shellNoiseMin, shellNoiseMax, shellAttenuation, leafColorHex);
                        for(let i = 0; i < shellCount; i++) {
                            let dupe = child.clone();
                            //let shellDist = (i / shellCount) * shellLength;
                            if(taperLeaves == true) {
                                dupe.scale.x *= 1.0 - (i / shellCount);
                                dupe.scale.y *= 1.0 - (i / shellCount);
                                dupe.scale.z *= 1.0 - (i / shellCount);
                            }
                            dupe.material = getLeafMaterial(i + 1, shellCount, shellLength, shellDensity, shellNoiseMin, shellNoiseMax, shellAttenuation, leafColorHex);
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

    const groundGeometry = new THREE.PlaneGeometry( 10, 10 );
    const groundMaterial = new THREE.ShaderMaterial(
         {
            side:THREE.DoubleSide,
            uniforms: {time: {value: 0.0}},
            vertexShader: `
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
             `,
            fragmentShader: `
                uniform float time;
                varying vec2 vUv;
                vec2 random2( vec2 p ) {
                    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
                }

                float random(vec2 co){
                    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
                }

                void main() { // vornoi // TODO: accept positions of trees to be cell points
                    vec2 uv = vUv;
                    vec3 color = vec3(.25, .75, 0.125);
                    uv *= 25.0; // scale up to start tiling
                    vec2 i_uv = floor(uv);
                    vec2 f_uv = fract(uv);
                    float minDist = 1.0;

                    for(int y = -1; y <= 1; y++) {
                        for(int x = -1; x <= 1; x++) {
                            vec2 neighbor = vec2(float(x), float(y));
                            vec2 point = random2(i_uv + neighbor);
                            //point *= 0.5 + 0.5*sin(6.2831*random2(point) * time);
                            vec2 diff = neighbor + point - f_uv;
                            //float dist = length(diff) + cos(uv.x  + random(uv)) + sin(uv.y  + random(uv));
                            float dist = length(diff);
                            minDist = min(minDist, dist);
                        }
                    }

                    // if(minDist >= .75) {
                    //     minDist = random2(uv).x;
                    //     //discard;
                    // }

                    //color += random2(uv * time).x;
                    color *= (1.0 - pow(minDist,2.0));
                    color -= step(.75,abs(sin(25.0*minDist+time)))*.3;

                    gl_FragColor = vec4(color, 1.0);
                }
             `
        }
    );
    const groundMesh = new THREE.Mesh( groundGeometry, groundMaterial );
    groundMesh.position.z = -5;
    groundMesh.rotation.x = THREE.MathUtils.degToRad(90);
    scene.add( groundMesh );
}

scene.background = skyTx;

const light = new THREE.RectAreaLight(0xffffff, 5, 100, 100);
light.position.set(1, 1, 1).normalize();

scene.add(light);

//controls.update();

function mainRender() {
    requestAnimationFrame(mainRender);

    scene.traverse(function(child) {
        if(child.isMesh && child.material && child.material.uniforms && child.material.uniforms.time) {
            child.material.uniforms.time.value = clock.getElapsedTime();
        }
    });

    // if(treeModel) {
    //     //treeModel.rotation.y += THREE.MathUtils.degToRad(.05);
    // }
    //controls.update();

    renderer.render(scene, camera);
}

let curShellLength = 1.0;
let curShellDensity = 10.0;
let curShellCount = 10.0;
let curNoiseMin = 0.0;
let curNoiseMax = 0.0;
let curAttenuation = 1.0;
let leafColorHex = "";
let treeCount = 1.0;
let taperLeaves = false;

document.getElementById("leafLengthControl").addEventListener('change', function(event) {
    curShellLength = +(event.target.value);
    updateTree();
    document.getElementById("leafLengthInput").value = curShellLength;
});

document.getElementById("leafCountControl").addEventListener('change', function(event) {
    curShellCount = +(event.target.value);
    updateTree();
    document.getElementById("leafCountInput").value = curShellCount;
});

document.getElementById("leafDensityControl").addEventListener('change', function(event) {
    curShellDensity = +(event.target.value);
    updateTree();
    document.getElementById("leafDensityInput").value = curShellDensity;
});

document.getElementById("leafNoiseMinControl").addEventListener('change', function(event) {
    curNoiseMin = +(event.target.value);
    updateTree();
    document.getElementById("leafNoiseMinInput").value = curNoiseMin;
});

document.getElementById("leafNoiseMaxControl").addEventListener('change', function(event) {
    curNoiseMax = +(event.target.value);
    updateTree();
    document.getElementById("leafNoiseMaxInput").value = curNoiseMax;
});

document.getElementById("leafLengthAttenuationControl").addEventListener('change', function(event) {
    curAttenuation = +(event.target.value);
    updateTree();
    document.getElementById("leafAttenuationInput").value = curAttenuation;
});

document.getElementById("leafColorControl").addEventListener('change', function(event) {
    leafColorHex = event.target.value.replace("#", "0x");
    updateTree();
});

document.getElementById("treeCountControl").addEventListener('change', function(event) {
    treeCount = +(event.target.value);
    updateTree();
});

document.getElementById("treeTaperControl").addEventListener('change', function(event) {
    taperLeaves = event.target.checked;
    updateTree();
});

window.addEventListener('resize', () => {
    var rendererWidth = treeBuilderContainer.clientWidth / rendererWScale;
    var rendererHeight = treeBuilderContainer.clientHeight / rendererHScale;
    camera.aspect = rendererWidth / rendererHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(rendererWidth, rendererHeight);
});

function updateTree() {
    camera.position.y = treeCount - 1.0;
    //camera.position.z = (treeCount / 2.0) + 2.0;
    camera.rotation.x = THREE.MathUtils.degToRad((treeCount / 10) * 360)
    loadTree(curShellCount, curShellLength, curShellDensity, curNoiseMin, curNoiseMax, curAttenuation, leafColorHex, treeCount, taperLeaves);
}

updateTree();
mainRender();
