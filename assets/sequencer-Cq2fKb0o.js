import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{G as pt,i as mt,d as De}from"./gif-DsIElLlq.js";const qe=4,ft=`
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
`,gt=`
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
            if(i > 125) break;
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
            } else if(clipEffect == 9) {
                vec2 newUv = uv * vec2(time + 1.0, time + 1.0) * clipEffectIntensity * .25;
                gl_FragColor = texture2D(uSampler,newUv);
            } else if(clipEffect == 10) {
                vec2 newUv = uv + vec2((time * clipEffectIntensity * .75) - 1.0, 1.0);
                gl_FragColor = texture2D(uSampler,newUv);
            } else if(clipEffect == 12) { // ripple 2
                vec2 cPos = -1.0 + 2.0 * uv;
                // distance of current pixel from center
                float cLength = length(cPos);
                vec2 newUv = uv+(cPos/cLength)*cos(cLength*(clipEffectIntensity * .05)-time*4.0) * 0.03;
                gl_FragColor = texture2D(uSampler,newUv);
                for(int i = 0; i < 100; i++) {
                    if(i > int(5)) {
                        break;
                    }
                    vec2 newUv2 = uv+(cPos/cLength)*cos(cLength*(clipEffectIntensity * float(i + 1))-time*float(i)) * 0.03;
                    gl_FragColor += texture2D(uSampler,newUv2);
                    if(clipEffectControlAlpha > 0) {
                        gl_FragColor.a = 1.0 - cos(cLength*12.0-time*4.0) * 0.25 * clipEffectIntensity;
                    }
                }
            } else if(clipEffect == 13) {
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
                vec2 origin = vec2(0.0);
                float curlDist = length(vec2(mod(time * -3.0, 1.0)) - origin);
                
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
            } else if(clipEffect == 14) {
                float t = (.25 * cos(time * 2.0)) + .25;
                float zoom = .0125;
                vec4 mandelBrotColor = mandelbrot(rotateUv(uv, time * .5, vec2(.5)), zoom * t, vec2(fractalX, fractalY), t);
                vec4 diffuse = texture2D(uSampler, rotateUv(uv, time * .5, vec2(.5)));
                gl_FragColor = (mandelBrotColor + vec4(.1)) * diffuse;
            }
        }
    }
`;function vt(e,t,n){const i=Re(e,e.VERTEX_SHADER,t),l=Re(e,e.FRAGMENT_SHADER,n),a=e.createProgram();return e.attachShader(a,i),e.attachShader(a,l),e.linkProgram(a),e.getProgramParameter(a,e.LINK_STATUS)?a:(console.error(`Unable to initialize the shader program: ${e.getProgramInfoLog(a)}`),null)}function Re(e,t,n){const i=e.createShader(t);return e.shaderSource(i,n),e.compileShader(i),e.getShaderParameter(i,e.COMPILE_STATUS)?i:(console.error(`An error occured compiling shader:
${e.getShaderInfoLog(i)}`),e.deleteShader(i),null)}function Me(e){return(e&e-1)===0}function ce(e,t){const n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n);const i=0,l=e.RGBA,a=1,o=1,d=0,c=e.RGBA,m=e.UNSIGNED_BYTE,p=new Uint8Array([0,0,255,255]);e.texImage2D(e.TEXTURE_2D,i,l,a,o,d,c,m,p);const u=new Image;return u.crossOrigin="anonymous",u.src=t,u.onload=()=>{e.bindTexture(e.TEXTURE_2D,n),e.texImage2D(e.TEXTURE_2D,i,l,c,m,u),Me(u.width)&&Me(u.height)?(e.generateMipmap(e.TEXTURE_2D),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.MIRRORED_REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.MIRRORED_REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST)):(e.generateMipmap(e.TEXTURE_2D),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST)),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0)},n}let s=[[],[],[],[]],v,x=0,he=0,q=!1,C=25,X=!1,D=100,ae=[],z=!1,ve=!1,B=new pt({workers:1,quality:10,width:256,height:256,workerScript:"/my-graphics-demos/gif/gif.worker.js"}),$=15,oe="mp4";async function ht(){const e=document.querySelector("#gl-canvas"),t=e.getContext("webgl");if(v=t,t===null){alert("Unable to initialize WebGL. Your browser or machine may not support it.");return}t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT);const n=vt(t,ft,gt),i={program:n,attribLocations:{vertexPosition:t.getAttribLocation(n,"aVertexPosition"),textureCoord:t.getAttribLocation(n,"aTextureCoord")},uniformLocations:{projectionMatrix:t.getUniformLocation(n,"uProjectionMatrix"),modelViewMatrix:t.getUniformLocation(n,"uModelViewMatrix"),uSampler:t.getUniformLocation(n,"uSampler"),time:t.getUniformLocation(n,"time"),transitionTime:t.getUniformLocation(n,"transitionTime"),sequenceItemLength:t.getUniformLocation(n,"sequenceItemLength"),transitionType:t.getUniformLocation(n,"transitionType"),transitionFadeType:t.getUniformLocation(n,"transitionFadeType"),sequenceIndex:t.getUniformLocation(n,"sequenceIndex"),sequenceItemStartTime:t.getUniformLocation(n,"sequenceItemStartTime"),colorThreshold:t.getUniformLocation(n,"colorThreshold"),fadeInColorThreshold:t.getUniformLocation(n,"fadeInColorThreshold"),fadeInTransitionTime:t.getUniformLocation(n,"fadeInTransitionTime"),fadeInTransitionType:t.getUniformLocation(n,"fadeInTransitionType"),clipEffect:t.getUniformLocation(n,"clipEffect"),clipEffectIntensity:t.getUniformLocation(n,"clipEffectIntensity"),fractalX:t.getUniformLocation(n,"fractalX"),fractalY:t.getUniformLocation(n,"fractalY"),fractalInitialZoom:t.getUniformLocation(n,"fractalInitialZoom"),invertFractal:t.getUniformLocation(n,"invertFractal"),clipEffectControlAlpha:t.getUniformLocation(n,"clipEffectControlAlpha"),pageCurlRadius:t.getUniformLocation(n,"pageCurlRadius"),pageCurlDir:t.getUniformLocation(n,"pageCurlDir")}},l=mt(t);ce(t,"/my-graphics-demos/ceiling1.png");const a=ce(t,"/my-graphics-demos/sky.png");var o=new FileReader,d=await fetch("sky.png");o.readAsDataURL(await d.blob()),o.addEventListener("load",p=>{s[0].push({name:"sky",imgData:p.target.result,texture:a,startTime:0,length:4,id:"0-0",transitionType:1,transitionTime:1,clipLayer:1,fadeInTransitionType:0,fadeInTransitionTime:1,transitionFadeType:!1,fractalInitialZoom:.0125,fractalX:-.95,fractalY:-.25,invertFractal:!1,pageCurlDir:45,pageCurlRadius:.1,clipType:"image"}),N()}),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!0),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0);let c=document.getElementById("errorPopup");B.on("progress",function(p){console.warn("progress"),console.warn(p);let u=document.getElementById("viewport");c.style.display="block",c.innerHTML="";let f=document.createElement("p"),E=document.createElement("div"),h=document.createElement("h1");if(E.className="popupHeader",h.innerHTML="RENDERING",f.innerHTML=`${(p*100).toFixed(4)}`,E.appendChild(h),c.appendChild(E),c.appendChild(f),c.style.left=`calc(50% - ${c.offsetWidth/2}px)`,u)u.style.background=`radial-gradient(circle at center, rgb(25, 255, 0) ${p*100}%, transparent ${100-p*100}%), url('/my-graphics-demos/uipamnel1.png') 100% center / cover`;else{let I=document.createElement("div");I.id="exportProgressBar",document.getElementById("viewport").appendChild(I)}}),B.on("error",function(p){let u=document.getElementById("errorPopup");u&&(V(SUCCESS,`An error has occured during export ${p.toString()}`),setTimeout(()=>{u.innerHTML="",u.style.display="none"},5e3))}),B.on("finished",function(p){let u=URL.createObjectURL(p),f=document.getElementById("downloadButton");f.href=u,f.download=`jakehsequencer${new Date(Date.now()).toISOString().replace(":","")}.gif`,f.click(),f.classList.remove("disabled"),ve=!1,X=!1,z=!1,document.getElementById("sequencerStartStop").disabled=!1,document.getElementById("sequencerRestart").disabled=!1,c&&(V(SUCCESS,"Your gif is ready!!! It should have started downloading. If not, click the download button."),setTimeout(()=>{c.innerHTML="",c.style.display="none",document.getElementById("viewport").style.background=""},5e3)),B.running=!1});function m(p){if(p*=.001,q&&z==!1?(x=p-he,xe()):z==!1&&(he=p),z==!1&&De(t,i,l,s,x),document.getElementById("timeValue").innerHTML=x.toFixed(4),X==!0){if(Te()=="gif")X=!1,De(t,i,l,s,x),ae.length<D&&(e.toBlob(E=>{ae.push(E),x=b()*(ae.length/D);const h=new Image;h.src=URL.createObjectURL(E),h.onload=()=>{let I=b()*1e3/D;B.addFrame(h,{delay:Math.round(I)}),X=!0}}),V("CAPTURING FRAMES",`${ae.length} / ${D} stored...`));else if(Te()=="video"){X=!1,console.warn("recording!!!"),V("Rendering video...",`rendering ${b()}s long video (${oe}) @ ${$} fps`);let E=Et(e,b()*1e3,$,oe);x=0,q=!0;var u=document.createElement("video");E.then(h=>{u.setAttribute("src",h),V("Success!!","Video successfully rendered. Download should begin automatically..."),setTimeout(()=>{c.innerHTML="",c.style.display="none",document.getElementById("viewport").style.background=""},5e3),q=!1,x=0,document.getElementById("sequencerStartStop").disabled=!1,document.getElementById("sequencerRestart").disabled=!1});var f=document.createElement("a");f.setAttribute("download",`jakehsequencer${new Date(Date.now()).toISOString().replace(":","")}.${oe}`),E.then(h=>{f.setAttribute("href",h),f.click()})}}else B.frames.length>=D&&ve==!1&&z==!0&&(ve=!0,console.warn("GIFF"),B.render());requestAnimationFrame(m)}requestAnimationFrame(m)}ht();Ze("gif");function V(e,t){errorPopup.style.display="block",errorPopup.innerHTML="";let n=document.createElement("p"),i=document.createElement("div"),l=document.createElement("h1");i.className="popupHeader",l.innerHTML=e,n.innerHTML=t,i.appendChild(l),errorPopup.appendChild(i),errorPopup.appendChild(n),errorPopup.style.left=`calc(50% - ${errorPopup.offsetWidth/2}px)`}function Et(e,t,n,i){var l=[];return new Promise(function(a,o){let d=e.captureStream(n),c="video/webm; codecs=vp9";i=="mp4"&&(c="video/mp4");let m=new MediaRecorder(d,{mimeType:c});m.start(t||4e3),m.ondataavailable=function(p){l.push(p.data),m.state==="recording"&&m.stop()},m.onstop=function(p){var u=new Blob(l,{type:c.split(";")[0]}),f=URL.createObjectURL(u);a(f)}})}function b(){let e=0;for(let t=0;t<qe;t++){let n=0;if(s[t].length>0){for(let i=0;i<s[t].length;i++)n+=s[t][i].length;n>e&&(e=n)}}return e}function $e(e){let t=0;for(let n=0;n<s[e].length;n++)t+=s[e][n].length;return t}function yt(){return document.getElementById("sequencerTimeline").offsetLeft}let Tt=4,Ne=1,r;function Ie(e,t,n,i,l=Tt,a=Ne,o=0,d=1,c=0,m=0){let p={name:e.name,texture:t,imgData:n,startTime:$e(i),length:l,id:`${i}-${s[i].length.valueOf()}`,transitionType:o,transitionTime:a,transitionFadeType:!1,fractalInitialZoom:.0125,fractalX:-.95,fractalY:-.25,invertFractal:!1,clipEffectControlAlpha:!1,clipLayer:i+1,clipEffect:m,clipEffectIntensity:1,fadeInTransitionType:c,fadeInTransitionTime:d,clipType:"image",pageCurlDir:45,pageCurlRadius:.1};s[i].push(p),console.warn(p),ze(p),console.warn(s),document.getElementById("sequenceLengthValue").innerHTML=b().toFixed(4),D=$*b();let u=document.getElementById(`clipLayer${p.clipLayer}`),f=u.style.gridTemplateColumns.split(" ");f.push(`${p.length*C}px`),u.style.gridTemplateColumns=f.join(" ")}function j(e){Z(e+1);let t=document.getElementById(`clipLayer${e+1}`),n=s[e];for(let l=0;l<n.length;l++){let a=s[e][l],o=s[e][l-1];if(o&&o.clipType!="gap"&&o.startTime+o.length<a.startTime){let d=a.startTime-(o.startTime+o.length);ye(e,l,d)}else o&&o.clipType=="gap"&&o.startTime+o.length>a.startTime?o.length=a.startTime-o.startTime:!o&&a.startTime>0&&ye(e,l,a.startTime)}for(let l=0;l<n.length;l++){let a=s[e][l];ze(a)}n=s[e];let i=n.map(l=>l.length*C);console.warn(i),t.style.gridTemplateColumns=i.join("px ")+"px",document.getElementById("sequenceLengthValue").innerHTML=b().toFixed(4)}function N(){console.warn("sequence update"),console.warn(s),Xe();for(let e=0;e<qe;e++)s[e].length>0&&j(e)}function Xe(){let e=document.getElementById("timelineRuler");e.innerHTML="";let t=e.offsetWidth,n=t/C;console.warn(`${t} / ${C}`),console.warn(n);for(let i=0;i<n;i++){let l=document.createElement("div");if(l.className="sequenceTimelineRulerTick",l.style.left=10+i*C+e.offsetLeft,i%5==0){let a=document.createElement("p");a.innerHTML=i.toString(),l.appendChild(a)}e.appendChild(l),console.warn("tick added")}}function ze(e,t=!1){let n=document.createElement("div"),i=document.getElementById(`clipLayer${e.clipLayer}`);if(e.clipType=="image"){let l=document.createElement("div"),a=document.createElement("img"),o=document.createElement("p");n.className="sequenceItemPlaceholder",n.style.background=`linear-gradient(to right, rgb(0, 255, 13) ${(e.length-e.transitionTime)/e.length*100}%, rgb(41, 0, 79))`,o.innerHTML=e.name,o.className="sequenceItemName",a.className="sequenceThumbnail",a.src=e.imgData,n.id=e.id,l.className="clipNameThumbContainer",l.appendChild(o),l.appendChild(a),n.appendChild(l);let d=document.createElement("div");document.createElement("div"),d.className="lengthController",d.id=`${n.id}-lengthController`,d.addEventListener("touchstart",m=>m.preventDefault()),d.addEventListener("pointerdown",It),l.addEventListener("pointerdown",Ct),l.addEventListener("touchstart",m=>m.preventDefault());let c=+e.id.split("-")[1];n.style.gridColumn=c+1,n.appendChild(d),i.appendChild(n),n.addEventListener("click",St)}else{n.className="gapPlaceholder",n.id=e.id;let l=+e.id.split("-")[1];n.style.gridColumn=l+1,i.appendChild(n)}}let Ce=!1,de=!1,se=!1,Y=!1,re=!1,Le=-1,We=0,Ge=0,L=0,Ee=0,ue=0,Ve=0,R,S;function It(e){for(console.warn("STARTING RESIZE"),Ce=!0,We=e.clientX,R=e.target;R.className.includes("sequenceItemPlaceholder")==!1;)R=R.parentElement;let n=R.id.split("-"),i=n[0],l=n[1],a=s[i][l];Qe(`${i}-${l}`),document.getElementById(`${i}-${l}`),document.getElementById(`clipLayer#${+i+1}`),Ve=a.length*C}function Ct(e){for(console.warn("STARTING MOVE"),de=!0,Ge=e.clientX,S=e.target;S.id.includes("-")==!1;)S=S.parentElement;let t=+S.id.split("-")[1],n=+S.id.split("-")[0];Qe(`${n}-${t}`);let i=s[n][t],l=s[n][t-1];l&&l.clipType=="gap"&&(Ee=+document.getElementById(`clipLayer${n+1}`).style.gridTemplateColumns.split(" ")[t-1].replace("px",""),Le=l.length+l.startTime),ue=i.startTime,console.warn(`initial clip start: ${ue}`),console.warn(`initial gap width: ${Ee}`)}function ye(e,t,n=.01){let i=s[e][t],l={name:"gap",startTime:n!=.01?i.startTime-n:i.startTime,length:n,id:`${e}-${t}`,transitionType:0,transitionTime:Ne,clipLayer:e+1,clipEffect:0,clipEffectIntensity:1,fadeInTransitionType:0,fadeInTransitionTime:0,clipType:"gap"};s[e].splice(t,0,l);for(let a=t+1;a<s[e].length;a++)a!=t+1&&(s[e][a].startTime+=n),s[e][a].id=`${e}-${a}`;n==.01&&j(e)}document.addEventListener("pointermove",function(e){let t=e.clientX;if(Ce==!0&&R&&e.target.id.includes("-")&&e.target.id.split("-").length==3){let n=R.id.split("-");console.warn(n);let i=+n[0],l=+n[1];s[i][l];let o=(t-We+Ve)/C;it(o),tt(o),j(i)}else if(de&&S){let n=+S.id.split("-")[1],i=+S.id.split("-")[0];re==!0&&(n+=1);let l=s[i][n];L=(t-Ge)/C;let a=s[i][n-1];console.warn(L),s[i].length>=1&&L>0&&L+ue>Le&&(console.warn(L),a&&a.clipType=="gap"&&(Y=!0),Y==!0&&a?(l.startTime=L+.01+ue,re==!0?a.length=L:a.length=L+Ee/C,console.warn("updating layer"),j(i)):Y==!1&&(console.warn("inserting gap"),ye(i,n),re=!0,Y=!0,l.startTime=L+.01)),nt(l.startTime)}else if(se){let n=document.getElementById("timelineRuler");x=(e.clientX-n.offsetLeft)/C,xe()}});document.addEventListener("pointerup",function(e){if(R&&(console.warn("completing resize"),Ce=!1,R=void 0,r=void 0),S&&de==!0){de=!1,Y=!1,re=!1;let t=r.id.split("-");ot(r.clipLayer-1,t[1],L),S=void 0,L=0,Le=-1,console.warn("MOVE COMPLETE")}se&&(se=!1)});function Lt(e){let t=e.target.value;console.warn(e.target.value),r.transitionType=+e.target.value,Ye(t)}function Ye(e){let t=document.getElementById("transitionStyleInputSection");if(Bt(),e==4){t.style.flexDirection="row";let n=document.createElement("p");n.id="colorThresholdInputLabel",n.innerHTML="threshold color";let i=document.createElement("input");i.type="color",i.id="colorThresholdPicker",i.addEventListener("change",function(l){console.warn(l.target.value);let a=l.target.value,o=pe(a);r.colorThreshold=o,console.warn(r.colorThreshold)}),t.appendChild(n),t.appendChild(i)}else if(e==6){t.style.flexDirection="column";let n=document.createElement("p");n.id="fractalFadeTypeInputLabel",n.innerHTML="Fade to black?";let i=document.createElement("input");i.type="checkbox",i.style.width="30px",i.style.height="30px",i.id="fadeTypeInput",i.value=r.transitionFadeType;let l=document.createElement("div");l.style.display="flex",l.style.alignItems="center";let a=document.createElement("div");a.style.display="flex",a.style.alignItems="center";let o=document.createElement("div");o.style.display="flex",o.style.alignItems="center";let d=document.createElement("p");d.innerHTML="Fractal Coords";let c=document.createElement("input");c.type="number",c.id="fractalXInput",c.value=r.fractalX,c.step="any";let m=document.createElement("input");m.type="number",m.id="fractalYInput",m.value=r.fractalY,m.step="any",l.appendChild(d),l.appendChild(c),l.appendChild(m);let p=document.createElement("p");p.innerHTML="InitialZoom";let u=document.createElement("input");u.type="number",u.id="fractalZoomInput",u.value=r.fractalInitialZoom,u.step="any",t.appendChild(l),a.appendChild(p),a.appendChild(u),t.appendChild(a),i.addEventListener("change",function(f){r.transitionFadeType=f.target.checked}),c.addEventListener("change",function(f){r.fractalX=f.target.value}),m.addEventListener("change",function(f){r.fractalY=f.target.value}),u.addEventListener("change",function(f){r.fractalInitialZoom=f.target.value}),o.appendChild(n),o.appendChild(i),t.appendChild(o)}else if(e==7){let n=document.createElement("div"),i=document.createElement("div"),l=document.createElement("p"),a=document.createElement("p");l.innerHTML="Curl radius",a.innerHTML="Curl direction";let o=document.createElement("input"),d=document.createElement("input");o.type="number",d.type="number",o.addEventListener("change",function(c){r.pageCurlRadius=+c.target.value}),d.addEventListener("change",function(c){r.pageCurlDir=+c.target.value*(Math.PI/180)}),n.appendChild(l),n.appendChild(o),i.appendChild(a),i.appendChild(d),n.style.display="flex",i.style.display="flex",t.appendChild(n),t.appendChild(i),t.style.display="flex",t.style.flexDirection="column",t.style.marginLeft="5px",d.value=r.pageCurlDir,o.value=r.pageCurlRadius}}function je(){let e=document.getElementById("fadeInStyleSection"),t=document.createElement("p");t.id="fadeInColorThresholdInputLabel",t.innerHTML="threshold color";let n=document.createElement("input");n.type="color",n.id="fadeInColorThresholdPicker",n.addEventListener("change",function(i){console.warn(i.target.value);let l=i.target.value,a=pe(l);r.fadeInColorThresholdolorThreshold=a,console.warn(r.colorThreshold)}),e.appendChild(t),e.appendChild(n)}function xt(){let e=document.getElementById("fadeInStyleSection");e.innerHTML=""}function Ze(e){let t=document.getElementById("outputTypeOptions");if(t.innerHTML="",e=="gif"){let n=document.createElement("div"),i=document.createElement("p");i.innerHTML="Quality *higher is worse*",n.className="renderSettingsItem";let l=document.createElement("input");l.type="number";let a=document.createElement("input");a.type="range",a.min=1,a.max=1e4,a.step=1,a.value=10,l.value=10,n.appendChild(i),n.appendChild(a),n.appendChild(l),a.addEventListener("input",function(o){B.setOption("quality",+o.target.value),l.value=+o.target.value}),l.addEventListener("input",function(o){B.setOption("quality",+o.target.value),a.value=+o.target.value})}else if(e=="video"){let n=document.createElement("div");n.className="renderSettingsItem";let i=document.createElement("select"),l=document.createElement("option");l.value="mp4",l.innerHTML="MP4";let a=document.createElement("option");a.value="webm",a.innerHTML="WEBM",i.appendChild(l),i.appendChild(a);let o=document.createElement("p");o.innerHTML="Video Type",n.appendChild(o),n.appendChild(i),t.appendChild(n),i.addEventListener("change",function(d){oe=d.target.value})}}function pe(e){let t=e.replace("#",""),n=parseInt(t.substring(0,2),16),i=parseInt(t.substring(2,4),16),l=parseInt(t.substring(4,6),16);return[n/255,i/255,l/255]}function Ke(e,t,n){return"#"+(1<<24|e<<16|t<<8|n).toString(16).slice(1)}function Bt(){let e=document.getElementById("transitionStyleInputSection");e.innerHTML=""}function St(e){r?(_e(),document.getElementById(`${r.id}`).classList.remove("selected")):Ue(),Je();let t=e.target.id,n=e.target;for(;!t||t&&t.includes("-")==!1;)t=n.parentElement.id,n=n.parentElement,console.warn(t);let i=0,l=0;if(t.includes("-")==!0&&t.split("-").length==2){let a=t.split("-");i=+a[0],l=+a[1],r=s[i][l],document.getElementById(`${t}`).classList.add("selected"),et(r)}r?_e():Ue()}function _e(){document.getElementById("selectAllClipsButton").disabled=!1,document.getElementById("duplicateClipButton").disabled=!1,document.getElementById("removeClipToolButton").disabled=!1,document.getElementById("moveClipUpButton").disabled=!1,document.getElementById("moveClipDownButton").disabled=!1,document.getElementById("selectAllClipsButton").classList.remove("disabled"),document.getElementById("duplicateClipButton").classList.remove("disabled"),document.getElementById("removeClipToolButton").classList.remove("disabled"),document.getElementById("moveClipUpButton").classList.remove("disabled"),document.getElementById("moveClipDownButton").classList.remove("disabled")}function Ue(){document.getElementById("selectAllClipsButton").disabled=!0,document.getElementById("duplicateClipButton").disabled=!0,document.getElementById("removeClipToolButton").disabled=!0,document.getElementById("moveClipUpButton").disabled=!0,document.getElementById("moveClipDownButton").disabled=!0,document.getElementById("selectAllClipsButton").classList.add("disabled"),document.getElementById("duplicateClipButton").classList.add("disabled"),document.getElementById("removeClipToolButton").classList.add("disabled"),document.getElementById("moveClipUpButton").classList.add("disabled"),document.getElementById("moveClipDownButton").classList.add("disabled")}function Qe(e){Je();let t=e,n=0,i=0;if(t.includes("-")==!0&&t.split("-").length==2){let l=t.split("-");n=+l[0],i=+l[1],r=s[n][i],document.getElementById(`${t}`).classList.add("selected"),et(r)}}function Je(){r&&document.getElementById(`${r.id}`).classList.remove("selected"),r=void 0;for(let e=0;e<5;e++){let t=document.getElementById(`clipLayer${e+1}`);for(const n of t.children)n.classList.remove("selected")}}function et(e){var t,n;(t=document.getElementById("colorThresholdInputLabel"))==null||t.remove(),(n=document.getElementById("colorThresholdPicker"))==null||n.remove(),bt(e.name),tt(e.length),wt(e.transitionType),Ye(e.transitionType),Pt(e.transitionTime),nt(e.startTime),Dt(e.clipLayer),Mt(e.fadeInTransitionType),_t(e.clipEffect),Rt(e.fadeInTransitionTime),e.colorThreshold&&Ft(e.colorThreshold),e.fadeInTransitionType==4&&e.fadeInColorThreshold&&Ht(e.colorThreshold)}function bt(e){document.getElementById("clipNameLabel").innerHTML=e}function tt(e){document.getElementById("clipLengthInput").value=+e}function wt(e){document.getElementById("transitionSelectionInput").value=e}function Pt(e){document.getElementById("transitionLengthInput").value=e}function nt(e){document.getElementById("clipStartTimeInput").value=e}function Dt(e){document.getElementById("clipLayerSelection").value=e}function it(e){let t=e-r.length;r.length=e;let n=+r.id.split("-")[1];ot(r.clipLayer-1,n,t)}function Rt(e){document.getElementById("fadeInLengthInput").value=e}function Mt(e){document.getElementById("fadeInSelectionInput").value=e}function _t(e){document.getElementById("clipEffectInput").value=e,e>0?at():lt()}function lt(){let e=document.getElementById("clipEffectParameterSection");e.innerHTML=""}function at(){let e=document.getElementById("clipEffectParameterSection");if(e.style.display="flex",e.style.flexDirection="column",e.innerHTML)return;let t=document.createElement("p"),n=document.createElement("p");t.innerHTML="Effect Intensity",n.innerHTML="Control Alpha?";let i=document.createElement("div");i.style.display="flex";let l=document.createElement("div");l.style.display="flex";let a=document.createElement("input"),o=document.createElement("input");o.type="checkbox",a.id="clipEffectIntensitySlider",a.type="range",a.value=r.clipEffectIntensity,a.step=.25,a.max=10,a.min=-10,a.addEventListener("input",function(c){let m=document.getElementById("clipEffectIntensityInput");m.value=+c.target.value,Ut(+c.target.value)}),o.addEventListener("change",function(c){console.warn(c.target.checked),r.clipEffectControlAlpha=c.target.checked});let d=document.createElement("input");d.id="clipEffectIntensityInput",d.type="number",d.value=r.clipEffectIntensity,o.checked=r.clipEffectControlAlpha,i.appendChild(t),i.appendChild(a),i.appendChild(d),l.appendChild(n),l.appendChild(o),e.appendChild(i),e.appendChild(l)}function Ut(e){r.clipEffectIntensity=e}function Ft(e){console.warn(e);let t=Ke(Math.round(e[0]*255),Math.round(e[1]*255),Math.round(e[2]*255));console.warn(t),document.getElementById("colorThresholdPicker").value=t}function Ht(e){document.getElementById("fadeInStyleSection").innerHTML||je(),console.warn(e);let n=Ke(Math.round(e[0]*255),Math.round(e[1]*255),Math.round(e[2]*255));console.warn(n),document.getElementById("fadeInColorThresholdPicker").value=n}function ot(e,t,n){console.warn(`updating start times on ${e}`);let i=s[e];if(i.length>0)for(let l=0;l<i.length;l++)l>t&&(i[l].startTime+=n);console.warn("start times fixed"),console.warn(i)}function rt(e,t){let n=s[e][t-1],i=s[e][t+1],l=s[e].length,a=s[e].splice(t,1);if(i&&i.clipType=="gap"&&n&&n.clipType=="gap"){let o=+i.id.split("-")[1],d=+n.id.split("-")[1];o>=l-1?s[e].splice(d,2):(s[e].splice(o-1,2),n.length+=i.length)}for(let o=t;o<s[e].length;o++)s[e][o].startTime-=a[0].length,s[e][o].id=`${e}-${o}`;return a[0]}function ct(e,t){let n=s[e];t.id=`${e}-${n.length}`,t.startTime=$e(e),n.push(t)}function xe(){document.getElementById("sequenceMarker").style.left=10+x*C+yt()}function Z(e){document.getElementById(`clipLayer${e}`).innerHTML=""}function kt(){x=0,xe(),q=!1,Te()=="gif"&&(z=!0),document.querySelector("#gl-canvas"),b(),X=!0,document.getElementById("sequencerStartStop").disabled=!0,document.getElementById("sequencerRestart").disabled=!0}document.getElementById("sequenceItemInput").addEventListener("change",function(e){let t=e.target.files[0];var n=new FileReader;n.addEventListener("load",function(i){const l=ce(v,i.target.result);Ie(t,l,i.target.result,0)}),t&&n.readAsDataURL(t)});document.getElementById("imageSequenceInput").addEventListener("change",function(e){let t=e.target.files,n=[],i=At(t.length);function l(a){return new Promise(function(o,d){let c=new FileReader;c.addEventListener("load",function(m){o(m.target.result)}),c.readAsDataURL(a)})}i.then(a=>{if(t&&t.length>0)for(let o=0;o<t.length;o++)n.push(l(t[o]));Promise.all(n).then(o=>{for(let d=0;d<o.length;d++){const c=ce(v,o[d]);Ie(t[d],c,o[d],a.clipLayer-1,a.clipLength,a.fadeOutTransitionTime,a.fadeOutTransitionType,a.fadeInTransitionTime,a.fadeInTransitionType,a.clipEffect)}})}).catch(()=>{document.getElementById("imageSequenceConfirmationContainer").remove(),e.target.value=void 0})});function At(e){let t=document.createElement("div");t.id="imageSequenceConfirmationContainer",t.className="smallMessage",t.style.display="block",t.innerHTML="";let n=document.createElement("p"),i=document.createElement("div"),l=document.createElement("h1");i.className="popupHeader",l.innerHTML="Image Sequence Settings",n.innerHTML=`You are about to add ${e} images.`,i.appendChild(l),t.appendChild(i),t.appendChild(n),setTimeout(()=>{t.style.left=`calc(50% - ${t.offsetWidth/2}px)`},200);let a=document.createElement("div");a.style.display="flex",a.className="sequenceInfoItem";let o=document.createElement("p");o.innerHTML="Clip Length";let d=document.createElement("input");d.value=4,d.type="number",a.appendChild(o),a.appendChild(d),t.appendChild(a);let c=document.createElement("div");c.style.display="flex",c.className="sequenceInfoItem";let m=document.createElement("p");m.innerHTML="Clip Effect";let p=document.getElementById("clipEffectInput").cloneNode(!0);p.id="clipEffectInput2",c.appendChild(m),c.appendChild(p),t.appendChild(c);let u=document.createElement("div");u.style.display="flex",u.className="sequenceInfoItem";let f=document.createElement("p");f.innerHTML="Transition Length";let E=document.createElement("input");E.value=1,E.type="number",u.appendChild(f),u.appendChild(E),t.appendChild(u);let h=document.createElement("div");h.style.display="flex",h.className="sequenceInfoItem";let I=document.createElement("p");I.innerHTML="Transition Type";let M=document.getElementById("transitionSelectionInput").cloneNode(!0);M.id="transitionTypeInput2",h.appendChild(I),h.appendChild(M),t.appendChild(h);let _=document.createElement("div");_.style.display="flex",_.className="sequenceInfoItem";let U=document.createElement("p");U.innerHTML="Clip Layer";let F=document.createElement("input");F.value=1,F.type="number",_.appendChild(U),_.appendChild(F),t.appendChild(_);let H=document.createElement("div");H.style.display="flex";let k=document.createElement("button");k.innerHTML="add images",k.className="controlbutton2";let w=document.createElement("button");return w.innerHTML="cancel",w.className="controlButton",H.appendChild(w),H.appendChild(k),t.appendChild(H),document.body.appendChild(t),new Promise(function(K,A){k.addEventListener("click",function(){K({clipLength:+d.value,fadeInTransitionType:0,fadeInTransitionTime:0,clipEffect:+p.value,clipEffectIntensity:0,fadeOutTransitionType:+M.value,fadeOutTransitionTime:+E.value,clipLayer:+F.value}),t.remove()}),w.addEventListener("click",function(Q){A()})})}document.getElementById("sequencerStartStop").addEventListener("click",function(e){q=!q,q?e.target.innerHTML="stop":e.target.innerHTML="play"});document.getElementById("sequencerRestart").addEventListener("click",function(e){he=x.valueOf()});document.getElementById("transitionSelectionInput").addEventListener("change",Lt);document.getElementById("clipLengthInput").addEventListener("change",function(e){console.warn("updating length"),it(+e.target.value),r&&j(r.clipLayer-1)});document.getElementById("exportButton").addEventListener("click",function(e){kt()});document.getElementById("timelineHorizontalScale").addEventListener("input",function(e){console.warn(e.target.value),C=+e.target.value,Z(1),N()});document.getElementById("removeClipButton").addEventListener("click",function(e){s[r.clipLayer-1].splice(+r.id.split("-")[1],1),r=void 0,Z(1),N(),D=$*b()});document.getElementById("frameRateInput").addEventListener("change",function(e){$=+e.target.value,D=$*b()});document.getElementById("outputWidthInput").addEventListener("change",function(e){B.setOption("width",+event.target.value),B.setOption("height",+event.target.value),document.getElementById("gl-canvas").style.width=`${e.target.value}px`,v.viewport(0,0,document.getElementById("gl-canvas").clientWidth,document.getElementById("gl-canvas").clientHeight)});document.getElementById("viewportScale").addEventListener("input",function(e){document.getElementById("gl-canvas").style.width=`${+e.target.value*256}px`});document.getElementById("clipLayerSelection").addEventListener("change",function(e){if(r){let t=r.id.split("-"),n=+t[0],i=+t[1];console.warn(e),console.warn(e.target.value),r.clipLayer=+e.target.value,Be();let l=rt(n,i);ct(+e.target.value-1,l),N()}});document.getElementById("clipStartTimeInput").addEventListener("change",function(e){r&&(r.startTime=+e.target.value,Be(),N())});document.getElementById("transitionLengthInput").addEventListener("change",function(e){r&&(r.transitionTime=+e.target.value)});document.getElementById("fadeInSelectionInput").addEventListener("change",function(e){r&&(r.fadeInTransitionType=+e.target.value,r.fadeInTransitionType==4?je():xt())});document.getElementById("clipEffectInput").addEventListener("change",function(e){r&&(r.clipEffect=+e.target.value,r.clipEffect>0?at():lt())});document.getElementById("fadeInLengthInput").addEventListener("change",function(e){r&&(r.fadeInTransitionTime=+e.target.value)});document.getElementById("timelineHelpButton").addEventListener("click",function(e){qt()});var He;(He=document.getElementById("closePopup1Button"))==null||He.addEventListener("click",function(e){$t()});document.getElementById("addImageHelpButton").addEventListener("click",function(e){Nt()});var ke;(ke=document.getElementById("closePopup2Button"))==null||ke.addEventListener("click",function(e){Xt()});document.getElementById("clipSettingsHelpButton").addEventListener("click",function(e){zt()});var Ae;(Ae=document.getElementById("closePopup3Button"))==null||Ae.addEventListener("click",function(e){Wt()});document.getElementById("renderSettingsHelpButton").addEventListener("click",function(e){Gt()});var Oe;(Oe=document.getElementById("closePopup4Button"))==null||Oe.addEventListener("click",function(e){Vt()});document.getElementById("sequencerTimeline").addEventListener("scroll",function(e){document.getElementById("timelineRuler").style.top=`${window.visualViewport.offsetTop}px`});document.getElementById("timelineRuler").addEventListener("pointerdown",function(e){se=!0});document.getElementById("outputTypeInput").addEventListener("change",function(e){Ze(e.target.value)});document.getElementById("removeClipToolButton").addEventListener("click",function(e){s[r.clipLayer-1].splice(+r.id.split("-")[1],1),r=void 0,Z(1),N(),D=$*b()});document.getElementById("moveClipUpButton").addEventListener("click",function(e){r.clipLayer<4&&dt(r.clipLayer,r.clipLayer+1)});document.getElementById("moveClipDownButton").addEventListener("click",function(e){r.clipLayer>1&&dt(r.clipLayer,r.clipLayer-1)});document.getElementById("addTitleButton").addEventListener("click",function(e){Ot().then(n=>{Ie({name:"title"},n.texture,n.texture,1)}).catch(()=>{document.getElementById("titleCardConfigurationPopup").remove()})});function Ot(){let e=document.createElement("div");e.id="titleCardConfigurationPopup",e.className="smallMessage",e.style.display="block";let t=document.createElement("canvas");t.style.border="1px solid yellow";let n=document.createElement("div");n.className="sequenceInfoItem";let i=document.createElement("p");i.innerHTML="Title";let l=document.createElement("textarea");n.appendChild(i),n.appendChild(l),e.appendChild(t);let a=document.createElement("div");a.className="sequenceInfoItem";let o=document.createElement("p");o.innerHTML="Text Color";let d=document.createElement("input");d.type="color",a.appendChild(o),a.appendChild(d),e.appendChild(a);let c=document.createElement("div");c.className="sequenceInfoItem";let m=document.createElement("p");m.innerHTML="Background Color";let p=document.createElement("input");p.type="checkbox";let u=document.createElement("input");u.type="color",c.appendChild(m),c.appendChild(p),c.appendChild(u),e.appendChild(c);let f="#ffffff",E=document.createElement("div");E.className="sequenceInfoItem";let h=document.createElement("p");h.innerHTML="Font Size";let I=document.createElement("input");I.type="number",I.value=36,E.appendChild(h),E.appendChild(I),e.appendChild(E);let M=document.createElement("div");M.className="sequenceInfoItem";let _=document.createElement("p");_.innerHTML="Alignment";let U=document.createElement("select"),F=document.createElement("option");F.value="left",F.innerHTML="LEFT",U.appendChild(F);let H=document.createElement("option");H.value="center",H.innerHTML="CENTER",U.appendChild(H);let k=document.createElement("option");k.value="right",k.innerHTML="RIGHT",U.appendChild(k),M.appendChild(_),M.appendChild(U),e.appendChild(M);let w=document.createElement("div");w.className="sequenceInfoItem";let K=document.createElement("p");K.innerHTML="Baseline";let A=document.createElement("select"),Q=document.createElement("option");Q.value="top",Q.innerHTML="TOP",A.appendChild(Q);let me=document.createElement("option");me.value="center",me.innerHTML="CENTER",A.appendChild(me);let fe=document.createElement("option");fe.value="bottom",fe.innerHTML="BOTTOM",A.appendChild(fe),w.appendChild(K),w.appendChild(A),e.appendChild(w);let W=document.createElement("div");W.className="sequenceInfoItem";let st=document.createElement("p");h.innerHTML="Font Size";let J=document.createElement("input"),ee=document.createElement("input");J.type="number",J.value=256,ee.type="number",ee.value=256,W.appendChild(st),W.appendChild(J),W.appendChild(ee),e.appendChild(W);let O=36,G="",Se="center",be="middle",te=256,ne=256,we=!1,Pe="#ffffff",ut=new FontFace("angelicPeace","url('/my-graphics-demos/Angelic Peace.ttf')"),y=t.getContext("2d");function P(){y.canvas.height=256,y.canvas.width=256,y.font=`${O}px angelicPeace`,y.textAlign=Se,y.textBaseline=be,y.clearRect(0,0,y.canvas.width,y.canvas.height);let g=G.split(`
`);if(we==!0&&(y.fillStyle=Pe,y.fillRect(te/2-O*G.length/2,ne/2-O/2,G.length*O,O*g.length)),y.fillStyle=f,g&&g.length>0)for(let T=0;T<g.length;T++)y.fillText(g[T],te/2,ne/2+T*(O+2.5));else y.fillText(G,te/2,ne/2)}I.addEventListener("input",function(g){O=+g.target.value,P()}),J.addEventListener("input",function(g){te=+g.target.value,P()}),ee.addEventListener("input",function(g){ne=+g.target.value,P()}),ut.load().then(()=>{l.addEventListener("input",function(g){G=g.target.value,P()})}),U.addEventListener("change",function(g){Se=g.target.value,P()}),A.addEventListener("change",function(g){be=g.target.value,P()}),d.addEventListener("change",function(g){let T=g.target.value;pe(T),console.warn(T),f=T,P()}),u.addEventListener("change",function(g){let T=g.target.value;pe(T),console.warn(T),Pe=T,P()}),p.addEventListener("change",function(g){we=g.target.checked,P()}),e.appendChild(n);let ie=document.createElement("button");ie.innerHTML="cancel",ie.className="controlButton2";let le=document.createElement("button");return le.innerHTML="add title",le.className="controlButton2",e.appendChild(ie),e.appendChild(le),setTimeout(()=>{e.style.left=`calc(50% - ${e.offsetWidth/2}px)`},200),document.body.appendChild(e),new Promise(function(g,T){le.addEventListener("click",function(){var ge=v.createTexture();v.bindTexture(v.TEXTURE_2D,ge),v.texImage2D(v.TEXTURE_2D,0,v.RGBA,v.RGBA,v.UNSIGNED_BYTE,y.canvas),v.texParameteri(v.TEXTURE_2D,v.TEXTURE_MIN_FILTER,v.LINEAR),v.texParameteri(v.TEXTURE_2D,v.TEXTURE_WRAP_S,v.MIRRORED_REPEAT),v.texParameteri(v.TEXTURE_2D,v.TEXTURE_WRAP_T,v.MIRRORED_REPEAT),g({texture:ge}),e.remove()}),ie.addEventListener("click",function(ge){T()})})}function dt(e,t){let n=r.id.split("-");+n[0];let i=+n[1];r.clipLayer=+t,Be();let l=rt(e-1,i);ct(t-1,l),N()}window.addEventListener("resize",()=>{Xe()});function qt(){document.getElementById("helpPopup1").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup1").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function $t(){document.getElementById("helpPopup1").style.display="none",document.getElementById("popupGlass").style.display="none"}function Nt(){document.getElementById("helpPopup2").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup2").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function Xt(){document.getElementById("helpPopup2").style.display="none",document.getElementById("popupGlass").style.display="none"}function zt(){document.getElementById("helpPopup3").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup3").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function Wt(){document.getElementById("helpPopup3").style.display="none",document.getElementById("popupGlass").style.display="none"}function Gt(){document.getElementById("helpPopup4").style.display="block",document.getElementById("popupGlass").style.display="block",console.warn(window.scrollTop),document.getElementById("helpPopup4").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function Vt(){document.getElementById("helpPopup4").style.display="none",document.getElementById("popupGlass").style.display="none"}function Be(){for(let e=1;e<5;e++)Z(e)}function Te(){return document.getElementById("outputTypeInput").value}var Fe=document.getElementById("sequencerTimeline");Fe.scrollTop=Fe.scrollHeight;
