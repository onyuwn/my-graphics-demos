import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{G as st,i as ut,d as Me}from"./gif-DsIElLlq.js";const Ae=4,pt=`
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
`,mt=`
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
`;function ft(e,t,n){const l=De(e,e.VERTEX_SHADER,t),i=De(e,e.FRAGMENT_SHADER,n),a=e.createProgram();return e.attachShader(a,l),e.attachShader(a,i),e.linkProgram(a),e.getProgramParameter(a,e.LINK_STATUS)?a:(console.error(`Unable to initialize the shader program: ${e.getProgramInfoLog(a)}`),null)}function De(e,t,n){const l=e.createShader(t);return e.shaderSource(l,n),e.compileShader(l),e.getShaderParameter(l,e.COMPILE_STATUS)?l:(console.error(`An error occured compiling shader:
${e.getShaderInfoLog(l)}`),e.deleteShader(l),null)}function Re(e){return(e&e-1)===0}function ce(e,t){const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n);const l=0,i=e.RGBA,a=1,o=1,d=0,c=e.RGBA,m=e.UNSIGNED_BYTE,p=new Uint8Array([0,0,255,255]);e.texImage2D(e.TEXTURE_2D,l,i,a,o,d,c,m,p);const u=new Image;return u.crossOrigin="anonymous",u.src=t,u.onload=()=>{e.bindTexture(e.TEXTURE_2D,n),e.texImage2D(e.TEXTURE_2D,l,i,c,m,u),Re(u.width)&&Re(u.height)?e.generateMipmap(e.TEXTURE_2D):(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST)),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0)},n}let s=[[],[],[],[]],h,B=0,ve=0,q=!1,C=25,W=!1,M=100,ae=[],G=!1,he=!1,S=new st({workers:1,quality:10,width:256,height:256,workerScript:"/my-graphics-demos/gif/gif.worker.js"}),$=15,oe="mp4";async function gt(){const e=document.querySelector("#gl-canvas"),t=e.getContext("webgl");if(h=t,t===null){alert("Unable to initialize WebGL. Your browser or machine may not support it.");return}t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT);const n=ft(t,pt,mt),l={program:n,attribLocations:{vertexPosition:t.getAttribLocation(n,"aVertexPosition"),textureCoord:t.getAttribLocation(n,"aTextureCoord")},uniformLocations:{projectionMatrix:t.getUniformLocation(n,"uProjectionMatrix"),modelViewMatrix:t.getUniformLocation(n,"uModelViewMatrix"),uSampler:t.getUniformLocation(n,"uSampler"),time:t.getUniformLocation(n,"time"),transitionTime:t.getUniformLocation(n,"transitionTime"),sequenceItemLength:t.getUniformLocation(n,"sequenceItemLength"),transitionType:t.getUniformLocation(n,"transitionType"),transitionFadeType:t.getUniformLocation(n,"transitionFadeType"),sequenceIndex:t.getUniformLocation(n,"sequenceIndex"),sequenceItemStartTime:t.getUniformLocation(n,"sequenceItemStartTime"),colorThreshold:t.getUniformLocation(n,"colorThreshold"),fadeInColorThreshold:t.getUniformLocation(n,"fadeInColorThreshold"),fadeInTransitionTime:t.getUniformLocation(n,"fadeInTransitionTime"),fadeInTransitionType:t.getUniformLocation(n,"fadeInTransitionType"),clipEffect:t.getUniformLocation(n,"clipEffect"),clipEffectIntensity:t.getUniformLocation(n,"clipEffectIntensity"),fractalX:t.getUniformLocation(n,"fractalX"),fractalY:t.getUniformLocation(n,"fractalY"),fractalInitialZoom:t.getUniformLocation(n,"fractalInitialZoom"),invertFractal:t.getUniformLocation(n,"invertFractal"),clipEffectControlAlpha:t.getUniformLocation(n,"clipEffectControlAlpha"),pageCurlRadius:t.getUniformLocation(n,"pageCurlRadius"),pageCurlDir:t.getUniformLocation(n,"pageCurlDir")}},i=ut(t);ce(t,"/my-graphics-demos/ceiling1.png");const a=ce(t,"/my-graphics-demos/sky.png");var o=new FileReader,d=await fetch("sky.png");o.readAsDataURL(await d.blob()),o.addEventListener("load",p=>{s[0].push({name:"sky",imgData:p.target.result,texture:a,startTime:0,length:4,id:"0-0",transitionType:1,transitionTime:1,clipLayer:1,fadeInTransitionType:0,fadeInTransitionTime:1,transitionFadeType:!1,fractalInitialZoom:.0125,fractalX:-.95,fractalY:-.25,invertFractal:!1,pageCurlDir:45,pageCurlRadius:.1,clipType:"image"}),N()}),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!0),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0);let c=document.getElementById("errorPopup");S.on("progress",function(p){console.warn("progress"),console.warn(p);let u=document.getElementById("viewport");c.style.display="block",c.innerHTML="";let f=document.createElement("p"),y=document.createElement("div"),v=document.createElement("h1");if(y.className="popupHeader",v.innerHTML="RENDERING",f.innerHTML=`${(p*100).toFixed(4)}`,y.appendChild(v),c.appendChild(y),c.appendChild(f),c.style.left=`calc(50% - ${c.offsetWidth/2}px)`,u)u.style.background=`radial-gradient(circle at center, rgb(25, 255, 0) ${p*100}%, transparent ${100-p*100}%), url('/my-graphics-demos/uipamnel1.png') 100% center / cover`;else{let I=document.createElement("div");I.id="exportProgressBar",document.getElementById("viewport").appendChild(I)}}),S.on("error",function(p){let u=document.getElementById("errorPopup");u&&(V(SUCCESS,`An error has occured during export ${p.toString()}`),setTimeout(()=>{u.innerHTML="",u.style.display="none"},5e3))}),S.on("finished",function(p){let u=URL.createObjectURL(p),f=document.getElementById("downloadButton");f.href=u,f.download=`jakehsequencer${new Date(Date.now()).toISOString().replace(":","")}.gif`,f.click(),f.classList.remove("disabled"),he=!1,W=!1,G=!1,document.getElementById("sequencerStartStop").disabled=!1,document.getElementById("sequencerRestart").disabled=!1,c&&(V(SUCCESS,"Your gif is ready!!! It should have started downloading. If not, click the download button."),setTimeout(()=>{c.innerHTML="",c.style.display="none",document.getElementById("viewport").style.background=""},5e3)),S.running=!1});function m(p){if(p*=.001,q&&G==!1?(B=p-ve,Be()):G==!1&&(ve=p),G==!1&&Me(t,l,i,s,B),document.getElementById("timeValue").innerHTML=B.toFixed(4),W==!0){if(Te()=="gif")W=!1,Me(t,l,i,s,B),ae.length<M&&(e.toBlob(y=>{ae.push(y),B=x()*(ae.length/M);const v=new Image;v.src=URL.createObjectURL(y),v.onload=()=>{let I=x()*1e3/M;S.addFrame(v,{delay:Math.round(I)}),W=!0}}),V("CAPTURING FRAMES",`${ae.length} / ${M} stored...`));else if(Te()=="video"){W=!1,console.warn("recording!!!"),V("Rendering video...",`rendering ${x()}s long video (${oe}) @ ${$} fps`);let y=ht(e,x()*1e3,$,oe);B=0,q=!0;var u=document.createElement("video");y.then(v=>{u.setAttribute("src",v),V("Success!!","Video successfully rendered. Download should begin automatically..."),setTimeout(()=>{c.innerHTML="",c.style.display="none",document.getElementById("viewport").style.background=""},5e3),q=!1,B=0,document.getElementById("sequencerStartStop").disabled=!1,document.getElementById("sequencerRestart").disabled=!1});var f=document.createElement("a");f.setAttribute("download",`jakehsequencer${new Date(Date.now()).toISOString().replace(":","")}.${oe}`),y.then(v=>{f.setAttribute("href",v),f.click()})}}else S.frames.length>=M&&he==!1&&G==!0&&(he=!0,console.warn("GIFF"),S.render());requestAnimationFrame(m)}requestAnimationFrame(m)}gt();Ye("gif");function V(e,t){errorPopup.style.display="block",errorPopup.innerHTML="";let n=document.createElement("p"),l=document.createElement("div"),i=document.createElement("h1");l.className="popupHeader",i.innerHTML=e,n.innerHTML=t,l.appendChild(i),errorPopup.appendChild(l),errorPopup.appendChild(n),errorPopup.style.left=`calc(50% - ${errorPopup.offsetWidth/2}px)`}function ht(e,t,n,l){var i=[];return new Promise(function(a,o){let d=e.captureStream(n),c="video/webm; codecs=vp9";l=="mp4"&&(c="video/mp4");let m=new MediaRecorder(d,{mimeType:c});m.start(t||4e3),m.ondataavailable=function(p){i.push(p.data),m.state==="recording"&&m.stop()},m.onstop=function(p){var u=new Blob(i,{type:c.split(";")[0]}),f=URL.createObjectURL(u);a(f)}})}function x(){let e=0;for(let t=0;t<Ae;t++){let n=0;if(s[t].length>0){for(let l=0;l<s[t].length;l++)n+=s[t][l].length;n>e&&(e=n)}}return e}function Oe(e){let t=0;for(let n=0;n<s[e].length;n++)t+=s[e][n].length;return t}function vt(){return document.getElementById("sequencerTimeline").offsetLeft}let yt=4,qe=1,r;function Ie(e,t,n,l,i=yt,a=qe,o=0,d=1,c=0,m=0){let p={name:e.name,texture:t,imgData:n,startTime:Oe(l),length:i,id:`${l}-${s[l].length.valueOf()}`,transitionType:o,transitionTime:a,transitionFadeType:!1,fractalInitialZoom:.0125,fractalX:-.95,fractalY:-.25,invertFractal:!1,clipEffectControlAlpha:!1,clipLayer:l+1,clipEffect:m,clipEffectIntensity:1,fadeInTransitionType:c,fadeInTransitionTime:d,clipType:"image",pageCurlDir:45,pageCurlRadius:.1};s[l].push(p),console.warn(p),Ne(p),console.warn(s),document.getElementById("sequenceLengthValue").innerHTML=x().toFixed(4),M=$*x();let u=document.getElementById(`clipLayer${p.clipLayer}`),f=u.style.gridTemplateColumns.split(" ");f.push(`${p.length*C}px`),u.style.gridTemplateColumns=f.join(" ")}function j(e){Z(e+1);let t=document.getElementById(`clipLayer${e+1}`),n=s[e];for(let i=0;i<n.length;i++){let a=s[e][i],o=s[e][i-1];if(o&&o.clipType!="gap"&&o.startTime+o.length<a.startTime){let d=a.startTime-(o.startTime+o.length);Ee(e,i,d)}else o&&o.clipType=="gap"&&o.startTime+o.length>a.startTime?o.length=a.startTime-o.startTime:!o&&a.startTime>0&&Ee(e,i,a.startTime)}for(let i=0;i<n.length;i++){let a=s[e][i];Ne(a)}n=s[e];let l=n.map(i=>i.length*C);console.warn(l),t.style.gridTemplateColumns=l.join("px ")+"px",document.getElementById("sequenceLengthValue").innerHTML=x().toFixed(4)}function N(){console.warn("sequence update"),console.warn(s),$e();for(let e=0;e<Ae;e++)s[e].length>0&&j(e)}function $e(){let e=document.getElementById("timelineRuler");e.innerHTML="";let t=e.offsetWidth,n=t/C;console.warn(`${t} / ${C}`),console.warn(n);for(let l=0;l<n;l++){let i=document.createElement("div");if(i.className="sequenceTimelineRulerTick",i.style.left=10+l*C+e.offsetLeft,l%5==0){let a=document.createElement("p");a.innerHTML=l.toString(),i.appendChild(a)}e.appendChild(i),console.warn("tick added")}}function Ne(e,t=!1){let n=document.createElement("div"),l=document.getElementById(`clipLayer${e.clipLayer}`);if(e.clipType=="image"){let i=document.createElement("div"),a=document.createElement("img"),o=document.createElement("p");n.className="sequenceItemPlaceholder",n.style.background=`linear-gradient(to right, rgb(0, 255, 13) ${(e.length-e.transitionTime)/e.length*100}%, rgb(41, 0, 79))`,o.innerHTML=e.name,o.className="sequenceItemName",a.className="sequenceThumbnail",a.src=e.imgData,n.id=e.id,i.className="clipNameThumbContainer",i.appendChild(o),i.appendChild(a),n.appendChild(i);let d=document.createElement("div");document.createElement("div"),d.className="lengthController",d.id=`${n.id}-lengthController`,d.addEventListener("touchstart",m=>m.preventDefault()),d.addEventListener("pointerdown",Et),i.addEventListener("pointerdown",Tt),i.addEventListener("touchstart",m=>m.preventDefault());let c=+e.id.split("-")[1];n.style.gridColumn=c+1,n.appendChild(d),l.appendChild(n),n.addEventListener("click",Bt)}else{n.className="gapPlaceholder",n.id=e.id;let i=+e.id.split("-")[1];n.style.gridColumn=i+1,l.appendChild(n)}}let Ce=!1,de=!1,se=!1,Y=!1,re=!1,Le=-1,We=0,Ge=0,L=0,ye=0,ue=0,ze=0,D,b;function Et(e){for(console.warn("STARTING RESIZE"),Ce=!0,We=e.clientX,D=e.target;D.className.includes("sequenceItemPlaceholder")==!1;)D=D.parentElement;let n=D.id.split("-"),l=n[0],i=n[1],a=s[l][i];Ze(`${l}-${i}`),document.getElementById(`${l}-${i}`),document.getElementById(`clipLayer#${+l+1}`),ze=a.length*C}function Tt(e){for(console.warn("STARTING MOVE"),de=!0,Ge=e.clientX,b=e.target;b.id.includes("-")==!1;)b=b.parentElement;let t=+b.id.split("-")[1],n=+b.id.split("-")[0];Ze(`${n}-${t}`);let l=s[n][t],i=s[n][t-1];i&&i.clipType=="gap"&&(ye=+document.getElementById(`clipLayer${n+1}`).style.gridTemplateColumns.split(" ")[t-1].replace("px",""),Le=i.length+i.startTime),ue=l.startTime,console.warn(`initial clip start: ${ue}`),console.warn(`initial gap width: ${ye}`)}function Ee(e,t,n=.01){let l=s[e][t],i={name:"gap",startTime:n!=.01?l.startTime-n:l.startTime,length:n,id:`${e}-${t}`,transitionType:0,transitionTime:qe,clipLayer:e+1,clipEffect:0,clipEffectIntensity:1,fadeInTransitionType:0,fadeInTransitionTime:0,clipType:"gap"};s[e].splice(t,0,i);for(let a=t+1;a<s[e].length;a++)a!=t+1&&(s[e][a].startTime+=n),s[e][a].id=`${e}-${a}`;n==.01&&j(e)}document.addEventListener("pointermove",function(e){let t=e.clientX;if(Ce==!0&&D&&e.target.id.includes("-")&&e.target.id.split("-").length==3){let n=D.id.split("-");console.warn(n);let l=+n[0],i=+n[1];s[l][i];let o=(t-We+ze)/C;tt(o),Je(o),j(l)}else if(de&&b){let n=+b.id.split("-")[1],l=+b.id.split("-")[0];re==!0&&(n+=1);let i=s[l][n];L=(t-Ge)/C;let a=s[l][n-1];console.warn(L),s[l].length>=1&&L>0&&L+ue>Le&&(console.warn(L),a&&a.clipType=="gap"&&(Y=!0),Y==!0&&a?(i.startTime=L+.01+ue,re==!0?a.length=L:a.length=L+ye/C,console.warn("updating layer"),j(l)):Y==!1&&(console.warn("inserting gap"),Ee(l,n),re=!0,Y=!0,i.startTime=L+.01)),et(i.startTime)}else if(se){let n=document.getElementById("timelineRuler");B=(e.clientX-n.offsetLeft)/C,Be()}});document.addEventListener("pointerup",function(e){if(D&&(console.warn("completing resize"),Ce=!1,D=void 0,r=void 0),b&&de==!0){de=!1,Y=!1,re=!1;let t=r.id.split("-");it(r.clipLayer-1,t[1],L),b=void 0,L=0,Le=-1,console.warn("MOVE COMPLETE")}se&&(se=!1)});function It(e){let t=e.target.value;console.warn(e.target.value),r.transitionType=+e.target.value,Xe(t)}function Xe(e){let t=document.getElementById("transitionStyleInputSection");if(Lt(),e==4){t.style.flexDirection="row";let n=document.createElement("p");n.id="colorThresholdInputLabel",n.innerHTML="threshold color";let l=document.createElement("input");l.type="color",l.id="colorThresholdPicker",l.addEventListener("change",function(i){console.warn(i.target.value);let a=i.target.value,o=pe(a);r.colorThreshold=o,console.warn(r.colorThreshold)}),t.appendChild(n),t.appendChild(l)}else if(e==6){t.style.flexDirection="column";let n=document.createElement("p");n.id="fractalFadeTypeInputLabel",n.innerHTML="Fade to black?";let l=document.createElement("input");l.type="checkbox",l.style.width="30px",l.style.height="30px",l.id="fadeTypeInput",l.value=r.transitionFadeType;let i=document.createElement("div");i.style.display="flex",i.style.alignItems="center";let a=document.createElement("div");a.style.display="flex",a.style.alignItems="center";let o=document.createElement("div");o.style.display="flex",o.style.alignItems="center";let d=document.createElement("p");d.innerHTML="Fractal Coords";let c=document.createElement("input");c.type="number",c.id="fractalXInput",c.value=r.fractalX,c.step="any";let m=document.createElement("input");m.type="number",m.id="fractalYInput",m.value=r.fractalY,m.step="any",i.appendChild(d),i.appendChild(c),i.appendChild(m);let p=document.createElement("p");p.innerHTML="InitialZoom";let u=document.createElement("input");u.type="number",u.id="fractalZoomInput",u.value=r.fractalInitialZoom,u.step="any",t.appendChild(i),a.appendChild(p),a.appendChild(u),t.appendChild(a),l.addEventListener("change",function(f){r.transitionFadeType=f.target.checked}),c.addEventListener("change",function(f){r.fractalX=f.target.value}),m.addEventListener("change",function(f){r.fractalY=f.target.value}),u.addEventListener("change",function(f){r.fractalInitialZoom=f.target.value}),o.appendChild(n),o.appendChild(l),t.appendChild(o)}else if(e==7){let n=document.createElement("div"),l=document.createElement("div"),i=document.createElement("p"),a=document.createElement("p");i.innerHTML="Curl radius",a.innerHTML="Curl direction";let o=document.createElement("input"),d=document.createElement("input");o.type="number",d.type="number",o.addEventListener("change",function(c){r.pageCurlRadius=+c.target.value}),d.addEventListener("change",function(c){r.pageCurlDir=+c.target.value*(Math.PI/180)}),n.appendChild(i),n.appendChild(o),l.appendChild(a),l.appendChild(d),n.style.display="flex",l.style.display="flex",t.appendChild(n),t.appendChild(l),t.style.display="flex",t.style.flexDirection="column",t.style.marginLeft="5px",d.value=r.pageCurlDir,o.value=r.pageCurlRadius}}function Ve(){let e=document.getElementById("fadeInStyleSection"),t=document.createElement("p");t.id="fadeInColorThresholdInputLabel",t.innerHTML="threshold color";let n=document.createElement("input");n.type="color",n.id="fadeInColorThresholdPicker",n.addEventListener("change",function(l){console.warn(l.target.value);let i=l.target.value,a=pe(i);r.fadeInColorThresholdolorThreshold=a,console.warn(r.colorThreshold)}),e.appendChild(t),e.appendChild(n)}function Ct(){let e=document.getElementById("fadeInStyleSection");e.innerHTML=""}function Ye(e){let t=document.getElementById("outputTypeOptions");if(t.innerHTML="",e=="gif"){let n=document.createElement("div"),l=document.createElement("p");l.innerHTML="Quality *higher is worse*",n.className="renderSettingsItem";let i=document.createElement("input");i.type="number";let a=document.createElement("input");a.type="range",a.min=1,a.max=1e4,a.step=1,a.value=10,i.value=10,n.appendChild(l),n.appendChild(a),n.appendChild(i),a.addEventListener("input",function(o){S.setOption("quality",+o.target.value),i.value=+o.target.value}),i.addEventListener("input",function(o){S.setOption("quality",+o.target.value),a.value=+o.target.value}),t.appendChild(n)}else if(e=="video"){let n=document.createElement("div");n.className="renderSettingsItem";let l=document.createElement("select"),i=document.createElement("option");i.value="mp4",i.innerHTML="MP4";let a=document.createElement("option");a.value="webm",a.innerHTML="WEBM",l.appendChild(i),l.appendChild(a);let o=document.createElement("p");o.innerHTML="Video Type",n.appendChild(o),n.appendChild(l),t.appendChild(n),l.addEventListener("change",function(d){oe=d.target.value})}}function pe(e){let t=e.replace("#",""),n=parseInt(t.substring(0,2),16),l=parseInt(t.substring(2,4),16),i=parseInt(t.substring(4,6),16);return[n/255,l/255,i/255]}function je(e,t,n){return"#"+(1<<24|e<<16|t<<8|n).toString(16).slice(1)}function Lt(){let e=document.getElementById("transitionStyleInputSection");e.innerHTML=""}function Bt(e){r?(St(),document.getElementById(`${r.id}`).classList.remove("selected")):bt(),Ke();let t=e.target.id,n=e.target;for(;!t||t&&t.includes("-")==!1;)t=n.parentElement.id,n=n.parentElement,console.warn(t);let l=0,i=0;if(t.includes("-")==!0&&t.split("-").length==2){let a=t.split("-");l=+a[0],i=+a[1],r=s[l][i],document.getElementById(`${t}`).classList.add("selected"),Qe(r)}}function St(){document.getElementById("selectAllClipsButton").disabled=!1,document.getElementById("duplicateClipButton").disabled=!1,document.getElementById("removeClipToolButton").disabled=!1,document.getElementById("moveClipUpButton").disabled=!1,document.getElementById("moveClipDownButton").disabled=!1,document.getElementById("selectAllClipsButton").classList.remove("disabled"),document.getElementById("duplicateClipButton").classList.remove("disabled"),document.getElementById("removeClipToolButton").classList.remove("disabled"),document.getElementById("moveClipUpButton").classList.remove("disabled"),document.getElementById("moveClipDownButton").classList.remove("disabled")}function bt(){document.getElementById("selectAllClipsButton").disabled=!0,document.getElementById("duplicateClipButton").disabled=!0,document.getElementById("removeClipToolButton").disabled=!0,document.getElementById("moveClipUpButton").disabled=!0,document.getElementById("moveClipDownButton").disabled=!0,document.getElementById("selectAllClipsButton").classList.add("disabled"),document.getElementById("duplicateClipButton").classList.add("disabled"),document.getElementById("removeClipToolButton").classList.add("disabled"),document.getElementById("moveClipUpButton").classList.add("disabled"),document.getElementById("moveClipDownButton").classList.add("disabled")}function Ze(e){Ke();let t=e,n=0,l=0;if(t.includes("-")==!0&&t.split("-").length==2){let i=t.split("-");n=+i[0],l=+i[1],r=s[n][l],document.getElementById(`${t}`).classList.add("selected"),Qe(r)}}function Ke(){r&&document.getElementById(`${r.id}`).classList.remove("selected"),r=void 0;for(let e=0;e<5;e++){let t=document.getElementById(`clipLayer${e+1}`);for(const n of t.children)n.classList.remove("selected")}}function Qe(e){var t,n;(t=document.getElementById("colorThresholdInputLabel"))==null||t.remove(),(n=document.getElementById("colorThresholdPicker"))==null||n.remove(),xt(e.name),Je(e.length),wt(e.transitionType),Xe(e.transitionType),Pt(e.transitionTime),et(e.startTime),Mt(e.clipLayer),Rt(e.fadeInTransitionType),Ht(e.clipEffect),Dt(e.fadeInTransitionTime),e.colorThreshold&&Ft(e.colorThreshold),e.fadeInTransitionType==4&&e.fadeInColorThreshold&&_t(e.colorThreshold)}function xt(e){document.getElementById("clipNameLabel").innerHTML=e}function Je(e){document.getElementById("clipLengthInput").value=+e}function wt(e){document.getElementById("transitionSelectionInput").value=e}function Pt(e){document.getElementById("transitionLengthInput").value=e}function et(e){document.getElementById("clipStartTimeInput").value=e}function Mt(e){document.getElementById("clipLayerSelection").value=e}function tt(e){let t=e-r.length;r.length=e;let n=+r.id.split("-")[1];it(r.clipLayer-1,n,t)}function Dt(e){document.getElementById("fadeInLengthInput").value=e}function Rt(e){document.getElementById("fadeInSelectionInput").value=e}function Ht(e){document.getElementById("clipEffectInput").value=e,e>0?lt():nt()}function nt(){let e=document.getElementById("clipEffectParameterSection");e.innerHTML=""}function lt(){let e=document.getElementById("clipEffectParameterSection");if(e.style.display="flex",e.style.flexDirection="column",e.innerHTML)return;let t=document.createElement("p"),n=document.createElement("p");t.innerHTML="Effect Intensity",n.innerHTML="Control Alpha?";let l=document.createElement("div");l.style.display="flex";let i=document.createElement("div");i.style.display="flex";let a=document.createElement("input"),o=document.createElement("input");o.type="checkbox",a.id="clipEffectIntensitySlider",a.type="range",a.value=r.clipEffectIntensity,a.step=.25,a.max=10,a.min=-10,a.addEventListener("input",function(c){let m=document.getElementById("clipEffectIntensityInput");m.value=+c.target.value,kt(+c.target.value)}),o.addEventListener("change",function(c){console.warn(c.target.checked),r.clipEffectControlAlpha=c.target.checked});let d=document.createElement("input");d.id="clipEffectIntensityInput",d.type="number",d.value=r.clipEffectIntensity,o.checked=r.clipEffectControlAlpha,l.appendChild(t),l.appendChild(a),l.appendChild(d),i.appendChild(n),i.appendChild(o),e.appendChild(l),e.appendChild(i)}function kt(e){r.clipEffectIntensity=e}function Ft(e){console.warn(e);let t=je(Math.round(e[0]*255),Math.round(e[1]*255),Math.round(e[2]*255));console.warn(t),document.getElementById("colorThresholdPicker").value=t}function _t(e){document.getElementById("fadeInStyleSection").innerHTML||Ve(),console.warn(e);let n=je(Math.round(e[0]*255),Math.round(e[1]*255),Math.round(e[2]*255));console.warn(n),document.getElementById("fadeInColorThresholdPicker").value=n}function it(e,t,n){console.warn(`updating start times on ${e}`);let l=s[e];if(l.length>0)for(let i=0;i<l.length;i++)i>t&&(l[i].startTime+=n);console.warn("start times fixed"),console.warn(l)}function at(e,t){let n=s[e][t-1],l=s[e][t+1],i=s[e].length,a=s[e].splice(t,1);if(l&&l.clipType=="gap"&&n&&n.clipType=="gap"){let o=+l.id.split("-")[1],d=+n.id.split("-")[1];o>=i-1?s[e].splice(d,2):(s[e].splice(o-1,2),n.length+=l.length)}for(let o=t;o<s[e].length;o++)s[e][o].startTime-=a[0].length,s[e][o].id=`${e}-${o}`;return a[0]}function ot(e,t){let n=s[e];t.id=`${e}-${n.length}`,t.startTime=Oe(e),n.push(t)}function Be(){document.getElementById("sequenceMarker").style.left=10+B*C+vt()}function Z(e){document.getElementById(`clipLayer${e}`).innerHTML=""}function Ut(){B=0,Be(),q=!1,Te()=="gif"&&(G=!0),document.querySelector("#gl-canvas"),x(),W=!0,document.getElementById("sequencerStartStop").disabled=!0,document.getElementById("sequencerRestart").disabled=!0}document.getElementById("sequenceItemInput").addEventListener("change",function(e){let t=e.target.files[0];var n=new FileReader;n.addEventListener("load",function(l){const i=ce(h,l.target.result);Ie(t,i,l.target.result,0)}),t&&n.readAsDataURL(t)});document.getElementById("imageSequenceInput").addEventListener("change",function(e){let t=e.target.files,n=[],l=At(t.length);function i(a){return new Promise(function(o,d){let c=new FileReader;c.addEventListener("load",function(m){o(m.target.result)}),c.readAsDataURL(a)})}l.then(a=>{if(t&&t.length>0)for(let o=0;o<t.length;o++)n.push(i(t[o]));Promise.all(n).then(o=>{for(let d=0;d<o.length;d++){const c=ce(h,o[d]);Ie(t[d],c,o[d],a.clipLayer-1,a.clipLength,a.fadeOutTransitionTime,a.fadeOutTransitionType,a.fadeInTransitionTime,a.fadeInTransitionType,a.clipEffect)}})}).catch(()=>{document.getElementById("imageSequenceConfirmationContainer").remove(),e.target.value=void 0})});function At(e){let t=document.createElement("div");t.id="imageSequenceConfirmationContainer",t.className="smallMessage",t.style.display="block",t.innerHTML="";let n=document.createElement("p"),l=document.createElement("div"),i=document.createElement("h1");l.className="popupHeader",i.innerHTML="Image Sequence Settings",n.innerHTML=`You are about to add ${e} images.`,l.appendChild(i),t.appendChild(l),t.appendChild(n),setTimeout(()=>{t.style.left=`calc(50% - ${t.offsetWidth/2}px)`},200);let a=document.createElement("div");a.style.display="flex",a.className="sequenceInfoItem";let o=document.createElement("p");o.innerHTML="Clip Length";let d=document.createElement("input");d.value=4,d.type="number",a.appendChild(o),a.appendChild(d),t.appendChild(a);let c=document.createElement("div");c.style.display="flex",c.className="sequenceInfoItem";let m=document.createElement("p");m.innerHTML="Clip Effect";let p=document.getElementById("clipEffectInput").cloneNode(!0);p.id="clipEffectInput2",c.appendChild(m),c.appendChild(p),t.appendChild(c);let u=document.createElement("div");u.style.display="flex",u.className="sequenceInfoItem";let f=document.createElement("p");f.innerHTML="Transition Length";let y=document.createElement("input");y.value=1,y.type="number",u.appendChild(f),u.appendChild(y),t.appendChild(u);let v=document.createElement("div");v.style.display="flex",v.className="sequenceInfoItem";let I=document.createElement("p");I.innerHTML="Transition Type";let R=document.getElementById("transitionSelectionInput").cloneNode(!0);R.id="transitionTypeInput2",v.appendChild(I),v.appendChild(R),t.appendChild(v);let H=document.createElement("div");H.style.display="flex",H.className="sequenceInfoItem";let k=document.createElement("p");k.innerHTML="Clip Layer";let F=document.createElement("input");F.value=1,F.type="number",H.appendChild(k),H.appendChild(F),t.appendChild(H);let _=document.createElement("div");_.style.display="flex";let U=document.createElement("button");U.innerHTML="add images",U.className="controlbutton2";let w=document.createElement("button");return w.innerHTML="cancel",w.className="controlButton",_.appendChild(w),_.appendChild(U),t.appendChild(_),document.body.appendChild(t),new Promise(function(K,A){U.addEventListener("click",function(){K({clipLength:+d.value,fadeInTransitionType:0,fadeInTransitionTime:0,clipEffect:+p.value,clipEffectIntensity:0,fadeOutTransitionType:+R.value,fadeOutTransitionTime:+y.value,clipLayer:+F.value}),t.remove()}),w.addEventListener("click",function(Q){A()})})}document.getElementById("sequencerStartStop").addEventListener("click",function(e){q=!q,q?e.target.innerHTML="stop":e.target.innerHTML="play"});document.getElementById("sequencerRestart").addEventListener("click",function(e){ve=B.valueOf()});document.getElementById("transitionSelectionInput").addEventListener("change",It);document.getElementById("clipLengthInput").addEventListener("change",function(e){console.warn("updating length"),tt(+e.target.value),r&&j(r.clipLayer-1)});document.getElementById("exportButton").addEventListener("click",function(e){Ut()});document.getElementById("timelineHorizontalScale").addEventListener("input",function(e){console.warn(e.target.value),C=+e.target.value,Z(1),N()});document.getElementById("removeClipButton").addEventListener("click",function(e){s[r.clipLayer-1].splice(+r.id.split("-")[1],1),r=void 0,Z(1),N(),M=$*x()});document.getElementById("frameRateInput").addEventListener("change",function(e){$=+e.target.value,M=$*x()});document.getElementById("outputWidthInput").addEventListener("change",function(e){S.setOption("width",+event.target.value),S.setOption("height",+event.target.value),document.getElementById("gl-canvas").style.width=`${e.target.value}px`,h.viewport(0,0,document.getElementById("gl-canvas").clientWidth,document.getElementById("gl-canvas").clientHeight)});document.getElementById("viewportScale").addEventListener("input",function(e){document.getElementById("gl-canvas").style.width=`${+e.target.value*256}px`});document.getElementById("clipLayerSelection").addEventListener("change",function(e){if(r){let t=r.id.split("-"),n=+t[0],l=+t[1];console.warn(e),console.warn(e.target.value),r.clipLayer=+e.target.value,Se();let i=at(n,l);ot(+e.target.value-1,i),N()}});document.getElementById("clipStartTimeInput").addEventListener("change",function(e){r&&(r.startTime=+e.target.value,Se(),N())});document.getElementById("transitionLengthInput").addEventListener("change",function(e){r&&(r.transitionTime=+e.target.value)});document.getElementById("fadeInSelectionInput").addEventListener("change",function(e){r&&(r.fadeInTransitionType=+e.target.value,r.fadeInTransitionType==4?Ve():Ct())});document.getElementById("clipEffectInput").addEventListener("change",function(e){r&&(r.clipEffect=+e.target.value,r.clipEffect>0?lt():nt())});document.getElementById("fadeInLengthInput").addEventListener("change",function(e){r&&(r.fadeInTransitionTime=+e.target.value)});document.getElementById("timelineHelpButton").addEventListener("click",function(e){qt()});var ke;(ke=document.getElementById("closePopup1Button"))==null||ke.addEventListener("click",function(e){$t()});document.getElementById("addImageHelpButton").addEventListener("click",function(e){Nt()});var Fe;(Fe=document.getElementById("closePopup2Button"))==null||Fe.addEventListener("click",function(e){Wt()});document.getElementById("clipSettingsHelpButton").addEventListener("click",function(e){Gt()});var _e;(_e=document.getElementById("closePopup3Button"))==null||_e.addEventListener("click",function(e){zt()});document.getElementById("renderSettingsHelpButton").addEventListener("click",function(e){Xt()});var Ue;(Ue=document.getElementById("closePopup4Button"))==null||Ue.addEventListener("click",function(e){Vt()});document.getElementById("sequencerTimeline").addEventListener("scroll",function(e){document.getElementById("timelineRuler").style.top=`${window.visualViewport.offsetTop}px`});document.getElementById("timelineRuler").addEventListener("pointerdown",function(e){se=!0});document.getElementById("outputTypeInput").addEventListener("change",function(e){Ye(e.target.value)});document.getElementById("removeClipToolButton").addEventListener("click",function(e){s[r.clipLayer-1].splice(+r.id.split("-")[1],1),r=void 0,Z(1),N(),M=$*x()});document.getElementById("moveClipUpButton").addEventListener("click",function(e){r.clipLayer<4&&rt(r.clipLayer,r.clipLayer+1)});document.getElementById("moveClipDownButton").addEventListener("click",function(e){r.clipLayer>1&&rt(r.clipLayer,r.clipLayer-1)});document.getElementById("addTitleButton").addEventListener("click",function(e){Ot().then(n=>{Ie({name:"title"},n.texture,n.texture,1)}).catch(()=>{document.getElementById("titleCardConfigurationPopup").remove()})});function Ot(){let e=document.createElement("div");e.id="titleCardConfigurationPopup",e.className="smallMessage",e.style.display="block";let t=document.createElement("canvas");t.style.border="1px solid yellow";let n=document.createElement("div");n.className="sequenceInfoItem";let l=document.createElement("p");l.innerHTML="Title";let i=document.createElement("textarea");n.appendChild(l),n.appendChild(i),e.appendChild(t);let a=document.createElement("div");a.className="sequenceInfoItem";let o=document.createElement("p");o.innerHTML="Text Color";let d=document.createElement("input");d.type="color",a.appendChild(o),a.appendChild(d),e.appendChild(a);let c=document.createElement("div");c.className="sequenceInfoItem";let m=document.createElement("p");m.innerHTML="Background Color";let p=document.createElement("input");p.type="checkbox";let u=document.createElement("input");u.type="color",c.appendChild(m),c.appendChild(p),c.appendChild(u),e.appendChild(c);let f="#ffffff",y=document.createElement("div");y.className="sequenceInfoItem";let v=document.createElement("p");v.innerHTML="Font Size";let I=document.createElement("input");I.type="number",I.value=36,y.appendChild(v),y.appendChild(I),e.appendChild(y);let R=document.createElement("div");R.className="sequenceInfoItem";let H=document.createElement("p");H.innerHTML="Alignment";let k=document.createElement("select"),F=document.createElement("option");F.value="left",F.innerHTML="LEFT",k.appendChild(F);let _=document.createElement("option");_.value="center",_.innerHTML="CENTER",k.appendChild(_);let U=document.createElement("option");U.value="right",U.innerHTML="RIGHT",k.appendChild(U),R.appendChild(H),R.appendChild(k),e.appendChild(R);let w=document.createElement("div");w.className="sequenceInfoItem";let K=document.createElement("p");K.innerHTML="Baseline";let A=document.createElement("select"),Q=document.createElement("option");Q.value="top",Q.innerHTML="TOP",A.appendChild(Q);let me=document.createElement("option");me.value="center",me.innerHTML="CENTER",A.appendChild(me);let fe=document.createElement("option");fe.value="bottom",fe.innerHTML="BOTTOM",A.appendChild(fe),w.appendChild(K),w.appendChild(A),e.appendChild(w);let z=document.createElement("div");z.className="sequenceInfoItem";let ct=document.createElement("p");v.innerHTML="Font Size";let J=document.createElement("input"),ee=document.createElement("input");J.type="number",J.value=256,ee.type="number",ee.value=256,z.appendChild(ct),z.appendChild(J),z.appendChild(ee),e.appendChild(z);let O=36,X="",be="center",xe="middle",te=256,ne=256,we=!1,Pe="#ffffff",dt=new FontFace("angelicPeace","url('/my-graphics-demos/Angelic Peace.ttf')"),E=t.getContext("2d");function P(){E.canvas.height=256,E.canvas.width=256,E.font=`${O}px angelicPeace`,E.textAlign=be,E.textBaseline=xe,E.clearRect(0,0,E.canvas.width,E.canvas.height);let g=X.split(`
`);if(we==!0&&(E.fillStyle=Pe,E.fillRect(te/2-O*X.length/2,ne/2-O/2,X.length*O,O*g.length)),E.fillStyle=f,g&&g.length>0)for(let T=0;T<g.length;T++)E.fillText(g[T],te/2,ne/2+T*(O+2.5));else E.fillText(X,te/2,ne/2)}I.addEventListener("input",function(g){O=+g.target.value,P()}),J.addEventListener("input",function(g){te=+g.target.value,P()}),ee.addEventListener("input",function(g){ne=+g.target.value,P()}),dt.load().then(()=>{i.addEventListener("input",function(g){X=g.target.value,P()})}),k.addEventListener("change",function(g){be=g.target.value,P()}),A.addEventListener("change",function(g){xe=g.target.value,P()}),d.addEventListener("change",function(g){let T=g.target.value;pe(T),console.warn(T),f=T,P()}),u.addEventListener("change",function(g){let T=g.target.value;pe(T),console.warn(T),Pe=T,P()}),p.addEventListener("change",function(g){we=g.target.checked,P()}),e.appendChild(n);let le=document.createElement("button");le.innerHTML="cancel",le.className="controlButton2";let ie=document.createElement("button");return ie.innerHTML="add title",ie.className="controlButton2",e.appendChild(le),e.appendChild(ie),setTimeout(()=>{e.style.left=`calc(50% - ${e.offsetWidth/2}px)`},200),document.body.appendChild(e),new Promise(function(g,T){ie.addEventListener("click",function(){var ge=h.createTexture();h.bindTexture(h.TEXTURE_2D,ge),h.texImage2D(h.TEXTURE_2D,0,h.RGBA,h.RGBA,h.UNSIGNED_BYTE,E.canvas),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_MIN_FILTER,h.LINEAR),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_WRAP_S,h.CLAMP_TO_EDGE),h.texParameteri(h.TEXTURE_2D,h.TEXTURE_WRAP_T,h.CLAMP_TO_EDGE),g({texture:ge}),e.remove()}),le.addEventListener("click",function(ge){T()})})}function rt(e,t){let n=r.id.split("-");+n[0];let l=+n[1];r.clipLayer=+t,Se();let i=at(e-1,l);ot(t-1,i),N()}window.addEventListener("resize",()=>{$e()});function qt(){document.getElementById("helpPopup1").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup1").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function $t(){document.getElementById("helpPopup1").style.display="none",document.getElementById("popupGlass").style.display="none"}function Nt(){document.getElementById("helpPopup2").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup2").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function Wt(){document.getElementById("helpPopup2").style.display="none",document.getElementById("popupGlass").style.display="none"}function Gt(){document.getElementById("helpPopup3").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup3").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function zt(){document.getElementById("helpPopup3").style.display="none",document.getElementById("popupGlass").style.display="none"}function Xt(){document.getElementById("helpPopup4").style.display="block",document.getElementById("popupGlass").style.display="block",console.warn(window.scrollTop),document.getElementById("helpPopup4").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function Vt(){document.getElementById("helpPopup4").style.display="none",document.getElementById("popupGlass").style.display="none"}function Se(){for(let e=1;e<5;e++)Z(e)}function Te(){return document.getElementById("outputTypeInput").value}var He=document.getElementById("sequencerTimeline");He.scrollTop=He.scrollHeight;
