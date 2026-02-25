import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{G as Be,i as we,d as V}from"./gif-DsIElLlq.js";const ne=4,be=`
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
`,Pe=`
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
`;function De(e,t,n){const i=j(e,e.VERTEX_SHADER,t),l=j(e,e.FRAGMENT_SHADER,n),a=e.createProgram();return e.attachShader(a,i),e.attachShader(a,l),e.linkProgram(a),e.getProgramParameter(a,e.LINK_STATUS)?a:(console.error(`Unable to initialize the shader program: ${e.getProgramInfoLog(a)}`),null)}function j(e,t,n){const i=e.createShader(t);return e.shaderSource(i,n),e.compileShader(i),e.getShaderParameter(i,e.COMPILE_STATUS)?i:(console.error(`An error occured compiling shader:
${e.getShaderInfoLog(i)}`),e.deleteShader(i),null)}function Z(e){return(e&e-1)===0}function q(e,t){const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n);const i=0,l=e.RGBA,a=1,o=1,d=0,s=e.RGBA,g=e.UNSIGNED_BYTE,f=new Uint8Array([0,0,255,255]);e.texImage2D(e.TEXTURE_2D,i,l,a,o,d,s,g,f);const u=new Image;return u.crossOrigin="anonymous",u.src=t,u.onload=()=>{e.bindTexture(e.TEXTURE_2D,n),e.texImage2D(e.TEXTURE_2D,i,l,s,g,u),Z(u.width)&&Z(u.height)?e.generateMipmap(e.TEXTURE_2D):(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST)),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0)},n}let c=[[],[],[],[]],ie,C=0,W=0,D=!1,h=25,b=!1,x=100,R=[],w=!1,O=!1,S=new Be({workers:1,quality:10,width:256,height:256,workerScript:"/my-graphics-demos/gif/gif.worker.js"}),_=15;async function Me(){const e=document.querySelector("#gl-canvas"),t=e.getContext("webgl");if(ie=t,t===null){alert("Unable to initialize WebGL. Your browser or machine may not support it.");return}t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT);const n=De(t,be,Pe),i={program:n,attribLocations:{vertexPosition:t.getAttribLocation(n,"aVertexPosition"),textureCoord:t.getAttribLocation(n,"aTextureCoord")},uniformLocations:{projectionMatrix:t.getUniformLocation(n,"uProjectionMatrix"),modelViewMatrix:t.getUniformLocation(n,"uModelViewMatrix"),uSampler:t.getUniformLocation(n,"uSampler"),time:t.getUniformLocation(n,"time"),transitionTime:t.getUniformLocation(n,"transitionTime"),sequenceItemLength:t.getUniformLocation(n,"sequenceItemLength"),transitionType:t.getUniformLocation(n,"transitionType"),transitionFadeType:t.getUniformLocation(n,"transitionFadeType"),sequenceIndex:t.getUniformLocation(n,"sequenceIndex"),sequenceItemStartTime:t.getUniformLocation(n,"sequenceItemStartTime"),colorThreshold:t.getUniformLocation(n,"colorThreshold"),fadeInColorThreshold:t.getUniformLocation(n,"fadeInColorThreshold"),fadeInTransitionTime:t.getUniformLocation(n,"fadeInTransitionTime"),fadeInTransitionType:t.getUniformLocation(n,"fadeInTransitionType"),clipEffect:t.getUniformLocation(n,"clipEffect"),clipEffectIntensity:t.getUniformLocation(n,"clipEffectIntensity"),fractalX:t.getUniformLocation(n,"fractalX"),fractalY:t.getUniformLocation(n,"fractalY"),fractalInitialZoom:t.getUniformLocation(n,"fractalInitialZoom"),invertFractal:t.getUniformLocation(n,"invertFractal"),clipEffectControlAlpha:t.getUniformLocation(n,"clipEffectControlAlpha"),pageCurlRadius:t.getUniformLocation(n,"pageCurlRadius"),pageCurlDir:t.getUniformLocation(n,"pageCurlDir")}},l=we(t);q(t,"/my-graphics-demos/ceiling1.png");const a=q(t,"/my-graphics-demos/sky.png");var o=new FileReader,d=await fetch("sky.png");o.readAsDataURL(await d.blob()),o.addEventListener("load",f=>{c[0].push({name:"sky",imgData:f.target.result,texture:a,startTime:0,length:4,id:"0-0",transitionType:1,transitionTime:1,clipLayer:1,fadeInTransitionType:0,fadeInTransitionTime:1,transitionFadeType:!1,fractalInitialZoom:.0125,fractalX:-.95,fractalY:-.25,invertFractal:!1,pageCurlDir:45,pageCurlRadius:.1,clipType:"image"}),F()}),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!0),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0);let s=document.getElementById("errorPopup");S.on("progress",function(f){console.warn("progress"),console.warn(f);let u=document.getElementById("viewport");s.style.display="block",s.innerHTML="";let m=document.createElement("p"),T=document.createElement("div"),E=document.createElement("h1");if(T.className="popupHeader",E.innerHTML="RENDERING",m.innerHTML=`${(f*100).toFixed(4)}`,T.appendChild(E),s.appendChild(T),s.appendChild(m),s.style.left=`calc(50% - ${s.offsetWidth/2}px)`,u)u.style.background=`radial-gradient(circle at center, rgb(25, 255, 0) ${f*100}%, transparent ${100-f*100}%), url('/my-graphics-demos/uipamnel1.png') 100% center / cover`;else{let I=document.createElement("div");I.id="exportProgressBar",document.getElementById("viewport").appendChild(I)}}),S.on("error",function(f){let u=document.getElementById("errorPopup");if(u){u.style.display="block";let m=document.createElement(p);m.innerHTML=`An error has occured during export ${f.toString()}`,u.appendChild(m),setTimeout(()=>{u.innerHTML="",u.style.display="none"},5e3)}}),S.on("finished",function(f){let u=URL.createObjectURL(f),m=document.getElementById("downloadButton");if(m.href=u,m.download=`jakehsequencer${new Date(Date.now()).toISOString().replace(":","")}.gif`,m.click(),m.classList.remove("disabled"),O=!1,b=!1,w=!1,document.getElementById("sequencerStartStop").disabled=!1,document.getElementById("sequencerRestart").disabled=!1,s){s.innerHTML="",s.style.display="block";let T=document.createElement("p"),E=document.createElement("div"),I=document.createElement("h1");E.className="popupHeader",I.innerHTML="SUCCESS",T.innerHTML="Your gif is ready!!! It should have started downloading. If not, click the download button.",E.appendChild(I),s.appendChild(E),s.appendChild(T),s.style.left=`calc(50% - ${s.offsetWidth/2}px)`,setTimeout(()=>{s.innerHTML="",s.style.display="none",document.getElementById("viewport").style.background=""},5e3)}S.running=!1});function g(f){if(f*=.001,D&&w==!1?(C=f-W,Y()):w==!1&&(W=f),w==!1&&V(t,i,l,c,C),document.getElementById("timeValue").innerHTML=C.toFixed(4),b==!0){if(b=!1,V(t,i,l,c,C),R.length<x){e.toBlob(E=>{R.push(E),C=B()*(R.length/x);const I=new Image;I.src=URL.createObjectURL(E),I.onload=()=>{let xe=B()*1e3/x;S.addFrame(I,{delay:Math.round(xe)}),b=!0}}),s.style.display="block",s.innerHTML="";let u=document.createElement("p"),m=document.createElement("div"),T=document.createElement("h1");m.className="popupHeader",T.innerHTML="CAPTURING FRAMES",u.innerHTML=`${R.length} / ${x} stored...`,m.appendChild(T),s.appendChild(m),s.appendChild(u),s.style.left=`calc(50% - ${s.offsetWidth/2}px)`}}else document.getElementById("outputTypeInput").value,S.frames.length>=x&&O==!1&&w==!0&&(O=!0,console.warn("GIFF"),S.render());requestAnimationFrame(g)}requestAnimationFrame(g)}Me();function B(){let e=0;for(let t=0;t<ne;t++){let n=0;if(c[t].length>0){for(let i=0;i<c[t].length;i++)n+=c[t][i].length;n>e&&(e=n)}}return e}function le(e){let t=0;for(let n=0;n<c[e].length;n++)t+=c[e][n].length;return t}function Fe(){return document.getElementById("sequencerTimeline").offsetLeft}let Re=4,ae=1,r;function ke(e,t,n,i){let l={name:e.name,texture:t,imgData:n,startTime:le(i),length:Re,id:`${i}-${c[i].length.valueOf()}`,transitionType:0,transitionTime:ae,transitionFadeType:!1,fractalInitialZoom:.0125,fractalX:-.95,fractalY:-.25,invertFractal:!1,clipEffectControlAlpha:!1,clipLayer:i+1,clipEffect:0,clipEffectIntensity:1,fadeInTransitionType:0,fadeInTransitionTime:1,clipType:"image",pageCurlDir:45,pageCurlRadius:.1};c[i].push(l),console.warn(l),oe(l),console.warn(c),document.getElementById("sequenceLengthValue").innerHTML=B().toFixed(4),x=_*B();let a=document.getElementById(`clipLayer${l.clipLayer}`),o=a.style.gridTemplateColumns.split(" ");o.push(`${l.length*h}px`),a.style.gridTemplateColumns=o.join(" ")}function M(e){A(e+1);let t=document.getElementById(`clipLayer${e+1}`),n=c[e];for(let l=0;l<n.length;l++){let a=c[e][l],o=c[e][l-1];if(o&&o.clipType!="gap"&&o.startTime+o.length<a.startTime){let d=a.startTime-(o.startTime+o.length);z(e,l,d)}else o&&o.clipType=="gap"&&o.startTime+o.length>a.startTime?o.length=a.startTime-o.startTime:!o&&a.startTime>0&&z(e,l,a.startTime)}for(let l=0;l<n.length;l++){let a=c[e][l];oe(a)}n=c[e];let i=n.map(l=>l.length*h);console.warn(i),t.style.gridTemplateColumns=i.join("px ")+"px",document.getElementById("sequenceLengthValue").innerHTML=B().toFixed(4)}function F(){console.warn("sequence update"),console.warn(c),re();for(let e=0;e<ne;e++)c[e].length>0&&M(e)}function re(){let e=document.getElementById("timelineRuler");e.innerHTML="";let t=e.offsetWidth,n=t/h;console.warn(`${t} / ${h}`),console.warn(n);for(let i=0;i<n;i++){let l=document.createElement("div");if(l.className="sequenceTimelineRulerTick",l.style.left=10+i*h+e.offsetLeft,i%5==0){let a=document.createElement("p");a.innerHTML=i.toString(),l.appendChild(a)}e.appendChild(l),console.warn("tick added")}}function oe(e,t=!1){let n=document.createElement("div"),i=document.getElementById(`clipLayer${e.clipLayer}`);if(e.clipType=="image"){let l=document.createElement("div"),a=document.createElement("img"),o=document.createElement("p");n.className="sequenceItemPlaceholder",n.style.background=`linear-gradient(to right, rgb(0, 255, 13) ${(e.length-e.transitionTime)/e.length*100}%, rgb(41, 0, 79))`,o.innerHTML=e.name,o.className="sequenceItemName",a.className="sequenceThumbnail",a.src=e.imgData,n.id=e.id,l.className="clipNameThumbContainer",l.appendChild(o),l.appendChild(a),n.appendChild(l);let d=document.createElement("div");document.createElement("div"),d.className="lengthController",d.id=`${n.id}-lengthController`,d.addEventListener("touchstart",g=>g.preventDefault()),d.addEventListener("pointerdown",_e),l.addEventListener("pointerdown",He),l.addEventListener("touchstart",g=>g.preventDefault());let s=+e.id.split("-")[1];n.style.gridColumn=s+1,n.appendChild(d),i.appendChild(n),n.addEventListener("click",Oe)}else{n.className="gapPlaceholder",n.id=e.id;let l=+e.id.split("-")[1];n.style.gridColumn=l+1,i.appendChild(n)}}let N=!1,H=!1,U=!1,P=!1,k=!1,X=-1,ce=0,se=0,v=0,G=0,$=0,de=0,L,y;function _e(e){for(console.warn("STARTING RESIZE"),N=!0,ce=e.clientX,L=e.target;L.className.includes("sequenceItemPlaceholder")==!1;)L=L.parentElement;let n=L.id.split("-"),i=n[0],l=n[1],a=c[i][l];ge(`${i}-${l}`),document.getElementById(`${i}-${l}`),document.getElementById(`clipLayer#${+i+1}`),de=a.length*h}function He(e){for(console.warn("STARTING MOVE"),H=!0,se=e.clientX,y=e.target;y.id.includes("-")==!1;)y=y.parentElement;let t=+y.id.split("-")[1],n=+y.id.split("-")[0];ge(`${n}-${t}`);let i=c[n][t],l=c[n][t-1];l&&l.clipType=="gap"&&(G=+document.getElementById(`clipLayer${n+1}`).style.gridTemplateColumns.split(" ")[t-1].replace("px",""),X=l.length+l.startTime),$=i.startTime,console.warn(`initial clip start: ${$}`),console.warn(`initial gap width: ${G}`)}function z(e,t,n=.01){let i=c[e][t],l={name:"gap",startTime:n!=.01?i.startTime-n:i.startTime,length:n,id:`${e}-${t}`,transitionType:0,transitionTime:ae,clipLayer:e+1,clipEffect:0,clipEffectIntensity:1,fadeInTransitionType:0,fadeInTransitionTime:0,clipType:"gap"};c[e].splice(t,0,l);for(let a=t+1;a<c[e].length;a++)a!=t+1&&(c[e][a].startTime+=n),c[e][a].id=`${e}-${a}`;n==.01&&M(e)}document.addEventListener("pointermove",function(e){let t=e.clientX;if(N==!0&&L&&e.target.id.includes("-")&&e.target.id.split("-").length==3){let n=L.id.split("-");console.warn(n);let i=+n[0],l=+n[1];c[i][l];let o=(t-ce+de)/h;Ee(o),ye(o),M(i)}else if(H&&y){let n=+y.id.split("-")[1],i=+y.id.split("-")[0];k==!0&&(n+=1);let l=c[i][n];v=(t-se)/h;let a=c[i][n-1];console.warn(v),c[i].length>=1&&v>0&&v+$>X&&(console.warn(v),a&&a.clipType=="gap"&&(P=!0),P==!0&&a?(l.startTime=v+.01+$,k==!0?a.length=v:a.length=v+G/h,console.warn("updating layer"),M(i)):P==!1&&(console.warn("inserting gap"),z(i,n),k=!0,P=!0,l.startTime=v+.01)),Te(l.startTime)}else if(U){let n=document.getElementById("timelineRuler");C=(e.clientX-n.offsetLeft)/h,Y()}});document.addEventListener("pointerup",function(e){if(L&&(console.warn("completing resize"),N=!1,L=void 0,r=void 0),y&&H==!0){H=!1,P=!1,k=!1;let t=r.id.split("-");Le(r.clipLayer-1,t[1],v),y=void 0,v=0,X=-1,console.warn("MOVE COMPLETE")}U&&(U=!1)});function Ue(e){let t=e.target.value;console.warn(e.target.value),r.transitionType=+e.target.value,ue(t)}function ue(e){let t=document.getElementById("transitionStyleInputSection");if(Ae(),e==4){t.style.flexDirection="row";let n=document.createElement("p");n.id="colorThresholdInputLabel",n.innerHTML="threshold color";let i=document.createElement("input");i.type="color",i.id="colorThresholdPicker",i.addEventListener("change",function(l){console.warn(l.target.value);let a=l.target.value,o=me(a);r.colorThreshold=o,console.warn(r.colorThreshold)}),t.appendChild(n),t.appendChild(i)}else if(e==6){t.style.flexDirection="column";let n=document.createElement("p");n.id="fractalFadeTypeInputLabel",n.innerHTML="Fade to black?";let i=document.createElement("input");i.type="checkbox",i.style.width="30px",i.style.height="30px",i.id="fadeTypeInput",i.value=r.transitionFadeType;let l=document.createElement("div");l.style.display="flex",l.style.alignItems="center";let a=document.createElement("div");a.style.display="flex",a.style.alignItems="center";let o=document.createElement("div");o.style.display="flex",o.style.alignItems="center";let d=document.createElement("p");d.innerHTML="Fractal Coords";let s=document.createElement("input");s.type="number",s.id="fractalXInput",s.value=r.fractalX,s.step="any";let g=document.createElement("input");g.type="number",g.id="fractalYInput",g.value=r.fractalY,g.step="any",l.appendChild(d),l.appendChild(s),l.appendChild(g);let f=document.createElement("p");f.innerHTML="InitialZoom";let u=document.createElement("input");u.type="number",u.id="fractalZoomInput",u.value=r.fractalInitialZoom,u.step="any",t.appendChild(l),a.appendChild(f),a.appendChild(u),t.appendChild(a),i.addEventListener("change",function(m){r.transitionFadeType=m.target.checked}),s.addEventListener("change",function(m){r.fractalX=m.target.value}),g.addEventListener("change",function(m){r.fractalY=m.target.value}),u.addEventListener("change",function(m){r.fractalInitialZoom=m.target.value}),o.appendChild(n),o.appendChild(i),t.appendChild(o)}else if(e==7){let n=document.createElement("div"),i=document.createElement("div"),l=document.createElement("p"),a=document.createElement("p");l.innerHTML="Curl radius",a.innerHTML="Curl direction";let o=document.createElement("input"),d=document.createElement("input");o.type="number",d.type="number",o.addEventListener("change",function(s){r.pageCurlRadius=+s.target.value}),d.addEventListener("change",function(s){r.pageCurlDir=+s.target.value*(Math.PI/180)}),n.appendChild(l),n.appendChild(o),i.appendChild(a),i.appendChild(d),n.style.display="flex",i.style.display="flex",t.appendChild(n),t.appendChild(i),t.style.display="flex",t.style.flexDirection="column",t.style.marginLeft="5px",d.value=r.pageCurlDir,o.value=r.pageCurlRadius}}function pe(){let e=document.getElementById("fadeInStyleSection"),t=document.createElement("p");t.id="fadeInColorThresholdInputLabel",t.innerHTML="threshold color";let n=document.createElement("input");n.type="color",n.id="fadeInColorThresholdPicker",n.addEventListener("change",function(i){console.warn(i.target.value);let l=i.target.value,a=me(l);r.fadeInColorThresholdolorThreshold=a,console.warn(r.colorThreshold)}),e.appendChild(t),e.appendChild(n)}function $e(){let e=document.getElementById("fadeInStyleSection");e.innerHTML=""}function me(e){let t=e.replace("#",""),n=parseInt(t.substring(0,2),16),i=parseInt(t.substring(2,4),16),l=parseInt(t.substring(4,6),16);return[n/255,i/255,l/255]}function fe(e,t,n){return"#"+(1<<24|e<<16|t<<8|n).toString(16).slice(1)}function Ae(){let e=document.getElementById("transitionStyleInputSection");e.innerHTML=""}function Oe(e){r&&document.getElementById(`${r.id}`).classList.remove("selected"),he();let t=e.target.id,n=e.target;for(;!t||t&&t.includes("-")==!1;)t=n.parentElement.id,n=n.parentElement,console.warn(t);let i=0,l=0;if(t.includes("-")==!0&&t.split("-").length==2){let a=t.split("-");i=+a[0],l=+a[1],r=c[i][l],document.getElementById(`${t}`).classList.add("selected"),ve(r)}}function ge(e){he();let t=e,n=0,i=0;if(t.includes("-")==!0&&t.split("-").length==2){let l=t.split("-");n=+l[0],i=+l[1],r=c[n][i],document.getElementById(`${t}`).classList.add("selected"),ve(r)}}function he(){r&&document.getElementById(`${r.id}`).classList.remove("selected"),r=void 0;for(let e=0;e<5;e++){let t=document.getElementById(`clipLayer${e+1}`);for(const n of t.children)n.classList.remove("selected")}}function ve(e){var t,n;(t=document.getElementById("colorThresholdInputLabel"))==null||t.remove(),(n=document.getElementById("colorThresholdPicker"))==null||n.remove(),qe(e.name),ye(e.length),We(e.transitionType),ue(e.transitionType),Ge(e.transitionTime),Te(e.startTime),ze(e.clipLayer),Xe(e.fadeInTransitionType),Ye(e.clipEffect),Ne(e.fadeInTransitionTime),e.colorThreshold&&je(e.colorThreshold),e.fadeInTransitionType==4&&e.fadeInColorThreshold&&Ze(e.colorThreshold)}function qe(e){document.getElementById("clipNameLabel").innerHTML=e}function ye(e){document.getElementById("clipLengthInput").value=+e}function We(e){document.getElementById("transitionSelectionInput").value=e}function Ge(e){document.getElementById("transitionLengthInput").value=e}function Te(e){document.getElementById("clipStartTimeInput").value=e}function ze(e){document.getElementById("clipLayerSelection").value=e}function Ee(e){let t=e-r.length;r.length=e;let n=+r.id.split("-")[1];Le(r.clipLayer-1,n,t)}function Ne(e){document.getElementById("fadeInLengthInput").value=e}function Xe(e){document.getElementById("fadeInSelectionInput").value=e}function Ye(e){document.getElementById("clipEffectInput").value=e,e>0?Ce():Ie()}function Ie(){let e=document.getElementById("clipEffectParameterSection");e.innerHTML=""}function Ce(){let e=document.getElementById("clipEffectParameterSection");if(e.style.display="flex",e.style.flexDirection="column",e.innerHTML)return;let t=document.createElement("p"),n=document.createElement("p");t.innerHTML="Effect Intensity",n.innerHTML="Control Alpha?";let i=document.createElement("div");i.style.display="flex";let l=document.createElement("div");l.style.display="flex";let a=document.createElement("input"),o=document.createElement("input");o.type="checkbox",a.id="clipEffectIntensitySlider",a.type="range",a.value=r.clipEffectIntensity,a.step=.25,a.max=10,a.min=-10,a.addEventListener("input",function(s){let g=document.getElementById("clipEffectIntensityInput");g.value=+s.target.value,Ve(+s.target.value)}),o.addEventListener("change",function(s){console.warn(s.target.checked),r.clipEffectControlAlpha=s.target.checked});let d=document.createElement("input");d.id="clipEffectIntensityInput",d.type="number",d.value=r.clipEffectIntensity,o.checked=r.clipEffectControlAlpha,i.appendChild(t),i.appendChild(a),i.appendChild(d),l.appendChild(n),l.appendChild(o),e.appendChild(i),e.appendChild(l)}function Ve(e){r.clipEffectIntensity=e}function je(e){console.warn(e);let t=fe(Math.round(e[0]*255),Math.round(e[1]*255),Math.round(e[2]*255));console.warn(t),document.getElementById("colorThresholdPicker").value=t}function Ze(e){document.getElementById("fadeInStyleSection").innerHTML||pe(),console.warn(e);let n=fe(Math.round(e[0]*255),Math.round(e[1]*255),Math.round(e[2]*255));console.warn(n),document.getElementById("fadeInColorThresholdPicker").value=n}function Le(e,t,n){console.warn(`updating start times on ${e}`);let i=c[e];if(i.length>0)for(let l=0;l<i.length;l++)l>t&&(i[l].startTime+=n);console.warn("start times fixed"),console.warn(i)}function Ke(e,t){let n=c[e][t-1],i=c[e][t+1],l=c[e].length,a=c[e].splice(t,1);if(i&&i.clipType=="gap"&&n&&n.clipType=="gap"){let o=+i.id.split("-")[1],d=+n.id.split("-")[1];o>=l-1?c[e].splice(d,2):(c[e].splice(o-1,2),n.length+=i.length)}for(let o=t;o<c[e].length;o++)c[e][o].startTime-=a[0].length,c[e][o].id=`${e}-${o}`;return a[0]}function Je(e,t){let n=c[e];t.id=`${e}-${n.length}`,t.startTime=le(e),n.push(t)}function Y(){document.getElementById("sequenceMarker").style.left=10+C*h+Fe()}function A(e){document.getElementById(`clipLayer${e}`).innerHTML=""}function Qe(){C=0,Y(),D=!1,w=!0,document.querySelector("#gl-canvas"),B(),b=!0,document.getElementById("sequencerStartStop").disabled=!0,document.getElementById("sequencerRestart").disabled=!0}document.getElementById("sequenceItemInput").addEventListener("change",function(e){let t=e.target.files[0];var n=new FileReader;n.addEventListener("load",function(i){const l=q(ie,i.target.result);ke(t,l,i.target.result,0)}),t&&n.readAsDataURL(t)});document.getElementById("sequencerStartStop").addEventListener("click",function(e){D=!D,D?e.target.innerHTML="stop":e.target.innerHTML="play"});document.getElementById("sequencerRestart").addEventListener("click",function(e){W=C.valueOf()});document.getElementById("transitionSelectionInput").addEventListener("change",Ue);document.getElementById("clipLengthInput").addEventListener("change",function(e){console.warn("updating length"),Ee(+e.target.value),r&&M(r.clipLayer-1)});document.getElementById("exportButton").addEventListener("click",function(e){Qe()});document.getElementById("timelineHorizontalScale").addEventListener("input",function(e){console.warn(e.target.value),h=+e.target.value,A(1),F()});document.getElementById("removeClipButton").addEventListener("click",function(e){c[r.clipLayer-1].splice(+r.id.split("-")[1],1),r=void 0,A(1),F(),x=_*B()});document.getElementById("frameRateInput").addEventListener("change",function(e){_=+e.target.value,x=_*B()});document.getElementById("outputWidthInput").addEventListener("change",function(e){S.setOption("width",+event.target.value),document.getElementById("gl-canvas").style.width=`${e.target.value}px`});document.getElementById("viewportScale").addEventListener("input",function(e){document.getElementById("gl-canvas").style.width=`${+e.target.value*256}px`});document.getElementById("clipLayerSelection").addEventListener("change",function(e){if(r){let t=r.id.split("-"),n=+t[0],i=+t[1];console.warn(e),console.warn(e.target.value),r.clipLayer=+e.target.value,Se();let l=Ke(n,i);Je(+e.target.value-1,l),F()}});document.getElementById("clipStartTimeInput").addEventListener("change",function(e){r&&(r.startTime=+e.target.value,Se(),F())});document.getElementById("transitionLengthInput").addEventListener("change",function(e){r&&(r.transitionTime=+e.target.value)});document.getElementById("fadeInSelectionInput").addEventListener("change",function(e){r&&(r.fadeInTransitionType=+e.target.value,r.fadeInTransitionType==4?pe():$e())});document.getElementById("clipEffectInput").addEventListener("change",function(e){r&&(r.clipEffect=+e.target.value,r.clipEffect>0?Ce():Ie())});document.getElementById("fadeInLengthInput").addEventListener("change",function(e){r&&(r.fadeInTransitionTime=+e.target.value)});document.getElementById("timelineHelpButton").addEventListener("click",function(e){et()});var J;(J=document.getElementById("closePopup1Button"))==null||J.addEventListener("click",function(e){tt()});document.getElementById("addImageHelpButton").addEventListener("click",function(e){nt()});var Q;(Q=document.getElementById("closePopup2Button"))==null||Q.addEventListener("click",function(e){it()});document.getElementById("clipSettingsHelpButton").addEventListener("click",function(e){lt()});var ee;(ee=document.getElementById("closePopup3Button"))==null||ee.addEventListener("click",function(e){at()});document.getElementById("renderSettingsHelpButton").addEventListener("click",function(e){rt()});var te;(te=document.getElementById("closePopup4Button"))==null||te.addEventListener("click",function(e){ot()});document.getElementById("sequencerTimeline").addEventListener("scroll",function(e){document.getElementById("timelineRuler").style.top=`${window.visualViewport.offsetTop}px`});document.getElementById("timelineRuler").addEventListener("pointerdown",function(e){U=!0});window.addEventListener("resize",()=>{re()});function et(){document.getElementById("helpPopup1").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup1").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function tt(){document.getElementById("helpPopup1").style.display="none",document.getElementById("popupGlass").style.display="none"}function nt(){document.getElementById("helpPopup2").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup2").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function it(){document.getElementById("helpPopup2").style.display="none",document.getElementById("popupGlass").style.display="none"}function lt(){document.getElementById("helpPopup3").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup3").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function at(){document.getElementById("helpPopup3").style.display="none",document.getElementById("popupGlass").style.display="none"}function rt(){document.getElementById("helpPopup4").style.display="block",document.getElementById("popupGlass").style.display="block",console.warn(window.scrollTop),document.getElementById("helpPopup4").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function ot(){document.getElementById("helpPopup4").style.display="none",document.getElementById("popupGlass").style.display="none"}function Se(){for(let e=1;e<5;e++)A(e)}var K=document.getElementById("sequencerTimeline");K.scrollTop=K.scrollHeight;
