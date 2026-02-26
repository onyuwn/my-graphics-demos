import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{G as Be,i as be,d as K}from"./gif-DsIElLlq.js";const re=4,Pe=`
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
`,De=`
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
`;function Me(e,n,t){const i=J(e,e.VERTEX_SHADER,n),l=J(e,e.FRAGMENT_SHADER,t),r=e.createProgram();return e.attachShader(r,i),e.attachShader(r,l),e.linkProgram(r),e.getProgramParameter(r,e.LINK_STATUS)?r:(console.error(`Unable to initialize the shader program: ${e.getProgramInfoLog(r)}`),null)}function J(e,n,t){const i=e.createShader(n);return e.shaderSource(i,t),e.compileShader(i),e.getShaderParameter(i,e.COMPILE_STATUS)?i:(console.error(`An error occured compiling shader:
${e.getShaderInfoLog(i)}`),e.deleteShader(i),null)}function Q(e){return(e&e-1)===0}function q(e,n){const t=e.createTexture();e.bindTexture(e.TEXTURE_2D,t);const i=0,l=e.RGBA,r=1,o=1,d=0,s=e.RGBA,p=e.UNSIGNED_BYTE,m=new Uint8Array([0,0,255,255]);e.texImage2D(e.TEXTURE_2D,i,l,r,o,d,s,p,m);const u=new Image;return u.crossOrigin="anonymous",u.src=n,u.onload=()=>{e.bindTexture(e.TEXTURE_2D,t),e.texImage2D(e.TEXTURE_2D,i,l,s,p,u),Q(u.width)&&Q(u.height)?e.generateMipmap(e.TEXTURE_2D):(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST)),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0)},t}let c=[[],[],[],[]],V,T=0,W=0,B=!1,g=25,x=!1,S=100,k=[],w=!1,O=!1,C=new Be({workers:1,quality:10,width:256,height:256,workerScript:"/my-graphics-demos/gif/gif.worker.js"}),b=15,G="mp4";async function Re(){const e=document.querySelector("#gl-canvas"),n=e.getContext("webgl");if(V=n,n===null){alert("Unable to initialize WebGL. Your browser or machine may not support it.");return}n.clearColor(0,0,0,1),n.clear(n.COLOR_BUFFER_BIT);const t=Me(n,Pe,De),i={program:t,attribLocations:{vertexPosition:n.getAttribLocation(t,"aVertexPosition"),textureCoord:n.getAttribLocation(t,"aTextureCoord")},uniformLocations:{projectionMatrix:n.getUniformLocation(t,"uProjectionMatrix"),modelViewMatrix:n.getUniformLocation(t,"uModelViewMatrix"),uSampler:n.getUniformLocation(t,"uSampler"),time:n.getUniformLocation(t,"time"),transitionTime:n.getUniformLocation(t,"transitionTime"),sequenceItemLength:n.getUniformLocation(t,"sequenceItemLength"),transitionType:n.getUniformLocation(t,"transitionType"),transitionFadeType:n.getUniformLocation(t,"transitionFadeType"),sequenceIndex:n.getUniformLocation(t,"sequenceIndex"),sequenceItemStartTime:n.getUniformLocation(t,"sequenceItemStartTime"),colorThreshold:n.getUniformLocation(t,"colorThreshold"),fadeInColorThreshold:n.getUniformLocation(t,"fadeInColorThreshold"),fadeInTransitionTime:n.getUniformLocation(t,"fadeInTransitionTime"),fadeInTransitionType:n.getUniformLocation(t,"fadeInTransitionType"),clipEffect:n.getUniformLocation(t,"clipEffect"),clipEffectIntensity:n.getUniformLocation(t,"clipEffectIntensity"),fractalX:n.getUniformLocation(t,"fractalX"),fractalY:n.getUniformLocation(t,"fractalY"),fractalInitialZoom:n.getUniformLocation(t,"fractalInitialZoom"),invertFractal:n.getUniformLocation(t,"invertFractal"),clipEffectControlAlpha:n.getUniformLocation(t,"clipEffectControlAlpha"),pageCurlRadius:n.getUniformLocation(t,"pageCurlRadius"),pageCurlDir:n.getUniformLocation(t,"pageCurlDir")}},l=be(n);q(n,"/my-graphics-demos/ceiling1.png");const r=q(n,"/my-graphics-demos/sky.png");var o=new FileReader,d=await fetch("sky.png");o.readAsDataURL(await d.blob()),o.addEventListener("load",m=>{c[0].push({name:"sky",imgData:m.target.result,texture:r,startTime:0,length:4,id:"0-0",transitionType:1,transitionTime:1,clipLayer:1,fadeInTransitionType:0,fadeInTransitionTime:1,transitionFadeType:!1,fractalInitialZoom:.0125,fractalX:-.95,fractalY:-.25,invertFractal:!1,pageCurlDir:45,pageCurlRadius:.1,clipType:"image"}),R()}),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!0),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0);let s=document.getElementById("errorPopup");C.on("progress",function(m){console.warn("progress"),console.warn(m);let u=document.getElementById("viewport");s.style.display="block",s.innerHTML="";let f=document.createElement("p"),I=document.createElement("div"),y=document.createElement("h1");if(I.className="popupHeader",y.innerHTML="RENDERING",f.innerHTML=`${(m*100).toFixed(4)}`,I.appendChild(y),s.appendChild(I),s.appendChild(f),s.style.left=`calc(50% - ${s.offsetWidth/2}px)`,u)u.style.background=`radial-gradient(circle at center, rgb(25, 255, 0) ${m*100}%, transparent ${100-m*100}%), url('/my-graphics-demos/uipamnel1.png') 100% center / cover`;else{let F=document.createElement("div");F.id="exportProgressBar",document.getElementById("viewport").appendChild(F)}}),C.on("error",function(m){let u=document.getElementById("errorPopup");u&&(P(SUCCESS,`An error has occured during export ${m.toString()}`),setTimeout(()=>{u.innerHTML="",u.style.display="none"},5e3))}),C.on("finished",function(m){let u=URL.createObjectURL(m),f=document.getElementById("downloadButton");f.href=u,f.download=`jakehsequencer${new Date(Date.now()).toISOString().replace(":","")}.gif`,f.click(),f.classList.remove("disabled"),O=!1,x=!1,w=!1,document.getElementById("sequencerStartStop").disabled=!1,document.getElementById("sequencerRestart").disabled=!1,s&&(P(SUCCESS,"Your gif is ready!!! It should have started downloading. If not, click the download button."),setTimeout(()=>{s.innerHTML="",s.style.display="none",document.getElementById("viewport").style.background=""},5e3)),C.running=!1});function p(m){if(m*=.001,B&&w==!1?(T=m-W,Z()):w==!1&&(W=m),w==!1&&K(n,i,l,c,T),document.getElementById("timeValue").innerHTML=T.toFixed(4),x==!0){if(X()=="gif")x=!1,K(n,i,l,c,T),k.length<S&&(e.toBlob(I=>{k.push(I),T=E()*(k.length/S);const y=new Image;y.src=URL.createObjectURL(I),y.onload=()=>{let F=E()*1e3/S;C.addFrame(y,{delay:Math.round(F)}),x=!0}}),P("CAPTURING FRAMES",`${k.length} / ${S} stored...`));else if(X()=="video"){x=!1,console.warn("recording!!!"),P("Rendering video...",`rendering ${E()}s long video (${G}) @ ${b} fps`);let I=Fe(e,E()*1e3,b,G);T=0,B=!0;var u=document.createElement("video");I.then(y=>{u.setAttribute("src",y),P("Success!!","Video successfully rendered. Download should begin automatically..."),setTimeout(()=>{s.innerHTML="",s.style.display="none",document.getElementById("viewport").style.background=""},5e3)});var f=document.createElement("a");f.setAttribute("download",`jakehsequencer${new Date(Date.now()).toISOString().replace(":","")}`),I.then(y=>{f.setAttribute("href",y),f.click()})}}else C.frames.length>=S&&O==!1&&w==!0&&(O=!0,console.warn("GIFF"),C.render());requestAnimationFrame(p)}requestAnimationFrame(p)}Re();function P(e,n){errorPopup.style.display="block",errorPopup.innerHTML="";let t=document.createElement("p"),i=document.createElement("div"),l=document.createElement("h1");i.className="popupHeader",l.innerHTML=e,t.innerHTML=n,i.appendChild(l),errorPopup.appendChild(i),errorPopup.appendChild(t),errorPopup.style.left=`calc(50% - ${errorPopup.offsetWidth/2}px)`}function Fe(e,n,t,i){var l=[];return new Promise(function(r,o){let d=e.captureStream(t),s="video/webm; codecs=vp9";i=="mp4"&&(s="video/mp4");let p=new MediaRecorder(d,{mimeType:s});p.start(n||4e3),p.ondataavailable=function(m){l.push(m.data),p.state==="recording"&&p.stop()},p.onstop=function(m){var u=new Blob(l,{type:s.split(";")[0]}),f=URL.createObjectURL(u);r(f)}})}function E(){let e=0;for(let n=0;n<re;n++){let t=0;if(c[n].length>0){for(let i=0;i<c[n].length;i++)t+=c[n][i].length;t>e&&(e=t)}}return e}function oe(e){let n=0;for(let t=0;t<c[e].length;t++)n+=c[e][t].length;return n}function ke(){return document.getElementById("sequencerTimeline").offsetLeft}let Ue=4,ae=1,a;function _e(e,n,t,i){let l={name:e.name,texture:n,imgData:t,startTime:oe(i),length:Ue,id:`${i}-${c[i].length.valueOf()}`,transitionType:0,transitionTime:ae,transitionFadeType:!1,fractalInitialZoom:.0125,fractalX:-.95,fractalY:-.25,invertFractal:!1,clipEffectControlAlpha:!1,clipLayer:i+1,clipEffect:0,clipEffectIntensity:1,fadeInTransitionType:0,fadeInTransitionTime:1,clipType:"image",pageCurlDir:45,pageCurlRadius:.1};c[i].push(l),console.warn(l),se(l),console.warn(c),document.getElementById("sequenceLengthValue").innerHTML=E().toFixed(4),S=b*E();let r=document.getElementById(`clipLayer${l.clipLayer}`),o=r.style.gridTemplateColumns.split(" ");o.push(`${l.length*g}px`),r.style.gridTemplateColumns=o.join(" ")}function M(e){A(e+1);let n=document.getElementById(`clipLayer${e+1}`),t=c[e];for(let l=0;l<t.length;l++){let r=c[e][l],o=c[e][l-1];if(o&&o.clipType!="gap"&&o.startTime+o.length<r.startTime){let d=r.startTime-(o.startTime+o.length);N(e,l,d)}else o&&o.clipType=="gap"&&o.startTime+o.length>r.startTime?o.length=r.startTime-o.startTime:!o&&r.startTime>0&&N(e,l,r.startTime)}for(let l=0;l<t.length;l++){let r=c[e][l];se(r)}t=c[e];let i=t.map(l=>l.length*g);console.warn(i),n.style.gridTemplateColumns=i.join("px ")+"px",document.getElementById("sequenceLengthValue").innerHTML=E().toFixed(4)}function R(){console.warn("sequence update"),console.warn(c),ce();for(let e=0;e<re;e++)c[e].length>0&&M(e)}function ce(){let e=document.getElementById("timelineRuler");e.innerHTML="";let n=e.offsetWidth,t=n/g;console.warn(`${n} / ${g}`),console.warn(t);for(let i=0;i<t;i++){let l=document.createElement("div");if(l.className="sequenceTimelineRulerTick",l.style.left=10+i*g+e.offsetLeft,i%5==0){let r=document.createElement("p");r.innerHTML=i.toString(),l.appendChild(r)}e.appendChild(l),console.warn("tick added")}}function se(e,n=!1){let t=document.createElement("div"),i=document.getElementById(`clipLayer${e.clipLayer}`);if(e.clipType=="image"){let l=document.createElement("div"),r=document.createElement("img"),o=document.createElement("p");t.className="sequenceItemPlaceholder",t.style.background=`linear-gradient(to right, rgb(0, 255, 13) ${(e.length-e.transitionTime)/e.length*100}%, rgb(41, 0, 79))`,o.innerHTML=e.name,o.className="sequenceItemName",r.className="sequenceThumbnail",r.src=e.imgData,t.id=e.id,l.className="clipNameThumbContainer",l.appendChild(o),l.appendChild(r),t.appendChild(l);let d=document.createElement("div");document.createElement("div"),d.className="lengthController",d.id=`${t.id}-lengthController`,d.addEventListener("touchstart",p=>p.preventDefault()),d.addEventListener("pointerdown",He),l.addEventListener("pointerdown",$e),l.addEventListener("touchstart",p=>p.preventDefault());let s=+e.id.split("-")[1];t.style.gridColumn=s+1,t.appendChild(d),i.appendChild(t),t.addEventListener("click",Ge)}else{t.className="gapPlaceholder",t.id=e.id;let l=+e.id.split("-")[1];t.style.gridColumn=l+1,i.appendChild(t)}}let Y=!1,_=!1,H=!1,D=!1,U=!1,j=-1,de=0,ue=0,h=0,z=0,$=0,pe=0,L,v;function He(e){for(console.warn("STARTING RESIZE"),Y=!0,de=e.clientX,L=e.target;L.className.includes("sequenceItemPlaceholder")==!1;)L=L.parentElement;let t=L.id.split("-"),i=t[0],l=t[1],r=c[i][l];ve(`${i}-${l}`),document.getElementById(`${i}-${l}`),document.getElementById(`clipLayer#${+i+1}`),pe=r.length*g}function $e(e){for(console.warn("STARTING MOVE"),_=!0,ue=e.clientX,v=e.target;v.id.includes("-")==!1;)v=v.parentElement;let n=+v.id.split("-")[1],t=+v.id.split("-")[0];ve(`${t}-${n}`);let i=c[t][n],l=c[t][n-1];l&&l.clipType=="gap"&&(z=+document.getElementById(`clipLayer${t+1}`).style.gridTemplateColumns.split(" ")[n-1].replace("px",""),j=l.length+l.startTime),$=i.startTime,console.warn(`initial clip start: ${$}`),console.warn(`initial gap width: ${z}`)}function N(e,n,t=.01){let i=c[e][n],l={name:"gap",startTime:t!=.01?i.startTime-t:i.startTime,length:t,id:`${e}-${n}`,transitionType:0,transitionTime:ae,clipLayer:e+1,clipEffect:0,clipEffectIntensity:1,fadeInTransitionType:0,fadeInTransitionTime:0,clipType:"gap"};c[e].splice(n,0,l);for(let r=n+1;r<c[e].length;r++)r!=n+1&&(c[e][r].startTime+=t),c[e][r].id=`${e}-${r}`;t==.01&&M(e)}document.addEventListener("pointermove",function(e){let n=e.clientX;if(Y==!0&&L&&e.target.id.includes("-")&&e.target.id.split("-").length==3){let t=L.id.split("-");console.warn(t);let i=+t[0],l=+t[1];c[i][l];let o=(n-de+pe)/g;Ce(o),Ee(o),M(i)}else if(_&&v){let t=+v.id.split("-")[1],i=+v.id.split("-")[0];U==!0&&(t+=1);let l=c[i][t];h=(n-ue)/g;let r=c[i][t-1];console.warn(h),c[i].length>=1&&h>0&&h+$>j&&(console.warn(h),r&&r.clipType=="gap"&&(D=!0),D==!0&&r?(l.startTime=h+.01+$,U==!0?r.length=h:r.length=h+z/g,console.warn("updating layer"),M(i)):D==!1&&(console.warn("inserting gap"),N(i,t),U=!0,D=!0,l.startTime=h+.01)),Ie(l.startTime)}else if(H){let t=document.getElementById("timelineRuler");T=(e.clientX-t.offsetLeft)/g,Z()}});document.addEventListener("pointerup",function(e){if(L&&(console.warn("completing resize"),Y=!1,L=void 0,a=void 0),v&&_==!0){_=!1,D=!1,U=!1;let n=a.id.split("-");xe(a.clipLayer-1,n[1],h),v=void 0,h=0,j=-1,console.warn("MOVE COMPLETE")}H&&(H=!1)});function Ae(e){let n=e.target.value;console.warn(e.target.value),a.transitionType=+e.target.value,me(n)}function me(e){let n=document.getElementById("transitionStyleInputSection");if(We(),e==4){n.style.flexDirection="row";let t=document.createElement("p");t.id="colorThresholdInputLabel",t.innerHTML="threshold color";let i=document.createElement("input");i.type="color",i.id="colorThresholdPicker",i.addEventListener("change",function(l){console.warn(l.target.value);let r=l.target.value,o=ge(r);a.colorThreshold=o,console.warn(a.colorThreshold)}),n.appendChild(t),n.appendChild(i)}else if(e==6){n.style.flexDirection="column";let t=document.createElement("p");t.id="fractalFadeTypeInputLabel",t.innerHTML="Fade to black?";let i=document.createElement("input");i.type="checkbox",i.style.width="30px",i.style.height="30px",i.id="fadeTypeInput",i.value=a.transitionFadeType;let l=document.createElement("div");l.style.display="flex",l.style.alignItems="center";let r=document.createElement("div");r.style.display="flex",r.style.alignItems="center";let o=document.createElement("div");o.style.display="flex",o.style.alignItems="center";let d=document.createElement("p");d.innerHTML="Fractal Coords";let s=document.createElement("input");s.type="number",s.id="fractalXInput",s.value=a.fractalX,s.step="any";let p=document.createElement("input");p.type="number",p.id="fractalYInput",p.value=a.fractalY,p.step="any",l.appendChild(d),l.appendChild(s),l.appendChild(p);let m=document.createElement("p");m.innerHTML="InitialZoom";let u=document.createElement("input");u.type="number",u.id="fractalZoomInput",u.value=a.fractalInitialZoom,u.step="any",n.appendChild(l),r.appendChild(m),r.appendChild(u),n.appendChild(r),i.addEventListener("change",function(f){a.transitionFadeType=f.target.checked}),s.addEventListener("change",function(f){a.fractalX=f.target.value}),p.addEventListener("change",function(f){a.fractalY=f.target.value}),u.addEventListener("change",function(f){a.fractalInitialZoom=f.target.value}),o.appendChild(t),o.appendChild(i),n.appendChild(o)}else if(e==7){let t=document.createElement("div"),i=document.createElement("div"),l=document.createElement("p"),r=document.createElement("p");l.innerHTML="Curl radius",r.innerHTML="Curl direction";let o=document.createElement("input"),d=document.createElement("input");o.type="number",d.type="number",o.addEventListener("change",function(s){a.pageCurlRadius=+s.target.value}),d.addEventListener("change",function(s){a.pageCurlDir=+s.target.value*(Math.PI/180)}),t.appendChild(l),t.appendChild(o),i.appendChild(r),i.appendChild(d),t.style.display="flex",i.style.display="flex",n.appendChild(t),n.appendChild(i),n.style.display="flex",n.style.flexDirection="column",n.style.marginLeft="5px",d.value=a.pageCurlDir,o.value=a.pageCurlRadius}}function fe(){let e=document.getElementById("fadeInStyleSection"),n=document.createElement("p");n.id="fadeInColorThresholdInputLabel",n.innerHTML="threshold color";let t=document.createElement("input");t.type="color",t.id="fadeInColorThresholdPicker",t.addEventListener("change",function(i){console.warn(i.target.value);let l=i.target.value,r=ge(l);a.fadeInColorThresholdolorThreshold=r,console.warn(a.colorThreshold)}),e.appendChild(n),e.appendChild(t)}function Oe(){let e=document.getElementById("fadeInStyleSection");e.innerHTML=""}function qe(e){let n=document.getElementById("outputTypeOptions");if(n.innerHTML="",e=="gif"){document.createElement("div");let t=document.createElement("input");t.type="number"}else if(e=="video"){let t=document.createElement("div");t.className="renderSettingsItem";let i=document.createElement("select"),l=document.createElement("option");l.value="mp4",l.innerHTML="MP4";let r=document.createElement("option");r.value="webm",r.innerHTML="WEBM",i.appendChild(l),i.appendChild(r);let o=document.createElement("p");o.innerHTML="Video Type",t.appendChild(o),t.appendChild(i),n.appendChild(t),i.addEventListener("change",function(d){G=d.target.value})}}function ge(e){let n=e.replace("#",""),t=parseInt(n.substring(0,2),16),i=parseInt(n.substring(2,4),16),l=parseInt(n.substring(4,6),16);return[t/255,i/255,l/255]}function he(e,n,t){return"#"+(1<<24|e<<16|n<<8|t).toString(16).slice(1)}function We(){let e=document.getElementById("transitionStyleInputSection");e.innerHTML=""}function Ge(e){a&&document.getElementById(`${a.id}`).classList.remove("selected"),ye();let n=e.target.id,t=e.target;for(;!n||n&&n.includes("-")==!1;)n=t.parentElement.id,t=t.parentElement,console.warn(n);let i=0,l=0;if(n.includes("-")==!0&&n.split("-").length==2){let r=n.split("-");i=+r[0],l=+r[1],a=c[i][l],document.getElementById(`${n}`).classList.add("selected"),Te(a)}}function ve(e){ye();let n=e,t=0,i=0;if(n.includes("-")==!0&&n.split("-").length==2){let l=n.split("-");t=+l[0],i=+l[1],a=c[t][i],document.getElementById(`${n}`).classList.add("selected"),Te(a)}}function ye(){a&&document.getElementById(`${a.id}`).classList.remove("selected"),a=void 0;for(let e=0;e<5;e++){let n=document.getElementById(`clipLayer${e+1}`);for(const t of n.children)t.classList.remove("selected")}}function Te(e){var n,t;(n=document.getElementById("colorThresholdInputLabel"))==null||n.remove(),(t=document.getElementById("colorThresholdPicker"))==null||t.remove(),ze(e.name),Ee(e.length),Ne(e.transitionType),me(e.transitionType),Xe(e.transitionTime),Ie(e.startTime),Ve(e.clipLayer),je(e.fadeInTransitionType),Ze(e.clipEffect),Ye(e.fadeInTransitionTime),e.colorThreshold&&Je(e.colorThreshold),e.fadeInTransitionType==4&&e.fadeInColorThreshold&&Qe(e.colorThreshold)}function ze(e){document.getElementById("clipNameLabel").innerHTML=e}function Ee(e){document.getElementById("clipLengthInput").value=+e}function Ne(e){document.getElementById("transitionSelectionInput").value=e}function Xe(e){document.getElementById("transitionLengthInput").value=e}function Ie(e){document.getElementById("clipStartTimeInput").value=e}function Ve(e){document.getElementById("clipLayerSelection").value=e}function Ce(e){let n=e-a.length;a.length=e;let t=+a.id.split("-")[1];xe(a.clipLayer-1,t,n)}function Ye(e){document.getElementById("fadeInLengthInput").value=e}function je(e){document.getElementById("fadeInSelectionInput").value=e}function Ze(e){document.getElementById("clipEffectInput").value=e,e>0?Se():Le()}function Le(){let e=document.getElementById("clipEffectParameterSection");e.innerHTML=""}function Se(){let e=document.getElementById("clipEffectParameterSection");if(e.style.display="flex",e.style.flexDirection="column",e.innerHTML)return;let n=document.createElement("p"),t=document.createElement("p");n.innerHTML="Effect Intensity",t.innerHTML="Control Alpha?";let i=document.createElement("div");i.style.display="flex";let l=document.createElement("div");l.style.display="flex";let r=document.createElement("input"),o=document.createElement("input");o.type="checkbox",r.id="clipEffectIntensitySlider",r.type="range",r.value=a.clipEffectIntensity,r.step=.25,r.max=10,r.min=-10,r.addEventListener("input",function(s){let p=document.getElementById("clipEffectIntensityInput");p.value=+s.target.value,Ke(+s.target.value)}),o.addEventListener("change",function(s){console.warn(s.target.checked),a.clipEffectControlAlpha=s.target.checked});let d=document.createElement("input");d.id="clipEffectIntensityInput",d.type="number",d.value=a.clipEffectIntensity,o.checked=a.clipEffectControlAlpha,i.appendChild(n),i.appendChild(r),i.appendChild(d),l.appendChild(t),l.appendChild(o),e.appendChild(i),e.appendChild(l)}function Ke(e){a.clipEffectIntensity=e}function Je(e){console.warn(e);let n=he(Math.round(e[0]*255),Math.round(e[1]*255),Math.round(e[2]*255));console.warn(n),document.getElementById("colorThresholdPicker").value=n}function Qe(e){document.getElementById("fadeInStyleSection").innerHTML||fe(),console.warn(e);let t=he(Math.round(e[0]*255),Math.round(e[1]*255),Math.round(e[2]*255));console.warn(t),document.getElementById("fadeInColorThresholdPicker").value=t}function xe(e,n,t){console.warn(`updating start times on ${e}`);let i=c[e];if(i.length>0)for(let l=0;l<i.length;l++)l>n&&(i[l].startTime+=t);console.warn("start times fixed"),console.warn(i)}function et(e,n){let t=c[e][n-1],i=c[e][n+1],l=c[e].length,r=c[e].splice(n,1);if(i&&i.clipType=="gap"&&t&&t.clipType=="gap"){let o=+i.id.split("-")[1],d=+t.id.split("-")[1];o>=l-1?c[e].splice(d,2):(c[e].splice(o-1,2),t.length+=i.length)}for(let o=n;o<c[e].length;o++)c[e][o].startTime-=r[0].length,c[e][o].id=`${e}-${o}`;return r[0]}function tt(e,n){let t=c[e];n.id=`${e}-${t.length}`,n.startTime=oe(e),t.push(n)}function Z(){document.getElementById("sequenceMarker").style.left=10+T*g+ke()}function A(e){document.getElementById(`clipLayer${e}`).innerHTML=""}function nt(){T=0,Z(),B=!1,X()=="gif"&&(w=!0),document.querySelector("#gl-canvas"),E(),x=!0,document.getElementById("sequencerStartStop").disabled=!0,document.getElementById("sequencerRestart").disabled=!0}document.getElementById("sequenceItemInput").addEventListener("change",function(e){let n=e.target.files[0];var t=new FileReader;t.addEventListener("load",function(i){const l=q(V,i.target.result);_e(n,l,i.target.result,0)}),n&&t.readAsDataURL(n)});document.getElementById("sequencerStartStop").addEventListener("click",function(e){B=!B,B?e.target.innerHTML="stop":e.target.innerHTML="play"});document.getElementById("sequencerRestart").addEventListener("click",function(e){W=T.valueOf()});document.getElementById("transitionSelectionInput").addEventListener("change",Ae);document.getElementById("clipLengthInput").addEventListener("change",function(e){console.warn("updating length"),Ce(+e.target.value),a&&M(a.clipLayer-1)});document.getElementById("exportButton").addEventListener("click",function(e){nt()});document.getElementById("timelineHorizontalScale").addEventListener("input",function(e){console.warn(e.target.value),g=+e.target.value,A(1),R()});document.getElementById("removeClipButton").addEventListener("click",function(e){c[a.clipLayer-1].splice(+a.id.split("-")[1],1),a=void 0,A(1),R(),S=b*E()});document.getElementById("frameRateInput").addEventListener("change",function(e){b=+e.target.value,S=b*E()});document.getElementById("outputWidthInput").addEventListener("change",function(e){C.setOption("width",+event.target.value),C.setOption("height",+event.target.value),document.getElementById("gl-canvas").style.width=`${e.target.value}px`,V.viewport(0,0,document.getElementById("gl-canvas").clientWidth,document.getElementById("gl-canvas").clientHeight)});document.getElementById("viewportScale").addEventListener("input",function(e){document.getElementById("gl-canvas").style.width=`${+e.target.value*256}px`});document.getElementById("clipLayerSelection").addEventListener("change",function(e){if(a){let n=a.id.split("-"),t=+n[0],i=+n[1];console.warn(e),console.warn(e.target.value),a.clipLayer=+e.target.value,we();let l=et(t,i);tt(+e.target.value-1,l),R()}});document.getElementById("clipStartTimeInput").addEventListener("change",function(e){a&&(a.startTime=+e.target.value,we(),R())});document.getElementById("transitionLengthInput").addEventListener("change",function(e){a&&(a.transitionTime=+e.target.value)});document.getElementById("fadeInSelectionInput").addEventListener("change",function(e){a&&(a.fadeInTransitionType=+e.target.value,a.fadeInTransitionType==4?fe():Oe())});document.getElementById("clipEffectInput").addEventListener("change",function(e){a&&(a.clipEffect=+e.target.value,a.clipEffect>0?Se():Le())});document.getElementById("fadeInLengthInput").addEventListener("change",function(e){a&&(a.fadeInTransitionTime=+e.target.value)});document.getElementById("timelineHelpButton").addEventListener("click",function(e){it()});var te;(te=document.getElementById("closePopup1Button"))==null||te.addEventListener("click",function(e){lt()});document.getElementById("addImageHelpButton").addEventListener("click",function(e){rt()});var ne;(ne=document.getElementById("closePopup2Button"))==null||ne.addEventListener("click",function(e){ot()});document.getElementById("clipSettingsHelpButton").addEventListener("click",function(e){at()});var ie;(ie=document.getElementById("closePopup3Button"))==null||ie.addEventListener("click",function(e){ct()});document.getElementById("renderSettingsHelpButton").addEventListener("click",function(e){st()});var le;(le=document.getElementById("closePopup4Button"))==null||le.addEventListener("click",function(e){dt()});document.getElementById("sequencerTimeline").addEventListener("scroll",function(e){document.getElementById("timelineRuler").style.top=`${window.visualViewport.offsetTop}px`});document.getElementById("timelineRuler").addEventListener("pointerdown",function(e){H=!0});document.getElementById("outputTypeInput").addEventListener("change",function(e){qe(e.target.value)});window.addEventListener("resize",()=>{ce()});function it(){document.getElementById("helpPopup1").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup1").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function lt(){document.getElementById("helpPopup1").style.display="none",document.getElementById("popupGlass").style.display="none"}function rt(){document.getElementById("helpPopup2").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup2").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function ot(){document.getElementById("helpPopup2").style.display="none",document.getElementById("popupGlass").style.display="none"}function at(){document.getElementById("helpPopup3").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup3").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function ct(){document.getElementById("helpPopup3").style.display="none",document.getElementById("popupGlass").style.display="none"}function st(){document.getElementById("helpPopup4").style.display="block",document.getElementById("popupGlass").style.display="block",console.warn(window.scrollTop),document.getElementById("helpPopup4").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function dt(){document.getElementById("helpPopup4").style.display="none",document.getElementById("popupGlass").style.display="none"}function we(){for(let e=1;e<5;e++)A(e)}function X(){return document.getElementById("outputTypeInput").value}var ee=document.getElementById("sequencerTimeline");ee.scrollTop=ee.scrollHeight;
