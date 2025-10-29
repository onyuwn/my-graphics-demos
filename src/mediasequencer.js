import { initBuffers } from "./initbuffers.js";
import { drawScene } from "./drawscene.js";
import GIF from "gif.js.optimized";

const vertexShaderSource = `
    attribute vec2 aTextureCoord;
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;
    }
`;

const fragmentShaderSource = `
    precision highp float;
    varying highp vec2 vTextureCoord;
    uniform float time;
    uniform float transitionTime;
    uniform float sequenceItemLength;
    uniform float sequenceItemStartTime;
    uniform int transitionType;
    uniform int sequenceIndex;

    uniform sampler2D uSampler;

    vec2 random2( vec2 p ) {
        return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }

    void main() {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
        float transitionStart = (sequenceItemStartTime + sequenceItemLength) - transitionTime;
        if(transitionType == 1 && time >= transitionStart)
        {
            gl_FragColor.a -= (time - transitionStart) / transitionTime;
            //gl_FragColor *= cos(time * 10.0);
        }
        //gl_FragColor.a = time;
    }
`;

let deltaTime = 0;

function initShaderProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error(
        `Unable to initialize the shader program: ${gl.getProgramInfoLog(
            shaderProgram,
        )}`
        );
        return null;
    }
    
    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`An error occured compiling shader:\n${gl.getShaderInfoLog(shader)}`)
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}

function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
    gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel,
    );

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = url;
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        srcFormat,
        srcType,
        image,
      );

      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    };
    return texture;
}

let sequenceLength = 10; // total time in s? ig this will just be sum of frames?
let sequenceImages = []; //{image:"src", length:"0.0", shader:"", size:[], position:[]}

let glContext = undefined;
let globalTime = 0;
let globalTimeOffset = 0; // used to restart when start/stop?
let isPlaying = false;
let pixelsPerSecond = 25;
let transitionOptions = ["cut", "fade", "disolve"];

let needCapture = false;
let requestedCaptureFrames = 10;
let finalFrames = [];
let gifProcessing = false;
let gifRendering = false;

function main() {
    const canvas = document.querySelector("#gl-canvas");
    const gl = canvas.getContext("webgl");
    glContext = gl;

    if (gl === null) {
    alert(
        "Unable to initialize WebGL. Your browser or machine may not support it.",
    );
    return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    const shaderProgram = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord")
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
            uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
            time: gl.getUniformLocation(shaderProgram, "time"),
            transitionTime: gl.getUniformLocation(shaderProgram, "transitionTime"),
            sequenceItemLength: gl.getUniformLocation(shaderProgram, "sequenceItemLength"),
            transitionType: gl.getUniformLocation(shaderProgram, "transitionType"),
            sequenceIndex: gl.getUniformLocation(shaderProgram, "sequenceIndex"),
            sequenceItemStartTime: gl.getUniformLocation(shaderProgram, "sequenceItemStartTime"),
        }
    }
    const buffers = initBuffers(gl);
    const texture = loadTexture(gl, "/ceiling1.png");
    const texture2 = loadTexture(gl, "/sky.png");
    sequenceImages.push({name:"test1", texture:texture, startTime:0.0, length:4.0, id: 0, transitionType: 0, transitionTime: 1.0});
    sequenceImages.push({name:"test2", texture:texture2, startTime:4.0, length:4.0, id: 1, transitionType: 0, transitionTime: 1.0});
    updateTimeline();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    let then = 0;

    const gif = new GIF({
        workers: 1,
        quality: 10,
        width:128,
        height:128,
        workerScript: 'dist/gif.worker.js'
    });
    gif.on('progress', function(progress) {
        console.warn("progress")
        console.warn(progress);
    });
    gif.on('finished', function(blob) {
        console.warn("GIFF");
        window.open(URL.createObjectURL(blob));
        gifRendering = false;
        needCapture = false;
        gifProcessing = false;
    });

    function render(now) {
        now *= 0.001; // convert to seconds
        deltaTime = now - then;
        then = now;

        if(isPlaying && gifProcessing == false) {
            globalTime = now - globalTimeOffset;
            document.getElementById("sequenceMarker").style.left = 30 + (globalTime * pixelsPerSecond) + getSequencerOffset();
        } else if(gifProcessing == false) {
            globalTimeOffset = now;
        }
    
        if(gifProcessing == false) {
            drawScene(gl, programInfo, buffers, sequenceImages, globalTime, deltaTime);
        }
        document.getElementById("timeValue").innerHTML = globalTime.toFixed(4);

        if(needCapture == true) {
            needCapture = false;
            drawScene(gl, programInfo, buffers, sequenceImages, globalTime, deltaTime);
            if(finalFrames.length < requestedCaptureFrames) {
                canvas.toBlob((blob) => {
                    //window.URL.createObjectURL(blob);
                    finalFrames.push(blob);
                    globalTime = getTotalSequenceLength() * (finalFrames.length / requestedCaptureFrames);
                    const img = new Image();
                    img.src = URL.createObjectURL(blob);

                    img.onload = () => {
                        gif.addFrame(img, {delay: 250});
                        needCapture = true;
                    }
                });
            }
        } else {
            if(gif.frames.length >= requestedCaptureFrames && gifRendering == false) {
                gifRendering = true;
                console.warn("GIFF");
                gif.render();
            }
        }

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
main();

function getImgDataFromFile(fileName) {
    //var file = new File(fileName);
}

function getTotalSequenceLength() {
    let length = 0.0;
    for(let i = 0; i < sequenceImages.length; i++) {
        length += sequenceImages[i].length;
    }

    return length;
}

function getSequencerOffset() {
    let sequencerDiv = document.getElementById("sequencerTimeline");
    return sequencerDiv.offsetLeft;
}

document.getElementById("sequenceItemInput").addEventListener("change", function(e) {
    let file = e.target.files[0];
    var reader = new FileReader();

    reader.addEventListener("load", function(e) {
        const newTexture = loadTexture(glContext, e.target.result);
        addItemToSequence(file, newTexture, e.target.result);
    });

    if (file) {
        reader.readAsDataURL(file);
    }
});

document.getElementById("sequencerStartStop").addEventListener("click", function(e) {
    isPlaying = !isPlaying;

    if(isPlaying) {
        e.target.innerHTML = "stop";
    } else {
        e.target.innerHTML = "play";
    }
});

document.getElementById("sequencerRestart").addEventListener("click", function(e) {
    globalTimeOffset = globalTime.valueOf();
});

let defaultLength = 4.0;
let defaultTransitionTime = 1.0;
let selectedSequenceItem = undefined;

function addItemToSequence(file, texture, imgData) {
    sequenceImages.push(
        {
            name:file.name,
            texture:texture,
            imgData:imgData,
            startTime:getTotalSequenceLength(),
            length:defaultLength,
            id:sequenceImages.length,
            transitionType: 0,
            transitionTime: defaultTransitionTime
        }
    );

    createNewSequenceItem(file.name, imgData, defaultLength, sequenceImages.length - 1);
    document.getElementById("sequenceLengthValue").innerHTML = getTotalSequenceLength();
}

function updateTimeline() {
    for(let i = 0; i < sequenceImages.length; i++) {
        let curTexture = sequenceImages[i];
        createNewSequenceItem(curTexture.name, curTexture.imgData, curTexture.length, curTexture.transitionTime, i);
    }
    document.getElementById("sequenceLengthValue").innerHTML = getTotalSequenceLength();
}

function createNewSequenceItem(name, imgData, length, transitionTime, sequenceIndex) {
    let newSequenceItem = document.createElement("div");
    let sequenceThumbnail = document.createElement("img")
    let sequenceItemName = document.createElement("p");
    newSequenceItem.className = "sequenceItemPlaceholder";
    newSequenceItem.style.background = `linear-gradient(to right, rgb(169, 78, 255) ${((length - transitionTime) / length) * 100}%, rgb(41, 0, 79))`
    //newSequenceItem.style.background = `rgb(169, 78, 255)`
    newSequenceItem.style.width = length * pixelsPerSecond;
    sequenceItemName.innerHTML = name;
    sequenceItemName.className = "sequenceItemName";
    sequenceThumbnail.src = imgData;
    sequenceThumbnail.className = "sequenceThumbnail";
    newSequenceItem.id = sequenceIndex;
    newSequenceItem.appendChild(sequenceItemName);
    newSequenceItem.appendChild(sequenceThumbnail);
    //newSequenceItem.appendChild(createTransitionSelection(sequenceIndex));
    document.getElementById("sequencerTimeline").appendChild(newSequenceItem);
    newSequenceItem.addEventListener("click", setSelectedSequenceItem);
}

function createTransitionSelection(sequenceItemId) {
    let transitionSelectionDropdown = document.createElement("div");
    let transitionSelectionInput = document.createElement("select");
    transitionSelectionInput.id = sequenceItemId;
    transitionSelectionInput.addEventListener("change", updateSequenceItemTransition);
    for(let i = 0; i < transitionOptions.length; i++) {
        let optionName = transitionOptions[i];
        let optionElement = document.createElement("option");
        optionElement.value = i;
        optionElement.innerHTML = optionName
        transitionSelectionInput.appendChild(optionElement);
    }
    transitionSelectionDropdown.appendChild(transitionSelectionInput);
    return transitionSelectionDropdown;
}

document.getElementById("transitionSelectionInput").addEventListener("change", updateSequenceItemTransition);

function updateSequenceItemTransition(e) {
    console.warn(e.target.value);
    selectedSequenceItem.transitionType = +(e.target.value);
}

function setSelectedSequenceItem(e) {
    if(selectedSequenceItem) {
        document.getElementById(`${selectedSequenceItem.id}`).classList.remove("selected");
    }
    console.warn(e.target.id);
    selectedSequenceItem = sequenceImages[+(e.target.id)]
    document.getElementById(`${e.target.id}`).classList.add("selected");
    updateClipNameLabel(selectedSequenceItem.name);
    updateClipLengthInputValue(selectedSequenceItem.length);
}

function updateClipNameLabel(name) {
    document.getElementById("clipNameLabel").innerHTML=name;
}

function updateClipLengthInputValue(length) {
    document.getElementById("clipLengthInput").value = +(length);
}

document.getElementById("clipLengthInput").addEventListener("change", function(e) {
    updateClipLength(+(e.target.value));
})

function updateClipLength(length) {
    selectedSequenceItem.length = length;
    refreshAllStartTimes();
}

function refreshAllStartTimes() {
    let curSequenceLength = 0.0;
    for(let i = 0; i < sequenceImages.length; i++) {
        curSequenceLength+=sequenceImages[i].length;
        if(i == 0) continue;
        sequenceImages[i].startTime = curSequenceLength;
    }
    document.getElementById("sequencerTimeline").innerHTML = '';
    redrawSequenceMarker();
    updateTimeline();
}

function redrawSequenceMarker() {
    let marker = document.createElement("div");
    marker.id="sequenceMarker";
    marker.style.left = 30 + (globalTime * pixelsPerSecond) + getSequencerOffset();
    document.getElementById("sequencerTimeline").appendChild(marker);
}

document.getElementById("exportButton").addEventListener("click", function(e) {
    exportGif();
});

function exportGif() {
    globalTime = 0;
    document.getElementById("sequenceMarker").style.left = 30 + (globalTime * pixelsPerSecond) + getSequencerOffset();
    isPlaying = false;
    gifProcessing = true;
    const canvas = document.querySelector("#gl-canvas");

    let frames = 100;
    let totalSequenceLength = getTotalSequenceLength();

    needCapture = true;
    requestedCaptureFrames = frames;

    // render to blob, add to gif
    // update global time
    // render to blob

    // create gift
}