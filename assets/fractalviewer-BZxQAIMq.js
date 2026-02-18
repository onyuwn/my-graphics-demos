import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{i as g}from"./gif-ckf_XKgh.js";let F=`
attribute vec2 aTextureCoord;
attribute vec4 aVertexPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
}
`,M=`
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
`;function X(t,e,n){const o=_(t,t.VERTEX_SHADER,e),i=_(t,t.FRAGMENT_SHADER,n),r=t.createProgram();return t.attachShader(r,o),t.attachShader(r,i),t.linkProgram(r),t.getProgramParameter(r,t.LINK_STATUS)?r:(console.error(`Unable to initialize the shader program: ${t.getProgramInfoLog(r)}`),null)}function _(t,e,n){const o=t.createShader(e);return t.shaderSource(o,n),t.compileShader(o),t.getShaderParameter(o,t.COMPILE_STATUS)?o:(console.error(`An error occured compiling shader:
${t.getShaderInfoLog(o)}`),t.deleteShader(o),null)}function U(t,e,n,o){const i=t.createTexture(),r=0,l=t.RGBA,c=t.RGBA,f=t.UNSIGNED_BYTE;return t.bindTexture(t.TEXTURE_2D,i),t.texImage2D(t.TEXTURE_2D,r,l,o.length/4,1,0,c,f,o),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),i}function D(t,e,n){const i=t.FLOAT,r=!1,l=0,c=0;t.bindBuffer(t.ARRAY_BUFFER,e.position),t.vertexAttribPointer(n.attribLocations.vertexPosition,2,i,r,l,c),t.enableVertexAttribArray(n.attribLocations.vertexPosition)}function Z(t,e,n){const i=t.FLOAT,r=!1,l=0,c=0;t.bindBuffer(t.ARRAY_BUFFER,e.textureCoord),t.vertexAttribPointer(n.attribLocations.textureCoord,2,i,r,l,c),t.enableVertexAttribArray(n.attribLocations.textureCoord)}function z(t){let e=t.replace("#",""),n=parseInt(e.substring(0,2),16),o=parseInt(e.substring(2,4),16),i=parseInt(e.substring(4,6),16);return[n,o,i,255]}let L,a={fractalType:0,fractalInitialZoom:.0125,fractalX:-.95,fractalY:-.25,canvasDims:[350,350],fractalColors:[],fractalTexture:void 0,fractalColorCount:0,effectsOn:0,fractalPrecision:100},b=!1;function Y(){const e=document.querySelector("#gl-canvas").getContext("webgl");if(L=e,e===null){alert("Unable to initialize WebGL. Your browser or machine may not support it.");return}e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT);const n=X(e,F,M),o={program:n,attribLocations:{vertexPosition:e.getAttribLocation(n,"aVertexPosition"),textureCoord:e.getAttribLocation(n,"aTextureCoord")},uniformLocations:{projectionMatrix:e.getUniformLocation(n,"uProjectionMatrix"),modelViewMatrix:e.getUniformLocation(n,"uModelViewMatrix"),uSampler:e.getUniformLocation(n,"uSampler"),time:e.getUniformLocation(n,"time"),fractalX:e.getUniformLocation(n,"fractalX"),fractalY:e.getUniformLocation(n,"fractalY"),fractalInitialZoom:e.getUniformLocation(n,"fractalInitialZoom"),canvasRes:e.getUniformLocation(n,"canvasRes"),fractalTexture:e.getUniformLocation(n,"fractalTexture"),colorCount:e.getUniformLocation(n,"colorCount"),effectsOn:e.getUniformLocation(n,"effectsOn"),fractalPrecision:e.getUniformLocation(n,"fractalPrecision")}};V(),console.warn(a.fractalColors),a.fractalTexture=U(L,a.colorCount,1,new Uint8Array([255,255,255,255]));const i=g(e);w();function r(l){l*=.001,e.clearColor(0,0,0,1),e.clearDepth(1),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);const c=mat4.create();mat4.ortho(c,-1,1,-1,1,.1,100),e.depthMask(!1),O(e,c,o,i,{x:0,y:0},1,l,a.fractalTexture),e.depthMask(!0),b&&(document.getElementById("gl-canvas").toBlob(f=>{console.warn("blob");let m=URL.createObjectURL(f),s=document.createElement("a");s.href=m,s.download=`jakehsequencer${new Date(Date.now()).toISOString().replace(":","")}.png`,s.click()},"image/png"),b=!1),requestAnimationFrame(r)}requestAnimationFrame(r)}Y();function O(t,e,n,o,i,r,l,c){const f=mat4.create();mat4.translate(f,f,[i.x,i.y,-.1*r]),D(t,o,n),Z(t,o,n),t.useProgram(n.program),t.uniformMatrix4fv(n.uniformLocations.projectionMatrix,!1,e),t.uniformMatrix4fv(n.uniformLocations.modelViewMatrix,!1,f),c?(t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,c)):console.warn("no texstrue"),t.uniform1i(n.uniformLocations.uSampler,0),t.uniform1f(n.uniformLocations.time,l),t.uniform1f(n.uniformLocations.fractalX,a.fractalX),t.uniform1f(n.uniformLocations.fractalY,a.fractalY),t.uniform1f(n.uniformLocations.fractalInitialZoom,a.fractalInitialZoom),t.uniform2f(n.uniformLocations.canvasRes,a.canvasDims[0],a.canvasDims[1]),t.uniform1i(n.uniformLocations.fractalTexture,0),t.uniform1i(n.uniformLocations.colorCount,a.fractalColorCount),t.uniform1i(n.uniformLocations.effectsOn,a.effectsOn),t.uniform1i(n.uniformLocations.fractalPrecision,a.fractalPrecision),t.drawArrays(t.TRIANGLES,0,6)}function V(t){let e=document.getElementById("fractalForm");e.innerHTML="";let n=document.createElement("div");n.style.display="flex",n.style.alignItems="center",n.style.justifyContent="space-between";let o=document.createElement("div");o.style.display="flex",o.style.alignItems="center",o.style.justifyContent="space-between";let i=document.createElement("div");i.style.display="flex",i.style.alignItems="center";let r=document.createElement("p");r.innerHTML="Fractal Coords";let l=document.createElement("input");l.type="number",l.id="fractalXInput",l.value=a.fractalX,l.step="any";let c=document.createElement("input");c.type="number",c.id="fractalYInput",c.value=a.fractalY,c.step="any",n.appendChild(r),n.appendChild(l),n.appendChild(c);let f=document.createElement("p");f.innerHTML="Zoom";let m=document.createElement("input");m.type="number",m.id="fractalZoomInput",m.value=a.fractalInitialZoom,m.step="any";let s=document.createElement("div");s.id="precisionInputsContainer",s.style.display="flex",s.style.justifyContent="space-between";let P=document.createElement("p");P.innerHTML="Precision";let d=document.createElement("input");d.min=10,d.value=100,d.max=1e4,d.step=.1,d.id="fractalPrecisionSlider",d.type="range";let v=document.createElement("input");v.id="fractalPrecisionInput",v.type="number",v.value=100,s.appendChild(P),s.appendChild(d),s.appendChild(v),d.addEventListener("input",function(u){v.value=+u.target.value,a.fractalPrecision=+u.target.value}),v.addEventListener("change",function(u){a.fractalPrecision=+u.target.value}),e.appendChild(s),e.appendChild(n),o.appendChild(f),o.appendChild(m),e.appendChild(o),l.addEventListener("change",function(u){a.fractalX=+u.target.value,console.warn(a)}),c.addEventListener("change",function(u){a.fractalY=+u.target.value,console.warn(a)}),m.addEventListener("change",function(u){a.fractalInitialZoom=+u.target.value,console.warn(a)});let R=document.getElementById("gl-canvas");a.canvasDims=[R.offsetWidth,R.offsetHeight];let T=document.createElement("div");T.id="fractalColorList",T.style.height="auto";let p=document.createElement("div");p.style.display="flex",p.style.alignItems="center",p.style.justifyContent="space-between",p.id="colorControlsContainer";let x=document.createElement("input");x.type="color";let A=document.createElement("p");A.innerHTML="add color",p.appendChild(A),p.appendChild(x),e.appendChild(p),e.appendChild(T),x.addEventListener("change",function(u){let S=document.getElementById("fractalColorList"),y=z(u.target.value);for(let C=0;C<y.length;C++){let B=C+a.fractalColorCount*4;a.fractalColors[B]?a.fractalColors[B]=y[C]:a.fractalColors.push(y[C])}a.fractalColorCount++,a.fractalTexture=U(L,a.colorCount,1,new Uint8Array(a.fractalColors));let I=document.createElement("div");I.style.background=u.target.value,I.style.height="10px",S.appendChild(I),console.warn(a)});let h=document.createElement("button");h.innerHTML="save image",h.className="controlButton",e.appendChild(h),h.addEventListener("click",function(u){b=!0})}window.addEventListener("resize",function(t){w()});function w(){let t=document.getElementById("gl-canvas");const e=t.clientWidth,n=t.clientHeight;a.canvasDims=[e,n],(t.width!==e||t.height!==n)&&(t.width=e,t.height=n),L.viewport(0,0,e,n)}document.getElementById("effectsToggle").addEventListener("change",function(t){a.effectsOn=t.target.checked==!0?1:0});document.getElementById("zoomInButton").addEventListener("mousedown",function(t){a.fractalInitialZoom-=a.fractalInitialZoom*.1,E()});document.getElementById("zoomOutButton").addEventListener("mousedown",function(t){a.fractalInitialZoom+=a.fractalInitialZoom*.1,E()});document.getElementById("moveLeftButton").addEventListener("mousedown",function(t){a.fractalX-=.1*a.fractalInitialZoom,E()});document.getElementById("moveRightButton").addEventListener("mousedown",function(t){a.fractalX+=.1*a.fractalInitialZoom,E()});document.getElementById("moveUpButton").addEventListener("mousedown",function(t){a.fractalY+=.1*a.fractalInitialZoom,E()});document.getElementById("moveDownButton").addEventListener("mousedown",function(t){a.fractalY-=.1*a.fractalInitialZoom,E()});function E(){H(a.fractalPrecision),k(a.fractalX),N(a.fractalY),j(a.fractalInitialZoom)}function H(t){document.getElementById("fractalPrecisionInput").value=t}function k(t){document.getElementById("fractalXInput").value=t}function N(t){document.getElementById("fractalYInput").value=t}function j(t){document.getElementById("fractalZoomInput").value=t}
