import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{i as d}from"./gif-kDgybj-X.js";let v=`
attribute vec2 aTextureCoord;
attribute vec4 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
    gl_Position = vec4(aVertexPosition.x, aVertexPosition.y, 0.0, 1.0);
}`,p=`
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
`;function h(e,t,a){const o=u(e,e.VERTEX_SHADER,t),c=u(e,e.FRAGMENT_SHADER,a),n=e.createProgram();return e.attachShader(n,o),e.attachShader(n,c),e.linkProgram(n),e.getProgramParameter(n,e.LINK_STATUS)?n:(console.error(`Unable to initialize the shader program: ${e.getProgramInfoLog(n)}`),null)}function u(e,t,a){const o=e.createShader(t);return e.shaderSource(o,a),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS)?o:(console.error(`An error occured compiling shader:
${e.getShaderInfoLog(o)}`),e.deleteShader(o),null)}function L(e,t,a){const c=e.FLOAT,n=!1,l=0,r=0;e.bindBuffer(e.ARRAY_BUFFER,t.position),e.vertexAttribPointer(a.attribLocations.vertexPosition,2,c,n,l,r),e.enableVertexAttribArray(a.attribLocations.vertexPosition)}function x(e,t,a){const c=e.FLOAT,n=!1,l=0,r=0;e.bindBuffer(e.ARRAY_BUFFER,t.textureCoord),e.vertexAttribPointer(a.attribLocations.textureCoord,2,c,n,l,r),e.enableVertexAttribArray(a.attribLocations.textureCoord)}let i={fractalType:0,fractalInitialZoom:.0125,fractalX:-.95,fractalY:-.25,canvasDims:[350,350]};function b(){const t=document.querySelector("#gl-canvas").getContext("webgl");if(t===null){alert("Unable to initialize WebGL. Your browser or machine may not support it.");return}t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT);const a=h(t,v,p),o={program:a,attribLocations:{vertexPosition:t.getAttribLocation(a,"aVertexPosition"),textureCoord:t.getAttribLocation(a,"aTextureCoord")},uniformLocations:{projectionMatrix:t.getUniformLocation(a,"uProjectionMatrix"),modelViewMatrix:t.getUniformLocation(a,"uModelViewMatrix"),uSampler:t.getUniformLocation(a,"uSampler"),time:t.getUniformLocation(a,"time"),fractalX:t.getUniformLocation(a,"fractalX"),fractalY:t.getUniformLocation(a,"fractalY"),fractalInitialZoom:t.getUniformLocation(a,"fractalInitialZoom"),canvasRes:t.getUniformLocation(a,"canvasRes")}};E();const c=d(t);function n(l){t.clearColor(0,0,0,1),t.clearDepth(1),t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA);const r=mat4.create();mat4.ortho(r,-1,1,-1,1,.1,100),t.depthMask(!1),C(t,r,o,c,{x:0,y:0},1),t.depthMask(!0),requestAnimationFrame(n)}requestAnimationFrame(n)}b();function C(e,t,a,o,c,n,l){const r=mat4.create();mat4.translate(r,r,[c.x,c.y,-.1*n]),L(e,o,a),x(e,o,a),e.useProgram(a.program),e.uniformMatrix4fv(a.uniformLocations.projectionMatrix,!1,t),e.uniformMatrix4fv(a.uniformLocations.modelViewMatrix,!1,r),e.uniform1i(a.uniformLocations.uSampler,0),e.uniform1f(a.uniformLocations.time,l),e.uniform1f(a.uniformLocations.fractalX,i.fractalX),e.uniform1f(a.uniformLocations.fractalY,i.fractalY),e.uniform1f(a.uniformLocations.fractalInitialZoom,i.fractalInitialZoom),e.uniform2f(a.uniformLocations.canvasRes,i.canvasDims[0],i.canvasDims[1]),e.drawArrays(e.TRIANGLES,0,6)}function E(e){let t=document.getElementById("fractalForm");t.innerHTML="";let a=document.createElement("div");a.style.display="flex",a.style.alignItems="center";let o=document.createElement("div");o.style.display="flex",o.style.alignItems="center";let c=document.createElement("div");c.style.display="flex",c.style.alignItems="center";let n=document.createElement("p");n.innerHTML="Fractal Coords";let l=document.createElement("input");l.type="number",l.id="fractalXInput",l.value=i.fractalX,l.step="any";let r=document.createElement("input");r.type="number",r.id="fractalYInput",r.value=i.fractalY,r.step="any",a.appendChild(n),a.appendChild(l),a.appendChild(r);let f=document.createElement("p");f.innerHTML="InitialZoom";let s=document.createElement("input");s.type="number",s.id="fractalZoomInput",s.value=i.fractalInitialZoom,s.step="any",t.appendChild(a),o.appendChild(f),o.appendChild(s),t.appendChild(o),l.addEventListener("change",function(m){i.fractalX=+m.target.value,console.warn(i)}),r.addEventListener("change",function(m){i.fractalY=+m.target.value,console.warn(i)}),s.addEventListener("change",function(m){i.fractalInitialZoom=+m.target.value,console.warn(i)})}window.addEventListener("resize",function(e){let t=document.getElementById("gl-canvas");console.warn(t.clientHeight),console.warn(t.clientWidth),i.canvasDims=[t.clientHeight,t.clientWidth]});
