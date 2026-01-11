import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */function Ne(e){const n=ze(e),t=Xe(e);return{position:n,textureCoord:t}}function ze(e){const n=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,n);const t=[-1,1,1,1,-1,-1,-1,-1,1,1,1,-1];return e.bufferData(e.ARRAY_BUFFER,new Float32Array(t),e.STATIC_DRAW),n}function Xe(e){const n=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,n);const t=[0,0,1,0,0,1,0,1,1,0,1,1];return e.bufferData(e.ARRAY_BUFFER,new Float32Array(t),e.STATIC_DRAW),n}function de(e,n,t,o,i,r){e.clearColor(0,0,0,1),e.clearDepth(1),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.canvas.clientWidth/e.canvas.clientHeight;const c=mat4.create();mat4.ortho(c,-1,1,-1,1,.1,100);for(let m=0;m<o.length;m++){let g=o[m];if(g.length>0)for(let l=0;l<g.length;l++){let u=g[l];i>=u.startTime&&i<=u.startTime+u.length&&u.clipType=="image"&&(e.depthMask(!1),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),Ye(e,c,n,t,{x:0,y:0},u,i,m+1),e.depthMask(!0))}}}function Ye(e,n,t,o,i,r,c,m){const g=mat4.create();mat4.translate(g,g,[i.x,i.y,-.1*m]),qe(e,o,t),Ve(e,o,t),e.useProgram(t.program),e.uniformMatrix4fv(t.uniformLocations.projectionMatrix,!1,n),e.uniformMatrix4fv(t.uniformLocations.modelViewMatrix,!1,g),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,r.texture),e.uniform1i(t.uniformLocations.uSampler,0),e.uniform1i(t.uniformLocations.transitionType,r.transitionType),e.uniform1i(t.uniformLocations.fadeInTransitionType,r.fadeInTransitionType),e.uniform1i(t.uniformLocations.sequenceIndex,r.id+1),e.uniform1i(t.uniformLocations.clipEffect,r.clipEffect),e.uniform1f(t.uniformLocations.clipEffectIntensity,r.clipEffectIntensity),e.uniform1f(t.uniformLocations.time,c),e.uniform1f(t.uniformLocations.transitionTime,r.transitionTime),e.uniform1i(t.uniformLocations.transitionFadeType,r.transitionFadeType==!0?1:0),e.uniform1f(t.uniformLocations.fadeInTransitionTime,r.fadeInTransitionTime),e.uniform1f(t.uniformLocations.fractalX,r.fractalX),e.uniform1f(t.uniformLocations.fractalY,r.fractalY),e.uniform1f(t.uniformLocations.fractalInitialZoom,r.fractalInitialZoom),e.uniform1f(t.uniformLocations.sequenceItemLength,r.length),e.uniform1f(t.uniformLocations.sequenceItemStartTime,r.startTime),r.colorThreshold&&r.colorThreshold.length==3&&e.uniform3f(t.uniformLocations.colorThreshold,r.colorThreshold[0],r.colorThreshold[1],r.colorThreshold[2]),r.fadeInColorThreshold&&r.fadeInColorThreshold.length==3&&e.uniform3f(t.uniformLocations.fadeInColorThreshold,r.fadeInColorThreshold[0],r.fadeInColorThreshold[1],r.fadeInColorThreshold[2]),e.drawArrays(e.TRIANGLES,0,6)}function Ve(e,n,t){const i=e.FLOAT,r=!1,c=0,m=0;e.bindBuffer(e.ARRAY_BUFFER,n.textureCoord),e.vertexAttribPointer(t.attribLocations.textureCoord,2,i,r,c,m),e.enableVertexAttribArray(t.attribLocations.textureCoord)}function qe(e,n,t){const i=e.FLOAT,r=!1,c=0,m=0;e.bindBuffer(e.ARRAY_BUFFER,n.position),e.vertexAttribPointer(t.attribLocations.vertexPosition,2,i,r,c,m),e.enableVertexAttribArray(t.attribLocations.vertexPosition)}function je(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var $={exports:{}},Ze=$.exports,fe;function Ke(){return fe||(fe=1,(function(e,n){(function(t,o){e.exports=o()})(Ze,function(){return(function(t){function o(r){if(i[r])return i[r].exports;var c=i[r]={exports:{},id:r,loaded:!1};return t[r].call(c.exports,c,c.exports,o),c.loaded=!0,c.exports}var i={};return o.m=t,o.c=i,o.p="",o(0)})([function(t,o,i){var r,c,m=function(u,s){function E(){this.constructor=u}for(var I in s)g.call(s,I)&&(u[I]=s[I]);return E.prototype=s.prototype,u.prototype=new E,u.__super__=s.prototype,u},g={}.hasOwnProperty,l=[].indexOf||function(u){for(var s=0,E=this.length;s<E;s++)if(s in this&&this[s]===u)return s;return-1};r=i(1).EventEmitter,i(2),c=(function(u){function s(a){var d,f,y;this.running=!1,this.options={},this.frames=[],this.groups=new Map,this.freeWorkers=[],this.activeWorkers=[],this.setOptions(a);for(f in E)y=E[f],(d=this.options)[f]==null&&(d[f]=y)}var E,I;return m(s,u),E={workerScript:"gif.worker.js",workers:2,repeat:0,background:"#fff",quality:10,width:null,height:null,transparent:null,debug:!1},I={delay:500,copy:!1},s.prototype.setOption=function(a,d){if(this.options[a]=d,this._canvas!=null&&(a==="width"||a==="height"))return this._canvas[a]=d},s.prototype.setOptions=function(a){var d,f,y;f=[];for(d in a)g.call(a,d)&&(y=a[d],f.push(this.setOption(d,y)));return f},s.prototype.addFrame=function(a,d){var f,y,T;d==null&&(d={}),f={},f.transparent=this.options.transparent;for(T in I)f[T]=d[T]||I[T];if(this.options.width==null&&this.setOption("width",a.width),this.options.height==null&&this.setOption("height",a.height),typeof ImageData<"u"&&ImageData!==null&&a instanceof ImageData)f.data=a.data;else if(typeof CanvasRenderingContext2D<"u"&&CanvasRenderingContext2D!==null&&a instanceof CanvasRenderingContext2D||typeof WebGLRenderingContext<"u"&&WebGLRenderingContext!==null&&a instanceof WebGLRenderingContext)d.copy?f.data=this.getContextData(a):f.context=a;else{if(a.childNodes==null)throw new Error("Invalid image");d.copy?f.data=this.getImageData(a):f.image=a}return y=this.frames.length,y>0&&f.data&&(this.groups.has(f.data)?this.groups.get(f.data).push(y):this.groups.set(f.data,[y])),this.frames.push(f)},s.prototype.render=function(){var a,d,f;if(this.running)throw new Error("Already running");if(this.options.width==null||this.options.height==null)throw new Error("Width and height must be set prior to rendering");if(this.running=!0,this.nextFrame=0,this.finishedFrames=0,this.imageParts=(function(){var y,T,L;for(L=[],y=0,T=this.frames.length;0<=T?y<T:y>T;0<=T?++y:--y)L.push(null);return L}).call(this),d=this.spawnWorkers(),this.options.globalPalette===!0)this.renderNextFrame();else for(a=0,f=d;0<=f?a<f:a>f;0<=f?++a:--a)this.renderNextFrame();return this.emit("start"),this.emit("progress",0)},s.prototype.abort=function(){for(var a;a=this.activeWorkers.shift(),a!=null;)this.log("killing active worker"),a.terminate();return this.running=!1,this.emit("abort")},s.prototype.spawnWorkers=function(){var a,d,f;return a=Math.min(this.options.workers,this.frames.length),(function(){f=[];for(var y=d=this.freeWorkers.length;d<=a?y<a:y>a;d<=a?y++:y--)f.push(y);return f}).apply(this).forEach((function(y){return function(T){var L;return y.log("spawning worker "+T),L=new Worker(y.options.workerScript),L.onmessage=function(F){return y.activeWorkers.splice(y.activeWorkers.indexOf(L),1),y.freeWorkers.push(L),y.frameFinished(F.data,!1)},y.freeWorkers.push(L)}})(this)),a},s.prototype.frameFinished=function(a,d){var f,y,T,L;if(this.finishedFrames++,d?(f=this.frames.indexOf(a),y=this.groups.get(a.data)[0],this.log("frame "+(f+1)+" is duplicate of "+y+" - "+this.activeWorkers.length+" active"),this.imageParts[f]={indexOfFirstInGroup:y}):(this.log("frame "+(a.index+1)+" finished - "+this.activeWorkers.length+" active"),this.emit("progress",this.finishedFrames/this.frames.length),this.imageParts[a.index]=a),this.options.globalPalette===!0&&!d&&(this.options.globalPalette=a.globalPalette,this.log("global palette analyzed"),this.frames.length>2))for(T=1,L=this.freeWorkers.length;1<=L?T<L:T>L;1<=L?++T:--T)this.renderNextFrame();return l.call(this.imageParts,null)>=0?this.renderNextFrame():this.finishRendering()},s.prototype.finishRendering=function(){var a,d,f,y,T,L,F,W,R,ae,le,se,ce,Y,V,ue,q,j,Z,K;for(q=this.imageParts,T=L=0,ae=q.length;L<ae;T=++L)d=q[T],d.indexOfFirstInGroup&&(this.imageParts[T]=this.imageParts[d.indexOfFirstInGroup]);for(R=0,j=this.imageParts,F=0,le=j.length;F<le;F++)d=j[F],R+=(d.data.length-1)*d.pageSize+d.cursor;for(R+=d.pageSize-d.cursor,this.log("rendering finished - filesize "+Math.round(R/1e3)+"kb"),a=new Uint8Array(R),V=0,Z=this.imageParts,W=0,se=Z.length;W<se;W++)for(d=Z[W],K=d.data,f=Y=0,ce=K.length;Y<ce;f=++Y)ue=K[f],a.set(ue,V),V+=f===d.data.length-1?d.cursor:d.pageSize;return y=new Blob([a],{type:"image/gif"}),this.emit("finished",y,a)},s.prototype.renderNextFrame=function(){var a,d,f,y;if(this.freeWorkers.length===0)throw new Error("No free workers");if(!(this.nextFrame>=this.frames.length))return a=this.frames[this.nextFrame++],d=this.frames.indexOf(a),d>0&&this.groups.has(a.data)&&this.groups.get(a.data)[0]!==d?void setTimeout((function(T){return function(){return T.frameFinished(a,!0)}})(this),0):(y=this.freeWorkers.shift(),f=this.getTask(a),this.log("starting frame "+(f.index+1)+" of "+this.frames.length),this.activeWorkers.push(y),y.postMessage(f))},s.prototype.getContextData=function(a){return a.getImageData(0,0,this.options.width,this.options.height).data},s.prototype.getImageData=function(a){var d;return this._canvas==null&&(this._canvas=document.createElement("canvas"),this._canvas.width=this.options.width,this._canvas.height=this.options.height),d=this._canvas.getContext("2d"),d.setFill=this.options.background,d.fillRect(0,0,this.options.width,this.options.height),d.drawImage(a,0,0),this.getContextData(d)},s.prototype.getTask=function(a){var d,f;if(d=this.frames.indexOf(a),f={index:d,last:d===this.frames.length-1,delay:a.delay,transparent:a.transparent,width:this.options.width,height:this.options.height,quality:this.options.quality,dither:this.options.dither,globalPalette:this.options.globalPalette,repeat:this.options.repeat,canTransfer:!0},a.data!=null)f.data=a.data;else if(a.context!=null)f.data=this.getContextData(a.context);else{if(a.image==null)throw new Error("Invalid frame");f.data=this.getImageData(a.image)}return f},s.prototype.log=function(a){if(this.options.debug)return console.log(a)},s})(r),t.exports=c},function(t,o){function i(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function r(l){return typeof l=="function"}function c(l){return typeof l=="number"}function m(l){return typeof l=="object"&&l!==null}function g(l){return l===void 0}t.exports=i,i.EventEmitter=i,i.prototype._events=void 0,i.prototype._maxListeners=void 0,i.defaultMaxListeners=10,i.prototype.setMaxListeners=function(l){if(!c(l)||l<0||isNaN(l))throw TypeError("n must be a positive number");return this._maxListeners=l,this},i.prototype.emit=function(l){var u,s,E,I,a,d;if(this._events||(this._events={}),l==="error"&&(!this._events.error||m(this._events.error)&&!this._events.error.length)){if(u=arguments[1],u instanceof Error)throw u;var f=new Error('Uncaught, unspecified "error" event. ('+u+")");throw f.context=u,f}if(s=this._events[l],g(s))return!1;if(r(s))switch(arguments.length){case 1:s.call(this);break;case 2:s.call(this,arguments[1]);break;case 3:s.call(this,arguments[1],arguments[2]);break;default:I=Array.prototype.slice.call(arguments,1),s.apply(this,I)}else if(m(s))for(I=Array.prototype.slice.call(arguments,1),d=s.slice(),E=d.length,a=0;a<E;a++)d[a].apply(this,I);return!0},i.prototype.addListener=function(l,u){var s;if(!r(u))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",l,r(u.listener)?u.listener:u),this._events[l]?m(this._events[l])?this._events[l].push(u):this._events[l]=[this._events[l],u]:this._events[l]=u,m(this._events[l])&&!this._events[l].warned&&(s=g(this._maxListeners)?i.defaultMaxListeners:this._maxListeners,s&&s>0&&this._events[l].length>s&&(this._events[l].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[l].length),typeof console.trace=="function"&&console.trace())),this},i.prototype.on=i.prototype.addListener,i.prototype.once=function(l,u){function s(){this.removeListener(l,s),E||(E=!0,u.apply(this,arguments))}if(!r(u))throw TypeError("listener must be a function");var E=!1;return s.listener=u,this.on(l,s),this},i.prototype.removeListener=function(l,u){var s,E,I,a;if(!r(u))throw TypeError("listener must be a function");if(!this._events||!this._events[l])return this;if(s=this._events[l],I=s.length,E=-1,s===u||r(s.listener)&&s.listener===u)delete this._events[l],this._events.removeListener&&this.emit("removeListener",l,u);else if(m(s)){for(a=I;a-- >0;)if(s[a]===u||s[a].listener&&s[a].listener===u){E=a;break}if(E<0)return this;s.length===1?(s.length=0,delete this._events[l]):s.splice(E,1),this._events.removeListener&&this.emit("removeListener",l,u)}return this},i.prototype.removeAllListeners=function(l){var u,s;if(!this._events)return this;if(!this._events.removeListener)return arguments.length===0?this._events={}:this._events[l]&&delete this._events[l],this;if(arguments.length===0){for(u in this._events)u!=="removeListener"&&this.removeAllListeners(u);return this.removeAllListeners("removeListener"),this._events={},this}if(s=this._events[l],r(s))this.removeListener(l,s);else if(s)for(;s.length;)this.removeListener(l,s[s.length-1]);return delete this._events[l],this},i.prototype.listeners=function(l){return this._events&&this._events[l]?r(this._events[l])?[this._events[l]]:this._events[l].slice():[]},i.prototype.listenerCount=function(l){if(this._events){var u=this._events[l];if(r(u))return 1;if(u)return u.length}return 0},i.listenerCount=function(l,u){return l.listenerCount(u)}},function(t,o){var i,r,c,m,g;g=navigator.userAgent.toLowerCase(),m=navigator.platform.toLowerCase(),i=g.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/)||[null,"unknown",0],c=i[1]==="ie"&&document.documentMode,r={name:i[1]==="version"?i[3]:i[1],version:c||parseFloat(i[1]==="opera"&&i[4]?i[4]:i[2]),platform:{name:g.match(/ip(?:ad|od|hone)/)?"ios":(g.match(/(?:webos|android)/)||m.match(/mac|win|linux/)||["other"])[0]}},r[r.name]=!0,r[r.name+parseInt(r.version,10)]=!0,r.platform[r.platform.name]=!0,t.exports=r}])})})($)),$.exports}var Qe=Ke();const Je=je(Qe),Ee=4,et=`
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
`,tt=`
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
                    gl_FragColor = vec4(1.0 - diffuse.r, 1.0 - diffuse.g, 1.0 - diffuse.b, diffuse.a);
                }
            } else if(clipEffect == 2) { // ripple
                vec2 cPos = -1.0 + 2.0 * uv;
                // distance of current pixel from center
                float cLength = length(cPos);
                vec2 newUv = uv+(cPos/cLength)*cos(cLength*12.0-time*4.0) * 0.03 * clipEffectIntensity;
                gl_FragColor = texture2D(uSampler,newUv);
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
`;function nt(e,n,t){const o=pe(e,e.VERTEX_SHADER,n),i=pe(e,e.FRAGMENT_SHADER,t),r=e.createProgram();return e.attachShader(r,o),e.attachShader(r,i),e.linkProgram(r),e.getProgramParameter(r,e.LINK_STATUS)?r:(console.error(`Unable to initialize the shader program: ${e.getProgramInfoLog(r)}`),null)}function pe(e,n,t){const o=e.createShader(n);return e.shaderSource(o,t),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS)?o:(console.error(`An error occured compiling shader:
${e.getShaderInfoLog(o)}`),e.deleteShader(o),null)}function me(e){return(e&e-1)===0}function ee(e,n){const t=e.createTexture();e.bindTexture(e.TEXTURE_2D,t);const o=0,i=e.RGBA,r=1,c=1,m=0,g=e.RGBA,l=e.UNSIGNED_BYTE,u=new Uint8Array([0,0,255,255]);e.texImage2D(e.TEXTURE_2D,o,i,r,c,m,g,l,u);const s=new Image;return s.crossOrigin="anonymous",s.src=n,s.onload=()=>{e.bindTexture(e.TEXTURE_2D,t),e.texImage2D(e.TEXTURE_2D,o,i,g,l,s),me(s.width)&&me(s.height)?e.generateMipmap(e.TEXTURE_2D):(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST)),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0)},t}let v=[[],[],[],[]],Le,b=0,te=0,D=!1,w=25,M=!1,P=100,Q=[],k=!1,J=!1,_=new Je({workers:1,quality:10,width:256,height:256,workerScript:"/my-graphics-demos/gif/gif.worker.js"}),G=15;function it(){const e=document.querySelector("#gl-canvas"),n=e.getContext("webgl");if(Le=n,n===null){alert("Unable to initialize WebGL. Your browser or machine may not support it.");return}n.clearColor(0,0,0,1),n.clear(n.COLOR_BUFFER_BIT);const t=nt(n,et,tt),o={program:t,attribLocations:{vertexPosition:n.getAttribLocation(t,"aVertexPosition"),textureCoord:n.getAttribLocation(t,"aTextureCoord")},uniformLocations:{projectionMatrix:n.getUniformLocation(t,"uProjectionMatrix"),modelViewMatrix:n.getUniformLocation(t,"uModelViewMatrix"),uSampler:n.getUniformLocation(t,"uSampler"),time:n.getUniformLocation(t,"time"),transitionTime:n.getUniformLocation(t,"transitionTime"),sequenceItemLength:n.getUniformLocation(t,"sequenceItemLength"),transitionType:n.getUniformLocation(t,"transitionType"),transitionFadeType:n.getUniformLocation(t,"transitionFadeType"),sequenceIndex:n.getUniformLocation(t,"sequenceIndex"),sequenceItemStartTime:n.getUniformLocation(t,"sequenceItemStartTime"),colorThreshold:n.getUniformLocation(t,"colorThreshold"),fadeInColorThreshold:n.getUniformLocation(t,"fadeInColorThreshold"),fadeInTransitionTime:n.getUniformLocation(t,"fadeInTransitionTime"),fadeInTransitionType:n.getUniformLocation(t,"fadeInTransitionType"),clipEffect:n.getUniformLocation(t,"clipEffect"),clipEffectIntensity:n.getUniformLocation(t,"clipEffectIntensity"),fractalX:n.getUniformLocation(t,"fractalX"),fractalY:n.getUniformLocation(t,"fractalY"),fractalInitialZoom:n.getUniformLocation(t,"fractalInitialZoom")}},i=Ne(n);ee(n,"/my-graphics-demos/ceiling1.png");const r=ee(n,"/my-graphics-demos/sky.png");v[0].push({name:"test2",texture:r,startTime:0,length:4,id:"0-0",transitionType:1,transitionTime:1,clipLayer:1,fadeInTransitionType:0,fadeInTransitionTime:1,transitionFadeType:!1,fractalInitialZoom:.0125,fractalX:-.95,fractalY:-.25,clipType:"image"}),O(),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!0),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),_.on("progress",function(m){console.warn("progress"),console.warn(m);let g=document.getElementById("viewport");if(g)g.style.background=`radial-gradient(circle at center, rgb(25, 255, 0) ${m*100}%, transparent ${100-m*100}%), url('/my-graphics-demos/uipamnel1.png') 100% center / cover`;else{let l=document.createElement("div");l.id="exportProgressBar",document.getElementById("viewport").appendChild(l)}}),_.on("error",function(m){let g=document.getElementById("errorPopup");if(g){g.style.display="block";let l=document.createElement(p);l.innerHTML=`An error has occured during export ${m.toString()}`,g.appendChild(l),setTimeout(()=>{g.innerHTML="",g.style.display="none"},5e3)}}),_.on("finished",function(m){let g=URL.createObjectURL(m),l=document.getElementById("downloadButton");l.href=g,l.download=`jakehsequencer${new Date(Date.now()).toISOString().replace(":","")}.gif`,l.click(),l.classList.remove("disabled"),J=!1,M=!1,k=!1,document.getElementById("sequencerStartStop").disabled=!1,document.getElementById("sequencerRestart").disabled=!1;let u=document.getElementById("errorPopup");if(u){u.style.display="block";let s=document.createElement("p"),E=document.createElement("div"),I=document.createElement("h1");E.className="popupHeader",I.innerHTML="SUCCESS",s.innerHTML="Your gif is ready!!! It should have started downloading. If not, click the download button.",E.appendChild(I),u.appendChild(E),u.appendChild(s),setTimeout(()=>{u.innerHTML="",u.style.display="none",document.getElementById("exportProgressBar").remove()},5e3)}});function c(m){m*=.001,D&&k==!1?(b=m-te,He()):k==!1&&(te=m),k==!1&&de(n,o,i,v,b),document.getElementById("timeValue").innerHTML=b.toFixed(4),M==!0?(M=!1,de(n,o,i,v,b),Q.length<P&&e.toBlob(g=>{Q.push(g),b=B()*(Q.length/P);const l=new Image;l.src=URL.createObjectURL(g),l.onload=()=>{let u=B()*1e3/P;_.addFrame(l,{delay:Math.round(u)}),M=!0}})):_.frames.length>=P&&J==!1&&k==!0&&(J=!0,console.warn("GIFF"),_.render()),requestAnimationFrame(c)}requestAnimationFrame(c)}it();function B(){let e=0;for(let n=0;n<Ee;n++){let t=0;if(v[n].length>0){for(let o=0;o<v[n].length;o++)t+=v[n][o].length;t>e&&(e=t)}}return e}function Ie(e){let n=0;for(let t=0;t<v[e].length;t++)n+=v[e][t].length;return n}function rt(){return document.getElementById("sequencerTimeline").offsetLeft}let ot=4,xe=1,h;function at(e,n,t,o){let i={name:e.name,texture:n,imgData:t,startTime:Ie(o),length:ot,id:`${o}-${v[o].length.valueOf()}`,transitionType:0,transitionTime:xe,transitionFadeType:!1,fractalInitialZoom:.0125,fractalX:-.95,fractalY:-.25,clipLayer:o+1,clipEffect:0,clipEffectIntensity:1,fadeInTransitionType:0,fadeInTransitionTime:1,clipType:"image"};v[o].push(i),console.warn(i),Ce(i),console.warn(v),document.getElementById("sequenceLengthValue").innerHTML=B().toFixed(4),P=G*B();let r=document.getElementById(`clipLayer${i.clipLayer}`),c=r.style.gridTemplateColumns.split(" ");c.push(`${i.length*w}px`),r.style.gridTemplateColumns=c.join(" ")}function U(e){X(e+1);let n=document.getElementById(`clipLayer${e+1}`),t=v[e];for(let i=0;i<t.length;i++){let r=v[e][i],c=v[e][i-1];if(c&&c.clipType!="gap"&&c.startTime+c.length<r.startTime){let m=r.startTime-(c.startTime+c.length);ie(e,i,m)}else c&&c.clipType=="gap"&&c.startTime+c.length>r.startTime?c.length=r.startTime-c.startTime:!c&&r.startTime>0&&ie(e,i,r.startTime)}for(let i=0;i<t.length;i++){let r=v[e][i];Ce(r)}t=v[e];let o=t.map(i=>i.length*w);console.warn(o),n.style.gridTemplateColumns=o.join("px ")+"px",document.getElementById("sequenceLengthValue").innerHTML=B().toFixed(4)}function O(){console.warn("sequence update"),console.warn(v),lt();for(let e=0;e<Ee;e++)v[e].length>0&&U(e)}function lt(){let e=document.getElementById("timelineRuler");e.innerHTML="";let n=e.offsetWidth,t=n/w;console.warn(`${n} / ${w}`),console.warn(t);for(let o=0;o<t;o++){let i=document.createElement("div");if(i.className="sequenceTimelineRulerTick",i.style.left=o*w+10,o%5==0){let r=document.createElement("p");r.innerHTML=o.toString(),i.appendChild(r)}e.appendChild(i),console.warn("tick added")}}function Ce(e,n=!1){let t=document.createElement("div"),o=document.getElementById(`clipLayer${e.clipLayer}`);if(e.clipType=="image"){let i=document.createElement("div"),r=document.createElement("img"),c=document.createElement("p");t.className="sequenceItemPlaceholder",t.style.background=`linear-gradient(to right, rgb(0, 255, 13) ${(e.length-e.transitionTime)/e.length*100}%, rgb(41, 0, 79))`,c.innerHTML=e.name,c.className="sequenceItemName",r.className="sequenceThumbnail",t.id=e.id,i.className="clipNameThumbContainer",i.appendChild(c),i.appendChild(r),t.appendChild(i);let m=document.createElement("div");document.createElement("div"),m.className="lengthController",m.id=`${t.id}-lengthController`,m.addEventListener("touchstart",l=>l.preventDefault()),m.addEventListener("pointerdown",st),i.addEventListener("pointerdown",ct),i.addEventListener("touchstart",l=>l.preventDefault());let g=+e.id.split("-")[1];t.style.gridColumn=g+1,t.appendChild(m),o.appendChild(t),t.addEventListener("click",pt)}else{t.className="gapPlaceholder",t.id=e.id;let i=+e.id.split("-")[1];t.style.gridColumn=i+1,o.appendChild(t)}}let re=!1,N=!1,A=!1,H=!1,oe=-1,we=0,Se=0,x=0,ne=0,z=0,be=0,S,C;function st(e){for(console.warn("STARTING RESIZE"),re=!0,we=e.clientX,S=e.target;S.className.includes("sequenceItemPlaceholder")==!1;)S=S.parentElement;let t=S.id.split("-"),o=t[0],i=t[1],r=v[o][i];ke(`${o}-${i}`),document.getElementById(`${o}-${i}`),document.getElementById(`clipLayer#${+o+1}`),be=r.length*w}function ct(e){for(console.warn("STARTING MOVE"),N=!0,Se=e.clientX,C=e.target;C.id.includes("-")==!1;)C=C.parentElement;let n=+C.id.split("-")[1],t=+C.id.split("-")[0];ke(`${t}-${n}`);let o=v[t][n],i=v[t][n-1];i&&i.clipType=="gap"&&(ne=+document.getElementById(`clipLayer${t+1}`).style.gridTemplateColumns.split(" ")[n-1].replace("px",""),oe=i.length+i.startTime),z=o.startTime,console.warn(`initial clip start: ${z}`),console.warn(`initial gap width: ${ne}`)}function ie(e,n,t=.01){let o=v[e][n],i={name:"gap",startTime:t!=.01?o.startTime-t:o.startTime,length:t,id:`${e}-${n}`,transitionType:0,transitionTime:xe,clipLayer:e+1,clipEffect:0,clipEffectIntensity:1,fadeInTransitionType:0,fadeInTransitionTime:0,clipType:"gap"};v[e].splice(n,0,i);for(let r=n+1;r<v[e].length;r++)r!=n+1&&(v[e][r].startTime+=t),v[e][r].id=`${e}-${r}`;t==.01&&U(e)}document.addEventListener("pointermove",function(e){let n=e.clientX;if(re==!0&&S&&e.target.id.includes("-")&&e.target.id.split("-").length==3){let t=S.id.split("-");console.warn(t);let o=+t[0],i=+t[1];v[o][i];let c=(n-we+be)/w;Ue(c),Ae(c),U(o)}else if(N&&C){let t=+C.id.split("-")[1],o=+C.id.split("-")[0];H==!0&&(t+=1);let i=v[o][t];x=(n-Se)/w;let r=v[o][t-1];console.warn(x),v[o].length>=1&&x>0&&x+z>oe&&(console.warn(x),r&&r.clipType=="gap"&&(A=!0),A==!0&&r?(i.startTime=x+.01+z,H==!0?r.length=x:r.length=x+ne/w,console.warn("updating layer"),U(o)):A==!1&&(console.warn("inserting gap"),ie(o,t),H=!0,A=!0,i.startTime=x+.01)),De(i.startTime)}});document.addEventListener("pointerup",function(e){if(S&&(console.warn("completing resize"),re=!1,S=void 0,h=void 0),C&&N==!0){N=!1,A=!1,H=!1;let n=h.id.split("-");$e(h.clipLayer-1,n[1],x),C=void 0,x=0,oe=-1,console.warn("MOVE COMPLETE")}});function ut(e){let n=e.target.value;console.warn(e.target.value),h.transitionType=+e.target.value,Be(n)}function Be(e){let n=document.getElementById("transitionStyleInputSection");if(ft(),e==4){let t=document.createElement("p");t.id="colorThresholdInputLabel",t.innerHTML="threshold color";let o=document.createElement("input");o.type="color",o.id="colorThresholdPicker",o.addEventListener("change",function(i){console.warn(i.target.value);let r=i.target.value,c=Pe(r);h.colorThreshold=c,console.warn(h.colorThreshold)}),n.appendChild(t),n.appendChild(o)}else if(e==6){let t=document.createElement("p");t.id="fractalFadeTypeInputLabel",t.innerHTML="Fade to black?";let o=document.createElement("input");o.type="checkbox",o.id="fadeTypeInput",o.value=h.transitionFadeType;let i=document.createElement("div"),r=document.createElement("input");r.type="number",r.id="fractalXInput",r.value=h.fractalX;let c=document.createElement("input");c.type="number",c.id="fractalYInput",c.value=h.fractalY,i.appendChild(r),i.appendChild(c);let m=document.createElement("input");m.type="number",m.id="fractalZoomInput",m.value=h.fractalInitialZoom,n.appendChild(i),n.appendChild(m),o.addEventListener("change",function(g){h.transitionFadeType=g.target.checked}),r.addEventListener("change",function(g){h.fractalX=g.target.value}),c.addEventListener("change",function(g){h.fractalY=g.target.value}),m.addEventListener("change",function(g){h.fractalInitialZoom=g.target.value}),n.appendChild(t),n.appendChild(o)}}function _e(){let e=document.getElementById("fadeInStyleSection"),n=document.createElement("p");n.id="fadeInColorThresholdInputLabel",n.innerHTML="threshold color";let t=document.createElement("input");t.type="color",t.id="fadeInColorThresholdPicker",t.addEventListener("change",function(o){console.warn(o.target.value);let i=o.target.value,r=Pe(i);h.fadeInColorThresholdolorThreshold=r,console.warn(h.colorThreshold)}),e.appendChild(n),e.appendChild(t)}function dt(){let e=document.getElementById("fadeInStyleSection");e.innerHTML=""}function Pe(e){let n=e.replace("#",""),t=parseInt(n.substring(0,2),16),o=parseInt(n.substring(2,4),16),i=parseInt(n.substring(4,6),16);return[t/255,o/255,i/255]}function Fe(e,n,t){return"#"+(1<<24|e<<16|n<<8|t).toString(16).slice(1)}function ft(){let e=document.getElementById("transitionStyleInputSection");e.innerHTML=""}function pt(e){h&&document.getElementById(`${h.id}`).classList.remove("selected"),Re();let n=e.target.id,t=e.target;for(;!n||n&&n.includes("-")==!1;)n=t.parentElement.id,t=t.parentElement,console.warn(n);let o=0,i=0;if(n.includes("-")==!0&&n.split("-").length==2){let r=n.split("-");o=+r[0],i=+r[1],h=v[o][i],document.getElementById(`${n}`).classList.add("selected"),Me(h)}}function ke(e){Re();let n=e,t=0,o=0;if(n.includes("-")==!0&&n.split("-").length==2){let i=n.split("-");t=+i[0],o=+i[1],h=v[t][o],document.getElementById(`${n}`).classList.add("selected"),Me(h)}}function Re(){h&&document.getElementById(`${h.id}`).classList.remove("selected"),h=void 0;for(let e=0;e<5;e++){let n=document.getElementById(`clipLayer${e+1}`);for(const t of n.children)t.classList.remove("selected")}}function Me(e){var n,t;(n=document.getElementById("colorThresholdInputLabel"))==null||n.remove(),(t=document.getElementById("colorThresholdPicker"))==null||t.remove(),mt(e.name),Ae(e.length),ht(e.transitionType),Be(e.transitionType),gt(e.transitionTime),De(e.startTime),vt(e.clipLayer),Tt(e.fadeInTransitionType),Et(e.clipEffect),yt(e.fadeInTransitionTime),e.colorThreshold&&It(e.colorThreshold),e.fadeInTransitionType==4&&e.fadeInColorThreshold&&xt(e.colorThreshold)}function mt(e){document.getElementById("clipNameLabel").innerHTML=e}function Ae(e){document.getElementById("clipLengthInput").value=+e}function ht(e){document.getElementById("transitionSelectionInput").value=e}function gt(e){document.getElementById("transitionLengthInput").value=e}function De(e){document.getElementById("clipStartTimeInput").value=e}function vt(e){document.getElementById("clipLayerSelection").value=e}function Ue(e){let n=e-h.length;h.length=e;let t=+h.id.split("-")[1];$e(h.clipLayer-1,t,n)}function yt(e){document.getElementById("fadeInLengthInput").value=e}function Tt(e){document.getElementById("fadeInSelectionInput").value=e}function Et(e){document.getElementById("clipEffectInput").value=e,e>0?We():Oe()}function Oe(){let e=document.getElementById("clipEffectParameterSection");e.innerHTML=""}function We(){let e=document.getElementById("clipEffectParameterSection");if(e.innerHTML)return;let n=document.createElement("p");n.innerHTML="Effect Intensity";let t=document.createElement("input");t.id="clipEffectIntensitySlider",t.type="range",t.value=h.clipEffectIntensity,t.step=.25,t.max=10,t.min=-10,t.addEventListener("input",function(i){let r=document.getElementById("clipEffectIntensityInput");r.value=+i.target.value,Lt(+i.target.value)});let o=document.createElement("input");o.id="clipEffectIntensityInput",o.type="number",o.value=h.clipEffectIntensity,e.appendChild(n),e.appendChild(t),e.appendChild(o)}function Lt(e){h.clipEffectIntensity=e}function It(e){console.warn(e);let n=Fe(Math.round(e[0]*255),Math.round(e[1]*255),Math.round(e[2]*255));console.warn(n),document.getElementById("colorThresholdPicker").value=n}function xt(e){document.getElementById("fadeInStyleSection").innerHTML||_e(),console.warn(e);let t=Fe(Math.round(e[0]*255),Math.round(e[1]*255),Math.round(e[2]*255));console.warn(t),document.getElementById("fadeInColorThresholdPicker").value=t}function $e(e,n,t){console.warn(`updating start times on ${e}`);let o=v[e];if(o.length>0)for(let i=0;i<o.length;i++)i>n&&(o[i].startTime+=t);console.warn("start times fixed"),console.warn(o)}function Ct(e,n){let t=v[e][n-1],o=v[e][n+1],i=v[e].length,r=v[e].splice(n,1);if(o&&o.clipType=="gap"&&t&&t.clipType=="gap"){let c=+o.id.split("-")[1],m=+t.id.split("-")[1];c>=i-1?v[e].splice(m,2):(v[e].splice(c-1,2),t.length+=o.length)}for(let c=n;c<v[e].length;c++)v[e][c].startTime-=r[0].length,v[e][c].id=`${e}-${c}`;return r[0]}function wt(e,n){let t=v[e];n.id=`${e}-${t.length}`,n.startTime=Ie(e),t.push(n)}function He(){document.getElementById("sequenceMarker").style.left=30+b*w+rt()}function X(e){document.getElementById(`clipLayer${e}`).innerHTML=""}function St(){b=0,He(),D=!1,k=!0,document.querySelector("#gl-canvas"),B(),M=!0,document.getElementById("sequencerStartStop").disabled=!0,document.getElementById("sequencerRestart").disabled=!0}document.getElementById("sequenceItemInput").addEventListener("change",function(e){let n=e.target.files[0];var t=new FileReader;t.addEventListener("load",function(o){const i=ee(Le,o.target.result);at(n,i,o.target.result,0)}),n&&t.readAsDataURL(n)});document.getElementById("sequencerStartStop").addEventListener("click",function(e){D=!D,D?e.target.innerHTML="stop":e.target.innerHTML="play"});document.getElementById("sequencerRestart").addEventListener("click",function(e){te=b.valueOf()});document.getElementById("transitionSelectionInput").addEventListener("change",ut);document.getElementById("clipLengthInput").addEventListener("change",function(e){console.warn("updating length"),Ue(+e.target.value),h&&U(h.clipLayer-1)});document.getElementById("exportButton").addEventListener("click",function(e){St()});document.getElementById("timelineHorizontalScale").addEventListener("input",function(e){console.warn(e.target.value),w=+e.target.value,X(1),O()});document.getElementById("removeClipButton").addEventListener("click",function(e){v[h.clipLayer-1].splice(+h.id.split("-")[1],1),h=void 0,X(1),O(),P=G*B()});document.getElementById("frameRateInput").addEventListener("change",function(e){G=+e.target.value,P=G*B()});document.getElementById("outputWidthInput").addEventListener("change",function(e){_.setOption("width",+event.target.value),document.getElementById("gl-canvas").style.width=`${e.target.value}px`});document.getElementById("viewportScale").addEventListener("input",function(e){document.getElementById("gl-canvas").style.width=`${+e.target.value*256}px`});document.getElementById("clipLayerSelection").addEventListener("change",function(e){if(h){let n=h.id.split("-"),t=+n[0],o=+n[1];console.warn(e),console.warn(e.target.value),h.clipLayer=+e.target.value,Ge();let i=Ct(t,o);wt(+e.target.value-1,i),O()}});document.getElementById("clipStartTimeInput").addEventListener("change",function(e){h&&(h.startTime=+e.target.value,Ge(),O())});document.getElementById("transitionLengthInput").addEventListener("change",function(e){h&&(h.transitionTime=+e.target.value)});document.getElementById("fadeInSelectionInput").addEventListener("change",function(e){h&&(h.fadeInTransitionType=+e.target.value,h.fadeInTransitionType==4?_e():dt())});document.getElementById("clipEffectInput").addEventListener("change",function(e){h&&(h.clipEffect=+e.target.value,h.clipEffect>0?We():Oe())});document.getElementById("fadeInLengthInput").addEventListener("change",function(e){h&&(h.fadeInTransitionTime=+e.target.value)});document.getElementById("timelineHelpButton").addEventListener("click",function(e){bt()});var ge;(ge=document.getElementById("closePopup1Button"))==null||ge.addEventListener("click",function(e){Bt()});document.getElementById("addImageHelpButton").addEventListener("click",function(e){_t()});var ve;(ve=document.getElementById("closePopup2Button"))==null||ve.addEventListener("click",function(e){Pt()});document.getElementById("clipSettingsHelpButton").addEventListener("click",function(e){Ft()});var ye;(ye=document.getElementById("closePopup3Button"))==null||ye.addEventListener("click",function(e){kt()});document.getElementById("renderSettingsHelpButton").addEventListener("click",function(e){Rt()});var Te;(Te=document.getElementById("closePopup4Button"))==null||Te.addEventListener("click",function(e){Mt()});document.getElementById("sequencerTimeline").addEventListener("scroll",function(e){document.getElementById("timelineRuler").style.top=`${window.visualViewport.offsetTop}px`});function bt(){document.getElementById("helpPopup1").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup1").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function Bt(){document.getElementById("helpPopup1").style.display="none",document.getElementById("popupGlass").style.display="none"}function _t(){document.getElementById("helpPopup2").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup2").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function Pt(){document.getElementById("helpPopup2").style.display="none",document.getElementById("popupGlass").style.display="none"}function Ft(){document.getElementById("helpPopup3").style.display="block",document.getElementById("popupGlass").style.display="block",document.getElementById("helpPopup3").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function kt(){document.getElementById("helpPopup3").style.display="none",document.getElementById("popupGlass").style.display="none"}function Rt(){document.getElementById("helpPopup4").style.display="block",document.getElementById("popupGlass").style.display="block",console.warn(window.scrollTop),document.getElementById("helpPopup4").style.top=`calc(${window.scrollY}px + 50%)`,document.getElementById("popupGlass").style.top=`calc(${window.scrollY}px + 50%)`}function Mt(){document.getElementById("helpPopup4").style.display="none",document.getElementById("popupGlass").style.display="none"}function Ge(){for(let e=1;e<5;e++)X(e)}var he=document.getElementById("sequencerTimeline");he.scrollTop=he.scrollHeight;
