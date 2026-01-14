import { initBuffers } from "./initbuffers.js";
import { drawScene } from "./drawscene.js";
import { initShaderProgram, loadShader, isPowerOf2, loadTexture, setPositionAttribute, setTextureAttribute, hexToRgba } from "./myglutils";
import { mandelBrotFragShader, basicVertShader } from "./shaders.js";
import GIF from "gif.js.optimized";

let glContext = undefined;
let fractalFormData = {
    fractalType:0,
    fractalInitialZoom: 0.0125,
    fractalX: -.95,
    fractalY: -.25,
    canvasDims: [350 ,350],
    fractalColors: [], // rgba sets
    fractalTexture: undefined, // actual final texture
    fractalColorCount: 0,
    effectsOn: 0,
    fractalPrecision: 100
}
let captureRequested = false;

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

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const shaderProgram = initShaderProgram(gl, basicVertShader, mandelBrotFragShader);
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
            fractalX: gl.getUniformLocation(shaderProgram, "fractalX"),
            fractalY: gl.getUniformLocation(shaderProgram, "fractalY"),
            fractalInitialZoom: gl.getUniformLocation(shaderProgram, "fractalInitialZoom"),
            canvasRes: gl.getUniformLocation(shaderProgram, "canvasRes"),
            fractalTexture: gl.getUniformLocation(shaderProgram, "fractalTexture"),
            colorCount: gl.getUniformLocation(shaderProgram, "colorCount"),
            effectsOn: gl.getUniformLocation(shaderProgram, "effectsOn"),
            fractalPrecision: gl.getUniformLocation(shaderProgram, "fractalPrecision"),
        }
    };
    initializeFractalForm();
    console.warn(fractalFormData.fractalColors);
    fractalFormData.fractalTexture = loadTexture(glContext, fractalFormData.colorCount, 1, new Uint8Array([255,255,255,255]));
    const buffers = initBuffers(gl);
    updateCanvasSize();
    function render(now) {
        now *= 0.001; // convert to seconds

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        const projectionMatrix = mat4.create();
        mat4.ortho(projectionMatrix, -1 , 1, -1 , 1, .1, 100);
        gl.depthMask(false);
        drawPlane(gl, projectionMatrix, programInfo, buffers, {x:0, y:0}, 1, now, fractalFormData.fractalTexture);
        gl.depthMask(true);
        
        if(captureRequested) {
            document.getElementById("gl-canvas").toBlob(x=>{
                console.warn("blob");
                let url = URL.createObjectURL(x);
                let downloadButton = document.createElement("a");
                //window.open(URL.createObjectURL(x));
                downloadButton.href = url;
                downloadButton.download = `jakehsequencer${new Date(Date.now()).toISOString().replace(":","")}.png`;
                downloadButton.click();
            }, 'image/png');
            captureRequested = false;
        }

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
main();

function drawPlane(gl, projection, programInfo, buffers, position, layer, time, texture) {
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [position.x, position.y, -.1 * layer]);

    setPositionAttribute(gl, buffers, programInfo);
    setTextureAttribute(gl, buffers, programInfo);

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projection,
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix,
    );
    if(texture) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
    } else {
        console.warn("no texstrue");
    }
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
    gl.uniform1f(programInfo.uniformLocations.time, time);
    gl.uniform1f(programInfo.uniformLocations.fractalX, fractalFormData.fractalX);
    gl.uniform1f(programInfo.uniformLocations.fractalY, fractalFormData.fractalY);
    gl.uniform1f(programInfo.uniformLocations.fractalInitialZoom, fractalFormData.fractalInitialZoom);
    gl.uniform2f(programInfo.uniformLocations.canvasRes, fractalFormData.canvasDims[0], fractalFormData.canvasDims[1]);
    gl.uniform1i(programInfo.uniformLocations.fractalTexture, 0);
    gl.uniform1i(programInfo.uniformLocations.colorCount, fractalFormData.fractalColorCount);
    gl.uniform1i(programInfo.uniformLocations.effectsOn, fractalFormData.effectsOn);
    gl.uniform1i(programInfo.uniformLocations.fractalPrecision, fractalFormData.fractalPrecision);

    {
        const offset = 0;
        const vertexCount = 6;
        gl.drawArrays(gl.TRIANGLES, offset, vertexCount);
    }
}

function initializeFractalForm(fractalType) {
    let formContainer = document.getElementById("fractalForm");
    formContainer.innerHTML = "";

    let fractalCoordsContainer = document.createElement("div");
    fractalCoordsContainer.style.display="flex";
    fractalCoordsContainer.style.alignItems="center";
    fractalCoordsContainer.style.justifyContent="space-between";
    let initialZoomContainer = document.createElement("div");
    initialZoomContainer.style.display="flex";
    initialZoomContainer.style.alignItems="center";
    initialZoomContainer.style.justifyContent="space-between";
    let fadeContainer = document.createElement("div");
    fadeContainer.style.display="flex";
    fadeContainer.style.alignItems="center";

    let coordsInputLabel = document.createElement("p");
    coordsInputLabel.innerHTML="Fractal Coords";
    let fractalXInput = document.createElement("input");
    fractalXInput.type="number";
    fractalXInput.id="fractalXInput";
    fractalXInput.value = fractalFormData.fractalX;
    fractalXInput.step="any";

    let fractalYInput = document.createElement("input");
    fractalYInput.type="number";
    fractalYInput.id="fractalYInput";
    fractalYInput.value = fractalFormData.fractalY;
    fractalYInput.step="any";

    fractalCoordsContainer.appendChild(coordsInputLabel);
    fractalCoordsContainer.appendChild(fractalXInput);
    fractalCoordsContainer.appendChild(fractalYInput);

    let zoomInputLabel = document.createElement("p");
    zoomInputLabel.innerHTML="Zoom";
    let fractalZoomInput = document.createElement("input");
    fractalZoomInput.type="number";
    fractalZoomInput.id="fractalZoomInput";
    fractalZoomInput.value = fractalFormData.fractalInitialZoom;
    fractalZoomInput.step="any";

    let precisionInputsContainer = document.createElement("div");
    precisionInputsContainer.id = "precisionInputsContainer";
    precisionInputsContainer.style.display="flex";
    precisionInputsContainer.style.justifyContent="space-between";
    let precisionLabel = document.createElement("p");
    precisionLabel.innerHTML = "Precision";
    let precisionSlider = document.createElement("input");
    precisionSlider.min = 10;
    precisionSlider.value = 100;
    precisionSlider.max = 10000;
    precisionSlider.step = .1;
    precisionSlider.id = "fractalPrecisionSlider";
    precisionSlider.type="range";
    let precisionInput = document.createElement("input");
    precisionInput.id = "fractalPrecisionInput";
    precisionInput.type="number";
    precisionInput.value=100
    precisionInputsContainer.appendChild(precisionLabel);
    precisionInputsContainer.appendChild(precisionSlider);
    precisionInputsContainer.appendChild(precisionInput);

    precisionSlider.addEventListener("input", function(e) {
        precisionInput.value = +(e.target.value);
        fractalFormData.fractalPrecision = +(e.target.value);
    });

    precisionInput.addEventListener("change", function(e) {
        fractalFormData.fractalPrecision = +(e.target.value);
    });

    formContainer.appendChild(precisionInputsContainer);

    formContainer.appendChild(fractalCoordsContainer);
    initialZoomContainer.appendChild(zoomInputLabel);
    initialZoomContainer.appendChild(fractalZoomInput);
    formContainer.appendChild(initialZoomContainer);

    fractalXInput.addEventListener("change", function(e) {
        fractalFormData.fractalX = +(e.target.value);
        console.warn(fractalFormData);
    });
    fractalYInput.addEventListener("change", function(e) {
        fractalFormData.fractalY = +(e.target.value);
        console.warn(fractalFormData);
    });
    fractalZoomInput.addEventListener("change", function(e) {
        fractalFormData.fractalInitialZoom = +(e.target.value);
        console.warn(fractalFormData);
    });

    let canvas = document.getElementById("gl-canvas");
    fractalFormData.canvasDims = [canvas.offsetWidth, canvas.offsetHeight];

    let colorList = document.createElement("div");
    colorList.id="fractalColorList";
    colorList.style.height="auto";
    let colorControlsContainer = document.createElement("div");
    colorControlsContainer.style.display="flex";
    colorControlsContainer.style.alignItems="center";
    colorControlsContainer.style.justifyContent="space-between";
    colorControlsContainer.id="colorControlsContainer";
    let colorPicker = document.createElement("input");
    colorPicker.type="color";
    let colorPickerLabel = document.createElement("p");
    colorPickerLabel.innerHTML="add color";

    colorControlsContainer.appendChild(colorPickerLabel);
    colorControlsContainer.appendChild(colorPicker);
    formContainer.appendChild(colorControlsContainer);
    formContainer.appendChild(colorList);
    colorPicker.addEventListener("change", function(e) {
        let colorListContainer = document.getElementById("fractalColorList");
        let newColorRGB = hexToRgba(e.target.value);
        let increaseCount = false;
        for(let i = 0; i < newColorRGB.length; i++) {
            let idx = i + (fractalFormData.fractalColorCount * 4);
            if(fractalFormData.fractalColors[idx]) {
                fractalFormData.fractalColors[idx] = newColorRGB[i];
            } else {
                fractalFormData.fractalColors.push(newColorRGB[i]);
                increaseCount = true;
            }
        }
        fractalFormData.fractalColorCount++;
        fractalFormData.fractalTexture = loadTexture(glContext, fractalFormData.colorCount, 1, new Uint8Array(fractalFormData.fractalColors));
        let fractalColorEntry = document.createElement("div");
        fractalColorEntry.style.background = e.target.value;
        fractalColorEntry.style.height="10px";
        colorListContainer.appendChild(fractalColorEntry);
        console.warn(fractalFormData);
    });

    let exportButton = document.createElement("button");
    exportButton.innerHTML = "save image";
    exportButton.className="controlButton";
    formContainer.appendChild(exportButton);
    exportButton.addEventListener("click", function(e) {
        captureRequested = true;
    });
}

window.addEventListener("resize", function(e) {
    updateCanvasSize();
});

function updateCanvasSize() {
    let canvas = document.getElementById("gl-canvas");
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    fractalFormData.canvasDims = [displayWidth, displayHeight];
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
    glContext.viewport(0,0,displayWidth, displayHeight);
}

document.getElementById("effectsToggle").addEventListener("change", function(e) {
    fractalFormData.effectsOn = e.target.checked == true ? 1 : 0;
});

document.getElementById("zoomInButton").addEventListener("mousedown", function(e) {
    fractalFormData.fractalInitialZoom -= .0001;
});

document.getElementById("zoomOutButton").addEventListener("mousedown", function(e) {
    fractalFormData.fractalInitialZoom += .0001;
});

document.getElementById("moveLeftButton").addEventListener("mousedown", function(e) {
    fractalFormData.fractalX -= .1 * fractalFormData.fractalInitialZoom;
});

document.getElementById("moveRightButton").addEventListener("mousedown", function(e) {
    fractalFormData.fractalX += .1 * fractalFormData.fractalInitialZoom;
});

document.getElementById("moveUpButton").addEventListener("mousedown", function(e) {
    fractalFormData.fractalY += .1 * fractalFormData.fractalInitialZoom;
});

document.getElementById("moveDownButton").addEventListener("mousedown", function(e) {
    fractalFormData.fractalY -= .1 * fractalFormData.fractalInitialZoom;
});