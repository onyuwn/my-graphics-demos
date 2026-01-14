import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{i as S}from"./gif-kDgybj-X.js";let M=`
attribute vec2 aTextureCoord;
attribute vec4 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
}
`,g=`
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
`;function D(e,t,n){const o=_(e,e.VERTEX_SHADER,t),i=_(e,e.FRAGMENT_SHADER,n),r=e.createProgram();return e.attachShader(r,o),e.attachShader(r,i),e.linkProgram(r),e.getProgramParameter(r,e.LINK_STATUS)?r:(console.error(`Unable to initialize the shader program: ${e.getProgramInfoLog(r)}`),null)}function _(e,t,n){const o=e.createShader(t);return e.shaderSource(o,n),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS)?o:(console.error(`An error occured compiling shader:
${e.getShaderInfoLog(o)}`),e.deleteShader(o),null)}function U(e,t,n,o){const i=e.createTexture(),r=0,l=e.RGBA,c=e.RGBA,f=e.UNSIGNED_BYTE;return e.bindTexture(e.TEXTURE_2D,i),e.texImage2D(e.TEXTURE_2D,r,l,o.length/4,1,0,c,f,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),i}function F(e,t,n){const i=e.FLOAT,r=!1,l=0,c=0;e.bindBuffer(e.ARRAY_BUFFER,t.position),e.vertexAttribPointer(n.attribLocations.vertexPosition,2,i,r,l,c),e.enableVertexAttribArray(n.attribLocations.vertexPosition)}function X(e,t,n){const i=e.FLOAT,r=!1,l=0,c=0;e.bindBuffer(e.ARRAY_BUFFER,t.textureCoord),e.vertexAttribPointer(n.attribLocations.textureCoord,2,i,r,l,c),e.enableVertexAttribArray(n.attribLocations.textureCoord)}function z(e){let t=e.replace("#",""),n=parseInt(t.substring(0,2),16),o=parseInt(t.substring(2,4),16),i=parseInt(t.substring(4,6),16);return[n,o,i,255]}let h,a={fractalType:0,fractalInitialZoom:.0125,fractalX:-.95,fractalY:-.25,canvasDims:[350,350],fractalColors:[],fractalTexture:void 0,fractalColorCount:0,effectsOn:0,fractalPrecision:100},b=!1;function O(){const t=document.querySelector("#gl-canvas").getContext("webgl");if(h=t,t===null){alert("Unable to initialize WebGL. Your browser or machine may not support it.");return}t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT);const n=D(t,M,g),o={program:n,attribLocations:{vertexPosition:t.getAttribLocation(n,"aVertexPosition"),textureCoord:t.getAttribLocation(n,"aTextureCoord")},uniformLocations:{projectionMatrix:t.getUniformLocation(n,"uProjectionMatrix"),modelViewMatrix:t.getUniformLocation(n,"uModelViewMatrix"),uSampler:t.getUniformLocation(n,"uSampler"),time:t.getUniformLocation(n,"time"),fractalX:t.getUniformLocation(n,"fractalX"),fractalY:t.getUniformLocation(n,"fractalY"),fractalInitialZoom:t.getUniformLocation(n,"fractalInitialZoom"),canvasRes:t.getUniformLocation(n,"canvasRes"),fractalTexture:t.getUniformLocation(n,"fractalTexture"),colorCount:t.getUniformLocation(n,"colorCount"),effectsOn:t.getUniformLocation(n,"effectsOn"),fractalPrecision:t.getUniformLocation(n,"fractalPrecision")}};Y(),console.warn(a.fractalColors),a.fractalTexture=U(h,a.colorCount,1,new Uint8Array([255,255,255,255]));const i=S(t);w();function r(l){l*=.001,t.clearColor(0,0,0,1),t.clearDepth(1),t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA);const c=mat4.create();mat4.ortho(c,-1,1,-1,1,.1,100),t.depthMask(!1),Z(t,c,o,i,{x:0,y:0},1,l,a.fractalTexture),t.depthMask(!0),b&&(document.getElementById("gl-canvas").toBlob(f=>{console.warn("blob");let m=URL.createObjectURL(f),u=document.createElement("a");u.href=m,u.download=`jakehsequencer${new Date(Date.now()).toISOString().replace(":","")}.png`,u.click()},"image/png"),b=!1),requestAnimationFrame(r)}requestAnimationFrame(r)}O();function Z(e,t,n,o,i,r,l,c){const f=mat4.create();mat4.translate(f,f,[i.x,i.y,-.1*r]),F(e,o,n),X(e,o,n),e.useProgram(n.program),e.uniformMatrix4fv(n.uniformLocations.projectionMatrix,!1,t),e.uniformMatrix4fv(n.uniformLocations.modelViewMatrix,!1,f),c?(e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,c)):console.warn("no texstrue"),e.uniform1i(n.uniformLocations.uSampler,0),e.uniform1f(n.uniformLocations.time,l),e.uniform1f(n.uniformLocations.fractalX,a.fractalX),e.uniform1f(n.uniformLocations.fractalY,a.fractalY),e.uniform1f(n.uniformLocations.fractalInitialZoom,a.fractalInitialZoom),e.uniform2f(n.uniformLocations.canvasRes,a.canvasDims[0],a.canvasDims[1]),e.uniform1i(n.uniformLocations.fractalTexture,0),e.uniform1i(n.uniformLocations.colorCount,a.fractalColorCount),e.uniform1i(n.uniformLocations.effectsOn,a.effectsOn),e.uniform1i(n.uniformLocations.fractalPrecision,a.fractalPrecision),e.drawArrays(e.TRIANGLES,0,6)}function Y(e){let t=document.getElementById("fractalForm");t.innerHTML="";let n=document.createElement("div");n.style.display="flex",n.style.alignItems="center",n.style.justifyContent="space-between";let o=document.createElement("div");o.style.display="flex",o.style.alignItems="center",o.style.justifyContent="space-between";let i=document.createElement("div");i.style.display="flex",i.style.alignItems="center";let r=document.createElement("p");r.innerHTML="Fractal Coords";let l=document.createElement("input");l.type="number",l.id="fractalXInput",l.value=a.fractalX,l.step="any";let c=document.createElement("input");c.type="number",c.id="fractalYInput",c.value=a.fractalY,c.step="any",n.appendChild(r),n.appendChild(l),n.appendChild(c);let f=document.createElement("p");f.innerHTML="Zoom";let m=document.createElement("input");m.type="number",m.id="fractalZoomInput",m.value=a.fractalInitialZoom,m.step="any";let u=document.createElement("div");u.id="precisionInputsContainer",u.style.display="flex",u.style.justifyContent="space-between";let P=document.createElement("p");P.innerHTML="Precision";let d=document.createElement("input");d.min=10,d.value=100,d.max=1e4,d.step=.1,d.id="fractalPrecisionSlider",d.type="range";let v=document.createElement("input");v.id="fractalPrecisionInput",v.type="number",v.value=100,u.appendChild(P),u.appendChild(d),u.appendChild(v),d.addEventListener("input",function(s){v.value=+s.target.value,a.fractalPrecision=+s.target.value}),v.addEventListener("change",function(s){a.fractalPrecision=+s.target.value}),t.appendChild(u),t.appendChild(n),o.appendChild(f),o.appendChild(m),t.appendChild(o),l.addEventListener("change",function(s){a.fractalX=+s.target.value,console.warn(a)}),c.addEventListener("change",function(s){a.fractalY=+s.target.value,console.warn(a)}),m.addEventListener("change",function(s){a.fractalInitialZoom=+s.target.value,console.warn(a)});let R=document.getElementById("gl-canvas");a.canvasDims=[R.offsetWidth,R.offsetHeight];let L=document.createElement("div");L.id="fractalColorList",L.style.height="auto";let p=document.createElement("div");p.style.display="flex",p.style.alignItems="center",p.style.justifyContent="space-between",p.id="colorControlsContainer";let T=document.createElement("input");T.type="color";let I=document.createElement("p");I.innerHTML="add color",p.appendChild(I),p.appendChild(T),t.appendChild(p),t.appendChild(L),T.addEventListener("change",function(s){let B=document.getElementById("fractalColorList"),x=z(s.target.value);for(let E=0;E<x.length;E++){let A=E+a.fractalColorCount*4;a.fractalColors[A]?a.fractalColors[A]=x[E]:a.fractalColors.push(x[E])}a.fractalColorCount++,a.fractalTexture=U(h,a.colorCount,1,new Uint8Array(a.fractalColors));let y=document.createElement("div");y.style.background=s.target.value,y.style.height="10px",B.appendChild(y),console.warn(a)});let C=document.createElement("button");C.innerHTML="save image",C.className="controlButton",t.appendChild(C),C.addEventListener("click",function(s){b=!0})}window.addEventListener("resize",function(e){w()});function w(){let e=document.getElementById("gl-canvas");const t=e.clientWidth,n=e.clientHeight;a.canvasDims=[t,n],(e.width!==t||e.height!==n)&&(e.width=t,e.height=n),h.viewport(0,0,t,n)}document.getElementById("effectsToggle").addEventListener("change",function(e){a.effectsOn=e.target.checked==!0?1:0});document.getElementById("zoomInButton").addEventListener("mousedown",function(e){a.fractalInitialZoom-=1e-4});document.getElementById("zoomOutButton").addEventListener("mousedown",function(e){a.fractalInitialZoom+=1e-4});document.getElementById("moveLeftButton").addEventListener("mousedown",function(e){a.fractalX-=.1*a.fractalInitialZoom});document.getElementById("moveRightButton").addEventListener("mousedown",function(e){a.fractalX+=.1*a.fractalInitialZoom});document.getElementById("moveUpButton").addEventListener("mousedown",function(e){a.fractalY+=.1*a.fractalInitialZoom});document.getElementById("moveDownButton").addEventListener("mousedown",function(e){a.fractalY-=.1*a.fractalInitialZoom});
