import { initBuffers } from "./initbuffers.js";
import { drawScene } from "./drawscene.js";
import { initShaderProgram, loadShader, isPowerOf2, loadTexture } from "./myglutils";
import GIF from "gif.js.optimized";

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
}