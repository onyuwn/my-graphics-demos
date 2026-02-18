import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{G as Ie,i as Le,d as X}from"./gif-ckf_XKgh.js";const J=4,Ce=`
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
`,Se=`
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
            }
        } else if(time >= sequenceItemStartTime && fadeInTransitionType > 0 && fadeInTransitionTime > 0.0 && time <= sequenceItemStartTime + fadeInTransitionTime) {
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
            } else if(fadeInTransitionType == 4) { // erase color increase threshold over time until black
                vec4 diffuse = texture2D(uSampler,uv);
                float rDiff = abs(diffuse.r - fadeInColorThreshold.r);
                float gDiff = abs(diffuse.g - fadeInColorThreshold.g);
                float bDiff = abs(diffuse.b - fadeInColorThreshold.b);
                float rThreshold = 1.0 - (time / fadeInEnd);
                float gThreshold = 1.0 - (time / fadeInEnd);
                float bThreshold = 1.0 - (time / fadeInEnd);
                if(rDiff < rThreshold && gDiff < gThreshold && bDiff < bThreshold) {
                    discard;
                } else {
                    gl_FragColor = diffuse;
                }  
            } else if(fadeInTransitionType == 5) {
                vec4 diffuse = texture2D(uSampler,uv);
                gl_FragColor = mix(vec4(1.0,1.0,1.0,1.0), diffuse, (time / fadeInEnd));
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
        //gl_FragColor.a = time;
    }
`;function Be(e,t,n){const i=z(e,e.VERTEX_SHADER,t),l=z(e,e.FRAGMENT_SHADER,n),o=e.createProgram();return e.attachShader(o,i),e.attachShader(o,l),e.linkProgram(o),e.getProgramParameter(o,e.LINK_STATUS)?o:(console.error(`Unable to initialize the shader program: ${e.getProgramInfoLog(o)}`),null)}function z(e,t,n){const i=e.createShader(t);return e.shaderSource(i,n),e.compileShader(i),e.getShaderParameter(i,e.COMPILE_STATUS)?i:(console.error(`An error occured compiling shader:
${e.getShaderInfoLog(i)}`),e.deleteShader(i),null)}function N(e){return(e&e-1)===0}function R(e,t){const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n);const i=0,l=e.RGBA,o=1,r=1,s=0,d=e.RGBA,u=e.UNSIGNED_BYTE,m=new Uint8Array([0,0,255,255]);e.texImage2D(e.TEXTURE_2D,i,l,o,r,s,d,u,m);const f=new Image;return f.crossOrigin="anonymous",f.src=t,f.onload=()=>{e.bindTexture(e.TEXTURE_2D,n),e.texImage2D(e.TEXTURE_2D,i,l,d,u,f),N(f.width)&&N(f.height)?e.generateMipmap(e.TEXTURE_2D):(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST)),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0)},n}let c=[[],[],[],[]],Q,E=0,H=0,w=!1,v=25,B=!1,C=100,$=[],S=!1,D=!1,L=new Ie({workers:1,quality:10,width:256,height:256,workerScript:"/my-graphics-demos/gif/gif.worker.js"}),M=15;function xe(){const e=document.querySelector("#gl-canvas"),t=e.getContext("webgl");if(Q=t,t===null){alert("Unable to initialize WebGL. Your browser or machine may not support it.");return}t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT);const n=Be(t,Ce,Se),i={program:n,attribLocations:{vertexPosition:t.getAttribLocation(n,"aVertexPosition"),textureCoord:t.getAttribLocation(n,"aTextureCoord")},uniformLocations:{projectionMatrix:t.getUniformLocation(n,"uProjectionMatrix"),modelViewMatrix:t.getUniformLocation(n,"uModelViewMatrix"),uSampler:t.getUniformLocation(n,"uSampler"),time:t.getUniformLocation(n,"time"),transitionTime:t.getUniformLocation(n,"transitionTime"),sequenceItemLength:t.getUniformLocation(n,"sequenceItemLength"),transitionType:t.getUniformLocation(n,"transitionType"),transitionFadeType:t.getUniformLocation(n,"transitionFadeType"),sequenceIndex:t.getUniformLocation(n,"sequenceIndex"),sequenceItemStartTime:t.getUniformLocation(n,"sequenceItemStartTime"),colorThreshold:t.getUniformLocation(n,"colorThreshold"),fadeInColorThreshold:t.getUniformLocation(n,"fadeInColorThreshold"),fadeInTransitionTime:t.getUniformLocation(n,"fadeInTransitionTime"),fadeInTransitionType:t.getUniformLocation(n,"fadeInTransitionType"),clipEffect:t.getUniformLocation(n,"clipEffect"),clipEffectIntensity:t.getUniformLocation(n,"clipEffectIntensity"),fractalX:t.getUniformLocation(n,"fractalX"),fractalY:t.getUniformLocation(n,"fractalY"),fractalInitialZoom:t.getUniformLocation(n,"fractalInitialZoom"),invertFractal:t.getUniformLocation(n,"invertFractal"),clipEffectControlAlpha:t.getUniformLocation(n,"clipEffectControlAlpha")}},l=Le(t);R(t,"/my-graphics-demos/ceiling1.png");const o=R(t,"/my-graphics-demos/sky.png");c[0].push({name:"test2",texture:o,startTime:0,length:4,id:"0-0",transitionType:1,transitionTime:1,clipLayer:1,fadeInTransitionType:0,fadeInTransitionTime:1,transitionFadeType:!1,fractalInitialZoom:.0125,fractalX:-.95,fractalY:-.25,invertFractal:!1,clipType:"image"}),P(),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!0),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),L.on("progress",function(s){console.warn("progress"),console.warn(s);let d=document.getElementById("viewport");if(d)d.style.background=`radial-gradient(circle at center, rgb(25, 255, 0) ${s*100}%, transparent ${100-s*100}%), url('/my-graphics-demos/uipamnel1.png') 100% center / cover`;else{let u=document.createElement("div");u.id="exportProgressBar",document.getElementById("viewport").appendChild(u)}}),L.on("error",function(s){let d=document.getElementById("errorPopup");if(d){d.style.display="block";let u=document.createElement(p);u.innerHTML=`An error has occured during export ${s.toString()}`,d.appendChild(u),setTimeout(()=>{d.innerHTML="",d.style.display="none"},5e3)}}),L.on("finished",function(s){let d=URL.createObjectURL(s),u=document.getElementById("downloadButton");u.href=d,u.download=`jakehsequencer${new Date(Date.now()).toISOString().replace(":","")}.gif`,u.click(),u.classList.remove("disabled"),D=!1,B=!1,S=!1,document.getElementById("sequencerStartStop").disabled=!1,document.getElementById("sequencerRestart").disabled=!1;let m=document.getElementById("errorPopup");if(m){m.style.display="block";let f=document.createElement("p"),g=document.createElement("div"),G=document.createElement("h1");g.className="popupHeader",G.innerHTML="SUCCESS",f.innerHTML="Your gif is ready!!! It should have started downloading. If not, click the download button.",g.appendChild(G),m.appendChild(g),m.appendChild(f),setTimeout(()=>{m.innerHTML="",m.style.display="none",document.getElementById("exportProgressBar").remove()},5e3)}});function r(s){s*=.001,w&&S==!1?(E=s-H,Te()):S==!1&&(H=s),S==!1&&X(t,i,l,c,E),document.getElementById("timeValue").innerHTML=E.toFixed(4),B==!0?(B=!1,X(t,i,l,c,E),$.length<C&&e.toBlob(d=>{$.push(d),E=I()*($.length/C);const u=new Image;u.src=URL.createObjectURL(d),u.onload=()=>{let m=I()*1e3/C;L.addFrame(u,{delay:Math.round(m)}),B=!0}})):L.frames.length>=C&&D==!1&&S==!0&&(D=!0,console.warn("GIFF"),L.render()),requestAnimationFrame(r)}requestAnimationFrame(r)}xe();function I(){let e=0;for(let t=0;t<J;t++){let n=0;if(c[t].length>0){for(let i=0;i<c[t].length;i++)n+=c[t][i].length;n>e&&(e=n)}}return e}function ee(e){let t=0;for(let n=0;n<c[e].length;n++)t+=c[e][n].length;return t}function we(){return document.getElementById("sequencerTimeline").offsetLeft}let be=4,te=1,a;function Pe(e,t,n,i){let l={name:e.name,texture:t,imgData:n,startTime:ee(i),length:be,id:`${i}-${c[i].length.valueOf()}`,transitionType:0,transitionTime:te,transitionFadeType:!1,fractalInitialZoom:.0125,fractalX:-.95,fractalY:-.25,invertFractal:!1,clipEffectControlAlpha:!1,clipLayer:i+1,clipEffect:0,clipEffectIntensity:1,fadeInTransitionType:0,fadeInTransitionTime:1,clipType:"image"};c[i].push(l),console.warn(l),ne(l),console.warn(c),document.getElementById("sequenceLengthValue").innerHTML=I().toFixed(4),C=M*I();let o=document.getElementById(`clipLayer${l.clipLayer}`),r=o.style.gridTemplateColumns.split(" ");r.push(`${l.length*v}px`),o.style.gridTemplateColumns=r.join(" ")}function b(e){U(e+1);let t=document.getElementById(`clipLayer${e+1}`),n=c[e];for(let l=0;l<n.length;l++){let o=c[e][l],r=c[e][l-1];if(r&&r.clipType!="gap"&&r.startTime+r.length<o.startTime){let s=o.startTime-(r.startTime+r.length);O(e,l,s)}else r&&r.clipType=="gap"&&r.startTime+r.length>o.startTime?r.length=o.startTime-r.startTime:!r&&o.startTime>0&&O(e,l,o.startTime)}for(let l=0;l<n.length;l++){let o=c[e][l];ne(o)}n=c[e];let i=n.map(l=>l.length*v);console.warn(i),t.style.gridTemplateColumns=i.join("px ")+"px",document.getElementById("sequenceLengthValue").innerHTML=I().toFixed(4)}function P(){console.warn("sequence update"),console.warn(c),Fe();for(let e=0;e<J;e++)c[e].length>0&&b(e)}function Fe(){let e=document.getElementById("timelineRuler");e.innerHTML="";let t=e.offsetWidth,n=t/v;console.warn(`${t} / ${v}`),console.warn(n);for(let i=0;i<n;i++){let l=document.createElement("div");if(l.className="sequenceTimelineRulerTick",l.style.left=i*v+10,i%5==0){let o=document.createElement("p");o.innerHTML=i.toString(),l.appendChild(o)}e.appendChild(l),console.warn("tick added")}}function ne(e,t=!1){let n=document.createElement("div"),i=document.getElementById(`clipLayer${e.clipLayer}`);if(e.clipType=="image"){let l=document.createElement("div"),o=document.createElement("img"),r=document.createElement("p");n.className="sequenceItemPlaceholder",n.style.background=`linear-gradient(to right, rgb(0, 255, 13) ${(e.length-e.transitionTime)/e.length*100}%, rgb(41, 0, 79))`,r.innerHTML=e.name,r.className="sequenceItemName",o.className="sequenceThumbnail",n.id=e.id,l.className="clipNameThumbContainer",l.appendChild(r),l.appendChild(o),n.appendChild(l);let s=document.createElement("div");document.createElement("div"),s.className="lengthController",s.id=`${n.id}-lengthController`,s.addEventListener("touchstart",u=>u.preventDefault()),s.addEventListener("pointerdown",Me),l.addEventListener("pointerdown",ke),l.addEventListener("touchstart",u=>u.preventDefault());let d=+e.id.split("-")[1];n.style.gridColumn=d+1,n.appendChild(s),i.appendChild(n),n.addEventListener("click",De)}else{n.className="gapPlaceholder",n.id=e.id;let l=+e.id.split("-")[1];n.style.gridColumn=l+1,i.appendChild(n)}}let q=!1,k=!1,x=!1,F=!1,W=-1,ie=0,le=0,h=0,A=0,_=0,oe=0,T,y;function Me(e){for(console.warn("STARTING RESIZE"),q=!0,ie=e.clientX,T=e.target;T.className.includes("sequenceItemPlaceholder")==!1;)T=T.parentElement;let n=T.id.split("-"),i=n[0],l=n[1],o=c[i][l];de(`${i}-${l}`),document.getElementById(`${i}-${l}`),document.getElementById(`clipLayer#${+i+1}`),oe=o.length*v}function ke(e){for(console.warn("STARTING MOVE"),k=!0,le=e.clientX,y=e.target;y.id.includes("-")==!1;)y=y.parentElement;let t=+y.id.split("-")[1],n=+y.id.split("-")[0];de(`${n}-${t}`);let i=c[n][t],l=c[n][t-1];l&&l.clipType=="gap"&&(A=+document.getElementById(`clipLayer${n+1}`).style.gridTemplateColumns.split(" ")[t-1].replace("px",""),W=l.length+l.startTime),_=i.startTime,console.warn(`initial clip start: ${_}`),console.warn(`initial gap width: ${A}`)}function O(e,t,n=.01){let i=c[e][t],l={name:"gap",startTime:n!=.01?i.startTime-n:i.startTime,length:n,id:`${e}-${t}`,transitionType:0,transitionTime:te,clipLayer:e+1,clipEffect:0,clipEffectIntensity:1,fadeInTransitionType:0,fadeInTransitionTime:0,clipType:"gap"};c[e].splice(t,0,l);for(let o=t+1;o<c[e].length;o++)o!=t+1&&(c[e][o].startTime+=n),c[e][o].id=`${e}-${o}`;n==.01&&b(e)}document.addEventListener("pointermove",function(e){let t=e.clientX;if(q==!0&&T&&e.target.id.includes("-")&&e.target.id.split("-").length==3){let n=T.id.split("-");console.warn(n);let i=+n[0],l=+n[1];c[i][l];let r=(t-ie+oe)/v;ge(r),fe(r),b(i)}else if(k&&y){let n=+y.id.split("-")[1],i=+y.id.split("-")[0];F==!0&&(n+=1);let l=c[i][n];h=(t-le)/v;let o=c[i][n-1];console.warn(h),c[i].length>=1&&h>0&&h+_>W&&(console.warn(h),o&&o.clipType=="gap"&&(x=!0),x==!0&&o?(l.startTime=h+.01+_,F==!0?o.length=h:o.length=h+A/v,console.warn("updating layer"),b(i)):x==!1&&(console.warn("inserting gap"),O(i,n),F=!0,x=!0,l.startTime=h+.01)),me(l.startTime)}});document.addEventListener("pointerup",function(e){if(T&&(console.warn("completing resize"),q=!1,T=void 0,a=void 0),y&&k==!0){k=!1,x=!1,F=!1;let t=a.id.split("-");ve(a.clipLayer-1,t[1],h),y=void 0,h=0,W=-1,console.warn("MOVE COMPLETE")}});function _e(e){let t=e.target.value;console.warn(e.target.value),a.transitionType=+e.target.value,ae(t)}function ae(e){let t=document.getElementById("transitionStyleInputSection");if($e(),e==4){t.style.flexDirection="row";let n=document.createElement("p");n.id="colorThresholdInputLabel",n.innerHTML="threshold color";let i=document.createElement("input");i.type="color",i.id="colorThresholdPicker",i.addEventListener("change",function(l){console.warn(l.target.value);let o=l.target.value,r=ce(o);a.colorThreshold=r,console.warn(a.colorThreshold)}),t.appendChild(n),t.appendChild(i)}else if(e==6){t.style.flexDirection="column";let n=document.createElement("p");n.id="fractalFadeTypeInputLabel",n.innerHTML="Fade to black?";let i=document.createElement("input");i.type="checkbox",i.style.width="30px",i.style.height="30px",i.id="fadeTypeInput",i.value=a.transitionFadeType;let l=document.createElement("div");l.style.display="flex",l.style.alignItems="center";let o=document.createElement("div");o.style.display="flex",o.style.alignItems="center";let r=document.createElement("div");r.style.display="flex",r.style.alignItems="center";let s=document.createElement("p");s.innerHTML="Fractal Coords";let d=document.createElement("input");d.type="number",d.id="fractalXInput",d.value=a.fractalX,d.step="any";let u=document.createElement("input");u.type="number",u.id="fractalYInput",u.value=a.fractalY,u.step="any",l.appendChild(s),l.appendChild(d),l.appendChild(u);let m=document.createElement("p");m.innerHTML="InitialZoom";let f=document.createElement("input");f.type="number",f.id="fractalZoomInput",f.value=a.fractalInitialZoom,f.step="any",t.appendChild(l),o.appendChild(m),o.appendChild(f),t.appendChild(o),i.addEventListener("change",function(g){a.transitionFadeType=g.target.checked}),d.addEventListener("change",function(g){a.fractalX=g.target.value}),u.addEventListener("change",function(g){a.fractalY=g.target.value}),f.addEventListener("change",function(g){a.fractalInitialZoom=g.target.value}),r.appendChild(n),r.appendChild(i),t.appendChild(r)}}function re(){let e=document.getElementById("fadeInStyleSection"),t=document.createElement("p");t.id="fadeInColorThresholdInputLabel",t.innerHTML="threshold color";let n=document.createElement("input");n.type="color",n.id="fadeInColorThresholdPicker",n.addEventListener("change",function(i){console.warn(i.target.value);let l=i.target.value,o=ce(l);a.fadeInColorThresholdolorThreshold=o,console.warn(a.colorThreshold)}),e.appendChild(t),e.appendChild(n)}function Ue(){let e=document.getElementById("fadeInStyleSection");e.innerHTML=""}function ce(e){let t=e.replace("#",""),n=parseInt(t.substring(0,2),16),i=parseInt(t.substring(2,4),16),l=parseInt(t.substring(4,6),16);return[n/255,i/255,l/255]}function se(e,t,n){return"#"+(1<<24|e<<16|t<<8|n).toString(16).slice(1)}function $e(){let e=document.getElementById("transitionStyleInputSection");e.innerHTML=""}function De(e){a&&document.getElementById(`${a.id}`).classList.remove("selected"),ue();let t=e.target.id,n=e.target;for(;!t||t&&t.includes("-")==!1;)t=n.parentElement.id,n=n.parentElement,console.warn(t);let i=0,l=0;if(t.includes("-")==!0&&t.split("-").length==2){let o=t.split("-");i=+o[0],l=+o[1],a=c[i][l],document.getElementById(`${t}`).classList.add("selected"),pe(a)}}function de(e){ue();let t=e,n=0,i=0;if(t.includes("-")==!0&&t.split("-").length==2){let l=t.split("-");n=+l[0],i=+l[1],a=c[n][i],document.getElementById(`${t}`).classList.add("selected"),pe(a)}}function ue(){a&&document.getElementById(`${a.id}`).classList.remove("selected"),a=void 0;for(let e=0;e<5;e++){let t=document.getElementById(`clipLayer${e+1}`);for(const n of t.children)n.classList.remove("selected")}}function pe(e){var t,n;(t=document.getElementById("colorThresholdInputLabel"))==null||t.remove(),(n=document.getElementById("colorThresholdPicker"))==null||n.remove(),Re(e.name),fe(e.length),He(e.transitionType),ae(e.transitionType),Ae(e.transitionTime),me(e.startTime),Oe(e.clipLayer),We(e.fadeInTransitionType),Ge(e.clipEffect),qe(e.fadeInTransitionTime),e.colorThreshold&&ze(e.colorThreshold),e.fadeInTransitionType==4&&e.fadeInColorThreshold&&Ne(e.colorThreshold)}function Re(e){document.getElementById("clipNameLabel").innerHTML=e}function fe(e){document.getElementById("clipLengthInput").value=+e}function He(e){document.getElementById("transitionSelectionInput").value=e}function Ae(e){document.getElementById("transitionLengthInput").value=e}function me(e){document.getElementById("clipStartTimeInput").value=e}function Oe(e){document.getElementById("clipLayerSelection").value=e}function ge(e){let t=e-a.length;a.length=e;let n=+a.id.split("-")[1];ve(a.clipLayer-1,n,t)}function qe(e){document.getElementById("fadeInLengthInput").value=e}function We(e){document.getElementById("fadeInSelectionInput").value=e}function Ge(e){document.getElementById("clipEffectInput").value=e,e>0?ye():he()}function he(){let e=document.getElementById("clipEffectParameterSection");e.innerHTML=""}function ye(){let e=document.getElementById("clipEffectParameterSection");if(e.style.display="flex",e.style.flexDirection="column",e.innerHTML)return;let t=document.createElement("p"),n=document.createElement("p");t.innerHTML="Effect Intensity",n.innerHTML="Control Alpha?";let i=document.createElement("div");i.style.display="flex";let l=document.createElement("div");l.style.display="flex";let o=document.createElement("input"),r=document.createElement("input");r.type="checkbox",o.id="clipEffectIntensitySlider",o.type="range",o.value=a.clipEffectIntensity,o.step=.25,o.max=10,o.min=-10,o.addEventListener("input",function(d){let u=document.getElementById("clipEffectIntensityInput");u.value=+d.target.value,Xe(+d.target.value)}),r.addEventListener("change",function(d){console.warn(d.target.checked),a.clipEffectControlAlpha=d.target.checked});let s=document.createElement("input");s.id="clipEffectIntensityInput",s.type="number",s.value=a.clipEffectIntensity,r.checked=a.clipEffectControlAlpha,i.appendChild(t),i.appendChild(o),i.appendChild(s),l.appendChild(n),l.appendChild(r),e.appendChild(i),e.appendChild(l)}function Xe(e){a.clipEffectIntensity=e}function ze(e){console.warn(e);let t=se(Math.round(e[0]*255),Math.round(e[1]*255),Math.round(e[2]*255));console.warn(t),document.getElementById("colorThresholdPicker").value=t}function Ne(e){document.getElementById("fadeInStyleSection").innerHTML||re(),console.warn(e);let n=se(Math.round(e[0]*255),Math.round(e[1]*255),Math.round(e[2]*255));console.warn(n),document.getElementById("fadeInColorThresholdPicker").value=n}function ve(e,t,n){console.warn(`updating start times on ${e}`);let i=c[e];if(i.length>0)for(let l=0;l<i.length;l++)l>t&&(i[l].startTime+=n);console.warn("start times fixed"),console.warn(i)}function Ye(e,t){let n=c[e][t-1],i=c[e][t+1],l=c[e].length,o=c[e].splice(t,1);if(i&&i.clipType=="gap"&&n&&n.clipType=="gap"){let r=+i.id.split("-")[1],s=+n.id.split("-")[1];r>=l-1?c[e].splice(s,2):(c[e].splice(r-1,2),n.length+=i.length)}for(let r=t;r<c[e].length;r++)c[e][r].startTime-=o[0].length,c[e][r].id=`${e}-${r}`;return o[0]}function Ve(e,t){let n=c[e];t.id=`${e}-${n.length}`,t.startTime=ee(e),n.push(t)}function Te(){document.getElementById("sequenceMarker").style.left=30+E*v+we()}function U(e){document.getElementById(`clipLayer${e}`).innerHTML=""}function je(){E=0,Te(),w=!1,S=!0,document.querySelector("#gl-canvas"),I(),B=!0,document.getElementById("sequencerStartStop").disabled=!0,document.getElementById("sequencerRestart").disabled=!0}document.getElementById("sequenceItemInput").addEventListener("change",function(e){let t=e.target.files[0];var n=new FileReader;n.addEventListener("load",function(i){const l=R(Q,i.target.result);Pe(t,l,i.target.result,0)}),t&&n.readAsDataURL(t)});document.getElementById("sequencerStartStop").addEventListener("click",function(e){w=!w,w?e.target.innerHTML="stop":e.target.innerHTML="play"});document.getElementById("sequencerRestart").addEventListener("click",function(e){H=E.valueOf()});document.getElementById("transitionSelectionInput").addEventListener("change",_e);document.getElementById("clipLengthInput").addEventListener("change",function(e){console.warn("updating length"),ge(+e.target.value),a&&b(a.clipLayer-1)});document.getElementById("exportButton").addEventListener("click",function(e){je()});document.getElementById("timelineHorizontalScale").addEventListener("input",function(e){console.warn(e.target.value),v=+e.target.value,U(1),P()});document.getElementById("removeClipButton").addEventListener("click",function(e){c[a.clipLayer-1].splice(+a.id.split("-")[1],1),a=void 0,U(1),P(),C=M*I()});document.getElementById("frameRateInput").addEventListener("change",function(e){M=+e.target.value,C=M*I()});document.getElementById("outputWidthInput").addEventListener("change",function(e){L.setOption("width",+event.target.value),document.getElementById("gl-canvas").style.width=`${e.target.value}px`});document.getElementById("viewportScale").addEventListener("input",function(e){document.getElementById("gl-canvas").style.width=`${+e.target.value*256}px`});document.getElementById("clipLayerSelection").addEventListener("change",function(e){if(a){let t=a.id.split("-"),n=+t[0],i=+t[1];console.warn(e),console.warn(e.target.value),a.clipLayer=+e.target.value,Ee();let l=Ye(n,i);Ve(+e.target.value-1,l),P()}});document.getElementById("clipStartTimeInput").addEventListener("change",function(e){a&&(a.startTime=+e.target.value,Ee(),P())});document.getElementById("transitionLengthInput").addEventListener("change",function(e){a&&(a.transitionTime=+e.target.value)});document.getElementById("fadeInSelectionInput").addEventListener("change",function(e){a&&(a.fadeInTransitionType=+e.target.value,a.fadeInTransitionType==4?re():Ue())});document.getElementById("clipEffectInput").addEventListener("change",function(e){a&&(a.clipEffect=+e.target.value,a.clipEffect>0?ye():he())});document.getElementById("fadeInLengthInput").addEventListener("change",function(e){a&&(a.fadeInTransitionTime=+e.target.value)});document.getElementById("timelineHelpButton").addEventListener("click",function(e){Ze()});var V;(V=document.getElementById("closePopup1Button"))==null||V.addEventListener("click",function(e){Ke()});document.getElementById("addImageHelpButton").addEventListener("click",function(e){Je()});var j;(j=document.getElementById("closePopup2Button"))==null||j.addEventListener("click",function(e){Qe()});document.getElementById("clipSettingsHelpButton").addEventListener("click",function(e){et()});var Z;(Z=document.getElementById("closePopup3Button"))==null||Z.addEventListener("click",function(e){tt()});document.getElementById("renderSettingsHelpButton").addEventListener("click",function(e){nt()});var K;(K=document.getElementById("closePopup4Button"))==null||K.addEventListener("click",function(e){it()});document.getElementById("sequencerTimeline").addEventListener("scroll",function(e){document.getElementById("timelineRuler").style.top=`${window.visualViewport.offsetTop}px`});function Ze(){document.getElementById("helpPopup1").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup1").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function Ke(){document.getElementById("helpPopup1").style.display="none",document.getElementById("popupGlass").style.display="none"}function Je(){document.getElementById("helpPopup2").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup2").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function Qe(){document.getElementById("helpPopup2").style.display="none",document.getElementById("popupGlass").style.display="none"}function et(){document.getElementById("helpPopup3").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup3").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function tt(){document.getElementById("helpPopup3").style.display="none",document.getElementById("popupGlass").style.display="none"}function nt(){document.getElementById("helpPopup4").style.display="block",document.getElementById("popupGlass").style.display="block",console.warn(window.scrollTop),document.getElementById("helpPopup4").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function it(){document.getElementById("helpPopup4").style.display="none",document.getElementById("popupGlass").style.display="none"}function Ee(){for(let e=1;e<5;e++)U(e)}var Y=document.getElementById("sequencerTimeline");Y.scrollTop=Y.scrollHeight;
