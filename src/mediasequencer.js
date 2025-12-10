import { initBuffers } from "./initbuffers.js";
import { drawScene } from "./drawscene.js";
import GIF from "gif.js.optimized";

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
                         fadeInTransitionTime: 0});
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
        total+=sequence[layerIdx][i].length;
    }
    return total;
}

function getSequencerOffset() {
    let sequencerDiv = document.getElementById("sequencerTimeline");
    return sequencerDiv.offsetLeft;
}

let defaultLength = 2.0;
let defaultTransitionTime = 1.0;
let selectedSequenceItem = undefined;

function addItemToSequence(file, texture, imgData, layer) {
    console.warn(sequence);
    console.warn(`sequencelenfght: ${sequence.length}`);

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
        fadeInTransitionTime: 0
    };

    sequence[layer].push(
        newItem
    );

    createNewSequenceItem(newItem);
    document.getElementById("sequenceLengthValue").innerHTML = getTotalSequenceLength();
    requestedCaptureFrames = frameRate * getTotalSequenceLength();

    let curLayer = document.getElementById(`clipLayer${newItem.clipLayer}`);
    let gridPartsStr = curLayer.style.gridTemplateColumns.split(" ");
    gridPartsStr.push(`${newItem.length * pixelsPerSecond}px`);
    curLayer.style.gridTemplateColumns = gridPartsStr.join(" ");
}

function updateTimeline() {
    console.warn("sequence update");
    console.warn(sequence);
    for(let i = 0; i < MAX_LAYERS; i++) {
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
                }

                // add empty column if end of previous does not equal start of next clip
                if(prevClip && prevClip.length + prevClip.startTime < curTexture.startTime) {
                    let delta = curTexture.startTime - (prevClip.length + prevClip.startTime);
                    gridRowsStr += `${delta * pixelsPerSecond}px `;
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

function createNewSequenceItem(sequenceItem, gapBefore = false) {
    let newSequenceItem = document.createElement("div");
    let nameThumbnailContainer = document.createElement("div");
    let sequenceThumbnail = document.createElement("img")
    let sequenceItemName = document.createElement("p");
    newSequenceItem.className = "sequenceItemPlaceholder";
    newSequenceItem.style.background = `linear-gradient(to right, rgb(169, 78, 255) ${((sequenceItem.length - sequenceItem.transitionTime) / sequenceItem.length) * 100}%, rgb(41, 0, 79))`
    //newSequenceItem.style.width = sequenceItem.length * pixelsPerSecond;
    //newSequenceItem.style.left = (sequenceItem.startTime * pixelsPerSecond) + 30 + getSequencerOffset();
    sequenceItemName.innerHTML = sequenceItem.name;
    sequenceItemName.className = "sequenceItemName";
    //sequenceThumbnail.src = sequenceItem.imgData;
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
    if(gapBefore == true) {
        newSequenceItem.style.gridColumn = +(sequenceItem.id.split("-")[1]) + 2;
    } else {
        newSequenceItem.style.gridColumn = +(sequenceItem.id.split("-")[1]) + 1;
    }
    //sizeControl.addEventListener("mouseup", endClipAdjustment);
    newSequenceItem.appendChild(sizeControl);
    let curLayer = document.getElementById(`clipLayer${sequenceItem.clipLayer}`)
    curLayer.appendChild(newSequenceItem);
    
    // let gridPartsStr = curLayer.style.gridTemplateColumns;
    // gridPartsStr.push(`${sequence.length * pixelsPerSecond}px`);
    // curLayer.style.gridTemplateColumns = gridPartsStr.join(" ");

    newSequenceItem.addEventListener("click", setSelectedSequenceItem);
}

function getGapsBeforeClip(layerIdx, clipIdx) {
    let gapCounter = 0; // add this to index when parsing grid template str
    let curClip = sequence[layerIdx][clipIdx];
    for(let i = 0; i < clipIdx + 1; i++) { // stop when we get to current clip
        if(i == 0) continue;
        let prevClip = sequence[layerIdx][i - 1];
        if((prevClip.startTime + prevClip.length) < curClip.startTime) { 
            gapCounter++;
        }

        if(i == clipIdx) break;
    }

    return gapCounter;
}

let resizingClip = false;
let movingClip = false;
let gapInserted = false;
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
    let parts = curSelectedClipForResize.id.split("-");
    let layerId = parts[0];
    let clipId = parts[1];
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
    console.warn(curSelectedClipForMove);
    let curSelectedClipIdx = +(curSelectedClipForMove.id.split("-")[1]);
    let clipLayerIdx = +(curSelectedClipForMove.id.split("-")[0]);
    console.warn(`${curSelectedClipIdx}-${clipLayerIdx}`);
    let curClip = sequence[clipLayerIdx][curSelectedClipIdx];
    gapsBeforeAdjustment = getGapsBeforeClip(clipLayerIdx, curSelectedClipIdx);
    if(gapsBeforeAdjustment > 0) {
        let curClipLayer = document.getElementById(`clipLayer${clipLayerIdx + 1}`);
        let curGridStr = curClipLayer.style.gridTemplateColumns;
        let gridParts = curGridStr.split(" ");
        initialGapWidth = +(gridParts[((curSelectedClipIdx) + gapsBeforeAdjustment) - 1].replace("px", ""));
    }
    initialClipStartTime = curClip.startTime;
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
    } else if(movingClip && curSelectedClipForMove) {
        let curSelectedClipIdx = +(curSelectedClipForMove.id.split("-")[1]);
        let clipLayerIdx = +(curSelectedClipForMove.id.split("-")[0]);
        let curClipLayer = document.getElementById(`clipLayer${clipLayerIdx + 1}`);
        let curGridStr = curClipLayer.style.gridTemplateColumns;
        let gridParts = curGridStr.split(" ");
        let curClip = sequence[clipLayerIdx][curSelectedClipIdx];
        let secondsMoved = ((curX - moveStart) / pixelsPerSecond) + initialClipStartTime;

        if(curSelectedClipIdx > 0) {
            let prevClip = sequence[clipLayerIdx][curSelectedClipIdx - 1];
            console.warn(`${(prevClip.startTime + prevClip.length)} < ${curClip.startTime} ? GAPSB4 ${gapsBeforeAdjustment} CLIP ${curSelectedClipIdx} GAP ${initialGapWidth} SECONDS ${secondsMoved}`)
            if(((prevClip.startTime + prevClip.length) < curClip.startTime) || gapInserted == true) { // gap exists before clip
                //gapsBeforeAdjustment is all gaps between clips before selected clip -- will help to get you the current index of selected inside of the grid template string
                // let curGap = +(gridParts[(curSelectedClipIdx) + gapsBeforeAdjustment].replace("px", ''));
                gridParts[((curSelectedClipIdx) + gapsBeforeAdjustment) - 1] = `${(curX - moveStart) + initialGapWidth}px`;
                curClipLayer.style.gridTemplateColumns = gridParts.join(" ");
            } else if(gapInserted == false) { // this inserts a gap every time....ughh
                gapInserted = true;
                gridParts.splice(curSelectedClipIdx, 0, `${secondsMoved}px`);
                console.warn(`GAP INSERTED: ${secondsMoved}`);
                console.warn(gridParts);
                curClipLayer.style.gridTemplateColumns = gridParts.join(" ");
                curSelectedClipForMove.style.gridColumn = +(curSelectedClipForMove.style.gridColumn) + 1; 
            }
            curClip.startTime = secondsMoved + .01;
            gapsBeforeAdjustment = getGapsBeforeClip(clipLayerIdx, curSelectedClipIdx);
        } else if(sequence[clipLayerIdx].length == 1) {

        }
        // clearAllClipLayers();
        // updateTimeline();
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
        curClip.length = +(pxStr) / pixelsPerSecond;
        let curClipElement = document.getElementById(curClip.id);
        //curClipElement.style.width = gridParts[+(parts[1])];
        curSelectedClipForResize = undefined;
        updateLayerStartTimes(+(parts[0]))//update start times
    }
    if(curSelectedClipForMove && movingClip == true) {
        movingClip = false;
        gapInserted = false;
        console.warn("MOVE COMPLETE");
    }
    gapsBeforeAdjustment = 0;
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

    let itemId = e.target.id;
    if(!itemId || (itemId && itemId.split("-").length == 0)) {
        let parentId = e.target.parentElement.id;
        console.warn(parentId);
        itemId = parentId;
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
    selectedSequenceItem.length = length;
    updateLayerStartTimes(selectedSequenceItem.clipLayer - 1);
    clearClipLayer(selectedSequenceItem.clipLayer)
    updateTimeline();
}

function updateLayerStartTimes(layer) {
    let curLayer = sequence[layer];
    if(curLayer.length > 0) {
        let curLayerLength = 0;
        for(let i = 0; i < curLayer.length; i++) {
            if(i == 0) {
                curLayer[i].startTime = 0;
                curLayerLength = curLayer[i].length;
            } else {
                let diff = curLayer[i].startTime - curLayerLength;
                curLayer[i].startTime += diff;
                curLayerLength += curLayer[i].length + diff; // still not right
            }
        }
    }
    console.warn("start times fixed");
    console.warn(curLayer);
}

function refreshAllStartTimes() { // todo how to handle layers?
    console.warn("refreshing starttimes");
    for(let i = 0; i < MAX_LAYERS; i++) {
        updateLayerStartTimes(i);
    }
    clearAllClipLayers(0);
    updateTimeline();
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
        let clipIdx = +(selectedSequenceItem.id.split("-")[1]);
        console.warn(sequence[selectedSequenceItem.clipLayer - 1])
        let removed = sequence[selectedSequenceItem.clipLayer - 1].splice(clipIdx, 1);
        selectedSequenceItem.clipLayer = +(event.target.value);
        sequence[+(event.target.value) - 1].push(removed[0]);
        clearAllClipLayers();
        refreshAllStartTimes();
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