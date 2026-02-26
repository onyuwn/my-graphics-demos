import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{G as De,i as Re,d as J}from"./gif-DsIElLlq.js";const oe=4,Fe=`
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
`,He=`
    precision highp float;
    varying highp vec2 vTextureCoord;
    uniform float time;
    uniform float transitionTime;
    uniform float sequenceItemLength;
    uniform float sequenceItemStartTime;
    uniform int transitionType;
    uniform int transitionFadeType;
    uniform int sequenceIndex;
    uniform vec3 colorThreshold;
    uniform vec3 fadeInColorThreshold;

    uniform float fadeInTransitionTime;
    uniform int fadeInTransitionType;
    uniform int clipEffectControlAlpha;

    uniform int clipEffect;
    uniform float clipEffectIntensity;

    uniform float fractalX;
    uniform float fractalY;
    uniform float fractalInitialZoom;

    uniform float pageCurlRadius;
    uniform float pageCurlDir;

    uniform sampler2D uSampler;

    vec2 random2( vec2 p ) {
        return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }

    vec3 sampleWithOffset(vec2 offset, vec2 uv) {
        return texture2D(uSampler, uv + offset).rgb;
    }

    vec3 sharpenKernel(vec2 uv, float intensity)
    {
        vec2 texel = 1.0 / vec2(256.0,256.0); // TODO textureSize not working? pass in resolution
        texel *= intensity; // sharpening radius / strength

        vec3 sum = vec3(0.0);

        sum += sampleWithOffset(vec2( 0, -1) * texel, uv) * -1.0;
        sum += sampleWithOffset(vec2(-1,  0) * texel, uv) * -1.0;
        sum += sampleWithOffset(vec2( 0,  0) * texel, uv) *  5.0;
        sum += sampleWithOffset(vec2( 1,  0) * texel, uv) * -1.0;
        sum += sampleWithOffset(vec2( 0,  1) * texel, uv) * -1.0;

        return sum;
    }

    vec3 blurKernel(vec2 uv, float intensity)
    {
        vec2 texel = intensity / vec2(256.0,256.0);
        vec3 sum = vec3(0.0);

        sum += sampleWithOffset(vec2(-1, -1) * texel, uv);
        sum += sampleWithOffset(vec2(-1,  0) * texel, uv);
        sum += sampleWithOffset(vec2(-1,  1) * texel, uv);
        sum += sampleWithOffset(vec2( 0, -1) * texel, uv);
        sum += sampleWithOffset(vec2( 0,  0) * texel, uv);
        sum += sampleWithOffset(vec2( 0,  1) * texel, uv);
        sum += sampleWithOffset(vec2( 1, -1) * texel, uv);
        sum += sampleWithOffset(vec2( 1,  0) * texel, uv);
        sum += sampleWithOffset(vec2( 1,  1) * texel, uv);

        return sum / 9.0;
    }

    vec3 embossKernel(vec2 uv, float intensity)
    {
        vec2 texel = intensity / vec2(256.0,256.0);
        vec3 sum = vec3(0.0);

        sum += sampleWithOffset(vec2(-1, -1) * texel, uv) * -2.0;
        sum += sampleWithOffset(vec2(-1,  0) * texel, uv) * -1.0;
        sum += sampleWithOffset(vec2(-1,  1) * texel, uv) * 0.0;
        sum += sampleWithOffset(vec2( 0, -1) * texel, uv) * -1.0;
        sum += sampleWithOffset(vec2( 0,  0) * texel, uv) * 1.0;
        sum += sampleWithOffset(vec2( 0,  1) * texel, uv) * 1.0;
        sum += sampleWithOffset(vec2( 1, -1) * texel, uv) * 0.0;
        sum += sampleWithOffset(vec2( 1,  0) * texel, uv) * 1.0;
        sum += sampleWithOffset(vec2( 1,  1) * texel, uv) * 2.0;

        return sum;
    }

    vec2 imagine(vec2 z, vec2 c) {
    	return mat2(z,-z.y,z.x)*z + c;
    }

    vec4 mandelbrot(vec2 uv, float zoom, vec2 zoomCenter, float t) { // http://gpfault.net/posts/mandelbrot-webgl.txt.html thanks bro
        vec2 c = zoomCenter + (uv * 4.0 - vec2(2.0)) * (zoom / 4.0);
        vec2 z = vec2(0.0);
        bool escaped = false;
        int iterations = 0;
        for(int i = 0; i < 10000; i++) {
            if(i > 500) break;
            z = imagine(z,c);
            iterations = i;
            if (length(z) > 2.0) {
                escaped = true;
                break;
            }
        }
        //return escaped ? vec4(vec3(float(iterations)) / float(5), 1.0) : vec4(vec3(0.0), 1.0);
        if(transitionFadeType == 1) {
            return escaped ? vec4(vec3((float(iterations) / float(500)) + t), 1.0) : vec4(1.0);
        } else {
            return escaped ? vec4((float(iterations) / float(500)) + t) : vec4(1.0);
        }
    }

    vec2 rotateUv(vec2 uv, float rotation, vec2 center) {
        vec2 delta = uv - center;
        vec2 rotated = vec2(
            cos(rotation) * delta.x + sin(rotation) * delta.y,
            cos(rotation) * delta.y - sin(rotation) * delta.x
        );
        return rotated + center;
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
            } else if(transitionType == 5) {
                gl_FragColor += (time - transitionStart) / transitionTime;
            } else if(transitionType == 6) {
                float t = 1.0 - (time / (sequenceItemStartTime + sequenceItemLength));
                float zoom = fractalInitialZoom;
                vec4 mandelBrotColor = mandelbrot(rotateUv(uv, time * .5, vec2(.5)), zoom * t, vec2(fractalX, fractalY), t);
                vec4 diffuse = texture2D(uSampler, rotateUv(uv, time * .5, vec2(.5)));
                gl_FragColor = mandelBrotColor * diffuse;
            } else if(transitionType == 7) { // pagecurl
                float aspect = 1.0;
                float radius = (pageCurlRadius > 0.0) ? pageCurlRadius : .1;
                float pi = 3.141592;
                float t = 1.0 - ((time - transitionStart) / transitionTime);
                //vec2 curlDir = normalize(vec2(1.0));

                float xComponent = cos(pageCurlDir) * 1.141;
                float yComponent = sin(pageCurlDir) * 1.141;
                vec2 curlDir = vec2(1.0);

                if(xComponent >= 0.0 && yComponent >= 0.0) {
                    curlDir = normalize(vec2(xComponent, yComponent));
                } else if(xComponent < 0.0 && yComponent >= 0.0) {
                    curlDir = normalize(vec2(yComponent, xComponent));
                } else if(xComponent >= 0.0 && yComponent < 0.0) {
                    curlDir = normalize(vec2(xComponent, yComponent));
                } else {
                    curlDir = normalize(vec2(xComponent, yComponent));
                }
                //vec2 origin = clamp(vec2(t) - curlDir * t / curlDir.x, 0., 1.);
                vec2 origin = vec2(0.0);
                float curlDist = length(vec2(t) - origin);
                
                if (curlDir.x < 0.)
                {

                    curlDist = length(t - origin);
                }
              
                float proj = dot(uv - origin, curlDir);
                float dist = proj - curlDist;
                
                vec2 linePoint = uv - dist * curlDir;
                
                if (dist > radius) 
                {
                    gl_FragColor = vec4(0.0);
                    gl_FragColor.rgb *= pow(clamp(dist - radius, 0., 1.) * 1.5, .2);
                }
                else if (dist >= 0.)
                {
                    // map to cylinder point
                    float theta = asin(dist / radius);
                    vec2 p2 = linePoint + curlDir * (pi - theta) * radius;
                    vec2 p1 = linePoint + curlDir * theta * radius;
                    uv = (p2.x <= aspect && p2.y <= 1. && p2.x > 0. && p2.y > 0.) ? p2 : p1;
                    gl_FragColor = texture2D(uSampler, uv * vec2(1. / aspect, 1.));
                    gl_FragColor.rgb *= pow(clamp((radius - dist) / radius, 0., 1.), .2);
                }
                else 
                {
                    vec2 p = linePoint + curlDir * (abs(dist) + pi * radius);
                    uv = (p.x <= aspect && p.y <= 1. && p.x > 0. && p.y > 0.) ? p : uv;
                    gl_FragColor = texture2D(uSampler, uv * vec2(1. / aspect, 1.));
                }
            }
        } else if(time >= sequenceItemStartTime && fadeInTransitionType > 0 && fadeInTransitionTime > 0.0 && time <= sequenceItemStartTime + fadeInTransitionTime) {
            float fadeInEnd = sequenceItemStartTime + fadeInTransitionTime;
            float t = (time - sequenceItemStartTime) / (fadeInTransitionTime);
            if(fadeInTransitionType == 1) {
                gl_FragColor.a = (time - sequenceItemStartTime) / (fadeInTransitionTime);
            } else if(fadeInTransitionType == 2) {
                gl_FragColor *= (random2(vTextureCoord + time).x * t);
            } else if(fadeInTransitionType == 3 && (time / fadeInEnd) < 1.0) { // not sure why minus a quatrter
                vec2 cPos = -1.0 + 2.0 * uv;
                // distance of current pixel from center
                float cLength = length(cPos);
                vec2 newUv = uv+(cPos/cLength)*cos(cLength*12.0-time*4.0) * 0.03;
                gl_FragColor = texture2D(uSampler,newUv);
                gl_FragColor.a = t;
            } else if(fadeInTransitionType == 4) { // erase color increase threshold over time until black
                vec4 diffuse = texture2D(uSampler,uv);
                float rDiff = abs(diffuse.r - fadeInColorThreshold.r);
                float gDiff = abs(diffuse.g - fadeInColorThreshold.g);
                float bDiff = abs(diffuse.b - fadeInColorThreshold.b);
                float rThreshold = 1.0 - t;
                float gThreshold = 1.0 - t;
                float bThreshold = 1.0 - t;
                if(rDiff < rThreshold && gDiff < gThreshold && bDiff < bThreshold) {
                    discard;
                } else {
                    gl_FragColor = diffuse;
                }  
            } else if(fadeInTransitionType == 5) {
                vec4 diffuse = texture2D(uSampler,uv);
                gl_FragColor = mix(vec4(1.0,1.0,1.0,1.0), diffuse, t);
            }
        } else if(clipEffect > 0) {
            if(clipEffect == 1) {
                float flicker = cos(time * (25.0 * clipEffectIntensity));
                if(flicker > 0.0) {
                    vec4 diffuse = texture2D(uSampler,uv);
                    if(clipEffectControlAlpha > 0) {
                        gl_FragColor = vec4(1.0 - diffuse.r, 1.0 - diffuse.g, 1.0 - diffuse.b, 0.0);
                    } else {
                        gl_FragColor = vec4(1.0 - diffuse.r, 1.0 - diffuse.g, 1.0 - diffuse.b, diffuse.a);
                    }
                }
            } else if(clipEffect == 2) { // ripple
                vec2 cPos = -1.0 + 2.0 * uv;
                // distance of current pixel from center
                float cLength = length(cPos);
                vec2 newUv = uv+(cPos/cLength)*cos(cLength*12.0-time*4.0) * 0.03 * clipEffectIntensity;
                gl_FragColor = texture2D(uSampler,newUv);
                if(clipEffectControlAlpha > 0) {
                    gl_FragColor.a = 1.0 - cos(cLength*12.0-time*4.0) * 0.25 * clipEffectIntensity;
                }
            } else if(clipEffect == 3) {
                gl_FragColor = vec4(sharpenKernel(uv, clipEffectIntensity), 1.0);
            } else if(clipEffect == 4) {
                gl_FragColor = vec4(sharpenKernel(uv, clipEffectIntensity), 1.0);
            } else if(clipEffect == 5) {
                gl_FragColor = vec4(sharpenKernel(uv, clipEffectIntensity), 1.0);
            } else if(clipEffect == 6) {
                gl_FragColor = vec4(blurKernel(uv, clipEffectIntensity), 1.0);
            } else if(clipEffect == 7) {
                gl_FragColor = vec4(embossKernel(uv, clipEffectIntensity), 1.0);
            } else if(clipEffect == 8) {
                vec4 diffuse = texture2D(uSampler, rotateUv(uv, time * clipEffectIntensity, vec2(.5)));
                gl_FragColor = diffuse;
            }
        }
    }
`;function ke(e,t,n){const i=Q(e,e.VERTEX_SHADER,t),l=Q(e,e.FRAGMENT_SHADER,n),a=e.createProgram();return e.attachShader(a,i),e.attachShader(a,l),e.linkProgram(a),e.getProgramParameter(a,e.LINK_STATUS)?a:(console.error(`Unable to initialize the shader program: ${e.getProgramInfoLog(a)}`),null)}function Q(e,t,n){const i=e.createShader(t);return e.shaderSource(i,n),e.compileShader(i),e.getShaderParameter(i,e.COMPILE_STATUS)?i:(console.error(`An error occured compiling shader:
${e.getShaderInfoLog(i)}`),e.deleteShader(i),null)}function ee(e){return(e&e-1)===0}function $(e,t){const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n);const i=0,l=e.RGBA,a=1,o=1,s=0,c=e.RGBA,u=e.UNSIGNED_BYTE,m=new Uint8Array([0,0,255,255]);e.texImage2D(e.TEXTURE_2D,i,l,a,o,s,c,u,m);const p=new Image;return p.crossOrigin="anonymous",p.src=t,p.onload=()=>{e.bindTexture(e.TEXTURE_2D,n),e.texImage2D(e.TEXTURE_2D,i,l,c,u,p),ee(p.width)&&ee(p.height)?e.generateMipmap(e.TEXTURE_2D):(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST)),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0)},n}let d=[[],[],[],[]],W,T=0,z=0,b=!1,y=25,B=!1,x=100,k=[],w=!1,G=!1,L=new De({workers:1,quality:10,width:256,height:256,workerScript:"/my-graphics-demos/gif/gif.worker.js"}),P=15,U="mp4";async function Ue(){const e=document.querySelector("#gl-canvas"),t=e.getContext("webgl");if(W=t,t===null){alert("Unable to initialize WebGL. Your browser or machine may not support it.");return}t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT);const n=ke(t,Fe,He),i={program:n,attribLocations:{vertexPosition:t.getAttribLocation(n,"aVertexPosition"),textureCoord:t.getAttribLocation(n,"aTextureCoord")},uniformLocations:{projectionMatrix:t.getUniformLocation(n,"uProjectionMatrix"),modelViewMatrix:t.getUniformLocation(n,"uModelViewMatrix"),uSampler:t.getUniformLocation(n,"uSampler"),time:t.getUniformLocation(n,"time"),transitionTime:t.getUniformLocation(n,"transitionTime"),sequenceItemLength:t.getUniformLocation(n,"sequenceItemLength"),transitionType:t.getUniformLocation(n,"transitionType"),transitionFadeType:t.getUniformLocation(n,"transitionFadeType"),sequenceIndex:t.getUniformLocation(n,"sequenceIndex"),sequenceItemStartTime:t.getUniformLocation(n,"sequenceItemStartTime"),colorThreshold:t.getUniformLocation(n,"colorThreshold"),fadeInColorThreshold:t.getUniformLocation(n,"fadeInColorThreshold"),fadeInTransitionTime:t.getUniformLocation(n,"fadeInTransitionTime"),fadeInTransitionType:t.getUniformLocation(n,"fadeInTransitionType"),clipEffect:t.getUniformLocation(n,"clipEffect"),clipEffectIntensity:t.getUniformLocation(n,"clipEffectIntensity"),fractalX:t.getUniformLocation(n,"fractalX"),fractalY:t.getUniformLocation(n,"fractalY"),fractalInitialZoom:t.getUniformLocation(n,"fractalInitialZoom"),invertFractal:t.getUniformLocation(n,"invertFractal"),clipEffectControlAlpha:t.getUniformLocation(n,"clipEffectControlAlpha"),pageCurlRadius:t.getUniformLocation(n,"pageCurlRadius"),pageCurlDir:t.getUniformLocation(n,"pageCurlDir")}},l=Re(t);$(t,"/my-graphics-demos/ceiling1.png");const a=$(t,"/my-graphics-demos/sky.png");var o=new FileReader,s=await fetch("sky.png");o.readAsDataURL(await s.blob()),o.addEventListener("load",m=>{d[0].push({name:"sky",imgData:m.target.result,texture:a,startTime:0,length:4,id:"0-0",transitionType:1,transitionTime:1,clipLayer:1,fadeInTransitionType:0,fadeInTransitionTime:1,transitionFadeType:!1,fractalInitialZoom:.0125,fractalX:-.95,fractalY:-.25,invertFractal:!1,pageCurlDir:45,pageCurlRadius:.1,clipType:"image"}),F()}),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!0),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0);let c=document.getElementById("errorPopup");L.on("progress",function(m){console.warn("progress"),console.warn(m);let p=document.getElementById("viewport");c.style.display="block",c.innerHTML="";let f=document.createElement("p"),h=document.createElement("div"),g=document.createElement("h1");if(h.className="popupHeader",g.innerHTML="RENDERING",f.innerHTML=`${(m*100).toFixed(4)}`,h.appendChild(g),c.appendChild(h),c.appendChild(f),c.style.left=`calc(50% - ${c.offsetWidth/2}px)`,p)p.style.background=`radial-gradient(circle at center, rgb(25, 255, 0) ${m*100}%, transparent ${100-m*100}%), url('/my-graphics-demos/uipamnel1.png') 100% center / cover`;else{let C=document.createElement("div");C.id="exportProgressBar",document.getElementById("viewport").appendChild(C)}}),L.on("error",function(m){let p=document.getElementById("errorPopup");p&&(M(SUCCESS,`An error has occured during export ${m.toString()}`),setTimeout(()=>{p.innerHTML="",p.style.display="none"},5e3))}),L.on("finished",function(m){let p=URL.createObjectURL(m),f=document.getElementById("downloadButton");f.href=p,f.download=`jakehsequencer${new Date(Date.now()).toISOString().replace(":","")}.gif`,f.click(),f.classList.remove("disabled"),G=!1,B=!1,w=!1,document.getElementById("sequencerStartStop").disabled=!1,document.getElementById("sequencerRestart").disabled=!1,c&&(M(SUCCESS,"Your gif is ready!!! It should have started downloading. If not, click the download button."),setTimeout(()=>{c.innerHTML="",c.style.display="none",document.getElementById("viewport").style.background=""},5e3)),L.running=!1});function u(m){if(m*=.001,b&&w==!1?(T=m-z,K()):w==!1&&(z=m),w==!1&&J(t,i,l,d,T),document.getElementById("timeValue").innerHTML=T.toFixed(4),B==!0){if(Y()=="gif")B=!1,J(t,i,l,d,T),k.length<x&&(e.toBlob(h=>{k.push(h),T=I()*(k.length/x);const g=new Image;g.src=URL.createObjectURL(h),g.onload=()=>{let C=I()*1e3/x;L.addFrame(g,{delay:Math.round(C)}),B=!0}}),M("CAPTURING FRAMES",`${k.length} / ${x} stored...`));else if(Y()=="video"){B=!1,console.warn("recording!!!"),M("Rendering video...",`rendering ${I()}s long video (${U}) @ ${P} fps`);let h=_e(e,I()*1e3,P,U);T=0,b=!0;var p=document.createElement("video");h.then(g=>{p.setAttribute("src",g),M("Success!!","Video successfully rendered. Download should begin automatically..."),setTimeout(()=>{c.innerHTML="",c.style.display="none",document.getElementById("viewport").style.background=""},5e3),b=!1,T=0,document.getElementById("sequencerStartStop").disabled=!1,document.getElementById("sequencerRestart").disabled=!1});var f=document.createElement("a");f.setAttribute("download",`jakehsequencer${new Date(Date.now()).toISOString().replace(":","")}.${U}`),h.then(g=>{f.setAttribute("href",g),f.click()})}}else L.frames.length>=x&&G==!1&&w==!0&&(G=!0,console.warn("GIFF"),L.render());requestAnimationFrame(u)}requestAnimationFrame(u)}Ue();function M(e,t){errorPopup.style.display="block",errorPopup.innerHTML="";let n=document.createElement("p"),i=document.createElement("div"),l=document.createElement("h1");i.className="popupHeader",l.innerHTML=e,n.innerHTML=t,i.appendChild(l),errorPopup.appendChild(i),errorPopup.appendChild(n),errorPopup.style.left=`calc(50% - ${errorPopup.offsetWidth/2}px)`}function _e(e,t,n,i){var l=[];return new Promise(function(a,o){let s=e.captureStream(n),c="video/webm; codecs=vp9";i=="mp4"&&(c="video/mp4");let u=new MediaRecorder(s,{mimeType:c});u.start(t||4e3),u.ondataavailable=function(m){l.push(m.data),u.state==="recording"&&u.stop()},u.onstop=function(m){var p=new Blob(l,{type:c.split(";")[0]}),f=URL.createObjectURL(p);a(f)}})}function I(){let e=0;for(let t=0;t<oe;t++){let n=0;if(d[t].length>0){for(let i=0;i<d[t].length;i++)n+=d[t][i].length;n>e&&(e=n)}}return e}function re(e){let t=0;for(let n=0;n<d[e].length;n++)t+=d[e][n].length;return t}function $e(){return document.getElementById("sequencerTimeline").offsetLeft}let Oe=4,ce=1,r;function se(e,t,n,i,l=Oe,a=ce,o=0,s=1,c=0){let u={name:e.name,texture:t,imgData:n,startTime:re(i),length:l,id:`${i}-${d[i].length.valueOf()}`,transitionType:o,transitionTime:a,transitionFadeType:!1,fractalInitialZoom:.0125,fractalX:-.95,fractalY:-.25,invertFractal:!1,clipEffectControlAlpha:!1,clipLayer:i+1,clipEffect:0,clipEffectIntensity:1,fadeInTransitionType:c,fadeInTransitionTime:s,clipType:"image",pageCurlDir:45,pageCurlRadius:.1};d[i].push(u),console.warn(u),ue(u),console.warn(d),document.getElementById("sequenceLengthValue").innerHTML=I().toFixed(4),x=P*I();let m=document.getElementById(`clipLayer${u.clipLayer}`),p=m.style.gridTemplateColumns.split(" ");p.push(`${u.length*y}px`),m.style.gridTemplateColumns=p.join(" ")}function R(e){N(e+1);let t=document.getElementById(`clipLayer${e+1}`),n=d[e];for(let l=0;l<n.length;l++){let a=d[e][l],o=d[e][l-1];if(o&&o.clipType!="gap"&&o.startTime+o.length<a.startTime){let s=a.startTime-(o.startTime+o.length);V(e,l,s)}else o&&o.clipType=="gap"&&o.startTime+o.length>a.startTime?o.length=a.startTime-o.startTime:!o&&a.startTime>0&&V(e,l,a.startTime)}for(let l=0;l<n.length;l++){let a=d[e][l];ue(a)}n=d[e];let i=n.map(l=>l.length*y);console.warn(i),t.style.gridTemplateColumns=i.join("px ")+"px",document.getElementById("sequenceLengthValue").innerHTML=I().toFixed(4)}function F(){console.warn("sequence update"),console.warn(d),de();for(let e=0;e<oe;e++)d[e].length>0&&R(e)}function de(){let e=document.getElementById("timelineRuler");e.innerHTML="";let t=e.offsetWidth,n=t/y;console.warn(`${t} / ${y}`),console.warn(n);for(let i=0;i<n;i++){let l=document.createElement("div");if(l.className="sequenceTimelineRulerTick",l.style.left=10+i*y+e.offsetLeft,i%5==0){let a=document.createElement("p");a.innerHTML=i.toString(),l.appendChild(a)}e.appendChild(l),console.warn("tick added")}}function ue(e,t=!1){let n=document.createElement("div"),i=document.getElementById(`clipLayer${e.clipLayer}`);if(e.clipType=="image"){let l=document.createElement("div"),a=document.createElement("img"),o=document.createElement("p");n.className="sequenceItemPlaceholder",n.style.background=`linear-gradient(to right, rgb(0, 255, 13) ${(e.length-e.transitionTime)/e.length*100}%, rgb(41, 0, 79))`,o.innerHTML=e.name,o.className="sequenceItemName",a.className="sequenceThumbnail",a.src=e.imgData,n.id=e.id,l.className="clipNameThumbContainer",l.appendChild(o),l.appendChild(a),n.appendChild(l);let s=document.createElement("div");document.createElement("div"),s.className="lengthController",s.id=`${n.id}-lengthController`,s.addEventListener("touchstart",u=>u.preventDefault()),s.addEventListener("pointerdown",qe),l.addEventListener("pointerdown",Ae),l.addEventListener("touchstart",u=>u.preventDefault());let c=+e.id.split("-")[1];n.style.gridColumn=c+1,n.appendChild(s),i.appendChild(n),n.addEventListener("click",Xe)}else{n.className="gapPlaceholder",n.id=e.id;let l=+e.id.split("-")[1];n.style.gridColumn=l+1,i.appendChild(n)}}let j=!1,O=!1,q=!1,D=!1,_=!1,Z=-1,pe=0,me=0,v=0,X=0,A=0,fe=0,S,E;function qe(e){for(console.warn("STARTING RESIZE"),j=!0,pe=e.clientX,S=e.target;S.className.includes("sequenceItemPlaceholder")==!1;)S=S.parentElement;let n=S.id.split("-"),i=n[0],l=n[1],a=d[i][l];Te(`${i}-${l}`),document.getElementById(`${i}-${l}`),document.getElementById(`clipLayer#${+i+1}`),fe=a.length*y}function Ae(e){for(console.warn("STARTING MOVE"),O=!0,me=e.clientX,E=e.target;E.id.includes("-")==!1;)E=E.parentElement;let t=+E.id.split("-")[1],n=+E.id.split("-")[0];Te(`${n}-${t}`);let i=d[n][t],l=d[n][t-1];l&&l.clipType=="gap"&&(X=+document.getElementById(`clipLayer${n+1}`).style.gridTemplateColumns.split(" ")[t-1].replace("px",""),Z=l.length+l.startTime),A=i.startTime,console.warn(`initial clip start: ${A}`),console.warn(`initial gap width: ${X}`)}function V(e,t,n=.01){let i=d[e][t],l={name:"gap",startTime:n!=.01?i.startTime-n:i.startTime,length:n,id:`${e}-${t}`,transitionType:0,transitionTime:ce,clipLayer:e+1,clipEffect:0,clipEffectIntensity:1,fadeInTransitionType:0,fadeInTransitionTime:0,clipType:"gap"};d[e].splice(t,0,l);for(let a=t+1;a<d[e].length;a++)a!=t+1&&(d[e][a].startTime+=n),d[e][a].id=`${e}-${a}`;n==.01&&R(e)}document.addEventListener("pointermove",function(e){let t=e.clientX;if(j==!0&&S&&e.target.id.includes("-")&&e.target.id.split("-").length==3){let n=S.id.split("-");console.warn(n);let i=+n[0],l=+n[1];d[i][l];let o=(t-pe+fe)/y;Se(o),Ce(o),R(i)}else if(O&&E){let n=+E.id.split("-")[1],i=+E.id.split("-")[0];_==!0&&(n+=1);let l=d[i][n];v=(t-me)/y;let a=d[i][n-1];console.warn(v),d[i].length>=1&&v>0&&v+A>Z&&(console.warn(v),a&&a.clipType=="gap"&&(D=!0),D==!0&&a?(l.startTime=v+.01+A,_==!0?a.length=v:a.length=v+X/y,console.warn("updating layer"),R(i)):D==!1&&(console.warn("inserting gap"),V(i,n),_=!0,D=!0,l.startTime=v+.01)),Le(l.startTime)}else if(q){let n=document.getElementById("timelineRuler");T=(e.clientX-n.offsetLeft)/y,K()}});document.addEventListener("pointerup",function(e){if(S&&(console.warn("completing resize"),j=!1,S=void 0,r=void 0),E&&O==!0){O=!1,D=!1,_=!1;let t=r.id.split("-");Be(r.clipLayer-1,t[1],v),E=void 0,v=0,Z=-1,console.warn("MOVE COMPLETE")}q&&(q=!1)});function We(e){let t=e.target.value;console.warn(e.target.value),r.transitionType=+e.target.value,ge(t)}function ge(e){let t=document.getElementById("transitionStyleInputSection");if(ze(),e==4){t.style.flexDirection="row";let n=document.createElement("p");n.id="colorThresholdInputLabel",n.innerHTML="threshold color";let i=document.createElement("input");i.type="color",i.id="colorThresholdPicker",i.addEventListener("change",function(l){console.warn(l.target.value);let a=l.target.value,o=ye(a);r.colorThreshold=o,console.warn(r.colorThreshold)}),t.appendChild(n),t.appendChild(i)}else if(e==6){t.style.flexDirection="column";let n=document.createElement("p");n.id="fractalFadeTypeInputLabel",n.innerHTML="Fade to black?";let i=document.createElement("input");i.type="checkbox",i.style.width="30px",i.style.height="30px",i.id="fadeTypeInput",i.value=r.transitionFadeType;let l=document.createElement("div");l.style.display="flex",l.style.alignItems="center";let a=document.createElement("div");a.style.display="flex",a.style.alignItems="center";let o=document.createElement("div");o.style.display="flex",o.style.alignItems="center";let s=document.createElement("p");s.innerHTML="Fractal Coords";let c=document.createElement("input");c.type="number",c.id="fractalXInput",c.value=r.fractalX,c.step="any";let u=document.createElement("input");u.type="number",u.id="fractalYInput",u.value=r.fractalY,u.step="any",l.appendChild(s),l.appendChild(c),l.appendChild(u);let m=document.createElement("p");m.innerHTML="InitialZoom";let p=document.createElement("input");p.type="number",p.id="fractalZoomInput",p.value=r.fractalInitialZoom,p.step="any",t.appendChild(l),a.appendChild(m),a.appendChild(p),t.appendChild(a),i.addEventListener("change",function(f){r.transitionFadeType=f.target.checked}),c.addEventListener("change",function(f){r.fractalX=f.target.value}),u.addEventListener("change",function(f){r.fractalY=f.target.value}),p.addEventListener("change",function(f){r.fractalInitialZoom=f.target.value}),o.appendChild(n),o.appendChild(i),t.appendChild(o)}else if(e==7){let n=document.createElement("div"),i=document.createElement("div"),l=document.createElement("p"),a=document.createElement("p");l.innerHTML="Curl radius",a.innerHTML="Curl direction";let o=document.createElement("input"),s=document.createElement("input");o.type="number",s.type="number",o.addEventListener("change",function(c){r.pageCurlRadius=+c.target.value}),s.addEventListener("change",function(c){r.pageCurlDir=+c.target.value*(Math.PI/180)}),n.appendChild(l),n.appendChild(o),i.appendChild(a),i.appendChild(s),n.style.display="flex",i.style.display="flex",t.appendChild(n),t.appendChild(i),t.style.display="flex",t.style.flexDirection="column",t.style.marginLeft="5px",s.value=r.pageCurlDir,o.value=r.pageCurlRadius}}function he(){let e=document.getElementById("fadeInStyleSection"),t=document.createElement("p");t.id="fadeInColorThresholdInputLabel",t.innerHTML="threshold color";let n=document.createElement("input");n.type="color",n.id="fadeInColorThresholdPicker",n.addEventListener("change",function(i){console.warn(i.target.value);let l=i.target.value,a=ye(l);r.fadeInColorThresholdolorThreshold=a,console.warn(r.colorThreshold)}),e.appendChild(t),e.appendChild(n)}function Ne(){let e=document.getElementById("fadeInStyleSection");e.innerHTML=""}function Ge(e){let t=document.getElementById("outputTypeOptions");if(t.innerHTML="",e=="gif"){document.createElement("div");let n=document.createElement("input");n.type="number"}else if(e=="video"){let n=document.createElement("div");n.className="renderSettingsItem";let i=document.createElement("select"),l=document.createElement("option");l.value="mp4",l.innerHTML="MP4";let a=document.createElement("option");a.value="webm",a.innerHTML="WEBM",i.appendChild(l),i.appendChild(a);let o=document.createElement("p");o.innerHTML="Video Type",n.appendChild(o),n.appendChild(i),t.appendChild(n),i.addEventListener("change",function(s){U=s.target.value})}}function ye(e){let t=e.replace("#",""),n=parseInt(t.substring(0,2),16),i=parseInt(t.substring(2,4),16),l=parseInt(t.substring(4,6),16);return[n/255,i/255,l/255]}function ve(e,t,n){return"#"+(1<<24|e<<16|t<<8|n).toString(16).slice(1)}function ze(){let e=document.getElementById("transitionStyleInputSection");e.innerHTML=""}function Xe(e){r&&document.getElementById(`${r.id}`).classList.remove("selected"),Ee();let t=e.target.id,n=e.target;for(;!t||t&&t.includes("-")==!1;)t=n.parentElement.id,n=n.parentElement,console.warn(t);let i=0,l=0;if(t.includes("-")==!0&&t.split("-").length==2){let a=t.split("-");i=+a[0],l=+a[1],r=d[i][l],document.getElementById(`${t}`).classList.add("selected"),Ie(r)}}function Te(e){Ee();let t=e,n=0,i=0;if(t.includes("-")==!0&&t.split("-").length==2){let l=t.split("-");n=+l[0],i=+l[1],r=d[n][i],document.getElementById(`${t}`).classList.add("selected"),Ie(r)}}function Ee(){r&&document.getElementById(`${r.id}`).classList.remove("selected"),r=void 0;for(let e=0;e<5;e++){let t=document.getElementById(`clipLayer${e+1}`);for(const n of t.children)n.classList.remove("selected")}}function Ie(e){var t,n;(t=document.getElementById("colorThresholdInputLabel"))==null||t.remove(),(n=document.getElementById("colorThresholdPicker"))==null||n.remove(),Ve(e.name),Ce(e.length),Ye(e.transitionType),ge(e.transitionType),je(e.transitionTime),Le(e.startTime),Ze(e.clipLayer),Je(e.fadeInTransitionType),Qe(e.clipEffect),Ke(e.fadeInTransitionTime),e.colorThreshold&&tt(e.colorThreshold),e.fadeInTransitionType==4&&e.fadeInColorThreshold&&nt(e.colorThreshold)}function Ve(e){document.getElementById("clipNameLabel").innerHTML=e}function Ce(e){document.getElementById("clipLengthInput").value=+e}function Ye(e){document.getElementById("transitionSelectionInput").value=e}function je(e){document.getElementById("transitionLengthInput").value=e}function Le(e){document.getElementById("clipStartTimeInput").value=e}function Ze(e){document.getElementById("clipLayerSelection").value=e}function Se(e){let t=e-r.length;r.length=e;let n=+r.id.split("-")[1];Be(r.clipLayer-1,n,t)}function Ke(e){document.getElementById("fadeInLengthInput").value=e}function Je(e){document.getElementById("fadeInSelectionInput").value=e}function Qe(e){document.getElementById("clipEffectInput").value=e,e>0?be():xe()}function xe(){let e=document.getElementById("clipEffectParameterSection");e.innerHTML=""}function be(){let e=document.getElementById("clipEffectParameterSection");if(e.style.display="flex",e.style.flexDirection="column",e.innerHTML)return;let t=document.createElement("p"),n=document.createElement("p");t.innerHTML="Effect Intensity",n.innerHTML="Control Alpha?";let i=document.createElement("div");i.style.display="flex";let l=document.createElement("div");l.style.display="flex";let a=document.createElement("input"),o=document.createElement("input");o.type="checkbox",a.id="clipEffectIntensitySlider",a.type="range",a.value=r.clipEffectIntensity,a.step=.25,a.max=10,a.min=-10,a.addEventListener("input",function(c){let u=document.getElementById("clipEffectIntensityInput");u.value=+c.target.value,et(+c.target.value)}),o.addEventListener("change",function(c){console.warn(c.target.checked),r.clipEffectControlAlpha=c.target.checked});let s=document.createElement("input");s.id="clipEffectIntensityInput",s.type="number",s.value=r.clipEffectIntensity,o.checked=r.clipEffectControlAlpha,i.appendChild(t),i.appendChild(a),i.appendChild(s),l.appendChild(n),l.appendChild(o),e.appendChild(i),e.appendChild(l)}function et(e){r.clipEffectIntensity=e}function tt(e){console.warn(e);let t=ve(Math.round(e[0]*255),Math.round(e[1]*255),Math.round(e[2]*255));console.warn(t),document.getElementById("colorThresholdPicker").value=t}function nt(e){document.getElementById("fadeInStyleSection").innerHTML||he(),console.warn(e);let n=ve(Math.round(e[0]*255),Math.round(e[1]*255),Math.round(e[2]*255));console.warn(n),document.getElementById("fadeInColorThresholdPicker").value=n}function Be(e,t,n){console.warn(`updating start times on ${e}`);let i=d[e];if(i.length>0)for(let l=0;l<i.length;l++)l>t&&(i[l].startTime+=n);console.warn("start times fixed"),console.warn(i)}function it(e,t){let n=d[e][t-1],i=d[e][t+1],l=d[e].length,a=d[e].splice(t,1);if(i&&i.clipType=="gap"&&n&&n.clipType=="gap"){let o=+i.id.split("-")[1],s=+n.id.split("-")[1];o>=l-1?d[e].splice(s,2):(d[e].splice(o-1,2),n.length+=i.length)}for(let o=t;o<d[e].length;o++)d[e][o].startTime-=a[0].length,d[e][o].id=`${e}-${o}`;return a[0]}function lt(e,t){let n=d[e];t.id=`${e}-${n.length}`,t.startTime=re(e),n.push(t)}function K(){document.getElementById("sequenceMarker").style.left=10+T*y+$e()}function N(e){document.getElementById(`clipLayer${e}`).innerHTML=""}function at(){T=0,K(),b=!1,Y()=="gif"&&(w=!0),document.querySelector("#gl-canvas"),I(),B=!0,document.getElementById("sequencerStartStop").disabled=!0,document.getElementById("sequencerRestart").disabled=!0}document.getElementById("sequenceItemInput").addEventListener("change",function(e){let t=e.target.files[0];var n=new FileReader;n.addEventListener("load",function(i){const l=$(W,i.target.result);se(t,l,i.target.result,0)}),t&&n.readAsDataURL(t)});document.getElementById("imageSequenceInput").addEventListener("change",function(e){let t=e.target.files,n=[],i=ot(t.length);function l(a){return new Promise(function(o,s){let c=new FileReader;c.addEventListener("load",function(u){o(u.target.result)}),c.readAsDataURL(a)})}i.then(a=>{if(t&&t.length>0)for(let o=0;o<t.length;o++)n.push(l(t[o]));Promise.all(n).then(o=>{for(let s=0;s<o.length;s++){const c=$(W,o[s]);se(t[s],c,o[s],1,a.clipLength,a.fadeOutTransitionTime,a.fadeOutTransitionType,a.fadeInTransitionTime,a.fadeInTransitionType)}})}).catch(()=>{document.getElementById("imageSequenceConfirmationContainer").remove(),e.target.value=void 0})});function ot(e){let t=document.createElement("div");t.id="imageSequenceConfirmationContainer",t.className="smallMessage",t.style.display="block",t.innerHTML="";let n=document.createElement("p"),i=document.createElement("div"),l=document.createElement("h1");i.className="popupHeader",l.innerHTML="Image Sequence Settings",n.innerHTML=`You are about to add ${e} images.`,i.appendChild(l),t.appendChild(i),t.appendChild(n),setTimeout(()=>{t.style.left=`calc(50% - ${t.offsetWidth/2}px)`},200);let a=document.createElement("div");a.style.display="flex",a.className="sequenceInfoItem";let o=document.createElement("p");o.innerHTML="Clip Length";let s=document.createElement("input");s.value=4,s.type="number",a.appendChild(o),a.appendChild(s),t.appendChild(a);let c=document.createElement("div");c.style.display="flex",c.className="sequenceInfoItem";let u=document.createElement("p");u.innerHTML="Transition Length";let m=document.createElement("input");m.value=1,m.type="number",c.appendChild(u),c.appendChild(m),t.appendChild(c);let p=document.createElement("div");p.style.display="flex",p.className="sequenceInfoItem";let f=document.createElement("p");f.innerHTML="Transition Type";let h=document.getElementById("transitionSelectionInput").cloneNode(!0);p.appendChild(f),p.appendChild(h),t.appendChild(p);let g=document.createElement("div");g.style.display="flex";let C=document.createElement("button");C.innerHTML="add images",C.className="controlbutton2";let H=document.createElement("button");return H.innerHTML="cancel",H.className="controlButton",g.appendChild(H),g.appendChild(C),t.appendChild(g),document.body.appendChild(t),new Promise(function(Pe,Me){C.addEventListener("click",function(){Pe({clipLength:+s.value,fadeInTransitionType:0,fadeInTransitionTime:0,clipEffect:0,clipEffectIntensity:0,fadeOutTransitionType:+h.value,fadeOutTransitionTime:+m.value}),t.remove()}),H.addEventListener("click",function(gt){Me()})})}document.getElementById("sequencerStartStop").addEventListener("click",function(e){b=!b,b?e.target.innerHTML="stop":e.target.innerHTML="play"});document.getElementById("sequencerRestart").addEventListener("click",function(e){z=T.valueOf()});document.getElementById("transitionSelectionInput").addEventListener("change",We);document.getElementById("clipLengthInput").addEventListener("change",function(e){console.warn("updating length"),Se(+e.target.value),r&&R(r.clipLayer-1)});document.getElementById("exportButton").addEventListener("click",function(e){at()});document.getElementById("timelineHorizontalScale").addEventListener("input",function(e){console.warn(e.target.value),y=+e.target.value,N(1),F()});document.getElementById("removeClipButton").addEventListener("click",function(e){d[r.clipLayer-1].splice(+r.id.split("-")[1],1),r=void 0,N(1),F(),x=P*I()});document.getElementById("frameRateInput").addEventListener("change",function(e){P=+e.target.value,x=P*I()});document.getElementById("outputWidthInput").addEventListener("change",function(e){L.setOption("width",+event.target.value),L.setOption("height",+event.target.value),document.getElementById("gl-canvas").style.width=`${e.target.value}px`,W.viewport(0,0,document.getElementById("gl-canvas").clientWidth,document.getElementById("gl-canvas").clientHeight)});document.getElementById("viewportScale").addEventListener("input",function(e){document.getElementById("gl-canvas").style.width=`${+e.target.value*256}px`});document.getElementById("clipLayerSelection").addEventListener("change",function(e){if(r){let t=r.id.split("-"),n=+t[0],i=+t[1];console.warn(e),console.warn(e.target.value),r.clipLayer=+e.target.value,we();let l=it(n,i);lt(+e.target.value-1,l),F()}});document.getElementById("clipStartTimeInput").addEventListener("change",function(e){r&&(r.startTime=+e.target.value,we(),F())});document.getElementById("transitionLengthInput").addEventListener("change",function(e){r&&(r.transitionTime=+e.target.value)});document.getElementById("fadeInSelectionInput").addEventListener("change",function(e){r&&(r.fadeInTransitionType=+e.target.value,r.fadeInTransitionType==4?he():Ne())});document.getElementById("clipEffectInput").addEventListener("change",function(e){r&&(r.clipEffect=+e.target.value,r.clipEffect>0?be():xe())});document.getElementById("fadeInLengthInput").addEventListener("change",function(e){r&&(r.fadeInTransitionTime=+e.target.value)});document.getElementById("timelineHelpButton").addEventListener("click",function(e){rt()});var ne;(ne=document.getElementById("closePopup1Button"))==null||ne.addEventListener("click",function(e){ct()});document.getElementById("addImageHelpButton").addEventListener("click",function(e){st()});var ie;(ie=document.getElementById("closePopup2Button"))==null||ie.addEventListener("click",function(e){dt()});document.getElementById("clipSettingsHelpButton").addEventListener("click",function(e){ut()});var le;(le=document.getElementById("closePopup3Button"))==null||le.addEventListener("click",function(e){pt()});document.getElementById("renderSettingsHelpButton").addEventListener("click",function(e){mt()});var ae;(ae=document.getElementById("closePopup4Button"))==null||ae.addEventListener("click",function(e){ft()});document.getElementById("sequencerTimeline").addEventListener("scroll",function(e){document.getElementById("timelineRuler").style.top=`${window.visualViewport.offsetTop}px`});document.getElementById("timelineRuler").addEventListener("pointerdown",function(e){q=!0});document.getElementById("outputTypeInput").addEventListener("change",function(e){Ge(e.target.value)});window.addEventListener("resize",()=>{de()});function rt(){document.getElementById("helpPopup1").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup1").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function ct(){document.getElementById("helpPopup1").style.display="none",document.getElementById("popupGlass").style.display="none"}function st(){document.getElementById("helpPopup2").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup2").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function dt(){document.getElementById("helpPopup2").style.display="none",document.getElementById("popupGlass").style.display="none"}function ut(){document.getElementById("helpPopup3").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup3").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function pt(){document.getElementById("helpPopup3").style.display="none",document.getElementById("popupGlass").style.display="none"}function mt(){document.getElementById("helpPopup4").style.display="block",document.getElementById("popupGlass").style.display="block",console.warn(window.scrollTop),document.getElementById("helpPopup4").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function ft(){document.getElementById("helpPopup4").style.display="none",document.getElementById("popupGlass").style.display="none"}function we(){for(let e=1;e<5;e++)N(e)}function Y(){return document.getElementById("outputTypeInput").value}var te=document.getElementById("sequencerTimeline");te.scrollTop=te.scrollHeight;
