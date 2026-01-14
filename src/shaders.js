let basicVertShader = `
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

let mandelBrotFragShader = `
precision highp float;
uniform float time;
uniform sampler2D uSampler;

uniform float fractalX;
uniform float fractalY;
uniform float fractalInitialZoom;
uniform vec2 canvasRes;
uniform int colorCount;
uniform int effectsOn;
uniform sampler2D fractalTexture;
uniform int fractalPrecision;

vec2 imagine(vec2 z, vec2 c) {
    return mat2(z,-z.y,z.x)*z + c;
}

vec4 palette(float intensity) {
    //float uvX = (intensity * float(colorCount)) / float(colorCount);
    return texture2D(fractalTexture, vec2(intensity, .5)) * vec4(vec3(1.0 - pow(intensity, 2.0)), 1.0);
}

vec4 mandelbrot(vec2 uv, float zoom, vec2 zoomCenter) { // http://gpfault.net/posts/mandelbrot-webgl.txt.html thanks bro
    vec2 c = zoomCenter + (uv * 4.0 - vec2(2.0)) * (zoom / 4.0);
    vec2 z = vec2(0.0);
    bool escaped = false;
    int iterations = 0;
    for(int i = 0; i < 10000; i++) { // max iterations todo
        if(i > fractalPrecision) break;
        z = imagine(z,c);
        iterations = i;
        if (length(z) > 2.0) {
            escaped = true;
            break;
        }
    }
    if(effectsOn == 1) {
        return escaped ? palette(float(iterations) / float(fractalPrecision)) : texture2D(fractalTexture, vec2(0.0));
    } else {
        return escaped ? vec4(float(iterations) / float(fractalPrecision)) : vec4(0.0);
    }
}

void main() {
    vec2 uv = gl_FragCoord.xy / canvasRes;
    gl_FragColor = mandelbrot(uv, fractalInitialZoom, vec2(fractalX, fractalY));
    //gl_FragColor = vec4(fractalX, fractalY, fractalInitialZoom, 1.0);
}
`;

let gridFragShader = ``;

export {basicVertShader,mandelBrotFragShader, gridFragShader}