import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{G as _e,i as $e,d as le}from"./gif-DsIElLlq.js";const pe=4,qe=`
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
`,Oe=`
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
`;function Ae(e,t,n){const i=ae(e,e.VERTEX_SHADER,t),l=ae(e,e.FRAGMENT_SHADER,n),a=e.createProgram();return e.attachShader(a,i),e.attachShader(a,l),e.linkProgram(a),e.getProgramParameter(a,e.LINK_STATUS)?a:(console.error(`Unable to initialize the shader program: ${e.getProgramInfoLog(a)}`),null)}function ae(e,t,n){const i=e.createShader(t);return e.shaderSource(i,n),e.compileShader(i),e.getShaderParameter(i,e.COMPILE_STATUS)?i:(console.error(`An error occured compiling shader:
${e.getShaderInfoLog(i)}`),e.deleteShader(i),null)}function oe(e){return(e&e-1)===0}function N(e,t){const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n);const i=0,l=e.RGBA,a=1,o=1,s=0,c=e.RGBA,m=e.UNSIGNED_BYTE,p=new Uint8Array([0,0,255,255]);e.texImage2D(e.TEXTURE_2D,i,l,a,o,s,c,m,p);const u=new Image;return u.crossOrigin="anonymous",u.src=t,u.onload=()=>{e.bindTexture(e.TEXTURE_2D,n),e.texImage2D(e.TEXTURE_2D,i,l,c,m,u),oe(u.width)&&oe(u.height)?e.generateMipmap(e.TEXTURE_2D):(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST)),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0)},n}let d=[[],[],[],[]],X,T=0,Z=0,b=!1,y=25,B=!1,S=100,q=[],w=!1,j=!1,C=new _e({workers:1,quality:10,width:256,height:256,workerScript:"/my-graphics-demos/gif/gif.worker.js"}),P=15,O="mp4";async function Ne(){const e=document.querySelector("#gl-canvas"),t=e.getContext("webgl");if(X=t,t===null){alert("Unable to initialize WebGL. Your browser or machine may not support it.");return}t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT);const n=Ae(t,qe,Oe),i={program:n,attribLocations:{vertexPosition:t.getAttribLocation(n,"aVertexPosition"),textureCoord:t.getAttribLocation(n,"aTextureCoord")},uniformLocations:{projectionMatrix:t.getUniformLocation(n,"uProjectionMatrix"),modelViewMatrix:t.getUniformLocation(n,"uModelViewMatrix"),uSampler:t.getUniformLocation(n,"uSampler"),time:t.getUniformLocation(n,"time"),transitionTime:t.getUniformLocation(n,"transitionTime"),sequenceItemLength:t.getUniformLocation(n,"sequenceItemLength"),transitionType:t.getUniformLocation(n,"transitionType"),transitionFadeType:t.getUniformLocation(n,"transitionFadeType"),sequenceIndex:t.getUniformLocation(n,"sequenceIndex"),sequenceItemStartTime:t.getUniformLocation(n,"sequenceItemStartTime"),colorThreshold:t.getUniformLocation(n,"colorThreshold"),fadeInColorThreshold:t.getUniformLocation(n,"fadeInColorThreshold"),fadeInTransitionTime:t.getUniformLocation(n,"fadeInTransitionTime"),fadeInTransitionType:t.getUniformLocation(n,"fadeInTransitionType"),clipEffect:t.getUniformLocation(n,"clipEffect"),clipEffectIntensity:t.getUniformLocation(n,"clipEffectIntensity"),fractalX:t.getUniformLocation(n,"fractalX"),fractalY:t.getUniformLocation(n,"fractalY"),fractalInitialZoom:t.getUniformLocation(n,"fractalInitialZoom"),invertFractal:t.getUniformLocation(n,"invertFractal"),clipEffectControlAlpha:t.getUniformLocation(n,"clipEffectControlAlpha"),pageCurlRadius:t.getUniformLocation(n,"pageCurlRadius"),pageCurlDir:t.getUniformLocation(n,"pageCurlDir")}},l=$e(t);N(t,"/my-graphics-demos/ceiling1.png");const a=N(t,"/my-graphics-demos/sky.png");var o=new FileReader,s=await fetch("sky.png");o.readAsDataURL(await s.blob()),o.addEventListener("load",p=>{d[0].push({name:"sky",imgData:p.target.result,texture:a,startTime:0,length:4,id:"0-0",transitionType:1,transitionTime:1,clipLayer:1,fadeInTransitionType:0,fadeInTransitionTime:1,transitionFadeType:!1,fractalInitialZoom:.0125,fractalX:-.95,fractalY:-.25,invertFractal:!1,pageCurlDir:45,pageCurlRadius:.1,clipType:"image"}),H()}),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!0),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0);let c=document.getElementById("errorPopup");C.on("progress",function(p){console.warn("progress"),console.warn(p);let u=document.getElementById("viewport");c.style.display="block",c.innerHTML="";let f=document.createElement("p"),h=document.createElement("div"),g=document.createElement("h1");if(h.className="popupHeader",g.innerHTML="RENDERING",f.innerHTML=`${(p*100).toFixed(4)}`,h.appendChild(g),c.appendChild(h),c.appendChild(f),c.style.left=`calc(50% - ${c.offsetWidth/2}px)`,u)u.style.background=`radial-gradient(circle at center, rgb(25, 255, 0) ${p*100}%, transparent ${100-p*100}%), url('/my-graphics-demos/uipamnel1.png') 100% center / cover`;else{let x=document.createElement("div");x.id="exportProgressBar",document.getElementById("viewport").appendChild(x)}}),C.on("error",function(p){let u=document.getElementById("errorPopup");u&&(D(SUCCESS,`An error has occured during export ${p.toString()}`),setTimeout(()=>{u.innerHTML="",u.style.display="none"},5e3))}),C.on("finished",function(p){let u=URL.createObjectURL(p),f=document.getElementById("downloadButton");f.href=u,f.download=`jakehsequencer${new Date(Date.now()).toISOString().replace(":","")}.gif`,f.click(),f.classList.remove("disabled"),j=!1,B=!1,w=!1,document.getElementById("sequencerStartStop").disabled=!1,document.getElementById("sequencerRestart").disabled=!1,c&&(D(SUCCESS,"Your gif is ready!!! It should have started downloading. If not, click the download button."),setTimeout(()=>{c.innerHTML="",c.style.display="none",document.getElementById("viewport").style.background=""},5e3)),C.running=!1});function m(p){if(p*=.001,b&&w==!1?(T=p-Z,ne()):w==!1&&(Z=p),w==!1&&le(t,i,l,d,T),document.getElementById("timeValue").innerHTML=T.toFixed(4),B==!0){if(Q()=="gif")B=!1,le(t,i,l,d,T),q.length<S&&(e.toBlob(h=>{q.push(h),T=I()*(q.length/S);const g=new Image;g.src=URL.createObjectURL(h),g.onload=()=>{let x=I()*1e3/S;C.addFrame(g,{delay:Math.round(x)}),B=!0}}),D("CAPTURING FRAMES",`${q.length} / ${S} stored...`));else if(Q()=="video"){B=!1,console.warn("recording!!!"),D("Rendering video...",`rendering ${I()}s long video (${O}) @ ${P} fps`);let h=We(e,I()*1e3,P,O);T=0,b=!0;var u=document.createElement("video");h.then(g=>{u.setAttribute("src",g),D("Success!!","Video successfully rendered. Download should begin automatically..."),setTimeout(()=>{c.innerHTML="",c.style.display="none",document.getElementById("viewport").style.background=""},5e3),b=!1,T=0,document.getElementById("sequencerStartStop").disabled=!1,document.getElementById("sequencerRestart").disabled=!1});var f=document.createElement("a");f.setAttribute("download",`jakehsequencer${new Date(Date.now()).toISOString().replace(":","")}.${O}`),h.then(g=>{f.setAttribute("href",g),f.click()})}}else C.frames.length>=S&&j==!1&&w==!0&&(j=!0,console.warn("GIFF"),C.render());requestAnimationFrame(m)}requestAnimationFrame(m)}Ne();function D(e,t){errorPopup.style.display="block",errorPopup.innerHTML="";let n=document.createElement("p"),i=document.createElement("div"),l=document.createElement("h1");i.className="popupHeader",l.innerHTML=e,n.innerHTML=t,i.appendChild(l),errorPopup.appendChild(i),errorPopup.appendChild(n),errorPopup.style.left=`calc(50% - ${errorPopup.offsetWidth/2}px)`}function We(e,t,n,i){var l=[];return new Promise(function(a,o){let s=e.captureStream(n),c="video/webm; codecs=vp9";i=="mp4"&&(c="video/mp4");let m=new MediaRecorder(s,{mimeType:c});m.start(t||4e3),m.ondataavailable=function(p){l.push(p.data),m.state==="recording"&&m.stop()},m.onstop=function(p){var u=new Blob(l,{type:c.split(";")[0]}),f=URL.createObjectURL(u);a(f)}})}function I(){let e=0;for(let t=0;t<pe;t++){let n=0;if(d[t].length>0){for(let i=0;i<d[t].length;i++)n+=d[t][i].length;n>e&&(e=n)}}return e}function me(e){let t=0;for(let n=0;n<d[e].length;n++)t+=d[e][n].length;return t}function Ge(){return document.getElementById("sequencerTimeline").offsetLeft}let ze=4,fe=1,r;function ge(e,t,n,i,l=ze,a=fe,o=0,s=1,c=0,m=0){let p={name:e.name,texture:t,imgData:n,startTime:me(i),length:l,id:`${i}-${d[i].length.valueOf()}`,transitionType:o,transitionTime:a,transitionFadeType:!1,fractalInitialZoom:.0125,fractalX:-.95,fractalY:-.25,invertFractal:!1,clipEffectControlAlpha:!1,clipLayer:i+1,clipEffect:m,clipEffectIntensity:1,fadeInTransitionType:c,fadeInTransitionTime:s,clipType:"image",pageCurlDir:45,pageCurlRadius:.1};d[i].push(p),console.warn(p),ye(p),console.warn(d),document.getElementById("sequenceLengthValue").innerHTML=I().toFixed(4),S=P*I();let u=document.getElementById(`clipLayer${p.clipLayer}`),f=u.style.gridTemplateColumns.split(" ");f.push(`${p.length*y}px`),u.style.gridTemplateColumns=f.join(" ")}function F(e){V(e+1);let t=document.getElementById(`clipLayer${e+1}`),n=d[e];for(let l=0;l<n.length;l++){let a=d[e][l],o=d[e][l-1];if(o&&o.clipType!="gap"&&o.startTime+o.length<a.startTime){let s=a.startTime-(o.startTime+o.length);J(e,l,s)}else o&&o.clipType=="gap"&&o.startTime+o.length>a.startTime?o.length=a.startTime-o.startTime:!o&&a.startTime>0&&J(e,l,a.startTime)}for(let l=0;l<n.length;l++){let a=d[e][l];ye(a)}n=d[e];let i=n.map(l=>l.length*y);console.warn(i),t.style.gridTemplateColumns=i.join("px ")+"px",document.getElementById("sequenceLengthValue").innerHTML=I().toFixed(4)}function H(){console.warn("sequence update"),console.warn(d),he();for(let e=0;e<pe;e++)d[e].length>0&&F(e)}function he(){let e=document.getElementById("timelineRuler");e.innerHTML="";let t=e.offsetWidth,n=t/y;console.warn(`${t} / ${y}`),console.warn(n);for(let i=0;i<n;i++){let l=document.createElement("div");if(l.className="sequenceTimelineRulerTick",l.style.left=10+i*y+e.offsetLeft,i%5==0){let a=document.createElement("p");a.innerHTML=i.toString(),l.appendChild(a)}e.appendChild(l),console.warn("tick added")}}function ye(e,t=!1){let n=document.createElement("div"),i=document.getElementById(`clipLayer${e.clipLayer}`);if(e.clipType=="image"){let l=document.createElement("div"),a=document.createElement("img"),o=document.createElement("p");n.className="sequenceItemPlaceholder",n.style.background=`linear-gradient(to right, rgb(0, 255, 13) ${(e.length-e.transitionTime)/e.length*100}%, rgb(41, 0, 79))`,o.innerHTML=e.name,o.className="sequenceItemName",a.className="sequenceThumbnail",a.src=e.imgData,n.id=e.id,l.className="clipNameThumbContainer",l.appendChild(o),l.appendChild(a),n.appendChild(l);let s=document.createElement("div");document.createElement("div"),s.className="lengthController",s.id=`${n.id}-lengthController`,s.addEventListener("touchstart",m=>m.preventDefault()),s.addEventListener("pointerdown",Xe),l.addEventListener("pointerdown",Ve),l.addEventListener("touchstart",m=>m.preventDefault());let c=+e.id.split("-")[1];n.style.gridColumn=c+1,n.appendChild(s),i.appendChild(n),n.addEventListener("click",Je)}else{n.className="gapPlaceholder",n.id=e.id;let l=+e.id.split("-")[1];n.style.gridColumn=l+1,i.appendChild(n)}}let ee=!1,W=!1,G=!1,R=!1,A=!1,te=-1,ve=0,Te=0,v=0,K=0,z=0,Ee=0,L,E;function Xe(e){for(console.warn("STARTING RESIZE"),ee=!0,ve=e.clientX,L=e.target;L.className.includes("sequenceItemPlaceholder")==!1;)L=L.parentElement;let n=L.id.split("-"),i=n[0],l=n[1],a=d[i][l];xe(`${i}-${l}`),document.getElementById(`${i}-${l}`),document.getElementById(`clipLayer#${+i+1}`),Ee=a.length*y}function Ve(e){for(console.warn("STARTING MOVE"),W=!0,Te=e.clientX,E=e.target;E.id.includes("-")==!1;)E=E.parentElement;let t=+E.id.split("-")[1],n=+E.id.split("-")[0];xe(`${n}-${t}`);let i=d[n][t],l=d[n][t-1];l&&l.clipType=="gap"&&(K=+document.getElementById(`clipLayer${n+1}`).style.gridTemplateColumns.split(" ")[t-1].replace("px",""),te=l.length+l.startTime),z=i.startTime,console.warn(`initial clip start: ${z}`),console.warn(`initial gap width: ${K}`)}function J(e,t,n=.01){let i=d[e][t],l={name:"gap",startTime:n!=.01?i.startTime-n:i.startTime,length:n,id:`${e}-${t}`,transitionType:0,transitionTime:fe,clipLayer:e+1,clipEffect:0,clipEffectIntensity:1,fadeInTransitionType:0,fadeInTransitionTime:0,clipType:"gap"};d[e].splice(t,0,l);for(let a=t+1;a<d[e].length;a++)a!=t+1&&(d[e][a].startTime+=n),d[e][a].id=`${e}-${a}`;n==.01&&F(e)}document.addEventListener("pointermove",function(e){let t=e.clientX;if(ee==!0&&L&&e.target.id.includes("-")&&e.target.id.split("-").length==3){let n=L.id.split("-");console.warn(n);let i=+n[0],l=+n[1];d[i][l];let o=(t-ve+Ee)/y;Me(o),we(o),F(i)}else if(W&&E){let n=+E.id.split("-")[1],i=+E.id.split("-")[0];A==!0&&(n+=1);let l=d[i][n];v=(t-Te)/y;let a=d[i][n-1];console.warn(v),d[i].length>=1&&v>0&&v+z>te&&(console.warn(v),a&&a.clipType=="gap"&&(R=!0),R==!0&&a?(l.startTime=v+.01+z,A==!0?a.length=v:a.length=v+K/y,console.warn("updating layer"),F(i)):R==!1&&(console.warn("inserting gap"),J(i,n),A=!0,R=!0,l.startTime=v+.01)),Pe(l.startTime)}else if(G){let n=document.getElementById("timelineRuler");T=(e.clientX-n.offsetLeft)/y,ne()}});document.addEventListener("pointerup",function(e){if(L&&(console.warn("completing resize"),ee=!1,L=void 0,r=void 0),E&&W==!0){W=!1,R=!1,A=!1;let t=r.id.split("-");Fe(r.clipLayer-1,t[1],v),E=void 0,v=0,te=-1,console.warn("MOVE COMPLETE")}G&&(G=!1)});function Ye(e){let t=e.target.value;console.warn(e.target.value),r.transitionType=+e.target.value,Ie(t)}function Ie(e){let t=document.getElementById("transitionStyleInputSection");if(Ke(),e==4){t.style.flexDirection="row";let n=document.createElement("p");n.id="colorThresholdInputLabel",n.innerHTML="threshold color";let i=document.createElement("input");i.type="color",i.id="colorThresholdPicker",i.addEventListener("change",function(l){console.warn(l.target.value);let a=l.target.value,o=Le(a);r.colorThreshold=o,console.warn(r.colorThreshold)}),t.appendChild(n),t.appendChild(i)}else if(e==6){t.style.flexDirection="column";let n=document.createElement("p");n.id="fractalFadeTypeInputLabel",n.innerHTML="Fade to black?";let i=document.createElement("input");i.type="checkbox",i.style.width="30px",i.style.height="30px",i.id="fadeTypeInput",i.value=r.transitionFadeType;let l=document.createElement("div");l.style.display="flex",l.style.alignItems="center";let a=document.createElement("div");a.style.display="flex",a.style.alignItems="center";let o=document.createElement("div");o.style.display="flex",o.style.alignItems="center";let s=document.createElement("p");s.innerHTML="Fractal Coords";let c=document.createElement("input");c.type="number",c.id="fractalXInput",c.value=r.fractalX,c.step="any";let m=document.createElement("input");m.type="number",m.id="fractalYInput",m.value=r.fractalY,m.step="any",l.appendChild(s),l.appendChild(c),l.appendChild(m);let p=document.createElement("p");p.innerHTML="InitialZoom";let u=document.createElement("input");u.type="number",u.id="fractalZoomInput",u.value=r.fractalInitialZoom,u.step="any",t.appendChild(l),a.appendChild(p),a.appendChild(u),t.appendChild(a),i.addEventListener("change",function(f){r.transitionFadeType=f.target.checked}),c.addEventListener("change",function(f){r.fractalX=f.target.value}),m.addEventListener("change",function(f){r.fractalY=f.target.value}),u.addEventListener("change",function(f){r.fractalInitialZoom=f.target.value}),o.appendChild(n),o.appendChild(i),t.appendChild(o)}else if(e==7){let n=document.createElement("div"),i=document.createElement("div"),l=document.createElement("p"),a=document.createElement("p");l.innerHTML="Curl radius",a.innerHTML="Curl direction";let o=document.createElement("input"),s=document.createElement("input");o.type="number",s.type="number",o.addEventListener("change",function(c){r.pageCurlRadius=+c.target.value}),s.addEventListener("change",function(c){r.pageCurlDir=+c.target.value*(Math.PI/180)}),n.appendChild(l),n.appendChild(o),i.appendChild(a),i.appendChild(s),n.style.display="flex",i.style.display="flex",t.appendChild(n),t.appendChild(i),t.style.display="flex",t.style.flexDirection="column",t.style.marginLeft="5px",s.value=r.pageCurlDir,o.value=r.pageCurlRadius}}function Ce(){let e=document.getElementById("fadeInStyleSection"),t=document.createElement("p");t.id="fadeInColorThresholdInputLabel",t.innerHTML="threshold color";let n=document.createElement("input");n.type="color",n.id="fadeInColorThresholdPicker",n.addEventListener("change",function(i){console.warn(i.target.value);let l=i.target.value,a=Le(l);r.fadeInColorThresholdolorThreshold=a,console.warn(r.colorThreshold)}),e.appendChild(t),e.appendChild(n)}function je(){let e=document.getElementById("fadeInStyleSection");e.innerHTML=""}function Ze(e){let t=document.getElementById("outputTypeOptions");if(t.innerHTML="",e=="gif"){document.createElement("div");let n=document.createElement("input");n.type="number"}else if(e=="video"){let n=document.createElement("div");n.className="renderSettingsItem";let i=document.createElement("select"),l=document.createElement("option");l.value="mp4",l.innerHTML="MP4";let a=document.createElement("option");a.value="webm",a.innerHTML="WEBM",i.appendChild(l),i.appendChild(a);let o=document.createElement("p");o.innerHTML="Video Type",n.appendChild(o),n.appendChild(i),t.appendChild(n),i.addEventListener("change",function(s){O=s.target.value})}}function Le(e){let t=e.replace("#",""),n=parseInt(t.substring(0,2),16),i=parseInt(t.substring(2,4),16),l=parseInt(t.substring(4,6),16);return[n/255,i/255,l/255]}function Se(e,t,n){return"#"+(1<<24|e<<16|t<<8|n).toString(16).slice(1)}function Ke(){let e=document.getElementById("transitionStyleInputSection");e.innerHTML=""}function Je(e){r&&document.getElementById(`${r.id}`).classList.remove("selected"),be();let t=e.target.id,n=e.target;for(;!t||t&&t.includes("-")==!1;)t=n.parentElement.id,n=n.parentElement,console.warn(t);let i=0,l=0;if(t.includes("-")==!0&&t.split("-").length==2){let a=t.split("-");i=+a[0],l=+a[1],r=d[i][l],document.getElementById(`${t}`).classList.add("selected"),Be(r)}}function xe(e){be();let t=e,n=0,i=0;if(t.includes("-")==!0&&t.split("-").length==2){let l=t.split("-");n=+l[0],i=+l[1],r=d[n][i],document.getElementById(`${t}`).classList.add("selected"),Be(r)}}function be(){r&&document.getElementById(`${r.id}`).classList.remove("selected"),r=void 0;for(let e=0;e<5;e++){let t=document.getElementById(`clipLayer${e+1}`);for(const n of t.children)n.classList.remove("selected")}}function Be(e){var t,n;(t=document.getElementById("colorThresholdInputLabel"))==null||t.remove(),(n=document.getElementById("colorThresholdPicker"))==null||n.remove(),Qe(e.name),we(e.length),et(e.transitionType),Ie(e.transitionType),tt(e.transitionTime),Pe(e.startTime),nt(e.clipLayer),lt(e.fadeInTransitionType),at(e.clipEffect),it(e.fadeInTransitionTime),e.colorThreshold&&rt(e.colorThreshold),e.fadeInTransitionType==4&&e.fadeInColorThreshold&&ct(e.colorThreshold)}function Qe(e){document.getElementById("clipNameLabel").innerHTML=e}function we(e){document.getElementById("clipLengthInput").value=+e}function et(e){document.getElementById("transitionSelectionInput").value=e}function tt(e){document.getElementById("transitionLengthInput").value=e}function Pe(e){document.getElementById("clipStartTimeInput").value=e}function nt(e){document.getElementById("clipLayerSelection").value=e}function Me(e){let t=e-r.length;r.length=e;let n=+r.id.split("-")[1];Fe(r.clipLayer-1,n,t)}function it(e){document.getElementById("fadeInLengthInput").value=e}function lt(e){document.getElementById("fadeInSelectionInput").value=e}function at(e){document.getElementById("clipEffectInput").value=e,e>0?Re():De()}function De(){let e=document.getElementById("clipEffectParameterSection");e.innerHTML=""}function Re(){let e=document.getElementById("clipEffectParameterSection");if(e.style.display="flex",e.style.flexDirection="column",e.innerHTML)return;let t=document.createElement("p"),n=document.createElement("p");t.innerHTML="Effect Intensity",n.innerHTML="Control Alpha?";let i=document.createElement("div");i.style.display="flex";let l=document.createElement("div");l.style.display="flex";let a=document.createElement("input"),o=document.createElement("input");o.type="checkbox",a.id="clipEffectIntensitySlider",a.type="range",a.value=r.clipEffectIntensity,a.step=.25,a.max=10,a.min=-10,a.addEventListener("input",function(c){let m=document.getElementById("clipEffectIntensityInput");m.value=+c.target.value,ot(+c.target.value)}),o.addEventListener("change",function(c){console.warn(c.target.checked),r.clipEffectControlAlpha=c.target.checked});let s=document.createElement("input");s.id="clipEffectIntensityInput",s.type="number",s.value=r.clipEffectIntensity,o.checked=r.clipEffectControlAlpha,i.appendChild(t),i.appendChild(a),i.appendChild(s),l.appendChild(n),l.appendChild(o),e.appendChild(i),e.appendChild(l)}function ot(e){r.clipEffectIntensity=e}function rt(e){console.warn(e);let t=Se(Math.round(e[0]*255),Math.round(e[1]*255),Math.round(e[2]*255));console.warn(t),document.getElementById("colorThresholdPicker").value=t}function ct(e){document.getElementById("fadeInStyleSection").innerHTML||Ce(),console.warn(e);let n=Se(Math.round(e[0]*255),Math.round(e[1]*255),Math.round(e[2]*255));console.warn(n),document.getElementById("fadeInColorThresholdPicker").value=n}function Fe(e,t,n){console.warn(`updating start times on ${e}`);let i=d[e];if(i.length>0)for(let l=0;l<i.length;l++)l>t&&(i[l].startTime+=n);console.warn("start times fixed"),console.warn(i)}function st(e,t){let n=d[e][t-1],i=d[e][t+1],l=d[e].length,a=d[e].splice(t,1);if(i&&i.clipType=="gap"&&n&&n.clipType=="gap"){let o=+i.id.split("-")[1],s=+n.id.split("-")[1];o>=l-1?d[e].splice(s,2):(d[e].splice(o-1,2),n.length+=i.length)}for(let o=t;o<d[e].length;o++)d[e][o].startTime-=a[0].length,d[e][o].id=`${e}-${o}`;return a[0]}function dt(e,t){let n=d[e];t.id=`${e}-${n.length}`,t.startTime=me(e),n.push(t)}function ne(){document.getElementById("sequenceMarker").style.left=10+T*y+Ge()}function V(e){document.getElementById(`clipLayer${e}`).innerHTML=""}function ut(){T=0,ne(),b=!1,Q()=="gif"&&(w=!0),document.querySelector("#gl-canvas"),I(),B=!0,document.getElementById("sequencerStartStop").disabled=!0,document.getElementById("sequencerRestart").disabled=!0}document.getElementById("sequenceItemInput").addEventListener("change",function(e){let t=e.target.files[0];var n=new FileReader;n.addEventListener("load",function(i){const l=N(X,i.target.result);ge(t,l,i.target.result,0)}),t&&n.readAsDataURL(t)});document.getElementById("imageSequenceInput").addEventListener("change",function(e){let t=e.target.files,n=[],i=pt(t.length);function l(a){return new Promise(function(o,s){let c=new FileReader;c.addEventListener("load",function(m){o(m.target.result)}),c.readAsDataURL(a)})}i.then(a=>{if(t&&t.length>0)for(let o=0;o<t.length;o++)n.push(l(t[o]));Promise.all(n).then(o=>{for(let s=0;s<o.length;s++){const c=N(X,o[s]);ge(t[s],c,o[s],a.clipLayer-1,a.clipLength,a.fadeOutTransitionTime,a.fadeOutTransitionType,a.fadeInTransitionTime,a.fadeInTransitionType,a.clipEffect)}})}).catch(()=>{document.getElementById("imageSequenceConfirmationContainer").remove(),e.target.value=void 0})});function pt(e){let t=document.createElement("div");t.id="imageSequenceConfirmationContainer",t.className="smallMessage",t.style.display="block",t.innerHTML="";let n=document.createElement("p"),i=document.createElement("div"),l=document.createElement("h1");i.className="popupHeader",l.innerHTML="Image Sequence Settings",n.innerHTML=`You are about to add ${e} images.`,i.appendChild(l),t.appendChild(i),t.appendChild(n),setTimeout(()=>{t.style.left=`calc(50% - ${t.offsetWidth/2}px)`},200);let a=document.createElement("div");a.style.display="flex",a.className="sequenceInfoItem";let o=document.createElement("p");o.innerHTML="Clip Length";let s=document.createElement("input");s.value=4,s.type="number",a.appendChild(o),a.appendChild(s),t.appendChild(a);let c=document.createElement("div");c.style.display="flex",c.className="sequenceInfoItem";let m=document.createElement("p");m.innerHTML="Clip Effect";let p=document.getElementById("clipEffectInput").cloneNode(!0);p.id="clipEffectInput2",c.appendChild(m),c.appendChild(p),t.appendChild(c);let u=document.createElement("div");u.style.display="flex",u.className="sequenceInfoItem";let f=document.createElement("p");f.innerHTML="Transition Length";let h=document.createElement("input");h.value=1,h.type="number",u.appendChild(f),u.appendChild(h),t.appendChild(u);let g=document.createElement("div");g.style.display="flex",g.className="sequenceInfoItem";let x=document.createElement("p");x.innerHTML="Transition Type";let Y=document.getElementById("transitionSelectionInput").cloneNode(!0);Y.id="transitionTypeInput2",g.appendChild(x),g.appendChild(Y),t.appendChild(g);let M=document.createElement("div");M.style.display="flex",M.className="sequenceInfoItem";let ie=document.createElement("p");ie.innerHTML="Clip Layer";let k=document.createElement("input");k.value=1,k.type="number",M.appendChild(ie),M.appendChild(k),t.appendChild(M);let U=document.createElement("div");U.style.display="flex";let _=document.createElement("button");_.innerHTML="add images",_.className="controlbutton2";let $=document.createElement("button");return $.innerHTML="cancel",$.className="controlButton",U.appendChild($),U.appendChild(_),t.appendChild(U),document.body.appendChild(t),new Promise(function(ke,Ue){_.addEventListener("click",function(){ke({clipLength:+s.value,fadeInTransitionType:0,fadeInTransitionTime:0,clipEffect:+p.value,clipEffectIntensity:0,fadeOutTransitionType:+Y.value,fadeOutTransitionTime:+h.value,clipLayer:+k.value}),t.remove()}),$.addEventListener("click",function(It){Ue()})})}document.getElementById("sequencerStartStop").addEventListener("click",function(e){b=!b,b?e.target.innerHTML="stop":e.target.innerHTML="play"});document.getElementById("sequencerRestart").addEventListener("click",function(e){Z=T.valueOf()});document.getElementById("transitionSelectionInput").addEventListener("change",Ye);document.getElementById("clipLengthInput").addEventListener("change",function(e){console.warn("updating length"),Me(+e.target.value),r&&F(r.clipLayer-1)});document.getElementById("exportButton").addEventListener("click",function(e){ut()});document.getElementById("timelineHorizontalScale").addEventListener("input",function(e){console.warn(e.target.value),y=+e.target.value,V(1),H()});document.getElementById("removeClipButton").addEventListener("click",function(e){d[r.clipLayer-1].splice(+r.id.split("-")[1],1),r=void 0,V(1),H(),S=P*I()});document.getElementById("frameRateInput").addEventListener("change",function(e){P=+e.target.value,S=P*I()});document.getElementById("outputWidthInput").addEventListener("change",function(e){C.setOption("width",+event.target.value),C.setOption("height",+event.target.value),document.getElementById("gl-canvas").style.width=`${e.target.value}px`,X.viewport(0,0,document.getElementById("gl-canvas").clientWidth,document.getElementById("gl-canvas").clientHeight)});document.getElementById("viewportScale").addEventListener("input",function(e){document.getElementById("gl-canvas").style.width=`${+e.target.value*256}px`});document.getElementById("clipLayerSelection").addEventListener("change",function(e){if(r){let t=r.id.split("-"),n=+t[0],i=+t[1];console.warn(e),console.warn(e.target.value),r.clipLayer=+e.target.value,He();let l=st(n,i);dt(+e.target.value-1,l),H()}});document.getElementById("clipStartTimeInput").addEventListener("change",function(e){r&&(r.startTime=+e.target.value,He(),H())});document.getElementById("transitionLengthInput").addEventListener("change",function(e){r&&(r.transitionTime=+e.target.value)});document.getElementById("fadeInSelectionInput").addEventListener("change",function(e){r&&(r.fadeInTransitionType=+e.target.value,r.fadeInTransitionType==4?Ce():je())});document.getElementById("clipEffectInput").addEventListener("change",function(e){r&&(r.clipEffect=+e.target.value,r.clipEffect>0?Re():De())});document.getElementById("fadeInLengthInput").addEventListener("change",function(e){r&&(r.fadeInTransitionTime=+e.target.value)});document.getElementById("timelineHelpButton").addEventListener("click",function(e){mt()});var ce;(ce=document.getElementById("closePopup1Button"))==null||ce.addEventListener("click",function(e){ft()});document.getElementById("addImageHelpButton").addEventListener("click",function(e){gt()});var se;(se=document.getElementById("closePopup2Button"))==null||se.addEventListener("click",function(e){ht()});document.getElementById("clipSettingsHelpButton").addEventListener("click",function(e){yt()});var de;(de=document.getElementById("closePopup3Button"))==null||de.addEventListener("click",function(e){vt()});document.getElementById("renderSettingsHelpButton").addEventListener("click",function(e){Tt()});var ue;(ue=document.getElementById("closePopup4Button"))==null||ue.addEventListener("click",function(e){Et()});document.getElementById("sequencerTimeline").addEventListener("scroll",function(e){document.getElementById("timelineRuler").style.top=`${window.visualViewport.offsetTop}px`});document.getElementById("timelineRuler").addEventListener("pointerdown",function(e){G=!0});document.getElementById("outputTypeInput").addEventListener("change",function(e){Ze(e.target.value)});window.addEventListener("resize",()=>{he()});function mt(){document.getElementById("helpPopup1").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup1").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function ft(){document.getElementById("helpPopup1").style.display="none",document.getElementById("popupGlass").style.display="none"}function gt(){document.getElementById("helpPopup2").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup2").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function ht(){document.getElementById("helpPopup2").style.display="none",document.getElementById("popupGlass").style.display="none"}function yt(){document.getElementById("helpPopup3").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup3").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function vt(){document.getElementById("helpPopup3").style.display="none",document.getElementById("popupGlass").style.display="none"}function Tt(){document.getElementById("helpPopup4").style.display="block",document.getElementById("popupGlass").style.display="block",console.warn(window.scrollTop),document.getElementById("helpPopup4").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function Et(){document.getElementById("helpPopup4").style.display="none",document.getElementById("popupGlass").style.display="none"}function He(){for(let e=1;e<5;e++)V(e)}function Q(){return document.getElementById("outputTypeInput").value}var re=document.getElementById("sequencerTimeline");re.scrollTop=re.scrollHeight;
