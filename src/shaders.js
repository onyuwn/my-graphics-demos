let basicVertShader = `
attribute vec2 aTextureCoord;
attribute vec4 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
    gl_Position = vec4(aVertexPosition.x, aVertexPosition.y, 0.0, 1.0);
}`;

let mandelBrotFragShader = `
precision highp float;
uniform float time;
uniform sampler2D uSampler;

uniform float fractalX;
uniform float fractalY;
uniform float fractalInitialZoom;
uniform vec2 canvasRes;

vec2 imagine(vec2 z, vec2 c) {
    return mat2(z,-z.y,z.x)*z + c;
}

vec4 mandelbrot(vec2 uv, float zoom, vec2 zoomCenter) { // http://gpfault.net/posts/mandelbrot-webgl.txt.html thanks bro
    vec2 c = zoomCenter + (uv * 4.0 - vec2(2.0)) * (zoom / 4.0);
    vec2 z = vec2(0.0);
    bool escaped = false;
    int iterations = 0;
    for(int i = 0; i < 10000; i++) {
        if(i > 5000) break;
        z = imagine(z,c);
        iterations = i;
        if (length(z) > 2.0) {
            escaped = true;
            break;
        }
    }
    return escaped ? vec4(vec3(float(iterations)) / float(500), 1.0) : vec4(vec3(0.0), 1.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy / canvasRes;
    gl_FragColor = mandelbrot(uv, fractalInitialZoom, vec2(fractalX, fractalY));
    //gl_FragColor = vec4(fractalX, fractalY, fractalInitialZoom, 1.0);
}
`;

let gridFragShader = ``;

export {basicVertShader,mandelBrotFragShader, gridFragShader}