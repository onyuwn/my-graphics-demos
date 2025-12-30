import { initBuffers } from "./initbuffers.js";
import { drawScene } from "./drawscene.js";
import GIF from "gif.js.optimized";
import { select } from "three/tsl";

const MAX_LAYERS = 4;

const vertexShaderSource = `
    attribute vec2 aTextureCoord;
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        //gl_Position = uProjectionMatrix * vec4(aVertexPosition.xy, 0.0, 1.0);
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
    uniform vec3 colorThreshold;

    uniform float fadeInTransitionTime;
    uniform int fadeInTransitionType;

    uniform sampler2D uSampler;

    vec2 random2( vec2 p ) {
        return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }

    void main() {
        vec2 uv = vec2(vTextureCoord.x, 1.0 - vTextureCoord.y);
        gl_FragColor = texture2D(uSampler, uv);
        float transitionStart = (sequenceItemStartTime + sequenceItemLength) - transitionTime;
        if(time >= transitionStart) {
            if(transitionType == 1)
            {
                gl_FragColor.a -= (time - transitionStart) / transitionTime;
                //gl_FragColor *= cos(time * 10.0);
            }
            else if(transitionType == 2) {
                gl_FragColor *= (random2(vTextureCoord + time).x - (time - transitionStart));
            } else if(transitionType == 3 && time >= (transitionStart - .25)) { // not sure why minus a quatrter
                vec2 cPos = -1.0 + 2.0 * uv;
                // distance of current pixel from center
                float cLength = length(cPos);
                vec2 newUv = uv+(cPos/cLength)*cos(cLength*12.0-time*4.0) * 0.03;
                gl_FragColor = texture2D(uSampler,newUv);
                gl_FragColor.a -= (time - transitionStart) / transitionTime;
            } else if(transitionType == 4) { // erase color increase threshold over time until black
                vec4 diffuse = texture2D(uSampler,uv);
                float rDiff = abs(diffuse.r - colorThreshold.r);
                float gDiff = abs(diffuse.g - colorThreshold.g);
                float bDiff = abs(diffuse.b - colorThreshold.b);
                float rThreshold = (time - transitionStart) / transitionTime;
                float gThreshold = (time - transitionStart) / transitionTime;
                float bThreshold = (time - transitionStart) / transitionTime;
                if(rDiff < rThreshold && gDiff < gThreshold && bDiff < bThreshold) {
                    discard;
                } else {
                    gl_FragColor = diffuse;
                }  
            }
        } else if(time >= sequenceItemStartTime && fadeInTransitionType > 0 && fadeInTransitionTime > 0.0) {
            float fadeInEnd = sequenceItemStartTime + fadeInTransitionTime;
            if(fadeInTransitionType == 1) {
                gl_FragColor.a = time / fadeInEnd;
            } else if(fadeInTransitionType == 2) {
                gl_FragColor *= (random2(vTextureCoord + time).x * (time / fadeInEnd));
            } else if(fadeInTransitionType == 3 && (time / fadeInEnd) < 1.0) { // not sure why minus a quatrter
                vec2 cPos = -1.0 + 2.0 * uv;
                // distance of current pixel from center
                float cLength = length(cPos);
                vec2 newUv = uv+(cPos/cLength)*cos(cLength*12.0-time*4.0) * 0.03;
                gl_FragColor = texture2D(uSampler,newUv);
                gl_FragColor.a = (time / fadeInEnd);
            }
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
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      }
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    };
    return texture;
}

let sequenceLength = 10; // total time in s? ig this will just be sum of frames?
let sequence = [[],[],[],[]]; //{image:"src", length:"0.0", shader:"", size:[], position:[]}

let glContext = undefined;
let globalTime = 0;
let globalTimeOffset = 0; // used to restart when start/stop?
let isPlaying = false;
let pixelsPerSecond = 25;
let transitionOptions = ["cut", "fade", "disolve"];

let needCapture = false;
let requestedCaptureFrames = 100;
let finalFrames = [];
let gifProcessing = false;
let gifRendering = false;

let outGif = new GIF({
    workers: 1,
    quality: 10,
    width:256,
    height:256,
    workerScript: '/my-graphics-demos/gif/gif.worker.js'
});

let frameRate = 15;

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
            colorThreshold: gl.getUniformLocation(shaderProgram, "colorThreshold"),
            fadeInTransitionTime: gl.getUniformLocation(shaderProgram, "fadeInTransitionTime"),
            fadeInTransitionType: gl.getUniformLocation(shaderProgram, "fadeInTransitionType"),
        }
    }
    const buffers = initBuffers(gl);
    const texture = loadTexture(gl, "/my-graphics-demos/ceiling1.png");
    const texture2 = loadTexture(gl, "/my-graphics-demos/sky.png");
    // sequence[0].push({name:"test1",
    //                      texture:texture,
    //                      startTime:0.0,
    //                      length:4.0,
    //                      id: "1-0", transitionType: 0, transitionTime: 1.0, clipLayer: 1,
    //                      fadeInTransitionType: 0,
    //                      fadeInTransitionTime: 0});
    sequence[0].push({name:"test2",
                         texture:texture2,
                         startTime:0,
                         length:4.0,
                         id: "1-0",
                         transitionType: 1, transitionTime: 1.0, clipLayer: 1,
                         fadeInTransitionType: 0,
                         fadeInTransitionTime: 0,
                         clipType:"image"});
    updateTimeline();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    let then = 0;

    outGif.on('progress', function(progress) {
        console.warn("progress")
        console.warn(progress);

        let progressBarSearch = document.getElementById("viewport");

        if(progressBarSearch) {
            //progressBarSearch.style.background=`radial-gradient(circle at center, rgb(169, 78, 255) ${progress * 100}%, url('/my-graphics-demos/uipamnel1.png') ${100 - (progress * 100)}%)`;
            progressBarSearch.style.background = `radial-gradient(circle at center, rgb(25, 255, 0) ${progress * 100}%, transparent ${100 - (progress * 100)}%), url('/my-graphics-demos/uipamnel1.png') 100% center / cover`
        } else {
            let newProgressBar = document.createElement("div");
            newProgressBar.id = "exportProgressBar";
            document.getElementById("viewport").appendChild(newProgressBar);
        }

    });
    outGif.on('finished', function(blob) {
        console.warn("GIFF");
        window.open(URL.createObjectURL(blob));
        gifRendering = false;
        needCapture = false;
        gifProcessing = false;
        document.getElementById("sequencerStartStop").disabled = false;
        document.getElementById("sequencerRestart").disabled = false;
    });

    function render(now) {
        now *= 0.001; // convert to seconds
        deltaTime = now - then;
        then = now;

        if(isPlaying && gifProcessing == false) {
            globalTime = now - globalTimeOffset;
            updateSequenceMarkerPosition();
        } else if(gifProcessing == false) {
            globalTimeOffset = now;
        }
    
        if(gifProcessing == false) {
            drawScene(gl, programInfo, buffers, sequence, globalTime, deltaTime);
        }
        document.getElementById("timeValue").innerHTML = globalTime.toFixed(4);

        if(needCapture == true) {
            needCapture = false;
            drawScene(gl, programInfo, buffers, sequence, globalTime, deltaTime);
            if(finalFrames.length < requestedCaptureFrames) {
                canvas.toBlob((blob) => {
                    //window.URL.createObjectURL(blob);
                    finalFrames.push(blob);
                    globalTime = getTotalSequenceLength() * (finalFrames.length / requestedCaptureFrames);
                    const img = new Image();
                    img.src = URL.createObjectURL(blob);

                    img.onload = () => {
                        let frameDelay = (getTotalSequenceLength() * 1000) / requestedCaptureFrames;
                        outGif.addFrame(img, {delay: Math.round(frameDelay)});
                        needCapture = true;
                    }
                });
            }
        } else {
            if(outGif.frames.length >= requestedCaptureFrames && gifRendering == false && gifProcessing == true) {
                gifRendering = true;
                console.warn("GIFF");
                outGif.render();
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

function getTotalSequenceLength() { // update to return longest layer
    let finalMaxLength = 0.0;
    for(let i = 0; i < MAX_LAYERS; i++) {
        let length = 0;
        if(sequence[i].length > 0) {
            for(let j = 0; j < sequence[i].length; j++) { // factor in start time if gaps addeds
                length = sequence[i][j].startTime + sequence[i][j].length;
            }
            if(length > finalMaxLength) {
                finalMaxLength = length;
            }
        }
    }

    return finalMaxLength;
}

function getLayerLength(layerIdx) {
    let total = 0.0;
    for(let i = 0; i < sequence[layerIdx].length; i++) {
        let prevClip = sequence[layerIdx][i - 1];
        let curClip = sequence[layerIdx][i];
        let dClip = 0;
        if(prevClip) {
            dClip = curClip.startTime - total;
        } else if(i == 0 && curClip.startTime > 0) {
            dClip = curClip.startTime;
        }
        total+=sequence[layerIdx][i].length + dClip;
    }
    return total;
}

function getSequencerOffset() {
    let sequencerDiv = document.getElementById("sequencerTimeline");
    return sequencerDiv.offsetLeft;
}

let defaultLength = 4.0;
let defaultTransitionTime = 1.0;
let selectedSequenceItem = undefined;

function addItemToSequence(file, texture, imgData, layer) {
    let newItem = {
        name:file.name,
        texture:texture,
        imgData:imgData,
        startTime:getLayerLength(layer),
        length:defaultLength,
        id:`${layer}-${sequence[layer].length.valueOf()}`,
        transitionType: 0,
        transitionTime: defaultTransitionTime,
        clipLayer: layer + 1,
        clipEffect: 0,
        fadeInTransitionType: 0,
        fadeInTransitionTime: 0,
        clipType: "image" // can be image or gap
    };

    sequence[layer].push(
        newItem
    );

    console.warn(newItem);


    createNewSequenceItem(newItem);
    console.warn(sequence);
    document.getElementById("sequenceLengthValue").innerHTML = getTotalSequenceLength();
    requestedCaptureFrames = frameRate * getTotalSequenceLength();

    let curLayer = document.getElementById(`clipLayer${newItem.clipLayer}`);
    let gridPartsStr = curLayer.style.gridTemplateColumns.split(" "); // issues here with initializing size... clip css uses auto for first grid column
    gridPartsStr.push(`${newItem.length * pixelsPerSecond}px`);
    curLayer.style.gridTemplateColumns = gridPartsStr.join(" ");
}

function updateLayer(layerIdx) { // rebuild layer based on sequence data
    let curLayer = sequence[layerIdx];
    clearClipLayer(layerIdx + 1);
    let curClipLayerElement = document.getElementById(`clipLayer${layerIdx+1}`);
    let clipWidths = curLayer.map(x=>x.length * pixelsPerSecond);
    curClipLayerElement.style.gridTemplateColumns = clipWidths.join("px ") + "px";
    for(let i = 0; i < curLayer.length; i++) {
        let curClip = sequence[layerIdx][i];
        // update grid template string in style
        createNewSequenceItem(curClip);
    }
}

function updateTimeline() { // rebuilds timeline from sequence data
    console.warn("sequence update");
    console.warn(sequence);
    updateSequenceTimelineRuler();
    for(let i = 0; i < MAX_LAYERS; i++) { // call update layer
        if(sequence[i].length > 0) {
            let curClipLayer = document.getElementById(`clipLayer${i+1}`);
            let gridRowsStr = "";
            for(let j = 0; j < sequence[i].length; j++) {
                let curTexture = sequence[i][j];
                let prevClip = undefined;
                let dClip = -1;

                if(j > 0)  {
                    prevClip = sequence[i][j - 1];
                    dClip = curTexture.startTime - (prevClip.length + prevClip.startTime);
                } else {
                    dClip = curTexture.startTime;
                }
                let gapsBefore = getGapsBeforeClip(i, j);
                // add empty column if end of previous does not equal start of next clip
                if(dClip > 0 || (prevClip && prevClip.length + prevClip.startTime < curTexture.startTime)) {
                    gridRowsStr += `${dClip * pixelsPerSecond}px `;
                    gridRowsStr += `${curTexture.length * pixelsPerSecond}px `;
                    curTexture.id = `${i}-${j}`;
                    console.warn("adding gap");
                    createNewSequenceItem(curTexture, true);
                } else {
                    gridRowsStr += `${curTexture.length * pixelsPerSecond}px `;
                    curTexture.id = `${i}-${j}`;
                    createNewSequenceItem(curTexture);
                }
            }
            curClipLayer.style.gridTemplateColumns = gridRowsStr;
        }
    }
    document.getElementById("sequenceLengthValue").innerHTML = getTotalSequenceLength();
}

function updateSequenceTimelineRuler() {
    let ruler = document.getElementById("timelineRuler");
    ruler.innerHTML = ""; 
    let rulerWidth = ruler.offsetWidth;
    let ticks = rulerWidth / pixelsPerSecond;
    console.warn(`${rulerWidth} / ${pixelsPerSecond}`);
    console.warn(ticks);

    // consider scroll pos of timeline too ...
    for(let i = 0; i<ticks; i++) {
        let tickMarkElement = document.createElement("div");
        tickMarkElement.className = "sequenceTimelineRulerTick"; 
        tickMarkElement.style.left = (i+1)*pixelsPerSecond;

        if(i % 5 == 0) {
            let tickLabel = document.createElement("p");
            tickLabel.innerHTML = i.toString();
            tickMarkElement.appendChild(tickLabel);
        }
        ruler.appendChild(tickMarkElement);
        console.warn("tick added");
    }
}

function createNewSequenceItem(sequenceItem, gapBefore = false) {
    let newSequenceItem = document.createElement("div");
    let curLayer = document.getElementById(`clipLayer${sequenceItem.clipLayer}`);
    if(sequenceItem.clipType == "image") {
        let nameThumbnailContainer = document.createElement("div");
        let sequenceThumbnail = document.createElement("img")
        let sequenceItemName = document.createElement("p");
        newSequenceItem.className = "sequenceItemPlaceholder";
        newSequenceItem.style.background = `linear-gradient(to right, rgb(169, 78, 255) ${((sequenceItem.length - sequenceItem.transitionTime) / sequenceItem.length) * 100}%, rgb(41, 0, 79))`;
        sequenceItemName.innerHTML = sequenceItem.name;
        sequenceItemName.className = "sequenceItemName";
        sequenceThumbnail.className = "sequenceThumbnail";
        newSequenceItem.id = sequenceItem.id;
        nameThumbnailContainer.className="clipNameThumbContainer";
        nameThumbnailContainer.appendChild(sequenceItemName);
        nameThumbnailContainer.appendChild(sequenceThumbnail);
        newSequenceItem.appendChild(nameThumbnailContainer);
        let sizeControl = document.createElement("div");
        let frontSizeControl = document.createElement("div");
        sizeControl.className = "lengthController";
        sizeControl.id = `${newSequenceItem.id}-lengthController`;
        sizeControl.addEventListener("mousedown", startClipAdjustment);
        nameThumbnailContainer.addEventListener("mousedown", startClipPositionAdjustment);
        let sequenceItemIdx = +(sequenceItem.id.split("-")[1]);
        newSequenceItem.style.gridColumn = sequenceItemIdx + 1;
        newSequenceItem.appendChild(sizeControl);
        curLayer.appendChild(newSequenceItem);

        newSequenceItem.addEventListener("click", setSelectedSequenceItem);
    } else {
        newSequenceItem.className = "gapPlaceholder";
        newSequenceItem.id = sequenceItem.id;
        let sequenceItemIdx = +(sequenceItem.id.split("-")[1]);
        newSequenceItem.style.gridColumn = sequenceItemIdx + 1;
        curLayer.appendChild(newSequenceItem);
    }
}

function getGapsBeforeClip(layerIdx, clipIdx) {
    let gapCounter = 0; // add this to index when parsing grid template str
    let curClip = sequence[layerIdx][clipIdx];
    for(let i = 0; i < clipIdx + 1; i++) { // stop when we get to current clip
        let prevClip = sequence[layerIdx][i - 1];
        let nextClip = sequence[layerIdx][i];
        if(prevClip && (prevClip.startTime + prevClip.length) < nextClip.startTime) { // compare to next clip not cur clip
            console.warn("gap between");
            gapCounter++;
        } else if(!prevClip && i == 0 && sequence[layerIdx][0].startTime > 0) {
            console.warn("first clip does not start at zero");
            gapCounter++;
        }

        if(i == clipIdx) break;
    }

    return gapCounter;
}

let resizingClip = false;
let movingClip = false;
let gapInserted = false;
let newGap = false; // track if gap was added during move.. cur selected is destroyed and index is updated
let lastClipEndTime = -1;
let resizeStart = 0.0;
let moveStart = 0.0;
let gapsBeforeAdjustment = 0;
let initialGapWidth = 0;
let initialClipStartTime = 0.0;
let initialResizeWidth = 0.0;
let curSelectedClipForResize = undefined;
let curSelectedClipForMove = undefined;

function startClipAdjustment(e) {
    console.warn("STARTING RESIZE");
    resizingClip = true;
    let curX = e.clientX;
    resizeStart = curX;
    curSelectedClipForResize = e.target;
    while(curSelectedClipForResize.className.includes("sequenceItemPlaceholder") == false) {
        curSelectedClipForResize = curSelectedClipForResize.parentElement;
    }
    let parts = curSelectedClipForResize.id.split("-");
    let layerId = parts[0];
    let clipId = parts[1];
    setSelectedSequenceItemInternal(`${layerId}-${clipId}`);
    let curClipElement = document.getElementById(`${layerId}-${clipId}`);
    let curClipLayer = document.getElementById(`clipLayer#${+(layerId) + 1}`);
    let gridParts = curClipElement.parentElement.style.gridTemplateColumns.split(" ");
    gapsBeforeAdjustment = getGapsBeforeClip(layerId, clipId);
    console.warn("gaps before resize: " + gapsBeforeAdjustment);
    initialResizeWidth = +(gridParts[+(clipId) + gapsBeforeAdjustment].replace("px", '')); // change to grid col size
}

function startClipPositionAdjustment(e) {
    console.warn("STARTING MOVE");
    movingClip = true;
    moveStart = e.clientX;
    curSelectedClipForMove = e.target;
    while(curSelectedClipForMove.id.includes("-") == false) {
        curSelectedClipForMove = curSelectedClipForMove.parentElement;
    }
    let curSelectedClipIdx = +(curSelectedClipForMove.id.split("-")[1]);
    let clipLayerIdx = +(curSelectedClipForMove.id.split("-")[0]);
    setSelectedSequenceItemInternal(`${clipLayerIdx}-${curSelectedClipIdx}`);
    let curClip = sequence[clipLayerIdx][curSelectedClipIdx];
    let prevClip = sequence[clipLayerIdx][curSelectedClipIdx - 1];

    if (prevClip && prevClip.clipType == "gap") {
        let curClipLayer = document.getElementById(`clipLayer${clipLayerIdx + 1}`);
        let curGridStr = curClipLayer.style.gridTemplateColumns;
        let gridParts = curGridStr.split(" ");
        initialGapWidth = +(gridParts[curSelectedClipIdx - 1].replace("px", ""));
        lastClipEndTime = prevClip.length + prevClip.startTime;
    }
    initialClipStartTime = curClip.startTime;
    console.warn(`initial clip start: ${initialClipStartTime}`);
    console.warn(`initial gap width: ${initialGapWidth}`);
}

function insertGap(layerIdx, clipIdx) { // clip to insert gap before
    let curClip = sequence[layerIdx][clipIdx];
    let newGap = {
        name:"gap",
        startTime:curClip.startTime,
        length:.01,
        id:`${layerIdx}-${clipIdx}`,
        transitionType: 0,
        transitionTime: defaultTransitionTime,
        clipLayer: layerIdx + 1,
        clipEffect: 0,
        fadeInTransitionType: 0,
        fadeInTransitionTime: 0,
        clipType: "gap" // can be image or gap
    }
    sequence[layerIdx].splice(clipIdx, 0, newGap);
    // update all ids and start times of clips after
    for(let i = clipIdx + 1; i < sequence[layerIdx].length; i++) {
        sequence[layerIdx][i].startTime+=.01;
        sequence[layerIdx][i].id = `${layerIdx}-${i}`;
    }
    updateLayer(layerIdx);
}

document.addEventListener("mousemove", function(e) {
    let curX = e.clientX;
    if(resizingClip == true && curSelectedClipForResize && e.target.id.includes("-") && e.target.id.split("-").length == 3) {
        console.warn(`RESIZING ? GAPSB4 ${gapsBeforeAdjustment}`);
        let parts = curSelectedClipForResize.id.split("-");
        let layerId = parts[0];
        let clipId = parts[1];
        let curClipLayer = document.getElementById(`clipLayer${+(layerId) + 1}`);

        let curGridStr = curClipLayer.style.gridTemplateColumns;
        let gridParts = curGridStr.split(" ");
        let curClipElement = document.getElementById(`${layerId}-${clipId}`);
        let newSize = (curX - resizeStart) + initialResizeWidth;

        gridParts[+(clipId) + gapsBeforeAdjustment] = `${newSize}px`;
        curClipLayer.style.gridTemplateColumns = gridParts.join(" ");
        updateClipLengthInputValue(newSize/pixelsPerSecond);
    } else if(movingClip && curSelectedClipForMove) {
        let curSelectedClipIdx = +(curSelectedClipForMove.id.split("-")[1]);
        let clipLayerIdx = +(curSelectedClipForMove.id.split("-")[0]);

        if(newGap == true) {
            curSelectedClipIdx += 1;
        }

        let curClip = sequence[clipLayerIdx][curSelectedClipIdx];
        let secondsMoved = ((curX - moveStart) / pixelsPerSecond);
        let prevClip = sequence[clipLayerIdx][curSelectedClipIdx - 1];
        console.warn(secondsMoved);
        if(sequence[clipLayerIdx].length >= 1 && secondsMoved > 0 && secondsMoved + initialClipStartTime > lastClipEndTime) {
            console.warn(secondsMoved);
            if(prevClip && prevClip.clipType == "gap") {
                gapInserted = true;
            }
            if(gapInserted == true && prevClip) { // adjust start times and length of gap -- update layer handles grid columns
                curClip.startTime = secondsMoved + .01 + initialClipStartTime;
                if(newGap == true) {
                    prevClip.length = secondsMoved;
                } else {
                    prevClip.length = secondsMoved + (initialGapWidth / pixelsPerSecond); // seconds moved plus initial length
                }
                console.warn("updating layer");
                updateLayer(clipLayerIdx);
            } else if(gapInserted == false) { // this inserts a gap every time....ughh
                console.warn("inserting gap");
                insertGap(clipLayerIdx, curSelectedClipIdx);
                newGap = true;
                gapInserted = true;
                curClip.startTime = secondsMoved + .01;
            }
        }
        updateClipStartTimeInputValue(curClip.startTime);
    }
});

document.addEventListener("mouseup", function(e) {
    if(curSelectedClipForResize) {
        console.warn("completing resize");
        resizingClip = false;
        let parts = curSelectedClipForResize.id.split("-");
        let curClip = sequence[+(parts[0])][+(parts[1])];
        let curClipLayer = document.getElementById(`clipLayer${+(parts[0]) + 1}`);
        let curGridStr = curClipLayer.style.gridTemplateColumns;
        let gridParts = curGridStr.split(" ");
        let pxStr = gridParts[+(parts[1]) + gapsBeforeAdjustment];
        pxStr = pxStr.replace("px", "");
        //curClip.length = +(pxStr) / pixelsPerSecond;
        let curClipElement = document.getElementById(curClip.id);
        //curClipElement.style.width = gridParts[+(parts[1])];
        updateClipLength(+(pxStr) / pixelsPerSecond)
        curSelectedClipForResize = undefined;
        selectedSequenceItem = undefined;
        //updateLayerStartTimes(+(parts[0]))//update start times
    }
    if(curSelectedClipForMove && movingClip == true) {
        movingClip = false;
        gapInserted = false;
        newGap = false;
        curSelectedClipForMove = undefined;
        lastClipEndTime = -1;
        console.warn("MOVE COMPLETE");
    }
});

function updateSequenceItemTransition(e) {
    let transitionType = e.target.value;
    console.warn(e.target.value);
    selectedSequenceItem.transitionType = +(e.target.value);

    if(transitionType == 4) {
        showTransitionStyleSection(transitionType)
    } else {
        hideTransitionStyleSection()
    }
}

function showTransitionStyleSection(transitionType) {
    let transitionStyleSection = document.getElementById("transitionStyleInputSection");
    if(transitionType==4) {
        let inputLabel = document.createElement("p");
        inputLabel.innerHTML = "threshold color"
        let colorPicker = document.createElement("input");
        colorPicker.type="color";
        colorPicker.id="colorThresholdPicker";
        colorPicker.addEventListener("change", function(e) {
            console.warn(e.target.value);
            let hexVal = e.target.value;
            let rgb = hexToRgb(hexVal);
            selectedSequenceItem.colorThreshold = rgb;
            console.warn(selectedSequenceItem.colorThreshold);
        });
        transitionStyleSection.appendChild(inputLabel);
        transitionStyleSection.appendChild(colorPicker);
    }
}

function hexToRgb(hexStr) {
    let hexVal = hexStr.replace("#", '');
    let r = parseInt(hexVal.substring(0, 2), 16);
    let g = parseInt(hexVal.substring(2, 4), 16);
    let b = parseInt(hexVal.substring(4, 6), 16);
    return [r / 255.0, g / 255.0, b / 255.0];
}

function hideTransitionStyleSection() {
    let transitionStyleSection = document.getElementById("transitionStyleInputSection");
    transitionStyleSection.innerHTML = '';
}

function setSelectedSequenceItem(e) {
    if(selectedSequenceItem) {
        document.getElementById(`${selectedSequenceItem.id}`).classList.remove("selected");
    }
    clearSelection();

    let itemId = e.target.id;
    let lastElement = e.target;
    while(!itemId || (itemId && itemId.includes("-") == false)) {
        itemId = lastElement.parentElement.id;
        lastElement = lastElement.parentElement;
        console.warn(itemId);
    }
    
    let selectedItemLayerIndex = 0;
    let selectedItemClipIndex = 0;

    if(itemId.includes("-") == true && itemId.split("-").length == 2) {
        let parts = itemId.split("-");
        selectedItemLayerIndex = +(parts[0]);
        selectedItemClipIndex = +(parts[1]);
        selectedSequenceItem = sequence[selectedItemLayerIndex][selectedItemClipIndex];
        document.getElementById(`${itemId}`).classList.add("selected");
        updateSequenceInspectAttributes(selectedSequenceItem);
    }
}

function setSelectedSequenceItemInternal(id) {
    clearSelection();
    let itemId = id;
    let selectedItemLayerIndex = 0;
    let selectedItemClipIndex = 0;

    if(itemId.includes("-") == true && itemId.split("-").length == 2) {
        let parts = itemId.split("-");
        selectedItemLayerIndex = +(parts[0]);
        selectedItemClipIndex = +(parts[1]);
        selectedSequenceItem = sequence[selectedItemLayerIndex][selectedItemClipIndex];
        document.getElementById(`${itemId}`).classList.add("selected");
        updateSequenceInspectAttributes(selectedSequenceItem);
    }
}

function clearSelection() {
    if(selectedSequenceItem) {
        document.getElementById(`${selectedSequenceItem.id}`).classList.remove("selected");
    }
    selectedSequenceItem = undefined;
    for(let i = 0; i < 5; i++) {
        let layer = document.getElementById(`clipLayer${i+1}`);
        for(const clip of layer.children) {
            clip.classList.remove("selected");
        }
    }
}

function updateSequenceInspectAttributes(sequenceItem) {
    updateClipNameLabel(sequenceItem.name);
    updateClipLengthInputValue(sequenceItem.length);
    updateTransitionTypeInputValue(sequenceItem.transitionType);
    updateTransitionLengthInputValue(sequenceItem.transitionTime);
    updateClipStartTimeInputValue(sequenceItem.startTime);
    updateClipLayerInputValue(sequenceItem.clipLayer);
}

function updateClipNameLabel(name) {
    document.getElementById("clipNameLabel").innerHTML=name;
}

function updateClipLengthInputValue(length) {
    document.getElementById("clipLengthInput").value = +(length);
}

function updateTransitionTypeInputValue(transitionType) {
    document.getElementById("transitionSelectionInput").value=transitionType;
}

function updateTransitionLengthInputValue(transitionTime) {
    document.getElementById("transitionLengthInput").value=transitionTime;
}

function updateClipStartTimeInputValue(startTime) {
    document.getElementById("clipStartTimeInput").value = startTime;
}

function updateClipLayerInputValue(clipLayer) {
    document.getElementById("clipLayerSelection").value = clipLayer;
}

function updateClipLength(length) {
    if(!selectedSequenceItem && curSelectedClipForResize) {
        let parts = curSelectedClipForResize.id.split("-");
        selectedSequenceItem = sequence[+(parts[0])][+(parts[1])];
    }
    console.warn(selectedSequenceItem);
    let delta = length - selectedSequenceItem.length;
    selectedSequenceItem.length = length;
    let clipIdx = +(selectedSequenceItem.id.split("-")[1]);
    console.warn(`updating clip on ${selectedSequenceItem.clipLayer}-${clipIdx}`)
    updateLayerStartTimes(selectedSequenceItem.clipLayer - 1, clipIdx, delta);
    //clearClipLayer(selectedSequenceItem.clipLayer);
    //clearAllClipLayers();
    //updateTimeline();
}

function updateLayerStartTimes(layer, clipIdx, delta) {
    let curLayer = sequence[layer];
    if(curLayer.length > 0) {
        for(let i = 0; i < curLayer.length; i++) {
            if(i > clipIdx) {
                //curLayer[i].startTime = 0;
                curLayer[i].startTime += delta;
            }
        }
    }
    console.warn("start times fixed");
    console.warn(curLayer);
}

function updateSequenceMarkerPosition() { 
    document.getElementById("sequenceMarker").style.left = 30 + (globalTime * pixelsPerSecond) + getSequencerOffset();
}

function redrawSequenceMarker() {
    let marker = document.createElement("div");
    marker.id="sequenceMarker";
    marker.style.left = 30 + (globalTime * pixelsPerSecond) + getSequencerOffset();
    document.getElementById("sequencerTimeline").appendChild(marker);
}

function clearClipLayer(layerId) {
    document.getElementById(`clipLayer${layerId}`).innerHTML = '';
}

function exportGif() {
    globalTime = 0;
    updateSequenceMarkerPosition();
    isPlaying = false;
    gifProcessing = true;
    const canvas = document.querySelector("#gl-canvas");

    let totalSequenceLength = getTotalSequenceLength();

    needCapture = true;
    document.getElementById("sequencerStartStop").disabled = true;
    document.getElementById("sequencerRestart").disabled = true;

    // render to blob, add to gif
    // update global time
    // render to blob

    // create gift
}

document.getElementById("sequenceItemInput").addEventListener("change", function(e) {
    let file = e.target.files[0];
    var reader = new FileReader();

    reader.addEventListener("load", function(e) {
        const newTexture = loadTexture(glContext, e.target.result);
        addItemToSequence(file, newTexture, e.target.result, 0);
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


document.getElementById("transitionSelectionInput").addEventListener("change", updateSequenceItemTransition);

document.getElementById("clipLengthInput").addEventListener("change", function(e) {
    console.warn("updating length");
    updateClipLength(+(e.target.value));
})

document.getElementById("exportButton").addEventListener("click", function(e) {
    exportGif();
});

document.getElementById("timelineHorizontalScale").addEventListener("input", function(e) {
    console.warn(e.target.value);
    pixelsPerSecond = +(e.target.value);
    clearClipLayer(1);
    updateTimeline();
});

document.getElementById("removeClipButton").addEventListener("click", function(e) {
    sequence[selectedSequenceItem.clipLayer - 1].splice(+(selectedSequenceItem.id.split("-")[1]), 1);
    selectedSequenceItem = undefined;
    clearClipLayer(1);
    updateTimeline();
    refreshAllStartTimes();
    requestedCaptureFrames = frameRate * getTotalSequenceLength();
});

document.getElementById("frameRateInput").addEventListener("change", function(e) {
    frameRate = +(e.target.value);
    requestedCaptureFrames = frameRate * getTotalSequenceLength();
});

document.getElementById("outputWidthInput").addEventListener("change", function(e) {
    outGif.setOption("width", +(event.target.value));
    document.getElementById("gl-canvas").style.width = `${e.target.value}px`;
});

document.getElementById("viewportScale").addEventListener("input", function(e) {
    document.getElementById("gl-canvas").style.width = `${+(e.target.value) * 256}px`;
});

document.getElementById("clipLayerSelection").addEventListener("change", function(e) {
    if(selectedSequenceItem) {
        let parts = selectedSequenceItem.id.split("-");
        let layerIdx = parts[0];
        let clipIdx = +(selectedSequenceItem.id.split("-")[1]);
        console.warn(sequence[selectedSequenceItem.clipLayer - 1])
        let removed = sequence[selectedSequenceItem.clipLayer - 1].splice(clipIdx, 1);
        selectedSequenceItem.clipLayer = +(event.target.value);
        sequence[+(event.target.value) - 1].push(removed[0]);
        clearAllClipLayers();
        updateLayerStartTimes(layerIdx, clipIdx, -selectedSequenceItem.length); // once for old layer
        updateLayerStartTimes(+(event.target.value), clipIdx, selectedSequenceItem.length); // again for new layer
        updateTimeline();
    }
});

document.getElementById("clipStartTimeInput").addEventListener("change", function(e) {
    if(selectedSequenceItem) {
        selectedSequenceItem.startTime = +(e.target.value);
        clearAllClipLayers();
        updateTimeline();
    }
});

document.getElementById("transitionLengthInput").addEventListener("change", function(e) {
    if(selectedSequenceItem) {
        selectedSequenceItem.transitionTime = +(e.target.value)
    }
});

document.getElementById("fadeInSelectionInput").addEventListener("change", function(e) {
    if(selectedSequenceItem) {
        selectedSequenceItem.fadeInTransitionType = +(e.target.value)
    }
});

document.getElementById("fadeInLengthInput").addEventListener("change", function(e) {
    if(selectedSequenceItem) {
        selectedSequenceItem.fadeInTransitionTime = +(e.target.value)
    }
});

function clearAllClipLayers() {
    for(let i = 1; i < 5; i++) {
        clearClipLayer(i);
    }
}

var tl = document.getElementById("sequencerTimeline");
tl.scrollTop = tl.scrollHeight;