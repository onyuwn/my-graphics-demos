import { initBuffers } from "./initbuffers.js";
import { drawScene } from "./drawscene.js";
import { initShaderProgram, loadShader, isPowerOf2, loadTexture, setPositionAttribute, setTextureAttribute } from "./myglutils";
import { mandelBrotFragShader, basicVertShader } from "./shaders.js";
import GIF from "gif.js.optimized";

let glContext = undefined;
let fractalFormData = {
    fractalType:0,
    fractalInitialZoom: 0.0125,
    fractalX: -.95,
    fractalY: -.25,
    canvasDims: [350 ,350]
}

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
        }
    };
    initializeFractalForm();
    const buffers = initBuffers(gl);
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
        drawPlane(gl, projectionMatrix, programInfo, buffers, {x:0, y:0}, 1);
        gl.depthMask(true);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
main();

function drawPlane(gl, projection, programInfo, buffers, position, layer, time) {
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
    //gl.activeTexture(gl.TEXTURE0);
    //gl.bindTexture(gl.TEXTURE_2D, sequenceItem.texture);
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
    gl.uniform1f(programInfo.uniformLocations.time, time);
    gl.uniform1f(programInfo.uniformLocations.fractalX, fractalFormData.fractalX);
    gl.uniform1f(programInfo.uniformLocations.fractalY, fractalFormData.fractalY);
    gl.uniform1f(programInfo.uniformLocations.fractalInitialZoom, fractalFormData.fractalInitialZoom);
    gl.uniform2f(programInfo.uniformLocations.canvasRes, fractalFormData.canvasDims[0], fractalFormData.canvasDims[1]);

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
    let initialZoomContainer = document.createElement("div");
    initialZoomContainer.style.display="flex";
    initialZoomContainer.style.alignItems="center";
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
    zoomInputLabel.innerHTML="InitialZoom";
    let fractalZoomInput = document.createElement("input");
    fractalZoomInput.type="number";
    fractalZoomInput.id="fractalZoomInput";
    fractalZoomInput.value = fractalFormData.fractalInitialZoom;
    fractalZoomInput.step="any";


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
}

window.addEventListener("resize", function(e) {

});